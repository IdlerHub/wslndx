/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-12 16:44:58
 */
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isRefreshing: false,
    my_score: 0,
    showGuide:true
  },
  onLoad() {},
  onShow() {
    // wx.hideHomeButton({
    //   successL: function () {
    //     console.log(2)
    //   },
    //   fail: function(res) {
    //     console.log(3)
    //   },
    //   complete: function () {
    //   console.log(1)
    // }})
    app.user.pointsinfo().then(res => {
      if (res.code == 1) {
        this.setData({
          my_score: res.data.mypoints
        })
      }
    })
    
  },
  onPullDownRefresh: function() {
    this.setData({
      isRefreshing: true
    })

    let timer = setTimeout(() => {
      this.setData({
        isRefreshing: false
      })
      wx.stopPullDownRefresh()
      clearTimeout(timer)
    }, 1000)
  },
  handleContact(e) {
    app.aldstat.sendEvent("个人中心联系客服按钮点击")
  },
  toScore() {
    wx.navigateTo({
      url: "/pages/score/score?type=index"
    })
    app.aldstat.sendEvent("个人中心积分兑换按钮点击")
  },
  toInvite() {
    wx.navigateTo({
      url: "/pages/invitation/invitation"
    })
    app.aldstat.sendEvent("个人中心邀请好友按钮点击")
  },
  //用于数据统计
  onUnload() {
    app.aldstat.sendEvent("退出", { name: "个人中心页" })
  },
  closeGuide() {
    let param = {
      guide_name: 'user'
    }
    app.user.guideRecordAdd(param).then(res => {
      if (res.code == 1) {
        app.getGuide()
      }
    })
  },
  drawPage() {
    app.aldstat.sendEvent("个人中心积分抽奖按钮点击")
  }
})
