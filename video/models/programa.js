steal('jquery/model', 'jquery/model/list/local', function(){

/**
 * @class Video.Models.Programa
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend programa services.
 */
$.Model('Video.Models.Programa',
/* @Static */
{
    id: 'slug',
    //findAll: "/api/programa/"
    findAll : function(params, success, error) {
        return $.ajax({
            url:  Video.Models.VideoApi.isCrossDomain() ? 'http://multimedia.tlsur.net/api/programa/' : '/api/programa/',
            dataType: (Video.Models.VideoApi.isCrossDomain() ? 'jsonp' : 'json') + ' programa.models',
            data: params,
            success: success,
            error: [Video.Models.VideoApi.ajaxErrorFnc, error], tryCount: 0, retryLimit: 3
        })
    }
  	//findOne : "/programas/{id}.json",
  	//create : "/programas.json",
 	//update : "/programas/{id}.json",
  	//destroy : "/programas/{id}.json"
},
/* @Prototype */
{});

$.Model.List.Local("Video.Models.Programa.CookieList");

});