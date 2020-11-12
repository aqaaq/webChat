const express = require('express');
const router = express.Router();
const fs = require('fs');
const User = require('./models/User');
const Message = require('./models/Message');
const Group = require('./models/Group');
const assert = require('http-assert');
const jwt = require('jsonwebtoken');
//判断token中间件
const judgement = require('./middleware/judgement');

const { addFriend, setFriends, setApply } = require('./handler');

router.post('/register', async (req, res) => {
    const lastUser = await User.findOne({}).sort({ id: -1 }),
        newUser = req.body;
    if (lastUser) {
        newUser.id = lastUser.id + 1;
    }
    const create = await User.create(newUser)
    res.send(create);
})

router.post('/login', async (req, res) => {
    const user = await User.findOne(req.body).populate('friends');
    assert(user, 422, '账号或密码错误！');
    // assert(!user.online, 403, '该用户在别处已登录！');
    const token = jwt.sign({ id: user._id }, req.app.get('jwtKey'));
    res.send({
        user,
        token
    });
})
//判断用户名是否被占用
router.get('/checkUserName/:str', async (req, res) => {
    const result = await User.findOne({ name: req.params.str });
    if (result) {
        return res.send(false)
    }
    res.send(true);
})
//修改 用户数据
router.put('/update', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true }).populate('friends');
    res.send(user);
})
router.put('/addFriend', async (req, res) => {
    addFriend(req.body)
    res.status(200).send('添加成功！')
})

//获取所有用户 （添加测试）
router.get('/getFriends', async (req, res) => {
    const users = await User.find({});
    // await User.deleteMany({});
    // await Message.deleteMany({});
    // await Group.deleteMany({});
    res.send(users);
})

router.get('/rest/get/:model', async (req, res) => {
    const model = req.params.model,
        Model = require('./models/' + model),
        { str } = req.query,
        data = await Model.find({
            $or: [
                { name: str },
                { id: Number(str) ? Number(str) : '' }
            ]
        })
    res.send(data)
})
//拒绝添加好友
router.delete('/friend_no', async (req, res) => {

    const { id, fromid } = req.query;

    deleteApply(fromid, id);
})

//测试
router.get('/test', async (req, res) => {
    await Group.deleteMany({});
    res.send('删除用户！')
})

//免登录
router.get('/load', judgement, async (req, res) => {
    assert(!req.user.online, 403, '该用户在别处已登录！重新登录！');
    // console.log(req.user, '111');
    res.send(req.user);
})

router.get('/unReadMessage/:id', async (req, res) => {
    //const count = await Message.deleteMany();
    const messages = await Message.find({ id: req.params.id });
    res.send(messages);
})

router.delete('/deleteUnReadMessage', async (req, res) => {
    const data = req.query;
    const result = await Message.deleteMany({
        'to.id': Number(data.toId),
        'from.id': Number(data.fromId)
    });
    res.send(result);
})

router.post('/createGroup', async (req, res) => {
    //取得最后一个群的id ，并让id+1；
    const lastGroup = await Group.findOne({}).sort({ id: -1 }),
        newGroup = req.body;
    if (lastGroup) {
        newGroup.id = lastGroup.id + 1;
    }
    newGroup.group = true;
    //群聊中默认存在 创建者
    newGroup.userLists = [newGroup.master];
    const create = await Group.create(newGroup);
    //修改创建者加入的群聊数组
    const master = await User.findById(newGroup.master);
    const joinGroup = master.joinGroup;
    joinGroup.push(create._id);
    await User.findByIdAndUpdate(newGroup.master, {
        $set: {
            joinGroup
        }
    }, { new: true });
    res.send(create);
})

router.get('/getGroup/:id', async (req, res) => {
    const data = await Group.findOne({ id: req.params.id });
    res.send(data);
})

router.post('/joinGroup', async (req, res) => {
    const { groupId, userId } = req.body;

    //群成员中添加用户id
    const data = await Group.findById(groupId);
    if (data.userLists.includes(userId)) {
        assert(false, 422, '你已经加群!');
    }
    data.userLists.push(userId);
    const result = await Group.findByIdAndUpdate(groupId, {
        $set: {
            userLists: data.userLists
        }
    }, { new: true })

    //用户群聊列表添加群
    const user = await User.findById(userId);
    user.joinGroup.push(groupId);
    await User.findByIdAndUpdate(userId, {
        $set: {
            joinGroup: user.joinGroup
        }
    })

    res.send('添加成功！');
})

router.post('/myGroup', async (req, res) => {
    //根据id 获取你加入的群聊
    //test 获取所有群聊
    // await Group.deleteMany({});
    // const data = await Group.aggregate([{
    //     $lookup: {
    //         from: 'users',
    //         localField: 'userLists',
    //         foreignField: 'id',
    //         as: 'UserLists'
    //     }
    // }])
    const list = req.body;
    const data = await Group.find({
        _id: {
            $in: list
        }
    }).populate('userLists')
    res.send(data);
})

router.put('/deleteFriend', async (req, res) => {
    const { fromId, toId } = req.body;
    const from = await User.findById(fromId);
    const to = await User.findById(toId);
    from.friends.find((val, index) => {
        if (val == toId) {
            from.friends.splice(index, 1);
            return
            user.joinGroup
        }
    })
    setFriends(fromId, from.friends)
    to.friends.find((val, index) => {
        // console.log(val,fromId)
        if (val == fromId) {

            to.friends.splice(index, 1);
            return
        }
    })
    setFriends(toId, to.friends);
    res.send('删除成功！');
})

router.put('/deleteGroup', async (req, res) => {
    const { userId, groupId } = req.body;
    const user = await User.findById(userId);
    const group = await Group.findById(groupId);
    var index;
    index = user.joinGroup.indexOf(groupId);

    if (index != -1) {
        user.joinGroup.splice(index, 1);
        await User.findByIdAndUpdate(userId, { $set: { joinGroup: user.joinGroup } })
    }
    index = group.userLists.indexOf(userId);
    console.log(index);
    if (index != -1) {
        group.userLists.splice(index, 1);
        await Group.findByIdAndUpdate(groupId, {
            $set:
                { userLists: group.userLists }
        })
    }
    res.send('删除成功！')
})


//上传文件
const multer = require('multer');
const { send } = require('process');
const upload = multer({
    dest: __dirname + '/uploads'
})
router.post('/upload', upload.single('file'), (req, res) => {
    const filePath = 'http://localhost:3000/uploads/' + req.file.filename;
    res.send(filePath);
})


//图标
router.get('/favicon.ico', function (req, res) {
    fs.readFile('./uploads/img02.jpg', function (err, data) {
        res.setHeader('Content-Type', 'image/jpeg')
        res.end(data);
    })

})

//错误处理函数
router.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).send(err);
})









module.exports = router;
