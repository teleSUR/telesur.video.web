steal('video/clip') // controlador base
.then('./clip.less') // CSS

.then( './views/init.ejs', function($){

/**
 * @class Video.Clip
 */
delete $.fn['video_clip']; // permite volver a registrar el jquery plugin generado
Video.Clip('Video.Clip',
    /** @Static */
    {
        clip_template: '//telesur-admin/clip/views/init.ejs'
    },
    /** @Prototype */
    {

    }
);
});