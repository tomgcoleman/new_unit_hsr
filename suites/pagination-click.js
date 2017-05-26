define('paginationClickTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    var g_is_registered_for_start_on_module_done = false;
    var g_test_has_completed = false;

    var console_log = QUnit.trace.info;
    
    // todo: remove code from "run" into peer functions.
    function run() {
        g_test_has_completed = false;

        QUnit.module("Regression: Pagination Click");

        //And pagination module on Hotel SR is visible
        QUnit.test("Pagination controls respond to clicks", function () {
            var pagination_elements_to_test_for = [
                {name: 'container', css: '#paginationContainer'},
                {name: 'pagePrevious', css: '.pagination-prev'},
                {name: 'pageOne', css: ".pagination-label[value='1']"},
                {name: 'pageTwo', css: ".pagination-label[value='2']"},
                {name: 'pageNext', css: '.pagination-next'}
            ];
            var pagination_elements_to_click_test = [
                {name: 'pageTwo', css: '.pagination-label[value="2"]'},
                {name: 'pageNext', css: '.pagination-next'},
                {name: 'pageOne', css: ".pagination-label[value='1']"}
            ];
            function test_ui_pagination_appearance() {
                console_log('start testing ui pagination.');

                for (var i = 0 ; i < pagination_elements_to_test_for.length ; i++) {
                    var css = pagination_elements_to_test_for[i].css;
                    var name = pagination_elements_to_test_for[i].name;

                    hsrCommon.isValid($(css), $(css).length > 0, name + " should exist with css: " + css);
                }

                console_log('done testing ui pagination.');
                return true;
            }
            function test_ui_pagination_visible() {
                console_log('start testing ui pagination visible.');

                var result = true;

                for (var i = 0 ; i < pagination_elements_to_test_for.length ; i++) {
                    var css = pagination_elements_to_test_for[i].css;
                    var name = pagination_elements_to_test_for[i].name;

                    // todo: support both
                    //var element_visible = $(css).is(':visible');
                    var element_visible = $(css).css('visibility') == 'visible';

                    hsrCommon.isValid($(css), element_visible, name + " should be visible with css: " + css);
                }

                console_log('done testing ui pagination visible.');
                return (result);
            }
            // todo: find new unit helper function to get the same, or add to new unit framework, or hsr common
            function get_hotel_ids_on_display() {
                var id_elements = $('[data-hotelid]');
                var ids = [];
                for (var i = 0 ; i < id_elements.length ; i++) {
                    ids.push(id_elements[i].id);
                }
                return ids;
            }
            var g_hotel_ids_on_display_pre_pagination = [];
            var g_hotel_ids_on_display_post_pagination = [];
            function test_ui_pagination_click(cssSelector, name) {
                g_hotel_ids_on_display_pre_pagination = get_hotel_ids_on_display();

                var clickElement = $(cssSelector);
                clickElement.click();

                pagination_wait_for_hotel_order_change(name);
            }

            var g_pagination_max_wait_for_count_change = 10;
            function pagination_wait_for_hotel_order_change(name) {
                QUnit.runtime.registerAsyncSuiteProgress('paginationClickTests');
                var order_changed = false;
                var ready_to_start_next_page_test = true;
                g_hotel_ids_on_display_post_pagination = get_hotel_ids_on_display();
                if (g_hotel_ids_on_display_post_pagination.length == g_hotel_ids_on_display_pre_pagination.length) {
                    for (var i = 0 ; i < g_hotel_ids_on_display_post_pagination.length ; i++) {
                        if (g_hotel_ids_on_display_post_pagination[i] != g_hotel_ids_on_display_pre_pagination[i]) {
                            order_changed = true;
                            break;
                        }
                    }
                } else {
                    // todo: what does it mean when the count changes?
                    order_changed = true;
                }
                if (!order_changed) {
                    if (g_pagination_max_wait_for_count_change-- > 0) {
                        console_log('wait more time for pagination hotels to change for : ' + name);
                        setTimeout(pagination_wait_for_hotel_order_change, 1000, name);
                        ready_to_start_next_page_test = false;
                    } else {
                        console_log('max wait time passed for pagination change.');
                        hsrCommon.isValid('', false, 'click_pagination_' + name + ' - failed to change pagination.');
                        g_pagination_max_wait_for_count_change = 10;
                    }
                } else {
                    hsrCommon.isValid('', true, 'click_pagination_' + name + ' + success to change pagination.');
                    g_pagination_max_wait_for_count_change = 10;
                }
                if (ready_to_start_next_page_test) {
                    start_next_pagination_click_test();
                }
            }

            var g_pagination_callback_when_done = pagination_tests_are_done;

            function start_pagination_test(callback) {
                console_log('### pagination click tests tried ###');

                if (g_test_has_completed) {
                    console_log('### pagination tests are done ###');
                    return;
                }

                if (typeof callback == 'function') {
                    g_pagination_callback_when_done = callback;
                }

                if (QUnit.runtime.clickTestIsRunning) {
                    if (!g_is_registered_for_start_on_module_done) {
                        console_log('register moduleDone     pagination click dates');
                        g_is_registered_for_start_on_module_done = true;

                        QUnit.callbacks.registerForCallback('moduleDone', start_pagination_test);
                    }
                    return;
                }

                QUnit.runtime.registerAsyncSuiteCreate('paginationClickTests');

                console_log('#################### start pagination click tests.');
                QUnit.runtime.clickTestIsRunning = true;
                QUnit.runtime.registerAsyncSuiteProgress('paginationClickTests');

                var result_pagination = test_ui_pagination_appearance();

                result_pagination = test_ui_pagination_visible();

                if (result_pagination) {
                    start_next_pagination_click_test();
                } else {
                    pagination_tests_are_done();
                }
            }

            var g_pagination_click_test_index = -1;

            function start_next_pagination_click_test() {
                QUnit.runtime.registerAsyncSuiteProgress('paginationClickTests');
                g_pagination_click_test_index++;
                var click_test_item = pagination_elements_to_click_test[g_pagination_click_test_index];
                if (click_test_item) {
                    console_log('starting next pagination click test of : ' + click_test_item.name);
                    // todo: see if the element is enabled, or interstitial is showing.
                    setTimeout(test_ui_pagination_click, 1000, click_test_item.css, click_test_item.name);
                } else {
                    g_pagination_callback_when_done();
                }
            }

            function pagination_tests_are_done() {
                for (var i = 0 ; i < 30 ; i++){
                    console_log('########### pagination click tests are done ############# ' + i);
                }
                g_test_has_completed = true;
                QUnit.runtime.registerAsyncSuiteCompletion('paginationClickTests');
                QUnit.runtime.clickTestIsRunning = false;
                QUnit.callbacks.triggerForCallbacks('moduleDone');
            }

            var call_this_when_all_is_done = pagination_tests_are_done;
             start_pagination_test(call_this_when_all_is_done);
            //QUnit.runtime.registerAsyncSuiteCompletion('paginationClickTests');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'paginationClickTests',
                run: run,
                tags: 'pagination,hsrPage,clickTests'
            }
        ]
    };
});

// add to url:  tagsToRun=clickTests
//
// try out this code in prod / trunk by
// 1. load hsr with qunit
// 2. paste the text of this file in the console.
// note: if this message comes back:    Duplicate module: paginationClickTests
// then chang the module name in the code, and require.... i.e. paginationClickTests77
// run the command :
//                            require('paginationClickTests').run()
