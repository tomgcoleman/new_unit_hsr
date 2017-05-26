define('aColumnTests', [
    'jquery', 'QUnit', 'hsrCommon', 'hsrSelectors', 'deviceInfo'
], function($, QUnit, hsrCommon, hsrSelectors, deviceInfo) {
    'use strict';

    function runAColumnTests() {
        QUnit.module('Acceptance: A Column');
        QUnit.test('General A-column behavior', function() {
            aColumnTests();
        });
    }

    function aColumnTests() {
        var $filterToggle = $(hsrSelectors.filterButton());

        if (deviceInfo.isMobileBp() || deviceInfo.isSmallTabletBp() || deviceInfo.isLargeTabletBp()) {
            QUnit.ok($filterToggle.is(':visible'), "Filter button is visible");
        } else {
            hsrCommon.isHidden($filterToggle, 'Filter button is hidden');
        }
    }

    return {
        runners: [
            {
                testSuiteName: 'aColumnTests_Acceptance',
                run: runAColumnTests,
                tags: 'aColumn,hsrPage,acceptance'
            }
        ]
    };
});
