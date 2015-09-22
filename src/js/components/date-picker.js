/**
 * Created by Vladimir Kudryavtsev on 21.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

Vue.component('date-picker', {

    props:{
        date:{
            type:Object,
            default:function(){
                return new Date;
            }
        },
        picker:Object
    },

    template:`<input type="text" class="date-picker" readonly id="picker-date">`,
    ready: function(){
        var today = new Date();

        var picker = app.f7.picker({
            input: '#picker-date',
            rotateEffect: true,

            value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

            onChange: function (picker, values, displayValues) {
                var today = new Date;
                if(new Date(values[2], values[0], values[1], values[3], values[4]) < today) {
                    picker.cols[0].setValue(today.getMonth());
                    picker.cols[1].setValue(today.getDate());
                    picker.cols[2].setValue(today.getFullYear());
                    picker.cols[4].setValue(today.getHours());
                    picker.cols[6].setValue(today.getMinutes());
                };
                var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
                if (values[1] > daysInMonth) {
                    picker.cols[1].setValue(daysInMonth);
                }
            },

            formatValue: function (p, values, displayValues) {
                return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
            },

            cols: [
                // Months
                {
                    values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                    displayValues: ('January February March April May June July August September October November December').split(' '),
                    textAlign: 'left'
                },
                // Days
                {
                    values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                },
                // Years
                {
                    values: (function () {
                        var arr = [];
                        for (var i = today.getFullYear(); i <= 2030; i++) { arr.push(i); }
                        return arr;
                    })(),
                },
                // Space divider
                {
                    divider: true,
                    content: '  '
                },
                // Hours
                {
                    values: (function () {
                        var arr = [];
                        for (var i = 0; i <= 23; i++) { arr.push(i); }
                        return arr;
                    })(),
                },
                // Divider
                {
                    divider: true,
                    content: ':'
                },
                // Minutes
                {
                    values: (function () {
                        var arr = [];
                        for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                        return arr;
                    })(),
                }
            ]
        });

        /**
         * TODO: i open-close picker to set default value in input (i cannot find another way, maybe later)
         */
        picker.open();
        picker.close();


        this.picker = picker;



    },
    methods: {
        open: function(){
            app.f7.popup('.popup-date-picker');
        },

        getDateTime: function(){
            var values = this.picker.value;
            return new Date(values[2], values[0], values[1], values[3], values[4]);
        }
    }

});