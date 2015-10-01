/**
 * Created by Vladimir Kudryavtsev on 24.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

export default class Goal {

    constructor(days = 0, weight = 0, startWeight = 0){

        if(days > 2000) {
            days = 2000;
        }

        startWeight = app.notes.last('measure');
        startWeight = "weight" in startWeight?startWeight.weight:0;

        this.goal =  {
            date: new Date,
            days: days,
            weight: weight,
            startWeight: startWeight
        };

        this.save();
    }

    save(){
        if(app && "profile" in app && "db" in app.profile){
            app.profile.db.goal = this.goal;
            app.profile.save();
            //app.em.event("profileGoalSet");
        }
    }

}