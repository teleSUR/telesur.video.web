steal('jquery/model', function(){

/**
 * @class Video.Models.Clip
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend clip services.
 */
$.Model('Video.Models.Clip',
/* @Static */
{
    id: 'slug',
	//findAll: "/api/clip/"
    findAll : function(params, success, error) {
        return $.ajax({
            url: location.href.match(/multimedia\.tlsur\.net/) ? '/api/clip' : 'http://multimedia.tlsur.net/api/clip/',
            dataType: location.href.match(/multimedia\.tlsur\.net/) ? 'json' : 'jsonp clip.models',
            data: params,
            success: success,
            error: [Video.Models.VideoApi.ajaxErrorFnc, error], tryCount: 0, retryLimit: 3
        })
    }
  	//findOne : "/clips/{id}.json",
  	//create : "/clips.json",
 	//update : "/clips/{id}.json",
  	//destroy : "/clips/{id}.json"
},
/* @Prototype */
{});

});