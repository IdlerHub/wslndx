// pages/tableDetail/tableDetail.js
Page({
  data: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    colleted: false,
    avatarList: [1, 2, 3, 4],
    showServise: false
  },
  timer: '',
  onLoad: function (options) {
    this.leftTimer(1596020126);
    this.timer = setInterval(() => {
      this.leftTimer(1596020126);
    }, 1000);
  },
  onShow: function () {
    
  },
  onUnload() {
    clearInterval(this.timer);
  },
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {

  },
  leftTimer(timer) {
    var leftTime = (new Date(timer * 1000)) - (new Date()); //计算剩余的毫秒数 
    var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
    var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
    var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟 
    var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数 
    days = days;
    hours = this.checkTime(hours);
    minutes = this.checkTime(minutes);
    seconds = this.checkTime(seconds);
    let flag =
      days == "0" && seconds == "00" && hours == "00" && minutes == "00";
    if (flag) clearInterval(this.timer);
    this.setData({
      days,
      hours,
      minutes,
      seconds
    })
  },
  checkTime(i) {
    if(i < 0) {
      i = 0
    }
    return i < 10 ? '0' + i : i
  },
  collect() {
    if (this.data.colleted) {
      wx.showToast({
        icon: 'none',
        title: '已取消收藏',
      })
      this.setData({
        colleted: false
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '收藏成功',
      })
      this.setData({
        colleted: true
      })
    }

  },
  rightNow() {
    if (this.data.avatarList.length < 5) {
      wx.showModal({
        content: `再邀请${ 5 - this.data.avatarList.length}位好友就可以上课啦`,
        confirmColor: '#DF2020',
        cancelColor: '#999999',
      })
    } else {
      this.setData({
        showServise: true
      })
    }
  },
  showServise() {
    this.setData({
      showServise: false
    })
  }
})