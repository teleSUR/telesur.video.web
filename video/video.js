traducir = function(str) {
    cadenas = {
        'video': {en: 'video', 'pt': 'video', fr: ''},
        'audio': {en: 'video', 'pt': 'video', fr: ''},
        'descargar': {en: 'download', 'pt': 'Baixar', fr: ''},
        'inicio': {en: 'home', 'pt': 'inicio', fr: ''},
        'video <span>en vivo</span>': {en: 'live <span>video</span>', 'pt': 'video <span>en vivo</span>', fr: ''},
        'audio <span>en vivo</span>': {en: 'live <span>audio</span>', 'pt': 'áudio <span>ao vivo</span>', fr: ''},
        'duración': {en: 'length', 'pt': 'duración', fr: ''},
        'fecha': {en: 'date', 'pt': 'fecha', fr: ''},
        'corresponsal': {en: 'correspondant', 'pt': 'correspondente', fr: ''},
        'categoría': {en: 'category', 'pt': 'categoría', fr: ''},
        'programa de origen': {en: 'source show', 'pt': 'programa de origen', fr: ''},
        'entrevistador': {en: 'interviewer', 'pt': 'entrevistador', fr: ''},
        'videos relacionados': {en: 'related videos', 'pt': 'vídeos relacionados', fr: ''},
        'búsqueda': {en: 'search', 'pt': 'búsqueda', fr: ''},
        'descarga nuestra aplicación móvil en': {en: 'download our mobile app at', 'pt': 'descarga nuestra aplicación móvil en', fr: ''},
        'publicidad': {en: 'advertisement', 'pt': 'publicidad', fr: ''},
        'sin resultados para esta búsqueda': {en: 'no search results', 'pt': 'sin resultados para la búsqueda', fr: ''},
        'entrevistador': {en: 'interviewer', 'pt': 'entrevistador', fr: ''},
        'entrevistado': {en: 'interviewed', 'pt': 'entrevistado', fr: ''}
    }
    var idioma = $(document).controller().idioma;
    if (idioma != 'es') {
        return cadenas[str][$(document).controller().idioma];
    } else {
        return str;
    }
};

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