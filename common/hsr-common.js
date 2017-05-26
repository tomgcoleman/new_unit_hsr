define('hsrCommon', [
    'jquery', 'underscore', 'deviceInfo', 'QUnit'
], function($, _, deviceInfo, QUnit) {
    'use strict';

    return {
        hasDuplicateId: function() {
            var dupIds = [];

            var exceptionList = ['nectarTooltip', 'coalitionHeader', 'coalitionBadgenectar', 'coalitionTextnectar', 'coalitionBadgepayback', 'coalitionTextpayback', 'coalitionBadgemaximiles', 'coalitionTextmaximiles', 'coalitionBadgeT-POINT', ' coalitionTextT-POINT', //MAIN-124580
                'phoneTooltip', //MAIN-124586
                'gtFooterContainer' //MAIN-130404
            ];

            $('#mainContent [id]').each(function() {
                if ($('[id="' + this.id + '"]').length > 1) {
                    if (exceptionList && this.id && exceptionList.indexOf(this.id) < 0 &&
                        this.id.indexOf('pdoText') !== 0 && //MAIN-124587
                        this.id.indexOf('saleBadge') !== 0 && //MAIN-125804
                        this.id.indexOf('pdoTooltip') !== 0 ) //BHS-7113
                    {
                        if (localStorage.showNewUnitConsoleLog) {
                            console.log("QUNIT: duplicate id found: " + this.id);
                        }
                        if (dupIds.indexOf(this.id) < 0) {
                            dupIds.push(this.id);
                        }
                    }
                }
            });

            return dupIds;
        },
        getHotels: function() {
            var resultsArray = [];

            for (var i = 0; i < window.pageModel.results.length; i++) {
                if (!window.pageModel.results[i].isOpaque) {
                    resultsArray.push(window.pageModel.results[i]);
                }
            }

            return resultsArray;
        },
        getOrganicHotels: function() {
            var resultsArray = [];

            for (var i = 0; i < window.pageModel.results.length; i++) {
                if (!window.pageModel.results[i].isOpaque) {
                    if (window.pageModel.results[i].decoration == "organic") {
                        resultsArray.push(window.pageModel.results[i]);
                    }
                }
            }
            return resultsArray;
        },
        getCssStyle: function(className) {
            try {
                for (var i = 0; i < document.styleSheets.length; i++) {
                    var classes = document.styleSheets[i].rules,
                        j;
                    if (classes) {
                        for (j = 0; j < classes.length; j++) {
                            if (classes[j].selectorText == className) {
                                if (classes[j].cssText) {
                                    return classes[j].cssText;
                                }
                                return classes[j].style.cssText;
                            }
                        }
                    }

                    classes = document.styleSheets[i].cssRules
                    if (classes) {
                        for (j = 0; j < classes.length; j++) {
                            if (classes[j].selectorText == className) {
                                if (classes[j].cssText) {
                                    return classes[j].cssText;
                                }
                                return classes[j].style.cssText;
                            }
                        }
                    }
                }
                return "NO_OP"; // DID NOT FIND STYLE
            } catch (e) {
                if (e.name === "SecurityError") {
                    if (localStorage.showNewUnitConsoleLog) {
                        console.log("WARNING: Unable to perform the CSS style check due to security restriction by browser. Skipping verification.");
                    }
                    return "NO_OP";
                }
                throw e;
            }
        },
        hasVipHotel: function hasVipHotel() {
            var hotelList = this.getHotels();

            for (var i = 0; i < hotelList.length; i++) {
                if (hotelList[i].retailHotelInfoModel.isVipAccess) {
                    return true;
                }
            }
            return false;
        },
        getVisibleState: function(jqObj, wantVisible, noSpaceOk, useCssVisibility) {
            jqObj = $(jqObj);
            var isShownOnBrowser = jqObj.is(':visible'); // this returns true for hsr wizard elements.
            var isShownOnBrowser2 = jqObj.css(':visibility') == 'visible';
            var hasOccupiedSpaces = ((jqObj.width() > 0) && (jqObj.height() > 0)) || noSpaceOk;

            if (useCssVisibility) {
                if (wantVisible && !isShownOnBrowser) {
                    isShownOnBrowser = isShownOnBrowser2;
                }
                if (!wantVisible && isShownOnBrowser) {
                    isShownOnBrowser = isShownOnBrowser2;
                }
            }
            return isShownOnBrowser && hasOccupiedSpaces;
        },
        isVisible: function(jqObj, errMsg, noSpaceOk, useCssVisibility) {
            jqObj = $(jqObj);

            var elementIsProperlyShowing = this.getVisibleState(jqObj, true, noSpaceOk, useCssVisibility);

            QUnit.ok(elementIsProperlyShowing, errMsg);

            if (!elementIsProperlyShowing) {
                var parent = jqObj.parent();
                do {
                    if (parent.is(':visible') && parent.width() > 0 && parent.height() > 0) {
                        QUnit.drawBox(parent, 'red', errMsg);
                        return;
                    }
                    parent = parent.parent();
                } while (parent.length > 0 && !parent.is(document.body));
            }

            if (QUnit.config.urlValues.codeCov) {
                QUnit.drawBox(jqObj, 'blue');
            }
        },
        stripNumberFromFilterLabel: function(label) {
            return label.text().match(/^(.*)/)[1];
        },
        isHsrResults: function() {
            if (window.pageModel.city) {
                return true;
            }
            return false;
        },
        isHidden: function(jqObj, errMsg, noSpaceOk, useCssVisibility) {
            jqObj = $(jqObj);

            var elementIsProperlyHidden = !this.getVisibleState(jqObj, false, noSpaceOk, useCssVisibility);

            QUnit.ok(elementIsProperlyHidden, errMsg);

            if (!elementIsProperlyHidden) {
                QUnit.drawBox(jqObj, 'red', errMsg);
            }
        },
        isValid: function(jqObj, statement, errMsg) {
            jqObj = $(jqObj);
            var isTrue = statement;
            QUnit.ok(isTrue, errMsg);

            if (!isTrue) {
                QUnit.drawBox(jqObj, 'red', errMsg);
            }
        },
        hasText: function($jqObj, errMsg) {
            $jqObj = $($jqObj);
            var isTrue = !!$jqObj.text();
            QUnit.ok(isTrue, errMsg);

            if (!isTrue) {
                QUnit.drawBox($jqObj, 'red', errMsg);
            }
        },
        getUrlParameter: function(param) {
            var pageURL = $(location).attr('href');
            var urlVariables = pageURL.split('&');
            for (var i = 0; i < urlVariables.length; i++) {
                var sParameterName = urlVariables[i].split('=');
                if (sParameterName[0] == param) {
                    return sParameterName[1];
                }
            }
        },
        isMobileBp: function() {
            return deviceInfo.isMobileBp();
        },
        isDesktopBp: function() {
            return deviceInfo.isDesktopBp();
        },
        //Adding isShowingOpaque() so test can continue to pass when advance booking window > 7 days.
        //Here I'm copying the code from the production JS so test and production code have the same logic for showing opaque.
        isShowingOpaque: function() {
            var numberOfDaysThreshold = 7;
            var checkInDate = new Date(window.pageModel.wizard.checkIn);
            var thresholdDate = new Date().setDate(new Date().getDate() + numberOfDaysThreshold);
            thresholdDate = new Date(thresholdDate);

            return checkInDate <= thresholdDate;
        },
        convertArrayToMap: function(array, keyFunction) {
            var map = {};

            if (!array) {
                return map;
            }

            for (var i = 0; i < array.length; i++) {
                var key = array[i];

                if (typeof(keyFunction) !== 'function') {
                    if (typeof(key) !== 'number' && typeof(key) !== 'string') {
                        throw new Error('Function must be defined for non-string and non-number cases');
                    }
                } else {
                    key = keyFunction(array[i]);
                }

                map[key] = array[i];
            }

            return map;
        },
        // use to see if an experiment feature is turned on
        // if no bucket is provided, return true if non zero variant
        // if bucket is provided, return true if they match
        isExperiment: function(name, bucket) {
            if(!window.pageModel ||
                !window.pageModel.experiments ||
                !window.pageModel.experiments[name]) {
                return false;
            }

            var actual = _.last(window.pageModel.experiments[name].split('.'));

            var returnValue = false;

            if (bucket === undefined) {
                // if no bucket parameter is provided, return true if the actual is not zero.
                returnValue = actual != '0';
            } else {
                // if a bucket is provided, return true if they match.  1 == "1"
                returnValue = actual == bucket;
            }

            return returnValue;
        }
    };
});
