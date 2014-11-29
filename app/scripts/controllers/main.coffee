@app
  .controller 'MainCtrl', ($scope, DataService, ngDialog, $sce, $filter) ->

    $scope.cards = []
    $scope.currentCard = null

    dialog = null

    openDialog = () ->
      ngDialog.open(
        template: 'views/editor.html'
        scope: $scope
        # closeByDocument: false
        );

    $scope.backupCard = null

    $scope.editNewCard = (data = {}) ->
      $scope.dirty = false
      $scope.currentCard = data

      openDialog().closePromise.then (data) ->
        card = data.$dialog.scope().currentCard # whatev
        $scope.cards.unshift card unless data.value is 'discard' or not card? or _.isEmpty card

    $scope.openOrCreate = (cardTitle) ->
      cardIndex = _.findIndex $scope.cards, {title: cardTitle}
      if cardIndex != -1
        $scope.editCard($scope.cards[cardIndex])
      else
        $scope.dirty = true
        $scope.editNewCard({title: cardTitle})

    $scope.hints =
      'Headers':
        example: '!! My Cat'
        explanation: 'This will create a 2nd level heading called "My Cat". (The two ! marks signify a 2nd level header, three !s signify 3rd level, and so on)'
      'Link (Internal)':
        example: '[[Adorable Pets]]'
        explanation: 'This will create a link to a card called "Adorable Pets", even if it does not yet exist'
      'Link (External)':
        example: '[[additional information on cats|http://cats.com]]'
        explanation: 'This will make the text "additional information on cats" link to "http://cats.com"'

    $scope.editCard = (card, $event) ->
      return if $event && $event.target.tagName is 'A'

      $scope.backupCard = _.cloneDeep card

      $scope.dirty = false
      $scope.currentCard = card

      openDialog().closePromise.then (data) ->

        if data.value is 'discard'
          angular.extend card, data.$dialog.scope().backupCard

    $scope.showHint = false

    $scope.setHint = (hint) ->
      $scope.currentHint = hint
      $scope.showHint = hint?
      return

    $scope.noCards = () ->
      _.compact $scope.cards
      _.isEmpty $scope.cards

    $scope.makeDirty = () ->
      $scope.dirty = true

    $scope.deleteCard = () ->
      _.remove $scope.cards, $scope.currentCard
      $scope.currentCard = null
