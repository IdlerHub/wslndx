// pages/liveDetail/liveDetail.js
const LiveData = require("../../../../data/LiveData");
const app = getApp();
const plugin = requirePlugin("WechatSI");
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager();
const innerAudioContext = wx.createInnerAudioContext();
var htmlparser = require("../../../../utils/htmlparser");
Page({
  data: {
    nav: [
      //课程部分
      {
        name: "简介",
      },
      {
        name: "目录",
      },
      {
        name: "讨论",
      },
    ],
    showServise: false, //展示客服盒子
    currentTab: 1, //分类
    sort: 0, //排序
    height: 0,
    keyheight: 0,
    write: true,
    showvoice: false, //评论部分
    focus: false,
    contenLength: 0,
    replycontenLength: 0,
    placeholder: "添加你的评论",
    replycomment: "欢迎发表观点",
    replyplaceholder: "",
    replycontent: "",
    voicetime: 0,
    showvoiceauto: false,
    voicetextstatus: "",
    content: "",
    voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png",
    current: {}, //当前直播信息
    playNow: {},
    lessonDetail: {}, //课程详情信息
    sublessons: [], //回放课程列表
    comment: [], //  讨论
    playFlag: false, //视频播放状态
    fullScreen: 0,
    scrollviewtop: 0
  },
  timer: null,
  pageName: 'liveDetail',
  onLoad: function (options) {
    options.lessonId ? options.specialColumnId = options.lessonId - -614 : ''
    this.options = options
    this.videoContext = wx.createVideoContext("myVideo");
    this.init(options);
    this.heightInit(options);
    this.getLessonDetail(options.specialColumnId, true);
  },
  onPullDownRefresh: function () {
    this.setData({
      sublessons: [],
      playNow: {},
      comment: [],
      playFlag: false,
    });
    this.comParam.pageNum = 1;
    this.init(this.options);
    this.heightInit(this.options);
    this.getLessonDetail(this.options.specialColumnId, true);
  },
  onGotUserInfo(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.updateBase(e); //更新state授权状态
    }
  },
  onReachBottom() {
    if (this.data.currentTab == 1) {
      this.comParam.pageNum++;
      this.getComment();
    }
  },
  onShow: function () {
    this.initRecord();
    this.getRecordAuth();
    this.data.lessonDetail.columnId ? this.getLessonDetail(this.data.lessonDetail.columnId) : '';
    // wx.onNetworkStatusChange((res) => {
    //   res.networkType == "wifi" ? app.playVedio("wifi") : "";
    // });
  },
  onUnload() {
    clearInterval(this.timer);
    clearInterval(this.Timeout);
  },
  subscribe() {
    //上课通知
    wx.uma.trackEvent('liveClick', {
      name: '上课通知'
    });
    if (this.data.is_subscribe) {
      console.log("你已经订阅了");
      wx.showToast({
        title: "您已经订阅过该课程消息",
        icon: "none",
      });
    } else {
      //有(公众号)openid
      if (this.data.mp_openid) {
        // let openid = "ojo015zeP5d5DGmZ0Dd_B8Y8Satg";
        this.getSendMessage(this.data.mp_openid);
      } else {
        this.getOpenId();
      }
    }
  },
  getOpenId() {
    //没有用户的公众号openid
    let uid = wx.getStorageSync("userInfo").id;
    // wx.setStorageSync("AccountsId", ops.accounts_openid);
    //liveTyp标识从哪里跳转
    wx.navigateTo({
      url: `/pages/education/education?liveType=liveTable&uid=${uid}`,
    });
  },
  getSendMessage(openid) {
    //发送订阅消息
    let _this = this;
    let params = {
      openid,
      lesson_id: _this.data.lessonDetail.id,
    };
    LiveData.getSendMessage(params)
      .then((res) => {
        wx.showToast({
          title: res.msg,
          icon: "none",
        });
        _this.setData({
          is_subscribe: 1,
        });
      })
      .catch((err) => {
        wx.showToast({
          title: err.msg,
          icon: "none",
        });
      });
  },
  //获取数据
  getLessonDetail(specialColumnId, flag = false) {
    let _this = this;
    LiveData.getLiveBySpecialColumnId({
      specialColumnId,
    }).then((res) => {
      wx.setNavigationBarTitle({
        title: res.data.name || "",
      });
      if (res.data.isAddSubscribe == 0 && !(res.data.price > 0)) {
        wx.redirectTo({
          url: `/page/live/pages/tableDetail/tableDetail?specialColumnId=${specialColumnId}`,
        });
      }
      res.data.introduction = htmlparser.default(
        res.data.introduction
      );
      _this.setData({
        lessonDetail: res.data
      });
      _this.getSublesson(res.data.liverVOS)
      _this.getComment();
    });
  },
  getSublesson(lessons) {
    if(!lessons) return
    let playNow = {},
      liveNow = 0;
    this.setData({
      sublessons: lessons,
    }, () => {
      if (this.data.playNow.state == 1) return
      this.data.sublessons.forEach((item) => {
        //如果是已经结束的课,就把第一个放到当前播放中
        item.state == 1 && JSON.stringify(playNow) == "{}" ? [playNow = item, liveNow = 1] : ''
      });
      this.data.sublessons.forEach((item) => {
        //如果是已经结束的课,就把第一个放到当前播放中
        item.state == 3 && JSON.stringify(playNow) == "{}" && !liveNow && JSON.stringify(this.data.playNow) == "{}" ? [this.getLiveBackById(item.id), playNow = item] :
          "";
      });
      liveNow ? this.setData({
        playNow,
        current: playNow,
        playFlag: false
      }, () => {
        this.tolesson()
      }) : ''
      if (this.Timeout) return
      this.Timeout = setInterval(() => {
        LiveData.getLiveBySpecialColumnId({
          specialColumnId: this.data.lessonDetail.columnId,
        }).then(res => {
          this.getSublesson(res.data.liverVOS)
        })
      }, 60000);
    });
  },
  //展示客服页面
  showServise() {
    this.setData({
      showServise: !this.data.showServise,
    });
  },
  joinClass() {
    //跳转推文链接
    let link = this.data.lessonDetail.mpUrl,
      that = this;
    console.log(link);
    wx.uma.trackEvent('liveClick', {
      name: '进班群'
    });
    // link = `http://mp.weixin.qq.com/s?__biz=Mzg3OTA0NjU0Mg==&mid=100011260&idx=2&sn=93cc742e508ef7e0de553d8c3be44220&chksm=4f08d61d787f5f0b4ec81964a4e49656907e4d1`;
    // wx.navigateTo({
    //   url: `/pages/education/education?url=${link}&type=live`,
    // });
    wx.navigateTo({
      url: "/pages/education/education?type=live",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("liveCode", {
          url: link
        });
        that.data.showServise ?
          that.setData({
            showServise: false,
          }) :
          "";
      },
    });
  },
  //第一次加载初始化
  init(options) {
    // 初次进入展示客服盒子
    if (options.isFirst && options.isFirst != 0) {
      this.setData({
        showServise: true,
      });
    }
    //请求参数
    this.comParam = {
      subjectId: options.specialColumnId || this.data.lessonDetail.columnId,
      commentType: 1,
      pageNum: 1,
      pageSize: 10,
    };
    //监听键盘变化
    wx.onKeyboardHeightChange((res) => {
      if (this.data.keyheight == 0) {
        this.setData({
          keyheight: res.height,
          // keyHeight: true,
        });
      } else {
        if (res.height <= 0) {
          this.setData({
            // keyHeight: false,
            keyheight: 0,
            write: true,
            writeTow: false,
          });
        }
      }
    });
  },
  heightInit(options) {
    //初始化课程块高度
    let that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight;
    let system = wx.getSystemInfoSync().model.indexOf("iPhone");
    system == -1 ?
      this.setData({
        paddingTop: true,
      }) :
      "";
    let query = wx.createSelectorQuery().in(this);
    query.select("#myVideo").boundingClientRect();
    query.select(".liveInfo").boundingClientRect();
    query.select(".nav").boundingClientRect();
    query.select(".liveLesson").boundingClientRect();
    query.exec((res) => {
      let videoHeight = res[0].height;
      let liveInfoHeight = res[1].height;
      let navHeight = res[2].height + 10;
      let scrollViewHeight =
        windowHeight - videoHeight - liveInfoHeight - navHeight;
      if (res[3] != null) {
        scrollViewHeight -= res[3].height;
      }
      that.setData({
        height: 306,
        currentTab: 1,
      });
    });
  },
  // 权限询问
  authrecord() {
    this.setData({
      focus: false,
    });
    if (this.data.$state.authRecordfail) {
      wx.showModal({
        content: "您已拒绝授权使用麦克风录音权限，请打开获取麦克风授权！否则无法使用小程序部分功能",
        confirmText: "去授权",
        confirmColor: "#df2020",
        success: (res) => {
          if (res.confirm) {
            wx.openSetting({});
          }
        },
      });
    }
    if (!this.data.$state.authRecord) {
      wx.authorize({
        scope: "scope.record",
        success() {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          app.store.setState({
            authRecord: true,
          });
        },
        fail() {
          app.store.setState({
            authRecordfail: true,
          });
        },
      });
    }
  },
  getRecordAuth() {
    wx.getSetting({
      success(res) {
        let record = res.authSetting["scope.record"];
        app.store.setState({
          authRecord: record || false,
        });
      },
      fail(res) {},
    });
  },
  //课程部分功能块
  switchTab(event) {
    //滑动切换
    let cur = event.detail.current;
    wx.uma.trackEvent('liveClick', {
      name: cur == 0 ? '剧集' : cur == 1 ? '讨论' : '简介'
    });
    this.setData({
      currentTab: cur,
    }, () => {
      this.setHeight();
    });
  },
  switchNav(event) {
    //点击切换
    let cur = event.currentTarget.dataset.index;
    wx.uma.trackEvent('liveClick', {
      name: cur == 0 ? '剧集' : cur == 1 ? '讨论' : '简介'
    });
    if (this.data.currentTab === cur) {
      return;
    } else {
      this.setData({
        currentTab: cur,
      }, () => {
        this.setHeight();
      });
    }
  },
  setHeight() {
    let that = this;
    let query = wx.createSelectorQuery().in(this);
    if (this.data.currentTab == 0) {
      query.select(".introduction").boundingClientRect();
    } else if (this.data.currentTab == 2) {
      query.select(".comment").boundingClientRect();
    } else {
      this.data.sublessons.length > 0 ? query.select(".drama").boundingClientRect() : query.select(".none-live").boundingClientRect()
    }
    query.exec((res) => {
      console.log(res)
      let height =
        this.data.currentTab == 1 && this.data.sublessons.length > 0 ? res[0].height : res[0].height - -110;
      height <= 110 ?
        that.setData({
          height: this.data.currentTab == 2 ? 350 : 700,
        }) :
        that.setData({
          height
        });
    });
  },
  tolesson() {
    let that = this,
      // id = ".sublessonsd" + this.data.lessonDetail.current_sublesson_id;
      id = ".active";
    if (this.data.currentTab == 1) {
      let query = wx.createSelectorQuery().in(this);
      query.select(id).boundingClientRect();
      query.exec((res) => {
        console.log(res)
        res[0] ?
          this.setData({
            scrollviewtop: res[0].top - 500,
          }) :
          "";
      });
    }
  },
  select(e) {
    let item = e.currentTarget.dataset.item,
      pages = getCurrentPages(),
      back = 0;
    if (item.state == 0) {
      // LiveData.getLiveById({
      //   liveId: item.id
      // }).then(res => {
      //   res.data.state == 0 ? wx.showToast({
      //     title: "直播还未开始",
      //     icon: "none",
      //   }) : ''
      //   if (res.data.state == 1) {
      pages.forEach(e => {
        e.pageName ? e.pageName == 'live' ? back = 1 : '' : ''
      })
      back ? wx.navigateBack() : wx.navigateTo({
        url: '/page/live/pages/vliveRoom/vliveRoom?roomId=' + item.id,
      })
      // }
      // })
    } else if (item.state == 1) {
      pages.forEach(e => {
        e.pageName ? e.pageName == 'live' ? back = 1 : '' : ''
      })
      back ? wx.navigateBack() : wx.navigateTo({
        url: '/page/live/pages/vliveRoom/vliveRoom?roomId=' + item.id,
      })
    } else if (item.state == 2) {
      wx.showToast({
        title: "课程视频正在加紧上传中",
        icon: "none",
      })
    } else if (item.state == 3) {
      this.getLiveBackById(item.id)
    }
  },
  //获取回播
  getLiveBackById(liveId) {
    LiveData.getLiveBackById({
      liveId
    }).then(res => {
      this.setData({
        playNow: res.data
      }, () => {
        this.recordAddVedio();
      })
    })
  },
  //评论模块
  // 获取讨论
  getComment(list, options) {
    let comment = list || this.data.comment;
    return LiveData.getCommentList(this.comParam)
      .then((msg) => {
        if (msg.dataList.length == 0 && !options) {
          this.comParam.pageNum--;
          return;
        } else {
          msg.dataList.forEach((item) => {
            item.replyList ? item.replyList.forEach((v) => {
              v.rtext = `回复<span  class="respond">${v.toUser}</span>:&nbsp;&nbsp;`;
            }) : ''
            comment.push(item);
          });
          this.comment = JSON.parse(JSON.stringify(comment));
          this.setData({
            comment: comment,
          }, () => {
            this.setHeight();
          });
        }
      })
      .catch((err) => {
        if (err.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            lessonDetail: "",
            delState: true,
          });
        }
      });
  },
  input(e) {
    //输入
    let lessDiscussion = this.data.$state.lessDiscussion;
    let lessonId = this.data.lessonDetail.columnId;
    if (this.data.replyshow) {
      this.setData({
        replycontent: e.detail.value,
        replycontenLength: e.detail.value.length,
      });
      lessDiscussion[lessonId] ? "" : (lessDiscussion[lessonId] = {});
      if (this.replyParent) {
        lessDiscussion[lessonId]["replyParent"] ?
          "" :
          (lessDiscussion[lessonId]["replyParent"] = {});
        lessDiscussion[lessonId]["replyParent"][
          this.replyParent
        ] = this.data.replycontent;
      } else if (this.replyInfo) {
        lessDiscussion[lessonId]["replyInfo"] ?
          "" :
          (lessDiscussion[lessonId]["replyInfo"] = {});
        lessDiscussion[lessonId]["replyInfo"][
          this.replyInfo.commentId
        ] = this.data.replycontent;
      }
    } else {
      this.setData({
        content: e.detail.value,
        contenLength: e.detail.value.length,
      });
      lessDiscussion[lessonId] ? "" : (lessDiscussion[lessonId] = {});
      lessDiscussion[lessonId]["replycontent"] = this.data.content;
    }
    app.store.setState({
      lessDiscussion,
    });
  },
  bindblur() {
    this.setData({
      // keyHeight: false,
      keyheight: 0,
      write: true,
      writeTow: false,
    });
  },
  showWrite(e) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content: "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
        confirmColor: "#df2020",
      });
    } else {
      if (this.data.replyshow && e.currentTarget.dataset.type == "voice") {
        this.setData({
          write: false,
          showvoice: false, //
          writeTow: true,
          focus: true, //
          showvoiceauto: false, //
          voicetime: 0, //
          replycontenLength: this.data.replycontent.length || 0, //
        });
      } else {
        this.setData({
          write: false,
          showvoice: false,
          writeTow: true,
          focus: true,
          showvoiceauto: false,
          voicetime: 0,
          replyplaceholder: "",
          replyshow: false,
          contenLength: this.data.content.length || 0, //
        });
        this.replyInfo = null;
        this.replyParent = null;
        let system = {};
        wx.getSystemInfo({
          success: (res) => {
            system = res;
          },
        });
        if (system.screenHeight <= 700) this.setscrollto();
      }
    }
  },
  setscrollto() {
    let query = wx.createSelectorQuery().in(this);
    query.select(".container").boundingClientRect();
    query.exec((res) => {
      if (res[0].top > -100) {
        wx.pageScrollTo({
          scrollTop: 250,
        });
      }
    });
  },
  showvoice(e) {
    this.setscrollto();
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content: "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
        confirmColor: "#df2020",
      });
    } else {
      if (!e.target.dataset.type) {
        this.setData({
          showvoice: true,
          write: false,
          writeTow: false,
        });
      } else {
        this.setData({
          showvoice: true,
          write: false,
          writeTow: false,
          replyshow: false,
        });
        this.replyInfo = null;
        this.replyParent = null;
      }
    }
  },
  // 展示详情信息
  toCommentDetail(e) {
    let vm = this;
    wx.navigateTo({
      url: "/pages/commentDetail/commentDetail?" +
        "lesson_id=" +
        this.data.lessonDetail.id +
        "&comment_id=" +
        e.currentTarget.dataset.parentid +
        "&is_live=1",
      events: {
        refreshComments: (data) => {
          this.comParam.pageNum = 1;
          this.getComment([]);
        },
      },
    });
  },
  //展示回复二级/三级评论
  show(e) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content: "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
      });
    } else {
      this.setscrollto();
      if (e && (e.target.dataset.reply || e.target.dataset.parent)) {
        /* 回复别人的评论 或者 回复别人的回复  */
        this.replyParent = e.target.dataset.parent || null;
        this.replyInfo = e.target.dataset.reply || null;
        if (this.replyParent == null) {
          if (this.data.$state.lessDiscussion[this.data.lessonDetail.columnId]) {
            if (
              this.data.$state.lessDiscussion[this.data.lessonDetail.columnId]
              .replyInfo
            ) {
              this.data.$state.lessDiscussion[this.data.lessonDetail.columnId]
                .replyInfo[this.replyInfo.commentId] ?
                this.setData({
                  replycontent: this.data.$state.lessDiscussion[
                    this.data.lessonDetail.columnId
                  ].replyInfo[this.replyInfo.commentId],
                  replyplaceholder: "回复 " + e.currentTarget.dataset.reply.nickname,
                  replycontenLength: this.data.$state.lessDiscussion[
                    this.data.lessonDetail.columnId
                  ].replyInfo[this.replyInfo.commentId].length,
                }) :
                this.setData({
                  replycontent: "",
                  replyplaceholder: "回复 " + e.currentTarget.dataset.reply.nickname,
                  replycontenLength: 0,
                });
            } else {
              this.setData({
                replycontent: "",
                replyplaceholder: "回复 " + e.currentTarget.dataset.reply.nickname,
                replycontenLength: 0,
              });
            }
          } else {
            this.setData({
              replycontent: "",
              replyplaceholder: "回复 " + e.currentTarget.dataset.reply.nickname,
              replycontenLength: 0,
            });
          }
        } else if (this.data.$state.lessDiscussion[this.data.lessonDetail.columnId]) {
          if (
            this.data.$state.lessDiscussion[this.data.lessonDetail.columnId]
            .replyParent
          ) {
            this.data.$state.lessDiscussion[this.data.lessonDetail.columnId]
              .replyParent[this.replyParent] ?
              this.setData({
                replycontent: this.data.$state.lessDiscussion[
                  this.data.lessonDetail.columnId
                ].replyParent[this.replyParent],
                replyplaceholder: "回复 " + this.replyParent == null ? e.target.dataset.reply.nickname : e.target.dataset.parent.fromUser,
                replycontenLength: this.data.$state.lessDiscussion[
                  this.data.lessonDetail.columnId
                ].replyParent[this.replyParent].length,
              }) :
              this.setData({
                replycontent: "",
                replyplaceholder: "回复 " + this.replyParent == null ? e.target.dataset.reply.nickname : e.target.dataset.parent.fromUser,
                replycontenLength: 0,
              });
          } else {
            this.setData({
              replycontent: "",
              replyplaceholder: "回复 " + this.replyParent == null ? e.target.dataset.reply.nickname : e.target.dataset.parent.fromUser,
              replycontenLength: 0,
            });
          }
        } else {
          this.setData({
            replycontent: "",
            replyplaceholder: "回复 " + this.replyParent == null ? e.target.dataset.reply.nickname : e.target.dataset.parent.fromUser,
          });
        }
      } else {
        /* 评论 */
        this.replyInfo = null;
        this.replyParent = null;
      }
      this.setData({
        write: false,
        writeTow: true,
        focus: true,
        replyshow: true,
      });
    }
  },
  // 发布评论
  release(e) {
    if (!!this.data.content.trim() || !!this.data.replycontent.trim()) {
      if (e.currentTarget.dataset.type) {
        let param = {
          commentType: 1,
          subjectId: this.data.lessonDetail.columnId,
          content: this.data.content,
        };
        this.addComment(param);
      } else if (this.replyParent) {
        /* 回复别人的回复 */
        let params = {
          commentType: 1,
          replyType: 2,
          subjectId: this.data.lessonDetail.columnId,
          commentId: this.replyParent.commentId,
          replyId: this.replyParent.replyId,
          content: this.data.replycontent,
          toUser: this.replyParent.replyUserId,
        };
        this.reply(params);
      } else if (this.replyInfo) {
        /* 回复评论 */
        let params = {
          commentType: 1,
          replyType: 1,
          replyId: '',
          subjectId: this.data.lessonDetail.columnId,
          commentId: this.replyInfo.commentId,
          content: this.data.replycontent,
          toUser: this.replyInfo.uid,
        };
        this.reply(params);
      } else {
        let param = {
          commentType: 1,
          subjectId: this.data.lessonDetail.columnId,
          comment: this.data.content,
        };
        this.addComment(param);
      }
    }
  },
  // 增加评论
  addComment(param) {
    LiveData.putComment(param)
      .then((res) => {
        this.setData({
          write: false,
          placeholder: "发评论",
          content: "",
          write: true,
          writeTow: false,
          focus: false,
          keyheight: 0,
          contenLength: 0,
          showvoice: false,
          voicetime: 0,
          showvoiceauto: false,
        });
        wx.showToast({
          title: "评论成功",
          icon: "none",
          duration: 800,
        });
        this.comParam.pageNum = 1;
        this.getComment([]);
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.lessonDetail.id].replycontent = "";
        app.store.setState({
          lessDiscussion,
        });
      })
      .catch((err) => {
        wx.showToast({
          title: err.msg,
          image: "/images/warn.png",
          duration: 800,
        });
      });
  },
  //回复评论
  reply(params) {
    wx.showLoading({
      title: "发布中",
      mask: true,
    });
    LiveData.putReply(params)
      .then((msg) => {
        console.log(msg)
        wx.hideLoading();
        this.setData({
          write: false,
          placeholder: "发评论",
          replycontent: "",
          write: true,
          writeTow: false,
          focus: false,
          keyheight: 0,
          contenLength: 0,
          showvoice: false,
          voicetime: 0,
          showvoiceauto: false,
        });
        wx.showToast({
          title: "评论成功",
          icon: "none",
          duration: 800,
        });
        let lessDiscussion = this.data.$state.lessDiscussion;
        if (this.replyParent) {
          lessDiscussion[this.data.lessonDetail.columnId].replyParent[
            this.replyParent
          ] = "";
          app.store.setState({
            lessDiscussion,
          });
        } else {
          lessDiscussion[this.data.lessonDetail.columnId].replyInfo[
            this.replyInfo.commentId
          ] = "";
          app.store.setState({
            lessDiscussion,
          });
        }
        this.comParam.pageNum = 1;
        this.getComment([]);
        this.replyInfo = null;
        this.replyParent = null;
      })
      .catch((err) => {
        if (err.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            lessonDetail: "",
            delState: true,
          });
        } else if (err.code == -3) {
          /* 消息已经删除 */
          wx.showToast({
            title: "消息已删除",
            icon: "none",
            duration: 1500,
          });
          this.comParam.pageNum = 1;
          this.getComment([]);
        } else {
          wx.showToast({
            title: err.msg || "发布失败",
            icon: "none",
            duration: 1500,
          });
        }
      });
  },
  /* 删除回复 */
  delReply(e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: "#df2020",
      success: (res) => {
        if (res.confirm) {
          let params = {
            commentType: 1,
            type: 2,
            id: e.currentTarget.dataset.item.replyId,
          };
          LiveData.delReply(params)
            .then((msg) => {
              wx.hideLoading();
              wx.showToast({
                title: "删除成功",
                icon: "none",
                duration: 1500,
              });
              this.comParam.pageNum = 1;
              this.getComment([], 1);
            })
            .catch((err) => {
              if (err.code == -2) {
                /* 帖子已经删除 */
                this.setData({
                  lessonDetail: "",
                  delState: true,
                });
              } else {
                wx.showToast({
                  title: "删除失败，请稍后重试",
                  image: "/images/warn.png",
                  duration: 1500,
                });
              }
            });
        }
      },
    });
  },
  // 删除评论
  delComment: function (e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: "#df2020",
      success: (res) => {
        if (res.confirm) {
          let param = {
            commentType: 1,
            type: 1,
            id: e.currentTarget.dataset.item.commentId,
          };
          LiveData.delComment(param)
            .then((msg) => {
              wx.hideLoading();
              wx.showToast({
                title: "删除成功",
                icon: "none",
                duration: 1500,
              });
              this.comParam.pageNum = 1;
              this.getComment([], 1);
            })
            .catch((err) => {
              if (err.code == -2) {
                /* 帖子已经删除 */
                this.setData({
                  lessonDetail: "",
                  delState: true,
                });
              } else {
                wx.showToast({
                  title: "删除失败，请稍后重试",
                  image: "/images/warn.png",
                  duration: 1500,
                });
              }
            });
        }
      },
    });
  },
  // 语音识别模块
  relacevoice() {
    let text = "",
      voicetext = this.data.voicetext,
      lessDiscussion = this.data.$state.lessDiscussion;
    if (this.data.replyshow) {
      text = this.data.replycontent.replace(voicetext, "");
      this.setData({
        showvoiceauto: false,
        replycontent: text,
        voicetime: 0,
        filePath: "",
      });
      if (this.replyParent) {
        lessDiscussion[this.data.lessonDetail.id].replyParent[
          this.replyParent
        ] = text;
        app.store.setData({
          lessDiscussion,
        });
      } else {
        lessDiscussion[this.data.lessonDetail.id].replyInfo[
          this.replyInfo.id
        ] = text;
        app.store.setData({
          lessDiscussion,
        });
      }
    } else {
      text = this.data.content.replace(voicetext, "");
      this.setData({
        showvoiceauto: false,
        content: text,
        voicetime: 0,
        filePath: "",
      });
      lessDiscussion[this.data.lessonDetail.id] ?
        (lessDiscussion[this.data.lessonDetail.id].replycontent = text) :
        "";
      app.store.setState({
        lessDiscussion,
      });
    }
  },
  closevoiceBox() {
    this.setData({
      showvoice: false,
      write: true,
      showvoiceauto: false,
      voicetime: 0,
    });
  },
  // 语音播放
  playvoice() {
    innerAudioContext.src = this.data.filePath;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      this.setData({
        voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/voicepause.png",
      });
    });
    innerAudioContext.onEnded(() => {
      this.setData({
        voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png",
      });
    });
  },
  // 计时器
  voicetime() {
    clearInterval(this.timer);
    let time = 0;
    this.timer = setInterval(() => {
      time += 1;
      if (!this.data.voiceActon) {
        clearInterval(this.timer);
        return;
      }
      this.setData({
        voicetime: time,
      });
    }, 1000);
  },
  /**
   * 初始化语音识别回调
   */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      clearInterval(this.timer);
      this.setData({
        newtxt: res.result,
        voiceActon: false,
      });
    };

    // 识别结束事件
    manager.onStop = (res) => {
      // 取出录音文件识别出来的文字信息
      clearInterval(this.timer);
      if (!this.data.showvoiceauto) return;
      let text = res.result;
      this.data.replyshow ?
        (text = this.data.replycontent + text) :
        (text = this.data.content + text);
      // 获取音频文件临时地址
      let filePath = res.tempFilePath;
      let duration = res.duration;
      if (res.result == "") {
        this.setData({
          voicetextstatus: "未能识别到文字",
          voiceActon: false,
        });
        return;
      }
      this.data.replyshow ?
        this.setData({
          replycontent: text,
        }) :
        this.setData({
          content: text,
        });
      if (this.data.replyshow) {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.lessonDetail.id] ?
          "" :
          (lessDiscussion[this.data.lessonDetail.id] = {});
        if (this.replyParent) {
          lessDiscussion[this.data.lessonDetail.id]["replyParent"] ?
            "" :
            (lessDiscussion[this.data.lessonDetail.id]["replyParent"] = {});
          lessDiscussion[this.data.lessonDetail.id]["replyParent"][
            this.replyParent
          ] = this.data.replycontent;
        } else if (this.replyInfo) {
          lessDiscussion[this.data.lessonDetail.id]["replyInfo"] ?
            "" :
            (lessDiscussion[this.data.lessonDetail.id]["replyInfo"] = {});
          lessDiscussion[this.data.lessonDetail.id]["replyInfo"][
            this.replyInfo.id
          ] = this.data.replycontent;
        }
        app.store.setState({
          lessDiscussion,
        });
      } else {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.lessonDetail.id] ?
          "" :
          (lessDiscussion[this.data.lessonDetail.id] = {});
        lessDiscussion[this.data.lessonDetail.id][
          "replycontent"
        ] = this.data.content;
        app.store.setState({
          lessDiscussion,
        });
      }
      this.setData({
        voicetext: res.result,
        voicetextstatus: "",
        filePath,
        voiceActon: false,
      });
    };

    // 识别错误事件
    manager.onError = (res) => {
      clearInterval(this.timer);
      this.setData({
        recording: false,
        bottomButtonDisabled: false,
        voiceActon: false,
      });
    };
  },
  touchstart() {
    this.setData({
      voiceActon: true,
      voicetextstatus: "正在语音转文字…",
    });
    this.voicetime();
    manager.start({
      lang: "zh_CN",
    });
  },
  touchend() {
    manager.stop();
    if (this.data.voicetime < 1) {
      wx.showToast({
        title: "说话时间过短",
        icon: "none",
        duration: 2000,
      });
    } else {
      this.setData({
        showvoiceauto: true,
      });
    }
    this.setData({
      voiceActon: false,
    });
  },
  //视频播放功能块
  recordAddVedio() {
    this.videoContext.play();
    this.setData({
      playFlag: true,
    });
  },
  played() {
    //开始播放
  },
  timeupdate() {
    //进度条变化
  },
  videoPause() {
    //暂停播放
    // this.setData({
    //   playFlag: false,
    // });
  },
  ended() {
    //播放结束
    this.setData({
      playFlag: false,
    });
  },
  onShareAppMessage() {
    let lesson_id = this.data.lessonDetail.columnId,
      cover = this.data.lessonDetail.shareCover || this.data.lessonDetail.cover;
    return {
      title: `快来和我一起报名,免费好课天天学!`,
      path: `/page/live/pages/liveDetail/liveDetail?specialColumnId=${lesson_id}&inviter=${this.data.$state.userInfo.id}&liveShare=1`,
      imageUrl: cover,
    };
  },
  liveFull() {
    !this.data.fullScreen ?
      this.liveplayer.requestFullScreen() :
      this.liveplayer.exitFullScreen();
  },
  fullscreenchange(e) {
    console.log(e);
    this.setData({
      fullScreen: e.detail.fullScreen,
    });
  },
});