//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        IMG_URL: app.IMG_URL,
        isRefreshing: false
    },
    onLoad(options) {
        this.param = {fs_id: options.id, page: 1, pageSize: 10};
        this.setData({
            detail: {
                user: [],
                friendscircle: []
            }
        });
        wx.setNavigationBarTitle({
            title: options.name
        });
        this.getList([]);
    },
    getList(list) {
        let detail = this.data.detail;
        let temp = list || this.data.detail.user;
        wx.showNavigationBarLoading();
        return app.circle.member(this.param).then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code == 1) {
                detail = msg.data;
                msg.data.user.forEach(function (item) {
                    temp.push(item);
                });
                detail.user = temp;
                this.setData({
                    detail: detail
                })
            }
        })
    },
    //下拉刷新
    onPullDownRefresh() {
        this.param.page = 1;
        this.setData({
            isRefreshing: true
        });
        this.getList([]).then(() => {
            wx.stopPullDownRefresh();
            let timer = setTimeout(() => {
                this.setData({
                    isRefreshing: false
                }, () => {
                    clearTimeout(timer)
                })
            }, 1000)
        });
    },
    //上拉加载
    onReachBottom() {
        this.param.page++;
        this.getList();
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', {"name": "学友圈成员页"})
    }
})
