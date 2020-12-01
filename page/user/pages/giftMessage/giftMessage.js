// pages/giftMessage/giftMessage.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getAddress: false,  //兑换地址卡片展示
    giftInfo: {}, //兑换礼品信息
    showModelCard: false,  //奖品规格兑换卡片
    skuId: 0, //兑换礼品规格的id
  },
  pageName: "积分商品详情",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (ops) {
    this.setData({
      totalPoints: ops.totalPoints,
    });
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      that.setData({
        gift: data.data,
      });
      wx.setNavigationBarTitle({
        title: data.data.title,
      });
    });
  },
  gift() {
    console.log("商品规格",this.data.gift)
    if (!this.data.gift.stock) {
      wx.showToast({
        title: "已经没货啦～",
        icon: "none",
        duration: 1500,
      });
    } else {
      if (this.data.totalPoints >= this.data.gift.need_points) {
        // let param = { gift_id: this.data.gift.id }
        let param = this.data.gift;
        if (this.data.gift.is_new == 1) {
          wx.showModal({
            title: "兑换提示",
            content: "新手专享只能兑换一次，是否选择该商品？?",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#999",
            confirmText: "确定兑换",
            confirmColor: "#df2020",
            success: (res) => {
              if (res.confirm) {
                if(param.is_sku == 1) {  //有配置规格
                  this.setData({
                    showModelCard: true,
                    giftInfo: param //礼品详情
                  })
                }else {
                  this.setData({
                    getAddress: true,
                    giftInfo: param
                  })
                }
              }
            },
          });
        } else {  //老用户
          wx.showModal({
            title: "兑换提示",
            content: "确定要兑换该物品吗?",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#000000",
            confirmText: "确定兑换",
            confirmColor: "#df2020",
            success: (res) => {
              if (res.confirm) {
                if(param.is_sku == 1) {  //有配置规格
                  this.setData({
                    showModelCard: true,
                    giftInfo: param
                  })
                }else {
                  this.setData({
                    getAddress: true,
                    giftInfo: param,
                  });
                }
              }
            },
          });
        }
      } else {
        wx.showToast({
          title: "您的学分不够兑换!",
          icon: "none",
          duration: 1500,
        });
      }
    }
  },
  setSkuId(e) {  //展示地址填写卡片
    //关闭当前卡片,显示地址卡片
    this.setData({
      showModelCard: false,
      getAddress: true,
      giftInfo: e.detail
    })
  },
  stockChange() {
    this.data.gift.stock--;
    this.setData({
      "gift.stock": this.data.gift.stock,
    });
  },
});
