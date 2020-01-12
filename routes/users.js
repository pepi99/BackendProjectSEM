const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/user');

router.post('/register', function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const score = req.body.score;
    User.findOne({username: username}, function (err, user) {
        if (user) {
            res.status(409);
            res.send({success: 'false', message: 'Username already taken'});
        } else {
            if (err) {
                res.status(500);
                res.send({message: 'Internal server error'});
                console.log(err);
            }
            let newUser = new User({
                username: username,
                email: email,
                password: password,
                score: score
            });
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function (err) {
                        if (err) {
                            res.status(404);
                            res.send({
                                message: "Something wrong happened"
                            });
                            console.log(err);
                        } else {
                            res.send({
                                message: "User registered successfully"
                            });
                            console.log('User registered successfully');
                        }
                    });
                })
            });
        }
    })
});

// Login process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err)
            return next(err);
        if (!user) {
            return res.send({success: false, message: 'Authentication failed'});
        }
        req.login(user, loginErr => {
            if (loginErr)
                return next(loginErr);
            return res.send({success: true, mesage: 'auth complete'});
        })
    })(req, res, next);
});
router.post('/postScore', function (req, res) {
    const username = req.body.username;
    const score = req.body.score;

    User.findOneAndUpdate({username: username}, {$set: {score: score}}, function (err, doc) {
        if (err) {
            res.status(500);
            res.send({error: 'Internal server error'});
        }
        else {
            res.send({message: 'Update successful'});
        }
    })

});

module.exports = router;