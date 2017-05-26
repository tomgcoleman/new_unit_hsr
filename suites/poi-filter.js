define('poiFilterTests', [
    'jquery', 'QUnit', 'hsrCommon', 'experimentUtils'
], function($, QUnit, hsrCommon, experimentUtils) {
    'use strict';
    
    function runAcceptance() {
        QUnit.module('Acceptance: POI Filter');

        // Point of interest (POI) verification
		QUnit.test("Point of interest module on Hotel SR is visible", function() {
            var $poiFilterContainer = $('#poiFilterContainer');
            var $poiFilters = $poiFilterContainer.find('.filter');
            var poiCount = $poiFilters.length;
            var isPoiFilterEnabled = false;

            if (window.pageModel && window.pageModel.poi && window.pageModel.poi.options) {
                if (window.pageModel.poi.options.length > 0) {
                    isPoiFilterEnabled = true;
                }
            }

            if (isPoiFilterEnabled && poiCount === 0) {
                QUnit.ok(false, "Poi filters should appear");
            }

            if (!isPoiFilterEnabled && poiCount > 0) {
                QUnit.ok(false, "Poi filters should not appear");
            }
        });
    }

    function run() {
        QUnit.module('Regression: POI Filter');

        // Point of interest (POI) verification
        // Begin 13659: HSR_Wanderlust_CollapseFilters
        if (experimentUtils.getVariantByName('HSR_Wanderlust_CollapseFilters') > 0) {
            return;
        }
        // End   13659: HSR_Wanderlust_CollapseFilters

		QUnit.test("Point of interest module on Hotel SR is visible", function() {
            var $poiFilterContainer = $('#poiFilterContainer');
            var $poiFilterContainerList = $poiFilterContainer.find('#poiFilter');
            var $poiFilters = $poiFilterContainer.find('.filter');
            var poiCount = $poiFilters.length;
            var $neighborhoodFilters = $('#neighborhoodContainer').find('.filter');
            var isPoiFilterEnabled = false;

            if (window.pageModel && window.pageModel.poi && window.pageModel.poi.options) {
                if (window.pageModel.poi.options.length > 0) {
                    isPoiFilterEnabled = true;
                }
            }

            if (isPoiFilterEnabled && poiCount === 0) {
                QUnit.ok(false, "Poi filters should appear");
            }

            if (!isPoiFilterEnabled && poiCount > 0) {
                QUnit.ok(false, "Poi filters should not appear");
            }

			if (isPoiFilterEnabled && poiCount > 0) {
                if ($(window).width() >= 944) {
                    hsrCommon.isVisible($poiFilterContainer, "POI module must be visible.");
                    hsrCommon.isVisible($poiFilterContainerList, "POI list must be visible");
                } else {
                    hsrCommon.isHidden($poiFilterContainer, "POI module should not be visible.");
                    hsrCommon.isHidden($poiFilterContainerList, "POI list should not be visible");
                }
                hsrCommon.isValid($poiFilterContainerList, $poiFilterContainerList.children().length > 0, "If the POI filter is visible then we need to have at least one POI");
                for (var i = 0; i < poiCount; i++) {
                    hsrCommon.isValid($poiFilters.eq(i), $poiFilters.eq(i).attr('data-track').indexOf("HOT:SR:POI") >= 0, "The 'data-track' attribute of POI filter should be 'HOT:SR:POI:ID'");
                    if ($poiFilterContainer.find('.check.filter-label.filterOptionItem').eq(i).hasClass('checked')) {
                        hsrCommon.isHidden($neighborhoodFilters, "Neighborhood filter should not exist");
                        hsrCommon.isValid($poiFilterContainer.find('.check.filterOptionItem').eq(i).text().indexOf(hsrCommon.getUrlParameter("poi").replace(/\+/g, " ")) > -1, "URL should contain POI filter");
                    }
                }
			}
		});
    }

    return {
        runners: [
            {
                testSuiteName: 'poiFilterTests_Acceptance',
                run: runAcceptance,
                tags: 'filter,poiFilter,hsrPage,acceptance'
            },
            {
                testSuiteName: 'poiFilterTests_Regression',
                run: run,
                tags: 'filter,poiFilter,hsrPage,regression'
            }
        ]
    };
});
