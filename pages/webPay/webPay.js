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
      lesson,
    } = JSON.parse(decodeURIComponent(options.wxPayOptions));
    console.log(1111, JSON.parse(decodeURIComponent(options.wxPayOptions)), lesson)
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: packageValue,
      signType,
      paySign,
      success: (res) => {
        console.log("支付成功", openUrl, lesson);
        if (lesson && lesson != '') {
          wx.showToast({
            title: '学习卡购买成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: `/pages/education/education?type=webpay&login=1&url=${encodeURIComponent(openUrl)}/${lesson}`,
            });
          }, 1000)
        } else {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000
          })
          wx.redirectTo({
            url: '/pages/education/education?type=webpay&login=1&url=' + encodeURIComponent(openUrl),
          });
        }
      },
      fail: (err) => {
        console.log("支付失败", openUrl, lesson);
        if (lesson && lesson != '') {
          wx.showToast({
            title: '购买学习卡失败,请重试',
            icon: 'none',
            duration: 1000
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 0,
            })
          }, 1000)
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          })
          wx.redirectTo({
            url: '/pages/education/education?type=webpay&login=1&url=' + encodeURIComponent(openUrl),
          });
        }
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