# 图书管理系统-前端

使用了 `Vue.js` 和 `TypeScript` 编写。 
状态管理工具选择了 `pinia` 。
打包工具使用了 `Vite.js`， 采用前后端分离式方法。
UI 库选择了 `Element-UI Plus` 。

## 运行本地开发服务器
```bash
npm i # 安装依赖
npm run dev
```

## 编译 
```bash
npm run build
```

由于前后端分离，开发中向后端的请求使用了绝对路径的URL。
网络使用了 `mande`，一个 `fetch` 的 warpper。
如果想部署在 `8080` 以外的端口，修改所有的网络请求地址即可（即所有 `mande` 对象）
