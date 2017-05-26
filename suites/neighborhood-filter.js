define('neighborhoodFilterTests', [
    'jquery', 'QUnit', 'hsrCommon', 'experimentUtils'
], function($, QUnit, hsrCommon, experimentUtils) {
    'use strict';

    function runAcceptance() {
		QUnit.module("Acceptance: Neighborhood Filter");

		// Neighborhood filter module on Hotel SR is visible
		QUnit.test("Neighborhood filter module on Hotel SR is visible", function() {
			if (window.pageModel.metaData.searchType === "MULTICITYVICINITY" && window.pageModel.neighborhood.options.length) {
				if ($(window).width() >= 944) {
					hsrCommon.isVisible($('#neighborhoodContainer'), "Neighborhood filter container must be visible.");
				}
			}
		});
	}

    function run() {
        QUnit.module("Regression: Neighborhood Filter");

		QUnit.test("Page model Neighborhood and Neighborhood2 must be mutually exclusive", function() {
			if (window.pageModel.metaData.searchType === "MULTICITYVICINITY") {
				QUnit.ok(!(window.pageModel.neighborhood && window.pageModel.neighborhood2), "Page model Neighborhood and Neighborhood2 must be mutually exclusive.");
			}
		});

		// Neighborhood filter module on Hotel SR is visible
        // Begin 13659: HSR_Wanderlust_CollapseFilters
        if (experimentUtils.getVariantByName('HSR_Wanderlust_CollapseFilters') > 0) {
            return;
        }
        // End   13659: HSR_Wanderlust_CollapseFilters

		QUnit.test("Neighborhood filter module on Hotel SR is visible", function() {
			if (window.pageModel.metaData.searchType === "MULTICITYVICINITY" && window.pageModel.neighborhood.options.length) {
				if ($(window).width() >= 944) {
					hsrCommon.isVisible($('#neighborhoodContainer'), "Neighborhood filter container must be visible.");
					hsrCommon.isVisible($('#neighborhoodContainer .filterTitle'), "Title in Neighborhood filter container must be visible.");
					hsrCommon.isVisible($('#neighborhoodContainer #neighborhood input').eq(0), "Radio button in Neighborhood filter must be visible.");
					hsrCommon.hasText($('#neighborhoodContainer #neighborhood label').eq(0), "Neighborhood text in Neighborhood filter must be visible.");
				} else {
					hsrCommon.isHidden($('#neighborhoodContainer'), "Neighborhood filter container should not be visible.");
					hsrCommon.isHidden($('#neighborhoodContainer .filterTitle'), "Title in Neighborhood filter container should not be visible.");
					hsrCommon.isHidden($('#neighborhoodContainer #neighborhood input').eq(0), "Radio button in Neighborhood filter should not be visible.");
					hsrCommon.isHidden($('#neighborhoodContainer #neighborhood label').eq(0), "Neighborhood text in Neighborhood filter should not be visible.");
				}
				for (var i = 0; i < $('#neighborhoodContainer .filter').length; i++) {
					if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
						hsrCommon.isValid($('#neighborhoodContainer .filter').eq(i), $('#neighborhoodContainer .filter').eq(i).attr('data-track').indexOf("HOT:SR:Area") >= 0, "The 'data-track' attribute of neighborhood filter should be 'HOT:SR:Area:ID'");
					}
					if ((i > 0) && $('#neighborhoodContainer .check.filter-label.filterOptionItem').eq(i).hasClass('checked')) {
						hsrCommon.isValid($('#neighborhoodContainer .check.filter-label.filterOptionItem').eq(i).text().indexOf(hsrCommon.getUrlParameter("destination").replace(/\+/g, " ")) > -1, "Filter option should contain neighborhood option that be selected");
					}
				}
			}
		});
        //TODO: ADD VERIFICATION TO CHECK RADIO BUTTON IS CHECKED AND FILTER ORIENTATION IS VISIBLE WHEN window.pageModel.neighborhood.selectedNeighborhoodId != window.pageModel.request.regionId
    }

	return {
		runners: [
			{
				testSuiteName: 'neighborhoodFilterTests_Acceptance',
				run: runAcceptance,
				tags: 'filter,neighborhoodFilter,hsrPage,acceptance'
			},
			{
				testSuiteName: 'neighborhoodFilterTests_Regression',
				run: run,
				tags: 'filter,neighborhoodFilter,hsrPage,regression'
			}
		]
	};
});
