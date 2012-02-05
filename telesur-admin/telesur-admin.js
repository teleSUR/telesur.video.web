steal(
	'./telesur-admin.css', 			// application CSS file
	'./models/models.js',		// steals all your models

    // Controladores
    'telesur-admin/pagina',
	function(){

        $(document).ready(function($) {
            // Inicializar sitio
            steal.dev.log('inicializando aplicación telesur-admin');
            steal.dev.log('jQuery: ' + $().jquery);

            $(document).video_pagina();

            
        });

	});

