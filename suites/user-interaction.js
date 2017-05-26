define('userInteractionTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function run() {
        QUnit.module("Regression: User Interaction");

        //EDS modal
		QUnit.test("HSR EDS popup verification", function() {
			if (window.pageModel.metaData.isDateless && !window.pageModel.metaData.isMobile) {
                hsrCommon.isVisible($('#edsModal'), "EDS modal container must be visible");
                hsrCommon.isVisible($('#edsModal #edsDisplay'), "EDS container must be visible");
                hsrCommon.isVisible($('#edsDisplay #edsHeading'), "EDS title must be visible");
                hsrCommon.isVisible($('#edsDisplay #edsContent'), "EDS form container must be visible");
                hsrCommon.isVisible($('#edsContent .edsForm .edsCol').eq(0).find('.label'), "EDS check in label must be visible");
                hsrCommon.isVisible($('#edsContent .edsForm .edsCol').eq(0).find('#inpStartDateEDS'), "EDS check in calendar widget must be visible");
                hsrCommon.isVisible($('#edsContent .edsForm .edsCol').eq(1).find('.label'), "EDS check out label must be visible");
                hsrCommon.isVisible($('#edsContent .edsForm .edsCol').eq(1).find('#inpEndDateEDS'), "EDS check in calendar widget must be visible");
                hsrCommon.isVisible($('#edsContent button#edsSubmitAction'), "EDS form submit button must be visible");
                hsrCommon.isVisible($('#edsModal #modalCloseButton'), "EDS modal close button must be visible");
			}
		});
        
        //Verify accountName name is not to set to null or error and at least one omniture property is available
        QUnit.test('omniture property test', function() {
//            QUnit.ok(window.pageModel.userInteraction.accountName.indexOf("expedia") > -1,
//                "AccountName name should be there and should contain text 'expedia'");
            QUnit.ok(window.pageModel.userInteraction.omnitureProperties.list1.length > 0,
                'The value of list1 should be exist');
        });
    }

    return {
        runners: [
            {
                // todo: change name of test suite to EDS or dateless
                testSuiteName: 'userInteractionTests',
                run: run,
                tags: 'userInteraction,hsrPage,regression'
            }
        ]
    };
});
