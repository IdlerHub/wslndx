// page/live/pages/liveVideo/liveVideo.js
const app = getApp()
import TIM from 'tim-wx-sdk'
Page({
  data: {
    topT: 28,
    talkList: [],
    close: 0,
    userInfo: {},
    lessonDetail: {},
    liveDetail: {},
    liveCount: {},
  },
  onLoad: function (ops) {
    this.liveOps = ops
    let systemInfo = wx.getSystemInfoSync()
    let talkList = [{
        name: '网上老年大学小助手：',
        content: '欢迎来到直播间：1、请自行调节手机音量至合适的状态。2、听众发言可以在讨论区进行查看。'
      }, {
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
    this.liveInit()
  },
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {
    this.quitGroup()
    wx.offKeyboardHeightChange()
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
  liveInit() {
    Promise.all([this.getTimSign(), this.getLiveBySpecialColumnId(this.liveOps.id), this.liveCount()]).then(values => {
      let options = {
        SDKAppID: this.data.$state.sdkAppid
      };
      this.tim = TIM.create(options);
      this.tim.setLogLevel(1);
      this.tim.on(TIM.EVENT.SDK_READY, (event) => {
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        this.joinGroup()
      });
      this.timLogin({
        uid: values[0].uid,
        userSig: values[0].userSig
      })
    })
  },
  getLiveBySpecialColumnId(id) {
    return app.liveData.getLiveBySpecialColumnId({
      specialColumnId: id
    }).then(res => {
      this.setData({
        lessonDetail: res.data
      })
      res.data.liverVOS.forEach(e => {
        e.id == this.liveOps.liveId ? this.setData({
          liveDetail: e
        }) : ''
      })
      return this.data.liveDetail
    })
  },
  getTimSign() {
    return app.liveData.getTimSign({}).then(res => {
      this.setData({
        userInfo: res.data
      })
      return res.data
    })
  },
  liveCount() {
    // app.liveData.liveCount({
    //   liveId: this.liveOps.liveId
    // }).then(res => {
    //   this.setData({
    //     liveCount: res.data.timToken
    //   })
    // })
  },
  checkCaption() {
    this.setData({
      close: !this.data.close
    })
  },
  timLogin(params) {
    this.tim.login({
      userID: String(params.uid),
      userSig: params.userSig
    }).then((imResponse) => {
      console.log(imResponse.data, '登录成功');
      if (imResponse.data.repeatLogin === true) {
        console.log(imResponse.data.errorInfo, '重复登录');
      }
    }).catch(function (imError) {
      console.warn('登录失败', imError); // 登录失败的相关信息
    });
  },
  timGetmessage(roomId) {
    this.tim.getMessageList({
      conversationID: `GROUP${roomId}`,
      count: 20
    }).then(function (imResponse) {
      const messageList = imResponse.data.messageList; // 消息列表。
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      console.log(messageList, nextReqMessageID, isCompleted, '消息会话')
    });
  },
  joinGroup() {
    this.tim.joinGroup({
      groupID: '1228794976',
      type: TIM.TYPES.GRP_MEETING
    }).then((imResponse) => {
      switch (imResponse.data.status) {
        case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
          break;
        case TIM.TYPES.JOIN_STATUS_SUCCESS:
          console.log(imResponse.data.group, '加群成功');
          this.timGetmessage('1228794976')
          break;
        case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:
          console.log("已入群")
          this.timGetmessage('1228794976')
          break;
        default:
          break;
      }
    }).catch(function (imError) {
      console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
    });
  },
  quitGroup() {
    this.tim.quitGroup('1228794976').then(function (imResponse) {
      console.log(imResponse.data.groupID, '退出成功的群'); // 退出成功的群 ID
    }).catch(function (imError) {
      console.warn('quitGroup error:', '退群失败'); // 退出群组失败的相关信息
    });
  },
  sendMsg(e) {
    console.log(e.detail)
    // 1. 创建文本消息
    let message =  this.tim.createTextMessage({
      to: '1228794976',
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        text: e.detail
      }
    });
    // 2. 发送消息
    this.tim.sendMessage(message).then(function(imResponse) {
      console.log(imResponse, '发送成功');
    }).catch(function(imError) {
      console.warn('发送失败', imError);
    });
  },
  getDates() { //JS获取当前周从星期一到星期天的日期
    const dateOfToday = Date.now()
    const dayOfToday = (new Date().getDay() + 7 - 1) % 7
    const daysOfThisWeek = Array.from(new Array(7))
      .map((_, i) => {
        const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
        return date.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(date.getDate()).padStart(2, '0')
      })
    // console.log(daysOfThisWeek)
  },
})