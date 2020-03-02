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
  pageName: '邀请收学员金额提现页',
  onLoad: function (options) {
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
    app.tutor.totalExtractAmount().then(res => {
      if(res.code == 1) {
        this.setData({
          msgeList: res.data
        })
      }
    })
  },
  withdraw(e) {
    let index = e.currentTarget.dataset.index
    if(Number(this.data.$state.userInfo.amount) >= Number(this.data.windrawlist[index].amount)) {
      let param = { amount: this.data.windrawlist[index].amount }
      app.tutor.extractFinance(param).then(res => {
        if(res.code == 1) {
          let amount = this.data.$state.userInfo.amount - this.data.windrawlist[index].amount
          app.store.setState({
            ['userInfo.amount']:  [Number(amount).toFixed(2)]
          })
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