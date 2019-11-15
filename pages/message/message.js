/*
 * @Date: 2019-08-09 16:40:53
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-12 20:39:42
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
      if (res.code == 1) {
        res.data.forEach(item => {
          item.msg = item.msg.replace(/\↵/g, '').replace(/\n/g, '')
          console.log(item.msg)
        })
        this.setData({
          messages: res.data
        })
      }
      // app.socket.send(this.data.$state.userInfo.id)
      app.socket.send({
        type: 'Bokemessage',
        data: {uid: this.data.$state.userInfo.id}
      })
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
    let msg = e.currentTarget.dataset.item
    if (msg.blog_is_delete) {
      wx.showModal({
        content: "该动态已删除!",
        showCancel: false,
        confirmColor: "#DF2020",
        success: res => {
          return
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/pDetail/pDetail?id=" + msg.blog_id
      })
    }
  }
})
