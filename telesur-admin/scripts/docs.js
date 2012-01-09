//js telesur-admin/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('telesur-admin/telesur-admin.html', {
		markdown : ['telesur-admin']
	});
});