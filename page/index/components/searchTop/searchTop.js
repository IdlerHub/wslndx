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
    isTeach: {
      type: Boolean,
      value: false
    },
    isSearch: {
      type: Boolean,
      value: 0
    },
    universityId: {
      type: String,
      value: null
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
        text: '',
        focus: false
      }, () => {
        this.setData({
          focus: true
        })
      })
      getCurrentPages()[getCurrentPages().length - 1].setData({
        isSearch: 0,
        list: []
      })
    },
    searchlesss() {
      if(this.data.text == '') {
        wx.showToast({
          title: '请输入内容',
          duration: 1500,
          icon: 'none',
        })
        return
      }
      let pages = getCurrentPages()[getCurrentPages().length - 1],
        params = {
          pageSize: 10,
          pageNum: 1,
          keyword: this.data.text
        }
      if (this.data.universityId) params['universityId'] = this.data.universityId
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
      } else if (this.data.isLesson) {
        let alllessonpage = {}
        getCurrentPages().forEach(item => {
          item.isAlllessonpage ? alllessonpage = item : ''
        })
        pages.setData({
          historyList: historyList
        }, () => {
          wx.setStorage({
            key: "lessonHistory",
            data: pages.data.historyList
          })
        })
        if (alllessonpage.type == 1) {
          params.type = 1
          params.name = this.data.text
          app.liveData.chargeList(params).then(res => {
            res.dataList.forEach(item => {
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
          app.lessonNew.searchLessonList(params).then(res => {
            res.dataList.forEach(item => {
              item.name = item.title
              item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title
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
        }
      } else {
        pages.setData({
          historyList: historyList
        }, () => {
          wx.setStorage({
            key: "teachHistory",
            data: pages.data.historyList
          })
        })
        params['nickName'] = this.data.text
        app.lessonNew.lecturerList(params).then(res => {
          res.dataList.forEach(item => {
            item.title = item.name
            item.nickname = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.nickname
                .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
                 + "</span>" )}</p>`;
          });
          pages.setData({
            list: res.dataList,
            text: this.data.text,
            isSearch: 1
          })
        })
      }
    }
  }
})