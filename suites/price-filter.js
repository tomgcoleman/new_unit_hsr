define('priceFilterTests', [
    'jquery', 'QUnit', 'hsrCommon', 'experimentUtils'
], function($, QUnit, hsrCommon, experimentUtils) {
    'use strict';

    function isStreamlineFiltersExperimentTurnedON() {
        return experimentUtils.getVariantByName('HSR_Wanderlust_StreamlineFilters');
    }

    function runAcceptance() {
        QUnit.module("Acceptance: Price Filter");

        if (!hsrCommon.isHsrResults()) {
            return;
        }

        // Price filter module on Hotel SR is visible
        QUnit.test("Price filter module on Hotel SR is visible", function () {
            if (!window.pageModel.metaData.isDateless) {
                if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
                    if ($(window).width() >= 944 && !window.pageModel.flexibleShopping) {
                        hsrCommon.isVisible($('#priceFilterContainer'), "Price filter container must be visible.");
                        hsrCommon.isVisible($('#priceFilterContainer .filterTitle'), "Price filter title must be visible.");
                    }
                }
            }
        });
    }

    function runRegression() {
        QUnit.module("Regression: Price Filter");

        if (!hsrCommon.isHsrResults()) {
            return;
        }

        // Price filter module on Hotel SR is visible
		QUnit.test("Price filter module on Hotel SR is visible", function () {
			if (!window.pageModel.metaData.isDateless) {
                //Disable the Price filter home away validation part in our New Unit that is failing, until the bug MAIN-145538 gets fixed
                if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
                    if ($(window).width() >= 944 && !window.pageModel.flexibleShopping) {
                        hsrCommon.isVisible($('#priceFilterContainer'), "Price filter container must be visible.");
                        hsrCommon.isVisible($('#priceFilterContainer .filterTitle'), "Price filter title must be visible.");
                    } else {
                        hsrCommon.isHidden($('#priceFilterContainer'), "Price filter container should not be visible.");
                        hsrCommon.isHidden($('#priceFilterContainer .filterTitle'), "Price filter title should not be visible.");
                    }
                    var priceFilterLengh = $('#priceFilterContainer .filter').length ;
                    if (window.pageModel.hiddenFields.inventoryType === "vacationRental") {
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(0), $('#priceFilterContainer .filter').eq(0).attr('data-track') === "HOT:SR-VR:PriceFilter:Bucket1", "The 'data-track' attribute of price filter 1 should be 'HOT:SR-VR:PriceFilter:Bucket1'");
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(1), $('#priceFilterContainer .filter').eq(1).attr('data-track') === "HOT:SR-VR:PriceFilter:Bucket2", "The 'data-track' attribute of price filter 2 should be 'HOT:SR-VR:PriceFilter:Bucket2'");
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(2), $('#priceFilterContainer .filter').eq(2).attr('data-track') === "HOT:SR-VR:PriceFilter:Bucket3", "The 'data-track' attribute of price filter 3 should be 'HOT:SR-VR:PriceFilter:Bucket3'");
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(3), $('#priceFilterContainer .filter').eq(3).attr('data-track') === "HOT:SR-VR:PriceFilter:Bucket4", "The 'data-track' attribute of price filter 4 should be 'HOT:SR-VR:PriceFilter:Bucket4'");
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(4), $('#priceFilterContainer .filter').eq(4).attr('data-track') === "HOT:SR-VR:PriceFilter:Bucket5", "The 'data-track' attribute of price filter 5 should be 'HOT:SR-VR:PriceFilter:Bucket5'");
                    } else {
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(0), $('#priceFilterContainer .filter').eq(0).attr('data-track') === "HOT:SR:PriceFilter:Bucket1", "The 'data-track' attribute of price filter 1 should be 'HOT:SR:PriceFilter:Bucket1'");
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(1), $('#priceFilterContainer .filter').eq(1).attr('data-track') === "HOT:SR:PriceFilter:Bucket2", "The 'data-track' attribute of price filter 2 should be 'HOT:SR:PriceFilter:Bucket2'");
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(2), $('#priceFilterContainer .filter').eq(2).attr('data-track') === "HOT:SR:PriceFilter:Bucket3", "The 'data-track' attribute of price filter 3 should be 'HOT:SR:PriceFilter:Bucket3'");
                        hsrCommon.isValid($('#priceFilterContainer .filter').eq(3), $('#priceFilterContainer .filter').eq(3).attr('data-track') === "HOT:SR:PriceFilter:Bucket4", "The 'data-track' attribute of price filter 4 should be 'HOT:SR:PriceFilter:Bucket4'");
                        // HSR_Wanderlust_StreamlineFilters test removes price5
                        if (!isStreamlineFiltersExperimentTurnedON()) {
                            hsrCommon.isValid($('#priceFilterContainer .filter').eq(4), $('#priceFilterContainer .filter').eq(4).attr('data-track') === "HOT:SR:PriceFilter:Bucket5", "The 'data-track' attribute of price filter 5 should be 'HOT:SR:PriceFilter:Bucket5'");
                        }
                    }
                    for (var i = 1; i <= priceFilterLengh; i++) {
                        if ($(window).width() >= 944 && !window.pageModel.flexibleShopping) {
                            hsrCommon.isVisible($('#priceFilterContainer #price input#price' + i), "Price filter checkbox " + i + " must be visible.");
                            hsrCommon.hasText($('#priceFilterContainer #price .filterOptionItem').eq(i - 1), "Price filter text " + i + " must be visible.");
                        } else {
                            hsrCommon.isHidden($('#priceFilterContainer #price input#price' + i), "Price filter checkbox " + i + " should not be visible.");
                            hsrCommon.isHidden($('#priceFilterContainer #price .filterOptionItem').eq(i - 1), "Price filter text " + i + " should not be visible.");
                            if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
                                hsrCommon.isHidden($('#priceFilterContainer #price .count').eq(i - 1), "Hotel count for price " + i + " should not be visible.");
                            }
                        }
                    }
                }
			}
		});

		QUnit.test("Price filter module on Hotel SR is hidden", function () {
			if (window.pageModel.metaData.isDateless){
                hsrCommon.isHidden($('#priceFilterContainer .filterList'), "Price filter container is not hidden");
			}
		});


		QUnit.test("Price filter control is checked", function () {
			if (window.pageModel.request.price && window.pageModel.request.price.length > 0) {
                if(!window.pageModel.error.isErrorMessage){
                    if (!Array.isArray(window.pageModel.request.price)) {
                        hsrCommon.isValid($('#price input[value=' + window.pageModel.request.price + ']'), $('#price input[value=' + window.pageModel.request.price + ']').attr('checked') === "checked", "Selected price filter checkbox is not checked.");

                    } else {
                        QUnit.ok(window.pageModel.request.price.length === 2, "window.pageModel.request.price array has unexpected number of items.");
                        var lowerEnd = Number(window.pageModel.request.price[0]);
                        var upperEnd = Number(window.pageModel.request.price[1]);

                        hsrCommon.isValid($('#price input[value=' + lowerEnd + ']'), !$('#price input[value=' + lowerEnd + ']').attr('disabled'), "Lower end of the price checkbox must not be disabled.");
                        hsrCommon.isValid($('#price input[value=' + upperEnd + ']'), !$('#price input[value=' + upperEnd + ']').attr('disabled'), "Upper end of the price checkbox must not be disabled.");

                        var i;

                        for (i = lowerEnd; i <= upperEnd; i++) {
                            hsrCommon.isValid($('#price input[value=' + i + ']'), $('#price input[value=' + i + ']').attr('checked') === 'checked', "Price #" + i + " must be checked if it fall into the selection range.");
                        }

                        for (i = lowerEnd + 1; i <= upperEnd - 1; i++) {
                            hsrCommon.isValid($('#price input[value=' + i + ']'), $('#price input[value=' + i + ']').attr('disabled') === 'disabled', "Price checkbox(s) that falls withing the upper/lower end must be disabled.");
                        }
                    }
                }
			}
		});
    }

    return {
        runners: [
            {
                testSuiteName: 'travelAdTests_Acceptance',
                run: runAcceptance,
                tags: 'filter,priceFilter,hsrPage,acceptance'
            },
            {
                testSuiteName: 'travelAdTests_Regression',
                run: runRegression,
                tags: 'filter,priceFilter,hsrPage,regression'
            }
        ]
    };
});
