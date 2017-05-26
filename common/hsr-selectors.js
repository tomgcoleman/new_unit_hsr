// TODO: Do not reference hotelWrapper
define('hsrSelectors', ['deviceInfo'], function(deviceInfo) {
    'use strict';

    return {
        filterButton: function() {
            var filterButtonSelector = '';

            switch(deviceInfo.getDeviceCategory()) {
                case 'MOBILE':
                    filterButtonSelector = '#sortContainer > div > div.responsive-sortbar > div.sort-bar-wrap.sort-bar-select-wrap.btn-has-text.toggle-left > div.sort-bar-column.toggle > button';
                    break;
                case 'SMALL_TABLET':
                    filterButtonSelector = '#sortContainer > div > div:nth-child(2) > div.sort-bar-column.toggle > button';
                    break;
                case 'LARGE_TABLET':
                    filterButtonSelector = '#sortContainer > div > div > div > div > button';
            }

            return filterButtonSelector;
        },
        aColumn: function() {
            return '#acol';
        },
        propertyTypeFilterContainer: function() {
            return '#lodgingTypecontainer';
        },
        filterOrientation: function() {
            return '#filterOrientation';
        },
        filterTitle: function(baseSelector) {
            return baseSelector + ' .filterTitle';
        },
        filterCheckboxes: function(baseSelector, index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return baseSelector + ' .filter' + nth;
        },
        filterOptionLabels: function(baseSelector, index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return baseSelector + ' .filterOptionItem' + nth;
        },
        filterShowMoreLink: function(baseSelector) {
            return baseSelector + ' span.more';
        },
        filterShowLessLink: function(baseSelector) {
            return baseSelector + ' span.less';
        },
        filterCheckedCheckboxes: function(baseSelector, index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return baseSelector + ' .filter:checked' + nth;
        },
        filterPills: function(baseSelector, index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return baseSelector + ' .orientationLabelOnly' + nth;
        },
        propertyTypeOrientationContainer: function() {
            return '#orientationLodgingContainer';
        },
        mainContent: function() {
            return '#mainContent';
        },
        airAttachBanner: function() {
            return '#airAttachContainer';
        },
        airAttachText: function() {
            return '#airAttach > div > div.airAttachText';
        },
        airAttachTimer: function() {
            return '#airAttach > div > div.airAttachTimerMessage > span.timer';
        },
        hotelAirAttachMessage: function(index) {
            return '#drr' + index + ' > li';
        },

        hotelAirAttachExpireMessage: function(index) {
            return '#hotel' + index + ' > div.flex-card > div.flex-area-secondary > ul > li.airAttachExpireMsg';
        },

        hotelAirAttachExpireMessageOnTop: function(index) {
            return '#drr' + index + ' > li > span.drrExpiresOn';
        },

        amenitiesFilterContainer: function() {
            return '#amenitiesContainer';
        },
        amenitiesOrientationContainer: function() {
            return '#orientationAmenitiesContainer';
        },
        filterOptionCount: function(baseSelector, index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return baseSelector + ' .count' + nth;
        },
        filterOption: function(baseSelector, index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return baseSelector + '.count' + nth;
        },
        accessibilityFilterContainer: function() {
            return '#accessibilitiesContainer';
        },
        accessibilityOrientationContainer: function() {
            return '#orientationAccessibilityContainer';
        },
        bColumn: function() {
            return '#bcol';
        },
        pageTitleContainer: function() {
            return '#pageTitleContainer';
        },
        pageTitle: function() {
            return '#pageTitleContainer .section-header-main';
        },
        pageTitlePhoneNumber: function() {
            return '#pageTitleContainer .section-header-content .phoneNumber, #pageTitleContainer .section-header-content .telesales-number';
        },
        pageTitleMapLink: function() {
            return '#pageTitleContainer .section-header-content .flexMapLink';
        },
        lodgingListings: function(index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return '#resultsContainer > section > article' + nth;
        },
        lodgingListingHeaders: function(index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return '#resultsContainer > section > article' + nth;
        },
        lodgingListingLinks: function(index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return '#resultsContainer > section article' + nth + ' > div > div > a';
        },
        dealOfDayTimeIcons: function (index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return '#resultsContainer > section article' + nth + ' .drrTimer .icon';
        },
        dealOfDayTimers: function(index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return '#resultsContainer > section article' + nth + ' .drrExpireMsg';
        },
        dealOfDayMessages: function(index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return '#resultsContainer > section article' + nth + ' .drrMsg';
        },
        nonOpaqueLodgingListings: function(index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return '#resultsContainer > section > article.hotel' + nth;
        },
        nonOpaqueLodgingListingHeaders: function(index) {
            var nth = '';
            if (index !== undefined) {
                nth = ':nth(' + index + ')';
            }

            return '#resultsContainer > section > article.hotel' + nth;
        }
    };
});
