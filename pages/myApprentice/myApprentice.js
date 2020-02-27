// pages/myApprentice/myApprentice.js
const app = getApp()
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    let list = []
    app.tutor.prenticePointsList().then(res =>{
      if(res.code == 1) {
        res.data.forEach(item => {
          item.number = app.util.towTwice(item.total_points)
        });
        list = res.data
        this.setData({
          list
        })
      }
    })
  },
  onShow: function () {},
  onUnload: function () {},
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      return app.withdrawShare(ops)
    }
  },
})