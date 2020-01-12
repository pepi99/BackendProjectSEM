const express = require('express');
const router = express.Router();

let User = require('../models/user');

router.get('/getTopFiveScores', function (req, res) {
    User.find().sort({score: -1}).select('username score -_id').exec(function (err, docs) {
        if (docs) {
            res.send(docs);
        }
    });
});
router.get('/getScore', function(req, res) {
    const username = req.body.username;
    User.findOne({username: username}).select('username score -_id')
        .exec(function (err, doc) {
            if (err) {
                res.status(500);
                res.send({message: 'Internal server error'});
            }
            if (doc) {
                res.send(doc);
            }
        })
});
module.exports = router;