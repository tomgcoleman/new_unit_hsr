define('pinnedHotelTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function runAcceptance() {
        QUnit.module("Acceptance: Pinned Hotel");

        QUnit.test("Pinned hotel test", function() {
            var $resultsContainer = $('#resultsContainer');
            var $pinnedHotel = $resultsContainer.find('.pinnedHotel');

            if ($pinnedHotel.length !== 0) {
                hsrCommon.isVisible($pinnedHotel, "Pinned hotel should be displayed on top of the result");
            }
        });
    }
    function run() {
        QUnit.module("Regression: Pinned Hotel");

        // Pinned hotel validation
		QUnit.test("Pinned hotel test", function() {
            var $resultsContainer = $('#resultsContainer');
            var $pinnedHotel = $resultsContainer.find('.pinnedHotel');

			if ($pinnedHotel.length !== 0) {
                var hotelName = $pinnedHotel.find(".hotelName").text();

                hsrCommon.isVisible($pinnedHotel, "Pinned hotel should be displayed on top of the result");
                hsrCommon.isValid($pinnedHotel.find('.flex-card .flex-link'), $pinnedHotel.find('.flex-card .flex-link').attr('data-track') === "HOT:SR:Pinned", "For hotel '" + hotelName + "' : The 'data-track' attribute of pinned should be 'HOT:SR:Pinned'");
                hsrCommon.isVisible($resultsContainer.find('.pinnedName'), "For hotel '" + hotelName + "' : Pinned text must be visible and displayed on top of the pinned hotel");
                if (window.pageModel.results[0].isDisplayPrice)
                {
                    hsrCommon.isVisible($resultsContainer.find('.pinnedHotelAction'), "For hotel '" + hotelName + "' : Call to action must be visible in pinned hotel");
                }
			}
		});
    }

    return {
        runners: [
            {
                testSuiteName: 'pinnedHotelTests_Acceptance',
                run: runAcceptance,
                tags: 'pinnedHotel,hsrPage,acceptance'
            },
            {
                testSuiteName: 'pinnedHotelTests',
                run: run,
                tags: 'pinnedHotel,hsrPage,regression'
            }
        ]
    };
});
