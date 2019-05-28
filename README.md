小程序

## 1.npm init

## 2.npm i 包 -S

## 3.点击开发者工具中的菜单栏：工具 --> 构建 npm

    检查miniprogram_npm文件内文件夹列表是否和dependencies一致

## 4.发布前检测项

1. app.json 中的 debug 是否关闭;
2. app.js 中的 API_URL 是否需要切换服务器;
3. 在 ald-stat-conf.js 中的 app_key;
   正式版本的统计代码 appkey: 442eede02179d279dd26d2141592e071;
   测试版本的统计代码 appkey: 121282fed01baaebf0433fb3ea8a9b95;
4. 在 variables.scss 改变 background-image 图片根路径
5. store.js 中的 imgHost 切换服务器

<!--
todo:1 使用iconfont 替换 image
2.   tow添加‘万’字，其他使用到的去掉'万'字
3.  使用scss替换掉css
4. 使用 wxministore 提取所有的 页面统计函数  和授权函数
5. 使用 wxministore 共享 用户信息 和 授权状态 , baseInfo
6. 使用 wx.redirectTo 替换 wx.reLaunch

 -->
