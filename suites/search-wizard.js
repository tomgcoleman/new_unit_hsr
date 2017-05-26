define('searchWizardTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function runAcceptance() {
        var $wizardContainer = $("#wizardResponsiveContainer");

        QUnit.module("Acceptance: Search Wizard");

        QUnit.test("HSR search wizard module is expanded for dateless", function () {
            if (window.pageModel.metaData.isDateless || window.pageModel.wizard.isDatedSearch) {
                hsrCommon.isVisible($wizardContainer, "Search wizard module must be visible");
            }
        });
    }

    function run() {
        var $wizardContainer = $("#wizardResponsiveContainer");
        var $searchWizard = $("#searchWizard");
        var $searchWizardMain = $("#searchWizardMainWizard");
        var $playback = $('.secondary-playback');
        var $playbackData = $searchWizard.find('.playback-summary-data');
        var $optionsPane = $('#hotels-options-pane');
        var $pageTitle = $('#pageTitleContainer');
        var $temp;

        QUnit.module("Acceptance: Search Wizard");

        QUnit.test("HSR search wizard module is expanded for dateless", function () {
            if (window.pageModel.metaData.isDateless || window.pageModel.wizard.isDatedSearch) {
                hsrCommon.isVisible($wizardContainer, "Search wizard module must be visible");
                hsrCommon.isVisible($searchWizardMain, "Wizard expandable container must be visible.");

                if (!window.pageModel.wizard.isDatedSearch) {
                    var $wizardErrors = $searchWizardMain.find("#wizardErrorMsg #wizardDatelessMsg");

                    if (!$wizardErrors.is(":visible")) {
                        $wizardErrors = $("#errorContainer").find(".alert-message");
                    }

                    hsrCommon.isVisible($wizardErrors, "Wizard error message must be visible.");
                }
                hsrCommon.isVisible($searchWizardMain.find('.location span'), "Destination title is visible.");
                hsrCommon.isVisible($searchWizardMain.find('.location input#inpSearchNear'), "Destination input textbox is visible");

                hsrCommon.isVisible($searchWizardMain.find('.check-in span'), "Check in date title is visible.");
                hsrCommon.isVisible($searchWizardMain.find('.check-in span.icon-calendar'), "Calendar icon for check in input is visible.");
                hsrCommon.isVisible($searchWizardMain.find('.check-in input#inpStartDate'), "Check in date input is visible.");

                hsrCommon.isVisible($searchWizardMain.find('.check-out span'), "Check out date title is visible.");
                hsrCommon.isVisible($searchWizardMain.find('.check-out span.icon-calendar'), "Calendar icon for check out input is visible.");
                hsrCommon.isVisible($searchWizardMain.find('.check-out input#inpEndDate'), "Check out date input is visible.");

                hsrCommon.isVisible($searchWizardMain.find('.secondary-playback'), "Traveller's summary is visible.");
                hsrCommon.isVisible($playback.find('#wizardTravellerSummaryRoom'), "Room count is visible.");
                hsrCommon.isVisible($playback.find('#wizardTravellerSummaryAdults'), "Adult count is visible.");
                if (window.pageModel.wizard.totalChildren !== 0) {
                    hsrCommon.isVisible($('.wizardTravellerSummary #wizardTravellerSummaryChild'), "Children count is visible.");
                }
                hsrCommon.isVisible($searchWizardMain.find('[aria-controls=hotels-options-pane-parent]'), "Traveller/rooms toggle is visible.");
                hsrCommon.isVisible($searchWizardMain.find('button#hotelNewSearchLnk'), "Update search button is visible.");
            }
        });

        //Dated search wizard visibility tests
        QUnit.test("Search wizard module verification when dated", function () {
            if (!window.pageModel.metaData.isDateless && !window.pageModel.wizard.isDatedSearch && !hsrCommon.isMobileBp()) {
            //HSR search wizard module is visible for dated HSR
            hsrCommon.isVisible($wizardContainer.find('#searchWizard'), "Search wizard summary section must be visible");
                if (window.pageModel.flexibleShopping) {
                    hsrCommon.isVisible($playbackData.find('span.icon-packages'), "Packages icon in wizard summary must be visible");
                } else if($('#changeSearchWizard').attr('aria-expanded') === "false"){
                    hsrCommon.isVisible($playbackData.find('span.icon-hotels'), "Hotel icon in wizard summary must be visible");
                    hsrCommon.isVisible($('#wizardSummaryStartDate'), "Check in date in wizard summary must be visible.");
                    hsrCommon.isVisible($('#wizardSummaryEndDate'), "Check out date in wizard summary must be visible.");
                }
                hsrCommon.isValid($playbackData.find('span.destination').length === 1, "Destination in wizard summary must be visible.");
                hsrCommon.isVisible($searchWizard.find('a[data-content-id=searchWizardMainWizard]'), "Search wizard expand toggle is visible");
               if($('#changeSearchWizard').attr('aria-expanded') === "false"){
                hsrCommon.isVisible($searchWizard.find('a[data-content-id=searchWizardMainWizard] .icon-search'), "Search wizard magnifing glass icon is visible");
               }
                if ($optionsPane.find('button').is(':visible')) {
                    $temp = $('.col.submitSearchWizard').find('.btn-sub-action.btn-secondary');
                    hsrCommon.isValid($temp, $temp.attr('data-track') === "HOT.SR.UpdateSearch",
                        "The 'data-track' attribute of change search button should be 'HOT.SR.UpdateSearch'");
                    if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
                        $temp = $optionsPane.find('.btn-close.btn-primary.roomCloseBtn');
                        hsrCommon.isValid($temp, $temp.attr('data-track') === "HOT.SR.Wizard.RemoveRoom", "The 'data-track' attribute of remove room should be 'HOT.SR.Wizard.RemoveRoom'");
                    }
                    $temp = $optionsPane.find('.btn-utility.btn-secondary');
                    hsrCommon.isValid($temp, $temp.attr('data-track') === "HOT.SR.Wizard.AddRoom", "The 'data-track' attribute of add room should be 'HOT.SR.Wizard.AddRoom'");
                }
                if (!hsrCommon.isMobileBp()) {
                    // if Bug MAIN-129130 fix as product bug, please remove the if code
                    if ($(window).width() > 940 && $('#changeSearchWizard').attr('aria-expanded') === "false") {
                        if (window.pageModel.flexibleShopping) {
                            if (window.pageModel.flexibleShopping.packageType === "fh") {
                                $temp = $playbackData.find('span.day-of-week');
                                hsrCommon.isVisible($temp.eq(0), "Check in date's day of week in wizard summary must be visible.");
                                hsrCommon.isVisible($temp.eq(1), "Check out date's day of week in wizard summary must be visible.");
                            }else{
                                $temp = $playbackData.find('span.date-with-dow');
                                hsrCommon.isVisible($temp.eq(0), "Check in date's day of week in wizard summary must be visible.");
                                hsrCommon.isVisible($temp.eq(1), "Check out date's day of week in wizard summary must be visible.");
                            }
                        } else {
                            $temp = $playbackData.find('span.date-with-dow');
                            hsrCommon.isVisible($temp.eq(0), "Check in date's day of week in wizard summary must be visible.");
                            hsrCommon.isVisible($temp.eq(1), "Check out date's day of week in wizard summary must be visible.");
                        }
                    }
                    if ($(window).width() > 725 && (window.pageModel.hiddenFields.inventoryType !== "vacationRental")) {
                        if($('#changeSearchWizard').attr('aria-expanded') === "false"){
                        hsrCommon.isVisible($playbackData.find('span.rooms'), "Room counts in wizard summary must be visible.");
                        }
                    }
                }

                //Destination verification in search wizard and page title
                if (!window.pageModel.metaData.isDateless && !hsrCommon.isMobileBp()) {
                    if (!window.pageModel.flexibleShopping) {
                        hsrCommon.isValid($pageTitle, $pageTitle.find('h1').text().indexOf(window.pageModel.wizard.shortName) > -1, "Destination city name should be in page title as: " + window.pageModel.wizard.shortName + ", the page title is: " + $pageTitle.find('h1').text());
                    }
                }

                //Verify the number of adults,children and room match with expected value
                if (!window.pageModel.metaData.isDateless && !hsrCommon.isMobileBp()) {
                    $temp = $searchWizard.find('#wizardTravellerSummaryAdults');
                    var guest_counts = ($temp.text().match(/\d.*/) && $temp.text().match(/\d.*/)[0]) || '0 ';
                    var room = $searchWizard.find('.rooms').text().match(/\d.*/)[0]
                    hsrCommon.isValid($temp, guest_counts[0] === window.pageModel.wizard.totalAdults.toString(), "The value of adults should match with expected value");
                    if (window.pageModel.hiddenFields.inventoryType !== "vacationRental") {
                        $temp = $searchWizard.find('#wizardTravellerSummaryRoom');
                        hsrCommon.isValid($temp, room[0] === window.pageModel.wizard.selRoomIndex.toString(), "The number of rooms should match with expected value");
                    }
                    if ($searchWizard.find('#wizardTravellerSummaryChild').is(':visible')) {
                        $temp = $searchWizard.find('#wizardTravellerSummaryChild');
                        guest_counts = $temp.text().match(/\d.*/)[0]
                        hsrCommon.isValid($temp, guest_counts.substring(0, $temp.text().indexOf(' ')) === window.pageModel.wizard.totalChildren.toString(), "The value of children should match with expected value");
                    }
                }

                //Verify the checkin/checkout date match with expected value
                if (!window.pageModel.metaData.isDateless && !hsrCommon.isMobileBp()) {
                    $temp = $('#inpStartDate');
                    hsrCommon.isValid($temp, $temp.attr('value') === window.pageModel.wizard.checkIn, "Check in date should be:" + window.pageModel.wizard.checkIn + ", actually is: " + $temp.attr('value'));
                    $temp = $('#inpEndDate');
                    hsrCommon.isValid($temp, $temp.attr('value') === window.pageModel.wizard.checkOut, "Check out date should be:" + window.pageModel.wizard.checkOut + ", actually is: " + $temp.attr('value'));
                }
            }
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'searchWizardTests_Acceptance',
                run: runAcceptance,
                tags: 'searchWizard,hsrPage,acceptance'
            },
            {
                testSuiteName: 'searchWizardTests_Regression',
                run: run,
                tags: 'searchWizard,hsrPage,regression'
            }
        ]
    };
});
