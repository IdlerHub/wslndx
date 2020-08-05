// pages/liveDetail/liveDetail.js
const LiveData = require("../../data/LiveData");
const app = getApp();
const plugin = requirePlugin("WechatSI");
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager();
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    nav: [
      //课程部分
      {
        name: "剧集",
      },
      {
        name: "讨论",
      },
      {
        name: "简介",
      },
    ],
    showServise: false, //展示客服盒子
    currentTab: 0, //分类
    sort: 0, //排序
    moreSublessons: "moreSublessons",
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
    voicetime: 0,
    showvoiceauto: false,
    voicetextstatus: "",
    content: "",
    voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png",
    current: {}, //当前直播信息
    lessonDetail: {}, //课程详情信息
    sublessons: [], //回放课程列表
    comment: [], //  讨论
    playFlag: false, //视频播放状态
  },
  onLoad: function (options) {
    this.videoContext = wx.createVideoContext("myVideo");
    this.init(options);
    this.heightInit(options);
    this.getLessonDetail(options.lessonId);
    this.getSublesson(options.lessonId);
  },
  onReachBottom() {
    if (this.data.currentTab == 1) {
      this.comParam.page++;
      this.getComment();
    }
  },
  onShow: function () {
    this.initRecord();
    this.getRecordAuth();
    // wx.onNetworkStatusChange((res) => {
    //   res.networkType == "wifi" ? app.playVedio("wifi") : "";
    // });
  },
  //展示客服页面
  showServise() {
    this.setData({
      showServise: !this.data.showServise,
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
      lesson_id: options.lessonId || this.data.lessonDetail.id,
      page: 1,
      pageSize: 10,
    };
    //监听键盘变化
    wx.onKeyboardHeightChange((res) => {
      console.log(111, res);
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
    system == -1
      ? this.setData({
          paddingTop: true,
        })
      : "";
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
        height: scrollViewHeight,
        currentTab: 0,
      });
      if (that.data.$state.newGuide) {
        that.data.$state.newGuide.lesson == 0
          ? this.setData({
              currentTab: 1,
            })
          : "";
      }
    });
  },
  // 权限询问
  authrecord() {
    this.setData({
      focus: false,
    });
    if (this.data.$state.authRecordfail) {
      wx.showModal({
        content:
          "您已拒绝授权使用麦克风录音权限，请打开获取麦克风授权！否则无法使用小程序部分功能",
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
  //获取数据
  getLessonDetail(lesson_id) {
    let _this = this;
    LiveData.getLessonDetail({ lesson_id }).then((res) => {
      wx.setNavigationBarTitle({
        title: res.data.lesson.name || "",
      });
      if (res.data.lesson.is_own == 0) {
        console.log("未拥有课程");
        wx.redirectTo({
          url: `/page/live/pages/tableDetail/tableDetail?lessonId=${res.data.lesson.id}`,
        });
      }
      _this.setData({
        current: res.data.current,
        lessonDetail: res.data.lesson,
      });
      _this.getComment();
    });
  },
  getSublesson(lesson_id) {
    let _this = this;
    LiveData.getSublesson({ lesson_id })
      .then((res) => {
        console.log(res);
        _this.setData({
          sublessons: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  //课程部分功能块
  switchTab(event) {
    //滑动切换
    let cur = event.detail.current;
    this.setData({
      currentTab: cur,
    });
    this.setHeight();
  },
  switchNav(event) {
    //点击切换
    let cur = event.currentTarget.dataset.index;
    console.log(cur);
    if (this.data.currentTab === cur) {
      return;
    } else {
      this.setData({
        currentTab: cur,
      });
    }
    this.setHeight();
  },
  //排序
  order() {
    this.setData({
      sort: this.data.sort === 0 ? 1 : 0,
      scrollviewtop: 0,
    });
    let sublessons = this.data.sublessons;
    sublessons = sublessons.reverse();
    this.setData({
      sublessons,
    });
    setTimeout(() => {
      this.tolesson();
    }, 800);
  },
  setHeight() {
    let that = this;
    if (this.data.currentTab == 1) {
      let query = wx.createSelectorQuery().in(this);
      query.select(".comment").boundingClientRect();
      query.exec((res) => {
        let height = res[0].height - -110;
        height < 100
          ? that.setData({
              height: 700,
            })
          : that.setData({
              height: height,
            });
        if (height == 110) {
          that.setData({
            height: 400,
          });
        }
      });
    } else {
      this.setData({
        height: 306,
      });
    }
  },
  tolesson() {
    let that = this,
      // id = ".sublessonsd" + this.data.lessonDetail.current_sublesson_id;
      id = ".sublessonsd";
    if (this.data.currentTab == 0) {
      let query = wx.createSelectorQuery().in(this);
      query.select(id).boundingClientRect();
      query.exec((res) => {
        res[0]
          ? this.setData({
              scrollviewtop: res[0].top - 520,
            })
          : "";
      });
    }
  },
  // 选择剧集
  select(e, type) {
    let i = 0,
      list = this.data.sublessons;
    if (type != undefined) {
      i = e || 0;
    } else {
      i = e.currentTarget.dataset.index;
      // if (this.data.cur.id == list[i].id) return;
    }
    this.setData({
      cur: list[i],
    });
    wx.nextTick(() => {
      this.recordAddVedio();
    });
  },
  //评论模块
  // 获取讨论
  getComment(list, options) {
    let comment = list || this.data.comment;
    console.log("获取讨论", this.comParam);
    return LiveData.getCommentList(this.comParam)
      .then((msg) => {
        msg.data.forEach(function (item) {
          item.reply_array.forEach((v) => {
            v.rtext = `回复<span  class="respond">${v.to_user}</span>:&nbsp;&nbsp;`;
          });
          comment.push(item);
        });
        this.comment = JSON.parse(JSON.stringify(comment));
        this.setData({
          comment: comment,
        });
        this.setHeight();
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
    let lessonId = this.data.lessonDetail.id;
    if (this.data.replyshow) {
      this.setData({
        replycontent: e.detail.value,
        replycontenLength: e.detail.value.length,
      });
      lessDiscussion[lessonId] ? "" : (lessDiscussion[lessonId] = {});
      if (this.replyParent) {
        lessDiscussion[lessonId]["replyParent"]
          ? ""
          : (lessDiscussion[lessonId]["replyParent"] = {});
        lessDiscussion[lessonId]["replyParent"][
          this.replyParent
        ] = this.data.replycontent;
      } else if (this.replyInfo) {
        lessDiscussion[lessonId]["replyInfo"]
          ? ""
          : (lessDiscussion[lessonId]["replyInfo"] = {});
        lessDiscussion[lessonId]["replyInfo"][
          this.replyInfo.id
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
        content:
          "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
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
        content:
          "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
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
    console.log("看更多的详情");
    // wx.navigateTo({
    //   url:
    //     "/pages/commentDetail/commentDetail?" +
    //     "lesson_id=" +
    //     this.data.lessonDetail.id +
    //     "&comment_id=" +
    //     e.currentTarget.dataset.parentid,
    //   events: {
    //     refreshComments: (data) => {
    //       this.comParam.page = 1;
    //       this.getComment([]);
    //     },
    //   },
    // });
  },
  //展示回复二级/三级评论
  show(e) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content:
          "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
      });
    } else {
      this.setscrollto();
      if (e && e.target.dataset.reply) {
        /* 回复别人的评论 或者 回复别人的回复  */
        this.replyParent = e.target.dataset.parent;
        this.replyInfo = e.target.dataset.reply;
        if (this.replyParent == null) {
          if (this.data.$state.lessDiscussion[this.data.lessonDetail.id]) {
            if (
              this.data.$state.lessDiscussion[this.data.lessonDetail.id]
                .replyInfo
            ) {
              this.data.$state.lessDiscussion[this.data.lessonDetail.id]
                .replyInfo[this.replyInfo.id]
                ? this.setData({
                    replycontent: this.data.$state.lessDiscussion[
                      this.data.lessonDetail.id
                    ].replyInfo[this.replyInfo.id],
                    replyplaceholder:
                      "回复 " + e.currentTarget.dataset.reply.nickname,
                    replycontenLength: this.data.$state.lessDiscussion[
                      this.data.lessonDetail.id
                    ].replyInfo[this.replyInfo.id].length,
                  })
                : this.setData({
                    replycontent: "",
                    replyplaceholder:
                      "回复 " + e.currentTarget.dataset.reply.nickname,
                    replycontenLength: 0,
                  });
            } else {
              this.setData({
                replycontent: "",
                replyplaceholder:
                  "回复 " + e.currentTarget.dataset.reply.nickname,
                replycontenLength: 0,
              });
            }
          } else {
            this.setData({
              replycontent: "",
              replyplaceholder:
                "回复 " + e.currentTarget.dataset.reply.nickname,
              replycontenLength: 0,
            });
          }
        } else if (this.data.$state.lessDiscussion[this.data.lessonDetail.id]) {
          if (
            this.data.$state.lessDiscussion[this.data.lessonDetail.id]
              .replyParent
          ) {
            this.data.$state.lessDiscussion[this.data.lessonDetail.id]
              .replyParent[this.replyParent]
              ? this.setData({
                  replycontent: this.data.$state.lessDiscussion[
                    this.data.lessonDetail.id
                  ].replyParent[this.replyParent],
                  replyplaceholder:
                    "回复 " + e.currentTarget.dataset.reply.from_user,
                  replycontenLength: this.data.$state.lessDiscussion[
                    this.data.lessonDetail.id
                  ].replyParent[this.replyParent].length,
                })
              : this.setData({
                  replycontent: "",
                  replyplaceholder:
                    "回复 " + e.currentTarget.dataset.reply.from_user,
                  replycontenLength: 0,
                });
          } else {
            this.setData({
              replycontent: "",
              replyplaceholder:
                "回复 " + e.currentTarget.dataset.reply.from_user,
              replycontenLength: 0,
            });
          }
        } else {
          this.setData({
            replycontent: "",
            replyplaceholder: "回复 " + e.currentTarget.dataset.reply.from_user,
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
          lesson_id: this.data.lessonDetail.id,
          content: this.data.content,
        };
        this.addComment(param);
      } else if (this.replyParent) {
        /* 回复别人的回复 */
        let params = {
          // lesson_id: +this.data.lessonDetail.id,
          comment_id: this.replyParent,
          // reply_type: 2,
          reply_id: this.replyInfo.reply_id,
          reply_content: this.data.replycontent,
          to_user: this.replyInfo.reply_user_id,
        };
        this.reply(params);
      } else if (this.replyInfo) {
        /* 回复评论 */
        let params = {
          // lesson_id: +this.replyInfo.lesson_id,
          comment_id: this.replyInfo.id,
          // reply_type: 1,
          // reply_id: -1,
          reply_content: this.data.replycontent,
          to_user: this.replyInfo.uid,
        };
        this.reply(params);
      } else {
        let param = {
          lesson_id: this.data.lessonDetail.id,
          content: this.data.content,
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
        this.comParam.page = 1;
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
    });
    LiveData.putReply(params)
      .then((msg) => {
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
          lessDiscussion[this.data.lessonDetail.id].replyParent[
            this.replyParent
          ] = "";
          app.store.setState({
            lessDiscussion,
          });
        } else {
          lessDiscussion[this.data.lessonDetail.id].replyInfo[
            this.replyInfo.id
          ] = "";
          app.store.setState({
            lessDiscussion,
          });
        }
        this.comParam.page = 1;
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
          this.comParam.page = 1;
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
            // lesson_id: this.data.lessonDetail.id,
            // comment_id: e.currentTarget.dataset.parentid,
            reply_id: e.currentTarget.dataset.item.reply_id,
          };
          console.log("删除回复");
          LiveData
            .delReply(params)
            .then((msg) => {
              console.log("删除回复成功")
              wx.hideLoading();
              wx.showToast({
                title: "删除成功",
                icon: "none",
                duration: 1500,
              });
              this.comParam.page = 1;
              this.getComment([]);
            })
            .catch((err) => {
              console.log("删除回复失败",err);
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
            lesson_id: this.data.lessonDetail.id,
            comment_id: e.currentTarget.dataset.item.id,
          };
          console.log("删除评论")
          LiveData.delComment(param)
            .then((msg) => {
              wx.hideLoading();
              wx.showToast({
                title: "删除成功",
                icon: "none",
                duration: 1500,
              });
              this.comParam.page = 1;
              this.getComment([]);
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
      lessDiscussion[this.data.lessonDetail.id]
        ? (lessDiscussion[this.data.lessonDetail.id].replycontent = text)
        : "";
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
      this.data.replyshow
        ? (text = this.data.replycontent + text)
        : (text = this.data.content + text);
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
      this.data.replyshow
        ? this.setData({
            replycontent: text,
          })
        : this.setData({
            content: text,
          });
      if (this.data.replyshow) {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.lessonDetail.id]
          ? ""
          : (lessDiscussion[this.data.lessonDetail.id] = {});
        if (this.replyParent) {
          lessDiscussion[this.data.lessonDetail.id]["replyParent"]
            ? ""
            : (lessDiscussion[this.data.lessonDetail.id]["replyParent"] = {});
          lessDiscussion[this.data.lessonDetail.id]["replyParent"][
            this.replyParent
          ] = this.data.replycontent;
        } else if (this.replyInfo) {
          lessDiscussion[this.data.lessonDetail.id]["replyInfo"]
            ? ""
            : (lessDiscussion[this.data.lessonDetail.id]["replyInfo"] = {});
          lessDiscussion[this.data.lessonDetail.id]["replyInfo"][
            this.replyInfo.id
          ] = this.data.replycontent;
        }
        app.store.setState({
          lessDiscussion,
        });
      } else {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.lessonDetail.id]
          ? ""
          : (lessDiscussion[this.data.lessonDetail.id] = {});
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
      console.log(filePath);
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
    console.log("开始播放");
  },
  timeupdate() {
    //进度条变化
    console.log("进度条变化");
  },
  videoPause() {
    //暂停播放
    console.log("暂停播放");
  },
  ended() {
    //播放结束
    console.log("播放结束");
  },
  onPullDownRefresh: function () {},
  onShareAppMessage() {
    let lesson_id = this.data.lessonDetail.id,
      cover = this.data.lessonDetail.cover;
    let { nickname } = this.data.$state.userInfo;
    return {
      title: `${nickname}分享的课程,不是邀请页面哦`,
      path: `/page/live/pages/liveDetail/liveDetail?lessonId=${lesson_id}`,
      imageUrl: cover,
    };
  },
});
