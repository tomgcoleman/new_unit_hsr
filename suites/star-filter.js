define('starFilterTests', [
    'jquery', 'QUnit', 'hsrCommon', 'experimentUtils'
], function($, QUnit, hsrCommon, experimentUtils) {
    'use strict';

    function isStreamlineFiltersExperimentTurnedON() {
        return experimentUtils.getVariantByName('HSR_Wanderlust_StreamlineFilters');
    }

    function runAcceptance() {
        QUnit.module("Acceptance: Star Filter");

        // Star filter module on Hotel SR is visible
        QUnit.test("Star filter module on Hotel SR is visible", function () {
            var $ratingContainer = $('#ratingContainer');
            var $ratingFilters = $ratingContainer.find('.filter');
            var filterCount = $ratingFilters.length;
            var isRatingFilterEnabled = false;

            if (window.pageModel && window.pageModel.starFilter && window.pageModel.starFilter.options) {
                if (window.pageModel.starFilter.options.length > 0) {
                    isRatingFilterEnabled = true;
                }
            }

            if (isRatingFilterEnabled && filterCount === 0) {
                QUnit.ok(false, "Star filters should appear");
            }

            if (!isRatingFilterEnabled && filterCount > 0) {
                QUnit.ok(false, "Star filters should not appear");
            }
        });
    }
    function run() {
        QUnit.module("Regression: Star Filter");
        
        // Star filter module on Hotel SR is visible
        QUnit.test("Star filter module on Hotel SR is visible", function () {
            var $ratingContainer = $('#ratingContainer');
            var $ratingContainerList = $('#star');
            var $ratingFilters = $ratingContainer.find('.filter');
            var isRatingFilterEnabled = false;
            var $vacationRentals = $('.vacation-rental.listing');

            if (window.pageModel && window.pageModel.starFilter && window.pageModel.starFilter.options) {
                if (window.pageModel.starFilter.options.length > 0 ) {
                    isRatingFilterEnabled = true;
                }
            }

            if (isRatingFilterEnabled && $vacationRentals.length === 0) {
                if ($(window).width() >= 944) {
                    hsrCommon.isVisible($ratingContainer, "Star rating container must be visible.");
                    hsrCommon.isVisible($ratingContainer.find('.filterTitle'), "Star rating filter title must be visible.");
                } else {
                    hsrCommon.isHidden($ratingContainer, "Star rating container should not be visible.");
                    hsrCommon.isHidden($ratingContainer.find('.filterTitle'), "Star rating filter title should not be visible.");
                }

                hsrCommon.isValid($ratingFilters.eq(0), $ratingFilters.eq(0).attr('data-track') === "HOT:SR:StarRating:5Star", "The 'data-track' attribute of rating filter 1 should be 'HOT:SR:StarRating:5Star'");
                hsrCommon.isValid($ratingFilters.eq(1), $ratingFilters.eq(1).attr('data-track') === "HOT:SR:StarRating:4Star", "The 'data-track' attribute of rating filter 2 should be 'HOT:SR:StarRating:4Star'");
                hsrCommon.isValid($ratingFilters.eq(2), $ratingFilters.eq(2).attr('data-track') === "HOT:SR:StarRating:3Star", "The 'data-track' attribute of rating filter 3 should be 'HOT:SR:StarRating:3Star'");

                var starRating = 3;
                // HSR_Wanderlust_StreamlineFilters test removes star rating 1 and star rating 2
                if (!isStreamlineFiltersExperimentTurnedON()) {
                    hsrCommon.isValid($ratingFilters.eq(3), $ratingFilters.eq(3).attr('data-track') === "HOT:SR:StarRating:2Star", "The 'data-track' attribute of rating filter 4 should be 'HOT:SR:StarRating:2Star'");
                    hsrCommon.isValid($ratingFilters.eq(4), $ratingFilters.eq(4).attr('data-track') === "HOT:SR:StarRating:1Star", "The 'data-track' attribute of rating filter 5 should be 'HOT:SR:StarRating:1Star'");
                    starRating = 1;
                }
                for (var i = starRating; i <= 5; i++) {
                    if ($(window).width() >= 944) {
                        hsrCommon.isVisible($ratingContainerList.find('input#star' + i), i + " Star rating filter check box must be visible.");
                        hsrCommon.isVisible($ratingContainerList.find('.icon-stars' + i + '-0'), i + " Stars image in the filter must be visible.");
                        hsrCommon.isVisible($ratingContainerList.find('.starTextLabel').eq(5 - i), i + " Star rating text must be visible.");
                    } else {
                        hsrCommon.isHidden($ratingContainerList.find('input#star' + i), i + " Star rating filter check box should not be visible.");
                        hsrCommon.isHidden($ratingContainerList.find('.icon-stars' + i + '-0'), i + " Stars image in the filter should not be visible.");
                        hsrCommon.isHidden($ratingContainerList.find('.starTextLabel').eq(5 - i), i + " Star rating text should not be visible.");
                        hsrCommon.isHidden($ratingContainerList.find('.count').eq(5 - i), i + " Star hotel counts in star rating filter should not be visible.");
                    }
                }
            }
        });

        QUnit.test("Star filter control is checked", function () {
            var $ratingContainerList = $('#star');
            var $ratingFiltersChecked = $ratingContainerList.find('.filter:checked');
            var upperEnd = $ratingFiltersChecked.length - 1;
            var lowerEnd = 0;

            if ($ratingFiltersChecked.length > 0) {
                var filterPills = hsrCommon.getUrlParameter("star").split(",");
                if ($ratingFiltersChecked.length === 1) {
                    QUnit.ok(filterPills.length === 1, "Filter pill count must match checked filter count of one.");

                    hsrCommon.isValid($ratingFiltersChecked, $ratingFiltersChecked.attr('checked') === "checked", "Star filter checkbox must be check checked if filtered by star rating = " + $ratingFiltersChecked.val());

                } else {
                    QUnit.ok(filterPills.length === 2, "Filter pill count must be two when two or more filters are selected.");
                    hsrCommon.isValid($ratingFiltersChecked.eq(upperEnd), !$ratingFiltersChecked.eq(upperEnd).attr('disabled'), "Upper end of the star rating checkbox must not be disabled.");
                    hsrCommon.isValid($ratingFiltersChecked.eq(lowerEnd), !$ratingFiltersChecked.eq(lowerEnd).attr('disabled'), "Lower end of the star rating checkbox must not be disabled.");

                    var i;
                    for (i = upperEnd; i >= lowerEnd; i--) {
                        hsrCommon.isValid($ratingFiltersChecked.eq(i), $ratingFiltersChecked.eq(i).attr('checked') === 'checked', "Star rating " + i + " must be checked if it fall into the selection range.");
                    }
                    for (i = upperEnd - 1; i >= lowerEnd + 1; i--) {
                        hsrCommon.isValid($ratingFiltersChecked.eq(i), $ratingFiltersChecked.eq(i).attr('disabled') === 'disabled', "Star rating checkbox(s) that falls withing the upper/lower end must be disabled.");
                    }
                }
            }
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'starFilterTests_Acceptance',
                run: runAcceptance,
                tags: 'filter,starFilter,hsrPage,acceptance'
            },
            {
                testSuiteName: 'starFilterTests_Regression',
                run: run,
                tags: 'filter,starFilter,hsrPage,regression'
            }
        ]
    };
});
