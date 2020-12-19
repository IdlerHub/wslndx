/*
 * @Github: https://github.com/IdlerHub
 * @Author: zxk
 * @Date: 2020-06-18 14:51:42
 * @LastEditors: zxk
 * @LastEditTime: 2020-06-19 18:44:10
 */ 
// pages/webPay/webPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    let {
      timeStamp,
      nonceStr,
      packageInfo,
      signType,
      paySign,
      classId,
    } = JSON.parse(decodeURIComponent(options.wxPayOptions));
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: packageInfo,
      signType,
      paySign,
      success: (res) => {
        console.log("支付成功", classId);
        // prevPage.setData({
        //   payStatus: "success",
        //   classId: classId,
        // });
        wx.redirectTo({
          url: '/pages/education/education?classId='+classId,
        });
      },
      fail: (err) => {
        console.log("支付失败", classId);
        // prevPage.setData({
        //   payStatus: "fail",
        //   classId: classId,
        // });
        wx.redirectTo({
          url: '/pages/education/education?classId='+classId,
        });
      },
    });
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})