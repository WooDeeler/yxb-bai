<template>
  <div class="dashboard-container">
    <!-- 数据统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><Document /></el-icon>
              <span>新闻总数</span>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ stats.newsCount }}</div>
            <div class="label">篇</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><School /></el-icon>
              <span>院校总数</span>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ stats.schoolCount }}</div>
            <div class="label">所</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><Folder /></el-icon>
              <span>文件总数</span>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ stats.fileCount }}</div>
            <div class="label">个</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><Upload /></el-icon>
              <span>今日上传</span>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ stats.todayUpload }}</div>
            <div class="label">个</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统信息 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>系统信息</span>
            </div>
          </template>
          <div class="system-info">
            <div class="info-item">
              <span class="label">系统名称：</span>
              <span class="value">后台管理系统</span>
            </div>
            <div class="info-item">
              <span class="label">当前版本：</span>
              <span class="value">1.0.0</span>
            </div>
            <div class="info-item">
              <span class="label">开发框架：</span>
              <span class="value">Vue 3 + Element Plus</span>
            </div>
            <div class="info-item">
              <span class="label">服务器时间：</span>
              <span class="value">{{ currentTime }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>最新动态</span>
            </div>
          </template>
          <div class="news-list">
            <div v-for="item in latestNews" :key="item.id" class="news-item">
              <el-icon><InfoFilled /></el-icon>
              <span class="news-title">{{ item.title }}</span>
              <span class="news-time">{{ item.time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Document, School, Folder, Upload, InfoFilled } from '@element-plus/icons-vue'

// 统计数据
const stats = ref({
  newsCount: 0,
  schoolCount: 0,
  fileCount: 0,
  todayUpload: 0
})

// 当前时间
const currentTime = ref('')

// 最新动态
const latestNews = ref([
  { id: 1, title: '系统上线公告', time: '2025-04-20 10:00' },
  { id: 2, title: '新增院校管理功能', time: '2025-04-19 15:30' },
  { id: 3, title: '优化文件上传体验', time: '2025-04-18 14:20' },
  { id: 4, title: '新增新闻管理模块', time: '2025-04-17 09:45' },
  { id: 5, title: '系统性能优化完成', time: '2025-04-16 16:30' }
])

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}

// 获取统计数据
const getStats = () => {
  // 模拟数据，实际项目中应该从API获取
  stats.value = {
    newsCount: 56,
    schoolCount: 85,
    fileCount: 34,
    todayUpload: 2
  }
}

onMounted(() => {
  getStats()
  updateTime()
  // 每秒更新时间
  setInterval(updateTime, 1000)
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-card {
  .card-header {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 8px;
      font-size: 20px;
    }
  }
  .card-body {
    text-align: center;
    padding: 20px 0;
    .number {
      font-size: 36px;
      font-weight: bold;
      color: #409EFF;
    }
    .label {
      margin-top: 8px;
      color: #909399;
    }
  }
}

.system-info {
  .info-item {
    margin-bottom: 16px;
    .label {
      color: #909399;
      margin-right: 8px;
    }
    .value {
      color: #303133;
    }
  }
}

.news-list {
  .news-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #EBEEF5;
    &:last-child {
      border-bottom: none;
    }
    .el-icon {
      color: #409EFF;
      margin-right: 8px;
    }
    .news-title {
      flex: 1;
      margin-right: 16px;
    }
    .news-time {
      color: #909399;
      font-size: 12px;
    }
  }
}
</style>