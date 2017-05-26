console.log('injecting code from https://ewegithub.sb.karmalab.net/EWE/new_unit_hsr');

var filenames = [
    'common/filter-test-logic.js',
    'common/hsr-common.js',
    'common/hsr-constants.js',
    'common/hsr-listing-decoration.js',
    'common/hsr-page-information.js',
    'common/hsr-page-model-information.js',
    'common/hsr-selectors.js',
    'framework/hsr-view-base-automation.js',
    'framework/test-utils.js',
    'suites/a-column.js',
    'suites/accessibility-filter.js',
    'suites/accommodation-filter.js',
    'suites/air-attach.js',
    'suites/amenity-filter.js',
    'suites/b-column.js',
    'suites/deal-of-day.js',
    'suites/delayed-loaded-elements.js',
    'suites/filter-click.js',
    'suites/header-and-footer.js',
    'suites/high-level-region.js',
    'suites/hotel-container.js',
    'suites/hotel-list.js',
    'suites/hotel-name-filter.js',
    'suites/hsr-test-suites.js',
    'suites/map-view.js',
    'suites/member-price.js',
    'suites/neighborhood-filter.js',
    'suites/omniture.js',
    'suites/opaque-banner.js',
    'suites/page-level-error.js',
    'suites/pagination-click.js',
    'suites/pagination.js',
    'suites/payback.js',
    'suites/pinned-hotel.js',
    'suites/poi-filter.js',
    'suites/price-filter.js',
    'suites/search-wizard-change-dates.js',
    'suites/search-wizard-change-destination.js',
    'suites/search-wizard-open-close.js',
    'suites/search-wizard.js',
    'suites/sort-bar.js',
    'suites/sort-click.js',
    'suites/star-filter.js',
    'suites/travel-ad.js',
    'suites/user-interaction.js',
    'suites/vip-filter.js',
    'suites/wotif.js'
];

for (var i = 0 ; i < filenames.length ; i++) {    
    var script_el = document.createElement('script');
    script_el.src = "https://rawgit.com/tomgcoleman/new_unit_hsr/master/" + filenames[i];
    document.getElementsByTagName('head')[0].appendChild(script_el)
}
