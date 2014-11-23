@app
  .controller 'MainCtrl', ($scope, DataService, ngDialog, $sce) ->

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
      newCard =
        content: "Testing testing"
        renderedContent:  $sce.trustAsHtml "<h2>renderedContent</h2>"

      $scope.currentCard = newCard

      ngDialog.open(
        template: '/views/editor.html'
        scope: $scope
        );

    $scope.testStopEdit = (event) ->
      $scope.isEditing = angular.element(event.target).attr('class') if not 'code'

    $scope.isEditing = true
    $scope.startEditing = () ->
      $scope.isEditing = true
      angular.element('textarea').focus()
      return