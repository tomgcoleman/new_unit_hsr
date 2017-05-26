define('hotelMemberPriceTests', [
    'jquery', 'QUnit', 'hsrCommon', 'hsrPageInformation'
], function($, QUnit, hsrCommon, hsrPageInformation) {
    'use strict';

    function run() {
        QUnit.module("Regression: Member Pricing");

        var checkNotVisible = function () {
            hsrCommon.isValid($('.member-price'), $('.member-price').length === 0,
                'Member price text does not appear below any price');

            hsrCommon.isValid($('.memberDiscountHighlight'), $('.memberDiscountHighlight').length === 0,
                'Yellow highlighting does not appear on any price');
        };

        var checkIsVisible = function (hotel) {
            hsrCommon.isValid($(hotel).find('.memberPrice'), $(hotel).find('.memberPrice').length > 0,
                'Member price text appears below member price');

            hsrCommon.isValid($(hotel).find('.memberDiscountHighlight'), $(hotel).find('.memberDiscountHighlight').length > 0,
                'Yellow highlighting appears on hotels with member price');
        };
        
        QUnit.test("Member pricing should not be visible for guest users", function() {
            if(!window.pageModel.traveler || !window.pageModel.traveler.isRegistered) {
                checkNotVisible();
            }
        });

        QUnit.test("Member pricing should not be visible on VR listings", function() {
            if(hsrPageInformation.isVacationRental()) {
                checkNotVisible();
            } else {
                hsrCommon.isValid($('.vacation-rental.listing .memberDiscountHighlight'),
                    $('.vacation-rental.listing .memberDiscountHighlight').length === 0,
                    "Vacation rental banner does not show member price highlighting");
            }
        });
        
        QUnit.test("Member pricing should be visible for logged in users", function() {
            if(!hsrPageInformation.isVacationRental()) {
                if((window.pageModel.traveler && window.pageModel.traveler.isRegistered) ||
                    (window.pageModel.metaData && window.pageModel.metaData.marketChannel === 2)) {

                    var hotels = hsrCommon.getHotels();

                    $('#resultsContainer article.hotel').each(function(index) {
                        if(hotels[index].retailHotelPricingModel.isMemberDiscount) {
                            checkIsVisible(this);
                        }
                    });
                }
            }
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'hotelMemberPriceTests',
                run: run,
                tags: 'bColumn,hsrPage,regression'
            }
        ]
    };
});
