// load('telesur-web/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  // steal.html.crawl("telesur-web/telesur-web.html","telesur-web/out")
  steal.html.crawl("telesur-web/index.html#!es/video/dossier-71653", { out: 'telesur-web/out', browser: 'phantomjs' })
});
