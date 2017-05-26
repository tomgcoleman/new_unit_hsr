define('sortBarTests', [
	'jquery', 'QUnit', 'hsrCommon', 'utils'
], function($, QUnit, hsrCommon, utils) {
	'use strict';
    var $sortContainer = $('#sortContainer');
    var $sortbar = $sortContainer.find('fieldset.sort-filter-bar');
    // todo: is this specific to mobile?
    var $mobileSortbar = $("#sort-select:visible");

    var defaultSort = "recommended";
    var sortUrlParam = utils.getUrlParam("sort") || "";
    var groupUrlParam = utils.getUrlParam("group") || "";
    var $vacationRentals = $('.vacation-rental.listing');

    function updateJquery() {
        // moved / copied into "run()" so they will be re evaluated with each rerun of tests
        $sortContainer = $('#sortContainer');
        $sortbar = $sortContainer.find('fieldset.sort-filter-bar');
        $mobileSortbar = $("#sort-select:visible");

        defaultSort = "recommended";
        sortUrlParam = utils.getUrlParam("sort") || "";
        groupUrlParam = utils.getUrlParam("group") || "";
        $vacationRentals = $('.vacation-rental.listing');
    }

	function runAcceptance() {
        QUnit.module("Acceptance: Sort Bar");

        //And sort bar module on Hotel SR is visible
        QUnit.test("HSR sort controls are visible", function() {
            updateJquery();
            var $sortbarButtons = $sortbar.find('.btn-sort.tab');
            var desktopButtonCount = $sortbarButtons.length;
            var $mobileSortButtons = $mobileSortbar.find("option");
            var numOfSortBtns = $mobileSortButtons.length;
            if (groupUrlParam === "" && $vacationRentals.length === 0) {

                if (desktopButtonCount < 3 && numOfSortBtns === 0) {
                    QUnit.ok(false, "Sort bar is not visible.");
                }

                if (!sortUrlParam || sortUrlParam === "") {
                    sortUrlParam = defaultSort;
                }

                if (!window.pageModel.metaData.isDateless) {
                    if ($sortbar.length > 0) {
                        if (!hsrCommon.isMobileBp()) {
                            hsrCommon.isVisible($sortbar, "Sort bar must be visible");
                        }
                    }
                }
            }
        });
    }

	function run() {
        QUnit.module("Regression: Sort Bar");

		//And sort bar module on Hotel SR is visible
		QUnit.test("HSR sort controls are visible", function() {
            updateJquery();
			var $sortbarButtons = $sortbar.find('.btn-sort.tab');
            var desktopButtonCount = $sortbarButtons.length;
            var $mobileSortButtons = $mobileSortbar.find("option");
            var numOfSortBtns = $mobileSortButtons.length;
            var selectedSort = "";
            var $selectedSort;
            var sortUrlMap = {};
            sortUrlMap.recommended = "HOT.SR.Sort.Epicks";
            sortUrlMap.name = "HOT.SR.Sort.Name";
            sortUrlMap.distance = "HOT.SR.Sort.DistanceDowntown";
            sortUrlMap.theme = "HOT.SR.Sort.Epicks";
            sortUrlMap.starRating = "HOT.SR.Sort.Star";
            sortUrlMap.price = "HOT.SR.Sort.Price";
            sortUrlMap.guestRating = "HOT.SR.Sort.GstRtng";
            sortUrlMap.packageSavings = "HOT.SR.Sort.PkgDiscount";
            sortUrlMap.vip = "HOT.SR.Sort.Vip";
            sortUrlMap.deals = "HOT.SR.Sort.BestDeals";
            sortUrlMap.popularity = "HOT.SR.Sort.Epicks";
            sortUrlMap.smartFinder = "HOT.SR.Sort.SmartFinder";
            sortUrlMap.tonightOnlyDeals = "HOT.SR.Sort.TonightOnlyDeals";
            sortUrlMap.memberDeals = "HOT.SR.Sort.MemberDeals";
            sortUrlMap.vacationRental = "HOT.SR.Sort.VacationRental";
            sortUrlMap.aarpMemberDiscounts = "HOT.SR.Sort.AARPMemberDiscounts";

			if (groupUrlParam === "" && $vacationRentals.length === 0) {

                if (desktopButtonCount < 3 && numOfSortBtns === 0) {
                    QUnit.ok(false, "Sort bar is not visible.");
                }

                if (!sortUrlParam || sortUrlParam === "") {
                    sortUrlParam = defaultSort;
                }

                if (!window.pageModel.metaData.isDateless) {
                    if ($sortbar.length > 0) {
                        if (!hsrCommon.isMobileBp()) {
                            hsrCommon.isVisible($sortbar, "Sort bar must be visible");
                        }

                        $selectedSort = $sortbar.find('.btn-sort.tab.selected');
                        if ($selectedSort.length > 0) {
                            selectedSort = $selectedSort.eq(0).data("rfrr");
                        }
                        if(selectedSort === "HOT.SR.Sort.DistanceDowntown"){
                            QUnit.ok(selectedSort === sortUrlMap[sortUrlParam], "The selected sort in the URL should match the visibly selected sort.");
                        }
                    } else if ($mobileSortbar.length > 0) {
                        hsrCommon.isVisible($mobileSortbar, "Mobile sort bar must be visible");

                        $selectedSort = $mobileSortbar.find('option:selected');
                        if ($selectedSort.length > 0) {
                            selectedSort = $selectedSort.eq(0).data("rfrr");
                        }
                        QUnit.ok(selectedSort === sortUrlMap[sortUrlParam], "The selected sort in the URL should match the visibly selected sort.");
                    }
                }

                if ($(window).width() > 700) {
                    hsrCommon.isVisible($sortbar.find('.sort-bar-label'), "Sort bar label text must be visible.");
                }
			}
		});

		QUnit.test("Some sort methods are not available for various search types and page states", function() {
            updateJquery();
            var startDate = $("#inpStartDate").val();
            var endDate = $("#inpEndDate").val();

            var priceSortRfrr = "HOT.SR.Sort.Price";
            var dealsSortRfrr = "HOT.SR.Sort.BestDeals";
            var distanceSortRfrr = "HOT.SR.Sort.Distance";
            var distanceDownTownSortRfrr = "HOT.SR.Sort.DistanceDowntown";
            var vipSortRfrr = "HOT.SR.Sort.Vip";

            var $priceSortOption;
            var $dealsSortOption;
            var $distanceSortOption = $();
            var $vipSortOption = $();

            var vipUser = false;

            if (groupUrlParam === "" && $vacationRentals.length === 0) {

                // dateless search sort restrictions
				if (startDate === "" || endDate === "") {

                    if ($sortbar.length > 0) {
                        $priceSortOption = $sortbar.find('.btn-sort.tab[data-rfrr="' + priceSortRfrr + '"]');
                        $dealsSortOption = $sortbar.find('.btn-sort.tab[data-rfrr="' + dealsSortRfrr + '"]');
                        hsrCommon.isValid($priceSortOption, $priceSortOption.length === 0, "Price sort must not appear for dateless search.");
                        hsrCommon.isValid($dealsSortOption, $dealsSortOption.length === 0, "Best deal sort must not appear for dateless search.");
                    } else if ($mobileSortbar.length > 0) {
                        $priceSortOption = $mobileSortbar.find('option[data-rfrr="' + priceSortRfrr + '"]');
                        $dealsSortOption = $mobileSortbar.find('option[data-rfrr="' + dealsSortRfrr + '"]');
                        hsrCommon.isValid($priceSortOption, $priceSortOption.length === 0, "Price sort must not appear for mobile dateless search.");
                        hsrCommon.isValid($dealsSortOption, $dealsSortOption.length === 0, "Best deal sort must not appear for mobile dateless search.");
                    }
                }

                // distance sort availability
                if ($sortbar.length > 0) {
                    $distanceSortOption = ($sortbar.find('.btn-sort.tab[data-rfrr="' + distanceSortRfrr + '"]').is(':visible')) ? $sortbar.find('.btn-sort.tab[data-rfrr="' + distanceSortRfrr + '"]') : $sortbar.find('.btn-sort.tab[data-rfrr="' + distanceDownTownSortRfrr + '"]');
                } else if ($mobileSortbar.length > 0) {
                    $distanceSortOption = ($mobileSortbar.find('option[data-rfrr="' + distanceSortRfrr + '"]').is(':visible')) ? $mobileSortbar.find('option[data-rfrr="' + distanceSortRfrr + '"]') : $mobileSortbar.find('option[data-rfrr="' + distanceDownTownSortRfrr + '"]');
                }

					hsrCommon.isValid($distanceSortOption, $distanceSortOption.length > 0, "Distance sort must appear for search type");

                // VIP sort availability - exception: use model data
                if (window.pageModel && window.pageModel.traveler) {
                    vipUser = !!(window.pageModel.traveler.isRewardsGoldUser ||
                                window.pageModel.traveler.isRewardsSilverUser ||
                                window.pageModel.traveler.isRewardsMember);
                }
                if ($sortbar.length > 0) {
                    $vipSortOption = $sortbar.find('.btn-sort.tab[data-rfrr="' + vipSortRfrr + '"]');
                } else if ($mobileSortbar.length > 0) {
                    $vipSortOption = $mobileSortbar.find('option[data-rfrr="' + vipSortRfrr + '"]');
                }
                if (vipUser && hsrCommon.hasVipHotel()) {
                    hsrCommon.isValid($vipSortOption, $vipSortOption.length > 0, "VIP sort must appear when rewards member is signed in and there are VIP hotels.");
                } else {
                    hsrCommon.isValid($vipSortOption, $vipSortOption.length === 0, "VIP sort must not appear when there's no VIP hotel or reward member is not detected.");
                }

                // TODO: Add checks for Home Away when it's ready
			}
		});

		QUnit.test("Verify sort order", function() {
            updateJquery();
            var i;
            var dealHotelIndex;
            var nonDealHotelIndex;
            var foundFirstNonDealHotel;

            var $resultsContainer = $("#resultsContainer");
            var $organicHotels = $resultsContainer.find(".hotel.organic");
            var $organicHotel;
            var hotelCount = $organicHotels.length;

            var $organicHotelPrices = $organicHotels.find(".actualPrice");
            var $currentPrice;
            var priceCount = $organicHotelPrices.length;
            var prevOrganicHotelPrice;
            var currentOrganicHotelPrice;
            var rawPriceText;

            var $currentHotelGuestRating;
            var prevGuestRating;
            var currentGuestRating;

            var $organicHotelNames = $organicHotels.find(".hotelName");
            var $currentHotelName;
            var nameCount = $organicHotelNames.length;
            var prevOrganicHotelName;
            var currentOrganicHotelName;

            var $organicStarRatings = $organicHotels.find(".value-title");
            var $currentStarRating;
            var starRatingCount = $organicStarRatings.length;
            var prevStarRating;
            var currentStarRating;

            var $organicDistances = $organicHotels.find(".distance");
            var $organicDistance;
            var distanceCount = $organicDistances.length;
            var prevDistance;
            var currentDistance;

            var dealsHotels = [];
            var prevHotelPercentageSavings;
            var currentHotelPercentageSavings;

            var stringIndex;

            var organicHotelList;  // model data -> exception to the rule
            var organicHotelCount;

            if (groupUrlParam === "" && $vacationRentals.length === 0) {

				// Get only organic hotels - test only the HTML whenever possible
                // Using the model data to test hotel sort order is an exception to the rule
				organicHotelList = hsrCommon.getOrganicHotels();
                organicHotelCount = organicHotelList.length;

                if (!sortUrlParam || sortUrlParam === "") {
                    sortUrlParam = defaultSort;
                }

                switch (sortUrlParam) {

					case defaultSort:
						break;

					case "price":
						// prices are sorted in increasing order
                        prevOrganicHotelPrice = 0;

                        for (i = 0; i < priceCount; i++) {
                            $currentPrice = $organicHotelPrices.eq(i);
                            rawPriceText = $currentPrice.text();

                            if (rawPriceText.length > 0) {
                                currentOrganicHotelPrice = rawPriceText.match(/\d+/);

                                if (currentOrganicHotelPrice) {
                                    currentOrganicHotelPrice = parseInt(currentOrganicHotelPrice[0]);

                                    if (prevOrganicHotelPrice > currentOrganicHotelPrice) {
                                        QUnit.ok(false, "The price sort is incorrect! Previous Hotel Price: " + prevOrganicHotelPrice + "; Current Hotel Price: " + currentOrganicHotelPrice);
                                        break;
                                    } else {
                                        prevOrganicHotelPrice = currentOrganicHotelPrice;
                                    }
                                }
                            }
						}
						break;

                    case "guestRating":
                        // guest ratings are sorted in decreasing order
                        // each guest rating is displayed in one of two regions depending on value
						prevGuestRating = 5.0;

                        for (i = 0; i < hotelCount; i++) {
                            $organicHotel = $organicHotels.eq(i);
                            $currentHotelGuestRating = $organicHotel.find(".reviewOverall");
                            if (!window.pageModel.results[i].retailHotelPricingModel.hotelOfferError) {
                                if ($currentHotelGuestRating.length > 0) {
                                    currentGuestRating = $currentHotelGuestRating.find("[aria-hidden=true]").text();
                                    stringIndex = currentGuestRating.indexOf("/");
                                    if (stringIndex > -1) {
                                        currentGuestRating = currentGuestRating.substr(0, stringIndex);
                                    }
                                    currentGuestRating = parseFloat(currentGuestRating);
                                } else {
                                    $currentHotelGuestRating = $organicHotel.find(".guestRatingText");

                                    if ($currentHotelGuestRating.length > 0) {
                                        currentGuestRating = $currentHotelGuestRating.find("strong").text();

                                        if (currentGuestRating.length > 0) {
                                            currentGuestRating = currentGuestRating.match(/\d{1,2}.\d{1}/);

                                            if (currentGuestRating) {
                                                currentGuestRating = parseFloat(currentGuestRating[0]);
                                            }
                                        }
                                    }
                                    currentGuestRating = parseFloat(window.pageModel.results[i].retailHotelPricingModel.reviewOverall);
                                }
                            }
                            else {
                                currentGuestRating = -1;  // this will trigger error in next loop iteration if not last
                            }
                            if ((prevGuestRating < currentGuestRating) && (!window.pageModel.results[0].retailHotelPricingModel.hotelOfferError)) {
                                QUnit.ok(false, "The guest rating sort is incorrect! PreviousGuestRating: " + prevGuestRating + "; CurrentGuestRating: " + currentGuestRating);
                                break;
                            } else {
                                prevGuestRating = currentGuestRating;
                            }
                        }
						break;

					case "name":
                        // hotel names are sorted in case insensitive alphabetical order
                        // Ex: In HSR, we sort hotels like this: Americas Best Value Inn & Suites , ARIA Resort & Casino at CityCenter.
                        prevOrganicHotelName = 0;

                        for (i = 0; i < nameCount; i++) {
                            $currentHotelName = $organicHotelNames.eq(i);
                            currentOrganicHotelName = $currentHotelName.text().toLowerCase();

                            if (prevOrganicHotelName > currentOrganicHotelName) {
                                QUnit.ok(false, "The hotel name sort is incorrect! PreviousHotelName: " + prevOrganicHotelName + "; CurrentHotelName: " + currentOrganicHotelName);
                                break;
                            } else {
                                prevOrganicHotelName = currentOrganicHotelName;
                            }
						}
						break;

					case "starRating":
						// star/class ratings are sorted in decreasing order
						prevStarRating = 5.0;

						for (i = 0; i < starRatingCount; i++) {
                            $currentStarRating = $organicStarRatings.eq(i);
                            currentStarRating = $currentStarRating.attr("title");
                            currentStarRating = parseFloat(currentStarRating);

							if (prevStarRating < currentStarRating) {
                                QUnit.ok(false, "The star rating sort is incorrect! PreviousStarRating: " + prevStarRating + "; CurrentStarRating: " + currentStarRating);
								break;
							} else {
								prevStarRating = currentStarRating;
							}
						}
						break;

                    case "distance":
                        // distance is sorted by increasing value - close hotels first
                        prevDistance = 0;

                        for (i = 0; i < distanceCount; i++) {
                            $organicDistance = $organicDistances.eq(i);
                            currentDistance = $organicDistance.text().trim();
                            currentDistance = currentDistance.match(/\d+.\d+/);

                            if (currentDistance) {
                                currentDistance = parseFloat(currentDistance[0]);
                            } else {
                                currentDistance = -1; // trigger an error
                            }

                            if (prevDistance > currentDistance) {
                                QUnit.ok(false, "The distance sort is incorrect! PreviousDestination: " + prevDistance + "; currentDistance: " + currentDistance);
                                break;
                            } else {
                                prevDistance = currentDistance;
                            }
                        }
                        break;

					// best deals - exception that uses model data instead of HTML
					case "deals":
                        // deals are sorted in decreasing order
                        dealHotelIndex = 0;
                        nonDealHotelIndex = -1;
                        foundFirstNonDealHotel = false;
						for (i = 0; i < organicHotelCount; i++) {
                            if (organicHotelList[i].isShowTopDrr) {
                                dealsHotels[dealHotelIndex] = organicHotelList[i];
                                dealHotelIndex++;
                                if (foundFirstNonDealHotel) {
                                    nonDealHotelIndex = i - 1;
                                    break;
                                }
                            } else {
                                foundFirstNonDealHotel = true;
                            }
                        }
                        if (nonDealHotelIndex >= 0) {
                            QUnit.ok(false, "The percentage savings (deals) sort is incorrect! There are " + dealHotelIndex + " hotels with deals that are mixed with non-deal hotel " + organicHotelList[nonDealHotelIndex].normalizedHotelName + " at index " + nonDealHotelIndex + ".");
                        }
                        for (i = 0; i < dealsHotels.length - 1; i++ ) {
                            prevHotelPercentageSavings = parseFloat(dealsHotels[i].retailHotelPricingModel.percentageSavings);
                            currentHotelPercentageSavings = parseFloat(dealsHotels[i + 1].retailHotelPricingModel.percentageSavings);
                            QUnit.ok((prevHotelPercentageSavings >= currentHotelPercentageSavings), "The percentage savings (deals) sort is incorrect! " + organicHotelList[i].normalizedHotelName + " PreviousPercentageSavings: " + prevHotelPercentageSavings + "; " + organicHotelList[i + 1].normalizedHotelName + " CurrentPercentageSavings: " + currentHotelPercentageSavings);
						}
						break;

                    // VIP - exception that uses model data instead of HTML
					case "vip":
						for (i = 0; i < organicHotelCount - 1; i++) {
							if (organicHotelList[i + 1].retailHotelInfoModel.isVipAccess) {
								QUnit.ok((organicHotelList[i].retailHotelInfoModel.isVipAccess), organicHotelList[i].normalizedHotelName + "should be a VIP hotel");
							}
						}
						break;

					default:
						break;
				}
			}
		});
    }

	return {
        runners: [
            {
                testSuiteName: 'sortBarTests_Acceptance',
                run: runAcceptance,
                tags: 'sortBar,hsrPage,acceptance'
            },
            {
                testSuiteName: 'sortBarTests_Regression',
                run: run,
                tags: 'sortBar,hsrPage,regression'
            }
        ]
    };
});
