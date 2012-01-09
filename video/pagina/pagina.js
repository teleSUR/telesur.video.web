steal('jquery/dom/route')
.then('steal/less').then('./pagina.less')

.then('video/navegador', 'video/player', 'video/buscador')

.then('jquery/controller','jquery/view/ejs')
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
        steal.dev.log('inicializando Video.Pagina');

        // cargar estructura inicial de la página
        //this.element.find('body').html("//video/pagina/views/init.ejs", {});

        // rutas
        $.route(':vista', { vista: this.constructor.vistas.lista.nombre });
        $.route(':vista/:v1/:v2');
        $.route(':vista/:v1');

        $.route.delegate('vista', 'set', this.callback('vistaSeleccionada'));
        $.route.delegate('v1', 'set', this.callback('v1Callback'));
        //$.route.delegate('v1', 'remove', this.callback('v1Callback'));

        // Leer rutas y volver a posponerlas
        $.route.ready(true);$.route.ready(false);

        //$.route.bind('change', this.callback('navegacionCambiada'));
	},

//    navegacionCambiada :  function( ev, attr, how, nevVal, oldVal ) {
//        if (attr == 'vista') {
//           // alert('se cambia vista');
//        }
//        else if (attr = 'v1') {
//            //alert('se cambia v1');
//        }
//    },

    v1Callback : function(ev, val, oldval){
        switch ($.route.attr('vista')){
            case this.constructor.vistas.lista.nombre:
                return this.tipoSeleccionado(ev, val, oldval);
            case this.constructor.vistas.video.nombre:
                return this.videoSeleccionado(ev, val, oldval);
        }
    },

    vistaSeleccionada : function(ev, vista, vista_anterior) {
        if (!vista) return;

        //alert('nueva: ' +vista + ' y vieja: ' + vista_anterior);
        this.element.find('body').empty().html("//video/pagina/views/init.ejs", {});

        switch (vista) {
            case this.constructor.vistas.lista.nombre:
            default:
                //$.route.attr('vista', this.constructor.vistas.lista.nombre);

                // inicializar player
                this.element.find("#reproductor").video_player();

                // inicializar buscador
                this.element.find("#buscador").video_buscador();

                // crear e intentar poblar store de cookie para tipos de clip
                this.tipos_clip = new Video.Models.TipoClip.CookieList([]).retrieve("tipos_clip");
                // solicitar tipos en caso de que no estén en cache
                // en cualquier caso el control pasa a this.tiposRecibidos
                if (this.tipos_clip.length > 0) {
                    steal.dev.log('usando tipos de store en cookie');
                    this.tiposRecibidos();
                } else {
                    steal.dev.log('sin tipos en store de cookie, solicitando a servicio');
                    var self = this;
                    Video.Models.TipoClip.findAll({}, function(tipos) {
                        steal.dev.log('añadiendo tipos recibidos a store de cookie');
                        self.tipos_clip = new Video.Models.TipoClip.CookieList(tipos).store("tipos_clip");
                        self.tiposRecibidos();
                    });
                }

                break;

            case this.constructor.vistas.video.nombre:

                // alert($.route.attr('slug'));
                $.route.ready(true);
                // alert($.route.attr('slug') + '1');

                break;
            case 'busqueda':

                alert('busqueda');
                break;
        }
    },

    videoSeleccionado : function(ev, slug, slug_anterior) {
        //alert('se seleccionó con slug' + $.route.attr('slug'));
        var that = this;
        Video.Models.Clip.findOne({id: slug}, function(clip) {
            that.element.find('#navegador').html(clip[0].titulo + '<img src="'+ clip[0].thumbnail_grande +'" />');
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
                .attr('href', $.route.url({vista: this.constructor.vistas.lista.nombre, v1: this.tipos_clip[i].slug})) // ver rutas
                .addClass(this.tipos_clip[i].slug)
                .text(this.tipos_clip[i].nombre_plural.toUpperCase());
            $('<li>').append(link).appendTo(menu_ul);
        }

        // Empezar a escuchar cambios en la ruta del hash
        // si no hay ningún tipo especificado, cambiar al primer tipo por default
        $.route.ready(true);
        if (!$.route.attr('v1')) $.route.attrs({vista: this.constructor.vistas.lista.nombre, v1: this.tipos_clip[0].slug});

        // mostrar menú idiomas
        setTimeout(function() {
            $('#idioma').slideDown('slow');
            $('#centro').animate({'padding-top': '+=50px'}, 'slow');
            $('#lado').animate({'padding-top': '+=50px'}, 'slow');
        }, 3500)

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
        // referencia al link del menú para el slug
        var tipo_link = $('#menu_tipos a.'+tipo_slug);

        // si se solicitó un tipo inválido entonces usar el tipo anteiror, o bien si no hay, usar el primer tipo como default
       if (!tipo_link.length > 0) {
            $.route.attrs({ vista : this.constructor.vistas.lista.nombre, v1 : (tipo_slug_anterior && tipo_slug_anterior != '') ? tipo_slug_anterior : this.tipos_clip[0].slug });
            return;
        }

        // ajustar clases para marcar como seleccionado solo el link principal
        tipo_link.addClass('seleccionado').parent().siblings().find('a.seleccionado').removeClass('seleccionado');

        // crear o actualizar controlador para navegador
        var div_navegador = this.element.find('#navegador');
        if (div_navegador.controller()) { // Controlador ya existe, actualizar
            steal.dev.log('por actualizar controlador de navegador para tipo: '+ tipo_slug);
            div_navegador.controller().cambiarTipo(tipo_link.model());
        } else { // No existe contorlador, çrear nuevo
            steal.dev.log('por crear controlador para navegador por primera vez para tipo: '+ tipo_slug);
            div_navegador.video_navegador({tipo_clip: tipo_link.model()});
        }
    },

    '#idioma input click': function() {
        $('#idioma').slideUp();
        $('#centro').animate({'padding-top': '-=50px'});
        $('#lado').animate({'padding-top': '-=50px'});
    }


});

});