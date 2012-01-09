steal('steal/less').then('./clip.less');

steal( 'jquery/controller','jquery/view/ejs', 'jquery/dom/route' )
	.then( './views/init.ejs', function($){

/**
 * @class Video.Clip
 */
$.Controller('Video.Clip',
/** @Static */
{
	defaults : {
        clip : null
    },

    /* para redefinir en sitios */
    clip_template: "//video/clip/views/init.ejs"
},
/** @Prototype */
{
	init : function(){
        this.element.addClass('cargando');
        this.tipo_clip = $("#navegador").controller().options.tipo_clip;
        this.modo = $("#navegador").controller().options.modo;

        // Cargar HTML
		this.element.html(this.constructor.clip_template, { clip: this.options.clip });

        // agregar clase con el tipo de clip
        this.element.addClass(this.tipo_clip.slug);

        if (this.tipo_clip.slug == 'programa') {
            this.element.find('.tiempo').html(this.options.clip.getFechaTexto());
            // TODO: agregar logo de programa
        } else {
            this.element.find('.tiempo').html(this.options.clip.getFirmaTiempo());
        }

        //$.route.delegate(this.options.clip.slug, 'set', this.callback('clipSeleccionado'));

        this.element.removeClass('cargando');

        if ($('#reproductor').controller().clip && $('#reproductor').controller().clip.slug == this.options.clip.slug) {
            this.element.addClass('seleccionado');
        }
	},

	'img click' : function(el, ev) {
        ev.preventDefault();

        // cargar thumbnail de mejor calidad
        $(el).attr('src', this.options.clip.thumbnail_mediano);

        this.clipSeleccionado();
//        var vid_attr = $.route.attr('vid');
//        if (vid_attr) {
//            $.route.removeAttr(vid_attr);
//        }
//
//        var attrs = {};
//        attrs[this.options.clip.slug] = 1;
//        attrs['vid'] = this.options.clip.slug;
//
//        $.route.attrs(attrs);
    },

    clipSeleccionado : function() {
        var that = this;
        $('.video_clip').removeClass('seleccionado');
        this.element.addClass('seleccionado');

        $('#reproductor').controller().cambiarClip(this.options.clip);
	}

})

});