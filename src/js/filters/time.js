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

Vue.filter('birthday', function(date = app.moment){
    if(date) {
        return app.moment(date).format('L');
    }
});

/**
 * @date {Date}
 */
Vue.filter('formatDate', function(date){

    if(!date) return;
    date = app.moment(date);

    if(!date.isValid()){
        throw new Error("Date is invalid!");
    }

    var today = app.moment();

    //yesterday, today, tomorrow
    if(date.isBetween(app.moment(today).subtract(2, 'd'), app.moment(today).add(2, 'd'), 'day')){
        return date.calendar().split(" ")[0];
    } else {
        if(date.isSame(today, 'y')){

            var dateFormat = date.format('ddd, ll').split(" ").splice(0,3).join(" ");

            if(dateFormat[dateFormat.length-1] == ','){//en format "Tue, Sep 22," <- need to remove ","
                dateFormat = dateFormat.slice(0, -1);
            }

            return dateFormat;
        }

        return date.format('ddd, ll');
    }
});