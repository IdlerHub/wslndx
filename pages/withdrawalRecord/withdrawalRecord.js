// pages/withdrawalRecord/withdrawalRecord.js
const app = getApp()
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    app.tutor.extractAmount().then(res => {
      if(res.code == 1) {
        let list = res.data
        list.forEach(item => {
          item.amount = Number(item.amount).toFixed(2)
        })
        this.setData({
          list
        })
      }
    })
  },
  onShow: function () {
  },
  onShareAppMessage: function () {
  }
})