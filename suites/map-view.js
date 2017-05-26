define('mapViewTests', [
    'jquery', 'QUnit', 'hsrCommon', 'deviceInfo'
], function($, QUnit, hsrCommon, deviceInfo) {
    'use strict';

	function run() {
        QUnit.module("Regression: Map View");
		QUnit.test('Page level map test', function() {
			var delay = 2000;
			//Following judgement doesn't work - hsrCommon.isSmallTabletBp()
			if(deviceInfo.isSmallTabletBp() || deviceInfo.isLargeTabletBp()) {
				hsrCommon.isVisible($('.viewMap .viewMapText'), "Map in column A must be visible");
				setTimeout(function(){
					hsrCommon.isVisible($('.viewMap .icon-location'), "Map image in col A must be visible");
				}, delay);
					
				hsrCommon.isValid($('.viewMap .viewMapText'), $('.viewMap .viewMapText').attr('data-track') === "HOT.SR.Module.MapOpen.Link", "The 'data-track' attribute of map link should be 'HOT.SR.Module.MapOpen.Link'");
				
			}
            else if(deviceInfo.isMobileBp()){
                hsrCommon.isVisible($('.flexMapLink .mapLink'), "Map in column A must be visible");
                setTimeout(function(){
					hsrCommon.isVisible($('.flexMapLink .icon-location'), "Map image in col A must be visible");
                }, delay);
                hsrCommon.isValid($('.viewMap .viewMapText'), $('.viewMap .viewMapText').attr('data-track') === "HOT.SR.Module.MapOpen.Link", "The 'data-track' attribute of map link should be 'HOT.SR.Module.MapOpen.Link'");
            }
			else if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
				//Map in column A
				hsrCommon.isVisible($('#googleMapContainer'), "Map in column A must be visible");
				setTimeout(function(){
					hsrCommon.isVisible($('#googleMapContainer img.mapIcon'), "Map image in col A must be visible");
				}, delay);
				hsrCommon.isVisible($('#googleMapContainer span.mapIconOverlay'), "Map icon overlay in Col A must be visible.");
				hsrCommon.isValid($('.section-header-content .viewMapText.mapLink'), $('.section-header-content .viewMapText.mapLink').attr('data-track') === "HOT.SR.Module.MapOpen.Link", "The 'data-track' attribute of map link should be 'HOT.SR.Module.MapOpen.Link'");
				hsrCommon.isValid($('#googleMapContainer .mapLink'), $('#googleMapContainer .mapLink').attr('data-track') === "HOT.SR.Module.MapOpen.Icon", "The 'data-track' attribute of map icon should be 'HOT.SR.Module.MapOpen.Icon'");
			}
		});
    }

	return {
		runners: [
			{
				testSuiteName: 'mapViewTests',
				run: run,
				tags: 'mapView,hsrPage,regression'
			}
		]
	};
});
