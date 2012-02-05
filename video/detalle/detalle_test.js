steal('funcunit').then(function(){

module("Video.Detalle", {
	setup: function(){
		S.open("//video/detalle/detalle.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Detalle Demo","demo text");
});


});
