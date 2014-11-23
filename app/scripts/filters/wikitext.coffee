@app
	.filter 'wikitext', ($sce) ->
	  (input) ->
	  	html = input.replace /^!!(.*)/, '<h2>$1</h2>'
	  	html = input.replace /^!(.*)/, '<h1>$1</h1>'
	  	$sce.trustAsHtml html