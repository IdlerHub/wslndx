// components/navBar/navBar.js
const app = getApp()
Component({
  properties: {
    path: {
      type: String,//类型
      value: ''//默认值
    }
  },
  methods: {
    toIndex() {
      if(this.data.path == 'index') {
        return
      }else {
        // wx.redirectTo({
        //   url: "/pages/index/index"
        // })
        wx.switchTab({ url: "/pages/index/index" })
        this.hideIndex()
      }  
    },
    toVideo() {
      if (this.data.path == 'video') {
        return
      } else {
        // wx.redirectTo({
        //   url: "/pages/video/video"
        // })
        wx.switchTab({ url: "/pages/video/video" })
        this.hideIndex()
      }  
    },
    toPost() {
      if (this.data.path == 'post') {
        return
      } else {
        // wx.redirectTo({
        //   url: "/pages/post/post"
        // })
        wx.switchTab({ url: "/pages/post/post" })
        app.globalData.postShow = true
        this.hideIndex()
      }  
    },
    // 隐藏首页按钮
    hideIndex() {
      let pages = getCurrentPages()
      let prePage = pages[0]
      prePage.setData({
        vistor: false
      })
    },
    toUser() {
      if (this.data.path == 'user') {
        return
      } else {
        // wx.redirectTo({
        //   url:"/pages/user/user"
        // })
        wx.switchTab({ url: "/pages/user/user" })
      }  
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