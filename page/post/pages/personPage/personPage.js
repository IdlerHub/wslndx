// pages/personPage/personPage.js
const app = getApp();
const record = require('../../../../utils/record')

Page({
  data: {
    list: [],
    showintegral: false,
    playVoice: {
      status: 0,
      duration: 0,
      playTimer: {
        minute: 0,
        second: 0
      },
      id: 0
    }
  },
  pageName: "个人简介页面",
  pageRecord: 1,
  onLoad(options) {
    this.setData({
      us_id: options.uid,
      nickname: options.nickname,
      avatar: options.avatar
    });
    wx.setNavigationBarTitle({
      title: options.nickname
    });
    this.param = { page: 1, pageSize: 10 };
    this.getList([]);
    wx.uma.trackEvent("post_persons", { pageName: "个人风采" });
     getCurrentPages().forEach(v => {
      v.pageName == '秀风采页' ? this.pages = v : ''
    });
  },
  onShow: function() {
    record.initRecord(this)
    let list = this.data.list,
      flowList = this.data.flowList;
    list.forEach(item => {
      if (item.id == app.globalData.detail.id) {
        if (app.globalData.detail.likestatus > 0) {
          item.likes = app.globalData.detail.likes;
          item.likestatus = app.globalData.detail.likestatus;
          item.comments = app.globalData.detail.comments;
        } else {
          item.likes = app.globalData.detail.likes;
          item.comments = app.globalData.detail.comments;
          item.likestatus = app.globalData.detail.likestatus;
        }
      }
    });
    this.setData({
      list
    });
  },
  onHide() {

  },
  onUnload() {
    app.backgroundAudioManager.stop()
  },
  onPullDownRefresh() {
    this.param.page = 1;
    this.setData({
      isRefreshing: true
    });
    this.getList([]).then(() => {
      wx.stopPullDownRefresh();
      let timer = setTimeout(() => {
        this.setData({
          isRefreshing: false
        });
        clearTimeout(timer);
      }, 1000);
    });
  },
  //上拉加载
  onReachBottom() {
    this.param.page++;
    this.getList();
  },
  onShareAppMessage: function(ops, b) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button");
      let i = ops.target.dataset.index;
      let article = this.data.list[i];
      let bkid = article.id;
      app.circle.addForward({ blog_id: bkid }).then(res => {
        let list = this.data.list;
        list[i].forward += 1;
        this.setData({
          list: list
        });
      });
      wx.uma.trackEvent('totalShare', { shareName: '秀风采分享' });
      return {
        title: app.util.delHtmlTag(article.content),
        imageUrl:
          article.image || article.images[0] || "../../images/sharemessage.jpg",
        path:
          "/pages/pDetail/pDetail?id=" +
          bkid +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    }
  },
  getList(list) {
    let temp = list || this.data.list;
    this.param.us_id = this.data.us_id;
    return app.circle.myNews(this.param).then(msg => {
      if (msg.data && msg.data.length > 0) {
        let arr = [];
        for (let i in msg.data) {
          arr.push(msg.data[i]);
        }
        arr.forEach(function(item) {
          item.fw = app.util.tow(item.forward);
          item.cw = app.util.tow(item.comments);
          item.lw = app.util.tow(item.likes);
          item.image_compress = item.images.map(i => {
            return i.image_compress;
          });
          item.images = item.images.map(i => {
            return i.image;
          });
          item.auditing = item.check_status;
          item.content = app.util.delHtmlTag(item.content)
          item.timer = {
            minute: parseInt(item.duration / 60),
            second: item.duration - (parseInt(item.duration / 60) * 60)
          }
        });
        temp.push(...arr);
        temp[0].university_name == "null"
          ? (temp[0].university_name = null)
          : "";
        temp[0].province == "null" ? (temp[0].province = null) : "";
        this.setData({
          list: temp,
          university_name: temp[0].university_name,
          addressCity: temp[0].province,
          isFollow: temp[0].is_follow
        });
      }
      this.setData({
        showLoading: false
      });
    });
  },
  praise(e) {
    let i = e.currentTarget.dataset.index;
    let list = this.data.list;
    let param = {
      blog_id: list[i].id
    };
    if (list[i].likestatus == 1) {
      // 取消点赞
      app.circle
        .delPraise(param)
        .then(msg => {
          list[i].likestatus = 0;
          list[i].likes--;
          this.setData({
            list: list
          });
          this.pages ? this.pages.pagePraise(e.currentTarget.dataset.id) : ''
        })
        .catch(msg => {
          if (msg.code == -2) {
            wx.showToast({
              title: "帖子已删除",
              icon: "none",
              duration: 1500
            });
          }
        });
    } else {
      // 点赞
      app.circle
        .praise(param)
        .then(msg => {
          list[i].likestatus = 1;
          list[i].likes++;
          list[i].praising = true;
          // app.socket.send(list[i].uid)
          app.socket.send({
            type: "Bokemessage",
            data: { uid: list[i].uid }
          });
          if (msg.data.is_first == "first") {
            this.setData({
              integral: "+50 学分",
              integralContent: "完成[秀风采]首次点赞",
              showintegral: true
            });
            setTimeout(() => {
              this.setData({
                showintegral: false
              });
            }, 2000);
          }
          this.setData({
            list: list
          });
          wx.uma.trackEvent("post_btnClick", { btnName: "点赞按钮" });
          this.pages ? this.pages.pagePraise(e.currentTarget.dataset.id) : ''
        })
        .catch(msg => {
          if (msg.code == -2) {
            wx.showToast({
              title: "帖子已删除",
              icon: "none",
              duration: 1500
            });
          }
        });
    }
  },
  aniend(e) {
    var i = e.currentTarget.dataset.index;
    var list = this.data.list;
    list[i].praising = false;
    this.setData({
      list: list
    });
  },
  previewImage(e) {
    let urls = e.currentTarget.dataset.urls;
    let current = e.currentTarget.dataset.current;
    wx.previewImage({
      current: current,
      urls: urls // 需要预览的图片http链接列表
    });
  },
  navigate(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../pDetail/pDetail?id=" + id
    });
  },
  unShare() {
    wx.showToast({
      title: "非常抱歉，不能分享这个内容！",
      icon: "none",
      duration: 1500
    });
  },
  //用户黑名单判断
  handleRelse(status) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content:
          "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理"
      });
    } else {
      status.currentTarget.dataset.type == "reply"
        ? wx.navigateTo({
            url: `/pages/pDetail/pDetail?id= ${status.currentTarget.dataset.id}&comment`
          })
        : wx.navigateTo({
            url: "/pages/release/release"
          });
      wx.uma.trackEvent("post_btnClick", { btnName: "评论按钮" });
    }
  },
  //收藏风采
  collect(e) {
    let blog_id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let blog_index = e.currentTarget.dataset.index;
    this.setData({
      blog_id,
      blog_index
    });
    status == 0
      ? this.setData({
          showSheet: true,
          showSheetBox: true
        })
      : this.setData({
          showSheet: true,
          showSheetBox: false
        });
  },
  cancelCollection() {
    let param = { blog_id: this.data.blog_id };
    app.circle
      .collectCancel(param)
      .then(res => {
        let list = this.data.list;
        list[this.data.blog_index].collectstatus = 0;
        this.pages ? this.pages.pagesCollect(this.data.blog_id, 0) :''
        this.setData({
          list
        });
        wx.showToast({
          title: res.msg,
          icon: "success",
          duration: 800
        });
      })
      .catch(res => {
        wx.showToast({
          title: res.msg,
          image: "/images/warn.png",
          duration: 800
        });
      });
    this.setData({
      showSheet: false
    });
  },
  setCollect() {
    let param = {
      blog_id: this.data.blog_id
    };
    app.circle
      .collect(param)
      .then(res => {
        let list = this.data.list;
        list[this.data.blog_index].collectstatus = 1;
        this.pages ? this.pages.pagesCollect(this.data.blog_id, 1) :''
        this.setData({
          list
        });
        this.closeSheet();
        wx.showToast({
          title: res.msg,
          icon: "success",
          duration: 1500
        });
      })
      .catch(res => {
        this.closeSheet();
        wx.showToast({
          title: res.msg,
          image: "/images/warn.png",
          duration: 1500
        });
      });
  },
  closeSheet() {
    this.setData({
      showSheet: false
    });
  },
  attention() {
    let param = { follower_uid: this.data.us_id };
    app.user.following(param).then(res => {
      wx.showToast({
        title: "您已成功关注" + this.data.nickname,
        icon: "none",
        duration: 1500
      });
      this.setData({
        isFollow: 1
      });
      this.pages ? this.pages.setfollow(this.data.us_id, true) : ''
      getCurrentPages().forEach(v=> {
        v.pageName == "秀风采搜索" ?  v.data.uList.forEach((a,b) => {
          a.id == this.data.us_id ? v.setData({
            [`uList[${b}].is_follow`]: 1
          }) :''
        }) : ''
      })
    });
  },
  clsocancelFollowing() {
    let param = { follower_uid: this.data.us_id },
      that = this;
    wx.showModal({
      content: "是否取消关注？",
      confirmColor: "#DF2020",
      cancelColor: "#999999",
      confirmText: "是",
      cancelText: "否",
      success(res) {
        if (res.confirm) {
          app.user.cancelFollowing(param).then(res => {
            wx.showToast({
              title: "取消关注成功",
              icon: "none",
              duration: 1500
            });
            that.setData({
              isFollow: 0
            });
            that.pages.setfollow(that.data.us_id);
          });
        }
      }
    });
  }
});
