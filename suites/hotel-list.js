//TODO: Add regression test for https://jira/jira/browse/MAIN-130509 [HSR] - We should not show rooms left message for dimmed hotel.
//TODO: Check for VIP badge
// TODO: reduce dependency on model data where possible
define('hotelListTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function runAcceptance() {
        var $hotelContainer = $('#resultsContainer');

        QUnit.module("Acceptance: Hotel List");

        QUnit.test("Hotel listings are visible.", function() {
            hsrCommon.isVisible($hotelContainer, "Hotel listing container must be visible.");
        });
    }

    function runRegression() {
        var $hotelContainer = $('#resultsContainer');
        var $hotelListings = $hotelContainer.find('.hotel');
        var numOfListings = $hotelListings.length;
        var $vacationRentals = $('.vacation-rental.listing');

        QUnit.module("Regression: Hotel List");

        QUnit.test("Hotel listings are visible.", function() {
            hsrCommon.isVisible($hotelContainer, "Hotel listing container must be visible.");

            var hotelList = hsrCommon.getHotels();
            var hotelsInMemoryHash = hsrCommon.convertArrayToMap(hotelList, function(hotel) {
                return hotel.hotelId;
            });
            var hotel;
            var hotelId;
            var hotelName;
            var hotelUgc;
            var hotelInMemory;
            var rating;
            var isTravelAd;

            for (var i = 0; i < numOfListings; i++) {
                hotel = $hotelListings.eq(i);
                hotelName = hotel.find('.hotelName').text().trim();

                hotelId = hotel.attr('data-hotelid');
                hotelInMemory = hotelsInMemoryHash[hotelId];
                isTravelAd = (hotel.hasClass('travelAd') || hotelInMemory.decoration === "travelAd");
                if (hotel.hasClass('organic')) {
                    if (hotel.hasClass('topHotel')) {
                        hsrCommon.isValid(hotel, hotel.find('.target.edsHotel').attr('data-track') === "HOT:SR:TopHotelModule", "For hotel '" + hotelName + "' : The 'data-track' attribute of top hotel should be 'HOT:SR:TopHotelModule'");
                    } else {
                        hsrCommon.isValid(hotel, hotel.find('.flex-link').attr('data-track') === "HOT:SR:HotelModule", "For hotel '" + hotelName + "' : The 'data-track' attribute of organic hotel should be 'HOT:SR:HotelModule'");
                    }
                }
                hsrCommon.isVisible(hotel, "For hotel '" + hotelName + "' : Hotel wrapper must be visible.");

                //New hotel badge(New to expedia)
                if (hotelInMemory.retailHotelInfoModel.isNewHotel && $(window).width() > 725 && !hotel.find('.discount_ribbon').is(':visible')) {
                    hsrCommon.isVisible(hotel.find('.hotelNameBadge'), "The '" + hotelName + "' : new hotel should have the badge");
                }
                
                //Verify listing link URL
                if (!isTravelAd && !hsrCommon.isMobileBp()) {
                    hsrCommon.isValid(hotel, hotel.find('a.flex-link').attr('href') === hotelInMemory.infositeUrl, "For hotel '" + hotelName + "' : Hyperlink URL is not set correctly.");
                    hsrCommon.isValid(hotel, hotel.find('a.flex-link').attr('target') === hotelInMemory.hotelId, "For hotel '" + hotelName + "' : Hyperlink target is not set correctly.");
                }

                if (hotelInMemory.decoration === "muted") {
                    hsrCommon.isHidden(hotel.find('.flex-figure'), "For muted hotel '" + hotelName + "' : Hotel listing image must be hidden.");
                } else {
                    hsrCommon.isVisible(hotel.find('.flex-figure'), "For hotel '" + hotelName + "' : Hotel listing image must be visible.");
                }

                if (hotelInMemory.isSelectedListing) {
                    hsrCommon.isVisible(hotel.find('.flex-flag.listing-headline'), "For hotel '" + hotelName + "' : pinned banner must be visible");
                    hsrCommon.isVisible($hotelContainer.find('.pinnedName'), "For hotel '" + hotelName + "' : Pinned name must be visible and displayed on top of the pinned hotel");
                    hsrCommon.isVisible(hotel.find('.hotelName'), "For pinned hotel '" + hotelName + "' : Hotel name must be visible.");
                } else {
                    hsrCommon.isVisible(hotel.find('.hotelName'), "For hotel '" + hotelName + "' : Hotel name must be visible.");
                    hsrCommon.isValid(hotel, hotelName.length > 0, "For hotel '" + hotelName + "' : Hotel name must be a valid string.");
                }

                if (hotelList && hotelInMemory.retailHotelInfoModel.isDisplayStarRating) {
                    hsrCommon.isVisible(hotel.find('.starRating .icon'), "For hotel '" + hotelName + "' : Star rating must be visible.");
                }

                if (hotelInMemory.retailHotelInfoModel.showLocalizedName && !hsrCommon.isMobileBp()) {
                    hsrCommon.isVisible(hotel.find('.secondaryHotelName'), "For hotel '" + hotelName + "' : English hotel name must be visible for bilingual POS in hotel listings");
                }

                if (!hotel.hasClass('travelAd') && !hsrCommon.isMobileBp()) {
                    //Hack for visibility. Our way of forcing new lines makes isVisible break.
                    hsrCommon.isValid(hotel.find('.neighborhood'),
                        hotel.find('.neighborhood').css('visibility') === 'visible' && hotel.find('.neighborhood').css('display') !== 'none',
                        "For hotel '" + hotelName + "' : Hotel neighborhood info must be visible for multicity search");
                }

                //Review score, review count verification
                if (!hsrCommon.isMobileBp() && !isTravelAd) {
                    if (hotelInMemory.retailHotelInfoModel.reviewTotal >= 5 && hotelInMemory.decoration !== "muted") {
                        rating = hotelInMemory.retailHotelInfoModel.reviewOverall;
                        rating = rating.replace(",", ".");  // some foreign points of sale that uses a comma as a decimal point
                        if (rating >= 3.5 && !hotelInMemory.retailHotelPricingModel.hotelOfferError) {
                            hotelUgc = hotel.find(".hotel-ugc");
                            hsrCommon.isVisible(hotelUgc.find(".superlative"), "For hotel '" + hotelName + "' : Superlative must be visible");
                            hsrCommon.isVisible(hotelUgc.find(".reviewOverall"), "For hotel '" + hotelName + "' : Review overall must be visible");
                            hsrCommon.isVisible(hotelUgc.find(".reviewCount"), "For hotel '" + hotelName + "' : review counts must be visible");
                        } else {
                            hsrCommon.isVisible(hotel.find(".hotel-info .reviewCount"), "For hotel '" + hotelName + "' : review counts must be visible");
                        }
                    }
                    //Free cancellation verification
                    if (hotelInMemory.isFreeCancel && hotelInMemory.decoration !== "muted" && !hotel.find('.tAdLinkCompOff.fakeLink').is(':visible')) {
                        hsrCommon.isVisible(hotel.find(".freeCancel"), "For hotel '" + hotelName + "' : Free cancellation message must be visible");
                    }
                    //DRR message verification
                    if (hotelInMemory.isShowTopDrr && !hotel.find('.mobileExclusive').is(':visible') && !hotel.find('.afrbadge').is(':visible') && hotelInMemory.decoration !== "muted" && window.tpid !== "30029" && !hotel.find('.tAdLinkCompOff.fakeLink').is(':visible') && !window.pageModel.flexibleShopping) {
                        hsrCommon.isVisible(hotel.find('.hotel-price-supplemental .drrMsg'), "For hotel '" + hotelName + "' : Drr message must be visible");
                    }
                    //ETP message verification
                    if (hotelInMemory.retailHotelPricingModel.showEtp && hotelInMemory.decoration !== "muted" && !hotel.find('.tAdLinkCompOff.fakeLink').is(':visible')) {
                        hsrCommon.isVisible(hotel.find(".etpfreeCancel"), "For hotel '" + hotelName + "' : ETP message must be visible");
                    }
                }
                if (hotelInMemory.decoration !== "muted" &&
                    window.pageModel.results[i].decoration !== "opaque" &&
                    (window.pageModel.metaData.searchType === "AIRPORT" ||
                    window.pageModel.metaData.searchType === "TRAINSTATION" ||
                    window.pageModel.metaData.searchType === "ATTRACTION")) {
                    if (!((window.pageModel.results[i].retailHotelInfoModel.localizedDistanceInKilometers < 0) && (window.pageModel.results[i].retailHotelInfoModel.localizedDistanceInMiles < 0))) {
                       if(window.pageModel.results[i].retailHotelInfoModel.localizedDistanceInKilometers || window.pageModel.results[i].retailHotelInfoModel.localizedDistanceInMiles){
                        hsrCommon.isVisible(hotel.find('.distance'), "For hotel '" + hotelName + "' : Distance info must be visible.");
                       }
                    }
                }

                if (!(hotelInMemory.isSponsoredListing || hotelInMemory.isVacationRental || hotelList[i].isSponsoredListing) && hotelInMemory.decoration !== "muted" && !hsrCommon.isMobileBp()) {
                    if (hotelInMemory.retailHotelInfoModel.showPhoneNumber && window.tpid !== "30029" && window.tpid !== "14" && window.tpid !== "17" && window.tpid !== "18") {
                        //Hack for visibility. Our way of forcing new lines makes isVisible break.
                        hsrCommon.isValid(hotel.find('.phone'),
                            hotel.find('.phone').css('visibility') === 'visible' && hotel.find('.phone').css('display') !== 'none',
                            "For hotel '" + hotelName + "' : Reservation number must be visible for ESR hotels.");
                    }
                    if (hotelInMemory.isFreeCancel) {
                        hsrCommon.isVisible(hotel.find('.freeCancel'), "For hotel '" + hotelName + "' : Free cancellation label must be visible for ESR hotels.");
                    }
                }
                if (hotelInMemory.decoration !== "muted") { //We should exclude muted hotel
                    if (hotelInMemory.retailHotelPricingModel.roomsMayBeAvailable) {
                        hsrCommon.isValid(hotel.find('.errorText'), hotel.find('.errorText').css('visibility') === 'visible', "For hotel '" + hotelName + "' : Rooms may be available message must be visible.");
                    } else if (hotelInMemory.retailHotelPricingModel.errorCode) {
                        hsrCommon.isVisible(hotel.find('.error'), "For hotel '" + hotelName + "' : Hotel booking error message must be visible.");
                    } else if (hotelInMemory.retailHotelPricingModel.hotelOfferError) {
                        hsrCommon.isVisible(hotel.find('.errorText'), "For hotel '" + hotelName + "' : Hotel booking error description must be visible.");
                    } else if (hotelInMemory.retailHotelPricingModel.inventoryType !== "HOME_AWAY") {
                        if (hotelInMemory.retailHotelPricingModel.isDisplayStrikePrice) {
                            if (hotelInMemory.retailHotelPricingModel.isDynamicPrice) {
                                var strikePriceTag = hotel.find('.hotel-price .strikePrice');
                                hsrCommon.isVisible(strikePriceTag, "For hotel '" + hotelName + "' : Hotel strike price must be visible.");
                                hsrCommon.isValid(strikePriceTag, strikePriceTag.attr('data-tab-access') === 'hover', "For hotel '" + hotelName + "' : Dynamic strike price does not have correct value for attribute 'data-tab-access'");
                                hsrCommon.isValid(strikePriceTag, strikePriceTag.attr('data-control') === 'tooltip', "For hotel '" + hotelName + "' : Dynamic strike price does not have correct value for attribute 'data-control'");
                                hsrCommon.isValid(strikePriceTag, strikePriceTag.attr('data-trigger') === 'hover', "For hotel '" + hotelName + "' : Dynamic strike price does not have correct value for attribute 'data-trigger'");
                                //Temporarily commenting out this test until standard-inverse works properly with hover. (Sept 26, 2016)
                                //hsrCommon.isValid(strikePriceTag, strikePriceTag.attr('data-js-theme') === 'standard-inverse', "For hotel '" + hotelInMemory.normalizedHotelName + "' : Dynamic strike price does not have correct value for attribute 'data-js-theme'");
                                hsrCommon.isValid(strikePriceTag, strikePriceTag.attr('data-arrow') === 'true', "For hotel '" + hotelName + "' : Dynamic strike price does not have correct value for attribute 'data-arrow'");
                                hsrCommon.isValid(strikePriceTag, strikePriceTag.attr('data-fade') === 'out', "For hotel '" + hotelName + "' : Dynamic strike price does not have correct value for attribute 'data-fade'");
                                hsrCommon.isValid(strikePriceTag, strikePriceTag.attr('data-width') === '240', "For hotel '" + hotelName + "' : Dynamic strike price does not have correct value for attribute 'data-width'");
                            } else {
                                var strikePrice = hotel.find('.strikePrice');
                                hsrCommon.isVisible(strikePrice, "For hotel '" + hotelName + "' : Hotel strike price must be visible.");
                            }
                        }
                        hsrCommon.isVisible(hotel.find('.actualPrice'), "For hotel '" + hotelName + "' : Hotel price must be visible.");
                        hsrCommon.isVisible(hotel.find('.priceType'), "For hotel '" + hotelName + "' : Hotel rate type must be visible.");

                        if (hotelInMemory.retailHotelPricingModel.drrMessage !== "" &&
                            !hsrCommon.isMobileBp() && (!window.pageModel.results[0].isDealOfTheDayListing) &&
                            !(hotel.hasClass('airAttach')) &&
                            !window.pageModel.metaData.isDateless &&
                            !hotel.find('.mobileExclusive').is(':visible') &&
                            window.tpid !== "30029" &&
                            hotelInMemory.decoration !== "muted" &&
                            !window.pageModel.loyalty.userCanBurn && hotelInMemory.isShowTopDrr && !hotel.find('.afrbadge').is(':visible')) {

                            var drrBadge = hotel.find('.hotel-price-supplemental .drrMsg a');
                            var actualPrice = hotel.find('.actualPrice');
                            if (localStorage.showNewUnitConsoleLog) {
                                console.log('length of drr badge count for  ' + hotelName + '  is: ' + drrBadge.length + ' : ' + drrBadge);
                            }
                            if (drrBadge.length > 0) {
                                // todo: find out why the DRR tag sometimes does not have the anchor element.
                                if (!hotelInMemory.isSponsoredListing && !actualPrice.hasClass('memberDiscountHighlight')) {
                                    hsrCommon.isVisible(drrBadge, "For hotel '" + hotelName + "' : DRR badge must be visible.");
                                }
                                hsrCommon.isValid(drrBadge, drrBadge.attr('data-tab-access') === 'hover', "For hotel '" + hotelName + "' : DRR does not have correct value for attribute 'data-tab-access'");
                                hsrCommon.isValid(drrBadge, drrBadge.attr('data-control') === 'tooltip', "For hotel '" + hotelName + "' : DRR does not have correct value for attribute 'data-control'");
                                hsrCommon.isValid(drrBadge, drrBadge.attr('data-trigger') === 'hover', "For hotel '" + hotelName + "' : DRR does not have correct value for attribute 'data-trigger'");
                                hsrCommon.isValid(drrBadge, drrBadge.attr('data-arrow') === 'true', "For hotel '" + hotelName + "' : DRR does not have correct value for attribute 'data-arrow'");
                                hsrCommon.isValid(drrBadge, drrBadge.attr('data-fade') === 'out', "For hotel '" + hotelName + "' : DRR does not have correct value for attribute 'data-fade'");
                            } else {
                                drrBadge = hotel.find('.hotel-price-supplemental .drrMsg span');
                                if (!hotelInMemory.isSponsoredListing && !actualPrice.hasClass('memberDiscountHighlight')) {
                                    // when the anchor tag, with all the awesome stuff above is missing . . .
                                    // at least check it is visible.
                                    hsrCommon.isVisible(drrBadge, "For hotel '" + hotelName + "' : DRR badge must be visible.");
                                }
                            }
                            //For TW, we have different discount state format for zh-TW POS
                            //TODO: We should comment in below code when MAIN-138284 is fixed
                            /*if(window.tpid != "62" || config.langId != "1028") {
                             hsrCommon.isValid(drrBadge, drrBadge.attr('data-content') === hotelList[i].retailHotelPricingModel.drrMessage, "For hotel '" + hotelList[i].normalizedHotelName + "' : DRR does not have correct value for attribute 'data-content'");
                             }*/
                        }

                        if (!window.pageModel.metaData.isMobile && !window.pageModel.metaData.isTablet) {
                            QUnit.ok(!hotel.find('.mobileExclusive').is(':visible'), "For hotel '" + hotelName + "' Mobile exclusive deals must not appear for non-mobile browsers.");
                        }
                    }
                }
                //Discount icon verification
                if (hotelList.discountPercentage) {
                    hsrCommon.isVisible(hotel.find('.discount_ribbon'), "Discount should display when discount percentage at least 30%");
                }

                if(hotelInMemory.retailHotelPricingModel.numberOfRoomsLeftForUrgencyMsg && hotelInMemory.retailHotelPricingModel.numberOfRoomsLeftForUrgencyMsg < 6) {
                    hsrCommon.isVisible(hotel.find('.urgencyContainer'), "Urgency messaging should display if less than six rooms left for rateplan.");
                }
            }

        });


        QUnit.test("We show all the hotel listings we get back from domain", function() {
            if ($vacationRentals.length === 0) {
                // todo: set to proper value, this was added based on use in other files.
                var delay = 2000;
                setTimeout(function(){
                    QUnit.deepEqual(window.pageModel.searchResults.hotelCount, $hotelContainer.find('.hotel').length, 'We show all the hotel listings get back from domain');
                }, delay);
            }
        });

        // Tonight Only! validation
        QUnit.test("DRR tonight only is applied to description id 439", function() {
            for (var i = 0; i < window.pageModel.results.length; i++) {
                if (window.pageModel.hotelName.essLocale !== 'en_US') {
                    break;
                }
                if ((!window.pageModel.results[i].isOpaque) && ($vacationRentals.length === 0)) {
                    if (window.pageModel.results[i].retailHotelPricingModel.drrDescriptionID === '439') {
                        var expected_deal_badge_text = 'Tonight Only!';
                        // todo: why does jquery.text() give double Tonight Only - guessing that it's visually hidden text for accessibility because visually hidden text shows up in text()
                        hsrCommon.isValid($('#hotel' + i + ' .drrMsg .badge-success'),
                            expected_deal_badge_text === $('#hotel' + i + ' .drrMsg .badge-success').eq(0).text(), 'DRR badge should match description id, by having text: ' + expected_deal_badge_text +
                            ' actual: ' + $('#hotel' + i + ' .drrMsg .badge-success').eq(0).text());
                    }
                }
            }
        });

        // Duplicate ID test
        // NOTE: IF THIS TEST FAILS, DO NOT COMMENT IT OUT. INSTEAD, FILE A BUG AND ADD THE DUPLICATE ID INTO EXCEPTION
        // LIST IN hasDuplicateId()
        QUnit.test("There should be no duplicate IDs in HSR section", function() {
            var dupIds = hsrCommon.hasDuplicateId();
            QUnit.ok(dupIds.length === 0, "There should have no duplicate IDs in HSR section. Dup IDs found: " + dupIds);
        });

        //SWP verification
        QUnit.test("SWP verification when user sign in or not", function() {
            if(!window.pageModel.metaData.isDateless ){
                //If user log in, and user can burn, Expedia+ points applied...should be displayed in the top of hotel listing
                //If we can find a function, judge all hotel in current HSR page are not available or sold out, it will be better
                if(window.pageModel.traveler.isLoggedIn && window.pageModel.loyalty.userCanBurn && (!window.pageModel.results[0].retailHotelPricingModel.roomsMayBeAvailable && !window.pageModel.results[0].retailHotelPricingModel.isSoldOut && !window.pageModel.results[1].retailHotelPricingModel.roomsMayBeAvailable && !window.pageModel.results[1].retailHotelPricingModel.isSoldOut)){
                    hsrCommon.isVisible($('#swpToggleContainer').find('.pointsApplied'), "swp point text should be displayed on the top of hotel listing when user can burn");
                }
                for (var i = 0; i < numOfListings; i++) {
                    //If current is burn applied, and it not a muted hotel, current hotel is not "may be available" and not sold out
                    if(window.pageModel.results[i].retailHotelPricingModel.isBurnApplied && window.pageModel.results[i].decoration !== "muted" && !window.pageModel.results[i].retailHotelPricingModel.roomsMayBeAvailable && !window.pageModel.results[i].retailHotelPricingModel.isSoldOut && window.pageModel.results[i].retailHotelPricingModel.price !== 0){
                        //If user log in and user can burn
                        if(window.pageModel.traveler.isLoggedIn && window.pageModel.loyalty.userCanBurn){
                            var hotel = $hotelContainer.find('.hotel').eq(i);
                            hsrCommon.isVisible($hotelContainer.find('.hotel').eq(i).find('.burnPointsText'), "Expedia+ points applied text should be displayed when user can burn, the " + i + "hotel");
                            //This module only appear only when current user is gold
                            if(window.pageModel.traveler.isRewardsGoldUser){
                                hsrCommon.isValid(hotel.find('.earnComponent').length === 4, "Earn component should be displayed on hotel listing when user can burn, the " + i + "hotel");
                            }
                            if(window.pageModel.results[i].retailHotelPricingModel.earnTotal !== undefined)
                            {
                                hsrCommon.isVisible(hotel.find('.earnPointsText'), "Earn points should be displayed on hotel listing");
                            }
                        }
                    }
                }
            }
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'hotelListTests_Acceptance',
                run: runAcceptance,
                tags: 'hotelList,hsrPage,acceptance'
            },
            {
                testSuiteName: 'hotelListTests_Regression',
                run: runRegression,
                tags: 'hotelList,hsrPage,regression'
            }
        ]
    };
});
