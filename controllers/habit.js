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

exports.allHabits = function (req, res) {
    const user = res.locals.user;
    Habit.find({user: user}, function (err, habits) {
        if(err) {
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find habits!'}
                });
        }
        if (habits){
            return res.json(habits);
        }
    });

};

exports.getHabit = function (req, res) {
    const id = req.params.id;
    Habit.findOne({_id: id}, function (error, habit) {
        if(error){
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find habit!'}
                });
        }
        if(habit){
            return res.json(habit);
        }
    });
};

exports.deleteHabit = function (req, res) {
    const id = req.params.id;
    const user = res.locals.user;
    Habit.findOne({_id: id}, function (error, habit) {
        if(error){
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find habit!'}
                });
        }
        if(habit){
            User.updateOne(
                {_id: user.id},
                {$pull: {habits: habit.id}}, function (err) {
                    if(err){
                        console.log(err);
                        return res.status(500).send(
                            {error:
                                {title: 'DB error!', detail: 'Smth wrong when update user_s habits!'}
                            });
                    }
                    habit.remove(function (err) {
                        if(err){
                            return res.status(500).send(
                                {error:
                                    {title: 'DB error!', detail: 'Smth wrong when delete habit!'}
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
                    {title: 'Habit not found'}
                });
        }
    });
};

exports.changeHabit = function (req, res) {
    const id = req.params.id;
    const lastDay = req.body.lastDay;
    const title = req.body.title;
    const tracking = req.body.tracking;
    const user = res.locals.user;

    if (!helpers.checkStringNotEmpty(title)) {
        return res.status(400).send(
            {error:
                {title: 'Title is empty', detail: 'Provide title for changing habit'}
            });
    }
    if (!helpers.checkStringNotEmpty(lastDay)) {
        return res.status(400).send(
            {error:
                {title: 'Last day date is empty', detail: 'Provide last day date for changing habit'}
            });
    }

    Habit.findOne({_id: id}, function (error, habit) {
        if(error){
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when find habit!'}
                });
        }
        if(habit){
            habit.lastDay = lastDay;
            habit.title = title;
            habit.tracking = tracking;
            habit.save(function (err) {
                if(err){
                    return res.status(500).send(
                        {error:
                            {title: 'DB error!', detail: 'Smth wrong when save habit!'}
                        });
                }
            });
            return res.json(habit);
        }
    });

};