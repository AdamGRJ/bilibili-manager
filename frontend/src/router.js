import Vue from 'vue'
import Router from 'vue-router'
import VideoDetail from './components/VideoDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: App },
    { path: '/video/:id', component: VideoDetail, props: true }
  ]
})