//index.js
//获取应用实例
const app = getApp();
const plugin = requirePlugin("WechatSI");
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager();
const innerAudioContext = wx.createInnerAudioContext();
var htmlparser = require("../../utils/htmlparser.js");
Page({
  data: {
    sort: 0,
    nav: [
      {
        name: "剧集"
      },
      {
        name: "讨论"
      },
      {
        name: "简介"
      }
    ],
    height: 0,
    tip: true,
    showGuide: true,
    comment: [],
    keyheight: 0,
    write: true,
    comment: [],
    focus: false,
    sublessons: [],
    contenLength: 0,
    replycontenLength: 0,
    moreSublessons: "moreSublessons",
    placeholder: "添加你的评论",
    showvoice: false,
    replycomment: "欢迎发表观点",
    replyplaceholder: "",
    voicetime: 0,
    showvoiceauto: false,
    voicetextstatus: "",
    content: "",
    voivetext: "",
    voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png",
    replyshow: false,
    showintegral: false,
    showServise: false,
    replycontent: '',
    showplece: false,
    /* rect: wx.getMenuButtonBoundingClientRect() */
  },
  pageName: "视频页（视频详情页）",
  videoTime: 0,
  videoInterval:'',
  videoParam:{
    id:'',
    suId:''
  },
  turnOff: {
    guide: 0,
    collect: 0
  },
  onLoad(options) {
    /*todo:考虑去掉that*/
    let that = this;
    this.videoContext = wx.createVideoContext("myVideo");
    this.pages = getCurrentPages();
    let windowHeight = wx.getSystemInfoSync().windowHeight;
    let system = wx.getSystemInfoSync().model.indexOf("iPhone");
    system == -1
      ? this.setData({
        paddingTop: true
      })
      : "";
    let query = wx.createSelectorQuery().in(this);
    query.select("#myVideo").boundingClientRect();
    query.select(".info").boundingClientRect();
    query.select(".nav").boundingClientRect();
    query.exec(res => {
      let videoHeight = res[0].height;
      let infoHeight = res[1].height;
      let navHeight = res[2].height + 10;
      let scrollViewHeight =
        windowHeight - videoHeight - infoHeight - navHeight;
      that.setData({
        vistor: options.type == "share", //游客从分享卡片过来
        height: scrollViewHeight,
        currentTab: 0,
        navScrollLeft: 0,
        id: options.id,
        curid: options.curid || null,
        cur: {}
      });
      if (that.data.$state.newGuide) {
        that.data.$state.newGuide.lesson == 0
          ? this.setData({
            currentTab: 1
          })
          : "";
      }
      if (that.data.vistor) {
        setTimeout(() => {
          that.setData({
            tip: false
          });
        }, 5000);
      }
      this.comParam = this.praParam = {
        lesson_id: options.id || this.data.detail.id,
        page: 1,
        pageSize: 10
      };
      wx.setNavigationBarTitle({
        title: options.name || ""
      });
      if (options.play && !options.lessonid) {
        that.setData({
          hideRecode: true
        });
        that.getDetail(function () {
          wx.nextTick(() => {
            that.recordAdd();
          });
        });
      } else if (options.play && options.lessonid) {
        that.getDetail().then(function () {
          wx.nextTick(() => {
            let index = 0;
            that.data.sublessons.forEach((item, i) => {
              item.id == options.lessonid ? (index = i) : "";
            });
            that.select(index, true);
            setTimeout(() => {
              that.tolesson();
            }, 800);
          });
        });
      } else if (that.data.$state.userInfo.mobile) {
        that.getDetail();
      }
    });
    this.sublessParam = {
      id: options.id || this.data.detail.id,
      page: 1,
      pageSize: 100,
      sort: this.data.sort
    };
    if (this.data.$state.lessDiscussion[options.id]) {
      this.setData({
        content: this.data.$state.lessDiscussion[options.id].replycontent
      });
    }
    wx.onKeyboardHeightChange(res => {
      if (this.data.keyheight == 0) {
        this.setData({
          keyheight: res.height,
          keyHeight: true
        });
      } else {
        res.height > 0
          ? this.setData({
            keyHeight: true
          })
          : this.setData({
            keyHeight: false,
            keyheight: 0,
            write: true,
            writeTow: false
          });
      }
    });
  },
  onShow() {
    if(this.data.$state.userInfo.mobile) {
      app.getGuide().then(() => {
        this.showPlath()
      });
    }
    this.initRecord();
    this.getRecordAuth();
    wx.onNetworkStatusChange(res => {
      res.networkType == 'wifi' ? app.playVedio("wifi") : ''
    })
  },
  onUnload() {
    if (this.data.$state.newGuide) {
      this.data.$state.newGuide.lesson == 0 ? this.closeGuide() : "";
    }
    if(this.videoTime > 0) {
      clearInterval(this.videoInterval)
      let param = {
        lesson_id: this.data.detail.id,
        sublesson_id: this.data.cur.id,
        progress: this.videoTime,
      }
      app.classroom.updateProgress(param).then(res => {
        this.videoTime = 0
        console.log(res.msg)
      })
    }
  },
  onHide() { },
  showPlath(that) {
    if(this.data.$state.userInfo && this.data.$state.userInfo.university.length == 0 && this.data.$state.newGuide.lesson) {
      let plathParam = {
        plath: '',
        shool:'',
      }
      this.setData({
        plathParam,
        showplece:true,
        showToast: false
      })
      this.getPlath()
    }
  },
  onGotUserInfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.updateBase(e)
      e.currentTarget.dataset.type ? wx.navigateTo({
        url: '/pages/makeMoney/makeMoney',
      }) : ''
    }
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current;
    if (this.data.currentTab === cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      });
    }
    this.setHeight();
  },
  switchTab(event) {
    let cur = event.detail.current;
    this.setData({
      currentTab: cur
    });
    this.setHeight();
  },
  getDetail() {
    this.param = {
      id: this.data.id,
      sort: this.data.sort,
      page: 1,
      pageSize: 100
    };
    return app.classroom.detail(this.param).then(msg => {
      msg.data.sublesson.forEach((item, index) => {
        item.minute = (item.film_length / 60).toFixed(0);
        item['index'] = index + 1
      });
      msg.data.intro_content = htmlparser.default(msg.data.intro_content)
      wx.setNavigationBarTitle({
        title: msg.data.title
      });
      this.setData({
        detail: msg.data,
        sublessons: msg.data.sublesson
      });
      this.manage();
      this.getComment();
      setTimeout(() => {
        this.tolesson();
      }, 800);
    });
  },
  setIntegral(integral, integralContent) {
    this.setData({
      integral,
      integralContent,
      showintegral: true
    });
    setTimeout(() => {
      this.setData({
        showintegral: false
      });
    }, 2000);
  },
  played() {
    setTimeout(() => {
      this.vedioRecordAdd()
      this.videoParam = {
        id: this.data.detail.id,
        suId: this.data.cur.id
      }
      this.videoInterval = setInterval(() => {
        this.videoTime ++  
      },1000)
    }, 800)
    wx.uma.trackEvent("lessonsPlay", {
      lessonsName: this.data.detail.title
    });
  },
  ended() {
    this.data.sublessons.forEach(item => {
      item.id == this.data.cur.id ? (item.played = 1) : "";
    });
    this.setData({
      playing: false,
      sublessons: this.data.sublessons
    });
    wx.setStorage({
      key: "lessonProgress",
      data: {
        id: this.data.cur.id,
        time: 0
      }
    });
    let param = {
      lesson_id: this.data.detail.id,
      sublesson_id: this.data.cur.id
    };
    app.classroom.sublessonfinish(param).then(res => {
      if (res.data.is_first == "first") {
        this.setIntegral("+70 学分", "完成首次学习课程");
      } else if (res.data.is_first == "finish") {
        this.setIntegral("+20 学分", "完成学完一门新课程");
      }
      app.classroom.detail(this.param).then(msg => {
        this.setData({
          "detail.progress": msg.data.progress
        });
        if (msg.data.progress == 100) {
          this.pages.forEach(item => {
            item.route == "pages/index/index"
              ? item.doneless(this.data.detail.id)
              : "";
            item.route == "pages/search/search"
              ? item.doneless(this.data.detail.id)
              : "";
          });
        }
      });
    });
  },
  videoPause() {
    clearInterval(this.videoInterval)
    if(this.videoTime == 0) return
    let param = {
      lesson_id: this.videoParam.id,
      sublesson_id: this.videoParam.suId,
      progress: this.videoTime,
    }
    app.classroom.updateProgress(param).then(res => {
      this.videoTime = 0
      console.log(res.msg)
    })
  },
  manage() {
    let detail = this.data.detail;
    let sublesson = this.data.sublessons;
    let current = 0,
      total = sublesson.length,
      cur = {};
    sublesson.forEach(item => {
      if (item.played == 1) {
        current++;
      }
      if (
        item.id == detail.current_sublesson_id ||
        item.id == this.data.curid
      ) {
        cur = item;
      }
    });
    if (detail.current_sublesson_id == 0 && !this.data.curid) {
      cur = detail.sublesson[0];
    }
    this.setData({
      cur: cur
    });
  },
  // 排序
  order() {
    this.setData({
      sort: this.data.sort === 0 ? 1 : 0,
      scrollviewtop: 0
    });
    this.sublessParam.page = 1;
    let sublessons = this.data.sublessons
    if(this.data.sort) {
      sublessons.sort((a, b) => {
        return b.index - a.index
      })
      this.setData({
        sublessons
      })
      setTimeout(() => {
        this.tolesson();
      }, 800);
    } else {
      sublessons.sort((a, b) => {
        return a.index - b.index
      })
      this.setData({
        sublessons
      })
      setTimeout(() => {
        this.tolesson();
      }, 800);
    }
  },
  // 收藏
  collect() {
    /*todo:考虑去掉that*/
    if (this.turnOff.collect) return
    let that = this;
    let param = {
      lesson_id: this.param.id
    };
    if (this.data.detail.collected == 1) {
      wx.showModal({
        title: "",
        content: "是否取消收藏",
        success: function (res) {
          if (res.confirm) {
            that.turnOff.collect = 1
            app.classroom.collectCancel(param).then(msg => {
              that.setData({
                "detail.collected": 0
              });
              that.turnOff.collect = 0
            }).catch(() => {
              that.turnOff.collect = 0
            });
          } else if (res.cancel) {
            return;
          }
        }
      });
    } else {
      this.turnOff.collect = 1
      app.classroom.collect(param).then(msg => {
        this.setData({
          "detail.collected": 1
        });
        this.turnOff.collect = 0
      }).catch(() => {
        this.turnOff.collect = 0
      });
      wx.uma.trackEvent("collectionLessons", {
        lessonsName: this.data.detail.title
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
      if (this.data.cur.id == list[i].id) return;
    }
    this.setData({
      cur: list[i]
    });
    wx.nextTick(() => {
      this.recordAdd();
    });
  },
  recordAdd() {
    let that = this;
    if (this.data.$state.flow) {
      that.recordAddVedio();
    } else {
      wx.getNetworkType({
        success: res => {
          if (res.networkType == 'wifi') {
            app.playVedio("wifi");
            that.recordAddVedio();
          } else {
            wx.showModal({
              content:
                "您当前不在Wi-Fi环境，继续播放将会产生流量，是否选择继续播放?",
              confirmText: "是",
              cancelText: "否",
              confirmColor: "#DF2020",
              success(res) {
                if (res.confirm) {
                  app.playVedio("flow");
                  that.recordAddVedio();
                  wx.offNetworkStatusChange()
                } else if (res.cancel) {
                }
              }
            })
          }
        }
      })
    }
  },
  recordAddVedio() {
    this.getProgress();
    this.videoContext.play();
    this.setData({
      playing: true,
      hideRecode: true
    });
    app.addVisitedNum(`k${this.data.cur.id}`);
  },
  vedioRecordAdd() {
    let param = {
      lesson_id: this.param.id,
      sublesson_id: this.data.cur.id
    };
    app.classroom.recordAdd(param).then(msg => { });
  },
  // 获取讨论
  getComment(list, options) {
    let comment = list || this.data.comment;
    return app.classroom.commentDetail(this.comParam).then(msg => {
      msg.data.forEach(function (item) {
        item.reply_array.forEach(v => {
          v.rtext = `回复<span  class="respond">${v.to_user}</span>:&nbsp;&nbsp;`;
        });
        comment.push(item);
      });
      this.comment = JSON.parse(JSON.stringify(comment));
      this.setData({
        comment: comment
      });
      this.setHeight();
    }).catch(err => {
      if (err.code == -2) {
        /* 帖子已经删除 */
        this.setData({
          detail: "",
          delState: true
        });
      }
    });
  },
  onReachBottom() {
    if (this.data.currentTab == 1) {
      this.comParam.page++;
      this.getComment();
    }
  },
  setHeight() {
    let that = this;
    if (this.data.currentTab == 1) {
      let query = wx.createSelectorQuery().in(this);
      query.select(".comment").boundingClientRect();
      query.exec(res => {
        let height = res[0].height - -110;
        height < 100
          ? that.setData({
            height: 700
          })
          : that.setData({
            height: height
          });
        if (height == 110) {
          that.setData({
            height: 400
          });
        }
      });
    } else {
      this.setData({
        height: 306
      });
    }
  },
  tolesson() {
    let that = this,
      id = ".sublessonsd" + this.data.detail.current_sublesson_id;
    if (this.data.currentTab == 0) {
      let query = wx.createSelectorQuery().in(this);
      query.select(id).boundingClientRect();
      query.exec(res => {
        res[0]
          ? this.setData({
            scrollviewtop: res[0].top - 520
          })
          : "";
      });
    }
  },
  getProgress() {
    var lesson = wx.getStorageSync("lessonProgress");
    if (this.data.cur.id == lesson.id) {
      this.videoContext.seek(lesson.time);
    }
    // if (lesson && lesson[this.data.cur.lesson_id]) {
    //   for (let i in lesson[this.data.cur.lesson_id]) {
    //     i == this.data.cur.id ? this.videoContext.seek(lesson[this.data.cur.lesson_id][i].time) : ''
    //   }
    // }
  },
  timeupdate(e) {
    // let lesson = wx.getStorageSync("lessonProgress")
    // if (lesson) {
    //   if (lesson[this.data.cur.lesson_id]) {
    //     if (lesson[this.data.cur.lesson_id][this.data.cur.lesson_id]) {
    //       for (let i in lesson[this.data.cur.lesson_id]) {
    //         i == this.data.cur.id ? lesson[this.data.cur.lesson_id][i].time = e.detail.currentTime : ''
    //       }
    //       wx.setStorage({
    //         key: "lessonProgress",
    //         data: lesson
    //       })
    //     }else {
    //       lesson[this.data.cur.lesson_id][this.data.cur.id] = { id: this.data.cur.id, time: e.detail.currentTime }
    //       wx.setStorage({
    //         key: "lessonProgress",
    //         data: lesson
    //       })
    //     }
    //   } else {
    //     lesson[this.data.cur.lesson_id] = {}
    //     lesson[this.data.cur.lesson_id][this.data.cur.id] = { id: this.data.cur.id, time: e.detail.currentTime }
    //     wx.setStorage({
    //       key: "lessonProgress",
    //       data: lesson
    //     })
    //   }
    // } else {
    //   let videoTime = {}
    //   videoTime[this.data.cur.lesson_id] = {}
    //   videoTime[this.data.cur.lesson_id][this.data.cur.id] = { id: this.data.cur.id, time: e.detail.currentTime}
    //   wx.setStorage({
    //     key: "lessonProgress",
    //     data: videoTime
    //   })
    // }
    wx.setStorage({
      key: "lessonProgress",
      data: {
        id: this.data.cur.id,
        time: e.detail.currentTime
      }
    });
  },
  // 删除讨论
  delComment: function (e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: "#df2020",
      success: res => {
        if (res.confirm) {
          let param = {
            lesson_id: this.data.detail.id,
            comment_id: e.currentTarget.dataset.item.id
          };
          app.classroom.delComment(param).then(msg => {
            wx.hideLoading();
            wx.showToast({
              title: "删除成功",
              icon: "none",
              duration: 1500
            });
            this.comParam.page = 1;
            this.getComment([]);
          }).catch(err => {
            if (err.code == -2) {
              /* 帖子已经删除 */
              this.setData({
                detail: "",
                delState: true
              });
            } else {
              wx.showToast({
                title: "删除失败，请稍后重试",
                image: "/images/warn.png",
                duration: 1500
              });
            }
          });
        }
      }
    });
  },
  navitor() {
    wx.navigateTo({
      url: "../certificate/certificate?name=" + this.data.detail.title
    });
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      app.classroom.share({
        lesson_id: this.data.id,
        sublesson_id: this.data.cur.id
      });
      return {
        title: this.data.detail.title,
        path:
          "/pages/detail/detail?id=" +
          this.data.id +
          "&curid=" +
          this.data.cur.id +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    }
  },
  tohome: function () {
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },
  // 发布评论
  release(e) {
    if (!!this.data.content.trim() || !!this.data.replycontent.trim()) {
      if (e.currentTarget.dataset.type) {
        let param = {
          lesson_id: this.data.detail.id,
          content: this.data.content
        };
        this.addComment(param);
      } else if (this.replyParent) {
        /* 回复别人的回复 */
        let params = {
          lesson_id: +this.data.detail.id,
          comment_id: this.replyParent,
          reply_type: 2,
          reply_id: this.replyInfo.reply_id,
          reply_content: this.data.replycontent,
          to_user: this.replyInfo.reply_user_id
        };
        this.reply(params);
      } else if (this.replyInfo) {
        /* 回复评论 */
        let params = {
          lesson_id: +this.replyInfo.lesson_id,
          comment_id: this.replyInfo.id,
          reply_type: 1,
          reply_id: -1,
          reply_content: this.data.replycontent,
          to_user: this.replyInfo.uid
        };
        this.reply(params);
      } else {
        let param = {
          lesson_id: this.data.detail.id,
          content: this.data.content
        };
        this.addComment(param);
      }
    }
  },
  // 增加评论
  addComment(param) {
    app.classroom.addComment(param).then(res => {
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
        showvoiceauto: false
      });
      if (res.data.is_first == "day") {
        this.setIntegral("+10 学分", "完成[云课堂]每日课程首次讨论");
      } else {
        wx.showToast({
          title: "评论成功",
          icon: "none",
          duration: 800
        });
      }
      this.comParam.page = 1;
      this.getComment([]);
      let lessDiscussion = this.data.$state.lessDiscussion;
      lessDiscussion[this.data.detail.id].replycontent = "";
      app.store.setState({
        lessDiscussion
      });
    }).catch(() => {
      wx.showToast({
        title: res.msg,
        image: "/images/warn.png",
        duration: 800
      });
    });
  },
  //回复评论
  reply(params) {
    wx.showLoading({
      title: "发布中"
    });
    app.classroom.addReply(params).then(msg => {
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
        showvoiceauto: false
      });
      if (msg.data.is_first == "day") {
        this.setIntegral("+10 学分", "完成[云课堂]每日课程首次讨论");
      } else {
        wx.showToast({
          title: "评论成功",
          icon: "none",
          duration: 800
        });
      }
      let lessDiscussion = this.data.$state.lessDiscussion;
      if (this.replyParent) {
        lessDiscussion[this.data.detail.id].replyParent[this.replyParent] =
          "";
        app.store.setState({
          lessDiscussion
        });
      } else {
        lessDiscussion[this.data.detail.id].replyInfo[this.replyInfo.id] = "";
        app.store.setState({
          lessDiscussion
        });
      }
      this.comParam.page = 1;
      this.getComment([]);
      this.replyInfo = null;
      this.replyParent = null;
    }).catch(err => {
      if (err.code == -2) {
        /* 帖子已经删除 */
        this.setData({
          detail: "",
          delState: true
        });
      } else if (err.code == -3) {
        /* 消息已经删除 */
        wx.showToast({
          title: "消息已删除",
          icon: "none",
          duration: 1500
        });
        this.comParam.page = 1;
        this.getComment([]);
      } else {
        wx.showToast({
          title: msg.msg || "发布失败",
          icon: "none",
          duration: 1500
        });
      }
    });
  },
  /* 删除回复 */
  delReply(e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: "#df2020",
      success: res => {
        if (res.confirm) {
          let params = {
            lesson_id: this.data.detail.id,
            comment_id: e.currentTarget.dataset.parentid,
            id: e.currentTarget.dataset.item.reply_id
          };
          app.classroom.delReply(params).then(msg => {
            wx.hideLoading();
            wx.showToast({
              title: "删除成功",
              icon: "none",
              duration: 1500
            });
            this.comParam.page = 1;
            this.getComment([]);
          }).catch(err => {
            if (err.code == -2) {
              /* 帖子已经删除 */
              this.setData({
                detail: "",
                delState: true
              });
            } else {
              wx.showToast({
                title: "删除失败，请稍后重试",
                image: "/images/warn.png",
                duration: 1500
              });
            }
          });
        }
      }
    });
  },
  input(e) {
    if (this.data.replyshow) {
      this.setData({
        replycontent: e.detail.value,
        replycontenLength: e.detail.value.length
      });
      let lessDiscussion = this.data.$state.lessDiscussion;
      lessDiscussion[this.data.detail.id]
        ? ""
        : (lessDiscussion[this.data.detail.id] = {});
      if (this.replyParent) {
        lessDiscussion[this.data.detail.id]["replyParent"]
          ? ""
          : (lessDiscussion[this.data.detail.id]["replyParent"] = {});
        lessDiscussion[this.data.detail.id]["replyParent"][
          this.replyParent
        ] = this.data.replycontent;
      } else if (this.replyInfo) {
        lessDiscussion[this.data.detail.id]["replyInfo"]
          ? ""
          : (lessDiscussion[this.data.detail.id]["replyInfo"] = {});
        lessDiscussion[this.data.detail.id]["replyInfo"][
          this.replyInfo.id
        ] = this.data.replycontent;
      }
      app.store.setState({
        lessDiscussion
      });
    } else {
      this.setData({
        content: e.detail.value,
        contenLength: e.detail.value.length
      });
      let lessDiscussion = this.data.$state.lessDiscussion;
      lessDiscussion[this.data.detail.id]
        ? ""
        : (lessDiscussion[this.data.detail.id] = {});
      lessDiscussion[this.data.detail.id]["replycontent"] = this.data.content;
      app.store.setState({
        lessDiscussion
      });
    }
  },
  toCommentDetail(e) {
    let vm = this;
    wx.navigateTo({
      url:
        "/pages/commentDetail/commentDetail?" +
        "lesson_id=" +
        this.data.detail.id +
        "&comment_id=" +
        e.currentTarget.dataset.parentid,
      events: {
        refreshComments: data => {
          this.comParam.page = 1;
          this.getComment([]);
        }
      }
    });
  },
  show(e) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content:
          "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理"
      });
    } else {
      this.setscrollto();
      if (e && e.target.dataset.reply) {
        /* 回复别人的评论 或者 回复别人的回复  */
        this.replyParent = e.target.dataset.parent;
        this.replyInfo = e.target.dataset.reply;
        if (this.replyParent == null) {
          if (this.data.$state.lessDiscussion[this.data.detail.id]) {
            if (
              this.data.$state.lessDiscussion[this.data.detail.id].replyInfo
            ) {
              this.data.$state.lessDiscussion[this.data.detail.id].replyInfo[
                this.replyInfo.id
              ]
                ? this.setData({
                  replycontent: this.data.$state.lessDiscussion[
                    this.data.detail.id
                  ].replyInfo[this.replyInfo.id],
                  replyplaceholder:
                    "回复 " + e.currentTarget.dataset.reply.nickname,
                  replycontenLength: this.data.$state.lessDiscussion[
                    this.data.detail.id
                  ].replyInfo[this.replyInfo.id].length
                })
                : this.setData({
                  replycontent: "",
                  replyplaceholder:
                    "回复 " + e.currentTarget.dataset.reply.nickname,
                  replycontenLength: 0
                });
            } else {
              this.setData({
                replycontent: "",
                replyplaceholder:
                  "回复 " + e.currentTarget.dataset.reply.nickname,
                replycontenLength: 0
              });
            }
          } else {
            this.setData({
              replycontent: "",
              replyplaceholder:
                "回复 " + e.currentTarget.dataset.reply.nickname,
              replycontenLength: 0
            });
          }
        } else if (this.data.$state.lessDiscussion[this.data.detail.id]) {
          if (
            this.data.$state.lessDiscussion[this.data.detail.id].replyParent
          ) {
            this.data.$state.lessDiscussion[this.data.detail.id].replyParent[
              this.replyParent
            ]
              ? this.setData({
                replycontent: this.data.$state.lessDiscussion[
                  this.data.detail.id
                ].replyParent[this.replyParent],
                replyplaceholder:
                  "回复 " + e.currentTarget.dataset.reply.from_user,
                replycontenLength: this.data.$state.lessDiscussion[
                  this.data.detail.id
                ].replyParent[this.replyParent].length
              })
              : this.setData({
                replycontent: "",
                replyplaceholder:
                  "回复 " + e.currentTarget.dataset.reply.from_user,
                replycontenLength: 0
              });
          } else {
            this.setData({
              replycontent: "",
              replyplaceholder:
                "回复 " + e.currentTarget.dataset.reply.from_user,
              replycontenLength: 0
            });
          }
        } else {
          this.setData({
            replycontent: "",
            replyplaceholder: "回复 " + e.currentTarget.dataset.reply.from_user
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
        replyshow: true
      });
    }
  },
  setscrollto() {
    let query = wx.createSelectorQuery().in(this);
    query.select(".container").boundingClientRect();
    query.exec(res => {
      if (res[0].top > -100) {
        wx.pageScrollTo({
          scrollTop: 250
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
        confirmColor: "#df2020"
      });
    } else {
      if (!e.target.dataset.type) {
        this.setData({
          showvoice: true,
          write: false,
          writeTow: false
        });
      } else {
        this.setData({
          showvoice: true,
          write: false,
          writeTow: false,
          replyshow: false
        });
        this.replyInfo = null;
        this.replyParent = null;
      }
    }
  },
  showWrite(e) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content:
          "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
        confirmColor: "#df2020"
      });
    } else {
      if (this.data.replyshow && e.currentTarget.dataset.type == "voice") {
        this.setData({
          write: false,
          showvoice: false,
          writeTow: true,
          focus: true,
          showvoiceauto: false,
          voicetime: 0,
          replycontenLength: this.data.replycontent.length || 0
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
          contenLength: this.data.content.length || 0
        });
        this.replyInfo = null;
        this.replyParent = null;
        let system = {};
        wx.getSystemInfo({
          success: res => {
            system = res;
          }
        });
        if (system.screenHeight <= 700) this.setscrollto();
      }
    }
  },
  bindblur() {
    this.setData({
      keyHeight: false,
      keyheight: 0,
      write: true,
      writeTow: false
    });
  },
  closeGuide() {
    if (this.turnOff.guide) return
    this.turnOff.guide = true
    let param = {
      guide_name: "lesson"
    };
    app.user.guideRecordAdd(param).then(res => {
      app.getGuide().then(() => {
        this.showPlath(this)
      });
      this.setIntegral("+45 学分", "完成[云课堂]新手指引");
    }).catch(() => {
      this.turnOff.guide = 0
    });
  },
  // 语音
  // 权限询问
  authrecord() {
    this.setData({
      focus: false
    });
    if (this.data.$state.authRecordfail) {
      wx.showModal({
        content:
          "您已拒绝授权使用麦克风录音权限，请打开获取麦克风授权！否则无法使用小程序部分功能",
        confirmText: "去授权",
        confirmColor: "#df2020",
        success: res => {
          if (res.confirm) {
            wx.openSetting({});
          }
        }
      });
    }
    if (!this.data.$state.authRecord) {
      wx.authorize({
        scope: "scope.record",
        success() {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          app.store.setState({
            authRecord: true
          });
        },
        fail() {
          app.store.setState({
            authRecordfail: true
          });
        }
      });
    }
  },
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        let record = res.authSetting["scope.record"];
        app.store.setState({
          authRecord: record || false
        });
      },
      fail(res) {
      }
    });
  },
  /**
   * 初始化语音识别回调
   */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = res => {
      clearInterval(this.timer);
      this.setData({
        newtxt: res.result,
        voiceActon: false
      });
    };

    // 识别结束事件
    manager.onStop = res => {
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
          voiceActon: false
        });
        return;
      }
      this.data.replyshow
        ? this.setData({
          replycontent: text
        })
        : this.setData({
          content: text
        });
      if (this.data.replyshow) {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.detail.id]
          ? ""
          : (lessDiscussion[this.data.detail.id] = {});
        if (this.replyParent) {
          lessDiscussion[this.data.detail.id]["replyParent"]
            ? ""
            : (lessDiscussion[this.data.detail.id]["replyParent"] = {});
          lessDiscussion[this.data.detail.id]["replyParent"][
            this.replyParent
          ] = this.data.replycontent;
        } else if (this.replyInfo) {
          lessDiscussion[this.data.detail.id]["replyInfo"]
            ? ""
            : (lessDiscussion[this.data.detail.id]["replyInfo"] = {});
          lessDiscussion[this.data.detail.id]["replyInfo"][
            this.replyInfo.id
          ] = this.data.replycontent;
        }
        app.store.setState({
          lessDiscussion
        });
      } else {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.detail.id]
          ? ""
          : (lessDiscussion[this.data.detail.id] = {});
        lessDiscussion[this.data.detail.id]["replycontent"] = this.data.content;
        app.store.setState({
          lessDiscussion
        });
      }
      this.setData({
        voicetext: res.result,
        voicetextstatus: "",
        filePath,
        voiceActon: false
      });
    };

    // 识别错误事件
    manager.onError = res => {
      clearInterval(this.timer);
      this.setData({
        recording: false,
        bottomButtonDisabled: false,
        voiceActon: false
      });
    };
  },
  touchstart() {
    this.setData({
      voiceActon: true,
      voicetextstatus: "正在语音转文字…"
    });
    this.voicetime();
    manager.start({
      lang: "zh_CN"
    });
  },
  touchend() {
    manager.stop();
    if (this.data.voicetime < 1) {
      wx.showToast({
        title: "说话时间过短",
        icon: "none",
        duration: 2000
      });
    } else {
      this.setData({
        showvoiceauto: true
      });
    }
    this.setData({
      voiceActon: false
    });
  },
  // 语音播放
  playvoice() {
    innerAudioContext.src = this.data.filePath;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      this.setData({
        voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/voicepause.png"
      });
    });
    innerAudioContext.onEnded(() => {
      this.setData({
        voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png"
      });
    });
  },
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
        filePath: ""
      });
      if (this.replyParent) {
        lessDiscussion[this.data.detail.id].replyParent[
          this.replyParent
        ] = text;
        app.store.setData({
          lessDiscussion
        });
      } else {
        lessDiscussion[this.data.detail.id].replyInfo[this.replyInfo.id] = text;
        app.store.setData({
          lessDiscussion
        });
      }
    } else {
      text = this.data.content.replace(voicetext, "");
      this.setData({
        showvoiceauto: false,
        content: text,
        voicetime: 0,
        filePath: ""
      });
      lessDiscussion[this.data.detail.id]
        ? (lessDiscussion[this.data.detail.id].replycontent = text)
        : "";
      app.store.setState({
        lessDiscussion
      });
    }
  },
  closevoiceBox() {
    this.setData({
      showvoice: false,
      write: true,
      showvoiceauto: false,
      voicetime: 0
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
        voicetime: time
      });
    }, 1000);
  },
  /*长按复制内容 */
  copythat(e) {
    app.copythat(e.target.dataset.content);
    if (e.target.dataset.type == "comment") {
      this.data.comment[e.target.dataset.index].content =
        "<span style='background:#f6eeee'>" +
        this.data.comment[e.target.dataset.index].content +
        "</span>";
      this.setData({
        comment: this.data.comment
      });
      setTimeout(() => {
        this.data.comment[e.target.dataset.index].content = this.comment[
          e.target.dataset.index
        ].content;
        this.setData({
          comment: this.data.comment
        });
      }, 2500);
    } else {
      this.data.comment[e.target.dataset.index].reply_array[
        e.target.dataset.chilindex
      ].reply_content =
        "<span style='background:#f6eeee'>" +
        this.data.comment[e.target.dataset.index].reply_array[
          e.target.dataset.chilindex
        ].reply_content +
        "</span>";
      this.setData({
        comment: this.data.comment
      });
      setTimeout(() => {
        this.data.comment[e.target.dataset.index].reply_array[
          e.target.dataset.chilindex
        ].reply_content = this.comment[e.target.dataset.index].reply_array[
          e.target.dataset.chilindex
        ].reply_content;
        this.setData({
          comment: this.data.comment
        });
      }, 2500);
    }
  },
  copySynopsis() {
    let content = this.data.detail.intro_content, txt = ''
    if(Array.isArray(content)) {
      content.forEach(item => {
        item.children[0]['text'] ? txt = txt + item.children[0]['text'] : 
        item.children[0]['children'] ? item.children[0]['children'][0]['text'] ? txt = txt + item.children[0]['children'][0]['text'] : '' : ''
      })
      txt = txt.replace(/&nbsp;/g,'')
      app.copythat(txt)
    } else {
      app.copythat(content)
    }
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.item.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      });
    } else {
      if (!e.currentTarget.dataset.type) {
        wx.navigateTo({
          url: `/pages/personPage/personPage?uid=${e.currentTarget.dataset.item.uid}&nickname=${e.currentTarget.dataset.item.nickname}&avatar=${e.currentTarget.dataset.item.avatar}`
        });
      } else {
        wx.navigateTo({
          url: `/pages/personPage/personPage?uid=${e.currentTarget.dataset.item.reply_user_id}&nickname=${e.currentTarget.dataset.item.from_user}&avatar=${e.currentTarget.dataset.item.from_user_avatar}`
        });
      }
    }
  },
  //客服盒子
  showServise() {
    this.data.showServise ? this.setData({
      showServise: false
    }) : this.setData({
      showServise: true
    })
  },
  closeShool() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  getPlath() {
    this.getProvince().then(() => {
      this.getCity().then(() => {
        this.getSchool().then(() => {
          let index1 = 0 , index2 = 0, index3 = 0
          this.setData({
            multiAddress: [this.province, this.city],
            multiIndex: [index1, index2],
            singleSchool: this.school,
            singleIndex: index3
          })
        })
      })
    })
  },
  getProvince() {
    let param = { level: 1 }
    return app.user.search(param).then(msg => {
      msg.data.push('暂无')
      this.province = msg.data
    })
  },
  getCity(val) {
    let param = { level: 2, name: val || this.province[0] }
    return app.user.search(param).then(msg => {
      msg.data.push('暂无')
      this.city = msg.data
    })
  },
  getSchool(val) {
    let param = { level: 3, name: val || this.city[0] }
    return app.user.search(param).then(msg => {
      this.school = msg.data
    })
  },
  bindMultiPickerColumnChange(e) {
    let temp = this.data.multiIndex
    let col = e.detail.column
    let val = e.detail.value
    temp[col] = val
    switch (col) {
      case 0:
        if(this.province[val] == '暂无') {
          this.setData({
            "multiAddress[1]": ['暂无'],
          })
        } else {
          this.getCity(this.province[val]).then(() => {
            this.getSchool().then(() => {
              temp[1] = 0
              this.setData({
                "multiAddress[1]": this.city,
                multiIndex: temp,
                singleSchool: this.school,
                singleIndex: 0
              })
            })
          })
        }
        break
      case 1:
        if(this.city[val] == '暂无') {
          this.school = ['暂无']
          this.setData({
            singleSchool: ['暂无'],
            singleIndex: 0
          })
        } else {
          this.getSchool(this.city[val]).then(() => {
            this.setData({
              singleSchool: this.school,
              singleIndex: 0
            })
          })
        }
        break
    }
  },
  bindMultiPickerChange(e) {
    let arr = e.detail.value
    this.province[arr[0]] == '暂无' || this.city[arr[1]] == '暂无' ? this.setData({
      "plathParam.plath": '暂无'
    }) : this.setData({
      "plathParam.plath": this.province[arr[0]] + this.city[arr[1]]
    })
  },
  bindSchool(e) {
    let index = e.detail.value
    this.school[index]
    this.setData({
      "plathParam.shool": this.school[index]
    })
  },
  tipOrder(type) {
    if (this.data.plathParam.plath.length == 0) {
      wx.showToast({
        title: "请先选择地区",
        icon: "none",
        duration: 1500,
        mask: false
      })
    } else if(this.data.plathParam.shool.length == 0 && this.data.plathParam.plath != '暂无' && type == 1) {
      wx.showToast({
        title: "请先选择学校",
        icon: "none",
        duration: 1500,
        mask: false
      })
    } else if(type == 1){
      app.user.schoolWrite().then(() => {
        this.setData({
          showplece: false,
          showToast: true
        })
        this.closeToast()
      })
    }
  },
  submit() {
    if(this.data.plathParam.plath.length == 0 || this.data.plathParam.shool.length == 0) {
      this.tipOrder(1)
    } else {
      let param = {
        university: this.data.plathParam.shool,
      } 
      app.user.profile(param).then(msg => {
        app.setUser(msg.data.userInfo)
        this.setData({
          showplece: false,
          showToast: true
        })
        this.closeToast()
      })
    }
  },
  closeToast() {
   this.Toastimer = setTimeout(() => {
      this.setData({
        showToast: false
      })
      clearTimeout(this.Toastimer)
    }, 1500)
  }
});
