define('headerAndFooterTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';
    
    function run() {
        QUnit.module("Regression: Header and Footer");

        //Header and Footer validation
        QUnit.test("Header and Footer are visible on HSR page", function () {
            if (window.tpid === "7") {
                hsrCommon.isVisible($("#vsct-header-links-custom"), "Header should be visible");
            }
            //AARP will show responsive and non-responsive header unscheduled(AB test id 6506), we will remove following code after this feature rollout
            else if (window.tpid === "30029" && (window.pageModel.userInteraction.omnitureProperties.list1.indexOf("6506.0") > -1)) {
                hsrCommon.isVisible($('.xp-hdr-top'), "AARP non-responsive header should be visible");
            } else {
                hsrCommon.isVisible($('[role=banner]'), "Header should be visible");
            }
            hsrCommon.isVisible($('#footer'), "Footer should be visible");
        });

        //Responsive footer ads verification in all breakpoint
		QUnit.test("Responsive footer ads verification", function () {
			if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
                var breakPoint = $(window).width();

                // the window width is increased when the EDS modal is showing - this should be corrected as EDS is phased out
                if (breakPoint >= 1243) {
                    hsrCommon.isVisible($('#large-adsense-footer').find('.ad_gtfooter_container'), "Large footer ads should be visible in breakpoint: " + breakPoint + ", but actually is hidden");
                    hsrCommon.isHidden($('#medium-adsense-footer').find('.ad_gtfooter_container'), "Medium footer ads should be Hidden in breakpoint: " + breakPoint + ", but actually is visible");
                    hsrCommon.isHidden($('#small-adsense-footer').find('.ad_gtfooter_container'), "Small footer ads should be Hidden in breakpoint: " + breakPoint + ", but actually is visible");
                }
                //Make NewUnit pass by apply this change, will back the change after MAIN-143472 is fixed
                if (breakPoint >= 759 && breakPoint <= 1242) {
                    hsrCommon.isValid($('#large-adsense-footer'), $('#large-adsense-footer .ad_gtfooter_container'), "Large footer ads should be present ");
                    hsrCommon.isValid($('#medium-adsense-footer'), $('#medium-adsense-footer .ad_gtfooter_container'), "Medium footer ads should be present ");
                    hsrCommon.isValid($('#small-adsense-footer'), $('#small-adsense-footer .ad_gtfooter_container'), "Small footer ads should be present ");
                } else if (breakPoint < 759) {
                    hsrCommon.isHidden($('#large-adsense-footer').find('.ad_gtfooter_container'), "Large footer ads should be Hidden when breakpoint: " + breakPoint + ", but actually is visible");
                    hsrCommon.isHidden($('#medium-adsense-footer').find('.ad_gtfooter_container'), "Medium footer ads should be Hidden when breakpoint: " + breakPoint + ", but actually is visible");
                }
			}
		});
		QUnit.test("We show the disclaimers for our rates and promo.", function () {
			if (!window.pageModel.flexibleShopping &&
                window.pageModel.hiddenFields.inventoryType !== "vacationRental" &&
                !window.pageModel.metaData.isDateless) {
				QUnit.ok($('#disclaimerContainer').is(':visible'), "Disclaimer container must be visible.");
				QUnit.ok($('#disclaimerContainer #esrDisclaimer').is(':visible'), "ESR disclaimer must be visible.");
			}
		});
    }

    return {
        runners: [
            {
                testSuiteName: 'headerAndFooterTests',
                run: run,
                tags: 'headerAndFooter,hsrPage,regression'
            }
        ]
    };
});
