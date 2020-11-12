const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    from:{type:Object,required:true},
    to:{type:Object,required:true},
    content:{type:String},
    time:{type:Number},
    id:{type:Number,ref:'User'},
    html:{type:Boolean,default:false},
})
module.exports = mongoose.model('Message',schema)