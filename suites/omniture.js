define('omnitureTests', [
    'QUnit', 'dctk', 'pageModel'
], function(QUnit, dctk, pageModel) {
    'use strict';

    function runAcceptance() {
        QUnit.module("Accpetance: Omniture");

        QUnit.test("Omniture values are set correctly when the page loads", function () {
            setTimeout(function(){
                QUnit.ok(dctk.omtr.channel === "hotels", "Value of dctk.omtr.channel should be 'hotel', but it's " + dctk.omtr.channel);
                QUnit.ok(dctk.omtr.pageName === "page.Hotel-Search", "Value of dctk.omtr.pageName should be 'page.Hotel-Search', but it's " + dctk.omtr.pageName);
        });
        }, 2000 )
    }
    function run() {
        QUnit.module("Regression: Omniture");

        QUnit.test("Omniture values are set correctly when the page loads", function () {
            if(dctk.omtr) {
                if (window.pageModel.flexibleShopping) {
                    if (window.pageModel.flexibleShopping.packageType === "fh") {
                        QUnit.ok(dctk.omtr.pageName === "page.Package.FH.Hotel-Search", "Value of dctk.omtr.pageName should be 'page.Package.FH.Hotel-Search', but it's " + dctk.omtr.pageName);
                    } else {
                        QUnit.ok(dctk.omtr.pageName === "page.Package.HC.Hotel-Search", "Value of dctk.omtr.pageName should be 'page.Package.HC.Hotel-Search', but it's " + dctk.omtr.pageName);
                    }
                } else {
                    // todo: set to proper value, this was added based on use in other files.
                    var delay = 2000;
                    setTimeout(function(){
                        QUnit.ok(dctk.omtr.channel === "hotels", "Value of dctk.omtr.channel should be 'hotel', but it's " + dctk.omtr.channel);
                        QUnit.ok(dctk.omtr.pageName === "page.Hotel-Search", "Value of dctk.omtr.pageName should be 'page.Hotel-Search', but it's " + dctk.omtr.pageName);
                    }, delay);
                }
                QUnit.ok(dctk.omtr.eVar4 === "D=c4", "Value of dctk.omtr.eVar4 should be D=c4, but it's " + dctk.omtr.eVar4);
            } else {
                QUnit.ok(false, 'dctk.omtr is not defined.')
            }

            //Verify eVar14 and eVar22, if coming from Kayak
            var mdpcid = window.location.search.match(/Mdpcid=([^&^#]*)/i);
            if (mdpcid && mdpcid.length > 1) {
                mdpcid = mdpcid[1];
            }
            var mdpdtl = window.location.search.match(/mdpdtl=([^&^#]*)/i);
            if (mdpdtl && mdpdtl.length > 1) {
                mdpdtl = decodeURIComponent(mdpdtl[1]);
            }
            if (mdpcid || mdpdtl) {
                var expected_eVar14 = "MDP." + mdpcid + "." + mdpdtl;
                QUnit.ok(dctk.omtr.eVar14 === expected_eVar14, "Value of dctk.omtr.eVar14 should be '" + expected_eVar14 + "', but it's " + dctk.omtr.eVar14);

                var expected_eVar22 = "MDP." + mdpcid;
                QUnit.ok(dctk.omtr.eVar22 === expected_eVar22, "Value of dctk.omtr.eVar22 should be '" + expected_eVar22 + "', but it's " + dctk.omtr.eVar22);
            }

            QUnit.ok(dctk.omtr.eVar17 === "page.Hotel-Search", "Value of dctk.omtr.eVar17 should be 'page.Hotel-Search', but it's " + dctk.omtr.eVar17);
            QUnit.ok(dctk.omtr.eVar18 === "D=pageName", "Value of dctk.omtr.eVar18 should be 'D=pageName', but it's " + dctk.omtr.eVar18);

            //1. FOR GROUP SEARCH, dctk.omtr.prop4 IS SET TO "0". THIS SEEMS TO MAKE SENSE BECAUSE WE ARE NOT SHOWING THE LISTINGS BASED ON THE REGION ID
            // WHICH IS WHAT dctk.omtr.prop4 IS TRACKING
            if (!window.pageModel.request.group) {

                if (window.pageModel.flexibleShopping) {
                    QUnit.ok(dctk.omtr.prop4.indexOf(window.pageModel.neighborhood.selectedNeighborhoodId) != -1, "Value of dctk.omtr.prop4 should contains: " + window.pageModel.neighborhood.selectedNeighborhoodId + ", but it's " + dctk.omtr.prop4);
                } else {
                    QUnit.ok(parseInt(dctk.omtr.prop4, 10) === parseInt(window.pageModel.neighborhood.selectedNeighborhoodId, 10), "Value of dctk.omtr.prop4 should be " + window.pageModel.neighborhood.selectedNeighborhoodId + ", but it's " + dctk.omtr.prop4);
                }
               
            } else {
                QUnit.ok(dctk.omtr.prop4 === "0", "Value of dctk.omtr.prop4 should be 0 + ', but it's " + dctk.omtr.prop4);
            }
            if (!window.pageModel.metaData.isDateless) {
                QUnit.ok(dctk.omtr.prop5 === window.pageModel.wizard.checkInISO, "Value of dctk.omtr.prop5 should be '" + window.pageModel.wizard.checkInISO + "', but it's " + dctk.omtr.prop5);
                QUnit.ok(dctk.omtr.prop6 === window.pageModel.wizard.checkOutISO, "Value of dctk.omtr.prop6 should be '" + window.pageModel.wizard.checkOutISO + "', but it's " + dctk.omtr.prop6);

                var day = new Date();
                var today = new Date(day.getFullYear(), day.getMonth(), day.getDate());
                var checkIndate = new Date(window.pageModel.wizard.checkInYear, window.pageModel.wizard.checkInMonth, window.pageModel.wizard.checkInDay);
                var apWindowDays = (Date.parse(checkIndate) / (60 * 60 * 24 * 1000)) - (Date.parse(today) / (60 * 60 * 24 * 1000));
                apWindowDays = Math.round(apWindowDays); // Workaround for BHS-7260
                //eVar5 : aPWindow = TimeZoneUtils.getDaysBeforeDate(dStartDate, (int)timeZoneId);
                var TIMEZONE_OFFSET = 16;
                if (day.toString().indexOf('GMT+0000') > 0) {
                    TIMEZONE_OFFSET = 24;
                }
                if (apWindowDays < 1) {
                    QUnit.deepEqual(dctk.omtr.eVar5, 0.0, "Value for the V5 should be: 0.0, actual is: " + dctk.omtr.eVar5);
                } else if ((day.getHours() >= TIMEZONE_OFFSET) && !window.pageModel.request.daysInFuture) {
                    QUnit.deepEqual(Math.round(dctk.omtr.eVar5), (apWindowDays - 1).toString(), "Value for the V5 should be: " + (apWindowDays - 1) + ", actual is: " + Math.round(dctk.omtr.eVar5) + ", Calculated date is: " + today + ":" + day.getHours() + ":" + day.getMinutes() + "," + day);
                } else {
                    QUnit.deepEqual(dctk.omtr.eVar5, apWindowDays.toString(), "Value for the V5 should be: " + apWindowDays + ", actual is: " + dctk.omtr.eVar5 + ", Calculated date is: " + today + ":" + day.getHours() + ":" + day.getMinutes() + "," + day);
                }
                //Uncomment this after MAIN-131693 is fixed
                //QUnit.deepEqual(dctk.omtr.eVar6, losWindowDays.toString(), "Value for the V6 should be: " + losWindowDays);
            }
            // Verify the value of prop30
            // the case changed, so support both.
            var langId = pageModel.configModel.langId || pageModel.configModel.langid;
            QUnit.ok(dctk.omtr.prop30 === langId.toString(), 'Value of dctk.omtr.prop30 should be' + langId.toString());
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'omnitureTests',
                run: runAcceptance,
                delay: 2000,
                tags: 'omniture,hsrPage,acceptance'
            },
            {
                testSuiteName: 'omnitureTests_Regression',
                run: run,
                delay: 2000,
                tags: 'omniture,hsrPage,regression'
            }
        ]
    };
});
