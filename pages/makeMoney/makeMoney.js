// pages/makeMoney/makeMoney.js
const app = getApp()
Page({
  data: {
    list: [],
    topMsg: {}
  },
  onLoad: function (options) {},
  onShow: function () {
    this.init()
  },
  onHide: function () {

  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      return app.withdrawShare(ops)
    }
  },
  init() {
    app.tutor.myIndex().then(res => {
      if (res.code == 1) {
        let topMsg = [{
            up: res.data.user_today_num,
            total: res.data.user_total_num
          },
          {
            up: res.data.user_today_amount,
            total: res.data.user_total_amount
          },
          {
            up: res.data.user_today_points,
            total: res.data.user_total_points
          }
        ]
        topMsg.forEach(item => {
          item.number2 = app.util.towTwice(item.total)
        })
        this.setData({
          topMsg
        })
      }
    })
    app.tutor.rankList().then(res => {
      if (res.code == 1) {
        let list = res.data
        list.forEach(item => {
          item.number2 = app.util.towTwice(item.prentice_count)
          item.money2 = app.util.towTwice(item.total_amount)
        })
        this.setData({
          list
        })
      }
    })
  }
})