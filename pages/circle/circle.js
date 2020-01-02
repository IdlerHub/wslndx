//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isEdit: false,
    isIphoneX: app.globalData.isIphoneX,
		size: 1,
  },
  onShow() {
    this.getList()
  },
  getList() {
    //获取没有加入的圈子list
    app.circle.noJoinCircles().then(msg => {
      if (msg.code === 1) {
        this.setData({
          noJoinList: msg.data
        })
      }
    })
    //获取已经加入的圈子list
    app.circle.joinedCircles().then(msg => {
      if (msg.code === 1) {
        this.setData({
          joinList: msg.data,
          showcopm: false
        })
        this.drag = this.selectComponent('#drag');
        this.drag.dataChange();
      }
    })
  },
  //加入加圈
  fnJoin(e) {
    let curItem = e.currentTarget.dataset.item ,num= '' ,arr = JSON.parse(JSON.stringify(this.data.joinList))
    arr.splice(0,0,curItem)
		arr.forEach((i, index) => {
        num = `${num},${i.id}`
    })
		let param = { fs_id: num.substring(1) }
    app.circle.join(param).then(msg => {
      if (msg.code === 1) {
        this.setData({
          showcopm: true
        })
        wx.showToast({
          title: "您已成功加入\r\n【" + curItem.title + "】学友圈",
          icon: "none",
          duration: 1500
        })
        this.getList()
      }
    })
  },

  //取消加圈
  fnCancelJoin(e) {
    let curItem = e.currentTarget.dataset.item ,index= e.currentTarget.dataset.index,num= '' ,arr = JSON.parse(JSON.stringify(this.data.joinList))
    arr.splice(index,1)
		arr.forEach((i, index) => {
        num = `${num},${i.id}`
    })
    let param = { fs_id: num.substring(1) }
    app.circle.join(param).then(msg => {
      if (msg.code == 1) {
        wx.showToast({
          title: "您已取消加入\r\n【" + curItem.title + "】学友圈",
          icon: "none",
          duration: 1500
        })
        this.getList()
      }
    })
  },

  //编辑
  fnEdit: function() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  gotoCdetail(e) {
    wx.navigateTo({
      url: "/pages/cDetail/cDetail?id=" + e.currentTarget.dataset.id
    })
  },
  onHide() {
    app.aldstat.sendEvent("退出", { name: "加圈页" })
  },
  change(e) {
		this.setData({
			listData: e.detail.listData
		});
	},
	itemClick(e) {
		console.log(e);
	},
	toggleFixed(e) {
		let key = e.currentTarget.dataset.key;

		let {listData} = this.data;

		listData[key].fixed = !listData[key].fixed

		this.setData({
			listData: listData
		});
  },
  touchstart() {
    console.log('touchstart')
    this.setData({
      showcopm: true
    })
  }
})
