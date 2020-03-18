// pages/myApprentice/myApprentice.js
const app = getApp()
Page({
  data: {
    list: []
  },
  pageName: '邀请学员进贡分数列表页',
  onLoad: function (options) {
    let list = []
    app.tutor.prenticePointsList().then(res => {
      res.data.forEach(item => {
        item.number = app.util.towTwice(item.total_points)
      });
      list = res.data
      this.setData({
        list
      })
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      return app.withdrawShare(ops)
    }
  },
})