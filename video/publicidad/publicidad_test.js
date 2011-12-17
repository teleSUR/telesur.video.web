steal('funcunit').then(function(){

module("Video.Publicidad", { 
	setup: function(){
		S.open("//video/publicidad/publicidad.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Publicidad Demo","demo text");
});


});