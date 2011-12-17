steal('funcunit').then(function(){

module("Video.Grupo", { 
	setup: function(){
		S.open("//video/grupo/grupo.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Grupo Demo","demo text");
});


});