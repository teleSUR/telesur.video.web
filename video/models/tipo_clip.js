steal('jquery/model', 'jquery/model/list/cookie', function(){

/**
 * @class Video.Models.TipoClip
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend tipo_clip services.
 */
$.Model('Video.Models.TipoClip',
/* @Static */
{
    id: 'slug',
	//findAll: "/api/tipo_clip/"
    findAll : function(params, success, error) {
        return $.ajax({
            url: location.href.match(/multimedia\.tlsur\.net/) ? '/api/tipo_clip' : 'http://multimedia.tlsur.net/api/tipo_clip/',
            dataType: location.href.match(/multimedia\.tlsur\.net/) ? 'json' : 'jsonp tipo_clip.models',
            data: params,
            success: success,
            error: [Video.Models.VideoApi.ajaxErrorFnc, error], tryCount: 0, retryLimit: 3
        })
    }
  	//findOne : "/tipo_clips/{id}.json",
  	//create : "/tipo_clips.json",
 	//update : "/tipo_clips/{id}.json",
  	//destroy : "/tipo_clips/{id}.json"
},
/* @Prototype */
{});

$.Model.List.Cookie("Video.Models.TipoClip.CookieList", {days: 5});

});