console.log('injecting code from https://ewegithub.sb.karmalab.net/EWE/new_unit_hsr');

var filenames = [
    'suites/hsr_test_suites.js'
];

for (var i = 0 ; i < filenames.length ; i++) {    
    var script_el = document.createElement('script');
    script_el.src = "https://rawgit.com/tomgcoleman/new_unit_hsr/master/" + filenames[i];
    document.getElementsByTagName('head')[0].appendChild(script_el)
}
