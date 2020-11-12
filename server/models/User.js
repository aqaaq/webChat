
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    id: { type: Number, default: 20200001, unique: true },
    name: { type: String, required: true },
    password: { type: String, require: true, select: false },
    avatar: { type: String, default: 'http://ooooo.plus:8080/uploads/timg.jfif' },
    chatId: { type: String },
    online: { type: Boolean, default: false },
    joinGroup: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Group' }],
    friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    apply: [{
        type: Object
    }]
})
const model = mongoose.model('User', schema);
module.exports = model
