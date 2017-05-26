define('dealOfDayTests', [
    'jquery', 'QUnit', 'hsrPageModelInformation', 'hsrListingDecoration', 'hsrCommon', 'hsrSelectors', 'hsrPageInformation', 'hsrConstants'
], function($, QUnit, hsrPageModelInformation, hsrListingDecoration, hsrCommon, hsrSelectors, hsrPageInformation, hsrConstants) {
    'use strict';

    function runDealOfDayTests() {
        QUnit.module('Regression: Deal of Day');
        QUnit.test('Deal of day listing', function() {
            dealOfDayTests();
        });
    }

    function dealOfDayTests() {
        var results = hsrPageInformation.getSearchResults();
        var numberOfResults = results.length;

        for (var i = 0; i < numberOfResults; i++) {
            if (hsrPageInformation.isDealOfDayListing(i)) {
                verifyDealOfDayListing(i);
            }
        }
    }

    function verifyDealOfDayListing(index) {
        var dodListing = hsrSelectors.lodgingListings(index);
        var dodHeader = hsrSelectors.lodgingListingHeaders(index);
        var expectedOmnitureTag = 'HOT:SR:DealOfDay';
        var omnitureTag = $('.dealOfDay .flex-link').attr('data-track');

        hsrCommon.isValid(dodListing, hsrPageModelInformation.getListingDecoration(index) !== hsrListingDecoration.MUTED, 'Deal of day listing at position ' + (index + 1) + ' is not a dimmed listing');
        hsrCommon.isValid(dodListing, $(dodHeader).hasClass(hsrConstants.dealOfDayClass), 'Deal of day header listing at position ' + (index + 1) + ' has "dealOfDay" class');
        hsrCommon.isValid(dodListing, $(dodListing).hasClass(hsrConstants.dealOfDayClass), 'Deal of day listing at position ' + (index + 1) + ' has "dealOfDay" class');
        hsrCommon.isValid(dodListing, omnitureTag === expectedOmnitureTag, 'Deal of day omniture tag for listing position ' + (index + 1) + ' is ' + omnitureTag + ' (expected ' + expectedOmnitureTag + ')');
        if (window.pageModel.flexibleShopping){
            if(window.pageModel.flexibleShopping.packageType === "hc"){
                hsrCommon.isHidden(hsrSelectors.dealOfDayTimeIcons(index), 'Deal of day timer icon at listing position ' + (index + 1) + ' is visible');
                hsrCommon.isHidden(hsrSelectors.dealOfDayTimers(index), 'Deal of day timer at listing position ' + (index + 1) + ' is visible');
            } else {
                hsrCommon.isVisible(hsrSelectors.dealOfDayTimeIcons(index), 'Deal of day timer icon at listing position ' + (index + 1) + ' is visible');
                hsrCommon.isVisible(hsrSelectors.dealOfDayTimers(index), 'Deal of day timer at listing position ' + (index + 1) + ' is visible');
            }
        } else {
            hsrCommon.isVisible(hsrSelectors.dealOfDayTimeIcons(index), 'Deal of day timer icon at listing position ' + (index + 1) + ' is visible');
            hsrCommon.isVisible(hsrSelectors.dealOfDayTimers(index), 'Deal of day timer at listing position ' + (index + 1) + ' is visible');
        }
        
    }

    return {
        runners: [
            {
                testSuiteName: 'dealOfDayTests',
                run: runDealOfDayTests,
                tags: 'dealOfDay,hsrPage,listing,regression'
            }
        ]
    };
});
