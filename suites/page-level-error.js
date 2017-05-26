define('pageLevelErrorTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';
    
    function run() {
        QUnit.module("Acceptance: Page Level Error");

        //Page level error on hsr page display correct: LengthOfStayError, DestinationEmptyError, Check-In before Check-out
        QUnit.test("Page level error on hsr page display correctly", function () {
            var errorMessage = '';
            if (window.pageModel && window.pageModel.error && window.pageModel.error.errorMessage) {
                errorMessage = window.pageModel.error.errorMessage;
            }
            if (!hsrCommon.isHsrResults()) {
            hsrCommon.isValid($('#errorContainer .alert-message'), $('#errorContainer .alert-message').text().indexOf(errorMessage.trim()) > -1, "Current HSR page have no destination, and error message should display: " + errorMessage.trim());
                return;
            }
            if (errorMessage !== "") {
                hsrCommon.isValid($('#errorContainer .alert-message'), $('#errorContainer .alert-message').text().indexOf(errorMessage.trim()) > -1, "The page level error display wrong");
            } else {
                hsrCommon.isHidden($('#errorContainer .alert-messag'), "the page level error message doesn't appear");
            }
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'pageLevelErrorTests',
                run: run,
                tags: 'pageLevelError,hsrPage,acceptance'
            }
        ]
    };
});

define('pageLevelCheckTests', [
    'QUnit'
], function(QUnit) {
    'use strict';

    function run() {
        QUnit.module('Acceptance: Page Level Check');

        //JS Object Tests
        QUnit.test("Javascript object existence tests", function () {
            QUnit.ok(window.pageModel, 'Object: window.pageModel should exists');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'pageLevelCheckTests',
                run: run,
                tags: 'pageLevelCheck,hsrPage,acceptance'
            }
        ]
    };
});
