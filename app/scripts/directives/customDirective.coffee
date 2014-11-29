@app
  .directive 'compile', ($compile, $filter) ->
    restrict: "A"
    link: (scope, element, attrs) ->
    	scope.$watch ((scope) ->

    		# if not attrs.isCompiled?
	    	#   # watch the 'compile' expression for changes
	    	#   element.attr 'is-compiled', true
	    	#   attrs.isCompiled = true
	    	#   scope.$eval attrs.compile

	    	scope.$eval attrs.compile

    	), (value) ->

    	  # when the 'compile' expression changes
    	  # assign it into the current DOM
    	  element.html ($filter('wikitext') value).valueOf()

    	  # compile the new DOM and link it to the current
    	  # scope.
    	  # NOTE: we only compile .childNodes so that
    	  # we don't get into infinite loop compiling ourselves
    	  $compile(element.contents()) scope
    	  return
