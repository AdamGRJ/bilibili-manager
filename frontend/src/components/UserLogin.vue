<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2>用户登录</h2>
      
      <div class="form-group">
        <label>用户名：</label>
        <input 
          v-model="username" 
          type="text"
          placeholder="请输入用户名"
          required
          :disabled="loading"
        >
      </div>

      <div class="form-group">
        <label>密码：</label>
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          required
          :disabled="loading"
        >
      </div>

      <button type="submit" :disabled="loading" class="login-btn">
        <span v-if="!loading">登 录</span>
        <span v-else>登录中...</span>
      </button>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserLogin', // 使用多单词组件名
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: null
    }
  },
  methods: {
    async login() {
      try {
        this.loading = true
        this.error = null

        const response = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password
        })

        // 登录成功处理
        localStorage.setItem('token', response.data.token)
        this.$router.push('/')
        
      } catch (error) {
        console.error('登录失败:', error)
        this.error = error.response?.data?.message || '登录失败，请检查用户名和密码'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.login-form {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #409eff;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.login-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.error-message {
  margin-top: 15px;
  color: #f56c6c;
  font-size: 14px;
  text-align: center;
}
</style>