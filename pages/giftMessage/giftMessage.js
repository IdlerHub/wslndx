// pages/giftMessage/giftMessage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getAddress: false,
    giftInfo: {}
  },
  pageName: '积分商品详情',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (ops) {
    this.setData({
      totalPoints: ops.totalPoints
    })
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        gift: data.data
      })
      wx.setNavigationBarTitle({
        title: data.data.title
      })
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
        // let param = { gift_id: this.data.gift.id }
        let param = this.data.gift
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
                this.setData({
                  getAddress: true,
                  giftInfo: param
                })

                // app.user.exchange(param).then(res => {
                //   wx.navigateTo({
                //     url: "/pages/gift/gift?name=" + this.data.gift.title + '&image=' + this.data.gift.image
                //   })
                // })
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
                this.setData({
                  getAddress: true,
                  giftInfo: param
                })

                // app.user.exchange(param).then(res => {
                //   wx.navigateTo({
                //     url: "/pages/gift/gift?name=" + this.data.gift.title + '&image=' + this.data.gift.image
                //   })
                // })
              }
            }
          })
        }

      } else {
        wx.showToast({
          title: "您的学分不够兑换!",
          icon: "none",
          duration: 1500
        })
      }
    }
  },

})