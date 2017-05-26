// TODO: Add logic for testing omniture tags in filter orientation
define('filterTestLogic', [
    'jquery', 'hsrCommon', 'hsrSelectors', 'hsrConstants', 'QUnit', 'hsrPageInformation', 'experimentUtils'
], function($, hsrCommon, hsrSelectors, hsrConstants, QUnit, hsrPageInformation, experimentUtils) {
    'use strict';

    function testFilter(testFilterConfig) {
        if (!hsrPageInformation.isAColumnExpanded()) {
            return;
        }

        var filterDetails = getFilterDetails(testFilterConfig);
        var filterContainer = filterDetails.filterContainer;

        hsrCommon.isVisible(filterContainer, 'Filter container ' + filterContainer + ' is visible.');
        hsrCommon.isValid(filterContainer, filterDetails.numFilterOptions > 0, 'There is at least one filter option for ' + filterContainer);
        if(filterDetails.showTitle) {
            hsrCommon.isVisible(hsrSelectors.filterTitle(filterContainer), 'Filter title for ' + filterContainer + ' is visible.');
        } else {
                hsrCommon.isHidden(hsrSelectors.filterTitle(filterContainer), 'Filter title for ' + filterContainer + ' is hidden.');
        }

        for (var i = 0; i < filterDetails.numFilterOptions; i++) {
            testFilterOption(filterDetails, i);
        }

        if (tooManyFiltersToDisplayByDefault(filterDetails.numFilterOptions)) {
            testExpandableFilter(filterDetails);
        } else {
            testNonExpandableFilter(filterDetails);
        }
    }

    function testFilterOption(filterDetails, index) {
        var filterContainer = filterDetails.filterContainer;
        var filterCheckbox = hsrSelectors.filterCheckboxes(filterContainer, index);
        var filterName = $(filterCheckbox).attr('name');

        if(filterDetails.ignoredNames.indexOf(filterName) == -1) {
            testFilterOptionVisibility(filterDetails, index);
            testFilterOptionOmnitureTag(filterDetails, index);
            testUrlFilterParameter(filterDetails, index);
        }
    }

    function testFilterOptionOmnitureTag(filterDetails, index) {
        var filterContainer = filterDetails.filterContainer;
        var actualOmnitureValue = $(hsrSelectors.filterCheckboxes(filterContainer, index)).attr(hsrConstants.omnitureAttributeKey);
        var expectedOmnitureMappings = filterDetails.omnitureValues;
        var expectedOmnitureValue = expectedOmnitureMappings.defaultValue;

        var filterOptionValue = $(hsrSelectors.filterCheckboxes(filterContainer, index)).attr('value');
        if (expectedOmnitureMappings[filterOptionValue]) {
            expectedOmnitureValue = expectedOmnitureMappings[filterOptionValue];
        }

        if (expectedOmnitureValue === undefined) {
            hsrCommon.isValid(hsrSelectors.filterOption(filterContainer, index), actualOmnitureValue !== undefined, 'Omniture value for filter ' + filterContainer + ', option ' + (index + 1) + ' is defined (found unrecognized value ' + actualOmnitureValue + ')');
        } else {
            var isCorrectOmnitureValue = actualOmnitureValue.indexOf(expectedOmnitureValue) >= 0;
            hsrCommon.isValid(hsrSelectors.filterOption(filterContainer, index), isCorrectOmnitureValue, 'Omniture value for filter ' + filterContainer + ', option ' + (index + 1) + ' is ' + expectedOmnitureValue + ' (found ' + actualOmnitureValue + ')');
        }
    }

    function testUrlFilterParameter(filterDetails, index) {
        var filterContainer = filterDetails.filterContainer;
        var filterCheckbox = hsrSelectors.filterCheckboxes(filterContainer, index);
        var filterText = hsrSelectors.filterOptionLabels(filterContainer, index);
        var expectedUrlFilterValue = $(filterCheckbox).attr(hsrConstants.urlFilterValueAttributeKey);
        var actualUrlFilterValue = QUnit.config.urlValues[filterDetails.urlFilterKey];

        var actualUrlFilterValues = [];
        if (actualUrlFilterValue) {
            actualUrlFilterValues = actualUrlFilterValue.split(',');
        }

        var urlContainsKeyValuePair = false;
        for (var i = 0; i < actualUrlFilterValues.length; i++) {
            if (actualUrlFilterValues[i] === expectedUrlFilterValue) {
                urlContainsKeyValuePair = true;
            }
        }

        if ($(filterCheckbox).is(':checked')) {
            hsrCommon.isValid(filterText, urlContainsKeyValuePair, 'The URL contains ' + filterDetails.urlFilterKey + '=' + expectedUrlFilterValue);
        } else {
            if (localStorage.showNewUnitConsoleLog) {
                // please do not put anything in the console. the developers don't like it.
                // if this is for debugging, then wrap in an if local storage value
                console.log('verify the URL when no relax error occurred');
                // if this is something everyone might want to see, then put it in here:
                // newUnit.trace.info('verify the URL when no relax error occurred');
            }
            if(!window.pageModel.error.isErrorMessage){
                hsrCommon.isValid(filterText, !urlContainsKeyValuePair, 'The URL does not contain ' + filterDetails.urlFilterKey + '=' + expectedUrlFilterValue);
            }
        }
    }

    function testFilterOptionVisibility(filterDetails, index) {
        if (shouldFilterOptionBeVisible(filterDetails, index)) {
            assertFilterOptionVisible(filterDetails, index);
        } else {
            assertFilterOptionHidden(filterDetails, index);
        }
    }

    function shouldFilterOptionBeVisible(filterDetails, index) {
        return filterDetails.isFilterExpanded || isFilterOptionChecked(filterDetails, index) || isFilterOptionRequiredToAlwaysDisplay(index);
    }

    function isFilterOptionRequiredToAlwaysDisplay(index) {
        return index < hsrConstants.maxFilterCount;
    }

    function isFilterOptionChecked(filterDetails, index) {
        return $(hsrSelectors.filterCheckboxes(filterDetails.filterContainer, index)).is(':checked');
    }

    function assertFilterOptionHidden(filterDetails, index) {
        var elementId;
        var $elem;

        $elem = filterDetails.$filterCheckboxes.eq(index);
        elementId = $elem.attr("id");
        hsrCommon.isHidden($elem, 'Filter checkbox ' + (index + 1) + ' is hidden - id: ' + elementId);

        $elem = filterDetails.$filterLabels.eq(index);
        elementId = $elem.attr("id");
        hsrCommon.isHidden($elem, 'Filter label ' + (index + 1) + ' is hidden - id: ' + elementId);

        hsrCommon.isHidden(hsrSelectors.filterOptionCount(filterDetails.filterContainer, index), 'Filter option ' + (index + 1) + ' is hidden');
    }

    function assertFilterOptionVisible(filterDetails, index) {
        // Begin 13659: HSR_Wanderlust_CollapseFilters
        if (experimentUtils.getVariantByName('HSR_Wanderlust_CollapseFilters') > 0) {
            return;
        }
        // End   13659: HSR_Wanderlust_CollapseFilters

        var elementId;
        var $elem;

        $elem = filterDetails.$filterCheckboxes.eq(index);
        elementId = $elem.attr("id");
        hsrCommon.isVisible($elem, 'Filter checkbox ' + (index + 1) + ' is visible - id: ' + elementId);

        $elem = filterDetails.$filterLabels.eq(index);
        elementId = $elem.attr("id");
        hsrCommon.isVisible($elem, 'Filter label ' + (index + 1) + ' is visible - id: ' + elementId);
         //Comment out this code due to bug: https://jira.sea.corp.expecn.com/jira/browse/BHS-9019
//        if (filterDetails.showCount) {
//            hsrCommon.isVisible(hsrSelectors.filterOptionCount(filterDetails.filterContainer, index), 'Filter option ' + (index + 1) + ' is visible');
//        } else {
//            hsrCommon.isHidden(hsrSelectors.filterOptionCount(filterDetails.filterContainer, index), 'Filter option ' + (index + 1) + ' is hidden');
//        }
    }

    function tooManyFiltersToDisplayByDefault(numFilterOptions) {
        return numFilterOptions > hsrConstants.maxFilterCount;
    }

    function testExpandableFilter(filterDetails) {
        if (filterDetails.isFilterExpanded) {
            testExpandedFilterWithManyOptions(filterDetails);
        } else {
            testCollapsedFilterWithManyOptions(filterDetails);
        }
    }

    function testNonExpandableFilter(filterDetails) {
        hsrCommon.isHidden(filterDetails.showMoreLink, 'Show more link is hidden');
        hsrCommon.isHidden(filterDetails.showLessLink, 'Show less link is hidden');
    }

    function testCollapsedFilterWithManyOptions(filterDetails) {
        // Begin 13659: HSR_Wanderlust_CollapseFilters
        if (experimentUtils.getVariantByName('HSR_Wanderlust_CollapseFilters') > 0) {
            return;
        }
        // End   13659: HSR_Wanderlust_CollapseFilters
        hsrCommon.isVisible(filterDetails.showMoreLink, 'Show more link is visible');
        hsrCommon.isHidden(filterDetails.showLessLink, 'Show less link is hidden');
    }

    function testExpandedFilterWithManyOptions(filterDetails) {
        hsrCommon.isHidden(filterDetails.showMoreLink, 'Show more link is hidden');
        hsrCommon.isVisible(filterDetails.showLessLink, 'Show less link is visible');
    }

    function getFilterDetails(testFilterConfig) {
        var filterContainer = testFilterConfig.container;
        var $filterOptions = $(hsrSelectors.filterOptionLabels(filterContainer));
        var $visibleFilterOptions = $filterOptions.filter(':visible');
        var $hiddenFilterOptions = $filterOptions.filter(':not(:visible)');

        return {
            filterContainer: filterContainer,
            $filterOptions: $filterOptions,
            numFilterOptions: $filterOptions.length,
            $filterCheckboxes: $(hsrSelectors.filterCheckboxes(filterContainer)),
            $filterLabels: $(hsrSelectors.filterOptionLabels(filterContainer)),
            isFilterExpanded: $filterOptions.filter(':visible').length > hsrConstants.maxFilterCount,
            showMoreLink: hsrSelectors.filterShowMoreLink(filterContainer),
            showLessLink: hsrSelectors.filterShowLessLink(filterContainer),
            $visibleFilterOptions: $visibleFilterOptions,
            numVisibleFilterOptions: $visibleFilterOptions.length,
            $hiddenFilterOptions: $hiddenFilterOptions,
            numHiddenFilterOptions: $hiddenFilterOptions.length,
            showCount: testFilterConfig.showCount,
            showTitle: !(testFilterConfig.showTitle === false),
            urlFilterKey: testFilterConfig.urlFilterKey,
            omnitureValues: testFilterConfig.omnitureValues,
            ignoredNames : testFilterConfig.ignoredNames || []
        };
    }

    return {
        //testFilterOrientation: testFilterOrientation,
        testFilter: testFilter
    };
});
