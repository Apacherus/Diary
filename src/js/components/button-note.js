import '../filters/translate'
import goalView from './goal-view'

var button;
button = Vue.component('button-note', {
    props: {
        isClosed: {
            type: Boolean,
            default: true
        }
    },
    template: `
    <div class="button-note"
    v-on="click: buttonClick(null, $event)"
    v-class="closed: isClosed"
    on-load="onLoad"
    >
    <button-note-round></button-note-round>
    <ul>
        <li class="button-note-item button-note-weight" v-on="click: buttonClick('weight', $event)">
            <span v-el="weight" class="tip">{{"update weight"|translate}}<span class="border"></span><span class="triangle"></span></span>
        </li>
        <li class="button-note-item button-note-note" v-on="click: buttonClick('note', $event)">
            <span v-el="note" class="tip">{{"write note"|translate}}<span class="border"></span><span class="triangle"></span></span>
        </li>
        <li class="button-note-item button-note-eat" v-on="click: buttonClick('eat', $event)">
            <span v-el="eat" class="tip">{{"plan eat"|translate}}<span class="border"></span><span class="triangle"></span></span>
        </li>
        <li class="button-note-item button-note-water" v-on="click: buttonClick('water', $event)">
            <span v-el="water" class="tip">{{"drink water"|translate}}<span class="border"></span><span class="triangle"></span></span>
        </li>
    </ul>
    </div>
    <goal-view></goal-view>
    <div v-on="click: buttonClick(null, $event)" class="blur-back-shadow"></div>
    `,

    methods: {
        buttonClick: function (btn, e) {
            e.stopPropagation();
            this.isClosed = !this.isClosed;

            if(!this.isClosed){
                app.dom7('.page').addClass('blur');
                app.dom7('.navbar').addClass('blur');
                app.dom7('.blur-back-shadow').css({'opacity':'0.2', 'display':'block'});
            } else {
                app.dom7('.page').removeClass('blur');
                app.dom7('.navbar').removeClass('blur');
                app.dom7('.blur-back-shadow').css('opacity', '0');
                setTimeout(function(){
                    app.dom7('.blur-back-shadow').css('display', 'none');
                }, 300);
            }
        }
    },

    ready: function () {
        /**
         * на разных языка ширина заголовка разная, учтем это
         * 10 => triangle width
         * 15 => space between icon and tip
         */
        var els = ['weight', 'note', 'eat', 'water'];
        for (var i = 0; i < els.length; i++) {
            if(this.$$[els[i]].offsetWidth >= 135){
                //fix text node value and add '...'
                this.$$[els[i]].childNodes[0].nodeValue = this.$$[els[i]].childNodes[0].nodeValue.slice(0, 20) + '...';
            }
            this.$$[els[i]].style.left = '-'+(this.$$[els[i]].offsetWidth + 10 + 15)+'px';
        }

        app.dom7('.button-note li').css('opacity', '0');
        setTimeout(function () {
            app.dom7('.button-note li').css('opacity', '1');
        }, 700);
    }
});


export default button;