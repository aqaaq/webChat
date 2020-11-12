const User = require('./models/User')

//添加好友
async function addFriend(data) {
    const { toId, fromId, apply } = data;
    const to = await User.findById(toId),
        from = await User.findById(fromId);
    // return console.log(toId, fromId, apply);
    to.friends.push(fromId);
    from.friends.push(toId);
    setFriends(fromId, from.friends);
    setFriends(toId, to.friends);
    setApply(toId, apply);
}


//设置好友列表
async function setFriends(id, friends) {
    const res = await User.findByIdAndUpdate(id, {
        $set: {
            friends
        }
    }, {
        new: true
    })
    //console.log(res);
}
//修改申请者列表
async function setApply(id, apply) {
    const res = await User.findByIdAndUpdate(id, {
        $set: {
            apply
        }
    }, {
        new: true
    })
}

module.exports = {
    addFriend,
    setFriends,
    setApply
}