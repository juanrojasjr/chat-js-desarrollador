const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    typeuser: String,
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Users', userSchema);