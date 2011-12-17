steal({src: '../resources/mediaplayer/jwplayer.js', packaged: false})

.then( 'jquery/controller','jquery/view/ejs')
	.then( './views/init.ejs', function($){

/**
 * @class Video.Player
 */
$.Controller('Video.Player',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
    clip: null,

	init : function(){
		steal.dev.log('inicializando controlador Player');
        this.element.html("//video/player/views/init.ejs", {});

		jwplayer('mediaplayer').setup({
            'modes': [
                {
                    type: 'flash',
                    src: 'resources/mediaplayer/player.swf',
                    config: {
                        //'file': 'http://media.tlsur.net/clips/telesur-video-2011-11-11-142226304176.mp4',
                        'provider': 'rtmp'
                        //'http.startparam': 'start'
                        //'streamer': 'start'
                    }

                },
                {
                    type: 'html5',
                    config: {
                       // 'file': 'http://media.tlsur.net/clips/telesur-video-2011-11-11-142226304176.mp4'
                    }
                },
                {
                    type: 'download',
                    config: {
                       //'file': 'http://media.tlsur.net/clips/telesur-video-2011-11-11-142226304176.mp4?descarga',
                       //'provider': 'video'
                    }
                }
            ],
            'skin': 'resources/mediaplayer/skins/glow/glow.zip',

		   // 'controlbar': 'bottom',
            //'file': 'http://media.tlsur.net/clips/telesur-video-2011-11-11-142226304176.mp4',
		    'width': '350',
		    'height': '230',
            'controlbar': 'bottom'
        	//'wmode': 'window'
		});
	},

    cambiarClip: function(clip) {

        if (this.clip && this.clip == clip) {
            jwplayer().pause()
                return;
        }

        this.clip = clip;

        switch (this.clip.metodo_preferido) {
            case 'streaming':
                jwplayer().load({file: this.clip.streaming.rtmp_file, streamer: this.clip.streaming.rtmp_server, 'rtmp.subscribe': true}).play();
                break;
            case 'http':
                jwplayer().load({file: this.clip.archivo_url}).play();
                break;
        }

        this.element.find('#mediaplayer-titulo').html(this.clip.descripcion);

        //this.element.find('#mediaplayer').animate({width: '600px'});
        this.element.find('#mediaplayer').height = '400px;';
        this.element.find('#mediaplayer').width = '400px;';
        //document.getElementById("mediaplayer").height = '400px';
    }
})

});