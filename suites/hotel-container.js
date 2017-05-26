define('hotelContainerTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';

    function run() {
        QUnit.module("Acceptance: Hotel Container");

        QUnit.test("Hotel SR container must be visible", function() {
            hsrCommon.isVisible($('#mainContent'), "Hotel SR container must be visible.");
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'hotelContainerTests',
                run: run,
                tags: 'hotelContainer,hsrPage,acceptance'
            }
        ]
    };
});
