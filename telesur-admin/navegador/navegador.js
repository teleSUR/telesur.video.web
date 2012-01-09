steal('video/navegador') // controlador base
.then('telesur-admin/grupo') // redefinir controlador
.then('./navegador.less') // CSS

.then(function() {

/**
 * @class Video.Navegador
 */
delete $.fn['video_navegador']; // permite volver a registrar el jquery plugin generado
Video.Navegador('Video.Navegador',
    /** @Static */
    {

    },
    /** @Prototype */
    {

    }
)
});