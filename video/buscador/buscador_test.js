steal('funcunit').then(function(){

module("Video.Buscador", { 
	setup: function(){
		S.open("//video/buscador/buscador.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Buscador Demo","demo text");
});


});