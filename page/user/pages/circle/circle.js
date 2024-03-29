const app = getApp()

Page({
  data: {
    isIphoneX: app.globalData.isIphoneX,
    size: 1,
    showcopm: false
  },
  pageName: '加入圈子',
  change(e) {
    this.setData({
      listData: e.detail.listData
    });
  },
  itemClick(e) {
  },
  toggleFixed(e) {
    let key = e.currentTarget.dataset.key;

    let { listData } = this.data;

    listData[key].fixed = !listData[key].fixed

    this.setData({
      listData: listData
    });
  },
  getList() {
    //获取已经加入的圈子list
    return app.circle.joinedCircles().then(msg => {
      msg.data.forEach(item => {
        item.fixed = false
      })
      this.setData({
        joinList: msg.data,
        showcopm: true
      })
    })
  },
  onLoad() {
  },
  onShow() {
    this.setData({
      showcopm: false
    })
    this.getList().then(() => {
      this.drag = this.selectComponent('#drag');
      this.drag.dataChange();
    })
  }

})