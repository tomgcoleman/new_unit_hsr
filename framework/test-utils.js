define('testUtils', function() {
    'use strict';

    function hsrQUnitRunAllTests() {
        require(['hsrMva', 'newUnit'], function(hsrMva, newUnit) {
            if (hsrMva.IsScrapeRequest()) {
                hsrMva.HSRAuto();
            }

            if (hsrMva.IsInjectRequest()) {
                hsrMva.InjectPageElement();
            }

            newUnit.tests.runAllTests();
        });
    }

    return {
        hsrQUnitRunAllTests: hsrQUnitRunAllTests
    };
});
