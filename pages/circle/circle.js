//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        isEdit: false
    },
    onLoad(options) {
        this.getList();
    },

    getList() {
        var that = this;
        wx.showNavigationBarLoading()
            //获取没有加入的圈子list
        app.circle.noJoinCircles(function(msg) {
            if (msg.code == 1) {
                that.setData({
                    noJoinList: msg.data
                })
            }
        }, function() {})

        //获取已经加入的圈子list
        app.circle.joinedCircles(function(msg) {
            if (msg.code == 1) {
                that.setData({
                    joinList: msg.data
                })
            }
        }, function() {})
        wx.hideNavigationBarLoading()
    },

    //加入加圈
    fnJoin(e) {
        var that = this;
        var curItem = e.currentTarget.dataset.item;
        var param = { fs_id: curItem.id }
        app.circle.join(param, function(msg) {
            if (msg.code == 1) {
                wx.showToast({
                    title: '您已成功加入\r\n【' + curItem.title + '】学友圈',
                    icon: 'none',
                    duration: 1500
                });
                that.getList();
            }
        }, function() {})
    },

    //取消加圈
    fnCancelJoin(e) {
        var that = this;
        var curItem = e.currentTarget.dataset.item;
        var param = { fs_id: curItem.id }
        app.circle.cancelJoin(param, function(msg) {
            if (msg.code == 1) {
                wx.showToast({
                    title: '您已取消加入\r\n【' + curItem.title + '】学友圈',
                    icon: 'none',
                    duration: 1500
                });
                that.getList();
            }
        }, function() {})
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
        });
    },
   onHide() {
     app.aldstat.sendEvent('退出', { "name": "加圈页" })
  }
})