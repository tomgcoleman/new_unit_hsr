define('travelAdTests', [
	'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
	'use strict';

	function runAcceptance() {
		QUnit.module("Acceptance: Travel Ad");
		QUnit.test("Travel ads module verification", function() {
			// no acceptance tests
		});
	}
	function run() {
		QUnit.module("Regression: Travel Ad");
		QUnit.test("Travel ads module verification", function() {
            var $travelAds = $('.hotel.travelAd');
            var $travelAdsContent = $travelAds.find('.flex-link');

            var hotelList = hsrCommon.getHotels();
            var hotelsInMemoryHash = hsrCommon.convertArrayToMap(hotelList, function(hotel) {
                return hotel.hotelId;
            });

			if ($travelAds.length > 0 && !$('.travelAdLinkIn').hasClass('muted') && !$('.travelAdLinkOff').hasClass('muted')) {
				if (!$travelAds.eq(0).hasClass('topHotel')) {
					hsrCommon.isValid($travelAdsContent.eq(0), $travelAdsContent.eq(0).attr('data-track') === "HOT:SR:HotelSponsoredTop", "For travel ad '" + $travelAdsContent.eq(0).find('.hotelName').text().trim() + "' the 'data-track' attribute should be 'HOT:SR:HotelSponsoredTop'");
				}
				if ($travelAds.length > 1) {
					if (!$('.travelAd').eq(1).hasClass('topHotel')) {
						hsrCommon.isValid($travelAdsContent.eq(1), $travelAdsContent.eq(1).attr('data-track') === "HOT:SR:HotelSponsoredBottom:1", "For travel ad '" + $travelAdsContent.eq(1).find('.hotelName').text().trim() + "' the 'data-track' attribute should be 'HOT:SR:HotelSponsoredBottom:1'");
					}
					if ($travelAds.length > 2 && !$travelAds.eq(2).hasClass('topHotel')) {
						hsrCommon.isValid($travelAdsContent.eq(2), $travelAdsContent.eq(2).attr('data-track') === "HOT:SR:HotelSponsoredBottom:2", "For travel ad '" + $travelAdsContent.eq(2).find('.hotelName').text().trim() + "' the 'data-track' attribute should be 'HOT:SR:HotelSponsoredBottom:2'");
					}
				}
			}

			for (var i = 0; i < $travelAds.length; i++) {
				var hotel = $travelAds.eq(i);

				var hotelId = hotel.attr('data-hotelid');
				var hotelInMemory = hotelsInMemoryHash[hotelId];
                var hotelName = hotel.find('.hotelName').text().trim();

				if (hotel.hasClass('travelAd')) {
                    if ((!hotelInMemory.isSponsoredLinkOffListing && !(hotel.find('.tAdLinkCompOff').length !== 0) ) && (hsrCommon.isDesktopBp())){
                        hsrCommon.isVisible(hotel.find('.sponsoredListingHeadline'), "For hotel '" + hotelName + "' : Sponsored listing description headline in travel ad should be visible.'", true);
						hsrCommon.isVisible(hotel.find('.sponsoredListingDescription'), "For hotel '" + hotelName + "' : Sponsored listing description in travel ad should be visible.'", true);
                    }
                    hsrCommon.isVisible(hotel.find('.sponsoredListing'), "For hotel '" + hotelName + "' : Sponsored listing label in travel ad should be visible.'");
					}
                if (hotelInMemory.sponsoredListingExternalUrl) {
                    hsrCommon.isVisible(hotel.find('.tAdLinkCompOff'), "For hotel '" + hotelName + "' : Travel link-off hyperlink must be visible.");
                }
            }
        });
	}

	return {
		runners: [
			{
				testSuiteName: 'travelAdTests_Acceptance',
				run: runAcceptance,
				tags: 'travelAd,hsrPage,acceptance_no_tests'
			},
			{
				testSuiteName: 'travelAdTests_Regression',
				run: run,
				tags: 'travelAd,hsrPage,regression'
			}
		]
	};
});
