define('bColumnTests', [
    'QUnit', 'hsrCommon', 'hsrSelectors', 'deviceInfo'
], function(QUnit, hsrCommon, hsrSelectors, deviceInfo) {
    'use strict';

    function runBColumnTestsAcceptance() {
        QUnit.module('Acceptance: B Column');

        QUnit.test('B-Column Acceptance', function () {
            hsrCommon.isVisible(hsrSelectors.bColumn(), 'B-column should be visible');
            hsrCommon.isVisible(hsrSelectors.pageTitleContainer(), 'Page title container should be visible');
            hsrCommon.isVisible(hsrSelectors.pageTitle(), 'Page title should be visible');
        });
    }

    function runBColumnTests() {
        QUnit.module('Regression: B Column');
        QUnit.test('B-Column', function () {
            bColumnTests();
        });
    }

    function bColumnTests() {
        if (deviceInfo.isMobileBp()) {
            if (window.tpid === "1" || window.tpid === "80001"){
                hsrCommon.isVisible(hsrSelectors.pageTitlePhoneNumber(), 'Page title phone number should be visible');
            }
            else {
                hsrCommon.isHidden(hsrSelectors.pageTitlePhoneNumber(), 'Page title phone number should be hidden');
            }
            hsrCommon.isVisible(hsrSelectors.pageTitleMapLink(), 'Page title map link should be visible');
        } else {
            hsrCommon.isVisible(hsrSelectors.pageTitlePhoneNumber(), 'Page title phone number should be visible');
            hsrCommon.isHidden(hsrSelectors.pageTitleMapLink(), 'Page title map link should be hidden');
        }
    }

    return {
        runners: [
            {
                testSuiteName: 'bColumnTests_Acceptance',
                run: runBColumnTestsAcceptance,
                tags: 'bColumn,hsrPage,acceptance'
            },
            {
                testSuiteName: 'bColumnTests_Regression',
                run: runBColumnTests,
                tags: 'bColumn,hsrPage,regression'
            }
        ]
    };
});
