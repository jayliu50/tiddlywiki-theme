@app
  .controller 'MainCtrl', ($scope, DataService, ngDialog, $sce, $filter) ->

    # $scope.expanded = true

    randomCard = (count) ->
      result = []

      for i in [1..count]
        result.push (
          random: Math.floor(Math.random() * 100)
          name: randomName()
          )
      result

    $scope.newCard = () ->
      something =
        title: ''
        content: ''

      $scope.cards.unshift something

    $scope.editNewCard = () ->

      ngDialog.open(
        template: '/views/editor.html'
        scope: $scope
        );

    $scope.render = () ->
      debugger
      $scope.currentCardRenderedContent = $filter('wikitext')($scope.currentCardContent)

    $scope.currentCardContent = "!works"


    $scope.hints =
          'Header':
            example: '!! Heading 2'
            explanation: 'This will create a 2nd level heading called "Heading 2". (The two ! marks signify 2nd level)'
          'Link':
            example: '[[Your Page]]'
            explanation: 'this will create a link to "Your Page", even if it does not yet exist'

    $scope.setHint = (hint) ->
      $scope.currentHint = $scope.hints[hint]