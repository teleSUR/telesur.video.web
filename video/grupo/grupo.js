steal('steal/less').then('./grupo.less');

steal('video/clip');

steal( 'jquery/controller','jquery/view/ejs' )
	.then( './views/init.ejs', function($){
/**
 * @class Video.Grupo
 */
$.Controller('Video.Grupo',
/** @Static */
{
	defaults : {},

    listensTo: ['show'],

    paramsDefault : {
        detalle: 'normal'
    },

    numClipsPorFila: 3,
    numFilasCache: 1,
    numFilasMostradasDefault: 1,

    numFilasDefault: 1,
    numFilasMaximo: 3,

    primeroMostradoDefault: 1,

    init : function() {
        this.ultimoMostradoDefault = this.numFilasDefault * this.numClipsPorFila;
        this.primeroConsultadoDefault = this.primeroMostradoDefault;
        this.ultimoConsultadoDefault = this.ultimoMostradoDefault + (this.numFilasCache * this.numClipsPorFila);
    }
},
/** @Prototype */
{
    'init': function() {
        this.element.addClass('cargando');
    },

	'show' : function(){
        this.enFinal = false;
        this.paginacion = {
            primeroMostrado : this.constructor.primeroMostradoDefault,
            ultimoMostrado : this.constructor.ultimoMostradoDefault,
            primeroConsultado : this.constructor.primeroConsultadoDefault,
            ultimoConsultado : this.constructor.ultimoConsultadoDefault,
            numFilasMostradas : this.constructor.numFilasMostradasDefault
        },

		this.element.html("//video/grupo/views/init.ejs", {});
        this.element.find('.paginacion').hide();

        // inicializar objeto de objeto de parámetros
        this.params = $.extend(this.options.params, this.constructor.paramsDefault);

        // Observar cambvios en la paginación

        this.element.find('.cabeza').html(this.options.titulo);

        this.element.find('.clips').css('height', '165px');

        this.solicitarClips();
	},

    'a.mas click' : function(el, ev) {
        ev.preventDefault();
        this.mostrarMas();

    },

    'a.menos click' : function(el, ev) {
        ev.preventDefault();
        this.mostrarMenos();

    },

    mostrarMenos : function() {
        var clips = this.element.find('.clips');

        var clips_mostrados = this.element.find('.clips').slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoMostrado);

        if (this.paginacion.numFilasMostradas >= this.constructor.numFilasMaximo) {
            // en número máximo de filas
            clips.animate({'margin-top': '+=165px', height:'-=165px'}, function() {
            });
        } else {
            // todavía no se alcanza el número máximo de filas
//
//            this.paginacion.numFilasMostradas++;
//            this.paginacion.primeroMostrado += this.constructor.numClipsPorFila;
//            clips.animate({height:'+=165px'}, 'fast');
        }


//        this.paginacion.ultimoMostrado -= this.constructor.numClipsPorFila;
//        this.paginacion.primeroMostrado -= this.constructor.numClipsPorFila;
//
//        this.paginacion.primeroConsultado = this.paginacion.primeroMostrado - (this.constructor.numFilasCache * this.constructor.numClipsPorFila);
//        this.paginacion.ultimoConsultado = this.paginacion.ultimoMostrado + (this.constructor.numFilasCache * this.constructor.numClipsPorFila);
//
//        if (this.enFinal) { // puede que haya más clips
//            this.element.find('.mas').hide('slide');
//        } else { // puede que haya más clips // ya no habrá más clips
//            this.solicitarClips();
//        }
    },

    mostrarMas : function() {
        var clips = this.element.find('.clips');

        var clips_mostrados = this.element.find('.clips').slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoMostrado);

        if (this.paginacion.numFilasMostradas >= this.constructor.numFilasMaximo) {
            // en número máximo de filas
            var menos_link = this.element.find('.menos');
            clips.animate({'margin-top': '-=165px', height:'+=165px'}, function() {
                menos_link.show();
            });
        } else {
            // todavía no se alcanza el número máximo de filas
            this.paginacion.numFilasMostradas++;
            this.paginacion.primeroMostrado += this.constructor.numClipsPorFila;
            clips.animate({height:'+=165px'}, 'fast');
        }


        this.paginacion.ultimoMostrado += this.constructor.numClipsPorFila;

        this.paginacion.primeroConsultado = this.paginacion.ultimoMostrado + 1;
        this.paginacion.ultimoConsultado = this.paginacion.ultimoMostrado + (this.constructor.numFilasCache * this.constructor.numClipsPorFila);

        if (this.enFinal) { // puede que haya más clips
            this.element.find('.mas').hide('slide');
        } else { // puede que haya más clips // ya no habrá más clips
            this.solicitarClips();
        }
    },

    solicitarClips : function() {
        this.params = $.extend(this.params, {
            primero: this.paginacion.primeroConsultado,
            ultimo: this.paginacion.ultimoConsultado
        });
        Video.Models.Clip.findAll(this.params, this.callback('clipsRecibidos'));

        // no primer consulta, avanzar cache
        if (this.paginacion.ultimoMostrado > this.constructor.ultimoMostradoDefault) {
            steal.dev.log('clips solicitados NO en primer consulta, avanzando cache');
            this.avanzarCache();
        }

    },

    clipsRecibidos : function(clips) {
        if (this && this.element) {
            this.element.removeClass('cargando');

            if (clips.length > 0) {
                // menos clips que los solicitados, ya no habrá más
                if (clips.length < this.paginacion.ultimoConsultado - this.paginacion.primeroConsultado + 1) {
                    this.enFinal = true;
                }

                var self = this;
                clips.each(function(i, clip) {
                    if (self.element) self.element.find('.clips').append($('<div>').video_clip({clip: clip}).model(clip));
                });
                this.avanzarCache();

                // Primer consulta
                if (this.paginacion.ultimoMostrado == this.constructor.ultimoMostradoDefault &&
                    this.paginacion.primeroMostrado == this.constructor.primeroMostradoDefault) {
                    steal.dev.log('clips recibidos en primer consulta, avanzando cache');

                    // número esperado de clips recibidos, puede que todavía haya otra página, mostrar botón
                    if (clips.length >= this.constructor.numClipsPorFila) {
                        this.element.find('.mas').slideDown();
                    }

                    this.avanzarCache();
                }
            } else { // primera vez, ningún clip para ese grupo
                if (this.paginacion.numFilasMostradas == this.constructor.numFilasMostradasDefault) {
                    this.element.remove();
                    $('#navegador').controller().mostrarMasGrupos(1);
                } else {
                    // se acabaron los clips para este grupo, pero sí hubo alguno
                    this.element.find('.mas').slideUp();
                }
            }
        }
    },

    avanzarCache : function() {
        if (this && this.element) {
            var clips_divs = this.element.find('.clips').children();
            var clips_mostrados = clips_divs.slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoMostrado);
            //var clips_recordados = clips_divs.slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoConsultado-1);
            //clips_mostrados.show();

            //clips_divs.not(clips_mostrados).hide();
            //clips_divs.not(clips_recordados).remove();
        }
    }
})

});