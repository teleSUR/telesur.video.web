//steal/js video/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
	steal.build('video/scripts/build.html',{to: 'video'});
});
