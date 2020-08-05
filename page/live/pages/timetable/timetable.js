// pages/timetable/timetable.js
const LiveData = require("../../data/LiveData");
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
    noneLessons: true,
    lessons: [],
  },
  scroll: false,
  timer: null,
  onLoad: function (options) {
    this.getLiveLessons().then(() => {
      let cur = new Date().getDay() - 1; //当前周几对应跳转
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
      scrollTopList.push(sum + nowTop);
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
    let _this = this;
    this.timer ? clearTimeout(this.timer) : "";
    this.timer = setTimeout(() => {
      let info = wx.getStorageSync("SystemInfo");
      let { windowHeight = 667 } = info.source.system;
      let query = wx.createSelectorQuery().in(this);
      let tempCur = [];
      query.select(`#week0`).boundingClientRect();
      query.select(`#week1`).boundingClientRect();
      query.select(`#week2`).boundingClientRect();
      query.select(`#week3`).boundingClientRect();
      query.select(`#week4`).boundingClientRect();
      query.exec(function (res) {
        res.forEach((item, index) => {
          if (item.top > 0 && item.top < windowHeight) {
            // 取最小的就是周期
            tempCur.push(index);
          }
        });
        _this.setData({
          currentTab: tempCur[0],
        });
      });
    }, 200);

  },
  scrollTop() {
    //到顶
    this.setData({
      currentTab: 0,
    });
  },
  scrollBottom() {
    //到底
    // this.setData({
    //   currentTab: 4,
    // });
    // this.scroll = false
  },
  onPageScroll(e) {},
});
