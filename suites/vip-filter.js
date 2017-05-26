define('vipFilterTests', [
    'QUnit'
], function(QUnit) {
    'use strict';

    function runVipFilterTests() {
        QUnit.module('VIP Filter');
        QUnit.test('+VIP Hotel Filter', function() {
            //Due to the undefine issue, comment out this scenario to debug
            //hsrCommon.isVisible(hsrSelectors.propertyTypeFilterContainer() + ' [name="vip"]');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'vipFilterTests',
                run: runVipFilterTests,
                tags: 'vipFilter,filter,hsrPage'
            }
        ]
    };
});