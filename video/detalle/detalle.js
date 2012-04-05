steal({src: '../resources/mediaplayer/jwplayer.js', packaged: false})

.then('steal/less').then('./detalle.less')

.then('video/clip', 'video/publicidad')

.then( 'jquery/controller','jquery/view/ejs')
	.then( './views/init.ejs', function($){

/**
 * @class Video.Detalle
 */
$.Controller('Video.Detalle',
/** @Static */
{
	defaults : {

    },
    listensTo: ['show']
},
/** @Prototype */
{
    /**
     * inicializa controlador para detalle
     */
	init : function(){
		steal.dev.log('inicializando controlador Detalle');

        this.position = 0;

//        var mini_player = jwplayer('mediaplayer');
//        if (mini_player) {
//            this.position = mini_player.getPosition();
//            mini_player.stop();
//            //$('#mediaplayer').hide();
//        }
	},

    show: function() {
        // cargar HTML
        this.element.html("//video/detalle/views/init.ejs", {clip: this.options.clip, idioma: $(document).controller().idioma});

        //this.initPlayer();
        var reproductor = $('#reproductor');
        if (!reproductor.controller().clip_cargado) {
            $('#reproductor').controller().cambiarClip(this.options.clip);
        }

        var url = this.options.clip.navegador_url;

//        (function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs"));

//        $.getScript('http://s7.addthis.com/js/250/addthis_widget.js?pubid=ra-4f2d726c065de481&domready=1', {cache: true}, function() {
//            addthis.init();
//            addthis.toolbox("#sociales1", {
//                ui_language: $(document).controller().idioma,
//                url: url
//            });
//
//        });

        //
        gapi.plusone.go();

        // iOS
        if((navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i))) {

            this.initPlayer();
        }

        $('.tipo_clip.'+this.options.clip.tipo.slug).addClass('seleccionado');

        // publicidad
        var publicidad_elem = $('#publicidad');
        if (!publicidad_elem.is(':visible')) {
            if (publicidad_elem.children().length == 0) {
                publicidad_elem.html('//video/pagina/views/publicidad.ejs', {});
            }
            publicidad_elem.show();
        }

        // relacionados
        Video.Models.Clip.findAll({detalle: 'completo', ultimo: 3, relacionados: this.options.clip.slug}, this.callback('relacionadosRecibidos'));
    },

    initPlayer : function() {
        steal.dev.log('inicializando controlador Detalle');
        // inicializar player
        jwplayer('standalone_player').setup({
            //'skin' : 'resources/mediaplayer/skins/glow/glow.zip',
            'width': 560,
            'height': 320,
            'controlbar': 'bottom',
            'wmode': 'window',
            'file': this.options.clip.archivo_subtitulado_url ? this.options.clip.archivo_subtitulado_url : this.options.clip.archivo_url,

            'image': this.options.clip.thumbnail_grande,
            'start' : this.position,
            'autoplay' : this.position > 0,
            'modes': [
//                {
//                    type: 'flash',
//                    src: 'resources/mediaplayer/player.swf',
//                    config: { 'provider': 'http', 'http.startparam':'start' }
//                },
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

    '.regresar click' : function(ev, el) {

    },

    '.nav click' : function() {
        var rand = Math.floor(Math.random()*11) + 1
        this.element.find('.player img').fadeOut();
        Video.Models.Clip.findAll({detalle: 'completo', primero: rand,  ultimo: rand, tipo: $(document).controller().tipo_slug }, this.callback('navRecibido'));
    },

    navRecibido : function(clips) {
        if (this.element) {
            this.options.clip = clips[0];
            this.show();
        }
    },

    /**
     *
     */
    relacionadosRecibidos : function(clips) {
       // sólo si sigue maximizado
        var relacionados_div = $('<div class="relacionados"><h3>RELACIONADOS</h3></div>');
        relacionados_div.appendTo('#lado');

       if (!($(document).controller().maximizado === false)) {
            clips.each(function(i, clip) {
                $('<div class="relacionado" />').video_clip({clip: clip}).appendTo(relacionados_div);
            });
       }

    },

    /**
     * Reproduce en clip especificado en el player
     * Si actualmente se está reproduciendo el mismo clip, sólo se pausa/despausa
     *
     * @param clip
     */
    cambiarClip: function(clip, sin_autoplay) {

        var player_id = 'standalone_player';

        this.clip_cargado = true;
        // si se intenta cambiar al mismo clip, sólo pausar/despausar
        if (this.options.clip == clip && !sin_autoplay) {
            return jwplayer(player_id).pause();
        }

        // cambiar a nuevo clip
        this.options.clip = clip;
        this.show();

//
//        // determinar parámetros para player
//        var options = { image: this.clip.thumbnail_mediano };
//        if (this.clip.metodo_preferido == 'XXXXXstreaming') {
//            options = $.extend(options, { file: clip.streaming.rtmp_file, streamer: clip.streaming.rtmp_server, 'rtmp.subscribe': true });
//        } else {
//            options = $.extend(options, { file: clip.audio_url });
//        }
//
//        var player_id = ($('.video_detalle').length == 0) ? 'mediaplayer' : 'standalone_player';
//
//        jwplayer(player_id).load(options);
//        // cargar clip en player
//        if (!sin_autoplay) {
//            jwplayer().play();
//        }
    }

})

});
