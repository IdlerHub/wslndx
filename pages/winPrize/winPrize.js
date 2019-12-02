// pages/winPrize/winPrize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizeList:[],
    duijiang:'兑奖',
    lingqu:'领取'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getprizeList()
  },
  getprizeList() {
    app.lottery.prizeList().then(res => {
      if(res.code == 1) {
        this.setData({
          prizeList:res.data
        })
      }
    })
  },
  // 领取积分 
  conversion(e) {
    console.log(e)
    if (e.currentTarget.dataset.finish == 1) return
    let param = {
      id: e.currentTarget.dataset.id
    }
    app.lottery.finishGetPrize(param).then(res => {
      if(res.code == 1) {
        let prizeList = this.data.prizeList
        prizeList.forEach(item => {
          item.id == e.currentTarget.dataset.id ? item.is_finish = 1 : '' 
        })
        this.setData({
          prizeList
        })
        wx.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
})