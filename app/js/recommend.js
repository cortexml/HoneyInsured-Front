/***************************************
 * Check for valid params
 * Redirect to index if zip and fip not found
 ***************************************/
REQUIRED_PARAMS = ['zip', 'fip', 'state', 'profile'];
var urlParams = window.getJsonFromUrl();
try {
  _.map(REQUIRED_PARAMS, function(p) {
    if (!( p in urlParams)) {
      throw "Missing parameters";
    }
    ['profile'].indexOf(p) > -1 && (urlParams[p] = window.decodeJson(urlParams[p]));
  });
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
} catch(err) {
  window.location = '/index.html';
};

// tagging from info
$(function() {
  window.setTimeout(function() {
    var a = document.createElement('a');
    a.href = document.referrer;
    window.tagEvent('recommend', {
      referrer : document.referrer
    });
  }, 400);
});

// for tagging high quality users for retargetting
// function is called when we get shortened url from google
var tagHighQuality = function(shortUrl) {

  if (getCookie('isCorrectState') == 'true' || (getCookie('prevStates') && _.uniq(getCookie('prevStates').split(',')) == urlParams.profile.state && urlParams.profile.zip != 75001)) {
    // show phone
    $('#phone').show();

    // tag good
    window.tagEvent('good');
    window._pq = window._pq || [];
    flatProfile = _.chain(urlParams.profile.persons).map(function(p) {
      return p.age + '+' + p.smoker
    }).reduce(function(agg, num) {
      return agg + ',' + num
    }).value();
    flatProfile += '|' + urlParams.profile.size + ',' + urlParams.profile.income;
    // perfect audience
    _pq.push(['track', 'recommend'], {
      zip : urlParams.profile.zip,
      state : urlParams.profile.state,
      fip : urlParams.profile.fip,
      profile : flatProfile,
      url : shortUrl
    });
    // adroll
    try {
      __adroll.record_user({
        "adroll_segments" : "907fefc1"
      });
    } catch(err) {
    }
  }
};

var refreshOwlCarousel = function() {
  /***************************************
   * Carousel
   ***************************************/
  var owl = $(".owl-carousel");
  owl.trigger('destroy.owl.carousel');

  owl.owlCarousel({
    dots : false,
    lazyLoad : false,

    responsive : {
      0 : {
        items : 1
      },
      600 : {
        items : 2
      },
      992 : {
        items : 3
      }
    }
  });
  $(".owl-arrow-right").click(function(e) {
    owl.trigger('next.owl.carousel');
    e.stopPropagation();
  });
  $(".owl-arrow-left").click(function(e) {
    owl.trigger('prev.owl.carousel');
    e.stopPropagation();
  });
  // show or hide arrows
  owl.on('changed.owl.carousel', function(event) {
    // check end of carousel
    if (event.item.index + event.page.size == event.item.count) {
      $(".owl-arrow-right").addClass('owl-arrow-hide');
    } else {
      $(".owl-arrow-right").removeClass('owl-arrow-hide');
    }
    // check beginning of carousel
    if (event.item.index == 0) {
      $(".owl-arrow-left").addClass('owl-arrow-hide');
    } else {
      $(".owl-arrow-left").removeClass('owl-arrow-hide');
    }
  });
  var numItems = $(window).width() < 992 ? 2 : $(window).width() < 600 ? 1 : 3;
  owl.find('.panel.summary-card.card-link').length <= numItems && $(".owl-arrow-right").addClass('owl-arrow-hide');
  $(".owl-arrow-left").addClass('owl-arrow-hide');
}

