// TODO: Remove non-page related functions
define('hsrPageInformation', [
    'jquery', 'hsrSelectors', 'hsrListingDecoration', 'hsrConstants'
], function($, hsrSelectors, hsrListingDecoration, hsrConstants) {
    'use strict';

    function isVacationRental() {
        return window.pageModel.hiddenFields.inventoryType === 'vacationRental';
    }

    function isFilterVisible(filterContainer) {
        return $(filterContainer).is(':visible');
    }

    function isAColumnExpanded() {
        return $(hsrSelectors.aColumn()).is(':visible');
	}

    function isAirAttach() {
        return window.pageModel.airAttach.isAirAttach === true;
    }

    function isShowAmenities() {
        return window.pageModel.amenities.isShowAmenities === true;
    }

    function isShowAccessibilities() {
        return window.pageModel.amenities.isShowAccessibilities === true;
    }

    function getSearchResults() {
        return window.pageModel.results;
    }

    function isDealOfDayListing(index) {
        return window.pageModel.results[index].isDealOfTheDayListing;
    }

    function isUPPDealOfTheDay(index) {
        return window.pageModel.results[index].isUPPDealOfTheDay;
    }

	function getListings(index) {
        return hsrSelectors.lodgingListings(index);
    }

    function getListingDecoration(index) {
        var decorationFromModel = window.pageModel.results[index].decoration;
        var decoration = hsrListingDecoration[decorationFromModel.toUpperCase()];

        if (decoration === undefined) {
            decoration = hsrListingDecoration.UNKNOWN;
        }

        return decoration;
    }

    function getOmnitureTag(pageElement) {
        return $(pageElement).attr(hsrConstants.omnitureAttributeKey);
    }

    return {
        getOmnitureTag: getOmnitureTag,

        isFilterVisible: isFilterVisible,
        isVacationRental: isVacationRental,
        isAColumnExpanded: isAColumnExpanded,
		isAirAttach: isAirAttach,
        isShowAmenities: isShowAmenities,
        isShowAccessibilities: isShowAccessibilities,
        getSearchResults: getSearchResults,
        isDealOfDayListing: isDealOfDayListing,
        isUPPDealOfTheDay: isUPPDealOfTheDay,
        getListingDecoration: getListingDecoration,
        getListings: getListings
    };
});
