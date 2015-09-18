/**
 * Created by Vladimir Kudryavtsev on 18.09.15.
 * Copyright © Academ Media, LTD
 * Copyright © Vladimir Kudryavtsev
 */

Vue.filter('time', function(val){
    var today = new Date;
    var time = (val.getHours()>9?val.getHours():'0'+val.getHours())+":"+(val.getMinutes()>9?val.getMinutes():'0'+val.getMinutes());
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if( val.getDate() == today.getDate() &&
        val.getYear() == today.getYear() &&
        val.getMonth() == today.getMonth()
    )
    {
        return time;
    }
    else if(
        val.getDate() == today.getDate()+1 && //tomorrow
        val.getYear() == today.getYear() &&
        val.getMonth() == today.getMonth()
    )
    {
        return 'tomorrow, ' + time;
    }
    else
    {
        var date = months[val.getMonth()]+' '+val.getDate();
        return date + ', ' + time;
    }
});