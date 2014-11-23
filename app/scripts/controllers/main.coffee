@app
  .controller 'MainCtrl', ($scope, DataService, ngDialog, $sce, $filter) ->

    $scope.cards = []
    $scope.currentCard = null

    $scope.newCard = () ->
      something =
        title: ''
        content: ''

      $scope.cards.unshift something

    dialog = null

    $scope.editNewCard = () ->

      dialog = ngDialog.open(
        template: '/views/editor.html'
        # closeByDocument: false
        scope: $scope
        );

      dialog.closePromise.then (data) ->
        $scope.cards.unshift data.$dialog.scope().currentCard # whatev


    $scope.hints =
          'Header':
            example: '!! Heading 2'
            explanation: 'This will create a 2nd level heading called "Heading 2". (The two ! marks signify 2nd level)'
          'Link':
            example: '[[Your Page]]'
            explanation: 'this will create a link to "Your Page", even if it does not yet exist'

    $scope.setHint = (hint) ->
      $scope.currentHint = $scope.hints[hint]