// pages/myEarnings/myEarnings.js
const app = getApp()

Page({
  data: {
    list:[]
  },
  onLoad: function (options) { 
  },
  onShow: function () {
    this.getList()
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
  getList() {
    app.tutor.amountList().then(res => {
      if(res.code == 1) {
        let list = res.data.amount_list
        list.forEach(item => {
          item.amount = Number(item.amount).toFixed(2)
        })
        this.setData({
          list
        })
        app.store.setState({
          ['userInfo.amount']:  [Number(res.data.total_amount).toFixed(2)]
        })
      }
    })
  }
})