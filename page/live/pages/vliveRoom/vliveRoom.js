// page/live/pages/liveVideo/liveVideo.js
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
    showVideo: 1,
    ShowAddSubscribe: 0,
    showBox: 0,
    moveBox: 0,
    viewNum: 0,
    keyHeight: '-60',
    downTime: {
      d: 0,
      m: 0,
      s: 0
    },
    animation: {
      showDoweload: 1,
      showJoinclass: 0,
      showOne: 1,
    },
  },
  pageName: 'live',
  liveInterval: null,
  addSubscribeTime: 0,
  onLoad: function (ops) {
    this.liveOps = ops
    this.liveInit()
    this.data.$state.userInfo.id ?  null : this.talkListInit()
    let systemInfo = wx.getSystemInfoSync()
    systemInfo.statusBarHeight < 30 ?
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight + 4
      }) :
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight
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
    let clickHandler = setInterval(() => {
      this.clickHandler()
    }, 250);
    setTimeout(() => {
      clearInterval(clickHandler)
    }, 2000)
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
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
    this.addSubscribeInterVal ? [clearInterval(this.addSubscribeInterVal), this.addSubscribeInterVal = null] : ''
  },
  onUnload: function () {
    this.liveInterval ? [clearInterval(this.liveInterval), this.liveInterval = null] : ''
    wx.offKeyboardHeightChange()
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
    if(!this.data.$state.userInfo.id) return
    timsdk.quitGroup(this)
    timsdk.timLoginout(this)
  },
  onShareAppMessage: function () {
    this.data.$state.userInfo.id ? this.setCustommessag('MD5_AUDIENCE_SHARE_LIVE_ROOM') : null
    return {
      imageUrl: this.data.liveDetail.shareCover || this.data.liveDetail.indexCover,
      title: this.data.liveDetail.name,
      path: "/page/live/pages/vliveRoom/vliveRoom?roomId=" +
        this.data.liveDetail.id +
        "&type="+ ( this.data.$state.userInfo.id ? "share&uid=" +
        this.data.$state.userInfo.id : null)
    };
  },
  talkListInit() {
    this.setData({
      talkList: [{
        nick: "网上老年大学小助手",
        payload: {
          text: "欢迎来到直播间：<p> 1、请自行调节手机音量至合适的状态。</p> <p>2、听众发言可以在讨论区进行查看。</p>",
        },
      }]
    })

  },
  liveInit(type) {
    Promise.all([this.getTimSign(), this.getLiveById(this.liveOps.roomId), this.liveCount()]).then(values => {
      if(!this.data.$state.userInfo.id) return
      if (type) {
        timsdk.timInit(this, values[0], 1)
        this.setData({
          talkList: this.data.talkList
        })
      } else {
        timsdk.timInit(this, values[0])
      }
    })
  },
  getLiveById(liveId, type) {
    let that = this
    if(!liveId ||  liveId ==='undefined'){
     return wx.reLaunch({
        url: "/pages/index/index"
      });
    }
    return app.liveData.getLiveById({
      liveId 
    }).then((res) => {
      that.setData({
        liveDetail: res.data,
        showVideo: 1
      })
      if (res.data.status == 3) {
        that.setData({
          liveStatus: 3
        })
      } else if (res.data.status > 1) {
        that.setData({
          liveStatus: 4
        })
      } else if (res.data.status == 0) {
        that.setData({
          liveStatus: 0
        }, () => {
          if (type) return
          let date = new Date()
          let dataTime = date.getFullYear() + '/' + that.data.liveDetail.dayTime.slice(0, 2) + '/' + that.data.liveDetail.dayTime.slice(3, 5) + ' ' + that.data.liveDetail.startTime.slice(0, 2) + ':' + that.data.liveDetail.startTime.slice(3, 5) + ':00'
          let total = ((new Date(dataTime)).getTime() - date.getTime()) / 1000
          let day = parseInt(total / (24 * 60 * 60))
          let afterDay = total - day * 24 * 60 * 60;
          let hour = parseInt(afterDay / (60 * 60));
          let afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60;
          let min = parseInt(afterHour / 60);
          if (day == 0 && hour == 0 && min == 0) return
          that.setData({
            'downTime.d': day,
            'downTime.m': min + 1 >= 60 ? hour + 1 : hour,
            'downTime.s': min + 1 >= 0 ? min + 1 >= 60 ? 0 : min + 1 : 0
          }, () => {
            if (that.downTimer) return
            that.downTimer = setInterval(() => {
              if (that.data.downTime.s - 1 < 0) {
                if (that.data.downTime.m - 1 < 0 && that.data.downTime.d > 0) {
                  that.setData({
                    'downTime.d': that.data.downTime.d - 1,
                    'downTime.m': 23,
                    'downTime.s': 59
                  })
                } else {
                  that.setData({
                    'downTime.d': that.data.downTime.d,
                    'downTime.m': that.data.downTime.m - 1,
                    'downTime.s': 59
                  })
                }
              } else {
                that.setData({
                  'downTime.d': that.data.downTime.d,
                  'downTime.m': that.data.downTime.m,
                  'downTime.s': that.data.downTime.s - 1
                })
              }
              if (that.data.downTime.d == 0 && that.data.downTime.m == 0 && that.data.downTime.s == 0) {
                that.getLiveById(that.liveOps.roomId, 1)
                clearInterval(that.downTimer)
              }
            }, 60000)
          })
        })
      } else {
        that.setData({
          liveStatus: 1
        })
      }
      that.liveInterVal()
      return that.data.liveDetail
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
      customType: type == 'praise' ? '2' : '0',
      isShow: type == 'praise' ? 'praiseShow' : 'show',
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
        url: `../hliveRoom/hliveRoom?roomId=${this.data.liveDetail.id}&statusBarHeight=${this.data.statusBarHeight}&viewNum=${this.data.viewNum}&addSubscribeTime=${this.addSubscribeTime}&ShowAddSubscribe=${this.data.ShowAddSubscribe}`,
      })
    }, 200);
  },
  bindleavepictureinpicture() {
    this.setData({
      showCanvans: 1
    })
  },
  //计时器
  liveInterVal() {
    (this.liveInterval || this.data.liveDetail.follow) || this.data.liveDetail.lecturerUserId == this.data.$state.userInfo.id ? '' : this.liveInterval = setInterval(() => {
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
    if(this.data.ShowAddSubscribe == 2) return
    let that = this
    this.addSubscribeInterVal || this.data.liveDetail.isAddSubscribe ? null : this.addSubscribeInterVal = setInterval(async function () {
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
      if (params.lesson_type == 1) {
        wx.navigateTo({
          url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + params.lesson_id,
        })
      } else {
        wx.navigateTo({
          url: '/page/index/pages/chageLesson/chageLesson?id=' + params.lesson_id,
        })
      }
    }
  },
  closeAddSubscribe() {
    this.setData({
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
        app.subscribeMessage()
      });
  },
  // 直播订阅
  reserve: async function() {
    app.subscribeMessage(this.data.liveDetail.id)
  },
  checknextTap(e) {
    app.checknextTap(e);
  },
})