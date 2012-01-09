steal('video/grupo') // controlador base
.then('telesur-web/clip') // redefinir controlador
.then('./grupo.less') // CSS

.then(function() {
/**
 * @class Video.Grupo
 */
delete $.fn['video_grupo']; // permite volver a registrar el jquery plugin generado
Video.Grupo('Video.Grupo',
    /** @Static */
    {

    },
    /** @Prototype */
    {

    }
)
});