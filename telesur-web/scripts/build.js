//js telesur-web/scripts/build.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
	steal.build('telesur-web/scripts/build.html',{to: 'telesur-web'});
});
