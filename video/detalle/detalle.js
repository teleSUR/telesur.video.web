steal({src: '../resources/mediaplayer/jwplayer.js', packaged: false})

.then('steal/less').then('./detalle.less')

.then('video/clip')

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

        // cargar HTML
        this.element.html("//video/detalle/views/init.ejs", {clip: this.options.clip});

        this.element.find('.sociales').append('<div class="fondo_sociales" />');

        Video.Models.Clip.findAll({ultimo: 3, relacionados: this.options.clip.slug}, this.callback('relacionadosRecibidos'));

        //this.initPlayer();
	},

    show: function() {
        //this.initPlayer();
    },

    initPlayer : function() {
        // inicializar player
        jwplayer('standalone_player').setup({
            //'skin': this.options.player_skin_src,
            'width': 560,
            'height': 320,
            'controlbar': 'bottom',
            'wmode': 'window',
            'file': this.options.clip.archivo_url,
            'image': this.options.clip.thumbnail_grande,
            'modes': [
                {
                    type: 'flash',
                    src: 'resources/mediaplayer/player.swf'
                    //config: { 'provider': 'rtmp' }
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

    '.regresar click' : function(ev, el) {
       // $.route.removeAttr('v1');$.route.removeAttr('vista');
       // $.route.attrs({vista: 'lista'});
        var v1 = $(document).controller().tipo_slug || 'noticia';
        var v2 = $(document).controller().modo || undefined;

        document.location.href = $.route.url({idioma: $(document).controller().idioma, vista: 'lista', v1: v1, v2: v2});
    },

    '.nav click' : function() {
        var rand = Math.floor(Math.random()*11) + 1
        this.element.find('.player img').fadeOut();
        Video.Models.Clip.findAll({primero: rand,  ultimo: rand, tipo: $(document).controller().tipo_slug }, this.callback('navRecibido'));
    },

    navRecibido : function(clips) {
        this.update({clip: clips[0]});
        this.init();
    },

    /**
     *
     */
    relacionadosRecibidos : function(clips) {
        if (!this.element) return;

        this.initPlayer();

        var relacionados_elem = this.element.find('.relacionados');
        clips.each(function(i, clip) {
            $('<div />').video_clip({clip: clip}).appendTo(relacionados_elem);
        });

    }

})

});
