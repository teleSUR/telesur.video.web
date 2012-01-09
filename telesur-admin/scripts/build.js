//js telesur-admin/scripts/build.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
	steal.build('telesur-admin/scripts/build.html',{to: 'telesur-admin'});
});
