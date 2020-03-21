/*
 * @Date: 2020-03-05 18:28:01
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 13:44:22
 */
// pages/winPrize/winPrize.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    giftInfo: {},
    getAddress: false,
    prizeList: [],
    duijiang: "兑奖",
    lingqu: "领取"
  },
  pageName: "中奖记录",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getprizeList();
  },
  getprizeList() {
    app.lottery.prizeList().then(res => {
      this.setData({
        prizeList: res.data
      });
    });
  },
  changeItem(e){
    console.log("触发事件 ",e)
    let prizeList = this.data.prizeList;
    prizeList.forEach(item => {
      item.id == e.detail.id ? (item.is_finish = 1) : "";
    });
    this.setData({
      prizeList
    });
  },
  // 领取奖品
  conversion(e) {
    //get_type == 1 实物品  || 2 积分,无需填写地址
    if (e.currentTarget.dataset.finish !== 0) return;
    console.log("meicuo", e.currentTarget.dataset)
    let param = {
      id: e.currentTarget.dataset.id,
      get_type: e.currentTarget.dataset.type
    };
    if (param.get_type == 2){
      console.log("我是积分呀")
      app.lottery
        .finishGetPrize(param)
        .then(res => {
          let prizeList = this.data.prizeList;
          prizeList.forEach(item => {
            item.id == e.currentTarget.dataset.id ? (item.is_finish = 1) : "";
          });
          this.setData({
            prizeList
          });
          wx.showToast({
            title: "领取成功",
            icon: "none",
            duration: 2000
          });
        })
        .catch(res => {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    }else if(param.get_type == 1){
      param['from'] = "winPrize";
      this.setData({
        getAddress: true,
        giftInfo: param
      })
    }
  }
});
