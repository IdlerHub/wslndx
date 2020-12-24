// page/index/components/searchTop/searchTop.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSchool: {
      type: Boolean,
      value: false
    },
    isLesson: {
      type: Boolean,
      value: false
    },
    isSearch: {
      type: Boolean,
      value: 0
    },
    universityId: {
      type: String,
      value: 0
    }
  },
  data: {
    text: '',
    focus: true,
  },
  methods: {
    txtchange(e) {
      this.setData({
        text: e.detail.value
      })
    },
    clear() {
      this.setData({
        text: ''
      })
      getCurrentPages()[getCurrentPages().length - 1].setData({
        isSearch: 0,
        list: []
      })
    },
    searchlesss() {
      let pages = getCurrentPages()[getCurrentPages().length - 1],
        params = {
          pageSize: 10,
          pageNum: 1,
          keyword: this.data.text
        }
      let historyList = [...pages.data.historyList]
      historyList.forEach((item, index) => {
        item == this.data.text ? historyList.splice(index, 1) : ''
      })
      historyList.unshift(this.data.text)
      if (this.data.isSchool) {
        pages.setData({
          historyList: historyList
        }, () => {
          wx.setStorage({
            key: "universityHistory",
            data: pages.data.historyList
          })
        })
        app.lessonNew.universitySearchList(params).then(res => {
          res.dataList.forEach(item => {
            item.title = item.name
            item.name = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.name
                .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
                 + "</span>" )}</p>`;
            item.bw = app.util.tow(item.browse);
          });
          pages.setData({
            list: res.dataList,
            text: this.data.text,
            isSearch: 1
          })
        })
      } else {
        params['type'] = 2
        pages.setData({
          historyList: historyList
        }, () => {
          wx.setStorage({
            key: "lessonHistory",
            data: pages.data.historyList
          })
        })
        app.lessonNew.searchLessonAndColumn(params).then(res => {
          res.data.lessonInfo.list.forEach(item => {
            item.name = item.title
            item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title
                .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
                 + "</span>" )}</p>`;
            item.bw = app.util.tow(item.browse);
          });
          pages.setData({
            list: res.data.lessonInfo.list,
            text: this.data.text,
            isSearch: 1
          })
        })
      }
    }
  }
})