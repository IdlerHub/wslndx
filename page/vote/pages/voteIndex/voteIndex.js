// page/vote/pages/voteIndex/voteIndex.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareMessage: {}, //分享配置信息
    // activityFlag: false, //活动是否结束(获取最新作品那边传入)
    showJump: false, //展示跳转卡片
    jumpUrl: {},
    type: 0, //分类的id
    newProduction: [],
    productionList: [],
    page: 1,
    total_page: 1,
  },
  pageName: "票选活动首页",
  onLoad(ops) {
    this.getOpenId(ops);
    wx.showLoading({
      title: "加载中",
    });
    this.init().then((res) => {
      wx.hideLoading();
      this.getSign();
    });
  },
  init() {
    return Promise.all([this.getdata(1), this.getNewestOpus()]);
  },
  getOpenId(ops) {
    let uid = wx.getStorageSync("userInfo").id;
    if (ops.accounts_openid && ops.accounts_openid != "") {
      wx.setStorageSync("AccountsId", ops.accounts_openid);
    } else if (wx.getStorageSync("AccountsId") == "" && uid) {
      //如果没有公众号的openId
      //跳转去授权页面
      console.log("没有公众号的openid", uid);
      //voteType表示从哪个页面过去请求,之后方便返回
      wx.redirectTo({
        url: `/pages/education/education?voteType=voteIndex&uid=${uid}`,
      });
      return;
    }
  },
  getSign() {
    app.vote
      .getSign()
      .then((res) => {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 1000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  toRule() {
    //跳转到活动规则
    wx.navigateTo({
      url: "/page/vote/pages/voteRule/voteRule",
    });
  },
  toInfo() {
    //领取鲜花页面
    wx.navigateTo({
      url: "/page/vote/pages/voteInfo/voteInfo",
    });
  },
  toDetail(e) {
    console.log(e.currentTarget.dataset);
    //作品详情页
    wx.navigateTo({
      url:
        "/page/vote/pages/voteArticle/voteArticle?voteid=" +
        e.currentTarget.dataset.id +
        "&index=" +
        e.currentTarget.dataset.index,
    });
  },
  toSearch() {
    wx.navigateTo({
      url: "/page/vote/pages/voteSearch/voteSearch",
    });
  },
  setLikeData(index, res) {
    wx.showToast({
      title: res.msg,
      icon: "none",
      duration: 2500,
    });
    let work = this.data.productionList[index];
    // if (work.flowers < 10000) work.flowers += 1;
    work.flowers += 1;
    let key = "productionList[" + index + "]";
    this.setData({
      [key]: work,
      // supportFlag: 0
    });
  },
  giveLike(e) {
    //点赞
    //step1 活动是否过期
    // step2  作品点赞数添加 （修改data中数据），不刷新页面
    let index = e.detail,
      work = this.data.productionList[index],
      openid = wx.getStorageSync("AccountsId");
    let params = {
      teacher_id: work.id, //需要作品带的type
      openid,
    };
    this.praiseOpus(params, index);
  },
  jumpPeper(e) {
    //活动弹窗
    let item = this.data.jumpUrl;
    this.closeJump(); //关闭卡片,跳转
    if (item.type == 1) return; //缺少鲜花
    if (item.jump_type == 1) {
      //外连接
      wx.navigateTo({
        url: `/pages/education/education?type=0&url=${item.clickurl}`,
      });
    } else if (item.jump_type == 2) {
      //小程序的tab页
      wx.switchTab({
        url: item.clickurl,
      });
    } else if (item.jump_type == 4) {
      //小程序内的页面
      wx.navigateTo({
        url: item.clickurl,
      });
    }
  },
  closeJump() {
    this.setData({
      showJump: false,
    });
  },
  getNewestOpus() {
    let flag = false;
    let showCard = {};
    // let activityFlag = false;
    let invite_id = wx.getStorageSync("invite") || 0;
    // type:1 二维码; 2: 分享卡片
    let type = app.globalData.shareObj.f ? app.globalData.shareObj.f : 2;
    console.log("data:", invite_id, type);
    //获取最新作品顶部轮播
    app.vote.getNewestOpus({ invite_id, type }).then((res) => {
      if (res.data.countdown.jump_type) {
        //倒计时
        flag = true;
        showCard = res.data.countdown;
      }
      if (res.data.overinfo.jump_type) {
        //活动结束
        flag = true;
        showCard = res.data.overinfo;
        // activityFlag = true;
      }
      if (res.data.publicinfo.jump_type) {
        //未关注公众号
        flag = true;
        showCard = res.data.publicinfo;
      }
      this.setData({
        newProduction: res.data.list,
        shareMessage: res.data.share_message,
        jumpUrl: showCard,
        showJump: flag,
        // activityFlag,
      });
    });
  },
  getdata(page) {
    // 请求作品列表数据
    var params = {
      page: page,
    };
    let data = [];
    let total_page = 1;
    wx.showLoading({
      title: "加载中",
    });
    app.vote
      .getOpusList(params)
      .then((res) => {
        wx.hideLoading();
        if (page == 1) {
          data = res.data.list;
        } else {
          var oldData = this.data.productionList;
          data = oldData.concat(res.data.list);
        }
        total_page = res.data.total_page;
        this.setData({
          productionList: data,
          page: page,
          // supportFlag: res.data.have_praise,
          total_page: total_page,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  praiseOpus(params, index) {
    app.vote
      .praiseOpus(params)
      .then((res) => {
        if (res.data.type == 1) {
          this.setLikeData(index, res);
        } else {
          this.setData({
            jumpUrl: res.data.jump_info,
            showJump: true,
          });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 2500,
        });
      });
  },
  onShareAppMessage() {
    console.log("分享");
    let uid = wx.getStorageSync("userInfo").id;
    let title = this.data.shareMessage.title,
      imageUrl = this.data.shareMessage.image;
    return {
      title,
      path: "/page/vote/pages/voteIndex/voteIndex?type=share&vote=1&uid=" + uid, // 路径，传递参数到指定页面。
      imageUrl,
    };
  },
  onPullDownRefresh() {
    this.init().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom() {
    let page = this.data.page;
    if (page < this.data.total_page) {
      this.getdata(page + 1);
    } else {
      wx.showToast({
        icon: "none",
        title: "已经没有数据了哦",
        duration: 1000,
      });
    }
  },
});
