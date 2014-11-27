@app
  .controller 'MainCtrl', ($scope, DataService, ngDialog, $sce, $filter) ->

    $scope.cards = []
    $scope.currentCard = null

    dialog = null

    openDialog = () ->
      ngDialog.open(
        template: '/views/editor.html'
        scope: $scope
        closeByDocument: false
        );

    $scope.backupCard = null

    $scope.editNewCard = () ->
      $scope.dirty = false
      $scope.currentCard = {}

      openDialog().closePromise.then (data) ->
        card = data.$dialog.scope().currentCard # whatev
        $scope.cards.unshift card unless data.value is 'discard' or not card? or _.isEmpty card


    $scope.hints =
      'Headers':
        example: '!! Heading 2'
        explanation: 'This will create a 2nd level heading called "Heading 2". (The two ! marks signify 2nd level)'
      'Links':
        example: '[[Your Page]]'
        explanation: 'this will create a link to "Your Page", even if it does not yet exist'

    $scope.editCard = (card, $event) ->
      return if $event.target.tagName is 'A'

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