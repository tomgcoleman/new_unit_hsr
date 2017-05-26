define('hotelNameFilterTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function runAcceptance() {
        QUnit.module("Acceptance: Hotel Name Filter");

        QUnit.test("Hotel name filter module on Hotel SR is visible", function () {
            if (hsrCommon.isHsrResults()) {
                if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {

                    if ($(window).width() >= 944) {
                        hsrCommon.isVisible($('#hotelNameContainer'), "Hotel name filter container must be visible.");
                    }
                }
            }
        });
    }

    function run() {
        QUnit.module("Regression: Hotel Name Filter");

        // Hotel name filter module on Hotel SR is visible
        QUnit.test("Hotel name filter module on Hotel SR is visible", function () {
            if (!hsrCommon.isHsrResults()) {
                hsrCommon.isValid($('#errorContainer .alert-message'), $('#errorContainer .alert-message').text().indexOf(window.pageModel.error.errorMessage.trim()) > -1, "Current HSR page have no destination, and error message should display: " + window.pageModel.error.errorMessage.trim());
                return;
            }
            if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
                var goBtn;
                hsrCommon.isVisible($('#hotelNameContainer'), "Hotel name filter container must be visible.");
                hsrCommon.isVisible($('#hotelNameContainer label.hotelNameFilter input'), "Hotel name filter text box must be visible.");
                hsrCommon.isVisible($('#hotelNameContainer label.hotelNameFilter span'), "Hotel name filter help icon must be visible.");
                if (!window.pageModel.request.hotelName) {
                    hsrCommon.isVisible($('#hotelNameContainer span.hotelNameFilterBtn.submitHotelName'), "Hotel name filter submit button (disabled) must be visible.");
                } else {
                    goBtn = $('#hotelNameContainer span.hotelNameFilterBtn[data-track="HOT:SR:HotelName"] button');
                    hsrCommon.isVisible(goBtn, "Hotel name filter submit button must be visible.");
                    if (!window.pageModel.error.isErrorMessage){
                        hsrCommon.isValid(goBtn, goBtn.is(':enabled'), "Hotel name filter submit button must be enabled.");
                    }
                }
                if ((window.pageModel.request.hotelName) && (!window.pageModel.error.isErrorMessage)) {
                    goBtn = $('#hotelNameContainer span.hotelNameFilterBtn[data-track="HOT:SR:HotelName"] button');
                    hsrCommon.isValid(goBtn, goBtn.is(':enabled'), "Hotel name filter submit button must be enabled.");
                }
                hsrCommon.isValid($('#hotelNameContainer .hotelNameFilterBtn.submitHotelName'), $('#hotelNameContainer .hotelNameFilterBtn.submitHotelName').attr('data-track') === "HOT:SR:HotelName", "The 'data-track' attribute of hotel name filter should be 'HOT:SR:HotelName'");
            }
        });

        // Hotel name filter verification with deep link. This test will be executed only if the url contains hotelName parameter.
        // url.search('hotelName') - this would return the starting index of the "hotelName". If the parameter/string is not available in the url then it would return "-1"
        var url = window.location.href;
        
        QUnit.test("Hotel name filter verification using deep link", function () {
            if (url.search('hotelName') !== -1) {
              var hotelNameValue = hsrCommon.getUrlParameter("hotelName").replace(/\+/g, " ");
              if (window.pageModel.error.isErrorMessage) {
                    hsrCommon.isVisible($('#errorMsg .alert-message'), "We couldn't find properties that match your filter selections error message is not displayed");
                    hsrCommon.isValid($('#hotelNameContainer label.hotelNameFilter input'), $('#hotelNameContainer label.hotelNameFilter input').text() === "", "Hotel name text box should not contain invalid hotel name");
                }
                var numOfListings = $('#resultsContainer .whole-listing > [class!="opaqueWrapper"]').length;
                var hotelList = hsrCommon.getHotels();

                for (var i = 0; i < numOfListings; i++) {
                    QUnit.ok($(hotelList[i].normalizedHotelName.search(hotelNameValue) >= 0), hotelList[i].normalizedHotelName + " doesn't contain the searched hotel name: " + hotelNameValue);
                }
            }
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'hotelNameFilterTests_Acceptance',
                run: runAcceptance,
                tags: 'filter,hotelNameFilter,hsrPage,acceptance'
            },
            {
                testSuiteName: 'hotelNameFilterTests_Regression',
                run: run,
                tags: 'filter,hotelNameFilter,hsrPage,regression'
            }
        ]
    };
});
