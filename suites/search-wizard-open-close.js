define('searchWizardClickOpenTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    var g_is_registered_for_start_on_module_done = false;
    var g_test_has_completed = false;

    var console_log = QUnit.trace.info;

    function run() {
        g_test_has_completed = false;

        QUnit.module("ClickTests: Search Wizard Open Close");

        QUnit.test("HSR search wizard module opens and closes when clicked", function () {

            var wizard_elements_to_test_for_show_when_open = [
                {name: 'startDate', css: '#startDateRange'},
                {name: 'endDate', css: '#endDateRange'},
                {name: 'searchLink', css: '#hotelNewSearchLnk'}
            ];

            var wizard_elements_to_test_for_show_when_closed = [
                {name: 'destinationLink', css: '.destination.fakeLink'},
                {name: 'startDateLink', css: '#wizardSummaryStartDate'},
                {name: 'endDateLink', css: '#wizardSummaryEndDate'}
            ];

            var wizard_elements_to_test_for_always_visible = [
                {name: 'wizardContainer', css: '#wizardResponsiveContainer'},
                {name: 'openCloseLink', css: '#changeSearchWizard'}
            ];

            var from_date_input_query = '#inpStartDate';
            var wizard_open_link_query = '#changeSearchWizard';

            function is_wizard_open() {
                return ($(from_date_input_query) && $(from_date_input_query).css('visibility') == 'visible');
            }

            function verify_visible(test_data_collection, test_for_visibility, should_be_visible) {
                var result = true;

                for (var i = 0 ; i < test_data_collection.length ; i++) {
                    var test_data = test_data_collection[i];

                    var element = $(test_data.css);

                    hsrCommon.isValid(element, element.length > 0, test_data.name + ' should be found via : ' + test_data.css);

                    if (element.length > 0) {
                        if (test_for_visibility) {
                            if (should_be_visible) {
                                hsrCommon.isVisible(element, test_data.name + ' should be visible.', false, true);
                            } else {
                                hsrCommon.isHidden(element, test_data.name + ' should not be visible.', false, true);
                            }
                        }
                    }
                }
                return result;
            }

            function test_ui_wizard_appearance() {
                console_log('start testing ui wizard.');

                var test_for_visibility = true;
                var should_be_visible = false;
                //
                // todo: why are these always visible, even when the wizard is closed?
                console_log('new-unit : skipping check for wizard items hidden when closed.');
                // var a =
                verify_visible(wizard_elements_to_test_for_show_when_open, test_for_visibility, should_be_visible);

                should_be_visible = true;
                var b = verify_visible(wizard_elements_to_test_for_show_when_closed, test_for_visibility, should_be_visible);
                var c = verify_visible(wizard_elements_to_test_for_always_visible, test_for_visibility, should_be_visible);

                console_log('done testing ui wizard.');

                // if a is visible we can still to click testing.
                return b && c;
            }

            function test_ui_wizard_functional_setup(next_function, callback) {
                console_log('start testing ui wizard functional setup.');

                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickOpenTests');
                $(wizard_open_link_query).click();

                setTimeout(next_function, 5000, callback);
            }

            function test_ui_wizard_functional(callback) {
                console_log('start testing ui wizard functional.');
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickOpenTests');

                var test_for_visibility = true;
                var should_be_visible = true;
                verify_visible(wizard_elements_to_test_for_show_when_open, test_for_visibility, should_be_visible);
                verify_visible(wizard_elements_to_test_for_always_visible, test_for_visibility, should_be_visible);

                should_be_visible = false;
                verify_visible(wizard_elements_to_test_for_show_when_closed, test_for_visibility, should_be_visible);

                if (is_wizard_open()) {
                    $(wizard_open_link_query).click();
                }

                console_log('done testing ui wizard functional.');

                if (typeof callback == 'function') {
                    console_log('calling callback');
                    setTimeout(callback, 1);
                } else {
                    console_log('no callback');
                }
            }

            var g_call_when_search_wizard_open_tests_are_done = search_wizard_open_close_tests_are_done;

            function start_wizard_test(callback) {
                console_log('### wizard open click tests tried ###');

                if (g_test_has_completed) {
                    console_log('### wizard open tests are done ###');
                    return;
                }

                if (typeof callback == 'function') {
                    g_call_when_search_wizard_open_tests_are_done = callback;
                }

                if (QUnit.runtime.clickTestIsRunning) {
                    if (!g_is_registered_for_start_on_module_done) {
                        console_log('register moduleDone     wizard open');
                        g_is_registered_for_start_on_module_done = true;

                        QUnit.callbacks.registerForCallback('moduleDone', start_wizard_test);
                    }
                    return;
                }

                QUnit.runtime.registerAsyncSuiteCreate('searchWizardClickOpenTests');

                console_log('#################### start wizard open close click tests.');
                QUnit.runtime.clickTestIsRunning = true;
                QUnit.runtime.registerAsyncSuiteProgress('searchWizardClickOpenTests');

                if (is_wizard_open()) {
                    $(wizard_open_link_query).click();
                }

                var result_wizard = test_ui_wizard_appearance();

                if (result_wizard) {
                    console_log('close wizard and continue');
                    setTimeout(test_ui_wizard_functional_setup, 2000, test_ui_wizard_functional, g_call_when_search_wizard_open_tests_are_done);
                } else {
                    g_call_when_search_wizard_open_tests_are_done();
                }
            }

            function search_wizard_open_close_tests_are_done() {
                for (var i = 0 ; i < 30 ; i++){
                    console_log('########### wizard open click tests are done ############# ' + i);
                }
                g_test_has_completed = true;
                QUnit.runtime.registerAsyncSuiteCompletion('searchWizardClickOpenTests');
                // todo: see how to have this auto called when async tests are done.
                QUnit.runtime.clickTestIsRunning = false;
                setTimeout(function() {
                    QUnit.callbacks.triggerForCallbacks('moduleDone');
                }, 2000);
            }

            start_wizard_test(search_wizard_open_close_tests_are_done);
            //QUnit.runtime.registerAsyncSuiteCompletion('searchWizardClickOpenTests');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'searchWizardClickOpenTests',
                run: run,
                tags: 'searchWizard,hsrPage,clickTests'
            }
        ]
    };
});

// add to url:  tagsToRun=clickTests
// or
// require('searchWizardClickOpenTests').run();