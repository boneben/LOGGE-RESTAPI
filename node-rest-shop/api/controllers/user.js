const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(422).json({
                message: 'User email already exists'
            })
        }else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    })
                }else {
                const user = new User ({

                    _id:                    new mongoose.Types.ObjectId(),
                    firstName:              req.body.firstName,
                    lastName:               req.body.lastName,
                    email:                  req.body.email,
                    password:               hash,
                    birthDate:              req.body.birthDate,
                    billingAddress:         req.body.billingAddress,
                    billingPostalNumber:    req.body.billingPostalNumber,
                    billingCity:            req.body.billingCity,
                    billingCountry:         req.body.billingCountry,
                    shippingAddress:        req.body.shippingAddress,
                    shippingPostalNumber:   req.body.shippingPostalNumber,
                    shippingCity:           req.body.shippingCity,
                    shippingCountry:        req.body.shippingCountry

                    })
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created',
                            success: true
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            success: false
                        })
                    })
                }
            
            })
        }
    })

}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if(result) {
                const token = jwt.sign({
                    userId: user[0]._id,
                    email: user[0].email
                }, 
                "secret",
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    success: true,
                    token: token,
                    userId: user[0]._id,
                    email: user[0].email
                })
            }
            return res.status(401).json({
                message: 'Auth failed'
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

exports.getUser = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ message: 'No valid entry found for provided ID' })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    })
}

exports.user_update = (req, res, next) => {
    if( req.body.password.length > 0 ) {
        console.log("Password changed ")
        bcrypt.hash(req.body.password, 10, function(error, hash) {
            if(error) {
                return res.status(500).json({
                    error: error,
                    message: "Error | failed to encrypt password"
                })
            }
            else {
                User
                .updateOne({ _id:req.params.userId },
                {$set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash,
                    billingAddress: req.body.billingAddress,
                    billingPostalNumber: req.body.billingPostalNumber,
                    billingCity: req.body.billingCity,
                    billingCountry: req.body.billingCountry,
                    shippingAddress: req.body.shippingAddress,
                    shippingPostalNumber: req.body.shippingPostalNumber,
                    shippingCity: req.body.shippingCity,
                    shippingCountry: req.body.shippingCountry
                }})
                .then( result => {
                    res.json({succes: true});
                })
                .catch(function(error, affected, resp) {
                    console.log(error);
                })
            }
        });
    } else {
        User
        .updateOne({ _id:req.params.userId },
        {$set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            billingAddress: req.body.billingAddress,
            billingPostalNumber: req.body.billingPostalNumber,
            billingCity: req.body.billingCity,
            billingCountry: req.body.billingCountry,
            shippingAddress: req.body.shippingAddress,
            shippingPostalNumber: req.body.shippingPostalNumber,
            shippingCity: req.body.shippingCity,
            shippingCountry: req.body.shippingCountry
        }})
        .then( result => {
            res.json({succes: true});
        })
        .catch(function(error, affected, resp) {
            console.log(error);
        })
    }
}

exports.user_delete = (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}