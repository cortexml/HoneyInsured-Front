angular.module('basicinfoSubapp', ['enrollApp']).controller('basicinfoCtrl', ['$scope', '$http', '$timeout', 'enrollService',
function($scope, $http, $timeout, enrollService) {
    /*********************************
     * Controller for basic info page
     *********************************/
    // check if I or spouse is duplicated
    $scope.hasIorSpouse = function(rel) {
        return _.pluck($scope.profile.displayPersons, 'rel').indexOf(rel) > -1;
    }
    // check if ages and numPerson is filled up
    $scope.canAskIncome = false;
    $scope.subsidyError = null;
    $scope.canNext = false;
    var promise, promise2;
    $scope.$watch('profile', function(val) {
        // variables for going to next page
        $scope.canNext = false;
        $scope.subsidyError = null;
        if ($scope.profile.displayPersons.length == 0) {
            return
        }
        var allFilled = $scope.profile.displayPersons.length > 0 && _.chain($scope.profile.displayPersons).map(function(person) {
            return +person.age && ((['me', 'spouse'].indexOf(person.rel) > -1 && person.age >= 18) || person.rel == 'dependent');
        }).every().value();

        // check for all filled up info and canNext

        if (allFilled && +$scope.profile.size && +$scope.profile.income && $scope.form.$valid) {
            // check for medicaid and chip eligibilities
            var fplRatio = enrollService.calFPLRatio($scope.profile.size, $scope.profile.income);
            enrollService.setState($scope.profile.state);

            var probs = {
                medicare : [],
                chip : [],
                medicaid : []
            };
            var eligibilities = _.map($scope.profile.displayPersons, function(person) {
                enrollService.setChipOrMedicaidOrMedicareEligible(person, fplRatio);
                if (person.isChip) {
                    probs.chip.push(person);
                } else if (person.isMedicaid) {
                    probs.medicaid.push(person);
                } else if (person.isMedicare) {
                    probs.medicare.push(person);
                }
                person.isEligible = !(person.isMedicaid || person.isMedicare || person.isChip);
                return person.isMedicaid || person.isMedicare || person.isChip;
            });
            // check whether we can put them through
            if (_.every(eligibilities)) {
                $timeout.cancel(promise2);
                promise2 = $timeout(function() {
                    $scope.canNext = false;
                    $scope.subsidyError = 'Your family may qualify for government Medicaid or CHIP plans. Please visit HealthCare.gov for more information.';
                }, 1000);
            } else if (_.some(eligibilities)) {

                // construct string to alert
                var KEYNAMES = {
                    medicare : 'Medicare',
                    chip : 'CHIP',
                    medicaid : 'Medicaid'
                };
                var RELNAMES = {
                    'me' : 'you',
                    'spouse' : 'your spouse',
                    'dependent' : 'your AGE-year-old dependent'
                }
                var capitalize = function(string) {
                    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
                };
                var errorStrings = _.map(probs, function(vs, k) {
                    if (_.isEmpty(vs)) {
                        return
                    }
                    var names = _.reduce(vs, function(agg, person, ind) {
                        var s = RELNAMES[person.rel].replace('AGE', person.age);
                        if (agg == null) {
                            return capitalize(s);
                        } else if (ind == vs.length - 1) {
                            return agg + ' and ' + s;
                        } else {
                            return agg + ', ' + s;
                        }
                    }, null);
                    if (['medicaid', 'chip'].indexOf(k) > -1) {
                        names += " may qualify for government Medicaid or CHIP plans. That's okay! You can still proceed to view plans for the rest of your family."
                    } else if (k == 'medicare') {
                        names += ' may qualify for government ' + KEYNAMES[k] + " plans. That's okay! You can still proceed to view plans for the rest of your family."
                    }
                    return names;
                });
                errorStrings = _.compact(errorStrings);
                errorStrings = _.reduce(errorStrings, function(agg, str, ind) {
                    if (ind != errorStrings.length - 1) {
                        return agg + ' ' + str.replace(" That's okay! You can still proceed to view plans for the rest of your family.", '')
                    } else {
                        return agg + ' ' + str
                    }
                }, '');
                $timeout.cancel(promise2);
                promise2 = $timeout(function() {
                    $scope.subsidyError = errorStrings;
                    $scope.canNext = true;
                }, 1000);

            } else {
                $timeout.cancel(promise2);
                $scope.canNext = true;
                $scope.subsidyError = '';
            }
        };

        // check for age income
        if ($scope.canAskIncome) {
            return
        }
        $timeout.cancel(promise);
        promise = $timeout(function() {
            var last = _.last($scope.profile.displayPersons);
            $scope.canAskIncome = (last.rel != 'dependent' && String(last.age).length == 2 || last.rel == 'dependent') && allFilled;
        }, 100);
    }, true);

    // clone into persons for calculation
    $scope.$watch('canNext', function(val) {
        if (val) {
            $scope.profile.persons = _.clone(_.filter($scope.profile.displayPersons, function(person) {
                return person.isEligible
            }));
        }
        $scope.$parent.hasCompletedInfo = val;
    });

}]).directive('numPerson', ['$timeout',
function($timeout) {
    return {
        restrict : 'A',
        require : 'ngModel',
        link : function($scope, el, attrs, ngModel) {
            // set focus
            $(el).focus();
            var cachePersons = $scope.urlParams.profile&&$scope.urlParams.profile.persons?$scope.urlParams.profile.persons:[];
            // watch number of persons
            $scope.$watch('profile.numPerson', function(newVal, oldVal) {
                if (newVal == null) {
                    $scope.profile.numPerson = '';
                    cachePersons = _.map($scope.profile.displayPersons, _.clone);
                } else {
                    newVal = String(newVal);
                    if (newVal.length > 1 || (newVal.length == 1 && !+newVal)) {
                        $scope.profile.numPerson = oldVal
                    } else if (newVal.length == 1) {
                        // push people into profile persons
                        if (cachePersons.length > newVal) {
                            $scope.profile.displayPersons = cachePersons.slice(0, newVal);
                        } else if (cachePersons.length < newVal) {
                            var numToAdd = newVal - cachePersons.length;
                            var existingRels = _.uniq(_.pluck(cachePersons, 'rel'));
                            var newRels = [];
                            if (existingRels.indexOf('me') == -1) {
                                newRels.push('me');
                            }
                            if (existingRels.indexOf('spouse') == -1) {
                                newRels.push('spouse');
                            }
                            newRels = newRels.slice(0, numToAdd);
                            if (numToAdd > newRels.length) {
                                _.map(_.range(0, numToAdd - newRels.length), function(_) {
                                    newRels.push('dependent')
                                });
                            }
                            // add persons
                            _.map(newRels, function(rel) {
                                cachePersons.push({
                                    "rel" : rel,
                                    "age" : null,
                                    "smoker" : "false"
                                });
                            });
                            $scope.profile.displayPersons = cachePersons;
                        }

                        // Move focus over to the next input
                        $timeout(function() {
                            var elNext = $($(el).parent().nextAll()[_.map($scope.profile.displayPersons, function(person) {
                                return !person.age
                            }).indexOf(true)]).find('input');
                            elNext && elNext.focus();

                        }, 120);

                    }
                }
            });
        }
    }
}]).directive('numInput', ['$timeout',
function($timeout) {
    return {
        restrict : 'A',
        require : 'ngModel',
        link : function($scope, el, attrs, ngModel) {
            // watch number of persons
            $scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                if (newVal == null) {
                    ngModel.$setViewValue('');
                    ngModel.$render();
                } else {
                    newVal = String(newVal);
                    if (newVal.length > attrs.numInput || (newVal.length <= attrs.numInput && !+newVal)) {
                        ngModel.$setViewValue(oldVal);
                        ngModel.$render();
                    } else if (newVal.length == attrs.numInput) {
                        // Move focus over to the next input
                        $timeout(function() {
                            var elNext = $(el).parent().next().find('input').last();
                            elNext && elNext.focus();

                        }, 120);

                    }
                }
            });
        }
    }
}]).directive('size', ['$timeout',
function($timeout) {
    return {
        restrict : 'A',
        require : 'ngModel',
        link : function($scope, el, attrs, ngModel) {
            // bind household size to num persons initially
            $scope.$watch('canAskIncome', function(val) {
                if (val) {
                    ngModel.$setViewValue($scope.profile.numPerson);
                    ngModel.$render();
                }
            });
            $scope.$watch('profile.numPerson', function(val) {
                ngModel.$modelValue < val && (ngModel.$setViewValue(val), ngModel.$render());
            });
            $scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                if (!newVal) {
                    ngModel.$setValidity('insufficientTaxPeople', true);
                };
                if (+newVal && newVal < $scope.profile.numPerson) {
                    ngModel.$setValidity('insufficientTaxPeople', false);
                } else {
                    ngModel.$setValidity('insufficientTaxPeople', true);
                }
            });

        }
    }
}]).directive('age', ['$timeout',
function($timeout) {
    return {
        restrict : 'A',
        require : 'ngModel',
        link : function($scope, el, attrs, ngModel) {

            var checkAgeHelper = function(isApply) {
                if (['me', 'spouse'].indexOf($(el).parent().find('select').val()) > -1) {
                    if (ngModel.$viewValue != '' && +ngModel.$viewValue < 18) {
                        ngModel.$setValidity('insufficientAge', false);
                        isApply && $scope.$apply();
                    } else {
                        ngModel.$setValidity('insufficientAge', true);
                        isApply && $scope.$apply();
                    }
                } else {
                    ngModel.$setValidity('insufficientAge', true);
                    isApply && $scope.$apply();
                }
            }
            $(el).blur(function() {
                checkAgeHelper(true);
            });
            $scope.$on('checkAge', function() {
                checkAgeHelper();
            });
            $scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                if (!newVal) {
                    ngModel.$setValidity('insufficientAge', true);
                };
                if (['me', 'spouse'].indexOf($(el).parent().find('select').val()) > -1 && String(newVal).length == 2) {
                    newVal < 18 && ngModel.$setValidity('insufficientAge', false);
                    newVal >= 18 && ngModel.$setValidity('insufficientAge', true);
                }
            });

        }
    }
}]).directive('selectpickerRel', function() {
    return {
        restrict : 'A',
        require : 'ngModel',
        link : function(scope, el, attrs, ngModel) {
            $(el).selectpicker({
                // width : '100%'
            });

            scope.$watch(attrs.ngModel, function(val) {
                $(el).val(val);
                $(el).selectpicker('refresh');
                // takes into account relationship changes for age check
                scope.$broadcast('checkAge')
            });
            // re-render when relationship of other profiles change
            scope.$watch('profile.displayPersons', function() {
                $(el).val(ngModel.$viewValue);
                $(el).selectpicker('refresh');
            }, true);
        }
    };
});
