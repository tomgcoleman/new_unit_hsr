define('airAttachTests', [
    'QUnit', 'hsrCommon', 'hsrPageInformation', 'hsrSelectors', 'jquery'
], function(QUnit, hsrCommon, hsrPageInformation, hsrSelectors, $) {
    'use strict';

    function runAirAttachTests() {
        QUnit.module('Regression: Air Attach');

        QUnit.test('Air attach', function () {
            if (hsrPageInformation.isAirAttach()) {
                airAttachTests();
            }
        });
    }

    function airAttachTests() {
        hsrCommon.isVisible(hsrSelectors.airAttachBanner(), 'Air attach banner is visible');
        hsrCommon.isVisible(hsrSelectors.airAttachText(), 'Air attach text is visible');
        hsrCommon.isVisible(hsrSelectors.airAttachTimer(), 'Air attach timer is visible');

        var hotelsInMemory = window.pageModel.results;
        var numHotelResults = hotelsInMemory.length;

        var isHotelAirAttachExpireMessageOnTop = window.pageModel.airAttach.isAirAttach;
        for (var i = 0; i < numHotelResults; i++) {
            var hotelInMemory = hotelsInMemory[i];

            if (hotelInMemory.isShowTopAirAttach) {
                hsrCommon.isVisible($('.airAttachMsg.secondary').eq(i), 'Air attach message for hotel ' + i + ' is visible');
                if (isHotelAirAttachExpireMessageOnTop) {
                    QUnit.ok($('.airAttachExpireMsg .timer').eq(i).text().length > 2, 'Air attach expiration time for hotel ' + i + ' is visible');
                    QUnit.ok($('.airAttachExpireMsg .price-col-expires-label').eq(i).text().length > 2, 'Air attach expiration message for hotel ' + i + ' is visible');
                } else {
                    QUnit.ok($('li.airAttachExpireMsg').eq(i).is(':visible'), 'Air attach expiration message for hotel ' + i + ' is visible');
                }
            } else {
                hsrCommon.isHidden(hsrSelectors.hotelAirAttachMessage(i), 'Air attach message for hotel ' + i + ' is hidden');
                hsrCommon.isHidden(hsrSelectors.hotelAirAttachExpireMessage(i), 'Air attach expiration message for hotel ' + i + ' is hidden');
            }
        }
    }

    return {
        runners: [
            {
                testSuiteName: 'airAttachTests_Regression',
                run: runAirAttachTests,
                tags: 'airAttach,hsrPage,regression'
            }
        ]
    };
});
