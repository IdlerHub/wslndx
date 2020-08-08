// pages/timetable/timetable.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    toView: "week0",
    navScrollLeft: 0,
    nav: [
      {
        id: 1,
        name: "周一",
        txt: "星期一",
        index: "item1",
      },
      {
        id: 2,
        name: "周二",
        txt: "星期二",
        index: "item2",
      },
      {
        id: 3,
        name: "周三",
        txt: "星期三",
        index: "item3",
      },
      {
        id: 4,
        name: "周四",
        txt: "星期四",
        index: "item4",
      },
      {
        id: 5,
        name: "周五",
        txt: "星期五",
        index: "item5",
      },
    ],
    currentTab: 0,
    anchorArray: [],
    lessons: [],
  },
  scroll: false,
  timer: null,
  scrollHeight: 0,
  onLoad: function (options) {
    this.init();
  },
  init() {
    return this.getLiveLessons().then(() => {
      let cur = new Date().getDay() - 1; //当前周几对应跳转
      if(cur == 5 || curr == 6){
        cur = 0
      }
      this.setData({
        toView: "week" + cur,
        currentTab: cur,
      });
      // this.getheight();
    });
  },
  getLiveLessons() {
    //获取直播课程列表
    return LiveData.getLiveLessons().then((res) => {
      this.setData({
        lessons: res.data.lessons,
        nav: res.data.weeks,
      });
    });
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current;
    if (this.data.currentTab != cur) {
      this.setData({
        currentTab: cur,
        toView: "week" + cur,
      });
      this.scroll = true;
      this.timer ? clearTimeout(this.timer) : "";
      this.timer = setTimeout(() => {
        this.scroll = false;
      }, 1200);
    }
  },
  getheight() {
    let lessons = this.data.lessons;
    let height = 121; //每个的大小
    let scrollTopList = []; //需要滑动的距离
    let sum = 0;
    // console.log(1111,height)
    lessons.forEach((item, index) => {
      let nowTop = item.length * height;
      scrollTopList.push(sum + nowTop + 54);
      sum += item.length * height;
    });
    this.setData({
      scrollTopList: scrollTopList,
    });
    this.scroll = true;
    this.timer ? clearTimeout(this.timer) : "";
    this.timer = setTimeout(() => {
      this.scroll = false;
    }, 1200);
  },
  controlScroll(e) {
    let nowHeight = e.detail.scrollTop;
    // this.getheight();
    let _this = this;
    // this.timer ? clearTimeout(this.timer) : "";
    // this.timer = setTimeout(() => {
    let info = wx.getStorageSync("SystemInfo");
    if (!info) {
      info = this.fetchAllInfo();
    }
    let { windowHeight = 667 } = info.source.system;
    let query = wx.createSelectorQuery().in(this);
    // let tempCur = [];
    let currentTab = this.data.currentTab;
    query.select(`#week0`).boundingClientRect();
    query.select(`#week1`).boundingClientRect();
    query.select(`#week2`).boundingClientRect();
    query.select(`#week3`).boundingClientRect();
    query.select(`#week4`).boundingClientRect();
    query.exec(function (res) {
      // console.log(_this.scrollHeight, nowHeight);
      if (_this.scrollHeight > nowHeight) {
        //向上滑动
        res[currentTab].top > windowHeight / 2 ? currentTab-- : "";
      } else {
        //向下滑动
        res[currentTab].bottom < 239 ? currentTab++ : "";
      }
      _this.scrollHeight = nowHeight;
      _this.setData({
        currentTab,
      });
      // res.forEach((item, index) => {
      // console.log(index, item);
      // if (item.top > -126 && item.top < _this.data.scrollTopList[index]) {
      //   // 取最小的就是周期
      //   tempCur.push(index);
      // }
      // if (item.top > -195 && item.top < windowHeight / 2) {
      //   tempCur.push(index);
      // }
      // });
      // console.log(tempCur);
      // if (tempCur.length) {
      //   _this.setData({
      //     currentTab: tempCur[0],
      //   });
      // } else {
      //   console.log("还在当前节点中");
      // }
    });
    // }, 200);
  },
  pullDown() {
    this.init()
      .then(() => {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: "刷新完成",
          duration: 1000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  onPullDownRefresh() {
    this.pullDown();
  },
  fetchAllInfo() {
    //没有获取到系统信息的话
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const systemInfo = wx.getSystemInfoSync();

    const statusBarHeight = systemInfo.statusBarHeight;
    const headerHeight =
      (menuButton.top - systemInfo.statusBarHeight) * 2 + menuButton.height;

    let data = {
      source: {
        menu: menuButton,
        system: systemInfo,
      },
      statusBarHeight: statusBarHeight,
      headerHeight: headerHeight,
      headerRight: systemInfo.windowWidth - menuButton.left,
    };

    wx.setStorageSync("SystemInfo", data);
    return data;
  },
  onShareAppMessage() {
    let nickname = this.data.$state.userInfo.nickname;
    return {
      title: `${nickname}邀请您一起来上课`,
      path: "/page/live/pages/timetable/timetable",
      imageUrl: "../../images/shareLive.png",
    };
  },
});
