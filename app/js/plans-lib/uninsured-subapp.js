angular.module('uninsuredSubapp', []).controller('uninsuredSubappCtrl', ['$scope', '$http', '$timeout',
function($scope, $http, $timeout) {

    // initialize variables
    $scope.selectedScenario = 'Bad Flu';

    /***************************************
     * Toggle Scenarios
     ***************************************/
    $scope.toggleScenario = function(name) {
        window.tagEvent('toggle scenario', {
            'name' : name
        });
        $scope.selectedScenario = name;
    };
    
}]).directive('counter', ['$timeout',
function($timeout) {
    return {
        restrict : 'A',
        link : function(scope, el, attrs) {
            var total = _.max(_.map(scope.planSelected.scenarios, function(scenario) {
                return scenario.costs.medcost + scenario.costs.drugcost
            }));

            var colorFunc = d3.scale.linear().domain([0, .5, 1]).range(['#2ca02c', '#ff7f0e', '#ce2627']);
            var generateCircle = function() {
                return new ProgressBar.Circle($(el)[0], {
                    strokeWidth : 10,
                    trailWidth : 10,
                    trailColor : '#eee',
                    duration : 2000,
                    easing : 'easeInOut',
                    text : {
                        value : '$0'
                    },
                });
            }
            var circle = generateCircle();

            scope.$watch('selectedScenario', function(val) {

                if (!val) {
                    return
                }
                var scenario = scope.planSelected.scenarios[val].costs;

                // animation
                circle.animate((scenario.medcost + scenario.drugcost) / total, {
                    step : function(state, circle) {
                        circle.text.innerHTML = '<div class = "text-center">' + attrs.name + ' <br style="line-height:0px;">' + '<h3 style = "font-weight:300;">$' + (circle.value() * total).toFixed(0) + '<span class = "h4" style ="font-weight:300;">/yr</span></h3></div>';
                        circle.path.setAttribute('stroke', colorFunc(circle.value()));
                    }
                });
            })
        }
    };
}]);
