# new_unit_hsr

Create a script element on your page, with src of:

https://cdn.jsdelivr.net/gh/tomgcoleman/new_unit_hsr@master/loader.js

This will create a script element for each file listed.
As they are loaded, they will run.

    var script_el = document.createElement('script');
    script_el.src = "https://cdn.jsdelivr.net/gh/tomgcoleman/new_unit_hsr@master/loader.js?cach_breaker=" + new Date().getTime();
    document.getElementsByTagName('head')[0].appendChild(script_el)
