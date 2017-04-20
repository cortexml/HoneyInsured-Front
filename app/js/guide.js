$(function() {
  var pieData = [{
    "label" : 'Eligible for Lower Prices',
    "value" : 87,
    "color" : "#B1D577"
  },{
    "label" : 'Paying the Full Price',
    "value" : 13,
    "color" : "#FB8072"
  }];
  
  var pieWidth = $("#subsidiesChart").width();
  var pieHeight = $("#subsidiesChart").height();

  var pie = new d3pie("subsidiesChart", {
    "header" : {
      // "title" : {
        // "text" : " - Market share of insurance carriers",
        // "color" : "#555555",
        // "fontSize" : 14,
        // "font" : "Lato"
      // },
      // "subtitle" : {
        // "color" : "#999999",
        // "fontSize" : 12,
        // "font" : "Lato"
      // },
      // "titleSubtitlePadding" : 9
    },
    "footer" : {
      "color" : "#999999",
      "fontSize" : 10,
      "font" : "Lato",
      "location" : "bottom-left"
    },
    "size" : {
      "canvasHeight" : pieHeight,
      "canvasWidth" : pieWidth,
      "pieOuterRadius" : "60%"
    },
    "data" : {
      "sortOrder" : "value-desc",
      "content" : pieData
    },
    "labels" : {
      "outer" : {
        "pieDistance" : 8
      },
      "inner" : {
        "hideWhenLessThanPercentage" : 5
      },
      "mainLabel" : {
        "color" : "#555555",
        "fontSize" : 12
      },
      "percentage" : {
        "color" : "#555555",
        "decimalPlaces" : 0,
        "fontSize" : 12
      },
      "value" : {
        "color" : "#adadad",
        "fontSize" : 12
      },
      "lines" : {
        "enabled" : true
      },
      "truncation" : {
        "enabled" : false
      }
    },
    "effects" : {
      "pullOutSegmentOnClick" : {
        "effect" : "none",
        "speed" : 400,
        "size" : 8
      },
      "highlightSegmentOnMouseover" : false,
      "highlightLuminosity" : -0.5
    },
    "tooltips" : {
      "enabled" : false,
      "type" : "placeholder",
      "string" : "{label}: {value}%",
      "styles" : {
        "backgroundColor" : "#ffffff",
        "backgroundOpacity" : .8,
        "color" : "#555555",
        "borderRadius" : 3,
        "fontSize" : 12
      }
    }
  });

})

angular.module('guideApp', ['staticApp','utilsApp', 'uninsuredSubapp','ngAnimate','healthcostSubapp']).controller('guideCtrl', ['$scope', '$http', '$timeout', 'CONSTANTS','healthcostFactory',
function($scope, $http, $timeout, CONSTANTS,healthcostFactory) {
  $scope.CONSTANTS = CONSTANTS;
  $scope.planSelected = {
    scenarios : CONSTANTS.SCENARIOS
  }
  
  $scope.healthcostSlider = {
    model : 50,
    ceil : 100,
    floor : 0
  };
  healthcostFactory.setState('TX');
  healthcostFactory.setPersons([{age:32}]);
  // recalculate healthcost
  var scaleHealthFactor = function(val) {
    return (val / 100.);
  }
  $scope.$watch('healthcostSlider.model', function(val) {
    healthcostFactory.setHealthFactor(scaleHealthFactor(val));
    healthcostFactory.cal();
  });
  
   // bind healthcost factory output
  $scope.$watch(function() {
    return healthcostFactory.getHealthcost();
  }, function(val) {
    $scope.healthcost = val;
  });
  
  

}]).value('CONSTANTS', {
  'SCENARIOS' : {
    "Bad Flu" : {
      "icon" : "flu",
      "costs" : {
        "medcost" : 85,
        "drugcost" : 0
      },
      "totalcost" : 187
    },
    "Stroke" : {
      "icon" : "stroke",
      "costs" : {
        "medcost" : 5000,
        "drugcost" : 0
      },
      "totalcost" : 49974
    },
    "Depression" : {
      "icon" : "depression",
      "costs" : {
        "medcost" : 1225,
        "drugcost" : 0
      },
      "totalcost" : 6843
    },
    "Broken limb" : {
      "icon" : "limb",
      "costs" : {
        "medcost" : 626,
        "drugcost" : 0
      },
      "totalcost" : 1866
    },
    "Baby" : {
      "icon" : "baby",
      "costs" : {
        "medcost" : 325,
        "drugcost" : 0
      },
      "totalcost" : 14515
    },
    "Concussion" : {
      "icon" : "concussion",
      "costs" : {
        "medcost" : 915,
        "drugcost" : 0
      },
      "totalcost" : 3940
    },
    "Heart Attack" : {
      "icon" : "heart",
      "costs" : {
        "medcost" : 5000,
        "drugcost" : 0
      },
      "totalcost" : 67081
    },
    "Cancer" : {
      "icon" : "cancer",
      "costs" : {
        "medcost" : 5000,
        "drugcost" : 0
      },
      "totalcost" : 109901
    }
  }
});
