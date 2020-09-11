Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 1,
        name: "选课中心",
      },
      {
        id: 2,
        name: "寻找老师进班群",
      },
      {
        id: 3,
        name: "查看本周课程安排",
      },
      {
        id: 4,
        name: "下载网上老年大学APP",
      },
      {
        id: 5,
        name: "找最近看过的课程",
      },
      {
        id: 6,
        name: "问题反馈",
      },
    ],
    mpurlList: [
      "",
      "https://mp.weixin.qq.com/s/y3mAB8Kws2mkdGZQEjxBKQ",
      "",
      "https://mp.weixin.qq.com/s/vSd8XBQDQkvqVX_kt_YyTQ",
    ],
    talkList: [],
  },
  onLoad: function (options) {
    let talkList = [
      {
        id: 1,
        coverurl: "/images/logo.png",
        msg: "您好！我是网上老年大学小林老师，请问有什么可以帮您？",
      },
    ];
    wx.getStorageSync("attetionAccounts")
      ? talkList.push({
          id: 2,
          coverurl: "/images/logo.png",
          msg: "猜您想选",
          list: this.data.list,
        })
      : talkList.push({
          id: 2,
          coverurl: "/images/logo.png",
          msg: "您还未关注【网上老年大学】公众号，点击关注解决您的问题",
          showBtn: 1,
          mpurl: "https://mp.weixin.qq.com/s/bdGLXj6u6aOGVNh2owTjgA",
        });
    this.setData({
      talkList,
    });
  },
  toEducation(e) {
    let item = e.currentTarget.dataset.item;
    if (item.mpurl) {
      wx.navigateTo({
        url: `/pages/education/education?type=0&url=${item.mpurl}`,
        success: () => {
          if (!wx.getStorageSync("attetionAccounts")) {
            wx.setStorage({
              key: "attetionAccounts",
              data: 1,
            });
            this.data.talkList.pop();
            this.data.talkList.push({
              id: 2,
              coverurl: "/images/logo.png",
              msg: "猜您想选",
              list: this.data.list,
            });
            this.setData({
              talkList: this.data.talkList,
            });
          }
        },
      });
    } else {
      console.log(item.index);
      switch (item.index) {
        case 0:
          wx.navigateTo({
            url: "/page/live/pages/liveCenter/liveCenter",
          });
          break;
        case 2:
          wx.navigateTo({
            url: "/page/live/pages/timetable/timetable",
          });
          break;
        case 4:
          wx.navigateTo({
            url: "/page/user/pages/history/history",
          });
          break;
        
      }
    }
  },
  additem(e) {
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index;
    this.data.list.forEach((i) => {
      i.id == item.id
        ? this.data.talkList.push({
            id: Math.ceil(Math.random() * 10),
            coverurl: this.data.$state.userInfo.avatar,
            msg: i.name,
            isRight: 1,
          })
        : "";
    });
    this.setData(
      {
        talkList: this.data.talkList,
      },
      () => {
        this.add(item.id, index);
      }
    );
  },
  add(id, index) {
    this.data.talkList.push({
      id: Math.ceil(Math.random() * 10),
      coverurl: "/images/logo.png",
      mpurl: this.data.mpurlList[id - 1],
      reply: this.data.list[id - 1].name,
      index: index,
    });
    this.setData(
      {
        talkList: this.data.talkList,
      },
      () => {
        wx.pageScrollTo({
          scrollTop: 100000,
          duration: 0,
        });
      }
    );
  },
});