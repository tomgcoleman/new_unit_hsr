define('opaqueBannerTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function runAcceptance() {
        //QUnit.module("Acceptance: Opaque Banner");
    }

    function run() {
        QUnit.module("Regression: Opaque Banner");

        //Adding isShowingOpaque() so test can continue to pass when advance booking window > 7 days.
		QUnit.test("We show a few opaque banner for every other 5 hotel listings", function () {
			if (window.pageModel.searchResults.showOpaqueBanners && !hsrCommon.isMobileBp() && hsrCommon.isShowingOpaque() && (window.pageModel.searchResults.opaqueBannerPositions[0] < window.pageModel.searchResults.hotelCount)) {
                hsrCommon.isValid($('.opaque'), $('.opaque .opaqueTitle.fakeLink').find('strong').eq(0).text().indexOf(window.pageModel.searchResults.opaqueDestination) > -1, "Opaque banner should be seen on the destination where opaque inventory exists, current city name is: " + window.pageModel.searchResults.opaqueDestination + " , current opaque title is: " + $('.opaque .opaqueTitle.fakeLink').find('strong').eq(0).text());
                var position = window.pageModel.searchResults.opaqueBannerPositions[0];
                if (window.pageModel.searchResults.isVacationRentalEligible && window.pageModel.searchResults.vacationRentalCount > 0) {
                    position += 1; //To compansate the added HA place holder
                    }
                var opaqueBanner = $('article[class*="opaque"]');
                hsrCommon.isVisible(opaqueBanner, "Opaque banner must appear below listing #" + position);
                hsrCommon.isValid(opaqueBanner, opaqueBanner.find('.flex-link').attr('target') === "opaque", 'Opaque banner target attribute should be opaque');
                // Comment out the code due to https://jira/jira/browse/MAIN-144735
                //var expectedHref = window.pageModel.results[window.pageModel.searchResults.opaqueBannerPositions[0]].opaqueUrl;
                //QUnit.ok(opaqueBanner.find('a').attr('href') === expectedHref, "Opaque banner URL must be valid.")
                }
		});

		QUnit.test("We show the opaque disclaimers for our rates and promo.", function () {
			if (window.pageModel.searchResults.showOpaqueBanners && !hsrCommon.isMobileBp() && hsrCommon.isShowingOpaque()) {
                hsrCommon.isVisible($('#disclaimerContainer #opaqueDisclaimer'), "Opague disclaimer must be visible.");
			}
		});
    }

    return {
        runners: [
            {
                testSuiteName: 'opaqueBannerTests_Acceptance',
                run: runAcceptance,
                tags: 'opaqueBanner,hsrPage,acceptance'
            },
            {
                testSuiteName: 'opaqueBannerTests',
                run: run,
                tags: 'opaqueBanner,hsrPage,regression'
            }
        ]
    };
});
