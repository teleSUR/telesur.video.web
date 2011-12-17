//js video/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('video/video.html', {
		markdown : ['video']
	});
});