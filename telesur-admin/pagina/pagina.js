steal('video/pagina') // controlador base
.then('telesur-admin/navegador') // redefinir navegador
.then('./pagina.less') // CSS

.then(function() {

/**
 * @class Video.Pagina
 */
delete $.fn['video_pagina']; // permite volver a registrar el jquery plugin generado
Video.Pagina('Video.Pagina',
    /** @Static */
    {
    },
    /** @Prototype */
    {
    }
);
});