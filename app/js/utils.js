/***************************************
 * Helper Functions
 ***************************************/
// register some utils function with window
// check for mobile
window.mobileAndTabletcheck = function() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// allow base64 encode and decode
window.encodeJson = function(x) {
  return window.btoa ? window.btoa(JSON.stringify(x)) : JSON.stringify(x);
}
// allow base64 encode and decode
window.decodeJson = function(x) {
  return window.atob ? JSON.parse(window.atob(x)) : JSON.parse(x);
};

// get query params
window.getJsonFromUrl = function() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
/***************************************
 * Conditional Imports
 ***************************************/
// if (window.mobileAndTabletcheck()) {
// alert('lol')
// document.write('<script src=\"https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js\"><\/script>');
// };
// if($.mobile){
// alert('hi')
// }

/***************************************
 * Helper directives across pages
 ***************************************/
angular.module('utilsApp', [
function() {
}]).value('UTILS_CONSTANTS', {
  'DEFINITIONS' : {
    platinum : 'On average, platinum plans pay roughly 90% of your medical bills.',
    gold : 'On average, gold plans pay roughly 80% of your medical bills.',
    silver : 'On average, silver plans pay roughly 70% of your medical bills.',
    bronze : 'On average, bronze plans pay roughly 60% of your medical bills.',
    catastrophic : 'On average, catastrophic plans pay less than 60% of your medical bills.',
    EPO : "You don't need referrals to see specialists as long as they are in the plan's doctor network.",
    PPO : "You don't need referrals to see specialists and can even see doctors out of the plan's doctor network (though more expensive).",
    HMO : "You will have a fixed primary care doctor and need referrals to see specialists in the plan's doctor network.",
    POS : "You will have a fixed primary care doctor and need referrals to see specialists. There is limited coverage out of the plan's doctor network.",
    cheap : "This plan is cheap based on both its insurance costs and your expected 2016 healthcare spendings under this plan.",
    protection : "This plan has one of the lowest deductible and max out of pocket so you pay the least if accidents happen.",
    handpicked : "This is a plan that we think is a good deal and suits your preferences.",
    recommended : "This plan is best suited for you based on your expected 2016 healthcare spendings as well as your risk and network preferences."
  }
}).factory('utilsService', ['$http', '$q', '$timeout',
function($http, $q, $timeout) {
  var service = {};

  /***************************************
   * CONSTANTS for recommend endpoint
   ***************************************/
  service.MAIN_ENDPOINT = 'https://7pa4irufh0.execute-api.us-east-1.amazonaws.com/prod/';
  service.RECOMMEND_ENDPOINT = service.MAIN_ENDPOINT + 'recommendation/?data=';
  service.CACHEQUOTES_ENDPOINT = service.MAIN_ENDPOINT + 'cachequotes/?data=';
  service.EMAILPLAN_ENDPOINT = service.MAIN_ENDPOINT + 'emailplan/?data=';
  service.ENROLL_ENDPOINT = service.MAIN_ENDPOINT + 'enroll/?data=';
  service.TRACK_ENDPOINT = service.MAIN_ENDPOINT + 'track/?data=';
  service.SIGN_ENDPOINT = service.MAIN_ENDPOINT + 'track/?data=';

  /***************************************
   * Doctors lookup from info to recomment
   ***************************************/
  service.saveDoctorsLookup = function(doctorsLookup) {
    Cookies.set('doctorsLookup', doctorsLookup);
  };
  service.getDoctorsLookup = function() {
    return Cookies.getJSON('doctorsLookup') || {};
  };

  /***************************************
   * Get plan information
   ***************************************/
  service.savePlan = function(plan) {
    Cookies.set('plan', plan);
  };
  service.getPlan = function(planId) {
    var plan = Cookies.getJSON('plan');
    if (plan && plan.id == planId) {
      return plan
    } else {
      return null
    }
  };

  /***************************************
   * Url shortening
   ***************************************/
  service.getShortUrl = function() {
    // return promise
    return $http.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCBhADlvZ2qVn5mF9Q0oj9_JRNEPONz1yc', {
      longUrl : window.location.href
    }).then(function(res) {
      return res.data.id.replace('https://goo.gl/', window.location.origin + '/me.html#').replace('http://goo.gl/', window.location.origin + '/me.html#');
    })
  };

  /*****************************
   * Helpers for checking email
   *****************************/
  service.isValidEmail = function(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
  };

  /*****************************
   * Email plan information
   *****************************/
  service.emailPlan = function(email, plan, link) {
    window.updateUser('email plan', email);
    $timeout(function() {
      $http.post(service.EMAILPLAN_ENDPOINT + window.encodeJson({
        email : email,
        plan : plan,
        link : link,
        user_id : getCookie('userId')
      }), function(res) {
        console.log(res)
      });
    }, 1000);
  };

  return service
}]).directive('helpTooltip', ['$timeout',
function($timeout) {
  /*************************************
   * Pull up details page
   *************************************/
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {
      var direction = ['bottom', 'top', 'right'].indexOf(attrs.direction) > -1 ? attrs.direction : 'left';

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $(el).tooltip({
          title : scope.$eval(attrs.helpTooltip),
          trigger : 'manual',
          placement : direction,
          container : 'body'
        }).click(function(e) {
          $('span[class="icon-info"]').tooltip('hide');
          $(this).tooltip('toggle');
          e.stopPropagation();
        });
        // $(document).on('click', function() {
        // $('span[class="icon-info"]').tooltip('hide');
        // });
        $(document).on('tap', function() {
          $('span[class="icon-info"]').tooltip('hide');
        });
      } else {
        $(el).tooltip({
          title : scope.$eval(attrs.helpTooltip),
          trigger : 'hover',
          placement : direction,
          container : 'body'
        });
      }

      // if it is a variable attach watchers
      scope.$watch(function() {
        return scope.$eval(attrs.helpTooltip)
      }, function(val) {
        $(el).attr('data-original-title', val)
      });

    }
  }
}]).directive('selectpicker', function() {
  return {
    restrict : 'A',
    require : 'ngModel',
    link : function(scope, el, attrs) {

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $(el).selectpicker('mobile');
      } else {
        $(el).selectpicker();
      }

      scope.$watch(function() {
        return scope.$eval(attrs.ngModel)
      }, function(val) {
        $(el).val(val);
        $(el).selectpicker('refresh');
      });

    }
  };
}).directive('inputmask', function() {
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {
      $(el).inputmask(scope.$eval('{' + attrs.inputmask + ",'showMaskOnHover': false}"));
    }
  };
}).filter('titleCase', function() {
  return function(input) {
    if (['HMO', 'EPO', 'PPO', 'POS'].indexOf(input) > -1) {
      return input
    }
    input = input || '';
    return input.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
});

