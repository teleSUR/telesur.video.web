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
        player_width: 300,
        player_height: 189
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
        this.element.html("//video/player/views/init.ejs", {idioma: $(document).controller().idioma});

        //this.initPlayer();
	},

    recibirDetalleCompleto : function(clip) {
        clip = clip[0];
        if (clip.tipo.slug == 'programa' && clip.programa) {
            this.element.find('span.descripcion').html(clip.programa.descripcion);
        }
    },

    initPlayer : function(clip) {
        var player_options = {
            'skin': this.options.player_skin_src,
            'width': '100%',// this.options.player_width,
            'height': '100%', //this.options.player_height,
            'controlbar': 'bottom',
            'wmode': 'window',
            'image': clip.thumbnail_grande,
            'plugins': {
                'gapro-2': { }
            },
            'modes': [
                {
                    type: 'flash',
                    src: this.options.player_swf_src,
                    config: { 'provider': 'rtmp', streamer: clip.streaming.rtmp_server, file: clip.streaming.rtmp_file  }
                },
                {
                    type: 'html5',
                    config: { 'file' : clip.archivo_subtitulado_url ? clip.archivo_subtitulado_url : clip.archivo_url  }
                },
                {
                    type: 'download',
                    config: { }
                }
            ]
        };
        if ($(document).controller().idioma != 'es') {
            player_options.plugins['captions-2'];
        }

        if((navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i))) {

            delete player_options.skin;
        }
        // inicializar player
        jwplayer('mediaplayer').setup(player_options);

    },

    /**
     * Reproduce en clip especificado en el player
     * Si actualmente se está reproduciendo el mismo clip, sólo se pausa/despausa
     *
     * @param clip
     */
    cambiarClip: function(clip, sin_autoplay) {
        // si se intenta cambiar al mismo clip, sólo pausar/despausar
        if (this.clip_cargado && this.clip && this.clip == clip && !sin_autoplay) {
            return jwplayer().pause();
        }

        // cambiar a nuevo clip
        this.clip = clip;

        // actualizar HTML con datos del clip
        this.element.find('.titulo').html(clip.titulo);

        var descripcion = (!clip.descripcion && clip.programa) ? clip.programa.descripcion : clip.descripcion;
        var descripcion_html = '<span class="descripcion">'+descripcion + '</span>... <a href="'+$.route.url({idioma: $(document).controller().idioma, vista : 'video', v1 : clip.slug})+'">(ver&nbsp;más)</a>';

        // si no se tiene detalle completo (pero se requiere), solicitarlo
        if (typeof clip.programa == 'undefined' && !clip.descripcion) {
            Video.Models.Clip.findOne({id: clip.slug, detalle: 'completo'}, this.callback('recibirDetalleCompleto'));
        }

//        var descripcion_html = clip.descripcion.substr(0, 150).replace(/\s*\w+$/, '') + '... <a href="'+$.route.url({idioma: $(document).controller().idioma, vista : 'video', v1 : clip.slug})+'">(ver&nbsp;más)</a>';
        this.element.find('.descripcion').html(descripcion_html);
        this.element.find('.fecha').html(clip.getFechaTexto(true));
        this.element.find('.opciones').show();

        // link
        this.element.find('.opciones a.detalle').attr('href', $.route.url({idioma: $(document).controller().idioma, vista : 'video', v1 : clip.slug}));

//        if (typeof addthis == 'undefined') {
//            jQuery.ajax({
//                url: 'http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4f2d726c065de481&domready=1',
//                cache: true,
//                dataType: 'script'
//            });
//            //jQuery.getScript('', this.callback('setSociales'));
//        } else {
//            this.setSociales();
//        }

        if (this.clip_cargado) {
           // jwplayer().remove();
        } else {
            this.clip_cargado = true;
        }
        this.initPlayer(clip);

        if (!sin_autoplay) {
            jwplayer().play();
        }

        setTimeout(function() {
            steal.html.ready();
        })

    },

    minimizar : function() {
        var mini_player = jwplayer('mediaplayer');
        if (mini_player) {
            $('#player_wrapper').css({
                height: 189, width: 300, left: 0, top: 0
            });
//            var standalone = jwplayer('standalone_player');
//            if (standalone) {
//                mini_player.seek(standalone.getPosition());
//                $('#mediaplayer').show();
//                if (standalone.getPosition() > 0) {
//                    mini_player.play();
//                }
        } else {
            // $('#mediaplayer').show();
        }
    },

    maximizar : function() {
        $('#player_wrapper').css({
            'z-index': 999, opacity: 1,
            width: 515, height: 320, left: -354, top: 6, 'z-index': 1000000
        });
        $('#standalone_player img').fadeOut(function() { $(this).remove(); });
        //$('#standalone_player').css({width: 560, height: 320}).empty();
    },

    setSociales : function() {
//        addthis_share.url = this.clip.navegador_url;
//        addthis.update('share', 'url', this.clip.navegador_url);
//        addthis.update('share', 'title', this.clip.titulo);
//        addthis.toolbox("#sociales0", {
//            url: this.clip.navegador_url,
//            ui_language: $(document).controller().idioma,
//            height: 25
//        });
    }

})

});
