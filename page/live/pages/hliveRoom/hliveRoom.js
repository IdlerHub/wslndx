// page/live/pages/hliveRoom/hliveRoom.js
const app = getApp()
import timsdk from "../../utils/timsdk";
Page({
  data: {
    topT: 28,
    statusBarHeight: 30,
    talkList: [],
    specialList: [],
    joinList: [],
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
    ShowAddSubscribe: 0,
    moveBox: 0,
    viewNum: 0,
    showList: 1,
    animation: {
      showDoweload: 1,
      showJoinclass: 0,
      showOne: 1,
    }
  },
  pageName: 'live',
  pagetype: 'hlive',
  liveInterval: null,
  addSubscribeTime: 0,
  onLoad: function (ops) {
    this.liveOps = ops
    this.addSubscribeTime = Number(ops.addSubscribeTime)
    this.setData({
      statusBarHeight: ops.statusBarHeight,
      ShowAddSubscribe: ops.ShowAddSubscribe,
      viewNum: Number(ops.viewNum)
    }, () => {
      this.liveInit()
    })
    setInterval(() => {
      this.setData({
        'animation.showJoinclass': !this.data.animation.showJoinclass,
        'animation.showDoweload': !this.data.animation.showDoweload,
      }, () => {
        setTimeout(() => {
          this.setData({
            'animation.showOne': !this.data.animation.showOne
          })
        }, 250);
      })
    }, 5000);
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
    this.data.$state.userInfo.id ? this.setCustommessag('MD5_AUDIENCE_SHARE_LIVE_ROOM') : ''
    return {
      imageUrl: this.data.liveDetail.shareCover || this.data.liveDetail.indexCover,
      title: this.data.liveDetail.name,
      path: "/page/live/pages/vliveRoom/vliveRoom?roomId=" +
        this.data.liveDetail.id +
        "&type="+ ( this.data.$state.userInfo.id ? "share&uid=" +
        this.data.$state.userInfo.id : null)
    };
  },
  liveInit(type) {
    Promise.all([this.getTimSign(), this.getLiveById(this.liveOps.roomId), this.liveCount()]).then(values => {
      let pages = ''
      getCurrentPages().forEach(e => {
        e.route == 'page/live/pages/vliveRoom/vliveRoom' ? pages = e : ''
      })
      this.setData({
        talkList: pages.data.talkList
      })
      if(!this.data.$state.userInfo.id) return
      type ? timsdk.timInit(this, values[0]) : timsdk.timInit(this, values[0], 1)
    })
  },
  getLiveById(liveId) {
    if(!liveId ||  liveId ==='undefined'){
      return wx.reLaunch({
        url: "/pages/index/index"
      });
    }
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
    if(!this.data.$state.userInfo.id) return
    return app.liveData.getTimSign({}).then(res => {
      this.setData({
        userInfo: res.data
      })
      return res.data
    })
  },
  liveCount() {
    if(!this.liveOps.roomId ||  this.liveOps.roomId ==='undefined'){
      return wx.reLaunch({
        url: "/pages/index/index"
      });
    }
    app.liveData.liveCount({
      liveId: this.liveOps.roomId
    }).then(res => {
      this.setData({
        liveCount: res.data.popularity
      })
    })
  },
  addliveCount(num) {
    this.setData({
      liveCount: this.data.liveCount + num
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
    app.liveData.follow({
      followerUid: this.data.liveDetail.lecturerUserId
    }).then(() => {
      this.setData({
        'liveDetail.follow': 1,
        showBox: false,
        moveBox: false
      })
      wx.showToast({
        title: '关注成功',
        icon: 'none'
      })
      this.setCustommessag('MD5_AUDIENCE_FOLLOW_LIVE_ROOM_ANCHOR')
    })
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
    (this.liveInterval || this.data.liveDetail.follow) || this.data.liveDetail.lecturerUserId == this.data.$state.userInfo.id ? '' : this.liveInterval = setInterval(() => {
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
    let that = this
    if (this.data.ShowAddSubscribe == 1) {
      app.liveData
        .getLiveBySpecialColumnId({
          specialColumnId: this.data.liveDetail.columnId,
        }).then(res => {
          this.setData({
            lessonDetail: res.data
          })
        })
    } else {
      this.addSubscribeInterVal || this.data.liveDetail.isAddSubscribe || this.data.ShowAddSubscribe > 0 ? null : this.addSubscribeInterVal = setInterval(async function () {
        that.addSubscribeTime += 1
        if (that.addSubscribeTime >= 60) {
          let lessonDetail = (await app.liveData
            .getLiveBySpecialColumnId({
              specialColumnId: that.data.liveDetail.columnId,
            })).data
          if (!lessonDetail.isAddSubscribe) that.setData({
            ShowAddSubscribe: 1,
            lessonDetail
          })
          clearInterval(that.addSubscribeInterVal)
          that.addSubscribeInterVal = null
        }
      }, 1000)
    }
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
  animationCheck(e) {
    this.setData({
      [`specialList[${e.detail.index}].payload.isShow`]: false
    })
  },
  animationDel(e) {
    this.data.specialList.splice(e.detail.index, 1)
    this.setData({
      specialList: this.data.specialList
    })
  },
  animationEnd() {
    this.data.joinList.splice(0, 1)
    this.setData({
      joinList: this.data.joinList
    })
  },
  clickFloat() {
    let params = JSON.parse(this.data.liveDetail.floatJumpParam)
    if (this.data.liveDetail.floatJumpType == 1) {
      wx.navigateTo({
        url: `/pages/education/education?url=${params.url}&type=0&login=1`,
      })
    } else {
      wx.navigateTo({
        url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + params.url,
      })
    }
  },
  closeAddSubscribe() {
    this.setData({
      ShowAddSubscribe: 2
    })
    let page = getCurrentPages()[getCurrentPages().length - 2]
    page.setData({
      ShowAddSubscribe: 2
    })
  },
  addStudy() {
    app.liveData
      .addSubscribe({
        columnId: this.data.liveDetail.columnId,
      })
      .then(() => {
        this.setData({
          ShowAddSubscribe: 2
        })
        let page = getCurrentPages()[getCurrentPages().length - 2]
        page.setData({
          ShowAddSubscribe: 2
        })
      });
    app.subscribeMessage()
  },
})