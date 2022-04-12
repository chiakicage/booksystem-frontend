<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
import BookSearch from './components/BookSearch.vue'
import BorrowManage from './components/BorrowManage.vue'
import BookManage from './components/BookManage.vue'
import UserManage from './components/UserManage.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from './store/userStore'
import { useBookStore } from './store/bookStore'
import { useBorrowStore } from './store/borrowStore'
import { useUserManageStore } from './store/userManageStore'
import 'element-plus/theme-chalk/el-message.css'

import { ref, watch, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { ElMessage } from 'element-plus'
import SimpleIconVite from './components/icon/SimpleIconVite.vue'
import MdiVuejs from './components/icon/MdiVuejs.vue'
import CarbonLogoGithub from './components/icon/CarbonLogoGithub.vue'

const bookStore = useBookStore()
const borrowStore = useBorrowStore()
const userManageStore = useUserManageStore()
const activeName = ref('book')
watch(activeName, (val) => {
  localStorage.setItem('activeName', val)
  if (val === 'book') 
    bookStore.getbooks()
  else if (val === 'borrow')
    borrowStore.getborrows()
  else if (val === 'users')
    userManageStore.getusers()
})
onMounted(async () => {
  await userStore.check()
  if (userStore.logined) {
    if (localStorage.getItem('activeName')) {
      activeName.value = localStorage.getItem('activeName') as string
    }
  } else {
    localStorage.removeItem('activeName')
  }
  await bookStore.getbooks()
  await borrowStore.getborrows()
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}


const userStore = useUserStore()
const loginDialog = ref(false)
const number = ref('')
const passwd = ref('')
const login = async () => {
  const res = await userStore.login(number.value, passwd.value)
  if (res.code === 0) {
    loginDialog.value = false
    number.value = ''
    passwd.value = ''
    ElMessage({
      type: 'success',
      message: res.message,
      duration: 1000
    })
  } else {
    ElMessage({
      type: 'error',
      message: res.message,
      duration: 1000
    })
  }
}
const logout = async () => {
  const res = await userStore.logout()
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: res.message,
      duration: 1000
    })
    activeName.value = 'book'
  } else {
    ElMessage({
      type: 'error',
      message: res.message,
      duration: 1000
    })
  }
}

const infoDialog = ref(false)

const handleCommand = (command: 'login' | 'logout' | 'info') => {
  switch (command) {
    case 'login':
      loginDialog.value = true
      break;

    case 'logout':
      logout()
      break;
    case 'info':
      infoDialog.value = true
      break;
  }

}

</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <el-dialog v-model="loginDialog" title="登录" width="40%" center :show-close="false">
    <el-input v-model="number" placeholder="借书证号" class="login-input" size="large"></el-input>
    <el-input
      v-model="passwd"
      placeholder="密码"
      type="password"
      class="login-input"
      size="large"
      @keyup.enter="login"
    ></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="loginDialog = false">取消</el-button>
        <el-button type="primary" @click="login">登录</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="infoDialog" title="个人信息" width="30%" center>
    <el-descriptions :column="2">
      <el-descriptions-item label="借书证号">{{ userStore.number }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{ userStore.name }}</el-descriptions-item>
      <el-descriptions-item label="部门">{{ userStore.department }}</el-descriptions-item>
      <el-descriptions-item label="角色">
        <el-tag size="small">{{ userStore.type }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
  <el-container class="main-container">
    <el-header height="50px">
      <!-- <div style="width: 50px; display: flex;"> Name </div> -->
      <el-row justify="end" :align="'bottom'">
        <el-col :span="4" class="user-menu">
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="trigger">
              <div>{{ userStore.name }}</div>
              <el-icon style="height: 100%;">
                <arrow-down />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="!userStore.logined" command="login">登录</el-dropdown-item>
                <el-dropdown-item v-if="userStore.logined" command="info">个人信息</el-dropdown-item>
                <el-dropdown-item v-if="userStore.logined" command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        type="border-card"
        tab-position="left"
        class="tabs-main"
      >
        <el-tab-pane label="馆藏查询" name="book">
          <BookSearch></BookSearch>
        </el-tab-pane>
        <el-tab-pane label="借阅查询" name="borrow" v-if="userStore.logined">
          <BorrowManage></BorrowManage>
        </el-tab-pane>
        <el-tab-pane
          label="图书入库"
          name="addbook"
          v-if="userStore.logined && userStore.type === 'admin'"
        ><BookManage></BookManage></el-tab-pane>
        <el-tab-pane
          label="用户管理"
          name="users"
          v-if="userStore.logined && userStore.type === 'admin'"
        ><UserManage></UserManage></el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer height="50px" style="color:grey; font-size: 12px; ">
      <el-row style="display: flex; justify-content: center; text-align: center; width: 100%;">
        <div style="margin: 10px 0;">Designed by ckq@3200105435</div>

      </el-row>
      <el-icon :size="20" style="margin: 0 10px;"><CarbonLogoGithub class="m-1"/></el-icon>
      
      <el-icon :size="20" style="margin: 0 10px;"><SimpleIconVite class="m-1"/></el-icon>
      <el-icon :size="20" style="margin: 0 10px;"><MdiVuejs class="m-1"/></el-icon>
    </el-footer>
  </el-container>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-container {
  width: 80vw;
  margin: 0 auto;
  height: 95vh;
}
.main-container > .el-header {
  background-color: #b4c5e3;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.main-container > .el-main {
  padding: 0;
}
.tabs-main {
  height: 90%;
}
.tabs-main > .el-tabs__content {
  padding: 0px;
  height: 100%;
}
.tabs-main .el-tab-pane {
  height: 100%;
}
.el-tabs__header.is-left {
  margin-right: 0px;
  width: 100px;
}
.user-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.trigger {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.login-input {
  margin: 10px auto;
  height: 50%;
}
.m-1 {
  margin: 0 10px;
  
  color: grey
}
</style>
