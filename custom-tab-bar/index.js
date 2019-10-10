// components/navBar/navBar.js
const app = getApp()
Component({
  // properties: {
  //   path: {
  //     type: String,//类型
  //     value: ''//默认值
  //   }
  // },
  data: {
    selected: 'index'
  },
  methods: {
    toIndex() {
      app.tabBar('index')
      wx.switchTab({ url: "/pages/index/index" })
      this.setData({
        selected: 'index'
      })
    },
    toVideo() {
      app.tabBar('video')
      wx.switchTab({ url: "/pages/video/video" })
      this.setData({
        selected: 'video'
      })
    },
    toPost() {
      app.tabBar('post')
        wx.switchTab({ url: "/pages/post/post" })
      
    },
    toUser() {
      app.tabBar('user')
        wx.switchTab({ url: "/pages/user/user" })
    },
    // 用户昵称等信息授权
    onGotUserInfo(e) {
      if (e.detail.errMsg === "getUserInfo:ok") {
        app.updateBase(e)
        if (e.currentTarget.dataset.role == "user") {
          this.toUser()
        } else if (e.currentTarget.dataset.role == "post") {
          this.toPost()
        } else {
          this.toEducation()
        }
      }
    },
  }
  
})