angular.module('recommendApp', ['ngRoute', 'ngAnimate', 'utilsApp', 'healthcostSubapp', 'uninsuredSubapp', 'visualizationSubapp']).value('CONSTANTS', {
  'BENEFITS' : {
    'Basic' : [['Primary Visit', 47], ['Generic Rx', 18], ['Emergency Room Services', 15]],
    'Doctors' : [['Primary Visit', 47], ['Specialist', 59], ['Preventive Care', 46]],
    'Drugs' : [['Generic Rx', 18], ['Preferred Brand', 44], ['Non-preferred Brand', 35], ['Specialty', 60]],
    'Emergency' : [['Emergency Room Services', 15], ['Emergency Transportation', 16]],
    'Inpatient' : [['Hospital Stay', 26], ['Surgeon', 27]],
    'Tests' : [['Laboratory', 28], ['X-rays', 68], ['Imaging', 23]]
  },
  'BENEFITS_OTHER' : {
    'Outpatient' : [['Facility', 41], ['Surgery', 43]],
    'Pregnancy' : [['Prenatal and Postnatal', 45], ['Well Baby Visits and Care', 67], ['Delivery + Inpatient Maternity Care', 10]],
    'Mental Health' : [['Outpatient Services', 33], ['Inpatient Services', 32]],
    'Dental' : [['Accidental', 1], ['Basic Dental - Adult', 5], ['Basic Dental - Child', 6]],
  },
  'DRUGS' : ['Generic Rx', 'Preferred Brand', 'Non-preferred Brand', 'Specialty'],
  'recommended' : 'We recommended this plan based on your preferences'
  // 'TAGS_TITLE':{
  // 'recommended':{order:1}
  // 'combined':
  // 'premium':
  // 'network':
  // }

}).controller('recommendCtrl', ['$scope', '$http', '$q', '$timeout', 'CONSTANTS', 'utilsService', '$location', 'UTILS_CONSTANTS',
function($scope, $http, $q, $timeout, CONSTANTS, utilsService, $location, UTILS_CONSTANTS) {

  /****************************************
   * Register Constants
   ****************************************/
  $scope.CONSTANTS = CONSTANTS;
  $scope.CONSTANTS.DEFINITIONS = UTILS_CONSTANTS.DEFINITIONS;
  $scope.CONSTANTS.COMBINED_BENEFITS = _.defaults(_.clone(CONSTANTS.BENEFITS), CONSTANTS.BENEFITS_OTHER);
  $scope.urlParams = urlParams;

  /***************************************
   * Check hash
   ***************************************/
  $scope.plans = null;
  $scope.planSelected = null;
  $scope.similarPlans = null;
  $scope.doctorsLookup = utilsService.getDoctorsLookup();
  $scope.error = null;
  var ERROR_TEXT = 'Oops our HoneyInsured bot found an error. Please contact us via support@honeyinsured.com or chat and we will assist you as soon as possible!';
  var getDoctor = function(npi) {
    if (!$scope.doctorsLookup[npi]) {
      return $http.get('https://honeyinsured.com/providers/' + npi + '?select=providers.presentation_name').then(function(res) {
        $scope.doctorsLookup[npi] = res.data.provider.presentation_name;
      });
    }
  }
  var getPlans = function(callback, failure) {
    urlParams.profile.providers && _.map(urlParams.profile.providers, function(npi) {
      getDoctor(npi);
    });
    $http.get(utilsService.RECOMMEND_ENDPOINT + window.encodeJson(urlParams.profile)).then(function(res) {
      $scope.plans = res.data;
      /**********************************
       * Plans array for carousel
       **********************************/
      $scope.similarPlans = _.sortBy(_.filter($scope.plans, function(plan) {
        return plan.tags && plan.tags.indexOf('handpicked') > -1
      }), function(plan) {
        return plan.premium
      });
      $scope.hsaPlans = _.sortBy(_.filter($scope.plans, function(plan) {
        return plan.hsa
      }), function(plan) {
        return plan.premium
      });
      $scope.doctorPlans = _.sortBy(_.filter($scope.plans, function(plan) {
        return plan.providers && plan.providers.length
      }), function(plan) {
        return plan.premium
      });

      callback();
    }, function(fail) {
      if (!failure) {
        $scope.error = ERROR_TEXT;
        window.reportBug('recommend plans not found', JSON.stringify(fail));
      } else {
        // try twice
        failure();
      }
    });
  };
  var setPlanSelected = function(id) {
    var recommended = _.first(_.filter($scope.plans, function(plan) {
      return plan.tags && plan.tags.indexOf('recommended') > -1
    }));
    selected = recommended;
    id && ( selected = _.first(_.filter($scope.plans, function(plan) {
      return plan.id == id
    })));
    // show default if url is wrong
    !selected && ( selected = recommended);

    if (selected) {
      // ensure that all doctors are ready
      $q.all(_.chain(selected.providers).map(function(npi) {
        return getDoctor(npi)
      }).compact().value()).then(function() {
        $scope.planSelected = selected;
        $scope.error = null;
      }, function() {
        $scope.error = ERROR_TEXT;
        window.reportBug('recommend doctors not found');
      });
    } else {
      $scope.error = ERROR_TEXT;
      window.reportBug('recommend selected plan not found');
    }
  };
  $scope.$watch(function() {
    return $location.hash();
  }, function(val) {
    // check if has plans
    if (!$scope.plans) {
      getPlans(function() {
        setPlanSelected(val);
      }, function() {
        getPlans(function() {
          setPlanSelected(val);
        });
      });
    } else {
      $scope.planSelected = null;
      $timeout(function() {
        setPlanSelected(val);
      }, 600);
    }
  });

  /***************************************
   * Parsing benefits
   ***************************************/
  $scope.parseBenefit = function(str) {
    return str.trim() == 'Full' ? 'the full amount' : str;
  };
  // do not show benefit category if we don't have data
  $scope.hasBenefit = function(name) {
    return !_.every(CONSTANTS.COMBINED_BENEFITS[name], function(val) {
      return !$scope.planSelected.benefit[val[1]]
    });
  };
  // tooltip for compare
  $scope.getBenefitText = function(bs, name) {
    if (!bs) {
      return
    }
    if (bs.indexOf('/') == -1) {
      return "You will pay " + $scope.parseBenefit(bs);
    } else {
      var isDrugDed = $scope.CONSTANTS.DRUGS.indexOf(name) > -1 && +$scope.planSelected.drugDed;
      return 'Before spending $' + ( isDrugDed ? $scope.planSelected.drugDed : $scope.planSelected.medDed) + ' on ' + ( isDrugDed ? 'drugs' : 'healthcare') + ', you pay ' + $scope.parseBenefit(bs.split('/')[0]) + '. Afterwards, you pay ' + $scope.parseBenefit(bs.split('/')[1]) + '.';
    }
  };

  /***************************************
   * Doctors tags
   ***************************************/
  $scope.doctors = {
    total : urlParams.profile.providers ? urlParams.profile.providers.length : 0,
  };
  $scope.showNetworkSize = false;
  var oneTimeDoctor = $scope.$watch('plans', function(val) {
    if (val) {
      $scope.doctors.covered = _.chain(val).pluck('providers').reduce(function(agg, num) {
        return agg.concat(num)
      }, []).uniq().value().length;
      // $scope.showNetworkSize = _.every(_.pluck(val,'network'));
      oneTimeDoctor();
    }
  });

  /***************************************
   * Navigation
   ***************************************/
  $scope.goBack = function(hash) {
    var query = location.search.substr(1) + hash;
    // redirect to info page
    window.location = '/info.html?' + query;
  };
  $scope.selectPlan = function(plan) {
    window.tagEvent('change plan', {
      plan : plan.name
    });
    $location.hash(plan.id);
  };
  $scope.enroll = function(plan, evt) {
    evt.stopPropagation();

    // save plan in browser session
    utilsService.savePlan(plan);

    var query = location.search.substr(1);
    query += '&plan=' + plan.id;

    // redirect to enroll page
    window.location = '/enroll.html?' + query;
  };

  /***************************************
   * Other Plans
   ***************************************/
  $scope.selectedSimilar = 'Handpicked';
  $scope.$watch('selectedSimilar', function() {
    $timeout(refreshOwlCarousel, 0);
  });

  /**************************************
   * for scrolling to all and suitable plans
   **************************************/
  $scope.scrollSuitable = function() {
    if ($('button.navbar-toggle').is(':visible')) {
      $('button.navbar-toggle').click();
    }
    var height = $(window).width() > 991 ? 55 : 55 + $('#enroll-banner').height();
    $('#suggestions').animatescroll({
      padding : height
    });
  };
  $scope.scrollAll = function() {
    if ($('button.navbar-toggle').is(':visible')) {
      $('button.navbar-toggle').click();
    }
    var height = $(window).width() > 991 ? 55 : 55 + $('#enroll-banner').height();
    $('#allPlans').animatescroll({
      padding : height
    });

  };

  /***************************************
   * Trigger Plan Comparison
   ***************************************/
  $scope.planCompare = null;
  $scope.triggerPlanCompare = function(planCompare) {
    $scope.planCompare = planCompare;
    window.tagEvent('compare', {
      current : $scope.planSelected.name,
      other : $scope.planCompare.name
    });
    $('#compare').modal('show');
  };

  /***************************************
   * Cache people's email!
   ***************************************/
  $scope.triggerSendPage = function() {
    if ($('button.navbar-toggle').is(':visible')) {
      $('button.navbar-toggle').click().blur();
    }
    $('#modal-title').html('Email Me This Page');
    $('#modal-content').html("Thanks for trying to find the best insurance for you and your honeys! <span class = 'glyphicon glyphicon-heart red'></span> To save your search, please type in your email and we'll send you a link to this page.");
    $('#modal-link').show();
    $('#email').modal('show');

  };
  // var firstTrigger = $scope.$watch('planSelected', function(val) {
  // if (val) {
  // $timeout(function() {
  // // get referrer
  // var a = document.createElement('a');
  // a.href = document.referrer;
  // // only show if came in from info.js
  // if (a.pathname == '/info.html') {
  // $('#modal-title').html('Save Your Preferences for Open Enrollment');
  // $('#modal-content').html("Thanks for trying to find the best insurance for you and your honeys! <span class = 'glyphicon glyphicon-heart red'></span> Open enrollment starts Nov 1st and we're currently showing 2015 plans. Please type in your email and we'll send you an updated 2016 recommendation on Nov 1st.");
  // $('#modal-link').hide();
  // $('#email').modal('show');
  // }
  // }, 2000);
  // firstTrigger();
  // }
  // });
  // $('#modal-form').validate({
  // success : function(element) {
  // alert('hi');
  // }
  // });
  $('#modal-submit').click(function() {
    // check email
    var email = $('#modal-input').val();
    if (utilsService.isValidEmail(email) && email.indexOf(',') == -1) {

      // email plan
      if ($('#modal-title').html() == 'Email Me This Page') {
        utilsService.emailPlan(email, {
          name : $scope.planSelected.name,
          premium : $scope.planSelected.premium,
          issuer : $scope.planSelected.issuer,
          moop : $scope.planSelected.moop,
          medDed : $scope.planSelected.medDed
        }, $scope.shortUrl);
      } else {
        window.updateUser('notify 2016', email);
      }
      // close modal
      $('#email').modal('hide');
    }
  });

  /***************************************
   * Url generation
   ***************************************/
  $scope.shortUrl = '';
  var cachedShortUrl = {};
  $scope.$watch(function() {
    return window.location.href;
  }, function(currentUrl) {
    if (!cachedShortUrl[currentUrl]) {
      utilsService.getShortUrl().then(function(link) {
        cachedShortUrl[currentUrl] = link;
        $scope.shortUrl = link;
        tagHighQuality(link);
      });
    } else {
      $scope.shortUrl = cachedShortUrl[currentUrl];
    }
  });

}]).directive('explanation', ['$http', '$timeout',
function($http, $timeout) {
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {

      var titleCase = function(input) {
        return input.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
      // attach watchers to the see benefits, network and accident links
      $('body').on('click', '#seeBenefits', function() {
        var height = $(window).width() > 991 ? 30 : 56;
        $('#sectionBenefits').animatescroll({
          padding : height
        });
      });
      $('body').on('click', '#seeAccident', function() {
        var height = $(window).width() > 991 ? 55 : 110;
        $('#sectionAccident').animatescroll({
          padding : height
        });
      });
      $('body').on('click', '#seeNetwork', function() {
        var height = $(window).width() > 991 ? 55 : 110;
        $('#sectionNetwork').animatescroll({
          padding : height
        });
      });

      scope.$watch('planSelected', function(val) {
        if (!val) {
          return
        }

        // cost
        var pointers = [];
        pointers.push('<span class = "text-bold orange">$' + Math.round(val.premium) + '/mo</span> is what you pay for this insurance plan.');
        var planHealthcost = val.healthcost.drugcost + val.healthcost.medcost;
        pointers.push('<span class = "text-bold orange">$' + Math.round(planHealthcost / 12.) + '/mo</span> or $' + Math.round(planHealthcost) + "/yr is the expected amount you will spend on healthcare besides insurance costs. This is based on your expected 2016 healthcare spendings.");

        // deductible & moop
        pointers.push('<span class = "text-bold orange">$' + val.medDed + '</span> (Deductible) is generally what you need to spend on healthcare first before the insurance company begins to pay. <a id="seeBenefits">See benefits</a>');
        pointers.push('<span class = "text-bold orange">$' + val.moop + '</span> (Max Out Of Pocket) is the most you ever have to pay for healthcare besides insurance costs. <a id="seeAccident">See accident coverage</a>')
        pointers.push('<span class = "text-bold orange">' + val.type + '</span> means ' + scope.CONSTANTS.DEFINITIONS[val.type].replace("You", "you") + (scope.showNetworkSize ? ' <a id="seeNetwork">See doctor network</a>' : ''));

        // doctors
        if (scope.doctors.total > 0 && val.providers) {
          if (scope.doctors.covered == 0) {
            pointers.push('<span class = "text-bold orange">None</span> of the plans cover your doctors.');
          } else if (val.providers.length == 0) {
            pointers.push('<span class = "text-bold orange">None</span> of your doctors are covered by this plan.');
          } else if (val.providers.length == scope.doctors.total) {
            pointers.push('<span class = "text-bold orange">All</span> of your doctors are covered by this plan.');
          } else {
            var doctorString = '<span class = "text-bold orange">' + val.providers.length + '</span> of your doctors are covered by this plan: ';
            val.providers.length == 1 && doctorString.replace('your doctors are', 'your doctors is');
            _.map(val.providers, function(doctor) {
              doctorString += titleCase(scope.doctorsLookup[doctor]) + ', ';
            });
            doctorString = doctorString.slice(0, -2);
            pointers.push(doctorString);
          }
        }
        _.map(pointers, function(pointer) {
          $(el).append('<li>' + pointer + '</li>');
        });
      });

    }
  }
}]).directive('network', ['$http', '$timeout',
function($http, $timeout) {
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {

      // template for bubble size
      var createTemplate = function(issuer, providerNum, maxSize, minSize, isRecommended) {
        var TEMPLATE = '<li class = "col-sm-3 col-xs-6"><div class = "card-link RECOMMENDED"><div class  ="container-circle row-top-15"><div class = "circle" style = "height: BUBBLE_SIZEpx; width: BUBBLE_SIZEpx;" ></div></div><p class = "row-top-15 detail">PROVIDER_NUM doctors</p><p class = "network-name" >ISSUER</p></div></li>';
        var cleanProviderNum = providerNum > 1000 ? Math.round(providerNum / 1000.) + 'K' : providerNum;
        var bubbleSize = maxSize == minSize ? 70 : ((providerNum - minSize) / (maxSize - minSize) * 30 + 40);
        return $(TEMPLATE.replace('ISSUER', issuer).replace('PROVIDER_NUM', cleanProviderNum).replace('RECOMMENDED', isRecommended ? 'card-recommended' : '').replace(/BUBBLE_SIZE/g, bubbleSize));
      };

      // generate ranking
      scope.$watch('planSelected', function(val) {

        if (!val) {
          return
        };

        // calculate all networks
        var networks = _.chain(scope.plans).filter(function(plan) {
          return plan.network
        }).map(function(plan) {
          // uniq don't work with arrays
          return plan.issuer + '----' + plan.network;
        }).uniq().sortBy(function(x) {
          return parseInt(x.split('----')[1]);
        }).value();
        networks.reverse();

        // remove previous content
        $(el).contents().remove();

        var index = networks.indexOf(val.issuer + '----' + val.network);
        if (index == -1) {
          scope.showNetworkSize = false;
          return
        }

        scope.showNetworkSize = true;

        var ORDER_NETWORK = {
          0 : 'first',
          1 : 'second ',
          2 : 'third '
        };
        scope.networkIndex = ( index in ORDER_NETWORK ? ORDER_NETWORK[index] : (index + 1 + 'th '));

        // convert back
        networks = _.map(networks, function(n) {
          return [n.split('----')[0], parseInt(n.split('----')[1])];
        });
        var maxSize = networks[0][1];
        if (index < 4) {
          var smallestIndex = _.min([3, networks.length - 1])
          var minSize = networks[smallestIndex][1];

          _.map(networks.slice(0, smallestIndex + 1), function(n, i) {
            var repeats = _.filter(networks.slice(0, i), function(net) {
              return net[0] == n[0]
            }).length;
            $(el).append(createTemplate(n[0] + ( repeats ? (' Network ' + (repeats + 1)) : ''), n[1], maxSize, minSize, index == i));
          });
        } else {
          var minSize = networks[index][1];
          _.map(networks.slice(0, 2), function(n, i) {
            var name = n[0];
            i == 1 && name == networks[0][0] && (name += ' Network 2');
            $(el).append(createTemplate(name, n[1], maxSize, minSize, index == i));
          });
          // append ellipsis
          $(el).append($('<li class = "col-sm-3 col-xs-6"><div class = "card-link center-vertical" ><h1 style = "margin-top:25px; height: 155px;">...</h1></div></li>'));
          // attach current plan
          var repeats = _.filter(networks.slice(0, 2), function(net) {
            return net[0] == networks[index][0]
          }).length;
          $(el).append(createTemplate(networks[index][0] + ( repeats ? (' Network ' + (repeats + 1)) : ''), networks[index][1], maxSize, minSize, true));
        }
      });
    }
  }

}]).directive('mainContent', ['$http', '$timeout',
function($http, $timeout) {
  /*************************************
   * ensure carousel and sticky is loaded
   *************************************/
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {

      var loadJS = function() {

        var enrollSticky;
        var createEnrollSticky = function() {
          return new Waypoint.Sticky({
            element : document.getElementById('enroll-panel'),
            wrapper : false,
            handler : function(direction) {
            },
            offset : 55
          })
        };

        var enrollStickyBottom;
        var createEnrollStickyBottom = function() {
          return new Waypoint({
            element : document.getElementById('suggestions'),
            wrapper : false,
            handler : function(direction) {
              if (direction == 'down') {
                // 500 is margin of error
                if ($(window).scrollTop() > 500) {
                  $('#enroll-panel').removeClass('stuck');
                  $('#enroll-panel').addClass('bottom');
                  $('#enroll-panel').css({
                    'top' : $("#suggestions").offset().top - $('#enroll-panel').outerHeight() - 250
                  });
                }
              } else {
                $('#enroll-panel').removeClass('bottom');
                $('#enroll-panel').addClass('stuck');
                $('#enroll-panel').css({
                  'top' : ''
                });
              }
            },
            offset : function() {
              return 80 + $('#enroll-panel').outerHeight();
              //25px padding + 55px height of navbar
            }
          })
        };

        var enrollBanner;
        var createEnrollBanner = function() {
          return new Waypoint({
            element : document.getElementById('enroll-panel'),
            wrapper : false,
            handler : function(direction) {
              if (direction == 'down' && $(window).scrollTop() > 500) {

                $('#enroll-banner').addClass('stuck');
              } else {
                $('#enroll-banner').removeClass('stuck');
              }
            },
            offset : function() {
              return -this.element.clientHeight + 55;
            }
          })
        };

        var checkSticky = function() {
          if ($(window).width() > 991) {

            !enrollSticky && ( enrollSticky = createEnrollSticky());
            !enrollStickyBottom && ( enrollStickyBottom = createEnrollStickyBottom());

            enrollBanner && (enrollBanner.destroy(),
            enrollBanner = null);

          } else {
            $('#enroll-panel').removeClass('bottom');
            $('#enroll-panel').removeClass('stuck');
            $('#enroll-panel').css({
              'top' : ''
            });

            enrollStickyBottom && (enrollStickyBottom.destroy(),
            enrollStickyBottom = null);
            enrollSticky && (enrollSticky.destroy(),
            enrollSticky = null);

            !enrollBanner && ( enrollBanner = createEnrollBanner());

          }
        };

        checkSticky();
        $(window).resize(function() {
          checkSticky();
        });

        /***************************************
         * Carousel
         ***************************************/
        refreshOwlCarousel();
      };

      /************************************
       * Run sticky and carousel code
       ************************************/
      scope.$watch(function() {
        return $(el).is(':visible');
      }, function(val) {
        val && $timeout(loadJS, 400);

        // val && !firstTime && $timeout(function() {
        // alert('hithere')
        // $('#enroll-panel').css({
        // 'top' : ''
        // });
        // $('#enroll-panel').removeClass('bottom');
        // $('#enroll-panel').removeClass('stuck');
        //
        // }, 400);

      })
    }
  }
}]);

