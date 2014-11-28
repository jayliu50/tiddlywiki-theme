this.app = angular.module('prototypeAngularApp', ['placeholders.img', 'placeholders.txt', 'akoenig.deckgrid', 'duScroll', 'angular-inview', 'ngDialog', 'xeditable']);

this.app.controller('MainCtrl', function($scope, DataService, ngDialog, $sce, $filter) {
  var dialog, openDialog;
  $scope.cards = [];
  $scope.currentCard = null;
  dialog = null;
  openDialog = function() {
    return ngDialog.open({
      template: 'views/editor.html',
      scope: $scope,
      closeByDocument: false
    });
  };
  $scope.backupCard = null;
  $scope.editNewCard = function(data) {
    if (data == null) {
      data = {};
    }
    $scope.dirty = false;
    $scope.currentCard = data;
    return openDialog().closePromise.then(function(data) {
      var card;
      card = data.$dialog.scope().currentCard;
      if (!(data.value === 'discard' || (card == null) || _.isEmpty(card))) {
        return $scope.cards.unshift(card);
      }
    });
  };
  $scope.openOrCreate = function(pageTitle) {
    var cardIndex;
    cardIndex = _.findIndex($scope.cards, {
      title: pageTitle
    });
    if (cardIndex !== -1) {
      return $scope.editCard($scope.cards[cardIndex]);
    } else {
      $scope.dirty = true;
      return $scope.editNewCard({
        title: pageTitle
      });
    }
  };
  $scope.hints = {
    'Headers': {
      example: '!! Heading 2',
      explanation: 'This will create a 2nd level heading called "Heading 2". (The two ! marks signify 2nd level, three !s signify 3rd level, and so on)'
    },
    'Link (Internal)': {
      example: '[[Your Page]]',
      explanation: 'This will create a link to "Your Page", even if it does not yet exist'
    },
    'Link (External)': {
      example: '[[Some other page|http://thatotherpage.com]]',
      explanation: 'This will create link to a page on the Internet'
    }
  };
  $scope.editCard = function(card, $event) {
    if ($event && $event.target.tagName === 'A') {
      return;
    }
    $scope.backupCard = _.cloneDeep(card);
    $scope.dirty = false;
    $scope.currentCard = card;
    return openDialog().closePromise.then(function(data) {
      if (data.value === 'discard') {
        return angular.extend(card, data.$dialog.scope().backupCard);
      }
    });
  };
  $scope.showHint = false;
  $scope.setHint = function(hint) {
    $scope.currentHint = hint;
    $scope.showHint = hint != null;
  };
  $scope.noCards = function() {
    _.compact($scope.cards);
    return _.isEmpty($scope.cards);
  };
  $scope.makeDirty = function() {
    return $scope.dirty = true;
  };
  return $scope.deleteCard = function() {
    var currentCard;
    _.remove($scope.cards, currentCard);
    return currentCard = null;
  };
});

this.app.directive('compile', function($compile) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return scope.$watch((function(scope) {
        return scope.$eval(attrs.compile);
      }), function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      });
    }
  };
});

this.app.filter('wikitext', function($sce) {
  return function(input) {
    var html;
    if (!input) {
      return;
    }
    html = input;
    html = html.replace(/^!!!([^\r\n]*)$/mg, '<h4>$1</h4>');
    html = html.replace(/^!!([^\r\n]*)$/mg, '<h3>$1</h3>');
    html = html.replace(/^!([^\r\n]*)$/gm, '<h2>$1</h2>');
    html = html.replace(/\[\[([^|]+)\]\]/gm, "<a ng-click=\"mother.openOrCreate('$1')\">$1</a>");
    html = html.replace(/\[\[([^|]+)\|([^|]+)\]\]/gm, "<a href='$2' target='_blank'>$1</a>");
    return $sce.trustAsHtml(html);
  };
});

this.app.service('DataService', function() {
  var cards;
  cards = this.getCard = function(id) {
    return cards[id];
  };
  return this;
});
