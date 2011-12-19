steal('jquery/dom/route')
.then('steal/less').then('./pagina.less')
.then('video/navegador', 'video/player')

.then('jquery/controller','jquery/view/ejs')
    .then('./views/init.ejs', function($) {
/**
 * @class Video.Pagina
 */
$.Controller('Video.Pagina',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function() {
        steal.dev.log('inicializando Video.Pagina');

        // rutas
        $.route.ready(false);
        $.route(':tipo');
        // escuchar cambios en hash para actualizarTipo
        $.route.delegate('tipo', 'set', this.callback('tipoSeleccionado'));
        $.route.delegate('tipo', 'remove', this.callback('tipoSeleccionado'));

        // cargar estructura inicial de la página
		this.element.find('body').html("//video/pagina/views/init.ejs", {});

        // inicializar player
        this.element.find("#reproductor").video_player();

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
                .attr('href', $.route.url({'tipo': this.tipos_clip[i].slug})) // ver rutas
                .addClass(this.tipos_clip[i].slug)
                .text(this.tipos_clip[i].nombre_plural.toUpperCase());
            $('<li>').append(link).appendTo(menu_ul);
        }

        // Empezar a escuchar cambios en la ruta del hash
        // si no hay ningún tipo especificado, cambiar al primer tipo por default
        $.route.ready(true);
        if (!$.route.attr('tipo')) $.route.attr('tipo', this.tipos_clip[0].slug);
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
            $.route.attr('tipo', (tipo_slug_anterior && tipo_slug_anterior != '') ? tipo_slug_anterior : this.tipos_clip[0].slug);
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
    }
});

});