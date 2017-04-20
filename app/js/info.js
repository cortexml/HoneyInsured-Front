/***************************************
 * Check for valid params
 * Redirect to index if zip and fip not found
 ***************************************/
REQUIRED_PARAMS = ['zip', 'fip', 'state'];
var urlParams = window.getJsonFromUrl();
try {
  _.map(REQUIRED_PARAMS, function(p) {
    if (!( p in urlParams)) {
      throw "Missing parameters";
    }
  });
  if (urlParams['profile']) {
    urlParams['profile'] = window.decodeJson(urlParams['profile']);

    // check persons
    _.map(urlParams.profile.persons, function(person) {
      if (!+person.age) {
        throw "Incorrect persons";
      }
    });

    // double check zip, fip with those encoded in plan
    if (!(urlParams.profile.fip == urlParams.fip && urlParams.profile.zip == urlParams.zip)) {
      throw "Incorrect zip or fip";
    }
  };

} catch(err) {
  window.location = '/index.html';
};

// tagging from main page
$(function() {

  var checkShowPhone = function() {
    if (getCookie('isCorrectState') == 'true' || (getCookie('prevStates') && _.uniq(getCookie('prevStates').split(',')) == urlParams.profile.state && urlParams.profile.zip != 75001)) {
      $('#phone').show();
    }
  }
  checkShowPhone();

  window.setTimeout(function() {
    var a = document.createElement('a');
    a.href = document.referrer;
    if (a.pathname == '/' || a.pathname == '/index.html') {
      window.recordZipcode(urlParams.zip, urlParams.state, true, true);
      // check if there is a state mismatch
      $.get("https://telize.com/geoip", function(data) {
        if (data && data.region_code) {
          if (data.region_code != urlParams.state) {
            window.tagEvent('Incorrect State', {
              ip : data.region_code,
              state : urlParams.state
            });
            setCookie('isCorrectState', false, 365);
            checkShowPhone();
          } else {
            window.tagEvent('Correct State', {
              state : urlParams.state
            });
            setCookie('isCorrectState', true, 365);
            checkShowPhone();
          }
        }
      });
    }
  }, 400);
});

/****************************************
 * Angular
 ****************************************/
