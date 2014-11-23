this.app = angular.module('prototypeAngularApp', ['placeholders.img', 'placeholders.txt', 'akoenig.deckgrid', 'duScroll', 'angular-inview']);

this.app.controller('MainCtrl', function($scope, DataService) {
  var names, randomCard, randomName;
  randomCard = function(count) {
    var i, result, _i;
    result = [];
    for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
      result.push({
        random: Math.floor(Math.random() * 100),
        name: randomName()
      });
    }
    return result;
  };
  names = ['Memory 1', 'Memory 2', 'Memory 3', 'Memory 4', 'Memory 5', 'Memory 6', 'Memory 7'];
  randomName = function() {
    return _.sample(names);
  };
  $scope.currentId = 'james';
  $scope.cards = randomCard(5);
  $scope.suggestions = DataService.getSuggestions();
  $scope.currentPerson = DataService.getPerson($scope.currentId);
  $scope.meta = DataService.getMeta($scope.currentId);
  $scope.setSuggestions = function(similarTo) {
    return $scope.suggestions = DataService.getSuggestions(similarTo);
  };
  $scope.dismiss = function(dismiss) {
    _.remove($scope.suggestions, function(item) {
      return item.title === dismiss.title;
    });
    return DataService.padSuggestion($scope.suggestions);
  };
  $scope.addSuggestionToBoard = function(add) {
    $scope.cards.push(add);
    return $scope.dismiss(add);
  };
  $scope.facts = DataService.getFacts($scope.currentId);
  $scope.resources = DataService.getResources();
  return $scope.newCard = function() {
    var something;
    something = {
      name: 'New Card'
    };
    return $scope.cards.push(something);
  };
});

this.app.directive('customDirective', function() {
  return {
    templateUrl: '/views/customView.html',
    restrict: 'E',
    link: function(scope, element, attrs) {
      return element.text('this is the customDirective directive');
    }
  };
});

this.app.service('DataService', function() {
  var cards, meta, people;
  cards = people = {
    james: {
      name: 'James Potter',
      birth: {
        date: '27 March 1960'
      },
      death: {
        date: '31 October 1981',
        place: 'England'
      },
      relationships: [
        {
          name: 'Lily Potter',
          type: 'Wife',
          id: 'lily'
        }, {
          name: 'Harry Potter',
          type: 'Son',
          relToYou: 'Your Father',
          id: 'harry'
        }
      ]
    }
  };
  meta = {
    james: {
      achievements: {
        links: 1,
        facts: 2
      },
      tasks: ['Do this', 'Do that']
    }
  };
  this.getCard = function(id) {
    return cards[id];
  };
  this.getSuggestions = function(similarTo) {
    var counter, newSuggestions, suggestions;
    suggestions = [
      {
        title: 'James\'s Upbringing',
        description: 'What was James like as a child? What kind of upbringing did he have?'
      }, {
        title: 'James\'s Birth Place',
        description: 'James is missing a birth place.'
      }, {
        title: 'James\'s Interests',
        description: 'Did James have any pasttimes or hobbies?'
      }, {
        title: 'James\'s Marriage to Lily',
        description: 'Do you know where James and Lily were married? What other details can you find?'
      }
    ];
    if (similarTo) {
      newSuggestions = [];
      counter = 0;
      _.map(suggestions, function(item) {
        item.title = "(Something similar to " + similarTo + " " + (counter++) + ")";
        return newSuggestions.push(item);
      });
      suggestions = newSuggestions;
    }
    return suggestions;
  };
  this.getResources = function() {
    return [
      {
        title: 'Ancestors at Rest - England',
        url: 'http://www.ancestorsatrest.com/england.shtml',
        description: 'Coffin plates, funeral cards, death cards, wills, memorial cards, cemeteries, vital stats, obituaries, church records, family bibles, cenotaphs and tombstone inscriptions.'
      }, {
        title: 'Certificate Exchange',
        url: 'http://www.certificate-exchange.co.uk/',
        description: 'A site for genealogists to list their unwanted documents including birth, marriage, death, adoption certificates and military records.'
      }, {
        title: 'BMD Index',
        url: 'http://www.bmdindex.co.uk/',
        description: 'BMDindex.co.uk has the index to the complete range of birth, marriage and death records (BMD) from 1837 onwards as published by the GRO - that\'s 169 years of data, or an amazing 255 million events! No other site has the range of facilities we offer and with access from only £5 our prices can\'t be beaten.'
      }, {
        title: 'English Parish Registers',
        url: 'http://www.british-genealogy.com/search.php',
        description: 'Helping you trace your British Family History & British Genealogy.'
      }
    ];
  };
  this.padSuggestion = function(suggestions) {
    return suggestions.push({
      title: '(A new suggestion here) - ' + (Math.random() + "").slice(3, 7),
      url: '',
      description: 'Is this a better suggestion?'
    });
  };
  this.getPerson = function(id) {
    return people[id];
  };
  this.getMeta = function(id) {
    return meta[id];
  };
  this.getFacts = function(id) {
    var person;
    person = this.getPerson(id);
    return {
      "Birth Date": "" + person.birth.date,
      "Birth Place": "" + person.birth.place,
      "Death Date": "" + person.death.date,
      "Death Place": "" + person.death.place
    };
  };
  return this;
});
