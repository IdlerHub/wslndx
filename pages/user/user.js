/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: wjl
 * @LastEditTime: 2020-10-30 17:12:55
 */
//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    isRefreshing: false,
    my_score: 0,
    showGuide: true,
  },
  pageName: "个人中心",
  guide: 0,
  onLoad() {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 80,
    });
    let myList = [
        {
          id: 1,
          name: "我的课程",
          page: "/page/live/pages/timetableList/timetableList",
          icon: `${this.data.$state.imgHost}/userIcon/courseIcon.png`,
        },
        {
          id: 9,
          name: "网大商城",
          page: "",
          icon: `${this.data.$state.imgHost}/userIcon/shopIcon1.png`,
          isMini: 1,
          appId: "wx11cabfef2ec771b3",
        },
        {
          id: 9,
          name: "去游学",
          page: "",
          icon: `${this.data.$state.imgHost}/userIcon/travelIcon1.png`,
          isMini: 1,
          appId: "wx185325c684044bbc",
        },
        {
          id: 2,
          name: "我的作品",
          page: "/page/user/pages/myCircle/myCircle",
          icon: `${this.data.$state.imgHost}/userIcon/myworkIcon.png`,
        },
        // {
        //   id: 3,
        //   name: "我的关注",
        //   page: "/page/user/pages/attentionPage/attentionPage",
        //   icon: `${this.data.$state.imgHost}/userIcon/aconicon.png`,
        // },
        {
          id: 5,
          name: "我的收藏",
          page: "/page/user/pages/collection/collection",
          icon: `${this.data.$state.imgHost}/userIcon/usershoucang.png`,
        },
        {
          id: 7,
          name: "我的消息",
          page: "/page/user/pages/usermesseage/usermesseage",
          icon: `${this.data.$state.imgHost}/userIcon/messeageicon.png`,
          isNews: 1,
        },
        {
          id: 6,
          name: "学习历史",
          page: "/page/study/pages/history/history",
          icon: `${this.data.$state.imgHost}/userIcon/myhistoryicon1.png`,
        },
        {
          id: 4,
          name: "加入圈子",
          page: "/page/user/pages/circle/circle?type=1",
          icon: `${this.data.$state.imgHost}/userIcon/useraddquan.png`,
        },
        {
          id: 8,
          name: "APP下载",
          page:
            "/pages/education/education?type=0&url=https://mp.weixin.qq.com/s/vSd8XBQDQkvqVX_kt_YyTQ",
          icon: `${this.data.$state.imgHost}/userIcon/appIcon.png`,
        },
      ],
      moreList = [
        {
          id: 1,
          name: "商务合作",
          page:
            "/pages/education/education?type=0&url=https://mp.weixin.qq.com/s/RBZMIupOHPjb5PeYioy8NQ",
          icon: `${this.data.$state.imgHost}/userIcon/ShapeIcon.png`,
        },
        {
          id: 2,
          name: "体验官申请",
          page: "/page/user/pages/experience/experience",
          icon: `${this.data.$state.imgHost}/experience.png`,
        },
        {
          id: 3,
          name: "联系客服",
          page: "",
          isContact: true,
          icon: `${this.data.$state.imgHost}/userIcon/userkefu.png`,
        },
      ];
    this.setData({
      myList,
      moreList,
    });
  },
  onShow() {
    app.user.pointsinfo().then((res) => {
      this.setData({
        my_score: res.data.mypoints,
      });
    });
    this.getUserOpenid();
    this.unreadNum();
  },
  getUserOpenid() {
    app.user.myIndex().then((res) => {
      app.store.setState({
        userIndex: res.data,
      });
    });
  },
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing: true,
    });

    let timer = setTimeout(() => {
      this.setData({
        isRefreshing: false,
      });
      wx.stopPullDownRefresh();
      clearTimeout(timer);
    }, 1000);
  },
  handleContact(e) {
    // wx.uma.trackEvent("personal_btnClick", {
    //   btnName: this.data.btnList[e.currentTarget.dataset.index].name,
    // });
  },
  toScore() {
    wx.navigateTo({
      url: "/page/user/pages/score/score?type=index",
    });
    wx.uma.trackEvent("personal_btnClick", { btnName: "学分兑换" });
  },
  toInvite() {
    wx.navigateTo({
      url: "/page/user/pages/makeMoney/makeMoney",
      // url: "/pages/invitation/invitation?type=withdraw"
    });
    // wx.uma.trackEvent("personal_btnClick", { btnName: "邀请好友" });
  },
  //用于数据统计
  onUnload() {},
  closeGuide() {
    if (this.guide) return;
    this.guide = true;
    let param = {
      guide_name: "user",
    };
    app.user
      .guideRecordAdd(param)
      .then((res) => {
        app.getGuide();
      })
      .catch(() => {
        this.guide = 0;
        err.msg == "记录已增加" ? app.setState({ "newGuide.user": 1 }) : "";
      });
  },
  drawPage() {
    wx.uma.trackEvent("personal_btnClick", { btnName: "学分抽奖" });
  },
  unreadNum() {
    app.user.unreadNum().then((res) => {
      this.setData({
        showMes: res.data.unread_count,
      });
    });
  },
});
