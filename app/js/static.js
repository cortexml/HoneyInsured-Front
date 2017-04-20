/*************************
 * Preload bg
 *************************/
$('<img/>').attr('src', '/img/hero.png');

/*************************
 * Onload Jquery
 *************************/
$(function() {

  if (window.location.pathname == '/' || window.location.pathname == '/index.html') {

    // header
    $('.navbar.navbar-default').removeClass('navbar-fixed-top navbar-small').addClass('navbar-top');

    // carousel classes
    $('.carousel-features>li').on('click', function() {
      $('#carousel-content').carousel($(this).index());
    });
    $('#carousel-content').on('slide.bs.carousel', function(e) {
      var video = $(e.relatedTarget).find('video')
      var index = $('#carousel-content').find('video').index(video);
      var details = $('.carousel-features>li');
      details.removeClass('active');
      $(details[index < 0 ? details.length + index : index]).addClass('active');
      video.get(0).pause();
      video.get(0).currentTime = 0;
    });
    $('#carousel-content').on('slid.bs.carousel', function(e) {
      var video = $(".active", e.target).find('video');
      video.get(0).play();
    });

    var getWaypointOptions = function(el) {
      return {
        element : el[0],
        handler : function(direction) {
          $('.ribbon-hero') == el
          // use of == is to ensure boolean logic
          if ($('.ribbon-hero').is(":visible") == $('.ribbon-hero').is(el)) {
            if (direction == 'down') {
              $('.navbar').removeClass('navbar-top');
              $('.navbar').addClass('navbar-scroll navbar-fixed-top');
            } else {
              $('.navbar').removeClass('navbar-scroll navbar-fixed-top');
              $('.navbar').addClass('navbar-top');
            }
          }
        },
        offset : 55 // size of hero
      }
    };
    new Waypoint(getWaypointOptions($('.ribbon-hero')));
    new Waypoint(getWaypointOptions($('section.hero').next()));

  }
});

angular.module('staticApp', ['ngAnimate']).controller('staticCtrl', ['$scope', '$http', '$timeout', '$interval',
function($scope, $http, $timeout, $interval) {

  /*****************************
   * Helpers
   *****************************/
  function isValidEmail(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
  };

  /*****************************
   * Go to plans page
   *****************************/
  $scope.templateIndex = 0;
  $scope.email = {
    val : ''
  };

  $scope.next = function() {
    if ($scope.templateIndex == 0) {

      var poll = $interval(function() {
        var ls = $scope.location;
        if (!ls || ls.length != 3) {
          return
        }
        window.tagEvent('zip try');
        if (['TX', 'FL', 'GA', 'VA', 'IL', 'MO', 'PA', 'OH', 'NC', 'AZ', 'OR'].indexOf(ls[2]) > -1) {
          // tag success zipcode in the info page
          $interval.cancel(poll);
          window.location = "/info.html?zip=" + ls[0] + "&fip=" + ls[1] + "&state=" + ls[2];
        } else {
          window.recordZipcode(ls[0], ls[2], false, false);
          $scope.templateIndex++;
          $interval.cancel(poll);
        }
      }, 100);
      $timeout(function() {
        $interval.cancel(poll);
      }, 2000);

    } else if ($scope.templateIndex == 1) {
      var ls = $scope.location;
      isValidEmail($scope.email.val) && (window.updateUser('signup out-state', $scope.email.val, {
        zip : ls[0],
        state : ls[2],
        fip : ls[1]
      }), $scope.templateIndex++);
    } else {
      $scope.templateIndex = 0;
    }

  };

}]).directive('customZip', ['$http', '$timeout',
function($http, $timeout) {
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {
      var menu = $(el).next('.dropdown-menu.inner');
      var prev = '';
      var lookup = {};

      // typing zipcode
      $(el).keyup(function(evt) {
        var val = $(this).val();
        if (prev == val) {
          return
        }
        prev = val;
        lookup = {};
        menu.empty();

        // validate number
        if ((String(val).length > 0 && !+val) && (+val !== 0)) {
          $(el).parent().find('.status').show();
        };
        if ((String(val).length < 5 && +val) || String(val).length == 0) {
          $(el).parent().find('.status').hide();
        }

        // get correct zipcode
        if (String(val).length >= 5 && +val) {
          $http.get('https://honeyinsured.com/zip/' + String(val).slice(0, 5)).then(function(res) {
            var options = res.data.counties;
            _.map(options, function(o) {
              o.name = o.zipcode + ', ' + o.name + ', ' + o.state
            });
            if (options.length == 1) {
              var d = options[0];
              $(el).val(d.name);
              scope.$parent.location = [d.zipcode, d.fips, d.state];
              $(el).parent().parent().parent().find('.btn-orange.btn-lg').focus();
            } else if (options.length > 1) {
              _.map(options, function(option, index) {
                lookup[option.name] = [option.zipcode, option.fips, option.state];
                menu.append('<li class="' + (index == 0 ? "dropdown-hover" : "") + '"><a href="">' + option.name + '</a></li>');
              });
            }
          }, function(err) {
            $(el).parent().find('.status').show();
            // window.reportBug('Zipcode', JSON.stringify(err));
          });
        };
      });

      // navigating zipcode options
      var chooseCounty = function() {
        if (menu.find('li').length == 0) {
          return
        }
        var name = menu.find('li.dropdown-hover').text();
        scope.$parent.location = lookup[name];
        $(el).val(name);
        menu.empty();
        $(el).parent().parent().parent().find('.btn-orange.btn-lg').focus();
      };

      $(el).keydown(function(evt) {
        var options = menu.find('li');
        if (options.length == 0) {
          return
        }
        var position = options.index(menu.find('li.dropdown-hover'));
        if (evt.which == 38) {
          // up
          options.removeClass('dropdown-hover');
          $(options[position - 1 >= 0 ? position - 1 : position - 1 + options.length]).addClass('dropdown-hover');
          evt.preventDefault();
        } else if (evt.which == 40) {
          //down
          options.removeClass('dropdown-hover');
          $(options[(position + 1) % options.length]).addClass('dropdown-hover');
          evt.preventDefault();
        } else if (evt.which == 13) {
          // enter
          chooseCounty();
          evt.preventDefault();
        }
      });
      menu.mouseover('li', function(e) {
        menu.find('li').removeClass('dropdown-hover');
        var current = $(e.target);
        !$(e.target).is('li') && ( current = current.parent());
        current.addClass('dropdown-hover');
      });
      menu.click('li', function(e) {
        chooseCounty();
        e.preventDefault();
      });

      // blurring and focusing
      $(el).focus(function() {
        $(el).val('');
        scope.$parent.location = [];
      });
      $(el).blur(function() {
        $timeout(function() {
          var tokens = $(el).val().split(', ');
          if ($(el).val().length != 5 && (tokens.length < 2 || _.last(tokens).trim().length != 2)) {
            $(el).val('');
            scope.$parent.location = [];
            menu.empty();
            $(el).parent().find('.status').hide();
          }
        }, 200);
      });

    }
  }
}]);
