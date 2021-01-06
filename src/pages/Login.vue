
<template>
  <div>
    <img src="../assets/blue.png" style="height:560px;margin-left: 140px;margin-top: 100px;"></img>
    <i-form style="position: absolute;top:0px;left: 900px;" ref="formLogin" :model="formLogin" :rules="formLoginRules" class="card-box">
        <Form-item class="formLogin-title" style="    margin-bottom: 30px;">
          <img src="../assets/logo.png" alt="" style="position: relative;top: 1px;height:17px;display:inline-block"><h4 style="margin-left:10px;display:inline-block">金猫WMS</h4>
        </Form-item>

        <Form-item prop="username">
          <i-input size="large" type="text" v-model="formLogin.username" placeholder="用户名">
            
            <img style='width:15px' src="../assets/name.png" slot="prepend"></img>
          </i-input>
        </Form-item>
        <Form-item prop="password">
          <i-input size="large" type="password" v-model="formLogin.password" placeholder="密码">
            <!-- <Icon type="ios-lock-outline" slot="prepend"></Icon> -->
            <img style='width:15px' src="../assets/password.png" slot="prepend"></img>
          </i-input>
        </Form-item>
        <Form-item class="login-no-bottom">
          <Checkbox-group v-model="formLogin.remember">
            <Checkbox label="记住密码" name="remember"></Checkbox>
          </Checkbox-group>
        </Form-item>
        <Form-item class="login-no-bottom" style="margin-top: 50px;">
          <Row>
            <i-col :xs="{ span:12, offset: 5 }">
              <i-button class='loginBtn' style="width: 202px;height: 37px;" type="primary" @click="handleSubmit('formLogin')">登录</i-button>
            </i-col>
            <!-- <i-col :xs="{ span: 4, offset: 6 }">
              <i-button type="primary" @click="formLoginReset('formLogin')">重置</i-button>
            </i-col> -->
          </Row>
        </Form-item>
      </i-form>

    <div>
      
    </div>
  </div>
</template>
<script>
import {
  register
} from '../api/api';
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
      userToken:'',
      formLogin: {
        username: '',
        password: '',
        remember: []
      },
      formLoginRules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          // { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    handleSubmit (name) {
      
      this.$refs[name].validate((valid) => {
        localStorage.setItem('user', JSON.stringify(this.formLogin.username));
        if (valid) {
          let params = {
                captcha: "",
                password: this.formLogin.password,
                username: this.formLogin.username,
                uuid: ""
          };
        register(params).then((res) => {
          console.log(res)
             if(res.data.code==0){
               this.userToken = res.data.data.token;
          // 将用户token保存到vuex中
          this.changeLogin({ token: this.userToken });
          this.$router.push({ path: '/main' });
          this.$Message.success('登录成功!');

             }else{
               this.$Message.error(res.data.msg);
             }
        

        });
          
          
        } else {
          if(this.formLogin.password==''||this.formLogin.username==''){this.$Message.error('用户名或密码不能为空!');}
          else{
             this.$Message.error('登陆失败!');
          }
        }
        // if (this.formLogin.remember[0] == "记住密码") {
        //   localStorage.setItem('username', JSON.stringify(this.formLogin.username));
        //   localStorage.setItem('password', JSON.stringify(this.formLogin.password));
        // } else {
        //   localStorage.removeItem('username');
        //   localStorage.removeItem('password');
        // }
      })
    },
    formLoginReset (name) {
      this.$refs[name].resetFields();
    }
  },
  mounted () {
    

    if (localStorage.getItem('username')) {
      this.formLogin.username = JSON.parse(localStorage.getItem('username'));
    }
    if (localStorage.getItem('password')) {
      this.formLogin.password = JSON.parse(localStorage.getItem('password'));
    }
  }
}
</script>


<style scoped>
.card-box {
  padding: 30px;
  padding-top: 50px;
  padding-bottom: 50px;
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-bottom: 20px;
  background-color: #f9fafc;
  margin: 180px auto;
  width: 400px;
  /* border: 2px solid #8492A6;*/
}
.loginBtn{
  background-image: linear-gradient(40deg, 
		#3059ff 0%, 
		#5676fd 100%);
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.formLogin-title {
  text-align: center;
  font-size: 28px;
}
.formLogin-title h3 {
  font-size: 18px;
}
.login-no-bottom {
  margin-bottom: 10px;
}
</style>