define('filterClickTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    var g_is_registered_for_start_on_module_done = false;
    var g_test_has_completed = false;

    var console_log = QUnit.trace.info;
    
    function run() {
        g_test_has_completed = false;

        QUnit.module("Regression: Filter Click");
        
		QUnit.test("Filters respond well to clicks", function () {

            var filter_elements_to_test_for = [
                {name: 'star', css: '#star'},
                {name: 'price', css: '#price'},
                //{name: 'poiFilter', css: '#poiFilter'},
                {name: 'neighborhood', css: '#neighborhoodContainer'},
                {name: 'vacationRentalType', css: '#vacationRentalTypeContainer'},
                {name: 'amenities', css: '#amenitiesContainer'},
                {name: 'accessibilities', css: '#accessibilitiesContainer'}
            ];

            var filter_elements_to_click_test = [
                {name: 'star', css: '#star3'},
                {name: 'price', css: '#price3'},
                {name: 'star', css: '#star3'},
                {name: 'price', css: '#price3'}
            ];

            function test_ui_filters_appearance() {
                console_log('start testing ui filters.');

                for (var i = 0 ; i < filter_elements_to_test_for.length ; i++) {
                    var css = filter_elements_to_test_for[i].css;
                    var name = filter_elements_to_test_for[i].name;

                    hsrCommon.isValid($(css), $(css).length > 0, "filter click " + name + " should exist with css: " + css);
                }

                console_log('done testing ui filters.');

                return true;
            }

            function test_ui_filters_visible() {
                console_log('start testing ui filters visible.');

                var result = true;

                for (var i = 0 ; i < filter_elements_to_test_for.length ; i++) {
                    var css = filter_elements_to_test_for[i].css;
                    var name = filter_elements_to_test_for[i].name;

                    //var element_visible = $(css).is(':visible');
                    var element_visible = $(css).css('visibility') == 'visible';

                    hsrCommon.isValid($(css), element_visible, "filter click " + name + " should be visible with css: " + css);
                }

                console_log('done testing ui filters functional. ' + result);
                return (result);
            }

            var g_pre_filter_hotel_count;
            var g_post_filter_hotel_count;

            function test_ui_filters_click(cssSelector, name) {
                // click on a filter, wait for the count to change

                g_pre_filter_hotel_count = $('#hotelResultTitle').text().replace(/[\D]+(\d+)[\s\S]+/, "$1");

                var clickElement = $(cssSelector);
                clickElement.click();

                wait_for_hotel_count_change(name);
            }

            var g_filter_max_wait_for_count_change = 10;
            function wait_for_hotel_count_change(filter_name) {
                g_post_filter_hotel_count = $('#hotelResultTitle').text().replace(/[\D]+(\d+)[\s\S]+/, "$1");
                var ready_to_start_next_test = true;
                if (g_post_filter_hotel_count && g_pre_filter_hotel_count == g_post_filter_hotel_count) {
                    if (g_filter_max_wait_for_count_change-- > 0) {
                        console_log('wait a while, count still shows as : ' + g_post_filter_hotel_count);
                        setTimeout(wait_for_hotel_count_change, 2000, filter_name);
                        ready_to_start_next_test = false;
                    } else {
                        console_log('fail: count did not change within time limit.');
                        g_filter_max_wait_for_count_change = 10;
                        hsrCommon.isValid($('#hotelResultTitle'), false, "filter click " + filter_name + ' - failed to change from ' + g_pre_filter_hotel_count);
                    }
                } else {
                    hsrCommon.isValid($('#hotelResultTitle'), true, "filter click " + filter_name + ' + changed from ' + g_pre_filter_hotel_count);
                }
                if (ready_to_start_next_test) {
                    start_next_filter_click_test();
                }
            }

            var g_filters_callback_when_done = filters_tests_are_done;

            function module_done_callback() {
                start_filters_test('not a function');
            }

            function start_filters_test(callback) {
                console_log('### filter click tests tried ###');
                QUnit.runtime.registerAsyncSuiteProgress('filterClickTests');

                if (g_test_has_completed) {
                    console_log('### filter tests are done ###');
                    return;
                }

                if (typeof callback == 'function') {
                    g_filters_callback_when_done = callback;
                    // let the others run first.
                }
                if (callback) {
                    setTimeout(start_filters_test, 5000);
                    return;
                }

                QUnit.runtime.registerAsyncSuiteCreate('filterClickTests');

                if (QUnit.runtime.clickTestIsRunning) {
                    if (!g_is_registered_for_start_on_module_done) {
                        console_log('register moduleDone     filter click');
                        g_is_registered_for_start_on_module_done = true;

                        // todo: does this work by passing out an internal function pointer?
                        //QUnit.registerForCallback('moduleDone', g_start_sort_test);
                        QUnit.callbacks.registerForCallback('moduleDone', module_done_callback);
                    }
                    return;
                }

                console_log('#################### start filter click tests.');
                QUnit.runtime.clickTestIsRunning = true;

                var result_filters = test_ui_filters_appearance();

                result_filters = test_ui_filters_visible();

                if (result_filters) {
                    start_next_filter_click_test();
                } else {
                    filters_tests_are_done();
                }
            }

            var g_filter_click_test_index = -1;

            function start_next_filter_click_test() {
                // todo: put module name in a central place for this file.
                QUnit.runtime.registerAsyncSuiteProgress('filterClickTests');
                g_filter_click_test_index++;
                var click_test_item = filter_elements_to_click_test[g_filter_click_test_index];
                if (click_test_item) {
                    console_log('starting next filter click test of : ' + click_test_item.name);
                    // todo: wait until control is enabled / no interstitial
                    setTimeout(test_ui_filters_click, 1000, click_test_item.css, click_test_item.name);
                } else {
                    g_filters_callback_when_done();
                }
            }

            function filters_tests_are_done() {
                for (var i = 0 ; i < 30 ; i++){
                    console_log('########### filter click tests are done ############# ' + i);
                }
                g_test_has_completed = true;
                // todo: see how to have this auto called as async tests are done.
                QUnit.runtime.registerAsyncSuiteCompletion('filterClickTests');
                QUnit.runtime.clickTestIsRunning = false;
                QUnit.callbacks.triggerForCallbacks('moduleDone');
            }

            start_filters_test(filters_tests_are_done);
            //QUnit.runtime.registerAsyncSuiteCompletion('filterClickTests');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'filterClickTests',
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
//                            require('filterClickTests').run()
