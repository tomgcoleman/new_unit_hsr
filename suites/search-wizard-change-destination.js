define('searchWizardClickChangeDestinationTests', [
    'jquery', 'QUnit'
], function($, QUnit) {
    'use strict';

    var g_is_registered_for_start_on_module_done = false;
    var g_test_has_completed = false;

    var console_log = QUnit.trace.info;

    function run() {
        g_test_has_completed = false;

        QUnit.module("ClickTests: Search Wizard Change Destination");

        QUnit.test("HSR destination changes with wizard use.", function () {

            var g_wizard_change_search_pre = '';
            var g_wizard_change_destination_pre = '';
            //var g_wizard_change_search_post = '';
            var g_wizard_change_destination_post = '';

            var destination_input_query = '#inpSearchNear';
            var open_wizard_link_query = '#changeSearchWizard';
            var submit_button_query = '#hotelNewSearchLnk';

            function is_wizard_open() {
                return ($(destination_input_query).css('visibility') == 'visible');
            }

            var g_max_wait_for_wizard_to_be_open = 15;
            function wizard_change_destination_wait_for_wizard_to_be_open(callback) {
                console_log('wizard_change_destination_wait_for_wizard_to_be_open ' + g_max_wait_for_wizard_to_be_open);
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                if (g_max_wait_for_wizard_to_be_open-- > 0 && !is_wizard_open()) {
                    if (g_max_wait_for_wizard_to_be_open === 5) {
                        console_log('click on ' + destination_input_query);
                        $(destination_input_query).click();
                    }
                    setTimeout(wizard_change_destination_wait_for_wizard_to_be_open, 2000, callback);
                    return;
                }
                g_max_wait_for_wizard_to_be_open = 15;
                setTimeout(callback, 1, is_wizard_open());
            }

            function wizard_change_destination_capture_pre_date(callback) {
                console_log('wizard_change_destination_capture_pre_date');
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                g_wizard_change_destination_pre = window.pageModel.wizard.destinationName;
                g_wizard_change_search_pre = window.pageModel.wizard.searchString;
                setTimeout(callback, 1, true);
            }

            function wizard_change_destination_open_wizard(callback) {
                console_log('wizard_change_destination_open_wizard');
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                if (!is_wizard_open()) {
                    $(open_wizard_link_query).click();
                    wizard_change_destination_wait_for_wizard_to_be_open(callback);
                } else {
                    setTimeout(callback, 1, true);
                }
            }

            var max_wait_for_completed_element = 20;
            function wizard_change_destination_remove_completed_loading_div(callback) {
                console_log('wizard_change_destination_remove_completed_loading_div');
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                for (var i = 0 ; i < 20 ; i++) {
                    if (document.getElementById('hsr_completed_loading')) {
                        document.getElementById('hsr_completed_loading').id = 'hsr_completed_loading_' + Math.random();
                    }
                }
                max_wait_for_completed_element = 20;
                setTimeout(callback, 100, true);
            }


            function wizard_change_destination_wait_for_completed_loading_div(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                if (document.getElementById('hsr_completed_loading')) {
                    callback();
                    return;
                }
                if (max_wait_for_completed_element-- > 0) {
                    setTimeout(wizard_change_destination_wait_for_completed_loading_div, 500, callback);
                    return;
                }
                console_log('wizard_change_destination_wait_for_completed_loading_div give up waiting.');
                callback();
            }

            function wizard_change_destination_set_destination(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                var new_destination = 'New York';
                var new_destination_2 = 'Dallas, TX';
                var new_search = new_destination;
                if (g_wizard_change_search_pre.match(/new/i)) {
                    new_search = new_destination_2;
                }
                $(destination_input_query).click();
                $(destination_input_query).val(new_search);
                $(destination_input_query).trigger('change');
                $(destination_input_query).trigger('input');
                setTimeout(callback, 1000, true);
            }

            function wizard_change_destination_start_search(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                $(submit_button_query).click();
                setTimeout(callback, 1000, true);
            }

            var g_wizard_change_destination_max_wait_for_change = 10;
            function wizard_change_destination_wait_for_change_in_model(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                g_wizard_change_destination_post = window.pageModel.wizard.destinationName;
                if (g_wizard_change_destination_max_wait_for_change-- > 0 &&
                    g_wizard_change_destination_pre == g_wizard_change_destination_post) {
                    setTimeout(wizard_change_destination_wait_for_change_in_model, 2000, callback);
                    return;
                }
                var result = g_wizard_change_destination_pre != g_wizard_change_destination_post;
                QUnit.ok(result, 'wizard destination did not change from ' + g_wizard_change_destination_pre, $(open_wizard_link_query));
                setTimeout(callback, 2000, result);
            }

            function wizard_change_destination_restore_original_destination(callback) {
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                $(destination_input_query).click();
                $(destination_input_query).val(g_wizard_change_destination_pre);
                $(destination_input_query).trigger('change');
                $(destination_input_query).trigger('input');
                setTimeout(callback, 1000, true);
            }

            var functions_to_call = [
                wizard_change_destination_capture_pre_date,
                wizard_change_destination_open_wizard,
                wizard_change_destination_set_destination,
                wizard_change_destination_remove_completed_loading_div,
                wizard_change_destination_start_search,
                wizard_change_destination_wait_for_change_in_model,
                wizard_change_destination_wait_for_completed_loading_div,
                wizard_change_destination_restore_original_destination,
                wizard_change_destination_remove_completed_loading_div,
                wizard_change_destination_start_search,
                wizard_change_destination_wait_for_completed_loading_div
            ];


            var g_wizard_change_destination_function_index = -1;

            function wizard_change_destination_run_next_step() {
                console_log('wizard_change_destination_run_next_step : ' + g_wizard_change_destination_function_index);
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                g_wizard_change_destination_function_index++;
                if (typeof functions_to_call[g_wizard_change_destination_function_index] == 'function') {
                    var call_me = functions_to_call[g_wizard_change_destination_function_index];
                    call_me(wizard_change_destination_run_next_step)
                }
            }

            var g_wizard_change_destination_callback_when_done = wizard_change_destination_tests_are_done;
            //var max_wait_to_start = 40;

            // todo: add something in new unit to deal with running click tests in series
            function start_wizard_change_destination_test(callback) {
                //if (max_wait_to_start-- > 0 && QUnit.runtime.clickTestIsRunning) {
                //    setTimeout(start_wizard_change_destination_test, 3000, callback);
                //    return;
                //}

                console_log('### wizard destination click tests tried ###');

                if (g_test_has_completed) {
                    console_log('### wizard change destination tests are done ###');
                    return;
                }

                if (typeof callback == 'function') {
                    g_wizard_change_destination_callback_when_done = callback;
                }
                if (QUnit.runtime.clickTestIsRunning) {
                    if (!g_is_registered_for_start_on_module_done) {
                        console_log('register moduleDone     wizard destination change');
                        g_is_registered_for_start_on_module_done = true;

                        // todo: does this work by passing out an internal function pointer?
                        //QUnit.registerForCallback('moduleDone', g_start_sort_test);
                        QUnit.callbacks.registerForCallback('moduleDone', start_wizard_change_destination_test);
                    }
                    return;
                }

                QUnit.runtime.registerAsyncSuiteCreate('searchWizardClickChangeDestinationTests');

                console_log('#################### start search wizard destination click tests.');
                QUnit.runtime.clickTestIsRunning = true;

                if (typeof callback == 'function') {
                    g_wizard_change_destination_callback_when_done = callback;
                } else {
                    g_wizard_change_destination_callback_when_done = wizard_change_destination_tests_are_done;
                }
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickChangeDestinationTests');
                functions_to_call.push(g_wizard_change_destination_callback_when_done);
                wizard_change_destination_run_next_step();
            }
            function wizard_change_destination_tests_are_done() {
                for (var i = 0 ; i < 30 ; i++){
                    console_log('########### wizard destination click tests are done ############# ' + i);
                }
                g_test_has_completed = true;
                QUnit.runtime.registerAsyncSuiteCompletion('searchWizardClickChangeDestinationTests');
                // todo: see how to have this auto called when async tests are done.
                QUnit.runtime.clickTestIsRunning = false;
                setTimeout(function() {
                    QUnit.callbacks.triggerForCallbacks('moduleDone');
                }, 2000);
            }

            start_wizard_change_destination_test(wizard_change_destination_tests_are_done);
            //QUnit.runtime.registerAsyncSuiteCompletion('searchWizardClickChangeDestinationTests');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'searchWizardClickChangeDestinationTests',
                run: run,
                tags: 'searchWizard,hsrPage,clickTests'
            }
        ]
    };
});

// add to url:  tagsToRun=clickTests
//
