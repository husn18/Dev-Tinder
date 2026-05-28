const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        validate(value) {
            if (value.trim() === '') {
                throw new Error('First name cannot be empty');
            }
        }
    },
    lastname: {
        type: String,
        minlength: 2,
        maxlength: 50,
        validate(value) {
            if (value && value.trim() === '') {
                throw new Error('Last name cannot be empty');
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        default: "this is default email",
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        }
    },
    phone: {
        type: String,
        required: true,
        // unique: true,
        minlength: 10,
        maxlength: 15,
        validate(value) {
    if(!validator.isMobilePhone(value, 'any')) {
        throw new Error('Invalid phone number format');
    }
        // validate(value) {
        //     const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        //     if (!phoneRegex.test(value)) {
        //         throw new Error('Invalid phone number format');
        //     }
        // }
    }
},
    age: {
        type: Number,
        min: 18,
        // required: true,
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error('Age must be an integer');
            }
        }
    },
    gender: {
        type: String,
        validate(value) {
            const validGenders = ['Male', 'Female', 'Other'];
            if (!validGenders.includes(value)) {
                throw new Error('Invalid gender value');
            }
        },
        // required: true
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })) {
                throw new Error('Password is not strong enough');
            }
        }
    },
    skills: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);
module.exports = User; 

