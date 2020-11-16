// page/live/pages/liveVideo/liveVideo.js
const app = getApp()
import timsdk from "../../utils/timsdk";
Page({
  data: {
    topT: 28,
    statusBarHeight: 30,
    talkList: [],
    close: 0,
    userInfo: {},
    liveDetail: {},
    liveCount: 0,
    newMessage: 0,
    praiseCount: 0,
    showCanvans: 1,
    liveStatus: 1,
    showVideo: 1,
    showBox: 0,
    moveBox: 0,
    viewNum: 0,
    keyHeight: '-60'
  },
  pageName: 'live',
  liveInterval: null,
  onLoad: function (ops) {
    this.liveOps = ops
    this.liveInit()
    let systemInfo = wx.getSystemInfoSync()
    console.log(systemInfo.statusBarHeight, '系统栏高度')
    systemInfo.statusBarHeight < 30 ?
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight + 4
      }) :
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight
      });
  },
  onShow: function () {
    this.setData({
      showCanvans: 1
    })
    this.textHeight = 0
    if (this.toHliveRomm) {
      this.liveInit(1)
      this.toHliveRomm = 0
    } else {
      this.getLiveById(this.liveOps.roomId)
    }
    wx.onKeyboardHeightChange(res => {
      this.setData({
        keyHeight: res.height
      }, () => {
        console.log(this.data.textHeight, this.textHeight,  this.data.textHeight - this.textHeight >= 0)
        this.data.keyHeight - this.textHeight >= 0 ? '' : this.setData({
          keyHeight: '-60'
        });
        this.textHeight = res.height
      })
    })
  },
  onHide: function () {
    this.setData({
      showCanvans: 0,
      liveStatus: 0,
      showVideo: 0
    })
    this.liveInterval ? [clearInterval(this.liveInterval), this.liveInterval = null] : ''
  },
  onUnload: function () {
    timsdk.quitGroup(this)
    timsdk.timLoginout(this)
    this.liveInterval ? [clearInterval(this.liveInterval), this.liveInterval = null] : ''
    wx.offKeyboardHeightChange()
  },
  onShareAppMessage: function () {
    this.setCustommessag('MD5_AUDIENCE_SHARE_LIVE_ROOM')
    return {
      imageUrl: this.data.liveDetail.indexCover,
      title: this.data.liveDetail.name,
      path: "/page/live/pages/vliveRoom/vliveRoom?roomId=" +
        this.data.liveDetail.id +
        "&type=share&uid=" +
        this.data.$state.userInfo.id
    };
  },
  liveInit(type) {
    Promise.all([this.getTimSign(), this.getLiveById(this.liveOps.roomId), this.liveCount()]).then(values => {
      if(type) {
        timsdk.timInit(this, values[0], 1)
        this.setData({
          talkList: this.data.talkList
        })
      } else {
        timsdk.timInit(this, values[0])
      }
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
      if (res.data.status == 3) {
        this.setData({
          liveStatus: 3
        })
      } else if (res.data.status > 1) {
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
  toHliveRoom() {
    if (this.toHliveRomm) return
    // timsdk.quitGroup(this)
    // timsdk.timLoginout(this)
    this.toHliveRomm = 1
    setTimeout(() => {
      this.setData({
        showVideo: 0
      })
      wx.navigateTo({
        url: `../hliveRoom/hliveRoom?roomId=${this.data.liveDetail.id}&statusBarHeight=${this.data.statusBarHeight}&viewNum=${this.data.viewNum}`,
      })
    }, 200);
  },
  bindleavepictureinpicture() {
    this.setData({
      showCanvans: 1
    })
    console.log(this.data.showCanvans, 3489573485734875834589)
  },
  //计时器
  liveInterVal() {
    this.liveInterval || this.data.liveDetail.follow ? '' : this.liveInterval = setInterval(() => {
      this.setData({
        viewNum: this.data.viewNum += 1
      }, () => {
        if (this.data.viewNum >= 600) {
          this.data.liveDetail.follow ? '' : [this.showTentionBox(), this.setData({
            viewNum: 0
          })]
          clearInterval(this.liveInterval)
          this.liveInterval = null
        }
      })
    }, 1000);
  },
  showTentionBox(e) {
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
})