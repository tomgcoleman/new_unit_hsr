define('paybackTests', [
    'jquery', 'QUnit'
], function($, QUnit) {
    'use strict';
    var $resultsContainer = $('#resultsContainer');
    var $hotels = $resultsContainer.find('.hotel');
    var hotelCount = $hotels.length;
    var $banners;
    if (window.tpid === "3") {
        $banners = $resultsContainer.find('.nectarcoalitionText');
    }
    else {
        $banners = $resultsContainer.find('.coalition-anchor');
    }
    var bannerCount = $banners.length;
    var i;
    var isCoalitionBannerEnabled = false;

    function refreshJquery() {
        $resultsContainer = $('#resultsContainer');
        $hotels = $resultsContainer.find('.hotel');
        hotelCount = $hotels.length;
        if (window.tpid === "3") {
            $banners = $resultsContainer.find('.nectarcoalitionText');
        }
        else {
            $banners = $resultsContainer.find('.coalition-anchor');
        }
        bannerCount = $banners.length;
        isCoalitionBannerEnabled = false;
    }

    function run() {
        refreshJquery();

        QUnit.module("Regression: Coalition Banner (i.e. nectar, payback, etc.)");

        // coalition banner visibility check
		QUnit.test("We show coalition banners on DE, UK and certain other points of sale", function () {
            // todo: set to proper value, this was added based on use in other files.
            var delay = 2000;
            if (window.pageModel && window.pageModel.loyalty && window.pageModel.loyalty.isCoalitionLoyaltyPointsEnabled) {
                isCoalitionBannerEnabled = true;
            }
            setTimeout(function(){
                if (hotelCount > 0) {
                    if (!isCoalitionBannerEnabled && bannerCount > 0) {
                        QUnit.ok(false, "Coalition banner should not appear");
                    }

                    if (isCoalitionBannerEnabled && bannerCount === 0) {
                        QUnit.ok(false, "Coalition banner does not appear");
                    }
                }
                if (isCoalitionBannerEnabled && bannerCount > 0) {
                    for (i = 0; i < hotelCount; i += 4) {
                        if (window.pageModel.searchResults.showOpaqueBanners && i >= 4) {
                            if (i === 4) {
                                QUnit.ok($hotels.eq(i - 1).next().next().hasClass('banner'), "Coalition banner does not appear below listing #" + i);
                            } else {
                                QUnit.ok($hotels.eq(i - 1).next().hasClass('banner'), "Coalition banner does not appear below listing #" + i);
                            }
                        } else {
                            QUnit.ok($hotels.eq(i).next().hasClass('banner'), "Coalition banner does not appear below listing #" + i);
                        }
                    }
                }
            }, delay)
		});
    }

    return {
        runners: [
            {
                testSuiteName: 'paybackTests',
                run: run,
                tags: 'payback,hsrPage,regression'
            }
        ]
    };
});
