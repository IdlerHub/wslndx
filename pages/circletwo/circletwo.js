const app = getApp()

Page({
	data: {
		isIphoneX: app.globalData.isIphoneX,
		size: 1,
    addItem: false
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
    return app.circle.joinedCircles().then(msg => {
       if (msg.code === 1) {
        msg.data.forEach(item => {
          item.fixed = false
        })
        this.setData({
          joinList: msg.data
        })
      }
    })
  },
	onLoad() {
  },
  onShow() {
    this.getList().then(() => {
      this.drag = this.selectComponent('#drag');
      this.drag.dataChange();
    })
  },
  fnJoin(id) {
    // if (this.settiome) return
    let param = id.detail
    this.setData({
      addItem: true
    })
    this.settiome = setTimeout(() => {
      app.circle.join(param).then(res => {
        // res.code == 1 ? this.getList().then(() => {
        //   this.drag = this.selectComponent('#drag');
        //   this.drag.dataChange();
        // }) : ''
        // this.setData({
        //   addItem: false
        // })
        app.circle.noJoinCircles().then(msg => {
          if (msg.code === 1) {
            this.setData({
              noJoinList: msg.data
            })
          }
        })
        this.setData({
          addItem: false
        })
      })
    }, 1500);
    

  },
  //取消加圈
  fnCancelJoin(e) {
    let curItem = e.currentTarget.dataset.item
    let param = { fs_id: curItem.id }
    // app.circle.cancelJoin(param)
  },
})