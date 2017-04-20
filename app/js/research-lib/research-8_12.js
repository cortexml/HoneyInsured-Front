$(function() {
  

  /****************************
   * Generate Charts
   ****************************/
  generateCharts();
});

generateCharts = function() {

  /************************
   * Premium Bar Chart
   ************************/
  var svg = dimple.newSvg("#barChart", '100%', '100%');
  var myChart = new dimple.chart(svg, [{
    size : 'Largest State Issuers',
    prem : 23.9
  }, {
    size : 'Other Issuers',
    prem : 13.7
  }]);
  myChart.setMargins(70, 30, 30, 20);
  var x = myChart.addCategoryAxis("x", ["size"]);
  x.title = '';
  var y = myChart.addMeasureAxis("y", "prem");
  y.title = "Premium Increase from '14 to '15 (%)";
  y.fontSize = 11;
  x.fontSize = 11;
  var mySeries = myChart.addSeries(["prem", "size"], dimple.plot.bar);
  y.ticks = 4;
  mySeries.tooltipFontSize = 12;
  mySeries.tooltipFontFamily = x.fontFamily = y.fontFamily = 'Lato';
  mySeries.getTooltipText = function(e) {
    return [e.aggField[1], 'Premium Increase: ' + e.aggField[0] + '%'];
  };
  // mySeries.afterDraw = function(s, d) {
  // var shape = d3.select(s);
  // // Add some bar labels for the yValue
  // svg.append("text").attr("x", parseFloat(shape.attr("x")) + shape.attr("width") / 2).attr("y", parseFloat(shape.attr("y")) + (shape.attr("height") > 30 ? (shape.attr("height") / 2 + 8) : -10)).style("font-family", "Lato").style("text-anchor", "middle").style("font-size", "14px").style("fill", "#555555").style("pointer-events", "none").text(y._getFormat()(d.yValue));
  //
  // };
  myChart.draw();

  /************************
   * USA Map
   ************************/
  var mapData = {}
  _.map(MARKET, function(v, s) {
    mapData[s] = {
      'fillKey' : 'hasData',
      'numCarriers' : _.size(v)
    }
  });
  var election = new Datamap({
    scope : 'usa',
    element : document.getElementById('map_election'),
    geographyConfig : {
      highlightFillColor : function(data) {
        return 'fillKey' in data ? '#f79824' : '#d4d4d4'
      },
      highlightBorderColor : '#ffffff',
      popupTemplate : function(geography, data) {
        if (data == undefined) {
          return
        }
        return '<div class="hoverinfo">' + geography.properties.name + '<br>Number of carriers: ' + data.numCarriers + ' '
      },
      highlightBorderWidth : 1
    },
    fills : {
      'hasData' : '#A9C0DE',
      defaultFill : '#d4d4d4'
    },
    data : mapData,
    done : function(datamap) {
      datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
        var s = geography.id;
        ( s in MARKET) && drawPie(MARKET[s], s);
      });
    }
  });
  election.labels();

  /****************************
   * Pie Chart
   * **************************/
  var pie;
  function drawPie(data, state) {

    pie && pie.destroy();
    var colorCounter = 0;
    _.map(data, function(v, k) {
      return [v, k]
    })
    var pieData = _.map(data, function(v, k) {
      return {
        "label" : k,
        "value" : v,
        "color" : COLORS[colorCounter++]
      }
    });
    pieWidth = $("#pieChart").width();
    pieHeight = $("#pieChart").height();

    pie = new d3pie("pieChart", {
      "header" : {
        "title" : {
          "text" : state + " - Market share of insurance carriers",
          "color" : "#555555",
          "fontSize" : 14,
          "font" : "Lato"
        },
        "subtitle" : {
          "color" : "#999999",
          "fontSize" : 12,
          "font" : "Lato"
        },
        "titleSubtitlePadding" : 9
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
          "pieDistance" : 16
        },
        "inner" : {
          "hideWhenLessThanPercentage" : 5
        },
        "mainLabel" : {
          "color" : "#555555",
          "fontSize" : 10
        },
        "percentage" : {
          "color" : "#555555",
          "decimalPlaces" : 0
        },
        "value" : {
          "color" : "#adadad",
          "fontSize" : 10
        },
        "lines" : {
          "enabled" : true
        },
        "truncation" : {
          "enabled" : true
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
        "enabled" : true,
        "type" : "placeholder",
        "string" : "{label}: {value}%",
        "styles" : {
          "backgroundColor" : "#ffffff",
          "backgroundOpacity" : .8,
          "color" : "#555555",
          "borderRadius" : 3,
          "fontSize" : 11
        }
      }
    });
  }

  drawPie(MARKET['NC'], 'NC');
}
/******************************
 * Constants
 ******************************/
