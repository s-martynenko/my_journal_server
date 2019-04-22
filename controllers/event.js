const helpers = require('../helpers/functions');

const User = require('../models/user');
const Event = require('../models/event');

const moment = require('moment');

exports.newEvent = function (req, res) {
    const user = res.locals.user;
    const title = req.body.title;
    const date = req.body.date ? req.body.date : new Date();

    if (!helpers.checkStringNotEmpty(title)) {
        return res.status(400).send(
            {error:
                {title: 'Title is empty', detail: 'Provide title for new event'}
            });
    }
    const newEvent = new Event({user: user, title: title, date: date});
    newEvent.save(function (err) {
        if(err){
            return res.status(500).send(helpers.getDBErrors(err.errors));
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

exports.allEvents = function (req, res) {
    const user = res.locals.user;
    Event.find({user: user}, function (err, events) {
        if(err) {
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find events!'}
                });
        }
        if (events){
            return res.json(events);
        }
    });

};

exports.monthEvents = function (req, res) {
    const user = res.locals.user;
    const date = req.body.date;

    if (!helpers.checkStringNotEmpty(date)) {
        return res.status(400).send(
            {error:
                {title: 'Date is empty', detail: 'Provide date for finding month events'}
            });
    }

    const monthDates = getMonthDates(date);

    if (monthDates.length === 0) {
        return res.status(400).send(
            {error:
                {title: 'Invalid date format', detail: 'Provide right date for finding month events'}
            });
    }

    Event.find({user: user, date: {$gte: monthDates[0], $lte: monthDates[1]}}, function (err, events) {
        if(err) {
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find events!'}
                });
        }
        if (events){
            return res.json(events);
        }
    });
};

exports.getEvent = function (req, res) {
    const id = req.params.id;
    Event.findOne({_id: id}, function (error, event) {
        if(error){
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find event!'}
                });
        }
        if(event){
            return res.json(event);
        }
    });
};

exports.deleteEvent = function (req, res) {
    const id = req.params.id;
    const user = res.locals.user;
    Event.findOne({_id: id}, function (error, event) {
        if(error){
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find event!'}
                });
        }
        if(event){
            User.updateOne(
                {_id: user.id},
                {$pull: {events: event.id}}, function (err) {
                    if(err){
                        console.log(err);
                        return res.status(500).send(
                            {error:
                                {title: 'DB error!', detail: 'Smth wrong when update user_s events!'}
                            });
                    }
                    event.remove(function (err) {
                        if(err){
                            return res.status(500).send(
                                {error:
                                    {title: 'DB error!', detail: 'Smth wrong when delete event!'}
                                });
                        }
                        else {
                            return res.status(204).send({'deleted':'true'});
                        }
                    });
                });
        }
        else {
            return res.status(404).send(
                {error:
                    {title: 'Event not found'}
                });
        }
    });
};

exports.changeEvent = function (req, res) {
    const id = req.params.id;
    const title = req.body.title;
    const date = req.body.date;
    const user = res.locals.user;

    if (!helpers.checkStringNotEmpty(title)) {
        return res.status(400).send(
            {error:
                {title: 'Title is empty', detail: 'Provide title for changing event'}
            });
    }
    if (!helpers.checkStringNotEmpty(date)) {
        return res.status(400).send(
            {error:
                {title: 'Date is empty', detail: 'Provide date for changing event'}
            });
    }

    Event.findOne({_id: id}, function (error, event) {
        if(error){
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find event!'}
                });
        }
        if(event){
            event.title = title;
            event.date = date;
            event.save(function (err) {
                if(err){
                    return res.status(500).send(helpers.getDBErrors(err.errors));
                }
            });
            return res.json(event);
    }
    });
};

function getMonthDates(dateStr) {
    var firstDayOfMonth, lastDayOfMonth;
    var monthInterval = [];
    if(moment(dateStr).isValid()){
        firstDayOfMonth = moment(dateStr).format("YYYY-MM-01");
        lastDayOfMonth = moment(dateStr).format("YYYY-MM-") + moment(dateStr).daysInMonth();
        monthInterval.push(firstDayOfMonth,lastDayOfMonth);
    }
    return monthInterval;
}