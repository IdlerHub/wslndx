// page/live/pages/liveVideo/liveVideo.js
const app = getApp()
import TIM from 'tim-wx-sdk'
Page({
  data: {
    topT: 28,
    talkList: []
  },
  onLoad: function () {
    let systemInfo = wx.getSystemInfoSync()
    console.log(systemInfo.statusBarHeight)
    systemInfo.statusBarHeight < 30 ?
    this.setData({
      topT: systemInfo.statusBarHeight + 4
    }) :
    this.setData({
      topT: systemInfo.statusBarHeight
    });
    let talkList = [
      {
        name: '李思',
        content: '交互往上消失'
      },
      {
        name: '李思',
        content: '交互往上消失'
      },
      {
        name: '我爱割韭菜',
        content: '好的，等待开始'
      },
      {
        name: '李思',
        content: '老师讲的这个要点非常好！'
      },
    ]
    this.setData({
      talkList
    })
    // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
    let options = {
      SDKAppID: 1400442469 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
    };
    this.tim = TIM.create(options); // SDK 实例通常用 tim 表示
    // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
    this.tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
  },
  onShow: function () {
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onShareAppMessage: function () {

  },
  checkOrientation() {
    this.setData({
      orientation: 'horizontal'
    })
  },
  add() {
    let arr = this.data.talkList
    arr.push({name: '成都小燕子', content: '深刻理解还是发看见对方韩国可接受的和给快乐圣诞节高科技的是给看见对方韩国可接受对方和概括来讲都是废话给卢卡斯的积分'})
    this.setData({
      talkList: arr
    })
  }
})