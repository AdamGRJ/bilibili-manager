<template>
  <div class="container">
    <!-- 将标题和测试按钮移出循环 -->
    <h1>视频管理系统</h1>
    <button @click="test">测试请求</button>

    <!-- 视频列表 -->
    <div 
      v-for="(video, index) in top10" 
      :key="video.id" 
      class="video-item"
      @click="$router.push(`/video/${video.id}`)"
    >
      {{ index + 1 }}. {{ video.title }}
    </div>

    <!-- 路由视图 -->
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';
import UserLogin from './components/UserLogin.vue'

export default {
  data() {
    return {
      top10: [] // 添加数据初始化
    }
  },
  methods: {
    async test() {
      try {
        const res = await axios.get('/api/your-endpoint')
        alert(res.data)
      } catch (error) {
        console.error('请求失败:', error)
        alert('请求失败，请检查控制台')
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.video-item {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s;
}

.video-item:hover {
  background-color: #f5f5f5;
}
</style>