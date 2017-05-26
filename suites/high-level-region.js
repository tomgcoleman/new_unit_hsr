define('highLevelRegionTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function run() {
        QUnit.module("Regression: High Level Region");

        //And high level region on hotel sr is visible when search using high level destination
        QUnit.test("HSR high level region is visible", function () {
            if (window.pageModel.metaData.searchType === "HIGHER_LEVEL_REGION") {
                hsrCommon.isVisible($('#cityContainer .filterHeader'), "high level region title must be visible");
                hsrCommon.isVisible($('#cityContainer'), "high level region list section must be visble");
                hsrCommon.isVisible($('.cityLink .cityName'), "city Name for high level region list section must be visble");
                hsrCommon.isVisible($('.cityLink .hotelCounts'), "hotel counts for high level region list section must be visble");
                for (var i = 0; i < $('.masked.submitFilter.cityCheckbox').length; i++) {
                    hsrCommon.isValid($('.masked.submitFilter.cityCheckbox').eq(i), $('.masked.submitFilter.cityCheckbox').eq(i).attr('data-track') === "HOT:SR:HighLevelRegionCity", "The 'data-track' attribute of col-1 should be 'HOT:SR:HighLevelRegionCity'");
                }
                var CityLink = $('.cityLink');
                if (window.pageModel.city.options.length >= 12) {
                    hsrCommon.isValid(CityLink, CityLink.length === 12, "The city links for high level region should no more than 12 but actual results is:" + CityLink.length);
                } else {
                    hsrCommon.isValid(CityLink, CityLink.length === window.pageModel.city.options.length, "The city links for high level region is wrong, the actual results is:" + CityLink.length, "but expect results is: " + window.pageModel.city.options.length);
                }
            } else {
                hsrCommon.isHidden($('#cityContainer .filterHeader'), "high level region title should not be visible");
                hsrCommon.isHidden($('#cityContainer .cf'), "high level region list section should not be visble");
            }
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'highLevelRegionTests',
                run: run,
                tags: 'highLevelRegion,hsrPage,regression'
            }
        ]
    };
});
