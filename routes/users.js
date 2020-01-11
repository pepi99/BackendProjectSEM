const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/user');

router.post('/register', function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    let newUser = new User({
        username: username,
        email: email,
        password: password
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
});

// Login process
router.post('/login', function (req, res, next) {
    passport.authenticate('local',  function (err, user, info) {
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

module.exports = router;