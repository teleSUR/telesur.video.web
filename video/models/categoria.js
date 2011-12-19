steal('jquery/model', 'jquery/model/list/cookie', function(){

/**
 * @class Video.Models.Categoria
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend categoria services.
 */
$.Model('Video.Models.Categoria',
/* @Static */
{
    'id': 'slug',
	//findAll: "/api/categoria/"
    findAll : function(params, success, error) {
        return $.ajax({
            url:  Video.Models.VideoApi.isCrossDomain() ? 'http://multimedia.tlsur.net/api/categoria/' : '/api/categoria/',
            dataType: (Video.Models.VideoApi.isCrossDomain() ? 'jsonp' : 'json') + ' categoria.models',
            data: params,
            success: success,
            error: [Video.Models.VideoApi.ajaxErrorFnc, error], tryCount: 0, retryLimit: 3
        })
    }
	//findAll: "/api/categoria/",
  	//findOne : "/categorias/{id}.json",
  	//create : "/categorias.json",
  	//update : "/categorias/{id}.json",
  	//destroy : "/categorias/{id}.json"
},
/* @Prototype */
{});

$.Model.List.Cookie("Video.Models.Categoria.CookieList", {days: 1});

});