steal(
	'./telesur-web.css', 			// application CSS file
	'./models/models.js',		// steals all your models

    // Controladores
    'telesur-web/pagina',
	function(){

        $(document).ready(function($) {
            // Inicializar sitio
            steal.dev.log('inicializando aplicación telesur-web');
            steal.dev.log('jQuery: ' + $().jquery);

            $(document).video_pagina();
        });

	});

