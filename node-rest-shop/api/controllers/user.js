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
                            message: 'User created'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
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
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                "secret",
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
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

exports.user_update = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User updated',
            request: {
                type: 'GET',
                url: "http://localhost:3000/user/" + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
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