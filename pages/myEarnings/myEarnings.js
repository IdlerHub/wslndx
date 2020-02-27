// pages/myEarnings/myEarnings.js
const app = getApp()

Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    let list = [
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '邀请新学员奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
    ]
    list.forEach(v => {
      v.time = app.util.formatTime(new Date(v.createtime * 1000))
    })
    this.setData({
      list
    })
    this.getList()
  },
  onReady: function () {
  },
  onShow: function () {
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
      // let list = res.data
      // list.forEach(item => {
      //   item.number2 = app.util.towTwice(item.prentice_count)
      //   item.money2 = app.util.towTwice(item.total_amount)
      // })
      // this.setData({
      //   list
      // })
    })
  }
})