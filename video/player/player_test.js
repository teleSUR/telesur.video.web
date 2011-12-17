steal('funcunit').then(function(){

module("Video.Player", { 
	setup: function(){
		S.open("//video/player/player.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Video.Player Demo","demo text");
});


});