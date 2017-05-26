define('wotifTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';
    
    function run() {
        QUnit.module("Acceptance: Wotif");
        if (window.tpid !== "70125" && window.tpid !== "70129") {
            return;
        }

        // todo: expand to all POS that should not show expedia

        // todo: exclude #legal
        // ... are either registered trademarks or trademarks of Expedia, Inc. in Australia ...

        //No "Expedia" displays as text in hsr page.
        QUnit.test("Expedia text is not showing on the HSR page test", function () {
            hsrCommon.isValid($('#searchForm'), $('#searchForm').text().toLocaleLowerCase().indexOf('expedia') === -1, 'HSR page should not show "Expedia" text');
            if (window.pageModel.metaData.isDateless) {
                hsrCommon.isValid($('#edsDisplay'), $('#edsDisplay').text().toLocaleLowerCase().indexOf('expedia') === -1, 'EDS should not show "Expedia" text');
            }
        });

        //VIP does not appear on W POS.
        QUnit.test("VIP does not appear on W POS", function () {
            hsrCommon.isHidden($('img.vipBadge'), 'Old VIP should not appear on W pos');
            hsrCommon.isHidden($('img.vipBadgeTest'), 'New VIP should not appear on W pos');
        });
    }

    return {
        runners: [
            {
                testSuiteName: 'wotifTests',
                run: run,
                tags: 'wotif,hsrPage,acceptance'
            }
        ]
    };
});
