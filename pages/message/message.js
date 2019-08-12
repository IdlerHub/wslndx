/*
 * @Date: 2019-08-09 16:40:53
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-10 17:27:18
 */
// pages/message/message.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    messages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.circle.getMessage().then(res => {
      console.log(res)
      if (res.code == 1) {
        this.setData({
          messages: res.data
        })
      }
      app.socket.send(this.data.$state.userInfo.id)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  todetail(e) {
    wx.navigateTo({
      url: "/pages/pDetail/pDetail?id=" + e.currentTarget.dataset.item.blog_id
    })
  }
})
