// pages/makeMoney/makeMoney.js
const app = getApp()
Page({
  data: {
    list: [],
    topMsg: {},
    total_amount: 0
  },
  pageName: '学员邀请赚钱首页',
  onLoad: function (options) { },
  onShow: function () {
    this.init()
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      return app.withdrawShare(ops)
    }
  },
  init() {
    app.tutor.rankList().then(res => {
      let list = res.data
      list.forEach(item => {
        item.number2 = app.util.towTwice(item.prentice_count)
        item.money2 = app.util.tow(item.total_amount)
      })
      this.setData({
        list
      })
    })
    if(!this.data.$state.userInfo.id) return
    app.tutor.myIndex().then(res => {
      let topMsg = [{
        up: res.data.user_today_num,
        total: res.data.user_total_num
      },
      {
        up: Number(res.data.user_today_amount).toFixed(2),
        total: res.data.user_total_amount
      },
      {
        up: res.data.user_today_points,
        total: res.data.user_total_points
      }
      ]
      topMsg.forEach((item, index) => {
        index == 1 ? item.total = Number(item.total).toFixed(2) : ''
        item.number2 = app.util.towTwice(item.total)
      })
      this.setData({
        topMsg
      })
    })
    app.tutor.totalAmount().then(res => {
      res.total_amount = Number(res.data.total_amount).toFixed(2)
      this.setData({
        total_amount: res.total_amount
      })
    })
  },
})