@app
  .controller 'MainCtrl', ($scope, DataService, ngDialog, $sce, $filter) ->

    $scope.cards = []
    $scope.currentCard = null

    dialog = null

    $scope.editNewCard = () ->

      dialog = ngDialog.open(
        template: '/views/editor.html'
        scope: $scope
        );

      dialog.closePromise.then (data) ->
        card = data.$dialog.scope().currentCard # whatev
        $scope.cards.unshift card unless data.value is 'discard' or not card?


    $scope.hints =
      'Headers':
        example: '!! Heading 2'
        explanation: 'This will create a 2nd level heading called "Heading 2". (The two ! marks signify 2nd level)'
      'Links':
        example: '[[Your Page]]'
        explanation: 'this will create a link to "Your Page", even if it does not yet exist'

    $scope.editCard = (card) ->
      $scope.currentCard = card
      dialog = ngDialog.open(
        template: '/views/editor.html'
        scope: $scope
        );

    $scope.showHint = false

    $scope.setHint = (hint) ->
      $scope.currentHint = hint
      $scope.showHint = true
      return

    $scope.noCards = () ->
      _.compact $scope.cards
      _.isEmpty $scope.cards