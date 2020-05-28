// pages/tableDetail/tableDetail.js
Page({
  data: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    colleted: false
  },
  timer:'',
  onLoad: function (options) {

  },
  onShow: function () {
    this.leftTimer(1590650413)
    this.timer = setInterval(() => {
      this.leftTimer(1590650413)
    }, 1000);
  },
  onUnload() {
    clearInterval(this.timer)
  },
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {

  },
  leftTimer(timer) {
    var leftTime = (new Date(1593328939 * 1000)) - (new Date()); //计算剩余的毫秒数 
      var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
      var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
      var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
      var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
      days = days;
      hours = this.checkTime(hours);
      minutes = this.checkTime(minutes);
      seconds = this.checkTime(seconds);
      this.setData({
        days,
        hours,
        minutes,
        seconds
      })
  },
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  collect() {
    this.setData({
      colleted: true
    })
  }
})