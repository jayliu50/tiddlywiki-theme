this.app = angular.module('prototypeAngularApp', ['placeholders.img', 'placeholders.txt', 'akoenig.deckgrid', 'duScroll', 'angular-inview', 'ngDialog', 'xeditable']);

this.app.controller('MainCtrl', function($scope, DataService, ngDialog, $sce, $filter) {
  var dialog, openDialog;
  $scope.cards = [];
  $scope.currentCard = null;
  dialog = null;
  openDialog = function() {
    return ngDialog.open({
      template: 'views/editor.html',
      scope: $scope
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
  $scope.openOrCreate = function(cardTitle) {
    var cardIndex;
    cardIndex = _.findIndex($scope.cards, {
      title: cardTitle
    });
    if (cardIndex !== -1) {
      return $scope.editCard($scope.cards[cardIndex]);
    } else {
      $scope.dirty = true;
      return $scope.editNewCard({
        title: cardTitle
      });
    }
  };
  $scope.hints = {
    'Headers': {
      example: '!! My Cat',
      explanation: 'This will create a 2nd level heading called "My Cat". (The two ! marks signify a 2nd level header, three !s signify 3rd level, and so on)'
    },
    'Link (Internal)': {
      example: '[[Adorable Pets]]',
      explanation: 'This will create a link to a card called "Adorable Pets", even if it does not yet exist'
    },
    'Link (External)': {
      example: '[[additional information on cats|http://cats.com]]',
      explanation: 'This will make the text "additional information on cats" link to "http://cats.com"'
    }
  };
  $scope.editCard = function(card, $event) {
    var _ref;
    if ($event && ((_ref = angular.element($event.target).closest('a').get(0)) != null ? _ref.tagName : void 0) === 'A') {
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
  return $scope.deleteCard = function(card) {
    if (card == null) {
      card = $scope.currentCard;
    }
    _.remove($scope.cards, card);
    return $scope.currentCard = null;
  };
});

this.app.directive('compile', function($compile, $filter) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      return scope.$watch((function(scope) {
        return scope.$eval(attrs.compile);
      }), function(value) {
        element.html(($filter('wikitext')(value)).valueOf());
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
    html = html.replace(/^!!!!([^\r\n]*)$/mg, '<h5>$1</h5>');
    html = html.replace(/^!!!([^\r\n]*)$/mg, '<h4>$1</h4>');
    html = html.replace(/^!!([^\r\n]*)$/mg, '<h3>$1</h3>');
    html = html.replace(/^!([^\r\n]*)$/gm, '<h2>$1</h2>');
    html = html.replace(/\[\[([^|\]]+)\]\]/gm, "<a ng-click=\"mother.openOrCreate('$1')\">$1</a>");
    html = html.replace(/\[\[([^|\]]+)\|([^|]+)\]\]/gm, "<a href='$2' target='_blank'>$1</a>");
    html = html.replace(/\r\n\r\n/gm, '<br>');
    html = html.replace(/\n\n/gm, '<br>');
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
