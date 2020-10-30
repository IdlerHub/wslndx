// page/live/pages/liveVideo/liveVideo.js
const app = getApp()
import TIM from 'tim-wx-sdk'
Page({
  data: {
    topT: 28,
    talkList: [],
    close: 0
  },
  onLoad: function () {
    let systemInfo = wx.getSystemInfoSync()
    systemInfo.statusBarHeight < 30 ?
    this.setData({
      topT: systemInfo.statusBarHeight + 4
    }) :
    this.setData({
      topT: systemInfo.statusBarHeight
    });
    let talkList = [
      {
        name: '李思:  ',
        content: '交互往上消失'
      },
      {
        name: '李思:  ',
        content: '交互往上消失'
      },
      {
        name: '我爱割韭菜:  ',
        content: '好的，等待开始'
      },
      {
        name: '李思:  ',
        content: '老师讲的这个要点非常好！'
      },
      {
        name: '李思:  ',
        content: '分享了课程',
        share: 1
      },
      {
        name: '李思:  ',
        content: '讲得很棒！',
        fromApp: 1
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
    return {
      imageUrl: "../../../../images/sharemessage.jpg",
      title: '案件大会的恢复',
      path: "/page/live/pages/liveVideo/liveVideo?id=" +
        123 +
        "&type=share&uid=" +
        this.data.$state.userInfo.id
    };
  },
  back() {
    let pages = getCurrentPages()
    console.log(pages)
    if(pages.length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  checkCaption() {
    this.setData({
      close: !this.data.close
    })
  }
})