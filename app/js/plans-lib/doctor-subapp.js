angular.module('doctorSubapp', ['utilsApp']).controller('doctorSubappCtrl', ['$scope', '$http', '$timeout', '$q', 'utilsService',
function($scope, $http, $timeout, $q, utilsService) {
  /***************************
   * Global variables
   ***************************/
  // search term
  $scope.searchDoctor = '';
  $scope.searchResults = [];
  var searchCanceller = $q.defer();

  // $scope.$watch('searchDoctor', function(val) {
  // if (val === '') {
  // $scope.searchResults = [];
  // } else {
  // searchCanceller && searchCanceller.resolve();
  // searchCanceller = $q.defer();
  // $http.get('https://honeyinsured.com/providers/?q=' + val + '&zip=' + $scope.urlParams.zip, {
  // timeout : searchCanceller.promise
  // }).then(function(resp) {
  // var providers = resp.data.providers;
  // providers = _.map(providers, function(provider) {
  // return _.object(_.map(provider, function(v, k) {
  // if (k == 'address2') {
  // var lastIndex = v.lastIndexOf(",");
  // var s1 = v.substring(0, lastIndex);
  // var s2 = v.substring(lastIndex + 1);
  // return [k, toTitleCase(s1) + ',' + s2]
  // }
  // return [k, toTitleCase(v)]
  // }))
  // });
  // var filtered = _.filter(providers, function(p) {
  // p.address2.split(' ').splice(-1) == $scope.urlParams.zip;
  // })
  //
  // $scope.searchResults = filtered.length >= 5 ? filtered.slice(0, 5) : providers.slice(0, 5);
  // }, function(err) {
  // // testing only
  // // $.get('data/providerSearch.json', function(data) {
  // // $scope.searchResults = data.providers.slice(0, 5);
  // // });
  // });
  // }
  // });
  //

  // bind selected doctors to service
  // $scope.$watch('selectedDoctors', function(val) {
  // doctorFactory.calSelectedDoctors(val);
  // }, true)

}]).directive('selectDoctor', ['$http', '$timeout', 'utilsService',
function($http, $timeout, utilsService) {
  /*************************************
   * Pull up details page
   *************************************/
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {
      // for map
      var map,
          marker,
          center,
          bounds,
          mapEl,
          oldCache;
      var zip = scope.urlParams.zip;

      // // get bounds based on zipcode
      // $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + scope.urlParams.zip).then(function(resp) {
      // center = resp.data.results[0].geometry.location;
      // });

      // helper for title case
      var toTitleCase = function(str) {
        return String(str).replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };

      $(el).selectize({
        valueField : 'id',
        labelField : 'name',
        searchField : 'name',
        maxItems : null,
        create : false,
        closeAfterSelect : true,
        openOnFocus : false,
        hideSelected : true,
        options : [],
        render : {
          option : function(item, escape) {
            return '<div>' + '<span class="title">' + escape(item.name) + '</span>' + '<span class="text">' + escape(item.specialty) + '</span>' + '<span class="text">' + escape(item.address1) + ', ' + escape(item.address2) + '</span>' + '</div>';
          }
        },

        // score : function(search) {
          // var score = this.getScoreFunction(search);
          // console.log(score(search))
          // return function(item) {
            // if (!item.address2) {
              // return .8
            // }
            // return 1 * (item.address2.split(' ').splice(-1)[0] == zip ? 20 : .8);
          // };
        // },

        onInitialize : function() {
          if ($('.selectize-dropdown').find('.map').length == 0) {
            mapEl = $('<div class="map" data-map ></div>');
            $('.selectize-dropdown').prepend(mapEl);
          };

          // add cached providers if any
          var doctorsLookup = utilsService.getDoctorsLookup();
          scope.urlParams.profile && scope.urlParams.profile.providers && _.map(scope.urlParams.profile.providers, function(npi) {
            if (doctorsLookup[npi]) {
              $(el)[0].selectize.addOption({
                id : npi,
                name : doctorsLookup[npi]
              });
              // add silently to prevent infinite digest
              $(el)[0].selectize.addItem(npi, true);
            } else {
              $http.get('https://honeyinsured.com/providers/' + npi + '?select=providers.presentation_name').then(function(res) {
                $(el)[0].selectize.addOption({
                  id : npi,
                  name : res.data.provider.presentation_name
                });
                // add silently to prevent infinite digest
                $(el)[0].selectize.addItem(npi, true);
              });
            }
          });

        },
        onDropdownClose : function() {
          // unset event listener
          $('.selectize-dropdown-content').off('mouseenter');
          $(document).off('keydown');
          var self = $(el)[0].selectize;
          var option = self.getValue();
          _.map(self.options, function(v, k) {
            if (option.indexOf(k) == -1) {
              delete self.options[k];
            }
          });
        },
        onItemAdd : function(option, text) {
          scope.doctorsLookup[option] = text[0].innerHTML;
          // $(el)[0].selectize.clearOptions();
          // selectize_tags.addOption({
          // text : text[0].innerHTML,
          // value : option
          // });

        },
        onLoad : function() {
          $('.selectize-dropdown-content').animate({
            scrollTop : 0
          }, 0, function() {
            $(this).find('div').first().mouseover();
          });
          // oldCache =
          // need to shift selected to top
        },
        onDropdownOpen : function($dropdown) {
          if (mapEl && !map) {
            map = new google.maps.Map(mapEl[0], {
              scrollwheel : false,
              zoom : 12
            });
          }
          // allow map interaction
          $dropdown.on('mousedown click', '[data-map]', function(e) {
            if (e.preventDefault) {
              e.preventDefault();
              e.stopPropagation();
            };
          });
          $(document).on('click', '.selectize-dropdown-content>div', function(e) {
            e.preventDefault();
          });

          if ($(el)[0].selectize.lastQuery == '') {
            $(el)[0].selectize.close();
          }
          var setMarker = function(address) {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address).then(function(resp) {
              // clear previous marker
              marker && marker.setMap(null);

              if (resp.data.results[0]) {
                var location = resp.data.results[0].geometry.location;
                // add marker
                map.panTo(location);
                marker = new google.maps.Marker({
                  position : location,
                  map : map
                });
              }
            });
          };
          var triggerMarker = function() {
            _.map($('.selectize-dropdown-content>div'), function(div) {
              if ($(div).hasClass('active')) {
                var adds = $(div).find('span').slice(-2);
                setMarker(adds[0].innerHTML + ' ' + adds[1].innerHTML);
              }
            });
          };
          $('.selectize-dropdown-content').on('mouseenter', 'div', function() {
            var adds = $(this).find('span').slice(-2);
            setMarker(adds[0].innerHTML + ' ' + adds[1].innerHTML);
          });
          $(document).keydown(function(e) {
            switch(e.which) {
            case 38:
              // up
              triggerMarker();
              break;

            case 40:
              // down
              triggerMarker();
              break;

            default:
              return;
            }
            e.preventDefault();
          });
          // trigger first one
          triggerMarker();

          // fix map click issue
          // $('.selectize-dropdown>.map').click(function(e){
          // console.log(e);
          // });

        },
        onType : function(str) {
          if (str == '') {
            $(el)[0].selectize.close();
          }
        },
        load : function(query, callback) {
          if (!query.length)
            return callback();
          $.ajax({
            url : 'https://honeyinsured.com/providers/?q=' + encodeURIComponent(query) + '&zip=' + scope.urlParams.zip,
            type : 'GET',
            error : function(res) {
              console.log(res);
            },
            success : function(res) {

              var providers = _.map(res.providers.slice(0, 15), function(provider) {
                return _.object(_.map(provider, function(v, k) {
                  if (k == 'address2') {
                    var lastIndex = v.lastIndexOf(",");
                    var s1 = v.substring(0, lastIndex);
                    var s2 = v.substring(lastIndex + 1);
                    return [k, toTitleCase(s1) + ',' + s2]
                  }
                  return [k, toTitleCase(v)]
                }))
              });

              // delete query cache
              delete $(el)[0].selectize.loadedSearches[query];
              callback(providers);

            }
          });
        }
      });

      // check for cached providers
      // $timeout(function(){
      // console.log(scope.urlParams.profile.providers)
      // $(el)[0].selectize.addOption({
      // valueField : '1231313',
      // labelField : 'HI'
      // })
      // $(el)[0].selectize.addItem('1231313')
      // },1000)

    }
  }
}]).directive('map', ['$interval', '$timeout', '$http', 'doctorFactory',
function($interval, $timeout, $http, doctorFactory) {
  return {
    restrict : 'A',
    scope : false,
    link : function(scope, el, attrs) {
      var map,
          markers,
          center,
          bounds;
      // get bounds based on zipcode
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + scope.urlParams.zip).then(function(resp) {
        center = resp.data.results[0].geometry.location;
      });

      // initialize when app opens
      var initialize = function() {
        // Create a map object and specify the DOM element for display.
        !map && ( map = new google.maps.Map($(el)[0], {
          center : center,
          scrollwheel : false,
          zoom : 10
        }));
      };

      // start to geocode when providers are available
      scope.$watch('searchResults', function(providers) {
        // remove markers
        markers && _.map(markers, function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // start to geocode
        _.map(providers, function(provider, index) {
          $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + provider.address1 + provider.address2).then(function(resp) {
            var location = resp.data.results[0].geometry.location;
            // add marker
            var marker = new google.maps.Marker({
              position : location,
              label : scope.ALPHABETS[index],
              map : map
            });
            markers.push(marker)
          });
        });
      });

      $timeout(initialize, 400);

    }
  }
}]);
