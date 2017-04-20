angular.module('enrollApp', ['utilsApp', 'ngAnimate', 'ngRoute']).value('ENROLL_CONSTANTS', {
    'COUNTRIES' : ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, The Democratic Republic of The", "Cook Islands", "Costa Rica", "Cote D'ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-bissau", "Guyana", "Haiti", "Heard Island and Mcdonald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic of", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, The Former Yugoslav Replublic Of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic Of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and The Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and The South Sandwich Islands", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela, Bolivarian Republic Of", "Vietnam", "Virgin Islands, British", "Virgin Islands, U.S.", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"],
    'STATES' : ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'FM', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'],
    'EAD_CODES' : ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10", "A11", "A12", "A13", "A14", "A15", "A16", "A17", "A18", "A19", "A20", "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24"],
    'SPECIAL_ENROLLMENT_DATE':['Coverage End Date','Coverage End Date','Marriage Date','Release Date','Immigration Date','Move Date'],
    'TAX_STATUS' : {
        single : ["Single, filing taxes", "Single, claimed as dependent", "Single, not filing"],
        married : ["Married, filling jointly", "Married, filling separately", "Married, not filing", "Married, claimed as dependent"]
    },
    'RELATIONSHIPS' : ['Spouse', 'Son/daughter', 'Parent', 'Domestic partner', 'Stepparent', "Parent's domestic partner", 'Stepson/stepdaughter', 'Child of domestic partner', 'Brother/sister', 'Uncle/aunt', 'Nephew/niece', 'Grandparent', 'Grandchild', 'Other relative', 'Other unrelated'],
    'RELATIONSHIPS_RESTRICTIONS' : [1, null, 2, 1, 2, 1, null, null, null, null, null, 4, null, null, null],
    'CHIP_MEDICAID_BREAKPOINTS' : {
        VA : [1.43, 1.43, 1.43, 2, 1.43, null, .49, 1, null],
        TX : [1.98, 1.44, 1.33, 2.01, 1.98, null, .15, 1, null],
        OH : [2.06, 2.06, 2.06, null, 2, null, 1.33, 1.33, null],
        MO : [1.96, 1.5, 1.5, 3, 1.96, null, .18, 1, null],
        NC : [2.1, 2.1, 1.33, 2.11, 1.96, null, .45, 1, .46],
        NY : [2.18, 1.49, 1.49, 4, 2.18, null, 1.33, 1.33, 1.5],
        PA : [2.15, 1.57, 1.33, 3.14, 2.15, null, 1.33, 1.33, 1.33],
        GA : [2.05, 1.49, 1.33, 2.47, 2.2, null, .35, 1, null],
        FL : [2.06, 1.4, 1.33, 2.1, 1.91, null, .3, 1, .3],
        CA : [2.61, 2.61, 2.61, null, 2.08, null, 1.33, 1.33, null],
        IL : [1.42, 1.42, 1.42, 3.13, 2.08, null, 1.33, 1.33, null],
        AZ : [1.47, 1.41, 1.33, null, 1.56, null, 1.33, 1.33, null],
        OR : [1.85, 1.33, 1.33, 3, 1.85, null, 1.33, 1.33, null]
    }
}).controller('enrollCtrl', ['$scope', '$http', '$timeout', 'ENROLL_CONSTANTS', 'enrollService', 'utilsService', 'UTILS_CONSTANTS', '$location',
function($scope, $http, $timeout, ENROLL_CONSTANTS, enrollService, utilsService, UTILS_CONSTANTS, $location) {
    /****************************************
     * Register Constants
     ****************************************/
    $scope.CONSTANTS = ENROLL_CONSTANTS;
    $scope.CONSTANTS.DEFINITIONS = UTILS_CONSTANTS.DEFINITIONS;
    $scope.urlParams = urlParams;
    $scope.profile = urlParams.profile;
    $scope.hasPlan = true;
    $scope.error = null;
    var ERROR_TEXT = 'Oops our HoneyInsured bot found an error. Please contact us via support@honeyinsured.com or chat and we will assist you as soon as possible!';
    $scope._ = _;
    $scope.startDate = enrollService.calInsuranceStartDate();

    // special enrollment reasons
    var dBefore = enrollService.serviceCalDate(-61);
    var dAfter = enrollService.serviceCalDate(60);
    $scope.specialEnrollmentReasons = ['Lost coverage after ' + dBefore, 'Will lose coverage before ' + dAfter, 'Got married after ' + dBefore, 'Get released from incarceration after ' + dBefore, 'Gained immigration status after ' + dBefore, 'Moved to a different zip code after ' + dBefore];
    
    // set selected plan from cookie cache if not resort to query server
    $scope.plan = utilsService.getPlan(urlParams.plan);
    if (!$scope.plan) {
        $scope.hasPlan = false;
        $http.get(utilsService.RECOMMEND_ENDPOINT + window.encodeJson(urlParams.profile) + '&id=' + urlParams.plan).then(function(res) {
            if (!res.data.premium) {
                $scope.error = ERROR_TEXT;
                window.reportBug('enroll plan not found', JSON.stringify(res));
            } else {
                // cache plan
                $scope.plan = res.data;
                utilsService.savePlan($scope.plan);
                $scope.form.isSubsidy = !!$scope.plan.originalPremium;
                $scope.hasPlan = true;
            }
        });
    };

    // tagging from recommend page
    var firstTag = $scope.$watch('plan', function(val) {
        if (val) {
            var a = document.createElement('a');
            a.href = document.referrer;
            if (a.pathname == '/recommend.html') {
                window.tagEvent('enroll', {
                    plan : val.name
                });
            }

            $scope.plan.metal == 'catastrophic' && ($scope.templateIndex = -1);
            firstTag();
        }
    });

    enrollService.setState(urlParams.state);

    // for showing errors
    $scope.errors = null;

    /****************************************
     * Server Caching
     ****************************************/
    var serverCache = function(stage, callback) {
        $scope.form.plan = $scope.plan;

        $http.post(utilsService.ENROLL_ENDPOINT + '&stage=' + stage, {
            data : window.encodeJson($scope.form)
        }).then(function(res) {
            +res.data && ($scope.applicationId = res.data);

            window.tagEvent('Enroll ' + stage, {
                applicationId : $scope.applicationId
            });
            if (stage == 'you') {
                window.updateUser('Signup Enroll', $scope.form.email, {
                    name : $scope.form.members[0].firstName
                });
            }
        }, function(err) {
            window.reportBug('enroll post fail', JSON.stringify(res));
        });

        // double back user data
        window.reportBug('Enroll Cache ' + stage + ' ' + $scope.form.members[0].firstName, window.encodeJson($scope.form));

        callback && callback();
    };

    /****************************************
     * Form values
     ****************************************/
    $scope.form = {
        userId : getCookie('userId'),
        address : {
            'fip' : urlParams.fip,
            'zip' : urlParams.zip,
            'state' : urlParams.state
        },
        primary : {},
        members : [{
            relationship : 'You'
        }],
        incomes : [],
        isSubsidy : $scope.plan && !!$scope.plan.originalPremium
    };

    // add household members
    $scope.addMember = function(rel, evt) {
        // make sure no weird relationships
        var restriction = ENROLL_CONSTANTS.RELATIONSHIPS_RESTRICTIONS[ENROLL_CONSTANTS.RELATIONSHIPS.indexOf(rel)];
        if (restriction && _.filter($scope.form.members, function(x) {
            return x.relationship == rel
        }).length >= restriction) {
            // throw error
            return
        }
        $scope.form.members.push({
            'relationship' : rel
        });

        // shift focus
        $('#addMember').dropdown('toggle');
        $timeout(function() {
            $('.household-name:last').focus();
        }, 100);

        evt.stopPropagation();
    };
    $scope.removeMember = function(index, evt) {
        index > 0 && $scope.form.members.splice(index, 1);
        evt.stopPropagation();
    };

    // add income
    $scope.addIncome = function(firstName, evt) {
        $scope.form.incomes.push({
            'person' : firstName
        });

        // shift focus
        $('#addIncome').dropdown('toggle');
        $timeout(function() {
            $('.income-amount:last').focus();
        }, 100);
        evt.stopPropagation();
    };
    $scope.removeIncome = function(index, evt) {
        $scope.form.incomes.splice(index, 1);
        evt.stopPropagation();
    };

    /****************************************
     * Track template
     ****************************************/
    $scope.templateIndex = 0;
    var templateIndexHistory = [];
    $scope.next = function(form) {
        //validate
        form.$setSubmitted();
        var i = $scope.templateIndex;
        FORMS[$scope.templateIndex] = form || {
            $valid : true
        };

        // check for married but seperated one
        if (i == 1 && form.$valid && $scope.marriedButSeperated && !$scope.form.proceedWithoutSubsidy) {
            return
        };

        if (form.$valid) {
            // check next page
            if (i == 0) {
                templateIndexHistory.push($scope.templateIndex);
                $scope.templateIndex++;
                serverCache('you');
            }
            // household page
            else if (i == 1) {
                templateIndexHistory.push($scope.templateIndex);
                serverCache('household');
                // go to income page
                if ($scope.form.isSubsidy) {
                    // drop subsidy & go to income
                    if ($scope.marriedButSeperated && $scope.form.proceedWithoutSubsidy) {
                        FORMS[2] = {
                            $valid : true
                        };
                        verifyInformation(true);
                        $scope.templateIndex = 3;
                    } else {
                        // add income by default
                        var existingIncomes = _.pluck($scope.form.incomes, 'person');
                        _.map($scope.form.members, function(member) {
                            existingIncomes.indexOf(member.firstName) == -1 && $scope.form.incomes.push({
                                'person' : member.firstName
                            });
                        });
                        $scope.templateIndex++;
                    }
                } else {
                    $scope.templateIndex = 3;
                    verifyInformation();
                }
            }
            // income page
            else if (i == 2) {
                templateIndexHistory.push($scope.templateIndex);
                serverCache('income');
                $scope.templateIndex = 3;
                verifyInformation();
            } else if (i == 4) {
                $scope.templateIndex = 5;
            } else if (i == 5) {
                // submit!
                $scope.hasCompleted = true;
                $scope.templateIndex = 6;
                serverCache('submit', function() {
                    $scope.hasCompleted = true;
                    $scope.templateIndex = 7;
                });
            }

            // scroll to top
            $('html,body').animate({
                scrollTop : 0
            }, 400);
        };
    };
    $scope.back = function() {
        templateIndexHistory.length > 0 && ($scope.templateIndex = templateIndexHistory.splice(-1, 1));
    };

    /****************************************
     * Handle married but not filing jointly
     ****************************************/
    $scope.marriedButSeperated = false;
    $scope.form.proceedWithoutSubsidy = false;
    $scope.$watch('form.members', function(val) {
        if (_.pluck(val, 'relationship').indexOf('Spouse') > -1) {
            _.map(_.filter($scope.form.members, function(member) {
                return ['You', 'Spouse'].indexOf(member.relationship) > -1
            }), function(member) {
                member.isMarried = true
            });
            $scope.marriedButSeperated = false;
        } else if ($scope.form.members[0].isMarried) {
            $scope.marriedButSeperated = true;
        } else {
            $scope.marriedButSeperated = false;
        }
    }, true);

    /****************************************
     * Navigation
     ****************************************/
    $scope.$watch('templateIndex', function(val) {
        $location.hash(val);
    });
    // cache forms
    var FORMS = {
        2 : {
            $valid : !$scope.form.isSubsidy
        },
        3 : {
            $valid : true
        },
        4 : {
            $valid : true
        }
    };
    $scope.$on('$locationChangeStart', function(event) {
        if ($scope.hasCompleted) {
            event.preventDefault();
            return
        }
        // check hash location validity
        if (+$location.hash() == -1) {
            return
        }
        if (+$location.hash() || +$location.hash() == 0) {
            var count = 0;
            _.map(_.range(0, +$location.hash()), function(i) {
                /*******************
                 * Exception on 1 for
                 * dropping subsidy
                 *******************/
                FORMS[i] && (FORMS[i].$valid || (i == 1 && _.keys(FORMS[1].$error).length == 1 && FORMS[1].$error.invalidTaxStatus)) && count++;
            });
            if (+$location.hash() == count) {
                $scope.templateIndex = count;
            } else {
                $scope.templateIndex = 0;
            }
        }
    });
    $scope.goBackInfo = function(hash) {
        var query = location.search.substr(1);
        query = query.slice(0, query.indexOf('&plan=')) + hash;
        // redirect to info page
        window.location = '/info.html?' + query;
    };
    $scope.goBackRecommend = function() {
        var query = location.search.substr(1);
        // double has to demark end of query string
        query = query.slice(0, query.indexOf('&plan=')) + '##' + $scope.urlParams.plan;
        // redirect to recommend page
        window.location = '/recommend.html?' + query;
    };

    /*************************************
     * Check eligibility again
     ************************************/
    var verifyInformation = function(assumeNoSubsidy) {
        // check eligibility again
        if ($scope.form.isSubsidy && !assumeNoSubsidy) {
            var totalIncome = _.reduce($scope.form.incomes, function(agg, num) {
                return agg + parseInt(num.amount.replace('$', ''));
            }, 0);

            var fplRatio = enrollService.calFPLRatio($scope.form.incomes.length, totalIncome);
            $scope.inEligibles = [];
            _.map($scope.form.members, function(person) {
                if (person.isApplying) {
                    enrollService.setChipOrMedicaidOrMedicareEligible(person, fplRatio);
                    person.isEligible = !(person.isMedicaid || person.isMedicare || person.isChip);
                    !person.isEligible && $scope.inEligibles.push(person);
                }
            });
            // console.log($scope.inEligibles)
        }

        // check changes in premium
        var f = {
            address : $scope.form.address,
            incomes : $scope.form.incomes,
            members : _.filter($scope.form.members, function(m) {
                return !$scope.form.isSubsidy || (m.isApplying && (assumeNoSubsidy || m.isEligible))
            })
        };

        // if no one can be enrolled
        $scope.nonEligible = false;
        if (f.members.length == 0) {
            $scope.nonEligible = true;
            $scope.templateIndex = 4;
            return
        }

        //convert to profile form
        var newProfile = {
            fip : f.address.fip,
            zip : f.address.zip,
            state : f.address.state,
            'income' : assumeNoSubsidy || !$scope.form.isSubsidy ? 10000 : _.reduce(f.incomes, function(agg, num) {
                return agg + parseInt(num.amount.replace('$', ''))
            }, 0), // large number if not applying for subsidies
            'size' : $scope.form.isSubsidy ? f.members.length : $scope.profile.size,
            persons : []
        }
        _.map(f.members, function(member) {
            var person = {
                age : enrollService.calAge(member.birthdate),
                smoker : member.isTobacco ? "true" : "false"
            }
            newProfile.persons.push(person);
        });

        $http.get(utilsService.RECOMMEND_ENDPOINT + window.encodeJson(newProfile) + '&id=' + $scope.plan.id).then(function(res) {
            var newPlan = res.data;
            var oldPremium = $scope.plan.premium;

            // update new data
            _.map(['premium', 'medDed', 'moop'], function(k) {
                $scope.plan[k] = newPlan[k];
            });
            if (newPlan.originalPremium) {
                $scope.plan.originalPremium = newPlan.originalPremium;
            } else {
                delete $scope.plan.originalPremium
            }

            // choose to notify users
            if (Math.abs(1 - oldPremium / newPlan.premium) > .01 || !_.isEmpty($scope.inEligibles)) {
                $scope.templateIndex = 4;
            } else {
                $scope.templateIndex = 5;
            }
        });
    }
}]).factory('enrollService', ['ENROLL_CONSTANTS',
function(ENROLL_CONSTANTS) {

    var _state;

    /***************************
     * Main Service
     ***************************/
    var service = {};

    service.setState = function(state) {
        _state = state;
    };

    /***************************
     * Utils for household
     ***************************/
    service.calFPLRatio = function(size, income) {
        if (+size && +income) {
            // 4160 for is PY 2016, 4060 is for PY 2015
            return income / (7610 + 4160 * size);
        } else {
            return null;
        }
    };

    /***************************
     * Utils for each person
     ***************************/
    service.calAge = function(dateString) {
        var today = new Date(service.calInsuranceStartDate() + ' 2016');

        var parts = dateString.split('/');
        // yyyy,mm,dd
        var birthDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    service.setChipOrMedicaidOrMedicareEligible = function(person, fplRatio) {
        // get age
        if (!person.birthdate && !person.age) {
            return
        }
        var age = person.age ? person.age : this.calAge(person.birthdate);
        person.isMedicare = age >= 65;

        // not applying for subsidy
        if (!fplRatio || person.isMedicaidChipRejected) {
            person.isMedicaid = false;
            person.isChip = false;
            return
        }

        // calculate medicaid and chip
        var breakpoints = ENROLL_CONSTANTS.CHIP_MEDICAID_BREAKPOINTS[_state];
        var medicaid, chip;

        // Kids
        if (age <= 18) {
            var index = _.chain([2, 6, 19]).map(function(v, i) {
            return [v-age, i]
            }).filter(function(x) {
            return x[0] > 0
            }).min(function(x) {
            return x[0]
            }).value()[1];

            medicaid = breakpoints[index];
            index == 2 && ( chip = breakpoints[3]);
        }// Adults
        else {
            // 19 to 20
            if (breakpoints[8] && age < 21) {
                medicaid = breakpoints[8];
            } else {
                medicaid = person.isCaretaker ? breakpoints[6] : (breakpoints[7] - .05);
            }
        }

        // pregnancy
        if (person.gender && person.gender == 'female' && person.isPregnant) {
            medicaid = medicaid ? _.max([medicaid, breakpoints[4]]) : breakpoints[4];
            chip = chip ? _.max([chip, breakpoints[5]]) : breakpoints[5];
        }

        // set medicaid and chip
        var offset = .05;
        fplRatio -= offset;
        person.isMedicaid = medicaid ? fplRatio <= medicaid : false;
        person.isChip = chip ? fplRatio <= chip : false;
    };

    service.calInsuranceStartDate = function() {
        // give ourselves 3 hours leeway to fulfill orders
        var date = new Date(Date.now() + 3600 * 1e3 * .5);

        // OEP exception
        if (date < new Date(2015, 11, 16)) {
            return 'January 1'
        }

        var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return date.getDate() < 16 ? MONTHS[(date.getMonth() + 1) % 12] + ' 1' : MONTHS[(date.getMonth() + 2) % 12] + ' 1';

    };

    service.serviceCalDate = function(days) {
        var date = new Date(Date.now());
        date.setDate((date.getDate() + (days || 0)))
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
    }
    /***************************
     * Utils for checking
     ***************************/
    // check for duplicate names
    // check for duplicate SSNs

    return service

}]).directive('geolocation', function() {
    return {
        restrict : 'A',
        link : function(scope, el, attrs) {
            /****************************************
             * Google API for address
             ****************************************/
            var data = scope.$eval(attrs.geolocation);
            var autocomplete = new google.maps.places.Autocomplete($(el)[0], {
                types : ['geocode'],
                componentRestrictions : {
                    country : 'US'
                }
            });
            var componentForm = {
                street_number : 'short_name',
                route : 'long_name',
                administrative_area_level_1 : 'short_name',
                locality : 'long_name',
                postal_code : 'short_name'
            };
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                var tmp = {}
                var t;
                _.map(place.address_components, function(x) {
                    (( t = componentForm[x.types[0]]), t) && (tmp[x.types[0]] = x[t])
                });

                tmp.postal_code && (data.zip = tmp.postal_code);
                data.state = tmp.administrative_area_level_1 ? tmp.administrative_area_level_1 : '';
                data.city = tmp.locality ? tmp.locality : '';
                data.street = (tmp.street_number ? tmp.street_number + ' ' : '') + (tmp.route ? tmp.route : '');

                $(el).blur();
                scope.$apply();
            });
        }
    };
}).directive('checkGender', ['$http',
function($http) {
    /*************************************
     * Pull up details page
     *************************************/
    return {
        restrict : 'A',
        require : 'ngModel',
        link : function(scope, el, attrs, ngModel) {
            // only find by position
            var firstNameDom = $($(el).parent().parent().find('input')[0]);
            firstNameDom.blur(function() {
                if ($(this).val() != '') {
                    $http.get('https://api.genderize.io/?name=' + $(this).val() + '&country_id=us&language_id=en').then(function(resp) {
                        resp.data.probability && parseFloat(resp.data.probability) > .9 && (ngModel.$setViewValue(resp.data.gender));
                    });
                }
            });
        }
    }
}]).directive('validEmail', function() {
    return {
        require : 'ngModel',
        link : function(scope, el, attrs, ctrl) {
            ctrl.$validators.fakeEmail = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue) || modelValue.length <= 5) {
                    return true
                }
                var fakeEmail = _.some([/^\d+@/, /^none@/, /^no@/, /@mailinator/, /@asdf/, /@namemail/, /@noemail/, /^test@/, /john@gmail.com/, /@fakeinbox/], function(reg) {
                    return reg.test(modelValue);
                });
                return !fakeEmail;
            };
        }
    };
}).directive('validPhone', function() {
    return {
        require : 'ngModel',
        link : function(scope, el, attrs, ctrl) {
            ctrl.$validators.fakePhone = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue) || modelValue.replace(/_/g, '').length < 14) {
                    return true
                }
                return ['201', '202', '203', '205', '206', '207', '208', '209', '210', '212', '213', '214', '215', '216', '217', '218', '219', '224', '225', '228', '229', '231', '234', '239', '240', '248', '251', '252', '253', '254', '256', '260', '262', '267', '269', '270', '272', '276', '281', '301', '302', '303', '304', '305', '307', '308', '309', '310', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '323', '325', '330', '331', '334', '336', '337', '339', '340', '346', '347', '351', '352', '360', '361', '385', '386', '401', '402', '404', '405', '406', '407', '408', '409', '410', '412', '413', '414', '415', '417', '419', '423', '424', '425', '430', '432', '434', '435', '440', '442', '443', '458', '469', '470', '475', '478', '479', '480', '484', '501', '502', '503', '504', '505', '507', '508', '509', '510', '512', '513', '515', '516', '517', '518', '520', '530', '531', '534', '539', '540', '541', '551', '559', '561', '562', '563', '567', '570', '571', '573', '574', '575', '580', '585', '586', '601', '602', '603', '605', '606', '607', '608', '609', '610', '612', '614', '615', '616', '617', '618', '619', '620', '623', '626', '630', '631', '636', '641', '646', '650', '651', '657', '660', '661', '662', '667', '669', '670', '671', '678', '681', '682', '684', '701', '702', '703', '704', '706', '707', '708', '712', '713', '714', '715', '716', '717', '718', '719', '720', '724', '725', '727', '731', '732', '734', '737', '740', '747', '754', '757', '760', '762', '763', '765', '769', '770', '772', '773', '774', '775', '779', '781', '785', '786', '787', '801', '802', '803', '804', '805', '806', '808', '810', '812', '813', '814', '815', '816', '817', '818', '828', '830', '831', '832', '843', '845', '847', '848', '850', '856', '857', '858', '859', '860', '862', '863', '864', '865', '870', '872', '878', '901', '903', '904', '906', '907', '908', '909', '910', '912', '913', '914', '915', '916', '917', '918', '919', '920', '925', '928', '929', '931', '936', '937', '938', '939', '940', '941', '947', '949', '951', '952', '954', '956', '970', '971', '972', '973', '978', '979', '980', '984', '985', '989'].indexOf(modelValue.slice(1, 4)) > -1;
            };
        }
    };
}).directive('validZipcode', function() {
    return {
        require : 'ngModel',
        link : function(scope, el, attrs, ctrl) {
            ctrl.$validators.wrongZip = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue) || modelValue.length < 5) {
                    return true
                }
                return scope.urlParams.zip == modelValue;
            };
        }
    };
}).directive('capitalizeFirst', ['$parse',
function($parse) {
    return {
        require : 'ngModel',
        link : function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize($parse(attrs.ngModel)(scope));
            // capitalize initial value
        }
    };
}]).directive('validBirthdate', ['enrollService',
function(enrollService) {
    return {
        require : 'ngModel',
        link : function(scope, el, attrs, ctrl) {
            ctrl.$validators.insufficientAge = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue) || modelValue.replace(/[mdy]/, '').length < 10) {
                    return true
                }
                if (scope.$eval(attrs.validBirthdate) == 'You' && enrollService.calAge(modelValue) < 18 && enrollService.calAge(modelValue) >= 0) {
                    return false
                }
                return true
            };

            ctrl.$validators.fakeBirthdate = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue) || modelValue.replace(/[mdy]/, '').length < 10) {
                    return true
                }
                console.log(modelValue, enrollService.calAge(modelValue))
                return enrollService.calAge(modelValue) >= 0;
            };
        }
    };
}]).directive('validTaxStatus', ['enrollService',
function(enrollService) {
    return {
        require : 'ngModel',
        link : function(scope, el, attrs, ctrl) {

            // function to check whether we should show tax status alert
            var showError = function() {
                return _.isEmpty(_.keys(scope.$eval(attrs.validTaxStatusForm).$error));
            };

            // enforce spouse married status
            if (scope.$eval(attrs.validTaxStatus) == 'You') {

                scope.$watch('form.members', function(val) {
                    if (_.pluck(val, 'relationship').indexOf('Spouse') > -1) {
                        _.map(_.filter(scope.form.members, function(member) {
                            return ['You', 'Spouse'].indexOf(member.relationship) > -1
                        }), function(member) {
                            member.isMarried = true
                        });

                        ctrl.$setValidity('invalidTaxStatus', true);
                    } else if (scope.form.members[0].isMarried) {
                        ctrl.$setValidity('invalidTaxStatus', false);
                    }
                }, true);
            }

            ctrl.$validators.invalidTaxStatus = function(modelValue, viewValue) {
                if (scope.$eval(attrs.validTaxStatus) != 'You') {
                    return true
                }
                if (showError() && modelValue && _.isEmpty(_.filter(scope.form.members, function(member) {
                    return member.relationship == 'Spouse'
                }))) {
                    return false
                }
                return true
            }
        }
    }
}]).directive('validSignature', function() {
    return {
        require : 'ngModel',
        link : function(scope, el, attrs, ctrl) {
            ctrl.$validators.invalidSignature = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return true
                }
                if (modelValue.toLowerCase().trim() == (scope.form.members[0].firstName + ' ' + scope.form.members[0].lastName).toLowerCase().trim()) {
                    return true
                }
                return false
            }
        }
    }
});

