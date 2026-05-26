const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
    firstname: {
        type: String,
    }, 
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },  
    phone: {
        type: String,
    },
    age: {
        type:   Number,
    },
    gender  : {  
        type: String,
    },
    password: {
        type: String,
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User; 

