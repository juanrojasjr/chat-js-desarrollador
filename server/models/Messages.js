const mongoose = require('mongoose');
const { Schema } = mongoose;

const msgSchema = new Schema({
    username: String,
    namefull: String,
    role: String,
    msg: String,
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Messages', msgSchema);