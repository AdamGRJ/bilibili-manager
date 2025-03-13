<template>
    <div class="detail-container">
      <button @click="$router.go(-1)">返回</button>
      
      <div class="video-header">
        <h1>{{ video.title }}</h1>
        <p class="author">作者：{{ video.author }}</p>
        <div class="metrics">
          <span>综合评分：{{ video.score.toFixed(1) }}</span>
          <button @click="toggleFavorite" :class="{ 'favorited': isFavorited }">
            {{ isFavorited ? '已收藏' : '收藏' }}
          </button>
        </div>
      </div>
  
      <!-- 趋势图容器 -->
      <div ref="trendChart" style="height: 400px; margin: 20px 0"></div>
  
      <!-- 详细数据表格 -->
      <div class="data-table">
        <div class="row header">
          <div>时间</div>
          <div>点赞</div>
          <div>收藏</div>
          <div>弹幕</div>
          <div>硬币</div>
        </div>
        <div class="row" v-for="item in history" :key="item.date">
          <div>{{ item.date }}</div>
          <div>{{ item.likes }}</div>
          <div>{{ item.collects }}</div>
          <div>{{ item.danmaku }}</div>
          <div>{{ item.coins }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import axios from 'axios';
  
  export default {
    props: ['videoId'],
    data() {
      return {
        video: {},
        history: [],
        chartInstance: null
      };
    },
    computed: {
      isFavorited() {
        return this.$store.state.favorites.includes(this.video.id);
      }
    },
    async mounted() {
      const res = await axios.get(`/api/video/${this.videoId}`);
      this.video = res.data.video;
      this.history = res.data.history;
      this.initChart();
    },
    methods: {
      initChart() {
        this.chartInstance = echarts.init(this.$refs.trendChart);
        const option = {
          tooltip: { trigger: 'axis' },
          legend: { data: ['点赞', '收藏', '弹幕', '硬币'] },
          xAxis: { type: 'category', data: this.history.map(h => h.date) },
          yAxis: { type: 'value' },
          series: [
            { name: '点赞', data: this.history.map(h => h.likes), type: 'line' },
            { name: '收藏', data: this.history.map(h => h.collects), type: 'line' },
            { name: '弹幕', data: this.history.map(h => h.danmaku), type: 'line' },
            { name: '硬币', data: this.history.map(h => h.coins), type: 'line' }
          ]
        };
        this.chartInstance.setOption(option);
      },
      async toggleFavorite() {
        await this.$store.dispatch('toggleFavorite', this.video.id);
      }
    },
    beforeUnmount() {  // Vue3 新生命周期
  if (this.chartInstance) {
    this.chartInstance.dispose();
  }
}
  };
  </script>
  
  <style scoped>
  .detail-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
  .data-table { margin-top: 30px; border: 1px solid #eee; }
  .row { display: grid; grid-template-columns: 1fr repeat(4, 0.8fr); padding: 10px; }
  .row.header { background: #f5f7fa; font-weight: bold; }
  </style>