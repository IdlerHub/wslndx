// pages/timetable/timetable.js
const LiveData = require("../../data/LiveData");
Page({
  data: {
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
    lessons: [
      [
        {
          id: 7,
          name: "美术课",
          description: "美术课",
          cover:
            "https://hwcdn.jinlingkeji.cn/uploads/images/937caf1a361ac4d2bc33dfb931ed622d.jpg",
          teacher: "王老师",
          week: 1,
          start_day: "4月2日",
          end_day: "5月20日",
          strat_time: "10:20",
          end_time: "11:20",
        },
        {
          id: 7,
          name: "美术课",
          description: "美术课",
          cover:
            "https://hwcdn.jinlingkeji.cn/uploads/images/937caf1a361ac4d2bc33dfb931ed622d.jpg",
          teacher: "王老师",
          week: 1,
          start_day: "4月2日",
          end_day: "5月20日",
          strat_time: "10:20",
          end_time: "11:20",
        },
      ],
      [
        {
          id: 7,
          name: "美术课",
          description: "美术课",
          cover:
            "https://hwcdn.jinlingkeji.cn/uploads/images/937caf1a361ac4d2bc33dfb931ed622d.jpg",
          teacher: "王老师",
          week: 1,
          start_day: "4月2日",
          end_day: "5月20日",
          strat_time: "10:20",
          end_time: "11:20",
        },
      ],
      [
        {
          id: 7,
          name: "美术课",
          description: "美术课",
          cover:
            "https://hwcdn.jinlingkeji.cn/uploads/images/937caf1a361ac4d2bc33dfb931ed622d.jpg",
          teacher: "王老师",
          week: 1,
          start_day: "4月2日",
          end_day: "5月20日",
          strat_time: "10:20",
          end_time: "11:20",
        },
        {
          id: 7,
          name: "美术课",
          description: "美术课",
          cover:
            "https://hwcdn.jinlingkeji.cn/uploads/images/937caf1a361ac4d2bc33dfb931ed622d.jpg",
          teacher: "王老师",
          week: 1,
          start_day: "4月2日",
          end_day: "5月20日",
          strat_time: "10:20",
          end_time: "11:20",
        },
      ],
      [
        {
          id: 7,
          name: "美术课",
          description: "美术课",
          cover:
            "https://hwcdn.jinlingkeji.cn/uploads/images/937caf1a361ac4d2bc33dfb931ed622d.jpg",
          teacher: "王老师",
          week: 1,
          start_day: "4月2日",
          end_day: "5月20日",
          strat_time: "10:20",
          end_time: "11:20",
        },
      ],
      [
        {
          id: 7,
          name: "美术课",
          description: "美术课",
          cover:
            "https://hwcdn.jinlingkeji.cn/uploads/images/937caf1a361ac4d2bc33dfb931ed622d.jpg",
          teacher: "王老师",
          week: 1,
          start_day: "4月2日",
          end_day: "5月20日",
          strat_time: "10:20",
          end_time: "11:20",
        },
      ],
    ],
  },
  scroll: false,
  timer: null,
  onLoad: function (options) {
    this.getheight();
    this.getLiveLessons();
  },
  onShow: function () {},
  switchNav(event) {
    let cur = event.currentTarget.dataset.current;
    if (this.data.currentTab != cur) {
      this.setData({
        currentTab: cur,
      });
      this.scroll = true;
      wx.pageScrollTo({
        scrollTop: this.data.topArr[cur],
        duration: 0,
        success: () => {
          this.timer ? clearTimeout(this.timer) : "";
          this.timer = setTimeout(() => {
            this.scroll = false;
          }, 1200);
        },
      });
    }
  },
  getLiveLessons() {  //获取直播课程列表
    LiveData.getLiveLessons().then((res) => {
      this.setData({
        lessons: res.data.lessons,
        nav: res.data.weeks,
      });
    });
  },
  getheight() {
    let query = wx.createSelectorQuery().in(this);
    let that = this,
      heightArr = [],
      topArr = [],
      date = new Date().getDay();
    this.data.nav.forEach((item, index) => {
      query.select(`#text${item.id}`).boundingClientRect();
      query.exec(function (res) {
        heightArr.push(res[index].top + 126);
        topArr.push(res[index].top - 148);
        if (heightArr.length == 5) {
          that.setData({
            anchorArray: heightArr,
            topArr,
          });
          date > 5
            ? ""
            : that.setData(
                {
                  currentTab: date - 1,
                },
                () => {
                  that.scroll = true;
                  wx.pageScrollTo({
                    scrollTop: that.data.topArr[date - 1],
                    duration: 0,
                    success: () => {
                      that.timer ? clearTimeout(that.timer) : "";
                      that.timer = setTimeout(() => {
                        that.scroll = false;
                      }, 1200);
                    },
                  });
                }
              );
        }
      });
    });
  },
  onPageScroll(e) {
    if (this.scroll) return;
    let scrollTop = e.scrollTop,
      scrollArr = this.data.anchorArray;
    for (let i = 0; i < scrollArr.length; i++) {
      if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
        // selectFloorIndex控制筛选块高亮显示
        this.setData({
          currentTab: 0,
        });
      } else if (scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]) {
        this.setData({
          currentTab: i,
        });
      }
    }
  },
});