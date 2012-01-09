//js telesur-web/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('telesur-web/telesur-web.html', {
		markdown : ['telesur-web']
	});
});