const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    id: { type: Number, default: 01, unique: true },
    avatar: { type: String },
    name: { type: String, required: true },
    desc: { type: String },
    userLists: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    group: { type: Boolean, default: true },
    master: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
})
module.exports = mongoose.model('Group', schema);
