angular.module('visualizationSubapp', []).controller('visualizationSubappCtrl', ['$scope', '$http', '$timeout',
function($scope, $http, $timeout) {
    $scope.visualizeSelected = null;
    $scope.$watch('planSelected', function(val) {
        val && ($scope.visualizeSelected = val);
    });
    $scope.legend = {};

}]).directive('chart', ['$interval', '$timeout',
function($interval, $timeout) {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {

            /***************************
             * Plot chart
             ***************************/
            var svg, mySeries;
            var plotChart = function() {

                var TITLES = {
                    'medDed' : 'Deductible',
                    'moop' : 'Max Out Of Pocket',
                    'issuer' : 'Issuer',
                    'metal' : 'Metal Level',
                    'type' : 'Network'
                }
                var data = scope.plans;
                var xAxis = scope.$eval(attrs.chartX);
                var colorBy = scope.$eval(attrs.chartColor);

                svg && svg.remove();
                svg = dimple.newSvg(element[0], "100%", "100%");
                var myChart = new dimple.chart(svg, data);
                myChart.setMargins("60px", "30px", "10%", "50px");
                var x = myChart.addMeasureAxis("x", xAxis);
                x.title = TITLES[xAxis];
                var y = myChart.addMeasureAxis("y", "premium");
                y.title = "Monthly Premium";
                var yMin = Math.floor(_.min(_.pluck(data, "premium")) / 10) * 10 - 20;
                y.overrideMin = yMin;

                // define data for plotting
                mySeries = myChart.addSeries(["name", "id", "premium", "medDed", "metal", "type", colorBy], dimple.plot.bubble);
                mySeries.getTooltipText = function(e) {
                    return [e.aggField[0], 'Monthly Premium: ' + Math.round(e.aggField[2]), 'Deductible: ' + Math.round(e.aggField[3]), 'Click to view details ' + ($(window).width() > 767 ? 'on the right.' : 'below.')];
                };

                // assign colors and font
                myChart.assignColor("platinum", "#80B1D3");
                myChart.assignColor("gold", "#FFED6F");
                myChart.assignColor("silver", "#B5B5B5");
                myChart.assignColor("bronze", "#FDB462");
                myChart.assignColor("catastrophic", "#FB8072");

                x.fontSize = y.fontSize = 14;
                mySeries.tooltipFontSize = 14;
                mySeries.tooltipFontFamily = x.fontFamily = y.fontFamily = 'Lato';
                x.ticks = y.ticks = 5;

                reDraw(myChart, x, y);
                drawFav();
                mySeries.shapes.style('cursor', 'pointer').on('click', function(d) {
                    var planId = d.aggField[1];
                    if (scope.visualizeSelected.id != planId) {

                        $timeout(function() {
                            scope.visualizeSelected = null;
                            drawFav();
                            $timeout(function() {
                                scope.visualizeSelected = _.filter(scope.plans,function(plan){return plan.id == planId})[0];
                                window.tagEvent('click visualization', {
                                    planId : planId
                                });
                                drawFav();
                            }, 500);
                        }, 1);
                    };
                });

                // update colors for legend
                scope.legend = {};
                _.chain(scope.plans).pluck(colorBy).uniq().map(function(x) {
                    scope.legend[x] = myChart.getColor(x).fill
                });

                // resizing
                window.onresize = function() {
                    myChart.draw(0, true);
                    drawFav();
                    // patch for floating droplines
                    if (x.overrideMin > 0) {
                        x._origin = myChart._xPixels();
                    }
                    if (y.overrideMin > 0) {
                        y._origin = myChart._yPixels() + myChart._heightPixels();
                    }
                };

            };

            var drawFav = function() {
                var chart = mySeries.chart;
                chart._favorites ? chart._favorites.selectAll('*').remove() : (chart._favorites = svg.append("g"));

                mySeries.shapes.each(function(d) {
                    if (scope.visualizeSelected && scope.visualizeSelected.id == d.aggField[1]) {
                        shape = d3.select(this);
                        cx = parseFloat(shape.attr("cx"));
                        cy = parseFloat(shape.attr("cy"));
                        r = parseFloat(shape.attr("r"));
                        fill = shape.attr("stroke");

                        // Add a ring around the data point
                        chart._favorites.append("circle").attr("cx", cx).attr("cy", cy).attr("r", r + mySeries.lineWeight + 2).attr("opacity", 1).style("fill", "none").style("stroke", fill).style("stroke-width", 2);
                    }
                });
            }
            var reDraw = function(myChart, x, y, refreshData, timing) {
                var duration = 0;
                timing && ( duration = timing);
                myChart.draw(duration, refreshData);

                // patch for floating droplines
                if (x.overrideMin > 0) {
                    x._origin = myChart._xPixels();
                }
                if (y.overrideMin > 0) {
                    y._origin = myChart._yPixels() + myChart._heightPixels();
                }
            };

            /***************************
             * Watchers
             ***************************/
            // draw plot the first time
            // $timeout(plotChart, 4000)
            var firstPlot = scope.$watch('visualizeSelected', function(val) {
                val && $timeout(plotChart, 400);
                firstPlot();
            });

            // watching color change
            scope.$watch(attrs.chartColor, function(newVal, oldVal) {
                plotChart();
            });

            // watching axis change
            scope.$watch(attrs.chartX, function(newVal, oldVal) {
                plotChart();
            });

        }
    }
}]);
