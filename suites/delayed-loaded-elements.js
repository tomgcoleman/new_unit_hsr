define('delayedLoadedElementsTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function run() {
        QUnit.module("Regression: Delayed Loaded");

        //Search history test
        QUnit.test('Search history stores in sessionStorage', function() {
            if (sessionStorage['hsr.historyTabs'] !== null && sessionStorage['hsr.historyTabs'] !== undefined) {

                var json = window.JSON.parse(sessionStorage['hsr.historyTabs']);
                QUnit.ok(json && json.length > 0, "Search history must be stored to session storage. sessionStorage['hsr.historyTabs']");

                if (json && json.length > 0) {
                    var latestRecord = json.length - 1;

                    if (window.pageModel.request.group === false && (window.pageModel.hiddenFields.inventoryType !== "vacationRental")) {
                        QUnit.ok(json[latestRecord].destination.length > 0, 'The destination should be stored in sessionStorage');
                        QUnit.ok(json[latestRecord].hash, 'The hash attribute should be stored in sessionStorage.');
                        QUnit.ok(typeof json[latestRecord].selected === "boolean", 'The selected attribute should be stored in sessionStorage.');
                    } else {
                        //TODO: ADD ASSERTION FOR destination, hash, and selected FOR GROUP SEARCH
                    }

                    if (!window.pageModel.metaData.isDateless && !window.pageModel.flexibleShopping) {
                        QUnit.deepEqual(json[latestRecord].checkInDate, $('#wizardSummaryStartDate .date-without-dow').html(), 'The check-in date should store in sessionStorage');
                        QUnit.deepEqual(json[latestRecord].checkOutDate, $('#wizardSummaryEndDate .date-without-dow').html(), 'The check-out date should store in sessionStorage');
                    }
                    QUnit.deepEqual(json[latestRecord].adults, window.pageModel.wizard.totalAdults, 'The number of adults should store in sessionStorage');
                    QUnit.deepEqual(json[latestRecord].children, window.pageModel.wizard.totalChildren, 'The number of children should store in sessionStorage');

                    QUnit.ok(json[latestRecord].selectedTime, 'The selectedTime attribute should store in sessionStorage');
                }
            }
        });

        //ADs TESTS
		//B Col ADs
		QUnit.test('B Col ADs - top and bottom are visible', function() {
			if (window.pageModel.metaData.isAdsEnabled && window.tpid !== "7") {
				if ($(window).width() >= 776) {
					hsrCommon.isValid($('#CENTERMIDDLE1'), "B Col large bottom center ad div must exist in DOM.");
				} else if (!hsrCommon.isMobileBp()) {
					hsrCommon.isValid($('CENTERMIDDLE2'), "B Col small bottom center ad div must exist in DOM.");
				}
			}
		});

		//C Col ADs
		QUnit.test('C Col ADs are visible', function() {
			if ($(window).width() >= 1280 && window.pageModel.experiments.HotelMasterTabletFixes === "5761.0" && window.pageModel.metaData.isAdsEnabled && window.tpid !== "7") {
				//TODO: AB TEST 6033 BY MESO TEAM IS CURRENTLY RUNNING, WHICH CAN ADD AN NEW DIV 'RIGHT0' TO C-COL. HENCE DISABLING THE FOLLOWING 2 ASSERTIONS UNTIL THE TEST IS DONE.
				//QUnit.ok($('#ccol').children("div").length === 4, "There should at least 3 ads on C col.");
				hsrCommon.isValid($('#ccol #RIGHT1'), "C Col right 1 ad div must exist in DOM.");
				hsrCommon.isValid($('#ccol #adsense-D-column'), "C Col ad sense div must exist in DOM.");
				//isValid($('#ccol #RIGHT0'), $('#ccol #RIGHT0').length === 1, "C Col right 0 ad must exist in DOM.");
				hsrCommon.isValid($('#ccol #RIGHT2'), "C Col right 2 ad div must exist in DOM.");
			}
		});
    }

    return {
        runners: [
            {
                testSuiteName: 'delayedLoadedElementsTests',
                run: run,
                delay: 2000,
                tags: 'delayedLoaded,hsrPage,regression'
            }
        ]
    };
});
