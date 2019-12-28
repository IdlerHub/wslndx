// pages/messagePage/messagePage.js
Page({
  data: {

  },
  onLoad: function (options) {
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        message: data.data
      })
      wx.setNavigationBarTitle({
        title: data.data.title
      })
    })
  },


})