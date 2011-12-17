steal(
    // CSS's
    './video.css',

    // Modelos
    './models/models.js',

    // Controladores
    'video/pagina',

    //{ src: './fixtures/fixtures.js', ignore: true },

	function() {				// configure your application
        $(document).ready(function($) {
            // Inicializar sitio
            steal.dev.log('inicializando aplicación');
            steal.dev.log('jQuery: ' + $().jquery);

            $(document).video_pagina();
        });
    }
);