angular.module('infoApp', ['ngRoute', 'ngAnimate', 'utilsApp', 'basicinfoSubapp', 'doctorSubapp', 'healthcostSubapp']).controller('infoCtrl', ['$scope', '$http', '$timeout', 'utilsService', '$location', 'CONSTANTS',
function($scope, $http, $timeout, utilsService, $location, CONSTANTS) {

  /****************************************
   * Register Constants
   ****************************************/
  $scope.urlParams = urlParams;
  $scope.profile = {
    "displayPersons" : [],
    "fip" : urlParams.fip,
    "preference" : {
      "risk" : null,
      "network" : null
    },
    "zip" : urlParams.zip,
    "providers" : null,
    "healthcost" : {
      "59" : 88.60397397565806,
      "26" : 0.36752214780489256,
      "15" : 33.19,
      "47" : 1800.6405196428811,
      "46" : 1180.4233039917362,
      "18" : 133.69331581989655,
      "44" : 1036.001286877423,
      "28" : 64.2704438861565,
      "43" : 63.990083049535386,
      "68" : 64.2704438861565
    },
    "numPerson" : null,
    "income" : '',
    "state" : urlParams.state,
    "size" : null
  };

  // check if profile is passed in from params
  urlParams.profile && _.map($scope.profile, function(v, k) {
    k == 'displayPersons' && urlParams.profile['persons'] && ($scope.profile[k] = urlParams.profile.persons);
    k != 'displayPersons' && urlParams.profile[k] && ($scope.profile[k] = urlParams.profile[k]);
  });
  $scope.doctorsLookup = {};

  /****************************************
   * Custom routing based on hash
   ****************************************/
  var hashImpliedTemplateIndex = CONSTANTS.HASHKEYS.indexOf($location.hash());
  $scope.templateIndex = hashImpliedTemplateIndex > -1 ? hashImpliedTemplateIndex : 0;
  $scope.$watch('templateIndex', function(val) {
    $location.hash(CONSTANTS.HASHKEYS[val]);
  });
  $scope.$on('$locationChangeStart', function(event) {
    // check hash location validity
    if ($location.hash() && CONSTANTS.HASHKEYS.indexOf($location.hash()) > -1) {
      var count = 0;
      // ensure that all previous templates are filled up
      _.map(CONSTANTS.HASHREQS.slice(0, CONSTANTS.HASHKEYS.indexOf($location.hash())), function(ks, index) {
        if (index != count) {
          return
        }
        _.every(ks, function(k) {
          return k in $scope.profile;
        }) && count++;
      });

      $scope.templateIndex = count;
      window.tagEvent('info-' + $location.hash());
      $location.search('profile', window.encodeJson(_.object(_.clone(_.filter(_.pairs($scope.profile), function(x) {
        return x[0] != 'displayPersons'
      })))));

      // event.preventDefault();
    }
  });
  $scope.goToRecommend = function() {
    // save doctorsLookup in cookie
    utilsService.saveDoctorsLookup($scope.doctorsLookup);

    // go to recommend page
    var query = location.search.substr(1);
    query.indexOf('&profile=') > -1 && ( query = query.slice(0, query.indexOf('&profile=')));
    // add profile
    query += '&profile=' + window.encodeJson(_.object(_.clone(_.filter(_.pairs($scope.profile), function(x) {
      return x[0] != 'displayPersons'
    }))));

    // redirect to enroll page
    window.location = '/recommend.html?' + query;
  }
  $scope.next = function() {
    if ($scope.templateIndex + 1 < CONSTANTS.HASHKEYS.length) {
      $scope.templateIndex++;
      // scroll to top
      $('html,body').animate({
        scrollTop : 0
      }, 400);
    } else {
      $scope.goToRecommend();
    }
  }
  $scope.back = function() {
    if ($scope.templateIndex > 0) {
      $scope.templateIndex--;
      // scroll to top
      $('html,body').animate({
        scrollTop : 0
      }, 400);
    }
  };

  $scope.canRecommend = function() {
    // hasCompletedInfo is defined in infoSubapp for parent scope
    return $scope.hasCompletedInfo && $scope.urlParams.profile;
  };

  /****************************************
   * No need to cache private quotes
   ****************************************/
  // cache private quotes info
  // $scope.$watch(function() {
  // return $scope.profile.persons
  // }, function(val) {
  // $scope.hasCompletedInfo && $http.post(utilsService.CACHEQUOTES_ENDPOINT + window.encodeJson($scope.profile));
  // });

  /****************************************
   * Preferences page
   ****************************************/
  // set risk preference
  $scope.setRisk = function(risk) {
    $scope.profile.preference.risk = risk;
    $scope.next();
  };
  // set network preference
  $scope.setNetwork = function(network) {
    $scope.profile.preference.network = network;
    $scope.next();
  };

  /****************************************
   * Healthcost page
   ****************************************/
  // grammar for explaining typical family
  $scope.familyString = '';
  var getFamilyExplanation = function() {
    var NUMBERWORDS = ['', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    var s = '';
    var ages = _.chain($scope.profile.persons).pluck('age').sortBy().countBy().pairs().value();
    ages.reverse();
    s += _.reduce(_.map(ages, function(vs, index) {
      var sub = '';
      if (index == ages.length - 1 && index > 0) {
        sub = ' and '
      }
      sub += (vs[1] == 1 ? 'a ' : (NUMBERWORDS[vs[1]] + ' '));
      sub += (vs[0] + (vs[1] == 1 ? '-year-old, ' : '-year-olds, '));
      if (index == ages.length - 2) {
        sub = sub.slice(0, -2) + ' ';
      }
      return sub
    }), function(agg, num) {
      return agg + num
    }, '');
    s = s.slice(0, -2) + '.'
    $scope.familyString = s;
  }
  $scope.$watch('profile.persons', getFamilyExplanation, true)

}]).config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode({
    enabled : true,
    requireBase : false
  }).hashPrefix('!');
}]).value('CONSTANTS', {
  HASHKEYS : ['info', 'pref', 'network', 'doctor', 'health'],
  HASHREQS : [['persons', 'zip', 'fip', 'income', 'state', 'size'], ['preference'], ['preference'], ['providers'], ['healthcost']]
});
