$(function() {
  /****************************
   * Fix newsletter signup
   ****************************/
 
  var quotesStickyBottom;
  var createQuotesStickyBottom = function() {
    return new Waypoint({
      element : document.getElementById('banner-bottom'),
      wrapper : false,
      handler : function(direction) {
        if (direction == 'down') {

          $('#quotes-banner').removeClass('stuck');
          $('#quotes-banner-placeholder').hide();
        } else {
          $('#quotes-banner').addClass('stuck');
          $('#quotes-banner-placeholder').height($('#quotes-banner').outerHeight()).show();
        }
      },
      offset : 132 // 55 + 77
    })
  };
  
  var quotesBanner;
  var createQuotesBanner = function() {
    
    return new Waypoint({
      element : document.getElementById('quotes-banner'),
      wrapper : false,
      handler : function(direction) {
        if (direction == 'down') {
          $('#quotes-banner').addClass('stuck');
          $('#quotes-banner-placeholder').height($('#quotes-banner').outerHeight()).show();
        } else {
          $('#quotes-banner').removeClass('stuck');
          $('#quotes-banner-placeholder').hide();
        }
      },
      offset : function() {
        return 55;
      }
    })
  };

  var checkSticky = function() {
    !quotesBanner && ( quotesBanner = createQuotesBanner());
    !quotesStickyBottom && ( quotesStickyBottom = createQuotesStickyBottom());

  };

  checkSticky();
  $(window).resize(function() {
    checkSticky();
  });

});

// angular.module('blogApp', []).controller('blogCtrl', ['$scope', '$http', '$timeout',
// function($scope, $http, $timeout) {
// 
  // /*****************************
   // * Subscribe to Newsletter
   // *****************************/
  // $scope.email = {
    // val : '',
    // submitted : false
  // };
  // function isValidEmail(emailAddress) {
    // var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    // return pattern.test(emailAddress);
  // };
  // $scope.subscribe = function() {
    // if (isValidEmail($scope.email.val)) {
      // window.updateUser('signup newsletter', $scope.email.val);
    // }
    // $scope.email.submitted = true;
  // }
// }]);
