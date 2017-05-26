define('amenitiesFilterTests', [
    'QUnit', 'hsrCommon', 'hsrPageInformation', 'hsrSelectors', 'filterTestLogic', 'hsrConstants', 'experimentUtils'
], function(QUnit, hsrCommon, hsrPageInformation, hsrSelectors, filterTestLogic, hsrConstants, experimentUtils) {
    'use strict';

    function runAmenitiesTests() {
        QUnit.module('Regression: Amenities Filter');
        QUnit.test('Amenities filter', function () {
            if (hsrPageInformation.isVacationRental()) {
                return;
            }
            amenitiesFilterTests();
        });
    }

    function amenitiesFilterTests() {
        // Begin 13659: HSR_Wanderlust_CollapseFilters
        if (experimentUtils.getVariantByName('HSR_Wanderlust_CollapseFilters') > 0) {
            return;
        }
        // End   13659: HSR_Wanderlust_CollapseFilters

        var filterTestConfig = {
            container: hsrSelectors.amenitiesFilterContainer(),
            showCount: true,
            urlFilterKey: hsrConstants.amenitiesUrlFilterKey,
            omnitureValues: {
                defaultValue: 'HOT:SR:HotelPreference'
            }
        };

        if (hsrPageInformation.isShowAmenities()) {
            filterTestLogic.testFilter(filterTestConfig);
        } else {
            hsrCommon.isHidden(hsrSelectors.amenitiesFilterContainer(), 'Amenities filter container should be visible.');
        }
    }

    return {
        runners: [
            {
                testSuiteName: 'amenitiesFilterTests_Regression',
                run: runAmenitiesTests,
                tags: 'filter,amenityFilter,hsrPage,regression'
            }
        ]
    };
});
