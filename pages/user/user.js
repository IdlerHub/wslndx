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
    my_score: 0
  },
  onLoad() {},
  onShow() {
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
  handleContact(e) {},
  toScore() {
    wx.navigateTo({
      url: "/pages/score/score?type=index"
    })
  },
  //用于数据统计
  onUnload() {
    app.aldstat.sendEvent("退出", { name: "个人中心页" })
  }
})
