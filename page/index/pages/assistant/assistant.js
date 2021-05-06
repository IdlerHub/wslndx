const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        id: 1,
        name: "查看最新公益课",
        url: "/page/index/pages/charityLesson/charityLesson",
        str: '{"id":1,"name":"最新公益课","coverImage":"https://hwcdn.jinlingkeji.cn/uploads/images/3e32bebc9762199043d9d4b676e5e294.png","columnNum":27,"studyNum":35294}'
      },
      {
        id: 2,
        name: "查看我的学校",
        isLogin: 1,
        isUniversity: 1,
        url: "/page/index/pages/schoolLesson/schoolLesson",
      },
      {
        id: 3,
        name: "查看本周课程安排",
        isLogin: 1,
        url: "/page/live/pages/timetableList/timetableList",
      },
      {
        id: 4,
        name: "找最近看过的课程",
        isLogin: 1,
        url: "/page/study/pages/history/history",
      },
      {
        id: 5,
        name: "如何赚取学分",
        isLogin: 1,
        url: "/page/user/pages/score/score",
      },
      {
        id: 6,
        name: "下载网上老年大学APP",
        mpurl: 'https://mp.weixin.qq.com/s/vSd8XBQDQkvqVX_kt_YyTQ'
      },
      {
        id: 7,
        name: "问题反馈",
      },
    ],
    talkList: [],
    userMsg: {}
  },
  isLogin: 1,
  onLoad:async function (options) {
    wx.uma.trackEvent("xiaolinCheck", {
      click: "小林老师",
    });
    await this.getUserOpenid()
    this.getcountVideo()
    let talkList = [{
      id: 1,
      coverurl: "/images/logo.png",
      msg: "您好！我是网上老年大学小林老师，请问有什么可以帮您？",
    }, ];
    wx.getStorageSync("attetionAccounts") || this.data.userMsg.has_mp_openid ?
      talkList.push({
        id: 2,
        coverurl: "/images/logo.png",
        msg: "猜您想选",
        list: this.data.list,
      }) :
      talkList.push({
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
  getUserOpenid() {
    if(!this.data.$state.userInfo.id) return
    return app.user.myIndex().then(res => {
      this.setData({
        userMsg: res.data
      })
    })
  },
  getcountVideo() {
    if(!this.data.$state.userInfo.id) return
    return app.lessonNew.countVideo().then(res => {
      this.setData({
        detail: res.data
      })
    })
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
            wx.uma.trackEvent("xiaolinCheck", {
              click: "关注公众号",
            });
          }
        },
      });
    } else if(item.isUniversity) {
      this.data.detail && this.data.detail.universityId ? wx.navigateTo({
        url: '/page/index/pages/schoolDetail/schoolDetail?id=' + this.data.detail.universityId,
      }) : wx.navigateTo({
        url: '/page/index/pages/schoolLesson/schoolLesson',
      })
    } else {
      console.log(item);
      wx.navigateTo({
        url: item.url + (item.str ? '?str=' + item.str : ''),
      })
    }
  },
  additem(e) {
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index;
    this.data.list.forEach((i) => {
      i.id == item.id ?
        this.data.talkList.push({
          id: Math.ceil(Math.random() * 10),
          coverurl: this.data.$state.userInfo.avatar,
          msg: i.name,
          isRight: 1,
        }) :
        "";
    });
    wx.uma.trackEvent("xiaolinCheck", {
      click: item.name,
    });
    this.setData({
        talkList: this.data.talkList,
      },
      () => {
        this.add(item.id, index);
      }
    );
  },
  add(id, index) {
    this.data.talkList.push(Object.assign({id: Math.ceil(Math.random() * 10),
      coverurl: "/images/logo.png", index, reply: this.data.list[id - 1].name}, this.data.list[id - 1]))
    this.setData({
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
  checknextTap(e) {
    app.checknextTap(e);
  },
});