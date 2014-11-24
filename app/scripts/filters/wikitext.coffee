@app
	.filter 'wikitext', ($sce) ->
	  (input) ->
	  	return if not input
	  	html = input

	  	# headers
	  	html = html.replace /^!!!([^\r\n]*)$/mg, '<h4>$1</h4>'
	  	html = html.replace /^!!([^\r\n]*)$/mg, '<h3>$1</h3>'
	  	html = html.replace /^!([^\r\n]*)$/gm, '<h2>$1</h2>'

	 		# links
	 		html = html.replace /\[\[(.*)]\]/gm, """<a onclick="alert('Would have opened a link to $1')">$1</a>"""
	  	$sce.trustAsHtml html