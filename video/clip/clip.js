steal('steal/less').then('./clip.less');

steal( 'jquery/controller','jquery/view/ejs', 'jquery/dom/route' )
	.then( './views/init.ejs', function($){

/**
 * @class Video.Clip
 */
$.Controller('Video.Clip',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
        this.element.addClass('cargando');

        //$.route.delegate(this.options.clip.slug, 'set', this.callback('clipSeleccionado'));

		this.element.html("//video/clip/views/init.ejs",{
			clip: this.options.clip
		});

        this.element.removeClass('cargando');

        if ($('#reproductor').controller().clip && $('#reproductor').controller().clip.slug == this.options.clip.slug) {
            this.element.addClass('seleccionado');
        }
	},

	'img click' : function(el, ev) {
        ev.preventDefault();

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