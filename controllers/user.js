const jwt = require('jsonwebtoken');
const helpers = require('../helpers/functions');
const User = require('../models/user');
const config = require('../config/local');

// User registration controller
exports.register = function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;
    if (!helpers.checkStringNotEmpty(username)) {
        return res.status(400).send(
            {error:
                {title: 'Username is empty', detail: 'Provide username'}
            });
    }
    if (!helpers.checkStringNotEmpty(password)) {
        return res.status(400).send(
            {error:
                {title: 'Password is empty', detail: 'Provide password'}
            });
    }
    if (!helpers.checkStringNotEmpty(passwordConfirmation)) {
        return res.status(400).send(
            {error:
                {title: 'Password confirmation is empty', detail: 'Provide password confirmation'}
            });
    }

    if(password !== passwordConfirmation) {
        return res.status(400).send(
            {error:
                {title: 'Password and password confirmation not match', detail: 'Check password and password confirmation'}
            });
    }

    User.findOne({username: username}, function (error, user) {
        if(error) {
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when query database!'}
                });
        }
        if(user){
            return res.status(400).send(
                {error:
                    {title: 'User already exists!', detail: `Username with ${username} exists!`} //change to 'Username with '+ username + ' exists!'
                });
        }
        const newUser = new User({username: username, password: password});
        newUser.save(function (err) {
            if(err){
                return res.status(500).send(helpers.getDBErrors(err.errors));
            }
            return res.json({username: newUser.username, _id: newUser._id});
        })
    });
};


//User login controller

exports.login = function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if(!helpers.checkStringNotEmpty(username) || !helpers.checkStringNotEmpty(password)) {
        return res.status(400).send(
            {error:
                {title: 'Username or password is empty', detail: 'Provide username and password'}
            });
    }
    User.findOne({username: username}, function (error, user) {
        if(error){
            return res.status(500).send(
                {error:
                    {title: 'DB error!', detail: 'Smth wrong when save user!'}
                });
        }
        if(!user) {
            return res.status(401).send(
                {error:
                    {title: 'User does not exists!', detail: 'Could not find user in database!'}
                });
        }
        if(user.hasSamePassword(password)){
            const token = jwt.sign({
                userId: user.id,
                username:user.username
            }, config.secret_key, {expiresIn: config.tokenExpiration});
            return res.json({'token': token});
        } else {
            return res.status(401).send(
                {error:
                    {title: 'Incorrect password!', detail: 'Provide correct password for user!'}
                });
        }
    })
};

exports.userInfo = function (req, res) {
    const user = res.locals.user;
    return res.json(user);
};

exports.changePassword = function (req, res) {
    const user = res.locals.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const passwordConfirmation = req.body.passwordConfirmation;

    if (!helpers.checkStringNotEmpty(oldPassword)) {
        return res.status(400).send(
            {error:
                {title: 'Old password is empty', detail: 'Provide old password'}
            });
    }
    if (!helpers.checkStringNotEmpty(newPassword)) {
        return res.status(400).send(
            {error:
                {title: 'New password is empty', detail: 'Provide new password'}
            });
    }
    if (!helpers.checkStringNotEmpty(passwordConfirmation)) {
        return res.status(400).send(
            {error:
                {title: 'Password confirmation is empty', detail: 'Provide password confirmation'}
            });
    }
    if(newPassword !== passwordConfirmation) {
        return res.status(400).send(
            {error:
                {title: 'New password and password confirmation not match', detail: 'Check new password and password confirmation'}
            });
    }
    if(!user.hasSamePassword(oldPassword)){
        return res.status(401).send(
            {error:
                {title: 'Incorrect old password!', detail: 'Provide correct old password for user!'}
            });
    }

    user.password = newPassword;
    user.save(function (err) {
            if(err){
                return res.status(500).send(helpers.getDBErrors(err.errors));
            }
            return res.json({username: user.username, _id: user._id});
        });
};

exports.changePhoto = function (req, res) {
    const user = res.locals.user;
    const photoUrl = req.body.photoUrl;

    user.photoUrl = photoUrl;

    User.updateOne(
            {_id: user.id},
            {$set: {photoUrl: photoUrl}},
            function (err) {
                if(err){
                    return res.status(500).send(
                        {error:
                            {title: 'DB error!', detail: 'Smth wrong when save user!'}
                        });
                }
                return res.json({username: user.username, _id: user._id, photoUrl: user.photoUrl});
            });
};

//Authentication middleware
exports.authMiddleware = function (req, res, next) {
    const token = req.headers.authorization;
    if(token){
        const userInfo = parseToken(token);
        User.findById(userInfo.userId, function (err, user) {
            if(err){
                return res.status(500).send(
                    {error:
                        {title: 'DB error!', detail: 'Smth wrong when save user!'}
                    });
            }
            if(user){
                res.locals.user = user;
                next();
            } else {
                return notAuthorized(res);
            }
        });
    } else {
    return notAuthorized(res);
    }
};

function parseToken(token) {
    return jwt.verify(token.split(' ')[1], config.secret_key);
}

function notAuthorized(res) {
    return res.status(403).send({error: {title: 'Not authorized!', detail: 'You need login'}});
}