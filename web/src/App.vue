<template>
  <div id="app">
    <Login v-if="!user" />
    <Chat v-else />
  </div>
</template>

<script>
import Login from "./components/Login";
import Chat from "./components/Chat";
export default {
  name: "App",
  data() {
    return {
      user: null,
    };
  },
  methods: {
    //如果token存在，则获取用户，免登录
    async load() {
      if (localStorage.getItem("token")) {
        const res = await this.$http.get("/load");
        if (res) {
          this.user = res.data;
        }
      }
    },
    windowListen() {
      //监听浏览器关闭事件
      this.socket.emit("desconnect", this.user.id);
    },
    online() {
      console.log(navigator.onLine);
    },
    offline() {
      console.log(navigator.onLine);
    },
  },
  components: {
    Chat,
    Login,
  },
  mounted() {
    this.load();
    window.addEventListener("unload", this.windowListen);
    window.online = this.online;
    window.offline = this.offline;
    window.online();
    window.offline();
  },
  beforeDestroye() {
    window.removeEventListener("unload", this.windowListen);
    if(!this.user.id){return};
    this.socket.emit("desconnect", this.user.id);
  },
};
</script>

