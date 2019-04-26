//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        IMG_URL: app.IMG_URL,
        isEdit: false
    },
    onShow() {
        this.getList();
    },
    getList() {
        wx.showNavigationBarLoading();
        //获取没有加入的圈子list
        app.circle.noJoinCircles().then((msg) => {
            if (msg.code === 1) {
                this.setData({
                    noJoinList: msg.data
                })
            }
        });
        //获取已经加入的圈子list
        app.circle.joinedCircles().then((msg) => {
            if (msg.code === 1) {
                this.setData({
                    joinList: msg.data
                })
            }
        });
        wx.hideNavigationBarLoading()
    },
    //加入加圈
    fnJoin(e) {
        let curItem = e.currentTarget.dataset.item;
        let param = { fs_id: curItem.id };
        app.circle.join(param).then((msg) => {
            if (msg.code === 1) {
                wx.showToast({
                    title: '您已成功加入\r\n【' + curItem.title + '】学友圈',
                    icon: 'none',
                    duration: 1500
                });
                this.getList();
            }
        })
    },

    //取消加圈
    fnCancelJoin(e) {
        let curItem = e.currentTarget.dataset.item;
        let param = { fs_id: curItem.id };
        app.circle.cancelJoin(param).then((msg) => {
            if (msg.code == 1) {
                wx.showToast({
                    title: '您已取消加入\r\n【' + curItem.title + '】学友圈',
                    icon: 'none',
                    duration: 1500
                });
                this.getList();
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
        });
    },
    onHide() {
        app.aldstat.sendEvent('退出', { "name": "加圈页" })
    }
})