<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 院校数据图表 -->
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><School /></el-icon>
              <span>院校数据分析</span>
            </div>
          </template>
          <div ref="schoolChartRef" class="chart"></div>
        </el-card>
      </el-col>
      
      <!-- 文件数据图表 -->
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><Folder /></el-icon>
              <span>文件数据分析</span>
            </div>
          </template>
          <div ref="fileChartRef" class="chart"></div>
        </el-card>
      </el-col>
      
      <!-- 新闻数据图表 -->
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><Document /></el-icon>
              <span>新闻数据分析</span>
            </div>
          </template>
          <div ref="newsChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统运行信息 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card shadow="hover" class="system-info-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><Monitor /></el-icon>
              <span>系统运行信息</span>
            </div>
          </template>
          <div class="system-info-content">
            <el-row :gutter="40">
              <el-col :span="8">
                <div class="info-item">
                  <div class="info-label">CPU使用率</div>
                  <div class="info-value">{{ cpuUsage }}%</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="info-item">
                  <div class="info-label">内存使用率</div>
                  <div class="info-value">{{ memoryUsage }}%</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="info-item">
                  <div class="info-label">系统时间</div>
                  <div class="info-value">{{ currentTime }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Document, School, Folder, Monitor } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 图表实例引用
const schoolChartRef = ref(null)
const fileChartRef = ref(null)
const newsChartRef = ref(null)

// 系统信息数据
const systemUptime = ref('0天0小时0分钟')
const cpuUsage = ref(0)
const memoryUsage = ref(0)
const currentTime = ref('')

// 更新系统运行时间
const startTime = Date.now()
const updateSystemUptime = () => {
  const now = Date.now()
  const diff = now - startTime
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  systemUptime.value = `${days}天${hours}小时${minutes}分钟`
}

// 更新系统信息
const updateSystemInfo = () => {
  // 模拟CPU和内存使用率
  cpuUsage.value = Math.floor(Math.random() * 30 + 10) // 40-70%之间
  memoryUsage.value = Math.floor(Math.random() * 20 + 25) // 50-70%之间
  currentTime.value = new Date().toLocaleString()
  updateSystemUptime()
}

// 定时器
let systemInfoTimer = null

// 图表实例
let schoolChart = null
let fileChart = null
let newsChart = null

// 模拟数据
const schoolData = {
  types: ['综合类', '理工类', '农林类', '师范类'],
  values: [30, 20, 15, 10]
}

const fileData = {
  months: ['-5', '-4', '-3', '-2', '上周', '本周'],
  uploads: [50, 53, 58, 65, 72, 80]
}

const newsData = {
  categories: ['教育动态', '招生信息', '学术活动', '其他'],
  counts: [25, 18, 15, 12]
}

// 初始化院校数据图表
const initSchoolChart = () => {
  schoolChart = echarts.init(schoolChartRef.value)
  schoolChart.setOption({
    title: {
      text: '院校类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: '65%',
      data: schoolData.types.map((type, index) => ({
        name: type,
        value: schoolData.values[index]
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })
}

// 初始化文件数据图表
const initFileChart = () => {
  fileChart = echarts.init(fileChartRef.value)
  fileChart.setOption({
    title: {
      text: '文件上传趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: fileData.months
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: fileData.uploads,
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  })
}

// 初始化新闻数据图表
const initNewsChart = () => {
  newsChart = echarts.init(newsChartRef.value)
  newsChart.setOption({
    title: {
      text: '新闻分类统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: newsData.categories,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: newsData.counts,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }]
  })
}

// 处理窗口大小变化
const handleResize = () => {
  schoolChart?.resize()
  fileChart?.resize()
  newsChart?.resize()
}

onMounted(() => {
  initSchoolChart()
  initFileChart()
  initNewsChart()
  window.addEventListener('resize', handleResize)
  
  // 初始化系统信息
  updateSystemInfo()
  // 每秒更新一次系统信息
  systemInfoTimer = setInterval(updateSystemInfo, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  schoolChart?.dispose()
  fileChart?.dispose()
  newsChart?.dispose()
  clearInterval(systemInfoTimer)
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.chart-card {
  .card-header {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 8px;
      font-size: 20px;
    }
  }
  .chart {
    height: 300px;
    margin: 20px 0;
  }
}

.system-info-card {
  .card-header {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 8px;
      font-size: 20px;
    }
  }
  .system-info-content {
    padding: 20px 0;
    .info-item {
      text-align: center;
      .info-label {
        color: #909399;
        font-size: 14px;
        margin-bottom: 8px;
      }
      .info-value {
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;
      }
    }
  }
}
</style>