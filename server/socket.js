const User = require('./models/User');
const Message = require('./models/Message');
const Group = require('./models/Group');
const initNo = function (datakey, data) {
    if (!chatData[datakey]) {
        chatData[datakey] = []
    }
    let len = chatData[datakey].length;
    if (len == 0) {
        data.no = 0;
    } else {
        data.no = chatData[datakey][len - 1].no + 1;
    }
    if (len >= 200) {
        chatData[datakey].splice(0, 80);
    }
}
const { addFriend, setFriends, setApply } = require('./handler');
//通知好友
function inform(socket, list, eventName, data) {
    list.forEach((item, index) => {
        if (!item.online) { return }
        socket.to(item.chatId).emit(eventName, data);
    });
}

async function receive(socket, data) {
    //告诉用户消息发送成功！

    socket.emit('successful', data);
    //判断 是否是文件
    const to = await User.findOne({ id: data.to.id });
    //从数据库中找到聊天 id
    //判断用户是否在线
    if (to.online) {
        data.successful = true;
        socket.to(to.chatId).emit('getMessage', data);
    }
    //数据库存储一条未读消息
    data.id = data.to.id;
    const mes = await Message.create(data);
}


async function receiveAddFriend(socket, data) {
    const { toId, fromId, apply } = data;

    addFriend(data);
    //发送添加成功的消息

    const to = await User.findById(toId),
        from = await User.findById(fromId);
    const message = {
        time: Date.now(),
        from: to,
        to: from,
        successful: true,
        content: "我们已经是好友了。快来聊天吧。"
    }
    const message01 = {
        time: Date.now(),
        from: from,
        to: to,
        successful: true,
        content: "我们已经是好友了。快来聊天吧。"
    }
    //发送消息
    receive(socket, message);
    if (from.online) {
        socket.to(from.chatId).emit('friendChange', to);
    }

    socket.emit('getMessage', message01);
    message01.id = message01.to.id;
    await Message.create(message01)
    //提示
    socket.emit('reminder', '添加成功！');
}

//online人数
let num = 0,
    chatData = {};


module.exports = (app) => {
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    io.on('connection', socket => {
        socket.on('connection', async data => {
            const { user, chatId } = data;
            socket.userid = user.id;
            inform(socket, user.friends, "userBack", user);
            console.log(socket.userid + '连接')
            if (user.online) {
                // 强制下线
                //console.log(user.chatId, chatId)
                console.log('强制下线');
                socket.to(user.chatId).emit('force', "强制下线！");
            }
        })
        //发送消息
        socket.on('message', data => {
            receive(socket, data);
        });
        //群聊天记录
        socket.on('getGroupRecord', data => {
            var chat = chatData[data.groupid];
            // console.log(chat);
            if (!chat || chat.length < 1) {
                return
            }
            data.list = chat.slice(data.no + 1);
            data.unreadnum = data.list.length;
            socket.emit('sendGroupRecord', data)
        })
        //群聊消息
        socket.on('groupMessage', async data => {
            //该群的消息记录
            var datakey = data.to.id;
            initNo(datakey, data);
            //消息发送成功！
            data.successful = true;
            socket.emit('successful', data);
            
            chatData[datakey].push(data);
            

            const list = await Group.findById(data.to._id).populate('userLists');
            const result = list.userLists;
            result.map(per => {
                if (per.online && per.id !== data.from.id) {
                    socket.to(per.chatId).emit('getGroupMessage', data);
                }
            })
        })
        //申请添加好友
        socket.on('addFriend', async data => {
            const { from, to } = data;
            //添加的对象
            const { chatId, online, friends } = await User.findById(to._id);

            const { apply } = await User.findById(to._id);
            if (friends.includes(from._id)) {
                return socket.emit('reminder', '不要重复提交申请。');
            }
            for (let i of apply) {
                if (from.id === i.id) {
                    return socket.emit('reminder', '不要重复提交申请。');
                }
            }
            apply.unshift(from);
            const res = await User.findByIdAndUpdate(to._id, {
                $set: {
                    apply
                }
            });
            //当对象在线时
            if (online) {
                socket.to(chatId).emit('applyFriend', from);
            }
        })
        //接受添加好友申请
        socket.on('receiveAddFriend', data => {
            receiveAddFriend(socket, data);
        })
        //断开连接
        //浏览器关闭
        socket.on('disconnect', async () => {
            //修改用户状态
            if (!socket.userid) { return false }
            var id = socket.userid;
            socket.userid = false;
            console.log('浏览器关闭！')
            const user = await User.findOneAndUpdate({ id: id }, {
                $set: {
                    online: false,
                    chatId: ''
                }
            }, {
                new: true
            }).populate('friends');
            //通知好友列表该用户下线
            inform(socket, user.friends, "userLeave", user);
        })
        //退出登录
        socket.on('desconnect', async userID => {
            if (!socket.userid) { return false }
            num--;
            var id = socket.userid;
            socket.userid = false;
            console.log(socket.userid + '断开连接了！');
            if(!userID){return };
            const user = await User.findOneAndUpdate({ id: id }, {
                $set: {
                    online: false,
                    chatId: ''
                }
            }, { new: true }).populate('friends');
            inform(socket, user.friends, "userLeave", user);

        })
    });
    //io.emit('event',socket)
    server.listen('3000', function () {
        console.log('server is running at port:3000.')
    })
} 