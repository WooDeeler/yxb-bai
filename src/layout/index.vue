<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '210px'" class="sidebar-container">
      <div class="logo-container">
        <img src="/logo.png" alt="logo" class="logo-img">
        <span class="logo-text">研习宝后台</span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="$route.path"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          :unique-opened="true"
          :router="true"
          :collapse="isCollapse"
        >
          <template v-for="route in $router.options.routes" :key="route.path">
            <!-- 跳过登录页和没有children的路由 -->
            <template v-if="!route.hidden && route.children">
              <!-- 只有一个子路由时直接显示 -->
              <el-menu-item
                v-if="route.children.length === 1"
                :index="route.path === '/' ? '/' + route.children[0].path : route.path + '/' + route.children[0].path"
              >
                <el-icon><component :is="route.meta?.icon" /></el-icon>
                <template #title>{{ route.meta?.title || route.children[0].meta?.title }}</template>
              </el-menu-item>
              <!-- 多个子路由时显示分组 -->
              <el-sub-menu
                v-else
                :index="route.path"
              >
                <template #title>
                  <el-icon><component :is="route.meta?.icon" /></el-icon>
                  <span>{{ route.meta?.title }}</span>
                </template>
                <el-menu-item
                  v-for="child in route.children"
                  :key="child.path"
                  :index="route.path + '/' + child.path"
                >
                  {{ child.meta?.title }}
                </el-menu-item>
              </el-sub-menu>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <!-- 顶部导航栏 -->
      <el-header height="50px" class="header-container">
        <div class="header-left">
          <el-icon class="fold-btn" @click="toggleSidebar">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta?.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <span class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar" />
              <span class="username">{{ userInfo.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容区 -->
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { House, Folder, School, Document, Fold, Expand } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()

const userInfo = computed(() => store.getters.userInfo)
const isCollapse = ref(false)

const handleLogout = () => {
  store.dispatch('logout')
  router.push('/login')
}

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    z-index: 1001;
    height: 100vh;
  }
  
  .header-container {
    padding-left: 54px;
  }
  
  .logo-text {
    display: none;
  }
}

@media screen and (max-width: 480px) {
  .username {
    display: none;
  }
}
.layout-container {
  height: 100vh;
  width: 88vw;
  padding: 0;
  margin: 0;
}

.sidebar-container {
  background-color: #304156;
  transition: width 0.3s;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}

.logo-container {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: #2b2f3a;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.header-container {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.header-left {
  display: flex;
  align-items: center;
}

.fold-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 16px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.el-main {
  max-width: 100vw;
  overflow-x: auto;
  box-sizing: border-box;
}
</style>