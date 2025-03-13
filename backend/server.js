const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

// 数据库连接配置
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'bilibili'
});

app.get('/', (req, res) => {
  res.send('后端运行成功！');
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});

// server.js 添加以下配置
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8080' // 前端地址
}));

app.post('/api/login', async (req, res) => {
  const [users] = await pool.query(
    'SELECT * FROM users WHERE username = ?', 
    [req.body.username]
  );
  
  if (users.length === 0) {
    return res.status(401).json({ error: '用户不存在' });
  }
  
  res.json({ success: true });
});

// 新增路由
app.get('/api/video/:id', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    // 获取视频基本信息
    const [video] = await conn.query(`
      SELECT *, 
        (likes*0.4 + collects*0.3 + danmaku*0.1 + coins*0.2) AS score 
      FROM videos 
      WHERE id = ?
    `, [req.params.id]);

    // 获取历史数据（最近30天）
    const [history] = await conn.query(`
      SELECT 
        DATE(created_at) AS date,
        AVG(likes) AS likes,
        AVG(collects) AS collects,
        AVG(danmaku) AS danmaku,
        AVG(coins) AS coins
      FROM video_history
      WHERE video_id = ?
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [req.params.id]);

    conn.release();
    res.json({ video: video[0], history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 修改原有搜索接口，添加历史记录
app.post('/api/search', async (req, res) => {
  // ...原有代码...
  
  // 存储历史数据
  for (const video of videos) {
    // 获取视频ID
    const [existing] = await conn.query(
      'SELECT id FROM videos WHERE bvid = ?',
      [video.bvid]
    );
    
    if (existing[0]) {
      await conn.query(`
        INSERT INTO video_history 
        (video_id, likes, collects, danmaku, coins, comments)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [existing[0].id, video.like, video.collect, 
          video.danmaku, video.coin, video.comment]);
    }
  }
  
});