MARKET = {
  'DE' : {
    'Aetna Life Incurance Company' : 8.86,
    'Highmark BCBSD, Inc.' : 82.28,
    'Aetna Health Inc.' : 8.86
  },
  'WI' : {
    'Group Health of Cooperative- SCW' : 0.79,
    'Unity Health Plans Insurance Corporation' : 4.71,
    'Molina Healthcare of Wisconsin, Inc' : 11.63,
    'Common Ground Healthcare Cooperative' : 14.54,
    'Medica Health Plans of Wisconsin' : 3.02,
    'MercyCare HMO, Inc.' : 0.49,
    'Compcare Health Services Insurance Corporation' : 16.37,
    'Health Tradition Health Plan' : 1.68,
    'Dean Health Plan' : 12.74,
    'All Savers Insurance Company' : 4.28,
    'WPS Health Plan, Inc' : 7.6,
    'Physicians Plus Insurance Corporation' : 0.37,
    'Managed Health Services Insurance Corporation' : 1.84,
    'Security Health Plan' : 17.31,
    'Gundersen Health Plan, Inc.' : 2.63
  },
  'WV' : {
    'Highmark BCBSWV, Inc.' : 100.0
  },
  'FL' : {
    'Sunshine State Health Plan' : 0.8,
    'Coventry Health Care of Florida, Inc.' : 19.34,
    'Preferred Medical Plan,Inc' : 12.18,
    'Molina Healthcare of Florida, Inc' : 1.77,
    'Cigna Health and Life Insurance Company' : 7.15,
    'Aetna Health Inc.' : 1.99,
    'Health First Health Plans, Inc.' : 0.31,
    'Health First Insurance, Inc.' : 0.17,
    'Blue Cross Blue Shield of Florida' : 23.9,
    'Humana Medical Plan, Inc.' : 16.63,
    'UnitedHealthcare of Florida, Inc.' : 3.3,
    'Time Insurance Company' : 4.18,
    'Health Options, Inc.' : 7.9,
    'FLORIDA HEALTH CARE PLAN, INC.' : 0.39
  },
  'WY' : {
    'WINhealth Partners Inc' : 57.7,
    'Blue Cross Blue Shield Wyoming' : 42.3
  },
  'NH' : {
    'Maine Community Health Options' : 10.02,
    'Matthew Thornton Health Plan, Inc.' : 56.56,
    'Time Insurance Company' : 9.12,
    'Minuteman Health, Inc.' : 19.35,
    'Harvard Pilgrim Health Care of New England' : 4.95
  },
  'NJ' : {
    'Oscar Insurance Corporation of New Jersey' : 1.1,
    'AmeriHealth HMO, Inc.' : 15.76,
    'Health Republic Insurance of New Jersey' : 3.66,
    'Oxford Health Plans (NJ), Inc.' : 0.58,
    'AmeriHealth Ins Company of New Jersey' : 15.76,
    'Horizon Blue Cross Blue Shield of New Jersey' : 63.13
  },
  'TX' : {
    'SHA, LLC DBA FirstCare Health Plans' : 0.25,
    'Aetna Life Insurance Company' : 2.04,
    'Valley Baptist Insurance Company dba Valley Baptist Health Plans' : 0.77,
    'Humana Health Plan of Texas' : 9.3,
    'Community Health Choice, Inc.' : 0.36,
    'Blue Cross Blue Shield of Texas' : 69.12,
    'Cigna Health and Life Insurance Company' : 5.99,
    'All Savers Insurance Company' : 2.99,
    'Superior Health Plan' : 1.08,
    'Community First Health Plans' : 0.27,
    'Humana Insurance Company' : 2.06,
    'Molina Healthcare of Texas, Inc.' : 1.82,
    'Time Insurance Company' : 3.05,
    'Scott & White Health Plan' : 0.91
  },
  'LA' : {
    'Louisiana Health Service & Indemnity Company' : 48.22,
    'UnitedHealthcare of Louisiana, Inc.' : 3.08,
    'Humana Health Benefit Plan of Louisiana, Inc.' : 4.84,
    'Louisiana Health Cooperative, Inc.' : 8.06,
    'Vantage Health Plan, Inc.' : 10.35,
    'HMO Louisiana, Inc.' : 25.45
  },
  'NC' : {
    'UnitedHealthcare of North Carolina, Inc.' : 3.63,
    'Blue Cross Blue Shield of NC' : 87.88,
    'Coventry Health Care of the Carolinas, Inc.' : 8.49
  },
  'ND' : {
    'Medica Health Plans' : 14.59,
    'Blue Cross Blue Shield of North Dakota' : 82.54,
    'Sanford Health Plan' : 2.86
  },
  'NE' : {
    'Time Insurance Company' : 7.1,
    'Blue Cross and Blue Shield of Nebraska' : 88.58,
    'CHC NE' : 4.31
  },
  'TN' : {
    'Humana Insurance Company' : 4.13,
    'Time Insurance Company' : 2.39,
    'BCBST' : 92.43,
    'Cigna Health and Life Insurance Company' : 1.05
  },
  'PA' : {
    'Keystone Health Plan Central' : 0.19,
    'Geisinger Health Plan' : 2.5,
    'Independence Blue Cross (QCC Ins. Co.)' : 15.11,
    'Aetna Health, Inc.' : 2.47,
    'Aetna Life Insurance Company' : 5.36,
    'Time Insurance Company' : 1.26,
    'UPMC Health Options, Inc.' : 8.12,
    'HHIC' : 8.0,
    'Geisinger Quality Options' : 0.48,
    'Capital Advantage Assurance Company' : 0.33,
    'Keystone Health Plan East, Inc.' : 15.11,
    'HealthAmerica, Pennsylvania Inc.' : 2.91,
    'Highmark' : 32.33,
    'First Priority Life Insurance Company' : 5.77,
    'UnitedHealthcare of Pennsylvania, Inc.' : 0.06
  },
  'VA' : {
    'BlueChoice, Inc.' : 9.05,
    'Aetna Life Insurance Company' : 2.96,
    'Piedmont Community HealthCare, Inc.' : 1.25,
    'Optima Health Plan' : 6.02,
    'HealthKeepers, Inc.' : 61.2,
    'GHMSI, Inc.' : 2.16,
    'Kaiser Foundation Health Plan of the Mid-Atlantic States, Inc.' : 5.06,
    'Coventry Health Care of Virginia, Inc' : 6.28,
    'Innovation Health Insurance Company' : 6.03
  },
  'AK' : {
    'Premera Blue Shield Blue Cross' : 24.45,
    'Moda Health Plan, Inc.' : 75.55
  },
  'AL' : {
    'Humana Insurance Company' : 2.89,
    'Blue Cross and Blue Shield of Alabama' : 96.08,
    'UnitedHealthcare of Alabama' : 1.03
  },
  'AR' : {
    'QCA Health Plan, Inc.' : 4.55,
    'Celtic Insurance Company' : 18.28,
    'USAble Mutual Insurance Company' : 72.92,
    'QualChoice Life & Health Insurance Company, Inc.' : 4.25
  },
  'IL' : {
    'IlliniCare Health Plan' : 2.15,
    'UnitedHealthcare of the Midwest, Inc.' : 0.86,
    'Blue Cross Blue Shield of Illinois' : 71.35,
    'Health Alliance Medical Plans' : 6.56,
    'Humana Health Plan, Inc.' : 1.36,
    'Coventry Health and Life Insurance Company' : 1.08,
    'Land of Lincoln Mutual Health Insurance Company' : 11.85,
    'Humana Insurance Company' : 0.37,
    'Time Insurance Company' : 3.08,
    'Coventry Health Care of Illinois, Inc.' : 1.35
  },
  'GA' : {
    'UnitedHealthcare of Georgia, Inc.' : 1.96,
    'Blue Cross Blue Shield Healthcare Plan of Georgia, Inc.' : 28.33,
    'Peach State Health Plan' : 2.76,
    'Coventry Health Care of Georgia, Inc.' : 9.65,
    'Humana Employers Health Plan of Georgia, Inc.' : 49.06,
    'Kaiser Foundation Health Plan of Georgia' : 3.95,
    'Cigna Health and Life Insurance Company' : 0.83,
    'Time Insurance Company' : 2.8,
    'Alliant Health Plans' : 0.66
  },
  'IN' : {
    'Anthem Insurance Companies, Inc.' : 55.83,
    'Indiana University Health Plans, Inc.' : 0.72,
    'Southeastern Indiana Health Organization, Inc.' : 0.98,
    'CareSource Indiana Inc.' : 3.98,
    'MDwise Marketplace, Inc.' : 14.34,
    'All Savers Insurance Company' : 2.43,
    'Coordinated Care Corporation' : 6.06,
    'Time Insurance Company' : 8.97,
    'Physicians Health Plan of Northern IN' : 6.7
  },
  'IA' : {
    'Avera Health Plans, Inc.' : 0.16,
    'CHC IA' : 99.18,
    'Gundersen Health Plan, Inc.' : 0.65
  },
  'AZ' : {
    'Health Choice Insurance Co' : 0.26,
    'Health Net of Arizona' : 13.84,
    'Aetna Life Insurance Company' : 1.1,
    'Time Insurance Company' : 6.55,
    'Health Net Life Insurance Company' : 10.84,
    'Phoenix Health Plans, Inc.' : 0.26,
    'Cigna Health and Life Insurance Company' : 1.15,
    'Humana Health Plan, Inc.' : 1.73,
    'Compass Cooperative Health Plan, Inc. dba Meritus Health Partners' : 9.46,
    'All Savers Insurance Company' : 1.95,
    'Compass Cooperative Mutual Health Network, Inc. dba Meritus Mutual Health Partners' : 1.05,
    'University Healthcare, Inc.' : 7.72,
    'Blue Cross Blue Shield of Arizona' : 44.1
  },
  'ME' : {
    'Maine Community Health Options' : 61.09,
    'Harvard Pilgrim Health Care' : 4.3,
    'Anthem Health Plans of Maine, Inc.' : 34.61
  },
  'OK' : {
    'GlobalHealth, Inc' : 2.66,
    'Time Insurance Company' : 3.73,
    'CommunityCare HMO, Inc.' : 10.46,
    'Blue Cross Blue Shield of Oklahoma' : 83.15
  },
  'OH' : {
    'UnitedHealthcare of Ohio, Inc.' : 2.72,
    'Molina Healthcare of Ohio, Inc' : 1.48,
    'HealthSpan, Inc.' : 3.05,
    'Aetna Life Insurance Company' : 3.27,
    'Humana Health Plan of Ohio' : 4.79,
    'Community Insurance Company' : 17.86,
    'Coordinated Health Mutual, Inc.' : 4.54,
    'Medical Health Insuring Corp of Ohio' : 29.74,
    'Buckeye Community Health Plan' : 1.1,
    'HealthSpan Integrated Care' : 3.05,
    'Premier Health Plan, Inc.' : 0.85,
    'Summa Insurance Company' : 2.77,
    'AultCare Insurance Company' : 2.18,
    'CareSource Ohio Co' : 19.39,
    'Time Insurance Company' : 2.33,
    'Paramount Insurance Company' : 0.87
  },
  'UT' : {
    'Altius Health Plans Inc.' : 9.95,
    'BridgeSpan Health Utah' : 2.92,
    'Molina Healthcare of Utah, Inc.' : 9.7,
    'SelectHealth' : 46.12,
    'Humana Medical Plan of Utah' : 9.37,
    'Arches Mutual Insurance Company' : 21.93
  },
  'MO' : {
    'Healthy Alliance Life Insurance Company' : 37.83,
    'CHL' : 21.38,
    'Cigna Health and Life Insurance Company' : 5.52,
    'All Savers Insurance Company' : 3.34,
    'CHL MO' : 19.5,
    'Humana Insurance Company' : 3.66,
    'Blue Cross and Blue Shield of Kansas City' : 8.77
  },
  'MI' : {
    'Priority Health' : 1.8,
    'Blue Cross Blue Shield of Michigan' : 36.27,
    'Meridian Health Plan of Michigan' : 0.09,
    'Priority Health Insurance Company' : 0.22,
    'Humana Medical Plan of Michigan, Inc' : 9.15,
    'Total Health Care' : 3.9,
    'Consumers Mutual Insurance of Michigan' : 2.39,
    'Alliance Health & Life Insurance Company' : 0.55,
    'McLaren Health Plan' : 1.62,
    'Physicians Health Plan' : 0.45,
    'Molina Healthcare of Michigan, Inc' : 4.05,
    'Health Alliance Plan of Michigan' : 0.95,
    'Harbor Health Plan, Inc.' : 0.14,
    'UnitedHealthcare Community Plan, Inc.' : 0.8,
    'Time Insurance Company' : 1.55,
    'Blue Care Network of Michigan' : 36.06
  },
  'KS' : {
    'Blue Cross and Blue Shield of Kansas City' : 8.66,
    'Coventry Health and Life' : 47.7,
    'Coventry Health Care Of Kansas Inc' : 12.28,
    'Blue Cross and Blue Shield of Kansas, Inc.' : 28.23,
    'BlueCross BlueShield Kansas Solutions, Inc.' : 3.14
  },
  'MT' : {
    'PacificSource Health Plan, Inc.' : 9.29,
    'Blue Cross Blue Shield of Montana' : 49.04,
    'Time Insurance Company' : 11.7,
    'Montana Health Cooperative' : 29.97
  },
  'MS' : {
    'United Healthcare of Mississippi' : 10.93,
    'Humana Insurance Company' : 51.89,
    'Magnolia Health Plan' : 37.18
  },
  'SC' : {
    'Time Insurance Company' : 2.87,
    'BlueCross BlueShield of South Carolina' : 42.81,
    'BlueChoice HealthPlan of South Carolina, Inc.' : 14.69,
    "Consumers' Choice Health Plan" : 29.02,
    'Coventry Health Care of the Carolinas, Inc.' : 10.62
  },
  'SD' : {
    'Sanford Health Plan of South Dakota' : 28.82,
    'Avera Health Plans, Inc.' : 22.16,
    'South Dakota State Medical Holding Company, Inc.' : 49.02
  }
};

STATES = ["AZ", "CO", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "MD", "ME", "MA", "MN", "MI", "MS", "MO", "MT", "NC", "NE", "NV", "NH", "NJ", "NY", "ND", "NM", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "WI", "VA", "VT", "WA", "WV", "WY", "CA", "CT", "AK", "AR", "AL"];
COLORS = ["#80B1D3", "#FB8072", "#FDB462", "#B3DE69", "#FFED6F", "#BC80BD", "#8DD3C7", "#CCEBC5", "#FFFFB3", "#BEBADA", "#FCCDE5", "#D9D9D9", "#80B1D3", "#FB8072", "#FDB462", "#B3DE69", "#FFED6F", "#BC80BD", "#8DD3C7", "#CCEBC5", "#FFFFB3", "#BEBADA", "#FCCDE5", "#D9D9D9", "#80B1D3", "#FB8072", "#FDB462", "#B3DE69", "#FFED6F", "#BC80BD", "#8DD3C7", "#CCEBC5", "#FFFFB3", "#BEBADA", "#FCCDE5", "#D9D9D9"]

