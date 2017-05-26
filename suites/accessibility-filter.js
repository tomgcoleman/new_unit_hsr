define('accessibilityFilterTests', [
    'QUnit', 'hsrCommon', 'hsrPageInformation', 'hsrSelectors', 'filterTestLogic', 'hsrConstants', 'experimentUtils'
], function(QUnit, hsrCommon, hsrPageInformation, hsrSelectors, filterTestLogic, hsrConstants, experimentUtils) {
    'use strict';

    function runAccessibilityFilterTests() {
        QUnit.module('Regression: Amenities and Accessibility Filters');

        QUnit.test('Accessibility filter', function () {
            if (hsrPageInformation.isVacationRental()) {
                return;
            }
            accessibilityFilterTests();
        });
    }

    function accessibilityFilterTests() {
        // Begin 13659: HSR_Wanderlust_CollapseFilters
        if (experimentUtils.getVariantByName('HSR_Wanderlust_CollapseFilters') > 0) {
            return;
        }
        // End   13659: HSR_Wanderlust_CollapseFilters

        var filterTestConfig = {
            container: hsrSelectors.accessibilityFilterContainer(),
            showCount: true,
            urlFilterKey: hsrConstants.amenitiesUrlFilterKey,
            omnitureValues: {
                defaultValue: 'HOT:SR:HotelAccessibility'
            }
        };

        if (hsrPageInformation.isShowAccessibilities()) {
            filterTestLogic.testFilter(filterTestConfig);
        } else {
            hsrCommon.isHidden(hsrSelectors.accessibilityFilterContainer(), 'Accessibility filter container is hidden');
        }
    }

    return {
        runners: [
            {
                testSuiteName: 'accessibilityFilterTests_Regression',
                run: runAccessibilityFilterTests,
                tags: 'filter,accessibilityFilter,hsrPage,regression'
            }
        ]
    };
});
