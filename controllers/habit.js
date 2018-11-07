const helpers = require('../helpers/functions');

const User = require('../models/user');
const Habit = require('../models/habit');

exports.newHabit = function (req, res) {
    const user = res.locals.user;
    const lastDay = req.body.lastDay;
    const title = req.body.title;
    const tracking = req.body.tracking;

    if (!helpers.checkStringNotEmpty(title)) {
        return res.status(400).send(
            {error:
                {title: 'Title is empty', detail: 'Provide title for new habit'}
            });
    }
    if (!helpers.checkStringNotEmpty(lastDay)) {
        return res.status(400).send(
            {error:
                {title: 'Last day date is empty', detail: 'Provide last day date for new habit'}
            });
    }
    const newHabit = new Habit({user: user, lastDay: lastDay, title: title, tracking: tracking});
    newHabit.save(function (err) {
        if(err){
            console.log(err);
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when save habit!'}
                });
        }
        User.updateOne(
            {_id: user.id},
            {$push: {habits: newHabit}}, function (err) {
                if(err){
                    console.log(err);
                    return res.status(500).send(
                        {error:
                            {title: 'DB error!', detail: 'Smth wrong when update user_s habits!'}
                        });
                }
            });
        return res.json({habit: newHabit});
    });

};