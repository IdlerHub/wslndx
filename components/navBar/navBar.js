const Tutor = require("../../data/Tutor")

// components/navBar/navBar.js
const app = getApp()
Component({
  properties: {
    path: {
      type: String, //类型
      value: '' //默认值
    }
  },
  ready() {
    this.checkstatus = 1
  },
  methods: {
    loginStauts(e) {
      if (!this.data.$state.userInfo.id) {
        app.changeLoginstatus()
        app.checknextTap(e)
        return true
      }
    },
    toIndex(e) {
      if (this.data.path == 'index' || !this.checkstatus) {
        return
      } else {
        this.checkstatus = 0
        wx.switchTab({
          url: "/pages/index/index",
          success: () => {
            this.checkstatus = 1
          }
        })
        this.hideIndex()
      }
    },
    toVideo(e) {
      // if (this.loginStauts(e)) return
      console.log(this.checkstatus)
      if (this.data.path == 'video' || !this.checkstatus) {
        return
      } else {
        this.checkstatus = 0
        wx.switchTab({
          url: "/pages/studyCenter/studyCenter",
          success: () => {
            this.checkstatus = 1
          }
        })
        this.hideIndex()
      }
    },
    toPost(e) {
      if (this.data.path == 'post' || !this.checkstatus) {
        return
      } else {
        this.checkstatus = 0
        wx.switchTab({
          url: "/pages/post/post",
          success: () => {
            this.checkstatus = 1
          }
        })
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
    toUser(e) {
      if (this.data.path == 'user' || !this.checkstatus) {
        return
      } else {
        this.checkstatus = 0
        wx.switchTab({
          url: "/pages/user/user",
          success: () => {
            this.checkstatus = 1
          }
        })
      }
    },
    // 用户昵称等信息授权
    onGotUserInfo(e) {
      console.log(this.checkstatus)
      if(!this.checkstatus) return
      wx.getUserProfile({
        desc: '请授权您的个人信息便于更新资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          app.updateBase(res)
          if (e.currentTarget.dataset.role == "user") {
            this.toUser()
          } else if (e.currentTarget.dataset.role == "post") {
            this.toPost()
          } else {
            this.toEducation()
          }
        },
        fail:() => {
          this.checkstatus = 1
        }
      })
    },
  }

})