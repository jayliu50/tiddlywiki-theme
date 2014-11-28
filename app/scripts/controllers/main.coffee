@app
  .controller 'MainCtrl', ($scope, DataService, ngDialog, $sce, $filter) ->

    $scope.cards = []
    $scope.currentCard = null

    dialog = null

    openDialog = () ->
      ngDialog.open(
        template: 'views/editor.html'
        scope: $scope
        closeByDocument: false
        );

    $scope.backupCard = null

    $scope.editNewCard = (data = {}) ->
      $scope.dirty = false
      $scope.currentCard = data

      openDialog().closePromise.then (data) ->
        card = data.$dialog.scope().currentCard # whatev
        $scope.cards.unshift card unless data.value is 'discard' or not card? or _.isEmpty card

    $scope.openOrCreate = (pageTitle) ->
      cardIndex = _.findIndex $scope.cards, {title: pageTitle}
      if cardIndex != -1
        $scope.editCard($scope.cards[cardIndex])
      else
        $scope.dirty = true
        $scope.editNewCard({title: pageTitle})

    $scope.hints =
      'Headers':
        example: '!! Heading 2'
        explanation: 'This will create a 2nd level heading called "Heading 2". (The two ! marks signify 2nd level, three !s signify 3rd level, and so on)'
      'Link (Internal)':
        example: '[[Your Page]]'
        explanation: 'This will create a link to "Your Page", even if it does not yet exist'
      'Link (External)':
        example: '[[Some other page|http://thatotherpage.com]]'
        explanation: 'This will create link to a page on the Internet'

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
      _.remove $scope.cards, currentCard
      currentCard = null
