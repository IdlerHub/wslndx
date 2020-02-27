// pages/withdraw/withdraw.js
const app = getApp()
Page({
  data: {
    msgeList:[],
    windrawlist: [],
    toastMsg:{
      num: '',
      status: true
    },
    showToast:false
  },
  onLoad: function (options) {
    let msgeList = [
      {'msg':'用户张**提现50元'},
      {'msg':'用户张**提现50元'},
      {'msg':'用户张**提现50元'},
      {'msg':'用户张**提现50元'},
      {'msg':'用户张**提现50元'},
      {'msg':'用户张**提现50元'},
      {'msg':'用户张**提现50元'},
      {'msg':'用户张**提现50元'},
    ],
    windrawlist=['0.5','1','5','10','50','100']
    this.setData({
      msgeList,
      windrawlist,
    })
  },
  onShow: function () {
    this.getamount()
  },
  onHide() {
    this.setData({
      showToast: false
    })
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
  getamount() {
    app.tutor.extractAmountConfig().then(res => {
      if(res.code == 1) {
        this.setData({
          windrawlist: res.data,
          userMoney: this.data.$state.userInfo.amount
        })
      }
    })
  },
  withdraw(e) {
    let index = e.currentTarget.dataset.index
    if(Number(this.data.userMoney) >= Number(this.data.windrawlist[index].amount)) {
      let param = { amount: this.data.windrawlist[index].amount }
      app.tutor.extractFinance(param).then(res => {
        if(res.code == 1) {
          this.setData({
            showToast: true,
            ['toastMsg.num']: this.data.windrawlist[index].amount,
            ['toastMsg.status']: true
          })
        } else {

        }
      })
    } else {
      this.setData({
        showToast: true,
        ['toastMsg.num']: this.data.windrawlist[index].amount,
        ['toastMsg.status']: false
      })
    }
  },
  close() {
    this.setData({
      showToast: false
    })
  }
})