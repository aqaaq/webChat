<template>
  <div>
    <div
      class="main"
      @click="
        expressionShow = false;
        addPersion = false;
        oncontextmenuOff = false;
        deleteChatHistory = false;
        input_blur();
      "
    >
      <div class="left">
        <!-- 消息 -->
        <p @click="navId = 0">
          <i
            :class="{
              iconfont: true,
              'icon-xiaoxi2': true,
              active: navId === 0,
            }"
          ></i>
          <span class="num" v-show="unreadCount > 0">{{ unreadCount }}</span>
        </p>
        <!-- 好友列表 -->
        <p @click="navId = 1">
          <i
            :class="{
              iconfont: true,
              'icon-Serviceusers': true,
              active: navId === 1,
            }"
          ></i>
          <span class="num" v-show="userApplyNum > 0">{{ userApplyNum }}</span>
        </p>
        <!-- 群聊 -->
        <p @click="navId = 2">
          <i
            :class="{
              iconfont: true,
              'icon-UserService': true,
              active: navId === 2,
            }"
          ></i>
        </p>
        <p @click="navId = 3">
          <i
            :class="{
              iconfont: true,
              'icon-moredetails': true,
              active: navId === 3,
            }"
          ></i>
        </p>
        <p :class="{ myAvatar: true, online: !user.online }">
          <img class="img_avatar" :src="user.avatar" />
        </p>
        <div class="menu">
          <p>{{ user.name }}</p>
          <p>个人资料</p>
          <p @click="isShow = !isShow">上传头像</p>
          <p @click="exit">退出登录</p>
        </div>
      </div>
      <div class="friends">
        <div class="friends_header">
          <div class="search_box">
            <i class="iconfont iconSearch icon-sousuo"></i>
            <input type="text" style="width: 230px" />
            <span class="iconAdd">
              <i class="iconfont icon-jiajian02"></i>
            </span>
          </div>
        </div>
        <!-- 好友聊天列表 -->
        <div style="overflow-y: auto; height: 100%">
          <div class="friends_list" v-show="navId === 0">
            <ul class="ul">
              <li
                :class="{ li: true, active: item.id === chatObjectIndex }"
                @click="changeChatObject(item)"
                @contextmenu="oncontextmenuHistory(item, index)($event)"
                v-for="(item, index) in chatFriend"
                :key="index"
              >
                <div class="avatar">
                  <img :src="item.avatar" />
                </div>
                <div class="message">
                  <p class="name">
                    {{ item.name }}
                    <span class="time">
                      {{
                        chatWithMe[item.id] &&
                        chatWithMe[item.id].slice(-1)[0].time | time
                      }}</span
                    >
                    <!--  -->
                  </p>
                  <div class="text">
                    <p>
                      {{ lastMessage([item.id]) }}
                      <!--  -->
                    </p>
                    <span class="unReadNum" v-if="unReadMe[item.id] > 0">
                      {{ unReadMe[item.id] }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 通讯录 -->
          <div class="addressBook" v-show="navId === 1">
            <div>
              <h4 class="title" @click="off">
                <span class="el-icon-arrow-right off"></span>我的好友({{
                  friends && friends.length
                }})
              </h4>
              <div class="box no">
                <div
                  :class="{ item: true, active: item.id === chatObjectIndex }"
                  v-for="(item, index) in friends"
                  :key="index"
                  @click="changeChatObject(item)"
                  @contextmenu="oncontextmenu(item, index)($event)"
                >
                  <div>
                    <img :src="item.avatar" :class="{ online: item.online }" />
                  </div>
                  <div class="info">
                    <p>{{ item.name }}</p>
                    <p>
                      <span
                        style="color: green"
                        class="el-icon-success"
                        v-show="item.online"
                        >在线</span
                      >
                      <span class="el-icon-error" v-show="!item.online"
                        >离线</span
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 class="title" @click="off">
                <span class="el-icon-arrow-right off"></span>新朋友
              </h4>
              <div class="box no">
                <div
                  class="item"
                  v-for="(item, index) in userApply"
                  :key="index"
                >
                  <div>
                    <img :src="item.avatar" :class="{ online: item.online }" />
                  </div>
                  <div class="info">
                    <p>{{ item.name }}</p>
                    <p>
                      请求添加好友
                      <el-button type="text" @click="friend_ok(index, item)"
                        >确定</el-button
                      ><el-button type="text" @click="friend_no(index)"
                        >拒绝</el-button
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 群聊 -->
          <div class="Grounp" v-show="navId === 2">
            <h4 class="title">我的群聊</h4>
            <ul class="ul">
              <li
                :class="{ li: true, active: item.id === chatObjectIndex }"
                @click="changeChatObject(item)"
                @contextmenu="oncontextmenu(item, index)($event)"
                @dblclick="dbclick(item)"
                v-for="(item, index) in groups"
                :key="index"
              >
                <div class="avatar">
                  <img :src="item.avatar" />
                </div>
                <div class="message">
                  <p class="name">
                    {{ item.name }}
                    <span class="time"> </span>
                  </p>
                  <div class="text">
                    <p>
                      {{ lastMessage([item.id]) }}
                      <!--  -->
                    </p>
                    <span class="unReadNum" v-if="unReadMe[item.id] > 0">
                      {{ unReadMe[item.id] }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="friend_bottom">
          <i
            class="iconfont icon-jia"
            title="添加"
            @click.stop="addPersion = !addPersion"
          ></i>
          <i class="iconfont icon-set set"></i>
        </div>
      </div>
      <div class="right" v-if="chatObject" ref="right">
        <header ref="header">
          <i class="iconfont icon-left1 toogle_back" @click="toggle_back"></i>
          <h4 class="name">{{ chatObject.name }}</h4>
          <span class="el-icon-s-tools set"></span>
          <div
            class="liner_ball"
            ref="liner_ball"
            @mouseup="ball_leave"
            @mousedown="ball_enter"
          >
            <span class="linner"></span>
            <span class="ball"></span>
          </div>
        </header>
        <!-- 聊天框 -->
        <section class="chat_section" v-if="chatObject">
          <div style="overflow: auto; height: 100%" ref="chat_box">
            <div style="padding-bottom: 20px">
              <div
                :class="{ chat_item: true, isMe: item.from.id === user.id }"
                v-for="(item, index) in chatData"
                :key="index"
              >
                <!-- timeShow -->
                <div v-if="timeShow(chatData, index)" class="time">
                  {{ item.time | allTime }}
                </div>
                <div class="avatar_box">
                  <img
                    @click="dbclick(item.from)"
                    class="chatAvatar"
                    :src="item.from.avatar"
                  />
                </div>
                <div class="content" v-if="!item.html">
                  {{ item.content }}
                  <!-- 小箭头 -->
                  <span class="arrows"></span>
                </div>
                <div class="content" v-else v-html="item.content"></div>
              </div>
            </div>
          </div>
          <div
            class="group_userLists"
            v-show="chatObject.group"
            :class="{ userListsIshow: group_userLists }"
          >
            <i
              class="_left iconfont icon-left"
              @click="group_userLists = !group_userLists"
            ></i>
            <div style="max-height: 100%; overflow: auto">
              <div
                class="item"
                v-for="(item, index) in chatObject.userLists"
                :key="index"
              >
                <img :src="item.avatar" :class="{ online: item.online }" />
                {{ item.name }}
              </div>
            </div>
          </div>
        </section>
        <div class="chat_input" ref="chat_input">
          <!-- 表情，上传图片 -->
          <div class="item">
            <i
              class="iconfont icon-biaoqing2"
              @click.stop="expressionShow = !expressionShow"
            ></i>
            <i class="iconfont icon-wenjian" @click="$refs.uploadImage.click()">
              <input
                type="file"
                ref="uploadImage"
                style="display: none"
                @change="uploadImageChange"
              />
            </i>
            <i class="iconfont icon-xiaoxi2"></i>
            <div
              class="expression"
              @click.stop="addExprssion"
              v-show="expressionShow"
            >
              <span
                style="width: 37px; height: 37px"
                v-for="(item, key) in expression"
                :key="key"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <!-- 输入框 -->
          <textarea
            class="input"
            @keydown.enter="emit"
            v-model="content"
            ref="textarea"
            @click.stop="input_focus"
          ></textarea>
          <!-- 发送按钮 -->
          <button class="send" @click="emit">发送(Enter)</button>
        </div>
      </div>
      <section
        class="section"
        style="flex: 1; position: relative"
        v-show="!chatObject"
      >
        <h3 class="section_text">快找个好友聊天吧！</h3>
      </section>
    </div>

    <!-- 上传头像 -->
    <div :class="{ shadow: true, show: isShow }" @click="isShow = !isShow">
      <div :class="{ upload: true, translate: isShow }" @click.stop="">
        <span class="iFont"
          ><i class="iconfont icon-jia" @click="$refs.upload.click()"></i>
          <img ref="img" @click="$refs.upload.click()" />
        </span>
        <button class="com_btn" @click.prevent.stop="affirm">确认修改</button>
        <input
          type="file"
          @change="updateAvatar"
          ref="upload"
          style="display: none"
        />
      </div>
    </div>

    <!-- 个人信息 -->
    <el-dialog
      v-if="dialogObject"
      title="信息"
      :visible.sync="dialogVisible"
      width="350px"
      :before-close="handleClose"
    >
      <div class="dialog_box">
        <div class="img_box">
          <img :src="dialogObject.avatar" />
        </div>
        <p>用户名: {{ dialogObject.name }}</p>
        <p>id：{{ dialogObject.id }}</p>
        <p>简介:{{ dialogObject.desc }}</p>
        <p v-if="dialogObject.master">群主:{{ dialogObject.master }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="!dialogObject.group"
          type="primary"
          @click="addFriend(dialogObject)"
          >添加好友</el-button
        >
      </span>
    </el-dialog>
    <!-- 查找 添加好友-->
    <div class="addPersion" v-if="addPersion">
      <div class="head">
        <span>查找</span>
      </div>
      <div class="search">
        <el-input
          v-model="searchVal"
          style="flex-grow: 1"
          placeholder="请输入用户名或者id"
        ></el-input>

        <input type="radio" value="1" v-model="radio" /> <label>找人</label>
        <input type="radio" value="2" v-model="radio" /> <label>找群</label>
        <el-button type="primary" @click="search">查找</el-button>
        <el-button type="primary" @click="$refs.group.style.display = 'block'"
          >我要建群</el-button
        >
      </div>
      <div class="addPersion_main" ref="addPersion_main">
        <div class="addPersion_main_box">
          <div class="item" v-for="(item, key) in currPage" :key="key">
            <img width="60" :src="item.avatar" @click="dbclick(item)" />
            <div>
              <p>{{ item.name }}</p>
              <el-button type="text" @click="addFriend(item)"
                ><span class="el-icon-circle-plus-outline"></span>
                <span v-show="!item.group">添加好友</span>
                <span v-show="item.group">申请加群</span>
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        @current-change="currentChange"
        background
        layout="prev, pager, next"
        :total="persions.length * 10"
      >
      </el-pagination>
    </div>
    <!-- 创建群聊 -->
    <div class="group" ref="group">
      <!-- <div class="head">
        <span>查找</span>
      </div> -->
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        style="padding-top: 15px"
      >
        <el-form-item label="群名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="加群验证">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">无需验证</el-radio>
            <el-radio :label="1">需要验证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="群简介">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item class="upload" label="群头像">
          <el-upload
            class="avatar-uploader"
            action="http://ooooo.plus:8080/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createGroup">立即创建</el-button>
          <el-button @click="$refs.group.style.display = 'none'"
            >关闭</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- mouse右键 删除好友div -->
    <div class="oncontextmenu" v-show="oncontextmenuOff" ref="oncontextmenu">
      <p @click="contextmenuChangeObject('oncontextmenuOff')">
        <span
          class="el-icon-s-comment"
          @click="contextmenuChangeObject('oncontextmenuOff')"
        ></span
        >发送消息
      </p>
      <p
        @click="
          dbclick(checkObject);
          oncontextmenuOff = false;
        "
      >
        <span class="el-icon-s-check"></span>查看资料
      </p>
      <p @click="deleteFriend" v-show="checkObject && !checkObject.group">
        <span class="el-icon-close">删除好友</span>
      </p>
      <p @click="deleteGroup" v-show="checkObject && checkObject.group">
        <span class="el-icon-close">退出该群</span>
      </p>
    </div>
    <div
      class="oncontextmenu"
      v-show="deleteChatHistory"
      ref="deleteChatHistory"
      @click.stop=""
    >
      <p @click="contextmenuChangeObject('deleteChatHistory')">
        <span class="el-icon-s-comment"></span>发送消息
      </p>
      <p @click="deleteChatHistoryFn">
        <span class="el-icon-close">删除消息</span>
      </p>
    </div>
    <!-- 消息通知 -->
    <audio
      ontrols="controls"
      ref="ring"
      src="../assets/ring/ring03.wav"
    ></audio>
    <audio
      ontrols="controls"
      ref="system"
      src="../assets/ring/system.wav"
    ></audio>
  </div>
</template>

<script>
// 表情
import expression from "../document/expression.js";
export default {
  props: {
    msg: String,
  },
  data() {
    return {
      content: "", //输入框内容
      chatFriendMap: {}, //map
      chatFriend: null, //最近聊天数组
      chatData: [], // 与 chatObject 的 聊天数据
      chatObject: null, //聊天对象
      friends: [], //聊天列表
      isShow: false, //遮罩层 开关
      navId: 0, //nav 切换
      chatWithMe: null,
      unReadMe: {},
      expression: [],
      addPersion: false, //查询添加好友div 开关
      expressionShow: false, // 开关
      document: ["img", "jpg", "jpeg", "gif", "png"],
      groups: [],
      radio: 1,
      searchVal: "",
      persions: [], //全部人数集合 分页
      //创建群聊data
      form: {
        name: "",
        type: 1,
        desc: "",
        avatar: "",
      },
      checkObject: null,
      userApply: [],
      unreadCount: 0, //未读消息总和
      group_userLists: true, // 开关,
      dialogVisible: false, //
      dialogObject: null, //dialog 对象
      oncontextmenuOff: false, //
      deleteChatHistory: false,
      pageIndex: 0,
      mode: "computer",
      ring: null, //消息提醒铃声,
      system: null, //好友添加铃声
    };
  },
  filters: {
    time(val) {
      if (!val) {
        return "";
      }
      const date = new Date(val);
      var res = "",
        year = date.getFullYear(),
        mounth = date.getMonth() + 1,
        day = date.getDate();
      res = year + "-" + mounth + "-" + day;
      return res;
    },
    allTime(val) {
      if (!val) {
        return "";
      }
      const date = new Date(val);
      var res = "",
        year = date.getFullYear(),
        mounth = date.getMonth() + 1,
        day = date.getDate(),
        hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        minutes =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      res = year + "-" + mounth + "-" + day + " " + hours + ":" + minutes;
      return res;
    },
  },
  methods: {
    //发送消息
    emit(e, content) {
      //清除textarea 换行
      if (e) {
        e.returnValue = false;
        e.preventDefault();
      }
      //更新聊天对象聊天内容
      const data = {
        content: content ? content : this.content,
        from: this.user,
        to: this.chatObject,
        time: Date.now(),
        successful: false,
        html: content ? true : false, //v-html
      };
      this.chatData.push(data);
      //;

      this.$nextTick(() => {
        if (content) {
          var img = document.querySelectorAll(".img");
          img[img.length - 1].onload = () => {
            this.scrollEvent();
          };
        } else {
          this.scrollEvent();
        }
      });
      //限制本地大小
      if (this.chatData.length > 150) {
        this.chatData.splice(0, 50);
      }
      //更新最后一条消息
      this.chatWithMe[this.chatObject.id] = this.chatData;
      //最近聊天
      this.changeChatFriend(this.chatObject);
      //向服务器请求
      //判断是 单聊 还是 群聊；
      if (this.chatObject.group) {
        this.socket.emit("groupMessage", data);
      } else {
        // 更新Storage,只存单聊
        this.socket.emit("message", data);
      }
      this.updateStorage(this.user.id, this.chatObject.id, this.chatData);
      //将input清空
      if (!content) {
        this.content = "";
      }
      //滚轮自动
    },
    //切换聊天对象，并改变聊天内容
    async changeChatObject(item) {
      this.chatObject = item;
      this.$nextTick(() => {
        if (this.mode === "mobile") {
          this.toggle_back();
        }
      });
      var chatData = this.chatWithMe[this.chatObject.id];
      console.log(chatData);
      this.$nextTick(() => {
        this.scrollEvent();
      });
      this.chatData = chatData ? chatData : [];
      //判断是否存在未读信息
      const unReadLists = this.unReadMe[item.id];

      //单聊
      if (unReadLists && !this.chatObject.group) {
        //更新离线消息总数
        //发送请求该消息已读从数据库中删除该消息，将消息添加到storage
        const res = await this.removeUnReadMessage(item.id);
        this.unreadCount -= unReadLists;
        //删除成功
        if (res) {
          this.updateStorage(this.user.id, item.id, this.chatWithMe[item.id]);
        }
      }
      //群聊
      if (this.chatObject.group && unReadLists) {
        this.unreadCount -= unReadLists;
        this.unReadMe[item.id] = 0;
        this.updateStorage(this.user.id, item.id, this.chatWithMe[item.id]);
      }
    },
    //退出登录
    exit() {
      this.id = this.user.id;
      this.$parent.user = null;
      localStorage.removeItem("token");
      // 页面刷新
      //location.reload();
    },
    //上传头像，更换头像
    async updateAvatar() {
      const file = this.$refs.upload.files[0];
      const formdata = new FormData();
      formdata.append("file", file);
      const res = await this.$http.post("/upload", formdata);

      const img = this.$refs.img;
      img.src = res.data;
      img.style.zIndex = "1";
      this.$parent.user.avatar = res.data;
    },
    //发送修改请求
    update() {
      //修改
      return this.$http.put("/update", this.user);
    },
    //修改头像
    async affirm() {
      const res = await this.update();
      if (res) {
        this.$message.success("头像修改成功！");
        this.isShow = false;
      } else {
        this.$message.error("头像修改失败！");
      }
    },
    //获取好友列表
    async getFriends() {
      //所有用户
      const data = await this.$http.get("/getFriends");
      let list = data.data;
      this.splitPage(list);
      
    },
    //分页函数
    splitPage(list) {
      if (!list instanceof Array) {
        return;
      }
      this.persions = [];
      let num = 12, //每页展示12个用户
        //分页
        start = 0;
      while (start < list.length) {
        let end = start + num;
        this.persions.push(list.slice(start, end));
        start = end;
      }
      console.log(this.persions);
    },
    //初始化Storage
    initStorage() {
      if (!localStorage.chatWith) {
        localStorage.chatWith = JSON.stringify({});
      }
      let key = this.user.id;
      let chatWith = JSON.parse(localStorage.chatWith);
      if (!chatWith[key]) {
        chatWith[key] = {};
        localStorage.chatWith = JSON.stringify(chatWith);
      }
    },
    //修改本地Storage
    updateStorage(userId, chatObjectID, chatData) {
      const chatWith = JSON.parse(localStorage.getItem("chatWith"));
      chatWith[userId][chatObjectID] = chatData;
      localStorage.setItem("chatWith", JSON.stringify(chatWith));
    },
    //消息框滚轮时间
    scrollEvent() {
      //滚轮事件
      const chat_box = this.$refs.chat_box;
      var len = chat_box.firstChild.children.length;
      chat_box.scrollTop = chat_box.scrollHeight - chat_box.clientHeight + 100;
    },
    //查看用户是否存在离线消息 , 如果存在就加入本地
    async getUnReadMessage() {
      const messages = await this.$http.get("/unReadMessage/" + this.user.id);
      //如果没有离线消息
      if (!messages || messages.data.length < 1) {
        return;
      }
      //好友离线消息总数
      this.unreadCount = messages.data.length;
      //遍历 离线消息数组
      messages.data.forEach((item, index) => {
        let chatData = this.chatWithMe[item.from.id];
        this.changeChatFriend(item.from);
        if (!chatData) {
          this.$set(this.chatWithMe, item.from.id, []);
          chatData = this.chatWithMe[item.from.id];
        }
        if (!this.unReadMe[item.from.id]) {
          this.$set(this.unReadMe, item.from.id, 0);
        }
        this.unReadMe[item.from.id]++;
        chatData.push(item);
      });
    },
    //播放铃声
    playRing(ring) {
      if (!ring) {
        return;
      }
      ring.play().catch((err) => {
        console.log(err);
      });
    },
    //websocket 客户端监听事件
    socketEvent() {
      //收到单聊消息
      this.socket.on("getMessage", (data) => {
        this.playRing(this.ring);
        //消息添加到相对的对象
        let fromid = data.from.id;
        this.changeChatFriend(data.from);
        let chatData = this.chatWithMe[fromid];
        if (!chatData) {
          this.$set(this.chatWithMe, fromid, []);
          chatData = this.chatWithMe[fromid];
        }
        if (!this.unReadMe[fromid]) {
          this.$set(this.unReadMe, fromid, 0);
        }

        this.unreadCount++;

        if (this.chatObject && this.chatObject.id === fromid) {
          //如果 当前聊天对象 就是 发送消息的是人
          chatData.push(data);
          this.chatData = chatData;
          this.removeUnReadMessage(fromid, true); // 数据库取消未读消息
          this.unReadMe[fromid]++;

          this.updateStorage(this.user.id, fromid, this.chatData); //更新storage
        } else {
          chatData.push(data);
          this.unReadMe[fromid]++;
        }
        console.log("get!", fromid);
      });
      //收到群聊消息
      this.socket.on("getGroupMessage", this.getGroupMessage);
      //获取群聊离线消息
      this.socket.on("sendGroupRecord", this.sendGroupRecord);
      //收到好友申请
      this.socket.on("applyFriend", this.applyFriend);
      //消息是否发送成功
      this.socket.on("successful", this.sendMessageSuccful);
      //提示
      this.socket.on("reminder", this.reminder);
      //强制下线
      this.socket.on("force", this.force);
      //好友下线
      this.socket.on("userLeave", this.userLeave);
      //好友上线
      this.socket.on("userBack", this.userBack);
      //socket 断开连接
      this.socket.on("disconnect", this.disconnect);
      //用户列表改变
      this.socket.on("friendChange", this.friendChange);
    },
    //消息发送成功！
    sendMessageSuccful(data) {
      var list = this.chatWithMe[data.to.id];
      if (!list) {
        return;
      }
      for (let i = list.length - 1; i >= 0; i--) {
        if (data.time === list[i].time) {
          list[i] = Object.assign(list[i], data);
          this.updateStorage(this.user.id, data.to.id, list);
          break;
        }
      }
    },
    //收到群聊消息
    getGroupMessage(data) {
      console.log("getGroupMessage", data);
      this.playRing(this.ring);
      var toid = data.to.id;
      if (!this.unReadMe[toid]) {
        this.unReadMe[toid] = 1;
      } else {
        this.unReadMe[toid]++;
      }
      if (!this.chatWithMe[toid]) {
        this.chatWithMe[toid] = [data];
        //this.unReadMe[toid] = 1;
      } else {
        this.chatWithMe[toid].push(data);
      }
      this.unreadCount++;

      // --未读消息修改
      this.changeChatFriend(data.to);
      // this.updateStorage(this.user.id, data.to.id, this.chatWithMe[toid]);
    },
    //本地、数据库 未读消息清除
    removeUnReadMessage(fromId, falg = false) {
      if (!falg) {
        this.unReadMe[fromId] = 0;
      }
      return this.$http.delete(
        `/deleteUnReadMessage?fromId=${fromId}&toId=${this.user.id}`
      );
    },
    //消息时间间隔
    timeShow(chatData, index) {
      //判断事件间隔，时间是否显示
      //间隔两分钟 120000
      if (!chatData[index - 1]) {
        return true;
      }
      return chatData[index].time - chatData[index - 1].time >= 120000;
    },
    // 添加表情
    addExprssion(e) {
      var dom = this.$refs.textarea,
        text = dom.value;
      if (e.target.tagName === "SPAN") {
        var value = e.target.innerText,
          start = dom.selectionStart,
          end = dom.selectionEnd;
        this.content = text.substr(0, start) + value + text.substr(start);
        dom.selectionStart = start + value.length;
        dom.selectionEnd = end + value.length;
        dom.focus();
      }
    },
    //消息框上传图片(多余)
    async uploadImageChange() {
      const file = this.$refs.uploadImage.files[0],
        fs = new FileReader();
      if (!file) {
        return;
      }
      var type = file.name.split(".").pop();
      if (!this.document.includes(type)) {
        return confirm("文件格式错误！");
      }
      const formdata = new FormData();
      formdata.append("file", file);
      const res = await this.$http.post("/upload", formdata);
      if (!res) {
        this.$message.error("图片发送失败！");
      }
      const content = `<img class='img' src ='${res.data}'><span class="arrows"></span>`;
      this.emit(null, content);
    },
    //好友最后一条消息
    lastMessage(id) {
      if (this.chatWithMe[id] && this.chatWithMe[id].length > 0) {
        var last = this.chatWithMe[id].slice(-1);
        if (!last) {
          return "";
        }
        if (last[0].html) {
          return "  [图片]";
        } else {
          return last[0].content;
        }
      } else {
        return "";
      }
    },
    //创建群聊页面
    openCreateGroup() {
      this.$refs.group.style.display = "block";
    },
    //创建群聊
    async createGroup() {
      this.form.master = this.user._id;
      const res = this.$http.post("/createGroup", this.form);
      if (res) {
        this.$message({
          type: "success",
          message: "创建成功！",
        });
        this.$refs.group.style.display = "none";
      }
    },
    //群聊离线消息
    async getGroup() {
      const res = await this.$http.post("/myGroup", this.user.joinGroup);
      console.log(res);
      if (res) {
        this.groups = res.data;
        //获取消息记录
        //console.log(this.groups)
        this.groups.map((group) => {
          // 该群聊 的本地聊天记录
          var record = this.chatWithMe[group.id];
          console.log(record, group.id);
          //当聊天记录不存在时，向后端请求该群聊所有聊天记录
          if (!record) {
            return this.socket.emit("getGroupRecord", {
              groupid: group.id,
              no: 0,
            });
          }
          //存在聊天记录时，发送本地最后一条消息的编号判断是否存在离线消息
          if (record.length < 1) {
            return;
          }
          var no = record[record.length - 1].no;
          console.log(record[record.length - 1]);
          //判断是否存在离线消息
          this.socket.emit("getGroupRecord", { groupid: group.id, no });
        });
      }
    },
    //将群聊离线消息添加到本地
    sendGroupRecord(data) {
      console.log("sendGroupRecord", data);
      //该群聊未读消息数量
      //群聊未读消息数量
      if (data.unreadnum < 1) {
        return;
      }
      //未读消息总数量改变
      this.unreadCount += data.unreadnum;
      this.$set(this.unReadMe, data.groupid, data.unreadnum);
      //判断localhoststroge 是否存在 该群聊消息
      if (!this.chatWithMe[data.groupid]) {
        this.$set(this.chatWithMe, data.groupid, [...data.list]);
        //this.chatWithMe[data.groupid].push()
      } else {
        this.chatWithMe[data.groupid].push(...data.list);
      }
      //最近聊天列表添加
      const item = data.list[0].to;
      this.changeChatFriend(item);
    },
    //查询
    async search() {
      let res;
      // 找人
      const shadow = this.$loading({ target: this.$refs.addPersion_main });
      if (this.radio == 1) {
        res = await this.$http.get("/rest/get/User?str=" + this.searchVal);
      }
      // 赵群
      else {
        res = await this.$http.get("/rest/get/Group?str=" + this.searchVal);
      }
      shadow.close();
      this.splitPage(res.data);
    },
    //拖拽
    ball_enter(e) {
      return console.log(e);
      var dom = e;
      // e.target.addEventListener("mousedown", this.mouseMoveEvent(dom));
      e.target.addEventListener("mousemove", this.mouseMoveEvent(dom));
    },
    ball_leave(e, target) {
      console.log("remove");
      e.target.removeEventListener("mousemove", this.mouseMoveEvent);
    },
    mouseMoveEvent(dom) {
      return (e) => {
        dom.style.left = e.clientY + "px";
        //console.log(e.clientY, dom);
      };
    },
    //好友列表展开
    off(e) {
      // "el-icon-arrow-right";
      var target = e.target;
      if (target.tagName === "SPAN") {
        target = target.parentNode;
      }
      target.firstChild.classList.toggle("show");
      target.nextSibling.classList.toggle("no");
    },
    //添加好友
    async addFriend(item) {
      //判断 添加对象是群聊还是 用户
      if (!item.group) {
        this.socket.emit("addFriend", {
          from: this.user,
          to: item,
        });
      } else {
        const res = await this.$http.post("/joinGroup", {
          groupId: item._id,
          userId: this.user._id,
        });
        if (res) {
          this.$message(res.data);
        }
      }
    },
    //收到好友请求
    applyFriend(data) {
      this.playRing(this.system);
      this.userApply.unshift(data);
    },
    //xiao提示
    reminder(msg) {
      console.log("reminder", msg);
      const h = this.$createElement;
      this.$notify({
        title: "提示！",
        message: h("i", { style: "color: teal" }, msg),
      });
    },
    //确认添加好友
    friend_ok(index, from) {
      this.userApply.splice(index, 1);
      this.friends.push(from);
      this.socket.emit("receiveAddFriend", {
        toId: this.user._id,
        fromId: from._id,
        apply: this.userApply,
      });
    },
    //拒绝请求
    friend_no(index) {
      this.userApply.splice(index, 1);
      this.update();
    },
    //打开dialog
    dbclick(e) {
      this.dialogObject = e;
      this.dialogVisible = true;
      console.log(e);
    },
    // 强制下线
    force(msg) {
      this.$message(msg);
      // 不修改 用户状态
      this.id = "";
      this.$parent.user = null;
      //刷新
      //location.reload();
    },
    //dig 关闭事件
    handleClose(done) {
      this.dialogVisible = false;
    },
    //删除好友
    async deleteFriend() {
      var deleteId = this.checkObject._id;
      //发送请求
      const res = await this.$http.put("/deleteFriend", {
        fromId: this.user._id,
        toId: deleteId,
      });
      if (!res) {
        return false;
      }
      this.$message.success(res.data);
      //本地删除
      this.friends.forEach((val, index) => {
        if (val._id === deleteId) {
          this.friends.splice(index, 1);
        }
      });
      this.oncontextmenuOff = false;
    },
    //退出群聊
    async deleteGroup() {
      if (!this.checkObject.group) {
        return;
      }
      var deleteId = this.checkObject._id;
      //发送请求
      const res = await this.$http.put("/deleteGroup", {
        userId: this.user._id,
        groupId: deleteId,
      });
      if (!res) {
        return false;
      }
      this.$message.success(res.data);
      //本地删除
      this.groups.forEach((val, index) => {
        if (val._id === deleteId) {
          this.groups.splice(index, 1);
        }
      });
    },
    //鼠标右键事件
    oncontextmenu(item, index) {
      return (e) => {
        this.checkObject = item;
        this.oncontextmenuOff = true;
        const dom = this.$refs.oncontextmenu;
        dom.style.left = e.clientX + "px";
        dom.style.top = e.clientY + "px";
        e.stopPropagation();
        e.preventDefault();
      };
    },
    //初始化最近聊天列表
    initChatFriendMap() {
      for (let item of this.chatFriend) {
        this.chatFriendMap[item.id] = true;
      }
      // console.log(this.chatFriend,this.chatFriendMap);
    },
    //改变最近聊天列表
    changeChatFriend(item) {
      var id = item.id;
      //判断当前数组 存在 item
      if (this.chatFriendMap[id]) {
        // 将对象顺序调整到第一
        this.chatFriend.find((val, index) => {
          if (val.id == id) {
            this.chatFriend.splice(index, 1);
            this.chatFriend.unshift(item);
            return;
          }
        });
      } else {
        //添加到栈顶
        this.chatFriend.unshift(item);
        this.chatFriendMap[id] = true;
      }
      this.updateStorageChatFriend(this.chatFriend);
    },
    //本地存储最近聊天列表
    updateStorageChatFriend(data) {
      let chatWith = localStorage.getItem("chatWith");
      chatWith = JSON.parse(chatWith);
      let chatWithMe = chatWith[this.user.id];
      chatWithMe.chatFriend = data;
      chatWith = JSON.stringify(chatWith);
      localStorage.setItem("chatWith", chatWith);
    },
    //element 图片上传成功事件
    handleAvatarSuccess(res, file) {
      this.form.avatar = res;
    },
    //element 图片上传 限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //最新聊天列表 菜单
    oncontextmenuHistory(item, index) {
      return (e) => {
        this.checkObject = item;
        this.deleteHistoryKey = index;
        this.deleteChatHistory = true;
        const dom = this.$refs.deleteChatHistory;
        dom.style.left = e.clientX + "px";
        dom.style.top = e.clientY + "px";
        e.stopPropagation();
        e.preventDefault();
      };
    },
    //最新聊天列表 移除 对象
    deleteChatHistoryFn() {
      var item = this.chatFriend.splice(this.deleteHistoryKey, 1);
      this.unreadCount -= this.unReadMe[item[0].id];
      this.updateStorageChatFriend(this.chatFriend);
      this.deleteChatHistory = false;
    },
    //右键菜单事件 发送消息事件
    contextmenuChangeObject(property) {
      this.changeChatObject(this.checkObject);
      this[property] = false;
    },
    //分页
    currentChange(pageIndex) {
      this.pageIndex = pageIndex - 1;
    },
    //好友下线通知
    userLeave(data) {
      this.notify(this.friends, data, false);
    },
    //好友上线通知
    userBack(data) {
      this.notify(this.friends, data, true);
    },
    // 遍历好友数组改变好友状态
    notify(list, data, bool) {
      const h = this.$createElement;
      let message, title;
      if (bool) {
        title = "好友上线通知！";
        message = data.name + "上线了！";
      } else {
        title = "好友下线通知！";
        message = data.name + "下线了！";
      }

      this.$notify({
        title,
        message: h("i", { style: "color: teal" }, message),
      });
      list.find((user) => {
        if (user.id === data.id) {
          return (user.online = bool);
        }
      });
    },
    //客户端 断开连接事件
    disconnect() {
      this.$parent.user.online = false;
      console.log("client socket disconnect !");
    },
    //用户好友列表改变
    friendChange(data) {
      this.friends.push(data);
    },
    //移动端 聊天界面显示隐藏
    toggle_back() {
      if (this.mode != "mobile") {
        return;
      }
      this.$refs.right.classList.toggle("top");
    },
    //节流
    throttle(time, fn) {
      var example;
      return () => {
        if (example) {
          clearTimeout(example);
        }
        example = setTimeout(fn, time);
      };
    },
    //window 窗口大小变化
    resize() {
      if (window.innerWidth <= 500) {
        this.mode = "mobile";
      } else {
        this.mode = "computer";
      }
    },
    //安卓输入法 输入框上移
    input_focus() {
      if (this.mode != "mobile") {
        return;
      }
      const dom = this.$refs.chat_input;
      if (!dom) {
        return;
      }
      dom.setAttribute("style", "padding-bottom:80px !important");
    },
    //安卓输入法 输入框上移
    input_blur() {
      if (this.mode != "mobile") {
        return;
      }
      const dom = this.$refs.chat_input;
      if (!dom) {
        return;
      }
      dom.setAttribute("style", "padding-bottom:0");
    },
  },
  computed: {
    user() {
      return this.$parent.user;
    },
    chatObjectIndex() {
      if (this.chatObject) {
        return this.chatObject.id;
      }
      return -1;
    },
    userApplyNum() {
      if (!this.userApply) {
        return "";
      }
      var num = this.userApply.length;
      if (num < 1) {
        return "";
      }
      return num;
    },
    currPage() {
      return this.persions[this.pageIndex];
    },
  },
  created() {
    //表情初始化
    this.expression = expression;
  },
  mounted() {
    //初始化本地消息存储,每个账号的聊天记录
    //初始化Storage
    this.initStorage();
    //将所有聊天保存在内存中
    const chatWith = JSON.parse(localStorage.chatWith);
    this.chatWithMe = chatWith[this.user.id]; //此账号本地存储

    //初始化最近聊天数组
    if (!this.chatWithMe.chatFriend) {
      this.chatWithMe.chatFriend = [];
    }
    this.chatFriend = this.chatWithMe.chatFriend;
    this.initChatFriendMap();

    //消息提醒音乐
    this.ring = this.$refs.ring;
    this.system = this.$refs.system;
    //判断用户是否登录
    if (this.user.name) {
      //修改用户状态
      this.socket.emit("connection", {
        user: this.user,
        chatId: this.socket.id,
      });
      this.$parent.user.online = true;
      this.$parent.user.chatId = this.socket.id;
      //得到修改后数据
      this.update().then((data) => {
        this.$parent.user = data.data;
        this.userApply = this.user.apply;
        this.friends = this.user.friends;
      });
      //好友申请列表

      console.log(this.userApply === this.user.apply);
      //未读消息
      this.getUnReadMessage();
      //获取好友列表
      this.getFriends();
      //获取群聊列表
      this.getGroup();
      //收到消息
      this.socketEvent();

      // 节流
      this.resize();
      const fn = new this.throttle(100, this.resize);
      window.addEventListener("resize", fn);
    }
  },
  beforeDestroy() {
    //断开连接
    this.socket.emit("desconnect", this.id);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("../style/mobile_chat.css");
.main {
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
}
.active {
  color: green;
}
.left {
  width: 60px;
  height: 100%;
  background-color: #000000;
  color: white;
  text-align: center;
  font-size: 25px;
  padding-top: 90px;
  position: relative;
  flex-shrink: 0;
}
.left > p {
  margin-bottom: 15px;
  width: 100%;
  height: 60px;
  position: relative;
}

.left > p .num {
  position: absolute;
  display: inline-block;
  font-size: 15px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  right: 5px;
  top: -2px;
}
.left p .iconfont {
  font-size: 25px;
}
.left .myAvatar {
  position: absolute;
  bottom: 0;
}
.left .myAvatar::after {
  content: "";
  display: block;
  position: absolute;
  right: 4px;
  bottom: 0px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: greenyellow;
}
.left .online::after {
  background: red !important;
}
.left .online .img_avatar {
  filter: grayscale(100%);
}
.left .myAvatar img {
  height: 60px;
  border-radius: 50%;
  width: 60px;
}
.left .myAvatar:hover ~ .menu {
  display: block;
}
.menu:hover {
  display: block;
}
.menu {
  position: absolute;
  left: 60px;
  bottom: 0;
  display: none;
  font-size: 18px;
  color: black;
  width: 100px;
  border-right: 1px solid #ccc;
  background: white;
  z-index: 10;
}
.menu p {
  padding: 10px 0;
  border-top: 1px solid #ccc;
}
.menu p:hover {
  cursor: pointer;
  color: white;
  background: #666;
}
.friends {
  width: 300px;
  height: 100%;
  background-color: #e5e5e5;

  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.friends_list {
  flex-grow: 1;
}
.addressBook {
  flex-grow: 1;
  background: white;
}
.addressBook h4 {
  /* background: white; */
  font-weight: 200;
  font-size: 18px;
  padding: 10px 10px;
  border-bottom: 1px solid #ccc;
  text-indent: 2px;
}
.Grounp {
  background: white;
}
.Grounp > h4 {
  /* background: white; */
  font-weight: 200;
  font-size: 18px;
  padding: 10px 10px;
  border-bottom: 1px solid #ccc;
  text-indent: 2px;
}
.addressBook .item {
  padding: 10px 10px;
  transition: all 0.5s linear;
}
.addressBook .item div {
  height: 60px;
  float: left;
  margin-right: 15px;
  font-size: 18px;
  color: #666;
}
.addressBook .item .info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.addressBook .item .info p:last-of-type {
  font-size: 16px;
}
.addressBook .item:hover {
  background: #ccc;
}
.addressBook .active {
  background: #ccc;
}
.addressBook .item div img {
  height: 100%;
  width: 60px;
  border-radius: 50%;
  display: block;
  filter: grayscale(100%);
}
.addressBook .item::after {
  content: "";
  display: block;
  clear: both;
}
.friend_bottom {
  height: 40px;
  width: 100%;
  border: 1px solid #ccc;
  flex-shrink: 0;
  border-right: 0;
  background: white;
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.friend_bottom i {
  width: 25px;
  height: 25px;
  font-size: 25px;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 5px;
  border-radius: 50%;
  border: 1px solid white;
}
.friend_bottom i:hover {
  border: 1px solid #ccc;
}
.friends::-webkit-scrollbar {
  width: 1;
}
.right {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-width: 300px;
}

header {
  height: 90px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
  width: 100%;
  flex-shrink: 0;
  position: relative;
}

header .set {
  font-size: 20px;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
header .set:hover {
  color: #666;
  cursor: pointer;
}
header .name {
  line-height: 90px;
  font-size: 24px;
  color: black;
  text-indent: 50px;

  font-weight: 400;
}
.liner_ball {
  position: absolute;
  left: 50%;
  height: 40px;
  bottom: -40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.linner {
  flex-grow: 1;
  width: 1px;
  background: #ccc;
}
.ball {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: white;
  border: 1px solid #ccc;
  left: 50%;
  border-radius: 50%;
  flex-shrink: 0;
}
section {
  height: 100%;
  padding: 0 15px;
  background-color: #eeeeee;
  position: relative;
  overflow: hidden;
}
.group_userLists {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background: white;
  transition: all 0.5s linear;
  transform: translateX(100%);
  max-height: 100%;
}
.group_userLists .item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
  padding: 10px 10px;
}
.group_userLists .item img {
  border-radius: 50%;
  width:40px;
  height: 40px;
  margin-right: 5px;
  filter: grayscale(100%);
}
.online {
  filter: grayscale(0%) !important;
}

.group_userLists ._left {
  display: block;
  position: absolute;
  left: -40px;
  font-size: 40px;
  color: white;
  top: 50%;
  margin-top: -20px;
}
.userListsIshow {
  transform: translateX(0%);
}
.chat_input {
  height: 160px;
  border-top: 1px solid #ccc;
  flex-shrink: 0;
  padding: 10px 40px;
  position: relative;
  background: white;
}
.expression {
  width: 380px;
  height: 200px;
  position: absolute;
  top: -200px;
  font-size: 20px;
  left: 40px;
  background: white;
  border: 1px solid #ccc;
  padding: 10px 15px;
  user-select: none;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
.expression span {
  text-align: center;
  display: inline-block;
  padding: 5px 5px;
}
.expression span:hover {
  background: #ccc;
}

.friends_header {
  height: 90px;
  border-bottom: 1px solid #ccc;
  padding: 10px 10px;
  padding-bottom: 0;
  flex-shrink: 0;
}
.search_box {
  width: fit-content;
  margin: 20px auto;
  position: relative;
}
.search_box .iconAdd {
  float: none;
  width: 35px;
  height: 35px;
  display: inline-block;
  line-height: 35px;
  background-color: #ccc;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  margin-left: 5px;
}
.search_box .iconSearch {
  position: absolute;
  left: 10px;
  top: 8px;
}
.search_box input {
  float: left;
  height: 35px;
  outline: none;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  text-indent: 30px;
}
.ul li {
  height: 90px;
  width: 100%;
  padding: 10px 10px;
  padding-left: 80px;
  transition: all 0.4s;
}

.ul li::after {
  content: "";
  display: block;
  clear: both;
}
.ul .active {
  background: #ccc;
}
.ul li:hover {
  background: #ccc;
}
.ul li div {
  float: left;
}

.friends_list .avatar,
.Grounp .avatar {
  height: 100%;
  width: 70px;
  margin-left: -70px;
}
.friends_list .avatar img,
.Grounp .avatar img {
  width: 100%;
  height: 100%;
}
.message {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.message .name {
  font-size: 20px;
  display: flex;
  white-space: nowrap;
  justify-content: space-between;
}
.message .time {
  font-size: 13px;
  color: #666;
}

.message .text {
  display: flex;
  justify-content: space-between;
  height: 20px;
}
.message .text p {
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #666;
  overflow: hidden;
}
.message .text .unReadNum {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef3c3c;
  text-align: center;
  color: white;
  font-size: 11px;
  line-height: 20px;
  flex-shrink: 0;
}
.input {
  margin-top: 5px;
  width: 100%;
  height: 60px;
  border: none;
  outline: none;
  resize: none;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.1;
}
.send {
  padding: 5px 5px;
  float: right;
  font-size: 16px;
  color: #666;
  border: 1px solid #ccc;
  outline: none;
}

.send:hover {
  background-color: green;
  color: white;
}
.item i {
  font-size: 20px;
  margin: 0 8px;
}
.item i:first-child {
  margin-left: 0;
}
button:hover {
  cursor: pointer;
}
.chat_item {
  padding-top: 24px;
  display: flex;
  align-items: flex-start;
  position: relative;
}
.chat_item:first-of-type {
  margin-top: 15px;
}
.chat_item .time {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: #666;
}
.isMe {
  flex-direction: row-reverse;
}
.chat_item .avatar_box .chatAvatar {
  width: 70px;
  height: 70px;
  display: block;
}
.content {
  background: white;
  padding: 10px 10px;
  margin: 0 18px;
  position: relative;
  word-break: break-word;
  max-width: 60%;
  border-radius: 5px;
  white-space: pre-line;
}
.others {
  left: -10px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 10px solid white;
}

div .show {
  height: 100%;
}
div .shadow .translate {
  transform: translateY(0px);
}
.shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  display: flex;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  justify-content: center;
  align-items: center;
  z-index: 3;
}
.shadow .upload {
  width: 500px;
  height: 500px;
  background: white;
  transition: all 0.5s linear;
  transform: translateY(-20px);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 5px;
}
.upload .iFont img {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.upload .iFont img:hover {
  cursor: pointer;
}

.iFont {
  display: inline-block;
  width: 300px;
  height: 300px;
  position: relative;
  flex-shrink: 0;
}
.iFont .iconfont {
  font-size: 35px;
  line-height: 300px;
  cursor: pointer;
}
.upload button {
  margin-top: 20px;
  width: 100px;
  height: 30px;
  border: 1px solid #ccc;
}
.addPersion {
  width: 800px;
  background: white;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}
.addPersion .head {
  padding: 15px 20px 15px 20px;
  font-size: 16px;
  flex-grow: 0;
  /* border-bottom: 1px solid #ccc; */
  background: rgb(241, 240, 240);
}
.addPersion .search {
  display: flex;
  align-items: center;
  padding: 20px 20px;
  /* border-top:1px solid #ccc; ; */
  border-bottom: 1px solid #ccc;
  position: relative;
}

.addPersion .search > input {
  width: 20px;
  height: 20px;
  margin: 0 5px;
  flex-shrink: 0;
}
.addPersion .search > label {
  flex-shrink: 0;
  margin-right: 10px;
}
.addPersion .search > input:nth-of-type(2) {
  margin-left: 18px;
}
.addPersion_main {
  width: 100%;
  height: 350px;
  position: relative;
  padding: 15px 10px;
}
.addPersion_main .item {
  width: 30%;
  height: 60px;
  display: flex;
  overflow: hidden;
  margin: 10px 10px;
}
.addPersion_main .item img {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}
.addPersion_main::before {
  content: "用户查询结果";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 25px;
  position: absolute;
  padding: 5px 15px;
  background: white;
  font-size: 14px;
  color: #666;
  margin-top: -15px;
}
.group {
  position: absolute;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px 30px;
  background: white;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  display: none;
}
.off {
  transition: 0.5s all linear;
}
.title .show {
  transform: rotate(90deg);
}

.no {
  height: 0 !important;
  overflow: hidden;
}

.persion_info {
  width: 300px;
  height: 500px;
  border: 1px solid #ccc;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.oncontextmenu {
  position: absolute;
  width: 110px;
  border: 1px solid #ccc;
  background: #000000;
  color: white;
  border-radius: 3px;
  text-align: center;
  padding: 10px 0;
}
.oncontextmenu > p {
  padding: 10px 0;
}
.oncontextmenu > p:hover {
  color: aqua;
  cursor: pointer;
}
.dialog_box {
  text-align: center;
}
.dialog_box .img_box {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  margin: auto;
}
.dialog_box .img_box img {
  width: 150px;
  height: 150px;
  transition: all 0.5s linear;
}
.dialog_box .img_box img:hover {
  transform: scale(1.5);
  cursor: pointer;
}
.dialog_box p {
  margin-top: 15px;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  padding-left: 60px;
}
.section_text {
  position: absolute;
  top: 40%;
  left: 30%;
  color: #ccc;
  font-size: 30px;
}
.toogle_back {
  display: none;
}
.addPersion_main_box {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
</style>
