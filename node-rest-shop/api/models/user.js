const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:                      mongoose.Schema.Types.ObjectId,
    firstName:              { type: String, required: true },
    lastName:               { type: String, required: true },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:               { type: String, required: true },
    birthDate:              { type: String, required: true }, 
    billingAddress:         { type: String, required: true },
    billingPostalNumber:    { type: String, required: true },
    billingCity:            { type: String, required: true },
    billingCountry:         { type: String, required: true },
    shippingAddress:        { type: String, required: true },
    shippingPostalNumber:   { type: String, required: true },
    shippingCity:           { type: String, required: true },
    shippingCountry:        { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema);