@app
	.filter 'wikitext', ($sce) ->
	  (input) ->
	  	html = input

	  	# headers
	  	html = html.replace /^!!!([^\r\n]*)$/mg, '<h3>$1</h3>'
	  	html = html.replace /^!!([^\r\n]*)$/mg, '<h2>$1</h2>'
	  	html = html.replace /^!([^\r\n]*)$/gm, '<h1>$1</h1>'

	 		# links
	 		html = html.replace /\[\[(.*)]\]/gm, """<a click="alert('Would have opened a link to $1')">$1</a>"""
	  	$sce.trustAsHtml html