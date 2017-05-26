define('searchWizardClickChangeDatesTests', [
    'jquery', 'QUnit'
], function($, QUnit) {
    'use strict';

    var g_is_registered_for_start_on_module_done = false;
    var g_test_has_completed = false;

    var console_log = QUnit.trace.info;
    
    function run() {
        g_test_has_completed = false;

        QUnit.module("ClickTests: Search Wizard Change Dates");

        QUnit.test("HSR search page updates on date changes in wizard", function () {

            var g_wizard_change_dates_pre = '';
            var g_wizard_change_dates_post = '';
            var open_wizard_link_query = '#changeSearchWizard';
            var open_wizard_link = $(open_wizard_link_query);
            var from_date_input_query = '#inpStartDate';
            var to_date_input_query = '#inpEndDate';

            function is_wizard_open() {
                return ($(from_date_input_query) && $(from_date_input_query).css('visibility') == 'visible');
            }

            var g_max_wait_for_wizard_to_be_open = 10;
            function wait_for_wizard_to_be_open(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDatesTests');
                if (g_max_wait_for_wizard_to_be_open-- > 0 && !is_wizard_open()) {
                    setTimeout(wait_for_wizard_to_be_open, 2000, callback);
                    if (g_max_wait_for_wizard_to_be_open === 5) {
                        $(open_wizard_link_query).click();
                    }
                    return;
                }
                callback(is_wizard_open());
            }

            function wizard_change_dates_capture_pre_date(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDatesTests');
                //g_wizard_change_dates_pre = $('#wizardSummaryStartDate').text().replace(/\s+/g, '');
                g_wizard_change_dates_pre = window.pageModel.wizard.checkIn;
                callback(true);
            }

            function wizard_change_dates_open_wizard(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDatesTests');
                if (!is_wizard_open()) {
                    open_wizard_link.click();
                    wait_for_wizard_to_be_open(callback);
                }
            }

            // build date pattern
            // ddmmyy -> dd/mm/yy
            function get_date_format() {
                var delimiter = window.pageModel.wizard.dateFormat.match(/\W/)[0];
                return window.pageModel.wizard.calDateFormat.match(/(.)\1*/g).join(delimiter);
            }

            function wizard_change_dates_set_dates(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDatesTests');
                var fromDate = new Date();
                fromDate.setMonth(fromDate.getMonth() + 7);
                if (fromDate.getMonth() > window.pageModel.wizard.checkInMonth - 2 &&
                    fromDate.getMonth() < window.pageModel.wizard.checkInMonth + 2) {
                    fromDate.setMonth(fromDate.getMonth() - 4);
                }
                console_log('check in month: ' + window.pageModel.wizard.checkInMonth);
                console_log('check in month: ' + window.pageModel.wizard.checkInMonth);
                console_log('check in month: ' + window.pageModel.wizard.checkInMonth);
                console_log('check in month: ' + window.pageModel.wizard.checkInMonth);
                console_log('check in month: ' + window.pageModel.wizard.checkInMonth);
                console_log('check in month: ' + window.pageModel.wizard.checkInMonth);

                //var date_format = window.pageModel.wizard.dateFormat;
                var date_format = get_date_format();
                console_log('date format: ' + date_format);
                var checkInDateText = date_format.replace(/m+/, fromDate.getMonth() + 1);
                checkInDateText = checkInDateText.replace(/d+/, fromDate.getDate());
                checkInDateText = checkInDateText.replace(/y+/, fromDate.getYear() + 1900);
                var toDate = new Date(fromDate);
                toDate.setDate(toDate.getDate() + 15);
                console_log('from date: ' + fromDate.toString() + '  :  ' + checkInDateText);
                var checkOutDateText = date_format.replace(/m+/, toDate.getMonth() + 1);
                checkOutDateText = checkOutDateText.replace(/d+/, toDate.getDate());
                checkOutDateText = checkOutDateText.replace(/y+/, toDate.getYear() + 1900);
                console_log('to   date: ' + toDate.toString() + '  :  ' + checkOutDateText);
                // day month year
                $(from_date_input_query).click();
                $(from_date_input_query).val(checkInDateText);
                $(from_date_input_query).trigger('change');
                $(from_date_input_query).trigger('input');
                $(to_date_input_query).click();
                $(to_date_input_query).val(checkOutDateText);
                $(to_date_input_query).trigger('change');
                $(to_date_input_query).trigger('input');
                callback(true);
            }

            function wizard_change_dates_remove_completed_loading_div(callback) {
                console_log('wizard_change_dates_remove_completed_loading_div');
                for (var i = 0 ; i < 20 ; i++) {
                    if (document.getElementById('hsr_completed_loading')) {
                        document.getElementById('hsr_completed_loading').id = 'hsr_completed_loading_' + Math.random();
                    }
                }
                setTimeout(callback, 1, true);
            }

            function wizard_change_dates_start_search(callback) {
                console_log('wizard_change_dates_start_search');
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDatesTests');
                var submit_button = $('.submitSearchWizard');
                submit_button.click();
                setTimeout(callback, 2000, true);
            }

            var g_wizard_change_dates_max_wait_for_change = 30;
            function wizard_change_dates_wait_for_change_in_model(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDatesTests');
                //g_wizard_change_dates_post = $('#wizardSummaryStartDate').text().replace(/\s+/g, '');
                g_wizard_change_dates_post = window.pageModel.wizard.checkIn;
                if (g_wizard_change_dates_max_wait_for_change-- > 0 &&
                    g_wizard_change_dates_pre == g_wizard_change_dates_post) {
                    console_log('#### wait for date changes to be applied : window.pageModel.wizard.checkIn  ###');
                    setTimeout(wizard_change_dates_wait_for_change_in_model, 500, callback);
                    return;
                }
                if (g_wizard_change_dates_max_wait_for_change-- > 0 &&
                    $('#hsr_completed_loading').length < 1) {
                    console_log('#### wait for date changes to be applied : #hsr_completed_loading ###');
                    setTimeout(wizard_change_dates_wait_for_change_in_model, 500, callback);
                    return;
                }
                var pass = g_wizard_change_dates_pre != g_wizard_change_dates_post;
                QUnit.ok(pass, 'hsr wizard date should change from ' + g_wizard_change_dates_pre, open_wizard_link);
                setTimeout(callback, 500, pass);
            }

            var functions_to_call = [
                wizard_change_dates_capture_pre_date,
                wizard_change_dates_open_wizard,
                wizard_change_dates_set_dates,
                wizard_change_dates_remove_completed_loading_div,
                wizard_change_dates_start_search,
                wizard_change_dates_wait_for_change_in_model,
                wizard_change_destination_tests_are_done
            ];


            var g_wizard_change_dates_function_index = -1;

            function wizard_change_dates_run_next_step() {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDatesTests');
                g_wizard_change_dates_function_index++;
                if (typeof functions_to_call[g_wizard_change_dates_function_index] == 'function') {
                    var call_me = functions_to_call[g_wizard_change_dates_function_index];
                    call_me(wizard_change_dates_run_next_step)
                } else {
                    g_wizard_change_dates_callback_when_done();
                }
            }

            var g_wizard_change_dates_callback_when_done = wizard_change_destination_tests_are_done;

            // todo: add something in new unit to deal with running click tests in series
            function start_wizard_change_dates_test(callback) {
                console_log('### wizard dates click tests tried ###');

                if (g_test_has_completed) {
                    console_log('### search change dates tests are done ###');
                    return;
                }

                if (typeof callback == 'function') {
                    g_wizard_change_dates_callback_when_done = callback;
                }

                if (QUnit.runtime.clickTestIsRunning) {
                    if (!g_is_registered_for_start_on_module_done) {
                        console_log('register moduleDone     wizard change dates');
                        g_is_registered_for_start_on_module_done = true;

                        // todo: does this work by passing out an internal function pointer?
                        //QUnit.registerForCallback('moduleDone', g_start_sort_test);
                        QUnit.callbacks.registerForCallback('moduleDone', start_wizard_change_dates_test);
                    }
                    return;
                }

                QUnit.runtime.registerAsyncSuiteCreate('searchWizardClickChangeDatesTests');

                console_log('########### start wizard dates click tests #############');
                QUnit.runtime.clickTestIsRunning = true;

                wizard_change_dates_run_next_step(true);
            }
            function wizard_change_destination_tests_are_done() {
                for (var i = 0 ; i < 30 ; i++){
                    console_log('########### wizard dates click tests are done ############# ' + i);
                }
                g_test_has_completed = true;
                QUnit.runtime.registerAsyncSuiteCompletion('searchWizardClickChangeDatesTests');
                QUnit.runtime.clickTestIsRunning = false;
                QUnit.callbacks.triggerForCallbacks('moduleDone');
            }

            start_wizard_change_dates_test(wizard_change_destination_tests_are_done);
            //QUnit.runtime.registerAsyncSuiteCompletion('searchWizardClickChangeDatesTests');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'searchWizardClickChangeDatesTests',
                run: run,
                tags: 'searchWizard,hsrPage,clickTests'
            }
        ]
    };
});

// add to url:  tagsToRun=clickTests
//
// try out this code in prod / trunk by
// 1. load hsr with qunit
// 2. paste the text of this file in the console.
// run the command :
//                            require('searchWizardChangeDatesTests').run()
