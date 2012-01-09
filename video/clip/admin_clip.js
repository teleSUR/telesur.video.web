steal('steal/less').then('./admin_clip.less');

steal( 'video/clip', function($){
/**
 * @class Video.AdminClip
 */
Video.Clip('Video.AdminClip',
/** @Static */
{

},
/** @Prototype */
{
    init : function() {
        this._super();
        this.element.addClass('video_clip');

        this.element.append('<div class="editar" />');
    },

    '.editar click' : function(ev, el) {
        alert('editar');
    }
}

);
});