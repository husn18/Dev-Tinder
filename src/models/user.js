const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    connectionRequests: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    }
}, {
    timestamps: true
});
userSchema.methods.toJWT = function() {
    const user = this;
    const payload = {
        userId: user._id
    };
    return jwt.sign(payload, 'Dev-Tinder@123', { expiresIn: '1h' });
};

userSchema.methods.toValidatePassword = function(passwordInput) {
    const user = this;
    return bcrypt.compare(passwordInput, user.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User; 

