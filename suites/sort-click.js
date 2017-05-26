define('sortClickTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    var g_is_registered_for_start_on_module_done = false;
    var g_test_has_completed = false;

    var console_log = QUnit.trace.info;

    function run() {
        g_test_has_completed = false;

        QUnit.module("Regression: Sort Click");
        
		QUnit.test("Sort respond well to clicks", function () {

            var sort_elements_to_test_for = [
                {name: 'container', css: '#sortContainer'},
                {name: 'priceSort', css: 'button[data-opt-group=Price]'},
                {name: 'guestRatingSort', css: 'button[data-opt-group="Guest Rating"]'},
                //{name: 'vacationRentalSort', css: 'button[data-opt-group="Vacation Rentals"]'},
                {name: 'recommendedthisSort', css: 'button[data-opt-group="Recommended"]'},
                {name: 'moreTab', css: 'button[data-vtest-id="moreTab"]'}
            ];

            var sort_elements_to_click_test = [
                {name: 'priceSort', css: 'button[data-opt-group=Price]'},
                {name: 'guestRatingSort', css: 'button[data-opt-group="Guest Rating"]'},
                {name: 'recommendedthisSort', css: 'button[data-opt-group="Recommended"]'}
            ];

            function test_ui_sort_appearance() {
                console_log('start testing ui sort.');

                for (var i = 0 ; i < sort_elements_to_test_for.length ; i++) {
                    var css = sort_elements_to_test_for[i].css;
                    var name = sort_elements_to_test_for[i].name;

                    hsrCommon.isValid($(css), $(css).length > 0, name + " should exist with css: " + css);
                }

                console_log('done testing ui sort.');

                return true;
            }

            function test_ui_sort_visible() {
                console_log('start testing ui sort functional.');

                var result = true;

                for (var i = 0 ; i < sort_elements_to_test_for.length ; i++) {
                    var css = sort_elements_to_test_for[i].css;
                    var name = sort_elements_to_test_for[i].name;

                    //var element_visible = $(css).is(':visible');
                    var element_visible = $(css).css('visibility') == 'visible';

                    hsrCommon.isValid($(css), element_visible, name + " should be visible with css: " + css);

                    if (!element_visible) {
                        result = false;
                    }
                }

                console_log('done testing ui sort functional.');
                return (result);
            }

            function get_hotel_ids_on_display() {
                var id_elements = $('[data-hotelid]');
                var ids = [];
                for (var i = 0 ; i < id_elements.length ; i++) {
                    ids.push(id_elements[i].id);
                }
                return ids;
            }

            var g_hotel_ids_on_display_pre_sort = [];
            var g_hotel_ids_on_display_post_sort = [];

            function test_ui_sort_click(cssSelector, name) {
                g_hotel_ids_on_display_pre_sort = get_hotel_ids_on_display();

                var clickElement = $(cssSelector);
                clickElement.click();

                wait_for_hotel_order_change(name);
            }

            var g_sort_max_wait_for_count_change = 10;
            function wait_for_hotel_order_change(name) {
                QUnit.runtime.registerAsyncSuiteProgress('sortClickTests');
                var order_changed = false;
                var ready_to_call_next_test = true;
                g_hotel_ids_on_display_post_sort = get_hotel_ids_on_display();
                if (g_hotel_ids_on_display_post_sort.length == g_hotel_ids_on_display_pre_sort.length) {
                    for (var i = 0 ; i < g_hotel_ids_on_display_post_sort.length ; i++) {
                        if (g_hotel_ids_on_display_post_sort[i] != g_hotel_ids_on_display_pre_sort[i]) {
                            order_changed = true;
                            break;
                        }
                    }
                } else {
                    // todo: what does it mean when the count changes?
                    order_changed = true;
                }
                if (!order_changed) {
                    if (g_sort_max_wait_for_count_change-- > 0) {
                        console_log('wait more time for sort order to change for : ' + name);
                        setTimeout(wait_for_hotel_order_change, 2000, name);
                        ready_to_call_next_test = false;
                    } else {
                        console_log('max wait time passed for sort change.');
                        hsrCommon.isValid('', false, name + '- failed to change sort order.');
                    }
                } else {
                    hsrCommon.isValid('', true, name + ' + success in changing sort order.');
                    g_sort_max_wait_for_count_change = 10;
                }
                if (ready_to_call_next_test) {
                    start_next_sort_click_test();
                }
            }

            var g_sort_callback_when_done = sort_tests_are_done;

            function start_sort_test(callback) {
                console_log('### sort click tests tried ###');

                if (typeof callback == 'function') {
                    g_sort_callback_when_done = callback;
                }

                if (g_test_has_completed) {
                    console_log('### sort click tests are done ###');
                    return;
                }

                if (QUnit.runtime.clickTestIsRunning) {
                    if (!g_is_registered_for_start_on_module_done) {
                        console_log('register moduleDone g_is_registered_for_start_on_module_done');
                        g_is_registered_for_start_on_module_done = true;

                        // todo: does this work by passing out an internal function pointer?
                        //QUnit.registerForCallback('moduleDone', g_start_sort_test);
                        require('newUnit', function(QUnit) {
                            QUnit.callbacks.registerForCallback('moduleDone', start_sort_test);
                        });
                    }
                    return;
                }

                QUnit.runtime.registerAsyncSuiteCreate('sortClickTests');

                console_log('#################### start sort click tests.');
                QUnit.runtime.clickTestIsRunning = true;

                QUnit.runtime.registerAsyncSuiteProgress('sortClickTests');

                var result_sort = test_ui_sort_appearance();

                QUnit.runtime.registerAsyncSuiteProgress('sortClickTests');
                result_sort = test_ui_sort_visible();

                if (result_sort) {
                    start_next_sort_click_test();
                    return;
                }

                if (g_sort_callback_when_done) {
                    g_sort_callback_when_done();
                }
            }

            var g_sort_click_test_index = -1;

            function start_next_sort_click_test() {
                QUnit.runtime.registerAsyncSuiteProgress('sortClickTests');
                g_sort_click_test_index++;
                var click_test_item = sort_elements_to_click_test[g_sort_click_test_index];
                if (click_test_item) {
                    console_log('starting next sort click test of : ' + click_test_item.name);
                    // todo: see if the element is enabled, or interstitial is showing.
                    setTimeout(test_ui_sort_click, 1000, click_test_item.css, click_test_item.name);
                } else {
                    g_sort_callback_when_done();
                }
            }

            function sort_tests_are_done() {
                for (var i = 0 ; i < 30 ; i++){
                    console_log('########### sort click tests are done ############# ' + i);
                }
                g_test_has_completed = true;
                QUnit.runtime.registerAsyncSuiteCompletion('sortClickTests');
                // todo: see how to have this auto called when async tests are done.
                QUnit.runtime.clickTestIsRunning = false;
                QUnit.callbacks.triggerForCallbacks('moduleDone');
            }

            start_sort_test(sort_tests_are_done);
            //QUnit.runtime.registerAsyncSuiteCompletion('sortClickTests');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'sortClickTests',
                run: run,
                tags: 'filter,starFilter,hsrPage,clickTests'
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
//                            require('sortClickTests').run()
