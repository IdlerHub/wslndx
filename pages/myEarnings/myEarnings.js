// pages/myEarnings/myEarnings.js
const app = getApp()

Page({
  data: {
    list: []
  },
  pageName: '邀请学员我的收益页',
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
      return app.withdrawShare(ops)
    }
  },
  getList() {
    app.tutor.amountList().then(res => {
      let list = res.data.amount_list
      list.forEach(item => {
        item.amount = Number(item.amount).toFixed(2)
      })
      this.setData({
        list
      })
      app.store.setState({
        ['userInfo.amount']: Number(res.data.total_amount).toFixed(2)
      })
    })
  }
})