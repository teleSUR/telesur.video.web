steal('steal/less').then('./player.less');
steal({src: '../resources/mediaplayer/jwplayer.js', packaged: false})


.then( 'jquery/controller','jquery/view/ejs', 'video/detalle')
	.then( './views/init.ejs', function($){

/**
 * @class Video.Player
 */
$.Controller('Video.Player',
/** @Static */
{
	defaults : {
        player_swf_src: 'resources/mediaplayer/player.swf',
        player_skin_src: 'resources/mediaplayer/skins/glow/glow.zip',
        player_width: 350,
        player_height: 230
    }
},
/** @Prototype */
{
    clip_cargado: false,
    /**
     * inicializa controlador para player
     */
	init : function(){
		steal.dev.log('inicializando controlador Player');

        // cargar HTML
        this.element.html("//video/player/views/init.ejs", {});

        // inicializar player
		jwplayer('mediaplayer').setup({
            'skin': this.options.player_skin_src,
            'width': this.options.player_width,
            'height': this.options.player_height,
            'controlbar': 'bottom',
            'wmode': 'window',
            'modes': [
                {
                    type: 'flash',
                    src: this.options.player_swf_src,
                    config: { 'provider': 'rtmp' }
                },
                {
                    type: 'html5',
                    config: { }
                },
                {
                    type: 'download',
                    config: { }
                }
            ]
		});
	},

    /**
     * Reproduce en clip especificado en el player
     * Si actualmente se está reproduciendo el mismo clip, sólo se pausa/despausa
     *
     * @param clip
     */
    cambiarClip: function(clip, sin_autoplay) {

        this.clip_cargado = true;
        // si se intenta cambiar al mismo clip, sólo pausar/despausar
        if (this.clip && this.clip == clip && !sin_autoplay) {
            return jwplayer().pause();
        }

        // cambiar a nuevo clip
        this.clip = clip;

        // actualizar HTML con datos del clip
        this.element.find('.titulo').html(clip.titulo);
        var descripcion_html = clip.descripcion.substr(0, 40).replace(/\s*\w+$/, '') + '... <a href="#">(ver&nbsp;más)</a>';
        this.element.find('.descripcion').html(descripcion_html);
        this.element.find('.opciones').show();

        // link
        this.element.find('.opciones a').attr('href', $.route.url({idioma: $(document).controller().idioma, vista : 'video', v1 : clip.slug}));

        // determinar parámetros para player
        var options = { image: this.clip.thumbnail_mediano };
        if (this.clip.metodo_preferido == 'streaming') {
            options = $.extend(options, { file: clip.streaming.rtmp_file, streamer: clip.streaming.rtmp_server, 'rtmp.subscribe': true });
        } else {
            options = $.extend(options, { file: clip.archivo_url });
        }

        jwplayer().load(options);
        // cargar clip en player
        if (!sin_autoplay) {
            jwplayer().play();
        }
    }

})

});
