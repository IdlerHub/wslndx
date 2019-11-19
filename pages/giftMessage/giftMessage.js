// pages/giftMessage/giftMessage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (ops) {
    let gift = JSON.parse(ops.content)
    wx.setNavigationBarTitle({
      title: gift.title
    })
    this.setData({
      gift,
      totalPoints: ops.totalPoints 
    })
  },
  gift() {
    if (!this.data.gift.stock) {
      wx.showToast({
        title: "已经没货啦～",
        icon: "none",
        duration: 1500
      })
    } else {
      if (this.data.totalPoints >= this.data.gift.need_points) {
        let param = { gift_id: this.data.gift.id }
        if (this.data.gift.is_new == 1) {
          wx.showModal({
            title: "兑换提示",
            content: "新手专享只能兑换一次，是否选择该商品？?",
            showCancel: true,
            cancelText: "暂时不换",
            cancelColor: "#999",
            confirmText: "确定兑换",
            confirmColor: "#df2020",
            success: res => {
              if (res.confirm) {
                app.user.exchange(param).then(res => {
                  if (res.code == 1) {
                    wx.navigateTo({
                      url: "/pages/gift/gift"
                    })
                  }
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: "兑换提示",
            content: "确定要兑换该物品吗?",
            showCancel: true,
            cancelText: "暂时不换",
            cancelColor: "#000000",
            confirmText: "确定兑换",
            confirmColor: "#df2020",
            success: res => {
              if (res.confirm) {
                app.user.exchange(param).then(res => {
                  if (res.code == 1) {
                    wx.navigateTo({
                      url: "/pages/gift/gift"
                    })
                  }
                })
              }
            }
          })
        }
        
      } else {
        wx.showToast({
          title: "您的积分不够兑换!",
          icon: "none",
          duration: 1500
        })
      }
    }
  },

})