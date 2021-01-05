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
      packageValue,
      signType,
      paySign,
      openUrl,
    } = JSON.parse(decodeURIComponent(options.wxPayOptions));
    console.log(1111,JSON.parse(decodeURIComponent(options.wxPayOptions)))
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: packageValue,
      signType,
      paySign,
      success: (res) => {
        console.log("支付成功", openUrl);
        // prevPage.setData({
        //   payStatus: "success",
        //   classId: classId,
        // });
        wx.redirectTo({
          url: '/pages/education/education?type=0&login=1&url=' + openUrl,
        });
      },
      fail: (err) => {
        console.log("支付失败", openUrl);
        // prevPage.setData({
        //   payStatus: "fail",
        //   classId: classId,
        // });
        wx.redirectTo({
          url: '/pages/education/education?type=webpay&login=1&url=' + encodeURIComponent(openUrl),
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})