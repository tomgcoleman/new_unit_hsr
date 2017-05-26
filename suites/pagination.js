define('paginationTests', [
    'jquery', 'QUnit', 'hsrCommon'
], function($, QUnit, hsrCommon) {
    'use strict';
    
    function run() {
        QUnit.module("Regression: Pagination");

        //And pagination module on Hotel SR is visible
        if($('#showMoreContainer .backToTop').length > 0) {
            QUnit.test("Simple pagination appear ", function () {
                hsrCommon.isVisible($('#showMoreContainer .backToTop'), "Back to top link must be visible.");
                hsrCommon.isVisible($('#showMoreContainer .show-more-hotels__results'), "Hotel count label must be visible.");
                hsrCommon.isVisible($('#showMoreContainer .show-more-hotels__button'), "Hotel count label must be visible.");
            });
        }
        else {
            QUnit.test("We show pagination control if result has more than *50* hotels", function () {
                hsrCommon.isVisible($('#paginationContainer'), "Pagination control must be visible if result has more than *50* hotels");
                hsrCommon.isVisible($('#paginationContainer .backToTop'), "Back to top link must be visible.");
                hsrCommon.isVisible($('#paginationContainer .showing-results'), "Hotel count label must be visible.");
                if (!(window.pageModel.pagination.isFirstPage && window.pageModel.pagination.isLastPage)) {
                   hsrCommon.isVisible($('#paginationContainer button.pagination-prev'), "Prev page button must be visible.");
                   hsrCommon.isVisible($('#paginationContainer button.pagination-next'), "Next page button must be visible.");
                }
            });
        }
    }

    return {
        runners: [
            {
                testSuiteName: 'paginationTests',
                run: run,
                tags: 'pagination,hsrPage,regression'
            }
        ]
    };
});
