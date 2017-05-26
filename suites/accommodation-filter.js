define('accommodationFilterTests', [
    'QUnit', 'hsrSelectors', 'hsrConstants', 'filterTestLogic', 'hsrPageInformation'
], function(QUnit, hsrSelectors, hsrConstants, filterTestLogic, hsrPageInformation) {
    'use strict';

    var filterTestConfig = {
        container: hsrSelectors.propertyTypeFilterContainer(),
        showCount: true,
        urlFilterKey: hsrConstants.propertyTypeUrlFilterKey,
        ignoredNames: ['vip'],
        omnitureValues: {
            all: 'HOT.SR.LodgingType.All',
            hotel: 'HOT.SR.LodgingType.Hotel',
            motel: 'HOT.SR.LodgingType.Motel',
            apartHotel: 'HOT.SR.LodgingType.Apart_Hotel',
            bedBreakfast: 'HOT.SR.LodgingType.BB',
            condo: 'HOT.SR.LodgingType.Condo',
            inn: 'HOT.SR.LodgingType.Inn',
            apartment: 'HOT.SR.LodgingType.Apartment',
            cabin: 'HOT.SR.LodgingType.Cabin',
            vacationHome: 'HOT.SR.LodgingType.Vacation_Home',
            condoResort: 'HOT.SR.LodgingType.Condo_Resort',
            hotelResort: 'HOT.SR.LodgingType.Hotel_Resort',
            caravanPark: 'HOT.SR.LodgingType.Caravan_Park',
            villa: 'HOT.SR.LodgingType.Villa',
            guestHouse: 'HOT.SR.LodgingType.Guest_House',
            townHouse: 'HOT.SR.LodgingType.Town_House',
            agritourism: 'HOT.SR.LodgingType.Agritourism',
            allInclusive: 'HOT.SR.LodgingType.AllInclusive',
            chalet: 'HOT.SR.LodgingType.Chalet',
            cottage: 'HOT.SR.LodgingType.Cottage',
            hostel: 'HOT.SR.LodgingType.Hostel',
            ranch: 'HOT.SR.LodgingType.Ranch',
            lodge: 'HOT.SR.LodgingType.Lodge',
            houseBoat: 'HOT.SR.LodgingType.House_Boat',
            overWater: 'HOT.SR.LodgingType.Overwater',
            ryoken: 'HOT.SR.LodgingType.Ryoken',
            treeHouse: 'HOT.SR.LodgingType.Tree_House',
            riad: 'HOT.SR.LodgingType.Riad',
            hostal: 'HOT.SR.LodgingType.Hostal',
            longHouse: 'HOT.SR.LodgingType.Longhouse',
            servicedApartment: 'HOT.SR.LodgingType.Serviced_Apartment',
            countryHouse: 'HOT.SR.LodgingType.Country_House',
            pension: 'HOT.SR.LodgingType.Pension',
            pousadaPortugal: 'HOT.SR.LodgingType.Pousada_Portugal',
            pousadaBrazil: 'HOT.SR.LodgingType.Pousada_Brazil',
            residence: 'HOT.SR.LodgingType.Residence',
            townhouse: 'HOT.SR.LodgingType.Townhouse',
            traditionalBuilding: 'HOT.SR.LodgingType.Traditional_Building',
            castle: 'HOT.SR.LodgingType.Castle',
            safari: 'HOT.SR.LodgingType.Safari',
            ecoHotel: 'HOT.SR.LodgingType.ecoHotel',
            palace: 'HOT.SR.LodgingType.Palace'
        }
    };

    function runAccommodationFilterTests() {
        QUnit.module('Regression: Accommodation Filter');

        QUnit.test('Accommodation filter', function () {
            if (hsrPageInformation.isVacationRental() && !hsrPageInformation.isFilterVisible(hsrSelectors.propertyTypeFilterContainer())) {
                return;
            }
            accommodationFilterTests();
        });
    }

    function accommodationFilterTests() {
        filterTestLogic.testFilter(filterTestConfig);
    }

    return {
        runners: [
            {
                testSuiteName: 'accommodationFilterTests_Regression',
                run: runAccommodationFilterTests,
                tags: 'aColumn,filter,accommodationFilter,hsrPage,regression'
            }
        ]
    };
});
