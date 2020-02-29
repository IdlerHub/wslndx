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
    showGuide: true
  },
  pageName: '个人中心',
  onLoad() { },
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
    this.unreadNum()
  },
  onPullDownRefresh: function () {
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
    // app.aldstat.sendEvent("个人中心按钮点击",{
    //   name:'联系客服'
    // })
    wx.uma.trackEvent('personal_btnClick', { 'btnName': '联系客服' })
  },
  toScore() {
    wx.navigateTo({
      url: "/pages/score/score?type=index"
    })
    // app.aldstat.sendEvent("个人中心按钮点击",{
    //   name:'学分兑换'
    // })
    wx.uma.trackEvent('personal_btnClick', { 'btnName': '学分兑换' })
  },
  toInvite() {
    wx.navigateTo({
      url: "/pages/invitation/invitation"
    })
    // app.aldstat.sendEvent("个人中心按钮点击",{
    //   name:'邀请好友'
    // })
    wx.uma.trackEvent('personal_btnClick', { 'btnName': '邀请好友' })
  },
  //用于数据统计
  onUnload() {
    // app.aldstat.sendEvent("退出", { name: "学分抽奖" })
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
    // app.aldstat.sendEvent("个人中心按钮点击",{
    //   name:'学分抽奖'
    // })
    wx.uma.trackEvent('personal_btnClick', { 'btnName': '学分抽奖' })
  },
  unreadNum() {
    app.user.unreadNum().then(res => {
      if (res.code == 1) {
        this.setData({
          showMes: res.data.unread_count
        })
      }
    })
  }
})
