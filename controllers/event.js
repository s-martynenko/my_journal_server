const helpers = require('../helpers/functions');

const User = require('../models/user');
const Event = require('../models/event');

exports.newEvent = function (req, res) {
    const user = res.locals.user;
    const title = req.body.title;
    const date = req.body.date;

    if (!helpers.checkStringNotEmpty(title)) {
        return res.status(400).send(
            {error:
                {title: 'Title is empty', detail: 'Provide title for new event'}
            });
    }
    const newEvent = new Event({user: user, title: title, date: date});
    newEvent.save(function (err) {
        if(err){
            console.log(err);
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when save event!'}
                });
        }
        User.updateOne(
            {_id: user.id},
            {$push: {events: newEvent}}, function (err) {
                if(err){
                    console.log(err);
                    return res.status(500).send(
                        {error:
                            {title: 'DB error!', detail: 'Smth wrong when update user_s events!'}
                        });
                }
            });
        return res.json({event: newEvent});
    });
};