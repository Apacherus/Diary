/**
 * Created by Vladimir Kudryavtsev on 21.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

Vue.filter('caloric', function(v){

    if(!v) return;
    if(!v.length) return 0;

    var caloric = 0;
    for(var i = 0; i < v.length; i++){
        if(v.units == 'pc'){
            caloric += v[i].cal * v[i].amount;
        } else {//ml, gr
            caloric += v[i].cal && v[i].amount ? v[i].amount / 100 * v[i].cal : 0;
        }
    }
    return Math.round(caloric);
});