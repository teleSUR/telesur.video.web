steal({src: 'video/resources/mediaplayer/jwplayer.js', packaged: false})

.then('steal/less').then('video/player/player.less')

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
                'gapro-2': { },
                'sharing-3': {
                    code : encodeURIComponent('<script src="'+clip.player_javascript_url+'"></script>'),
                    link : clip.navegador_url,
                    heading: 'Comparte este video'
                }
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
            if (clip.archivo_subtitulado_url) {
                player_options.modes[0].config = { 'provider': 'http', 'http.startparam':'start', 'file' : clip.archivo_subtitulado_url  }
            }
            //player_options.plugins['captions-2'];
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

        //var descripcion_html = '<span class="descripcion">'+descripcion + '</span>...<a href="'+$.route.url({idioma: $(document).controller().idioma, vista : 'video', v1 : clip.slug})+'">(ver&nbsp;más)</a>';

        //if ($(document).controller().idioma == 'pt') {
        //    descripcion_html = clip.descripcion.substr(0, 70).replace(/\s*\w+$/, '') + '... <a href="'+$.route.url({idioma: $(document).controller().idioma, vista : 'video', v1 : clip.slug})+'">(ver&nbsp;mais)</a>';
        //}

        // si no se tiene detalle completo (pero se requiere), solicitarlo
        if (typeof clip.programa == 'undefined' && !clip.descripcion) {
            Video.Models.Clip.findOne({id: clip.slug, detalle: 'completo'}, this.callback('recibirDetalleCompleto'));
        }

        //this.element.find('.descripcion').html(descripcion_html);
        this.element.find('.fecha').html(clip.getFechaTexto(true));
        this.element.find('.opciones').show();

        // link
        $('a.vistaswitch').attr('href', $.route.url({idioma: $(document).controller().idioma, vista : 'video', v1 : clip.slug}));
        // descarga
        this.element.find('.opciones a.descarga').attr('href', clip.descarga_url);

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

        var titulo = this.clip.titulo + '| teleSUR Video';
        document.title = titulo;

        this.cargarSociales();

        setTimeout(function() {
            steal.html.ready();
        })

    },

    cargarSociales : function() {
        var div = $('#sociales0');
        div.empty();
       // div.append('<iframe src="//www.facebook.com/plugins/like.php?locale=es_MX&amp;href="' + encodeURIComponent(this.clip.navegador_url) +'" &amp;send=false&amp;layout=button_count&amp;width=80&amp;show_faces=false&amp;action=recommend&amp;colorscheme=dark&amp;font&amp;height=20&amp;appId=106741209367820" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:80px; height:21px;" allowTransparency="true"></iframe>');
        div.append('<iframe allowtransparency="true" frameborder="0" scrolling="no" ' +
            'src="//platform.twitter.com/widgets/tweet_button.html?url=' + encodeURIComponent(this.clip.navegador_url) + '&text=' + encodeURIComponent(this.clip.titulo) + '&lang='+ (this.clip.idioma || 'es') + '"' +
            'style="width:115px; height:20px;"></iframe>');

        //div.append('<g:plusone size="medium" annotation="none" href="' + this.clip.navegador_url  + '"></g:plusone>');

        //gapi.plusone.go();

    },

    minimizar : function() {
        $(document).controller().maximizado = false;

        var player = jwplayer('mediaplayer'),
            player_wrapper = $('#player_wrapper');

        if (player) {

            $('.relacionados').remove();

            player_wrapper.css('opacity', 0);
            // poner player en posición minimizada

            player_wrapper.prependTo('#reproductor');
            player_wrapper.parent().show();

            player_wrapper.css({
                height: 195, width: 300, 'padding-left': 0, 'padding-top': 0
            });

            this.cargarSociales();


            // mostrar player
            player_wrapper.css('opacity', 1);
           // player_wrapper.parent().children().not(player_wrapper).show();

            player_wrapper.show();

//            player.play();
//            player.seek(10);


            // eliminar controlador de detalle
            $('.video_detalle').remove();

            // mostrar nuevamente navegador
            $('#navegador').show();


        } else {
            // $('#mediaplayer').show();
        }

        $('a.vistaswitch').attr('href', $.route.url({idioma: $(document).controller().idioma, vista : 'video', v1 : this.clip.slug}));

    },

    maximizar : function(sin_animacion) {

        $(document).controller().maximizado = true;

        var player_wrapper = $('#player_wrapper'),
            posicionar_fnc = function() {
                player_wrapper.css('opacity', 0);
                // poner player en posición maximizada

                // mostrar player
                //player_wrapper.parent().children().not(player_wrapper).hide();

                player_wrapper.css('opacity', 1);

                player_wrapper.parent().hide();
                player_wrapper.appendTo($('div.player'));

                player_wrapper.css({
                    width: 515, height: 323, 'padding-left': 15, 'padding-top': 15
                });

                player_wrapper.show();
            };

        if (sin_animacion) {
            player_wrapper.hide();
            posicionar_fnc();
         } else {
            player_wrapper.show(posicionar_fnc);
        }

        $('.relacionado').show('fast');

        // eliminar thumbnail
        //$('#standalone_player img').fadeOut(function() { $(this).remove(); });

        // actualizar link de switch
        $('a.vistaswitch').attr('href', '');

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
