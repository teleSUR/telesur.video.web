steal('steal/less').then('./grupo.less')

.then('video/clip/admin_clip.js')

.then('jquery/controller','jquery/view/ejs')
	.then( './views/init.ejs', function($){
/**
 * @class Video.Grupo
 */
$.Controller('Video.Grupo',
/** @Static */
{
	defaults : {
        numClipsPorFila: 3,
        numFilasAlVerMas : 1,
        numFilasCache: 1,
        numFilasMostradasDefault: 1,
        numFilasMaximo: 2,
        params: { },
        titulo: ''
    },

    listensTo: ['show'],

    paramsDefault : { detalle: 'basico' },

    alturaFile : 165

},
/** @Prototype */
{
    'init': function() {

        if (['hoy', 'today', 'latinoamérica', 'latin america'].indexOf(this.options.titulo.toLowerCase()) != -1) {
            this.options.numFilasMostradasDefault++;
            this.es_primero = true;
        } else {
            this.es_primero = false;
        }

        // inicializar ariables para paginación
        this.primeroMostradoDefault = 1;
        this.ultimoMostradoDefault = this.options.numFilasMostradasDefault * this.options.numClipsPorFila;
        this.primeroConsultadoDefault = this.primeroMostradoDefault;
        this.ultimoConsultadoDefault = this.ultimoMostradoDefault + (this.options.numFilasCache * this.options.numClipsPorFila);


        // configurar deferred
        this.deferred = $.Deferred();
        this.promise = this.deferred.promise();

        // Inicializar en estado de "cargando" (hasta que se llame show())
        this.element.addClass('cargando');
    },

	'show' : function(){
        this.enFinal = false;
        this.paginacion = {
            primeroMostrado : this.primeroMostradoDefault,
            ultimoMostrado : this.ultimoMostradoDefault,
            primeroConsultado : this.primeroConsultadoDefault,
            ultimoConsultado : this.ultimoConsultadoDefault,
            numFilasMostradas : this.options.numFilasMostradasDefault
        };


        // inicializar HTML
		this.element.html("//video/grupo/views/init.ejs", {});
        this.element.find('.paginacion').hide();
        this.element.find('.cabeza').html(this.options.titulo.toUpperCase());


        // altura inicial (número de filas)
        this.element.find('.clips').css('height', (this.constructor.alturaFile * this.options.numFilasMostradasDefault)  );

        // inicializar objeto de objeto de parámetros
        this.params = $.extend(this.options.params, this.constructor.paramsDefault);

        // solicitar clips para este grupo
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

        var clips_mostrados = clips.slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoMostrado);

        if (this.paginacion.numFilasMostradas >= this.options.numFilasMaximo) {
            // en número máximo de filas
            clips.animate({'margin-top': '+='+(this.options.numFilasAlVerMas * this.constructor.alturaFile)+'px', height:'-='+(this.options.numFilasAlVerMas * this.constructor.alturaFile)+'px'}, function() {
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

        var clips_mostrados = clips.slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoMostrado);

        if (this.paginacion.numFilasMostradas >= this.options.numFilasMaximo) {
            // en número máximo de filas
            var menos_link = this.element.find('.menos');
            clips.animate({'margin-top': '-='+(this.options.numFilasAlVerMas * this.constructor.alturaFile)+'px', height:'+='+(this.options.numFilasAlVerMas * this.constructor.alturaFile)+'px'}, function() {
                menos_link.show();
            });
        } else {
            // todavía no se alcanza el número máximo de filas
            this.paginacion.numFilasMostradas++;
            this.paginacion.primeroMostrado += this.options.numClipsPorFila;
            clips.animate({height:'+=' + (this.options.numFilasAlVerMas * this.constructor.alturaFile) + 'px'}, 'fast');
        }


        this.paginacion.ultimoMostrado += this.options.numClipsPorFila;

        this.paginacion.primeroConsultado = this.paginacion.ultimoMostrado + 1;
        this.paginacion.ultimoConsultado = this.paginacion.ultimoMostrado + (this.options.numFilasCache * this.options.numClipsPorFila);

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

        //Video.Models.Clip.findAll(this.params, this.callback('clipsRecibidos'));
        var api_request = Video.Models.Clip.getDeferredModels(this.params);
        $.when(api_request).then(this.callback('clipsRecibidos'));

        // no primer consulta, avanzar cache
        if (this.paginacion.ultimoMostrado > this.ultimoMostradoDefault) {
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
                if (this.paginacion.ultimoMostrado == this.ultimoMostradoDefault &&
                    this.paginacion.primeroMostrado == this.primeroMostradoDefault) {
                    steal.dev.log('clips recibidos en primer consulta, avanzando cache');

                    if (clips.length >= this.options.numClipsPorFila) {
                        // número esperado de clips recibidos, puede que todavía haya otra página, mostrar botón
                        this.element.find('.mas').slideDown();
                    }

                    this.avanzarCache();
                }
            } else {

                if (this.paginacion.numFilasMostradas == this.options.numFilasMostradasDefault) {
                    // primera vez, ningún clip para ese grupo
                    this.element.remove();
                    this.resolve();
                    $('#navegador').controller().mostrarMasGrupos(1);
                } else {
                    // se acabaron los clips para este grupo, pero sí hubo alguno
                    this.element.find('.mas').slideUp();
                }
            }
        }
    },

    resolve : function() {
        if (!this.deferred.isResolved() && !this.waiting) {
            var self = this;
            this.waiting = true;
            setTimeout(function() {
                if (self) {
                    //alert('sre');
                    self.deferred.resolve.apply(null);
                }
            }, 0);
        }
    },

    avanzarCache : function() {
        // TODO: SE LLAMA DOS VECES AL INICIO
        if (this && this.element) {
            var clips_divs = this.element.find('.clips').children();
            var clips_mostrados = clips_divs.slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoMostrado);

            this.element.find('.cabeza').show();
            this.resolve();

            //var clips_recordados = clips_divs.slice(this.paginacion.primeroMostrado-1, this.paginacion.ultimoConsultado-1);
            //clips_mostrados.show();

            //clips_divs.not(clips_mostrados).hide();
            //clips_divs.not(clips_recordados).remove();
        }
    }
})

});
