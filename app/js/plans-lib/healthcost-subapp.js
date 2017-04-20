angular.module('healthcostSubapp', ['ngRoute', 'rzModule']).controller('healthcostSubappCtrl', ['$scope', '$http', '$timeout', 'healthcostFactory', 'HEALTHCOST_CONSTANTS', '$location',
function($scope, $http, $timeout, healthcostFactory, HEALTHCOST_CONSTANTS, $location) {
  // initialize variables
  $scope.healthcostSlider = {
    model : 50,
    ceil : 100,
    floor : 0
  }
  $scope.healthcostHover = null;
  $scope.heathcostEdit = null;
  $scope.DEFINITIONS = HEALTHCOST_CONSTANTS.DEFINITIONS;
  healthcostFactory.setState($scope.urlParams.state);
  $scope.urlParams.profile && +$scope.urlParams.profile.healthSlider && ($scope.healthcostSlider.model = +$scope.urlParams.profile.healthSlider);

  /******************************
   * Custom user input
   ******************************/
  // for custom inputting of cost
  $scope.custom = _.object(_.map(_.keys(HEALTHCOST_CONSTANTS.KEYS), function(k) {
    return [k, '']
  }));
  // bind custom to factory
  $scope.$watch('custom', function(val) {
    healthcostFactory.setCustom(val);
  }, true);

  /******************************
   * bind person
   ******************************/
  $scope.$watch('profile.persons', function(val) {
    _rawPersons = _.map(_.map(val, _.clone), function(person) {
      person.age = person.age > 65 ? 65 : person.age;
      if (person.age <= 20) {
        person.age = 20;
      }
      return person;
    });
    healthcostFactory.setPersons(_rawPersons);
  }, true);

  /******************************
   * binding to cal healthcost
   ******************************/
  var scaleHealthFactor = function(val) {
    return (val / 100.);
  }
  $scope.$watch(function() {
    return $location.hash();
  }, function(val) {
    val == 'health' && $timeout(function() {
      $scope.$broadcast('rzSliderForceRender')
    }, 80);
    healthcostFactory.setHealthFactor(scaleHealthFactor($scope.healthcostSlider.model));
    healthcostFactory.cal();
  });

  // recalculate healthcost
  $scope.$watch('healthcostSlider.model', function(val) {
    healthcostFactory.setHealthFactor(scaleHealthFactor(val));
    $scope.profile.healthSlider = val;
    healthcostFactory.cal();
  });

  // interacting with user inputs
  $scope.useEstimate = function() {
    healthcostFactory.cal();
  };

  $scope.useDefault = function(k) {
    $scope.custom[k] = '';
    healthcostFactory.cal();
  };

  // bind healthcost factory output
  $scope.$watch(function() {
    return healthcostFactory.getHealthcost();
  }, function(val) {
    $scope.healthcost = val;
    $scope.profile.healthcost = healthcostFactory.getParsedcost();
  });

}]).factory('healthcostFactory', ['$http', 'HEALTHCOST_CONSTANTS',
function($http, HEALTHCOST_CONSTANTS) {
  var _plansFactory = null;
  var _healthcost = null;
  var _healthFactor = null;
  var _custom = null;
  var _results = null;
  var _persons = null;
  var _parsedcost = null;

  /***************************
   * Main Service
   ***************************/
  var service = {}

  service.cal = function() {
    var res = [];

    // calculate closest data points first
    var closest = _.sortBy(_.map(HEALTHCOST_CONSTANTS.PERCENTILE, function(x, i) {
      return [i, x];
    }), function(x) {
      return Math.abs(_healthFactor - x[1]);
    });

    var components = _.map(HEALTHCOST_CONSTANTS.COSTS, function(v, k) {
      // calculate cost for benefit k for each person
      personCosts = _.map(_persons, function(person) {
        // set no cost below 11th percentile
        if (_healthFactor < .11) {
          return 0;
        }

        // calculate linear interpolation
        y1 = v[closest[0][0]],
        y2 = v[closest[1][0]],
        x1 = closest[0][1],
        x2 = closest[1][1];
        m = (y1 - y2) / (x1 - x2);

        return _.max([0, (y1 + m * (_healthFactor - x1)) * HEALTHCOST_CONSTANTS.STATES[_state] * HEALTHCOST_CONSTANTS.AGE[person.age]]);
      });

      // sum up over persons
      totalCosts = _.reduce(personCosts, function(agg, num) {
        return agg + num;
      });

      // user defined overwrite
      if (_custom && (_custom[k] != '')) {
        // get rid of $ sign
        totalCosts = parseInt(_custom[k].substring(1));
      }
      return {
        key : k,
        value : totalCosts
      };
    });
    // console.log(components);

    // update data for plotting
    _healthcost = {
      components : components,
      total : _.reduce(_.pluck(components, 'value'), function(agg, num) {
        return agg + num;
      })
    };

    // update data for result
    // put in parsed form for cost factory
    _parsedcost = {}
    _.map(components, function(component) {
      var keys = HEALTHCOST_CONSTANTS.KEYS[component.key];
      if ($.isArray(keys)) {
        _.map(keys, function(key) {
          _parsedcost[key] = Math.round(component.value / keys.length);
        });
      } else {
        _parsedcost[keys] = Math.round(component.value);
      }
    });

  }
  service.getResults = function() {
    return _results;
  };
  service.getHealthcost = function() {
    return _healthcost;
  };
  service.getParsedcost = function() {
    return _parsedcost;
  };
  service.setPlansFactory = function(plansFactory) {
    _plansFactory = plansFactory;
  }
  service.setPersons = function(persons) {
    _persons = persons;
  }
  service.setCustom = function(custom) {
    _custom = custom;
  }
  service.setState = function(state) {
    _state = state;
  }
  service.setHealthFactor = function(healthFactor) {
    _healthFactor = healthFactor;
  }

  return service

}]).directive('healthcostAccordion', function() {
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {
      $(el).next().on('show.bs.collapse', function() {
        $(el).find('.pull-right').hide();
      }).on('hide.bs.collapse', function() {
        $(el).find('.pull-right').show();
      });
    }
  };
}).directive('inputmask', function() {
  return {
    restrict : 'A',
    link : function(scope, el, attrs) {
      $(el).inputmask(scope.$eval('{' + attrs.inputmask + '}'));
    }
  };
}).value('HEALTHCOST_CONSTANTS', {
  PERCENTILE : [0, 0.178, 0.2131, 0.2449, 0.2747, 0.3023, 0.328, 0.3519, 0.3738, 0.3942, 0.4131, 0.4308, 0.4474, 0.4631, 0.478, 0.4921, 0.5054, 0.518, 0.53, 0.5415, 0.5525, 0.5629, 0.573, 0.5826, 0.592, 0.6009, 0.6095, 0.6178, 0.6257, 0.6335, 0.6409, 0.6481, 0.6549, 0.6616, 0.6681, 0.6744, 0.6804, 0.6862, 0.6918, 0.6973, 0.7027, 0.7078, 0.7128, 0.7176, 0.7224, 0.727, 0.7314, 0.7357, 0.74, 0.7441, 0.7481, 0.7521, 0.7559, 0.7596, 0.7632, 0.7667, 0.7702, 0.7735, 0.7768, 0.78, 0.7831, 0.7861, 0.7891, 0.792, 0.7948, 0.8198, 0.8641, 0.9144, 0.9413, 0.9569, 0.9667, 0.9734, 0.9782, 0.9816, 0.9844, 0.9951],
  COSTS : {
    'Primary Visits' : [0, 49.4538, 76.3407, 102.5038, 124.2062, 144.2154, 161.252, 174.5025, 188.662, 200.1068, 210.6947, 220.0671, 226.3018, 234.0591, 239.9032, 246.7145, 250.8484, 256.6648, 264.4775, 265.4005, 272.3611, 275.028, 277.6096, 280.5428, 282.737, 288.7977, 293.5395, 295.9921, 298.2618, 302.0081, 304.6855, 308.3947, 311.4453, 314.2498, 317.3484, 321.5979, 324.4034, 327.0138, 328.1545, 327.2365, 327.3965, 333.3365, 341.4081, 339.5008, 338.0022, 341.8792, 342.2981, 346.6998, 347.9817, 347.5274, 348.5683, 350.8383, 357.2492, 351.3467, 358.3737, 360.9306, 358.7832, 363.5156, 361.8649, 368.7035, 369.6101, 365.7936, 369.3415, 371.5876, 374.2103, 379.6355, 397.2566, 410.6176, 424.833, 450.9254, 470.7023, 490.0695, 512.8181, 543.9409, 527.9296, 584.6467],
    'Specialist Visits' : [0, 15.8021, 27.4327, 36.2079, 44.9915, 53.4251, 61.6052, 69.7808, 77.6089, 85.8637, 93.2702, 100.7646, 106.9145, 113.0367, 119.7233, 125.2929, 132.3791, 137.7498, 142.9593, 148.8272, 152.9782, 160.1669, 166.1739, 164.5855, 170.5018, 177.241, 179.8019, 185.9462, 187.9247, 194.2222, 197.0366, 202.7223, 207.2347, 213.3576, 216.4901, 218.7731, 222.4158, 230.7394, 229.9338, 234.7854, 245.3813, 242.4497, 246.2472, 249.1779, 253.1394, 252.7729, 264.6411, 265.528, 266.3362, 272.27, 281.5382, 280.4749, 281.451, 285.5311, 293.984, 287.5958, 290.6799, 298.4301, 302.2678, 304.2815, 306.5893, 315.2097, 310.4776, 317.756, 325.9199, 337.6398, 381.031, 436.1684, 494.1655, 564.8966, 637.4668, 705.8823, 765.4402, 840.5971, 928.0429, 1249.334],
    'Emergency' : [0, 0.4745, 2.2635, 5.8572, 10.3174, 15.965, 22.5998, 29.0313, 38.0917, 47.0007, 55.494, 65.6503, 75.0033, 83.5249, 91.0573, 100.7943, 112.5841, 119.6649, 127.8207, 138.0759, 149.737, 154.5803, 165.5565, 171.9032, 183.5146, 193.1062, 202.7061, 215.6296, 219.2404, 233.6666, 246.3075, 248.3661, 253.9298, 266.7122, 272.1845, 280.7525, 284.9965, 301.9602, 315.0419, 316.0405, 331.1226, 335.9852, 347.7427, 365.4044, 360.6892, 372.6741, 384.4849, 377.3535, 411.7445, 419.6603, 418.102, 432.8712, 445.0092, 448.007, 446.8865, 457.7156, 467.7805, 497.1733, 503.7151, 507.5712, 529.1958, 528.2516, 538.7832, 533.8281, 559.8638, 602.6296, 745.3396, 973.6616, 1259.005, 1531.2481, 1774.3138, 1913.916, 2041.909, 2255.7404, 2237.0141, 2507.6463],
    'Generic Drugs' : [0, 21.0757, 31.3214, 43.2162, 55.7808, 69.1137, 84.06, 98.8916, 112.2548, 125.8597, 138.9918, 150.2813, 160.8417, 171.2687, 179.8266, 189.5316, 199.6906, 209.4989, 219.2319, 227.0556, 233.1293, 241.1218, 249.1678, 253.9078, 260.4124, 267.1761, 271.4697, 276.6482, 285.2642, 292.3144, 291.1557, 293.9399, 301.9997, 303.1889, 311.6492, 311.2229, 311.6258, 322.2515, 323.4313, 326.059, 326.1133, 333.4162, 339.9749, 336.6504, 343.5131, 349.1604, 349.7428, 358.8817, 340.0179, 351.0943, 349.0668, 359.3362, 358.3971, 371.7198, 356.9521, 368.9452, 365.6737, 361.3587, 366.5339, 370.2748, 374.0622, 368.2237, 379.0537, 381.1982, 394.8966, 389.1591, 405.4817, 430.6606, 464.8106, 515.1149, 557.2011, 596.1779, 636.2604, 653.0487, 715.2608, 792.6096],
    'Brand Drugs' : [0, 4.4423, 8.8291, 15.3045, 22.277, 30.4136, 40.6213, 51.8966, 65.5417, 80.7381, 97.5456, 116.48, 142.7806, 164.4582, 194.2552, 215.954, 239.3915, 262.7765, 286.8947, 308.7211, 336.8555, 359.2905, 385.5394, 412.4816, 435.1972, 466.4179, 493.6366, 516.2833, 546.903, 575.2036, 593.9675, 632.1304, 654.8802, 682.4202, 707.1662, 735.4619, 758.7025, 770.8716, 808.4797, 833.6858, 837.8223, 873.7914, 883.015, 926.7747, 950.5282, 982.4286, 999.8753, 1024.9485, 1042.7914, 1076.8201, 1094.1533, 1127.5546, 1136.3544, 1179.7888, 1186.6736, 1235.9856, 1249.2318, 1264.435, 1273.8213, 1308.5126, 1345.8127, 1356.6867, 1375.9043, 1438.521, 1425.8416, 1541.2047, 1854.0965, 2257.4198, 2568.4463, 2892.8048, 3363.9943, 3726.8558, 3923.2838, 4104.2455, 4220.6661, 4456.2383],
    'Lab Tests & Imaging' : [0, 7.5, 17.2468, 29.7627, 41.7229, 54.3231, 67.4693, 81.0787, 94.9944, 110.3684, 124.8458, 137.0574, 150.2498, 163.4919, 174.26, 186.5585, 196.6611, 210.172, 220.9016, 232.643, 245.1898, 255.6925, 262.2367, 273.7883, 283.61170000000004, 293.55920000000003, 300.7637, 311.98929999999996, 319.52959999999996, 327.8713, 342.73699999999997, 348.84799999999996, 359.5904, 375.7185, 378.2492, 387.2627, 395.0588, 408.0547, 412.228, 426.7348, 441.6537, 443.769, 452.4871, 461.94579999999996, 469.04859999999996, 475.4235, 477.99559999999997, 502.7163, 506.8478, 512.409, 522.6363, 530.1034, 538.9307, 533.4899, 556.0533, 561.1116999999999, 575.8874000000001, 572.1243, 588.5206000000001, 603.5378000000001, 610.1509, 609.7442, 614.5205000000001, 623.2659, 632.9005, 678.2843, 805.9721999999999, 1022.2777, 1323.6486, 1643.3491, 1907.4382, 2117.6429, 2339.6822, 2588.1062, 2785.4191, 4324.503500000001],
    'Preventive Care' : [0, 17.8889, 28.9223, 42.327, 57.0063, 71.527, 86.239, 100.0676, 111.2723, 120.7065, 130.1568, 137.448, 144.887, 152.6814, 158.1576, 165.8601, 173.0643, 179.5426, 187.5843, 193.0891, 204.4094, 211.8721, 220.3244, 231.3429, 237.4387, 243.5526, 256.6486, 259.2762, 267.2755, 274.7, 285.4871, 293.063, 296.3507, 303.8848, 307.7132, 318.5106, 320.2809, 330.6141, 330.2088, 329.815, 342.8752, 351.2992, 351.1774, 356.4717, 360.0367, 359.3344, 362.1783, 375.5191, 371.6404, 380.0976, 373.2121, 382.5778, 389.9611, 383.218, 398.22, 397.4342, 411.8161, 397.5081, 416.5438, 407.6761, 396.948, 413.0578, 417.184, 405.4901, 415.7294, 420.0731, 440.1533, 453.856, 462.958, 485.8835, 492.4253, 508.7005, 526.8956, 527.061, 538.2795, 548.7049],
    'In Patient Care' : [0, 0.0, 0.0, 0.0, 0.0, 0.0811, 0.0207, 0.1286, 0.0483, 0.1896, 0.2216, 0.3141, 0.5953, 0.9154, 1.0191, 1.2958, 2.0647, 2.6201, 3.1044, 3.6921, 4.706, 6.2175, 7.796, 8.1943, 11.1302, 11.6575, 13.632, 17.195, 17.0636, 18.0037, 18.8625, 22.3451, 23.8181, 23.973, 28.7719, 29.7581, 32.2966, 35.3209, 36.0458, 41.0047, 40.2346, 44.5056, 44.6011, 46.5825, 50.034, 54.1438, 55.7745, 56.0692, 59.1447, 57.6328, 61.1126, 64.8317, 67.2041, 64.7223, 65.4281, 71.2672, 73.8316, 70.3062, 76.2939, 76.7068, 69.9939, 79.4701, 74.9164, 86.7952, 82.3685, 108.0071, 257.641, 1201.8871, 3026.3166, 4707.7291, 6436.8837, 8449.1942, 10956.0021, 13634.0972, 16695.0507, 27236.079],
    'Out Patient Care' : [0, 22.1025, 36.6107, 46.9204, 58.9817, 69.4044, 81.1243, 93.2181, 105.1547, 115.4449, 127.9966, 137.9648, 150.2111, 162.8487, 173.4187, 180.6407, 192.3196, 204.356, 214.1422, 224.6603, 234.7424, 244.8433, 256.3992, 269.8896, 280.5036, 290.3507, 297.4218, 310.402, 321.525, 333.3185, 344.6483, 352.934, 362.3896, 378.2154, 383.0368, 405.8149, 415.9897, 424.5677, 438.9185, 458.2908, 471.5181, 482.1169, 495.4185, 505.359, 526.293, 533.9047, 548.2004, 558.6113, 581.9854, 596.6223, 611.7091, 612.9059, 637.6578, 646.7905, 676.3576, 676.5292, 696.4262, 709.9175, 725.3598, 737.3296, 753.3535, 765.6066, 794.5198, 794.015, 829.2868, 900.5458, 1165.5431, 1688.4361, 2350.9254, 2908.3214, 3386.6268, 3733.1116, 4224.1272, 4695.8999, 5078.7971, 7237.8064],
  },
  DEFINITIONS : {
    'Primary Visits' : 'These are visits to your primary care doctor for basic health needs. If required, your primary care doctor can also refer you to specialists.',
    'Specialist Visits' : 'These are visits to doctors who specialize in specific medical services. Some examples include cardiologists, gastroenterologists and paediaricians.',
    'Emergency' : "Emergencies may happen but you probably can't predict this.",
    'Brand Drugs' : 'These are drugs with brand name and usually costs more than generic drugs.',
    'Generic Drugs' : 'These are cheaper versions of brand drugs and usually have similar medical effects as brand ones.',
    'Lab Tests & Imaging' : 'Examples include blood tests, X-rays and CT scans.',
    'Preventive Care' : 'Examples include health checkups and vaccinations that can help you stay healthy.',
    'In Patient Care' : 'These include hospital stay and surgery fees.',
    'Out Patient Care' : 'These are medical procedures that can be done in a medical center without an overnight stay.'
  },
  KEYS : {
    'Brand Drugs' : 44,
    'Generic Drugs' : 18,
    'In Patient Care' : [26, 27],
    'Lab Tests & Imaging' : [28, 68],
    'Out Patient Care' : [41, 43],
    'Preventive Care' : 46,
    'Primary Visits' : 47,
    'Specialist Visits' : 59,
    'Emergency' : [15, 16]
  },
  COLORS : {
    'Brand Drugs' : '#ff7f0e',
    'Generic Drugs' : '#2ca02c',
    'In Patient Care' : '#bcbd22',
    'Lab Tests & Imaging' : '#d62728',
    'Out Patient Care' : '#9467bd',
    'Preventive Care' : '#8c564b',
    'Primary Visits' : '#1f77b4',
    'Specialist Visits' : '#e377c2',
    'Emergency' : '#7f7f7f'
  },
  STATES : {
    'FL' : 1.1151,
    'GA' : 0.9434,
    'MO' : 0.9755,
    'NC' : 1.3,
    'OH' : 1.0528,
    'PA' : 1.033,
    'TX' : 1.0368,
    'VA' : 1.1028,
    'CA' : 1.1028,
    'AZ' : 0.9432,
    'IL' : 1.033,
    'OR' : .9434
  },
  AGE : {
    "20" : 0.3556,
    "21" : 0.4299,
    "22" : 0.4699,
    "23" : 0.5019,
    "24" : 0.5599,
    "25" : 0.5621,
    "26" : 0.5734,
    "27" : 0.5868,
    "28" : 0.6086,
    "29" : 0.6265,
    "30" : 0.6355,
    "31" : 0.6489,
    "32" : 0.6624,
    "33" : 0.6708,
    "34" : 0.6797,
    "35" : 0.6842,
    "36" : 0.6887,
    "37" : 0.6932,
    "38" : 0.6977,
    "39" : 0.7066,
    "40" : 0.7156,
    "41" : 0.729,
    "42" : 0.7419,
    "43" : 0.7598,
    "44" : 0.7822,
    "45" : 0.8085,
    "46" : 0.8399,
    "47" : 0.8751,
    "48" : 0.9154,
    "49" : 0.9552,
    "50" : 1.0,
    "51" : 1.0442,
    "52" : 1.093,
    "53" : 1.1422,
    "54" : 1.1954,
    "55" : 1.2486,
    "56" : 1.3063,
    "57" : 1.3645,
    "58" : 1.4266,
    "59" : 1.4575,
    "60" : 1.5196,
    "61" : 1.5733,
    "62" : 1.6086,
    "63" : 1.6529,
    "64" : 1.6797,
    "65" : 1.6797
  }
});
