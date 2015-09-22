/**
 * Created by Vladimir Kudryavtsev on 22.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */


var EventManager = function(){

    return {
        dispatcher:document,

        /**
         * Add event listener
         * @param event
         * @param listener
         */
        listen: function(event, listener){
            if(Array.isArray(listener)){
                for(var i = 0; i < listener.length; i++){
                    this.dispatcher.addEventListener(event, listener[i]);
                }
                return;
            }
            this.dispatcher.addEventListener(event, listener);
        },

        /**
         * Dispatch event
         * @param event
         */
        event: function(event){
            this.dispatcher.dispatchEvent(new Event(event));
        }
    }

};

export default EventManager;