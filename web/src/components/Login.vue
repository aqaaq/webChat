<template>
  <div class="main">
    <form class="form" @submit.prevent="submit" ref="form">
      <div class="input_box">
        <label class="title">
          L <strong>o</strong> g <strong>i</strong> n
        </label>

        <div class="item">
          <label>用户名 :</label><input type="text" v-model="model.name" />
        </div>
        <div class="item">
          <label>密码 :</label
          ><input type="password" v-model="model.password" />
        </div>
        <div class="item" v-show="mode === 'login'">
          <label>验证码 :</label>
          <div class="code_">
            <input class="code" type="text" v-model="str" />
            <div>
              <canvas id="text_code" @click="clearCanvas"></canvas>
            </div>
          </div>
        </div>
        <div class="checkbox_"><input type="checkbox" /> 记住密码</div>
        <div class="item">
          <button class="btn" type="submit" v-show="mode === 'login'">
            登录
          </button>
          <button class="btn" type="submit" v-show="mode === 'register'">
            注册
          </button>
        </div>
        <span
          class="register"
          @click="mode = 'register'"
          v-show="mode == 'login'"
          >立即注册</span
        >
        <span
          class="register"
          @click="mode = 'login'"
          v-show="mode == 'register'"
        >
          立即登录
        </span>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nums: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      colors: ["red", "green", "black", "blue", "white", "black", "orange"],
      end: 23,
      currStr: "",
      ctx: null,
      str: "",
      model: {
        name: "",
        password: "123",
      },
      mode: "login",
    };
  },
  methods: {
    //canvas 重新绘图
    clearCanvas(ctx) {
      ctx = this.ctx;
      ctx.clearRect(0, 0, 180, 45);
      let str = "";
      for (let i = 0; i <= 3; i++) {
        let num = Math.round(Math.random() * 9 - 0),
          start = i * 20 + 15,
          end = Math.random() * 12 + 20;
        str += num;
        ctx.strokeStyle = this.colors[num];
        ctx.strokeText(num, start, end);
      }
      this.currStr = str;
    },
    //注册or登录
    async submit(e) {
      e.preventDefault();
      //验证码验证
      if (!this.model.name.trim() || !this.model.password.trim()) {
        return confirm("账号密码不能为空！");
      }
      let res;
      if (this.mode === "login") {
        // if (this.str != this.currStr) {
        //   return confirm("验证码错误！");
        // }
        res = await this.$http.post("/login", this.model);
        if (res) {
          const h = this.$createElement;
          this.$parent.user = res.data.user;
          //this.$parent.user = res.data.user;
          this.$notify({
            title: "登录成功！",
            message: h(
              "i",
              { style: "color: teal" },
              "欢迎，" + res.data.user.name
            ),
          });
          localStorage.setItem("token", res.data.token);
        }
      } else {
        const shadow = this.$loading({ target: this.$refs.form });
        const check = await this.$http.get(
          "/checkUserName/" + this.model.name.trim()
        );

        if (!check.data) {
          shadow.close();
          return this.$message.error("该用户已注册！");
        }
        res = await this.$http.post("/register", this.model);
        if (res) {
          this.$message.success("注册成功！");
          this.mode = "login";
          shadow.close();
        } else {
          shadow.close();
        }
      }
    },
  },
  mounted() {
    const text_code = document.getElementById("text_code");
    text_code.height = "45";
    text_code.width = "140";
    const ctx = text_code.getContext("2d");
    this.ctx = ctx;
    ctx.font = "24px bold";
    ctx.strokeStyle = "aqua";
    this.clearCanvas();
  },
};
</script>


<style scoped>
/*  */
@import url("../style/main.css");
/* /* 移动端 */
@import url("../style/mobile.css");
body,
div,
form,
input {
  box-sizing: border-box;
}
.form {
  text-align: center;
  position: relative;
  background: url(../assets/img/mask.png);
  background-size: 100% 100%;

  border-radius: 10px;
}
.form:hover .input_box .title strong:nth-of-type(1) {
  transform: rotate(360deg);
}

.form:hover .input_box .title strong:nth-of-type(2) {
  transform: rotate(-360deg);
}
.item input {
  background-color: #a4a4a4;
  border-radius: 5px;
  outline: none;
  background: transparent;
  color: white;
  letter-spacing: 1.3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  height: 45px;
  text-indent: 10px;
}
.input_box input:focus {
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1) inset,
    0 2px 7px 0 rgba(0, 0, 0, 0.2);
}
body {
  margin: 0;
  padding: 0;
}


</style>