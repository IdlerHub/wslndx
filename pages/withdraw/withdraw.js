// pages/withdraw/withdraw.js
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
    windrawlist=['0.5','1','5','10','50','100'],
    userMoney = 40
    this.setData({
      msgeList,
      windrawlist,
      userMoney
    })
  },
  onReady: function () {

  },
  onShow: function () {

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
      return {
        title: this.data.$state.shareTitle || "福利！老年大学十万集免费课程在线学习",
        path: "/pages/loading/loading?uid=" + this.data.$state.userInfo.id + "&type=invite",
        imageUrl: this.data.$state.shareImgurl || "../../images/sharemessage.jpg"
      }
    }
  },
  withdraw(e) {
    let index = e.currentTarget.dataset.index
    if(Number(this.data.userMoney) >= Number(this.data.windrawlist[index])) {
      this.setData({
        showToast: true,
        ['toastMsg.num']: this.data.windrawlist[index],
        ['toastMsg.status']: true
      })
    } else {
      this.setData({
        showToast: true,
        ['toastMsg.num']: this.data.windrawlist[index],
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