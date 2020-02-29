// pages/withdrawalRecord/withdrawalRecord.js
const app = getApp()
Page({
  data: {
    list:[]
  },
  pageName:'邀请收学员提现记录页',
  onLoad: function (options) {
    app.tutor.extractAmount().then(res => {
      if(res.code == 1) {
        let list = res.data
        list.forEach(item => {
          item.amount = Number(item.amount).toFixed(2).replace('-', '')
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