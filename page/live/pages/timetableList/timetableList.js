// pages/timetableList/timetableList.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    courseList: [],
    schoolLesson: [],
    weekList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    freeWeeks: [],
    schoolWeeks: [],
    today: '',
    page: 1,
    current: {
      free: 0,
      school: 0,
    },
    month: {
      free: 0,
      school: 0,
    },
    freePageEnd: false,
    schollPageEnd: false,
    dataCurrent: 0,
  },
  onLoad: function (options) {
    // this.getLessonWeeks()
    let systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      universityId: options.id || null
    })
    this.params = {
      date: '',
      pageSize: 20,
      pageNum: 1,
      type: 1
    }
    this.shoolParams = {
      date: '',
      pageSize: 20,
      pageNum: 1,
      type: 3
    }
    this.options.type ? this.params['universityId'] = options.id : ''
    this.getWeekDate()
  },
  getWeekDate() {
    let dateOfToday = Date.now()
    let dayOfToday = (new Date().getDay() + 7 - 1) % 7
    let weeks = Array.from(new Array(7))
      .map((_, i) => {
        let date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
        return {
          name: this.data.weekList[i],
          week: i + 1,
          title: date.getFullYear() + '年' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
          day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
          date: date.getFullYear() +
            '-' +
            ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
            '-' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
          is_today: dayOfToday == i ? 1 : 0
        }
      })
    this.setData({
      freeWeeks: weeks,
      schoolWeeks: weeks
    }, () => {
      weeks.forEach((e, i) => {
        e.is_today ? [this.setData({
          current: {
            free: i,
            school: i,
          },
          month: {
            free: e.title,
            school: e.title,
          },
          today: e.date
        }), this.getUserLessons(e.date), this.getSchoolLesson(e.date)] : ''
      })
    })
  },
  toDetail(e) {
    if (!e.currentTarget.dataset.status || e.currentTarget.dataset.status == 1) {
      wx.navigateTo({
        url: "/page/live/pages/vliveRoom/vliveRoom?roomId=" + e.currentTarget.dataset.liveid,
      });
    } else {
      let url = ''
      LiveData.getLiveBySpecialColumnId({
        specialColumnId: e.currentTarget.dataset.lessonId
      }).then(res => {
        res.data.isAddSubscribe ? url = "/page/live/pages/liveDetail/liveDetail?specialColumnId=" +
          e.currentTarget.dataset.lessonId : url =
          "/page/live/pages/tableDetail/tableDetail?specialColumnId=" +
          e.currentTarget.dataset.lessonId
        wx.navigateTo({
          url,
        });
      })
    }
  },
  getUserLessons(date) {
    this.params.date = new Date(date).valueOf()
    let list = this.data.courseList
    if (this.params.universityId) {
      return LiveData.freeDate(this.params).then((res) => {
        list.push(...res.dataList)
        this.setData({
          courseList: list,
          freePageEnd: res.dataList.length < 10 ? 1 : 0
        });
      });
    } else {
      return LiveData.newUserLessons(this.params).then((res) => {
        list.push(...res.dataList)
        this.setData({
          courseList: list,
          freePageEnd: res.dataList.length < 10 ? 1 : 0
        });
      });
    }
  },
  getSchoolLesson(date) {
    this.shoolParams.date = new Date(date).valueOf()
    let list = this.data.schoolLesson
    return LiveData.freeDate(this.shoolParams).then((res) => {
      list.push(...res.dataList)
      this.setData({
        schoolLesson: list,
        pageEnd: res.dataList.length < 10 ? 1 : 0
      });
    });
  },
  reachBottom() {
    if (this.data.dataCurrent) {
      if (this.data.schollPageEnd) return
      this.shoolParams.pageNum++
      this.getSchoolLesson(this.data.schoolWeeks[this.data.current.school].date)
    } else {
      if (this.data.freePageEnd) return
      this.params.pageNum++
      this.getUserLessons(this.data.freeWeeks[this.data.current.free].date)
    }
  },
  onPullDownRefresh() {
    this.params.date = ''
    this.params.pageNum = 1
    this.setData({
      courseList: [],
      pageEnd: 0
    })
    this.getUserLessons(this.data.freeWeeks[this.data.current].date).then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: "刷新完成",
        duration: 1000,
      });
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "button") {
      let item = ops.target.dataset.item;
      return {
        title: item.liveName,
        imageUrl: item.indexCover,
        path: "/page/live/pages/liveDetail/liveDetail?specialColumnId=" +
          item.columnId
      };
    } else {
      return this.menuAppShare();
    }
  },
  checkCurrent(e) {
    this.setData({
      [this.data.dataCurrent ? 'current.school' : 'current.free']: e.currentTarget.dataset.index,
      [this.data.dataCurrent ? 'month.school' : 'month.free']: e.currentTarget.dataset.month,
      [this.data.dataCurrent ? 'schoolLesson' : 'courseList']: [],
      [this.data.dataCurrent ? 'schollPageEnd' : 'pageEnd']: 0,
    }, () => {
      if (this.data.dataCurrent) {
        this.shoolParams.date = ''
        this.shoolParams.pageNum = 1
        this.getSchoolLesson(this.data.schoolWeeks[this.data.current.school].date)
      } else {
        this.params.date = ''
        this.params.pageNum = 1
        this.getUserLessons(this.data.freeWeeks[this.data.current.free].date)
      }
    })
  },
  getPewWeeks(date) {
    // 一天里一共的毫秒数
    let oneDayTime = 1000 * 60 * 60 * 24
    let today = new Date(date)
    // 若那一天是周末时，则强制赋值为7
    let todayDay = today.getDay() || 7
    let startDate = new Date(
      today.getTime() - oneDayTime * (todayDay - 1)
    )
    let weeks = Array.from(new Array(7))
      .map((_, i) => {
        let temp = new Date(startDate.getTime() + i * oneDayTime)
        let date = temp.getFullYear() +
          '-' +
          ((temp.getMonth() + 1) < 10 ? '0' + (temp.getMonth() + 1) : (temp.getMonth() + 1)) +
          '-' +
          (temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate())
        return {
          name: this.data.weekList[i],
          week: i + 1,
          title: temp.getFullYear() + '年' + ((temp.getMonth() + 1) < 10 ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1),
          day: temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate(),
          date,
          is_today: date == this.data.today ? 1 : 0
        }
      })
    return weeks
  },
  pickerChange(e) {
    let date = e.detail.value
    this.setData({
      [this.data.dataCurrent ? 'schoolWeeks' : 'freeWeeks']: this.getPewWeeks(String(date)),
      [this.data.dataCurrent ? 'schoolLesson' : 'courseList']: [],
      [this.data.dataCurrent ? 'schollPageEnd' : 'pageEnd']: 0,
    }, () => {
      if (this.data.dataCurrent) {
        this.shoolParams.date = ''
        this.shoolParams.pageNum = 1
        this.data.schoolWeeks.forEach((e, i) => {
          date == e.date ? [this.setData({
            'current.school': i,
            'month.school': e.title,
          }), this.getSchoolLesson(e.date)] : ''
        })
      } else {
        this.params.date = ''
        this.params.pageNum = 1
        this.data.freeWeeks.forEach((e, i) => {
          date == e.date ? [this.setData({
            'current.free': i,
            'month.free': e.title,
          }), this.getUserLessons(e.date)] : ''
        })
      }
    })
  },
  pickerCancel() {
    console.log('picker取消')
  },
  lessonChange(e) {
    this.setData({
      dataCurrent: e.detail.index
    })
  },
  back() {
    if(getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
});