angular.module('trackApp', ['ngAnimate', 'utilsApp', 'ngRoute']).value('CONSTANTS', {
  'OPTIONS' : {
    'Income Documentation' : {
      "78" : "Tax return",
      "79" : "Wages and tax statement (W-2)",
      "80" : "Pay stub",
      "90" : "Self-employment ledger",
      "81" : "Letter from employer",
      "83" : "Lease agreement",
      "84" : "Copy of a check paid to the household member",
      "86" : "Document or letter from Social Security Administration (SSA)",
      "87" : "Form SSA 1099 Social Security benefits statement",
      "91" : "Letter from government agency for unemployment benefits",
      "92" : "Document or letter from Social Security Administration",
      "94" : "1099-MISC",
      "95" : "1099-G",
      "100" : "Other"
    },
    'Citizenship Documentation' : {
      "48" : "U.S. public birth record",
      "57" : "U.S. passport",
      "60" : "Certification of Report of Birth",
      "61" : "Consular Report of Birth Abroad",
      "62" : "U.S. Citizen Identification Card",
      "63" : "Machine Readable Immigrant Visa (with IR3 or IH3 Code)",
      "64" : "Final U.S. adoption decree",
      "65" : "Certificate statement from a U.S. consular official",
      "67" : "Early U.S. school record",
      "71" : "Evidence showing foreign born to U.S. citizen parent(s)",
      "70" : "Statement from adoption agency",
      "58" : "Certification of Birth Abroad",
      "17" : "Certificate of Naturalization",
      "16" : "Certificate of Citizenship",
      "100" : "Other"
    },
    'SSN Documentation' : {
      "47" : "Social Security Card",
      "154" : "Tax form(s)",
      "1000" : "Other"
    },
    'Tricare Termination Documentation' : {
      "141" : "Letter from health insurer including coverage termination date",
      "142" : "Statement of health benefits",
      "143" : "Letter from Veterans Administration",
      "144" : "Letter from Peace Corps",
      "145" : "Letter or statement of Medicare benefits",
      "146" : "Letter or statement of CHIP benefits",
      "1000" : "Other"
    },
    'Immigration Documentation' : {
      "1" : "Foreign Passport",
      "11" : "Refugee Travel Document (I-571)",
      "10" : "Permanent Resident Card (I-551)",
      "20" : "Arrival/Departure Record in foreign passport (I-94)",
      "23" : "Certificate of Eligibility for Nonimmigrant Student Status (I-20)",
      "19" : "Temporary I-551 Stamp (on Passport or I-94/I-94A)",
      "18" : "Machine Readable Immigrant Visa (with Temporary I-551 Language)",
      "41" : "Notice of Action (I-797)",
      "77" : "Current orders showing active duty in the Army, Navy, Air Force, Marine Corps, or Coast Guard",
      "75" : "Resident of American Samoa Card",
      "74" : "Document indicating a member of a federally-recognized Indian tribe or American Indian born in Canada",
      "24" : "Certificate of Eligibility for Exchange Visitor Status (DS-2019)",
      "9" : "Reentry Permit (I-327)",
      "15" : "Employment Authorization Card (I-766)",
      "100" : "Other",
    },
    'Incarceration Documentation':{
        "1":"Official release papers from institution",
        "161":"Paystubs from the last 60 days",
        "182":"Signed affidavit saying that the applicant lives in the community",
        "152":"Utility or cell phone bill from the last 60 days",
        "102":"Bank or credit card statement showing transaction history from the last 60 days",
        "183":"Rent Receipt from the last 60 days"
    },
    'Medicaid/Chip Rejection Documentation':{
        "141":"Letter from health insurer including coverage termination date",
        "142":"Statement of health benefits",
        "143":"Letter from Medicaid or Chip"
    }
  },
}).controller('trackCtrl', ['$scope', '$http', '$timeout', '$location', 'utilsService', 'CONSTANTS',
function($scope, $http, $timeout, $location, utilsService, CONSTANTS) {
  $scope.templateIndex = 0;
  $scope.error = null;
  $scope._ = _;
  $scope.CONSTANTS = CONSTANTS;
  $scope.login = {
    email : '',
    id : window.getJsonFromUrl().id ? window.getJsonFromUrl().id : '',
    userId : getCookie('userId')
  };

  // handle all set cases when user uploads all documents
  $scope.$watch('status', function(val) {
    if (val && val.current != 'Submitted' && (!val.docs || _.every(_.pluck(val.docs, 'hasUploaded')))) {
      val.update = "You're all set! Your documents are submitted and the insurance company will be in contact with you within 7 business days with your plan details and first payment information. Thanks once again for choosing HoneyInsured!";
    } else if (val && val.current != 'Submitted' && (val.docs && !_.every(_.pluck(val.docs, 'hasUploaded')))) {
      val.update = "You're enrolled! The insurance company will be in contact with you within 7 business days with your plan details and first payment information. <br>The federal marketplace also requires additional documentation from you. Please upload the documents here within the next 3 months and we'll send them to the marketplace for you.";
    } else if (val) {
      val.update = "Thanks for your application. We are currently sending your information to the insurance company and the government. We promise to email you within 24 hours to confirm your enrollment. Meanwhile, sit back and relax. Give yourself a pat on the back for getting yourself insured!";
    }
  }, true)

  /*****************************
   * Login
   *****************************/
  $scope.loading = false;
  $scope.gotoApp = function() {
    if (!isValidEmail($scope.login.email)) {
      $scope.error = true;
    } else if (!$scope.loading) {
      $scope.error = false;
      $scope.login.method = 'login';
      $scope.loading = true;
      $http.post(utilsService.TRACK_ENDPOINT, {
        data : window.encodeJson($scope.login)
      }).then(function(res) {
        $scope.loading = false;
        if (res.data.errorMessage) {
          $scope.error = true;
        } else {
          $scope.status = res.data;
          $scope.templateIndex = 2;
        }
      });
    }
  }
  /*****************************
   * Forget Id
   *****************************/
  $scope.errorForget = null;
  $scope.gotoForget = function() {
    $scope.templateIndex = 1;
  };
  $scope.gotoLogin = function() {
    $scope.templateIndex = 0;
  };
  $scope.resendConfirmation = function() {
    if (!isValidEmail($scope.login.email)) {
      $scope.errorForget = true;
    } else {
      $scope.login.method = 'resend';
      $scope.templateIndex = -1;
      $http.post(utilsService.TRACK_ENDPOINT, {
        data : window.encodeJson($scope.login)
      });
    }
  }
  /*****************************
   * Helpers
   *****************************/
  function isValidEmail(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
  };

}]).directive('trackSelectpicker', ['$timeout',
function($timeout) {
  return {
    restrict : 'A',
    require : 'ngModel',
    link : function(scope, el, attrs) {
      $timeout(function() {

        $(el).selectpicker();

        scope.$watch(function() {
          return scope.$eval(attrs.ngModel)
        }, function(val) {
          $(el).val(val);
          $(el).selectpicker('refresh');
        });
      }, 1);

    }
  };
}]).directive('fileUpload', ['$http', 'utilsService',
function($http, utilsService) {
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {
      var doc = scope.$eval(attrs.fileUpload);
      $(el).show();
      $(el).next().hide();
      var handleFileSelect = function(evt) {
        $(el).hide();
        $(el).next().show();
        var files = $(this)[0].files;
        var file = files[0];
        if (files && file) {
          if (file.size > 3e6) {
            $(el).prev().addClass('red');
            $(el).show();
            $(el).next().hide();
            return
          }
          $(el).prev().removeClass('red');

          var reader = new FileReader();
          reader.onload = function(readerEvt) {
            var binaryString = readerEvt.target.result;
            var bs = btoa(binaryString);
            scope.login.method = 'upload';
            scope.login.data = bs;
            scope.login.fname = file.name;
            scope.login.title = doc.title;
            scope.login.name = doc.name;
            scope.login.selected = doc.selected;

            $http.post(utilsService.TRACK_ENDPOINT, {
              data : window.encodeJson(scope.login)
            }).then(function(res) {
              _.map(['data', 'fname', 'title', 'name', 'selected'], function(k) {
                delete scope.login[k];
              });
              doc.hasUploaded = true;
              $(el).show();
              $(el).next().hide();
            });
          };
          reader.readAsBinaryString(file);
        }
      };
      $(el).change(handleFileSelect);
    }
  };
}]);
