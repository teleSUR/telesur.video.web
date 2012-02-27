steal('jquery/dom/route', 'jquery/dom/cookie', 'jquery/lang/observe/delegate', 'mxui/layout/modal')
.then('steal/less').then('./pagina.less')

//.then({src: 'http://s7.addthis.com/js/250/addthis_widget.js#/pubid=ra-4f2d726c065de481&domready=1', packaged: false})

.then('video/navegador', 'video/player', 'video/buscador')

.then('jquery/controller','jquery/view/ejs', 'steal/html')
    .then('./views/init.ejs', function($) {
/**
 * @class Video.Pagina
 */
$.Controller('Video.Pagina',
/** @Static */
{
	defaults : {},

    vistas : {
        lista : {
            nombre : 'lista'
        },
        video : {
            nombre : 'video'
        },
        busqueda : {
            nombre : 'busqueda'
        }
    }
},
/** @Prototype */
{
	init : function() {
        steal.html.wait();
        steal.dev.log('inicializando Video.Pagina');

        this.idioma = 'es';

        // cargar estructura inicial de la página
        this.element.find('body').html("//video/pagina/views/init.ejs", {});

        // rutas
        $.route(':idioma/:vista/:v1/:v2');
        $.route(':idioma/:vista/:v1');
        $.route(':idioma/:vista');
        $.route(':idioma');

        $.route.delegate('idioma', 'set', this.callback('idiomaSeleccionado'));
        $.route.delegate('vista', 'set', this.callback('vistaSeleccionada'));
        $.route.delegate('v1', 'set', this.callback('v1Callback'));

        $.route.ready(true);

        if (!$.route.attr('idioma')) {
           var idioma = $.cookie('idioma') || 'es';
           $.route.attrs({'idioma': idioma});
           location.hash = $.route.url({'idioma': idioma});
        }

        $.route.ready(false);



        if (!$.route.attr('vista')) {
            //alert('mi '+$.route.attrs().toSource());
//            location.hash = $.route.url({idioma: $.route.attr('idioma'), 'vista': 'lista' });
            $.route.attrs({idioma: $.route.attr('idioma'), 'vista': 'lista' });
            //alert('aaa' + $.route.attrs().toSource());
        }


      //  alert($.route.attr('idioma'));
        //$.route.bind('change', this.callback('navegacionCambiada'));
	},

    idiomaSeleccionado : function(el, val, oldVal) {
        this.idioma = val;
        $('#idioma input[name="'+val+'"]').attr('checked', 'checked').siblings('input:radio').removeAttr('checked');
        $('#idioma label[for="idioma_'+val+'"]').addClass('seleccionado').siblings('label').removeClass('seleccionado');
    },

//    navegacionCambiada :  function( ev, attr, how, nevVal, oldVal ) {
//        if (attr == 'vista') {
//           // alert('se cambia vista');
//        }
//        else if (attr = 'v1') {
//            //alert('se cambia v1');
//        }
//    },

    busquedaSolicitada : function(btn) {
        var consulta = $('#buscador input').val();
        location.hash = $.route.url({vista: 'lista', v1: 'busqueda', v2: consulta });
//        $.route.attrs({vista: 'lista', v1: 'busqueda', v2: consulta });
        //$.route.attrs({vista: 'lista', v1: 'busqueda', v2: consulta })
    },

    v1Callback : function(ev, val, oldval){
        switch ($.route.attr('vista')){
            case this.constructor.vistas.lista.nombre:
//            case this.constructor.vistas.busqueda.nombre:
                var det = this.element.find('.video_detalle');
                if (det) {
                    this.element.find('#navegador, #lado').each(function() { $(this).css({opacity: 1}) });
                    det.fadeOut(function() { $(this).remove() });
                }
                return this.tipoSeleccionado(ev, val, oldval);
                break;

            case this.constructor.vistas.video.nombre:
//                this.element.find('#navegador, #lado').each(function() { $(this).css({opacity: 0.45}) });
                this.element.find('#navegador').each(function() { $(this).css({opacity: 0.45}) });
                return this.videoSeleccionado(ev, val, oldval);

//            case this.constructor.vistas.busqueda.nombre:
//                this.element.find('#navegador, #lado').each(function() { $(this).css({opacity: 0.3}) });
//                return this.videoSeleccionado(ev, val, oldval);
        }
    },

    vistaSeleccionada : function(ev, vista, vista_anterior) {
        if (!vista) return;

        // inicializar player
        this.element.find("#reproductor").video_player();

        switch (vista) {
            case this.constructor.vistas.lista.nombre:
            default:
                //$.route.attr('vista', this.constructor.vistas.lista.nombre);


                this.element.find("#publicidad").show();

                if (!$.cookie('idioma')) {
                    var that = this;
                    setTimeout(function() { that.toggleMenuIdioma() }, 1250);
                }

                if (!$('#reproductor').controller().clip_cargado) {
                    Video.Models.Clip.findAll({detalle: 'completo', 'idioma': this.idioma, ultimo:1, tipo:'noticia'}, function(clips) {
                        // cargar el primr clip al reporductor
                        if ($('#reproductor')) $('#reproductor').controller().cambiarClip(clips[0], true);
                        $('.video_models_clip_' + clips[0].slug).addClass('seleccionado');
                    });
                }

                break;

            case this.constructor.vistas.video.nombre:

                if ($('#navegador').controller()) {
                    //alert('desde controlador, link, no inicio');
                   // $.route.ready(true);
//                   $('<div />').hide().video_detalle({clip: $.route.attr('v1')}).appendTo(this.element);
                   // return;
                }

                // alert($.route.attr('slug') + '1');

                break;
            case 'busqueda':

                alert('busqueda');
                break;
        }

         // inicializar buscador
        this.element.find("#buscador").video_buscador();
        this.bind($('#buscador button'), 'click', this.callback('busquedaSolicitada'));

        // crear e intentar poblar store de cookie para tipos de clip
//        this.tipos_clip = new Video.Models.TipoClip.CookieList([]).retrieve("tipos_clip");
        // solicitar tipos en caso de que no estén en cache
        // en cualquier caso el control pasa a this.tiposRecibidos
//        if (this.tipos_clip.length > 0) {
//            steal.dev.log('usando tipos de store en cookie');
//            this.tiposRecibidos();
//        } else {
//            steal.dev.log('sin tipos en store de cookie, solicitando a servicio');
//            var self = this;
//            Video.Models.TipoClip.findAll({}, function(tipos) {
//                steal.dev.log('añadiendo tipos recibidos a store de cookie');
////                self.tipos_clip = new Video.Models.TipoClip.CookieList(tipos).store("tipos_clip");
//                self.tipos_clip = tipos;
//                self.tiposRecibidos();
//            });
//        }

        if ($(document).controller().idioma == 'es') {
            this.tipos_clip = [
                new Video.Models.TipoClip({ slug: 'noticia', nombre_plural: 'noticias'}),
                new Video.Models.TipoClip({ slug: 'entrevista', nombre_plural: 'entrevistas'}),
                new Video.Models.TipoClip({ slug: 'programa', nombre_plural: 'programas'}),
                new Video.Models.TipoClip({ slug: 'reportaje', nombre_plural: 'reportajes'}),
                new Video.Models.TipoClip({ slug: 'documental', nombre_plural: 'documentales'})
            ];
        } else if ($(document).controller().idioma == 'en') {
            this.tipos_clip = [
                new Video.Models.TipoClip({ slug: 'noticia', nombre_plural: 'news'}),
                new Video.Models.TipoClip({ slug: 'entrevista', nombre_plural: 'interviews'}),
//                new Video.Models.TipoClip({ slug: 'programa', nombre_plural: 'shows'}),
                new Video.Models.TipoClip({ slug: 'reportaje', nombre_plural: 'reports'})
//                new Video.Models.TipoClip({ slug: 'documental', nombre_plural: 'documentaries'})
            ];
        } else if ($(document).controller().idioma == 'pt') {
            this.tipos_clip = [
                new Video.Models.TipoClip({ slug: 'noticia', nombre_plural: 'notícias'}),
                new Video.Models.TipoClip({ slug: 'entrevista', nombre_plural: 'entrevistas'}),
                new Video.Models.TipoClip({ slug: 'programa', nombre_plural: 'programas'}),
                new Video.Models.TipoClip({ slug: 'reportaje', nombre_plural: 'reportagens'}),
                new Video.Models.TipoClip({ slug: 'documental', nombre_plural: 'documentários'})
            ];
        }
        this.tiposRecibidos();
    },

    videoSeleccionado : function(ev, slug, slug_anterior) {
        //alert('se seleccionó con slug' + $.route.attr('slug'));
        var that = this;
        Video.Models.Clip.findOne({idioma: this.idioma, detalle: 'completo', id: slug}, function(clips) {

            var detalle = $('<div />').hide().video_detalle({clip: clips[0]}).appendTo(that.element.find('#pagina')).fadeIn(function() {
                $('#reproductor').controller().maximizar();
            }).trigger('show');

            //that.element.find('#navegador').html(clip[0].titulo + '<img src="'+ clip[0].thumbnail_grande +'" />');
        })
    },

    /**
     * Se llama después de haber recibido lista de modelos TipoClip en this.tipos_clip, ya sea desde cache o servicio
     * Dibuja el menú de tipos de contenido y finalmente si no hay una ruta especificada en el hash, pone la primera
     */
    tiposRecibidos : function() {
        // poblar menú principal de tipos
        var menu_ul = $('#menu_tipos ul');
        menu_ul.empty();
        for (var i=0, link; i<this.tipos_clip.length; i++) {
            link = $('<a>').model(this.tipos_clip[i])
                .attr('href', $.route.url({idioma: $(document).controller().idioma, vista: this.constructor.vistas.lista.nombre, v1: this.tipos_clip[i].slug})) // ver rutas
                .addClass(this.tipos_clip[i].slug)
                .text(this.tipos_clip[i].nombre_plural.toUpperCase());
            $('<li>').append(link).appendTo(menu_ul);
        }

        // Empezar a escuchar cambios en la ruta del hash
        // si no hay ningún tipo especificado, cambiar al primer tipo por default

        if (!$.route.attr('v1')) {
            //location.hash = $.route.url({idioma: $(document).controller().idioma, vista: this.constructor.vistas.lista.nombre, v1: this.tipos_clip[0].slug});
            $.route.attrs({idioma: $(document).controller().idioma, vista: this.constructor.vistas.lista.nombre, v1: this.tipos_clip[0].slug});
        } else {
            $.route.ready(true);
        }

        // mostrar menú idiomas
    },

    toggleMenuIdioma : function() {
        if ($('#idioma').is(':visible')) {
            $('#idioma').slideUp('slow');
            $('#centro').animate({'padding-top': '-=50px'}, 'slow');
            $('#lado').animate({'padding-top': '-=50px'}, 'slow');
            $('.video_detalle').animate({'padding-top': '-=50px'}, 'slow');
        } else {
            $('#idioma').slideDown('slow');
            $('#centro').animate({'padding-top': '+=50px'}, 'slow');
            $('#lado').animate({'padding-top': '+=50px'}, 'slow');
            $('.video_detalle').animate({'padding-top': '+=50px'}, 'slow');
        }
    },

    '#idiomas_area click' : function() {
        this.toggleMenuIdioma();
    },

    /**
     * Acción de seleccionar una opción del menú de tipos de contenido.
     * Se asegura de que se haya elegido una opción válida, de no ser así se selecciona la primera opción válida
     * Si aún no existe un controlador para el navegador, se crea uno nuevo con el tipo seleccionado,
     * si ya existe el controlador, sólo se actualiza con el nuevo tipo.
     * @param ev
     * @param tipo
     * @param tipoAnterior
     */
    tipoSeleccionado : function(ev, tipo_slug, tipo_slug_anterior) {
        if (!tipo_slug) return;

        $('#reproductor').controller().minimizar();

        this.tipo_slug = tipo_slug;
        var tipo;

        if (tipo_slug == 'busqueda') {
            tipo = tipo_slug;

        } else {
            // referencia al link del menú para el slug
            var tipo_link = $('#menu_tipos a.'+tipo_slug);

            // si se solicitó un tipo inválido entonces usar el tipo anteiror, o bien si no hay, usar el primer tipo como default
           if (!tipo_link.length > 0) {
                $.route.attrs({ vista : this.constructor.vistas.lista.nombre, v1 : (tipo_slug_anterior && tipo_slug_anterior != '') ? tipo_slug_anterior : this.tipos_clip[0].slug });
                return;
            }
            // ajustar clases para marcar como seleccionado solo el link principal
            tipo_link.addClass('seleccionado').parent().siblings().find('a.seleccionado').removeClass('seleccionado');
            tipo = tipo_link.model();
        }

        // crear o actualizar controlador para navegador
        var div_navegador = this.element.find('#navegador');
        if (div_navegador.controller()) { // Controlador ya existe, actualizar
            steal.dev.log('por actualizar controlador de navegador para tipo: '+ tipo_slug);
            div_navegador.controller().cambiarTipo(tipo);
        } else { // No existe contorlador, çrear nuevo
            steal.dev.log('por crear controlador para navegador por primera vez para tipo: '+ tipo_slug);
            div_navegador.video_navegador({tipo_clip: tipo});
        }
    },

    '#idioma input click': function(el, ev) {
        this.toggleMenuIdioma();
        var idioma = $(el).attr('name');
        $.cookie('idioma', idioma);

        if (this.idioma != idioma) {
            location.hash = '#!' + idioma;
            location.reload();
        }

    }


});

});
