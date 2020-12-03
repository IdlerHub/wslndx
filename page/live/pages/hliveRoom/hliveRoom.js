// page/live/pages/hliveRoom/hliveRoom.js
const app = getApp()
import timsdk from "../../utils/timsdk";
Page({
  data: {
    topT: 28,
    statusBarHeight: 30,
    talkList: [],
    specialList: [],
    close: 0,
    userInfo: {},
    liveDetail: {},
    liveCount: 0,
    newMessage: 0,
    praiseCount: 0,
    showCanvans: 1,
    liveStatus: 1,
    showCommont: 1,
    showVideo: 1,
    showBox: 0,
    moveBox: 0,
    viewNum: 0,
    showList: 1
  },
  pageName: 'live',
  pagetype: 'hlive',
  liveInterval: null,
  onLoad: function (ops) {
    this.liveOps = ops
    this.setData({
      statusBarHeight: ops.statusBarHeight,
      viewNum: Number(ops.viewNum)
    }, () => {
      this.liveInit()
    })
  },
  onShow: function () {
    this.setData({
      showCanvans: 1
    })
    this.getLiveById(this.liveOps.roomId)
  },
  onHide: function () {
    this.setData({
      showCanvans: 0,
      liveStatus: 0,
      showVideo: 0
    })
  },
  onUnload: function () {
    // timsdk.quitGroup(this)
    // timsdk.timLoginout(this)
  },
  onShareAppMessage: function () {
    this.setCustommessag('MD5_AUDIENCE_SHARE_LIVE_ROOM')
    return {
      imageUrl: this.data.liveDetail.shareCover || this.data.liveDetail.indexCover,
      title: this.data.liveDetail.name,
      path: "/page/live/pages/vliveRoom/vliveRoom?roomId=" +
        this.data.liveDetail.id +
        "&type=share&uid=" +
        this.data.$state.userInfo.id
    };
  },
  liveInit() {
    Promise.all([this.getTimSign(), this.getLiveById(this.liveOps.roomId), this.liveCount()]).then(values => {
      timsdk.timInit(this, values[0], 1)
      let pages = ''
      getCurrentPages().forEach(e => {
        e.route == 'page/live/pages/vliveRoom/vliveRoom' ? pages = e : ''
      })
      this.setData({
        talkList: pages.data.talkList
      })
    })
  },
  getLiveById(liveId) {
    return app.liveData.getLiveById({
      liveId
    }).then(res => {
      this.setData({
        liveDetail: res.data,
        showVideo: 1
      })
      if(res.data.status == 3) {
        this.setData({
          liveStatus: 3
        })
      } else if(res.data.status > 1) {
        this.setData({
          liveStatus: 4
        })
      } else {
        this.setData({
          liveStatus: 1
        })
      }
      this.liveInterVal()
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
    app.liveData.liveCount({
      liveId: this.liveOps.roomId
    }).then(res => {
      this.setData({
        liveCount: res.data.popularity
      })
    })
  },
  addliveCount() {
    this.setData({
      liveCount: this.data.liveCount += 1
    })
  },
  checkCaption() {
    this.setData({
      close: !this.data.close
    })
  },
  sendMsg(e) {
    timsdk.sendTextMsg(e.detail)
  },
  checkFollow() {
    this.setData({
      'liveDetail.follow': 1,
      showBox: false,
      moveBox: false
    })
    this.setCustommessag('MD5_AUDIENCE_FOLLOW_LIVE_ROOM_ANCHOR')
  },
  setCustommessag(customText, type, values) {
    let params = {
      customText: customText,
      customType: '0',
      isShow: 'show',
      attachContent: type == 'praise' ? values : ''
    }
    timsdk.customParams(params)
  },
  praise(e) {
    this.setCustommessag('MD5_AUDIENCE_PRAISE_ANCHOR', "praise", e.detail)
  },
  setNewmessagenum(e) {
    e.detail.type ?
      this.setData({
        newMessage: e.detail.num + this.data.newMessage
      }) : this.setData({
        newMessage: e.detail.num
      })
  },
  clickHandler() {
    this.setData({
      praiseCount: this.data.praiseCount += 1
    });
  },
  bindstatechange(e) {
    console.log(e)
  },
  closeCommont() {
    this.setData({
      showCommont: !this.data.showCommont,
      showList: !this.data.showList
    })
  },
  liveInterVal() {
    this.liveInterval || this.data.liveDetail.follow ? '' : this.liveInterval = setInterval(() => {
      this.setData({
        viewNum: this.data.viewNum += 1
      }, () => {
        if (this.data.viewNum >= 600) {
          this.data.liveDetail.follow ? '' : [this.showBox(), this.setData({
            viewNum: 0
          })]
          clearInterval(this.liveInterval)
          this.liveInterval = null
        }
      })
    }, 1000);
  },
  showBox(e) {
    this.setData({
      showBox: !this.data.showBox,
      moveBox: !this.data.moveBox
    }, () => {
      if (e) {
        this.liveInterVal()
      }
    })
  },
  attention() {
    app.liveData.follow({ followerUid: this.data.liveDetail.lecturerUserId }).then(() => {
      this.checkFollow()
      wx.showToast({
        title: '关注成功',
        icon: 'none'
      })
    })
  },
  animationCheck() {
    this.data.specialList.splice(0, 1)
    this.setData({
      specialList: this.data.specialList
    })
  }
}) 