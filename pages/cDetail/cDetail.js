//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        IMG_URL: app.IMG_URL,
        list: [],
        circle: null,
        isRefreshing: false
    },
    onLoad(options) {
        this.id = options.id;
        this.param = {fs_id: this.id, page: 1, pageSize: 10};
        this.getList([]).then(() => {
            if (options.join) {
                this.join().then(function () {
                    let pages = getCurrentPages();
                    let prePage = pages[pages.length - 2];
                    prePage.result();
                })
            }
        });
        this.getCircleInfo().then(() => {
            wx.setNavigationBarTitle({
                title: this.data.circle.title
            })
        });
    },
    onUnload() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        if (prevPage.data.cur) {
            prevPage.setData({
                'cur.fs_joined': this.data.circle.joined
            })
        }
    },
    getList: function (list) {
        let temp = list || this.data.list;
        wx.showNavigationBarLoading();
        return app.circle.news(this.param).then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code === 1 && msg.data) {
                msg.data.forEach(function (item) {
                    item.lw = app.util.tow(item.likes);
                    item.cw = app.util.tow(item.comments);
                    let arr = [];
                    item.images.forEach(function (i) {
                        arr.push(i.image)
                    });
                    item.images = arr;
                    item.auditing = ((new Date()).getTime() - new Date(item.createtime * 1000)) < 7000;
                    item.pause = true;
                    temp.push(item);
                });
                this.setData({
                    list: temp
                })
            }
        })
    },
    getCircleInfo() {
        wx.showNavigationBarLoading();
        return app.circle.fsinfo(this.param).then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code === 1) {
                this.setData({
                    circle: msg.data
                })
            }
        })
    },
    play(e) {
        wx.navigateTo({
            url: '../pDetail/pDetail?id=' + this.data.list[e.currentTarget.dataset.index].id,
        })
    },
    praise(e) {
        let i = e.currentTarget.dataset.index;
        let temp = this.data.list;
        let param = {
            blog_id: temp[i].id
        };
        if (temp[i].likestatus) {
            // 取消点赞
            app.circle.delPraise(param).then((msg) => {
                if (msg.code === 1) {
                    temp[i].likestatus = 0;
                    temp[i].likes--;
                    this.setData({
                        list: temp
                    })
                }
            })
        } else {
            // 点赞
            app.circle.praise(param).then((msg) => {
                if (msg.code === 1) {
                    temp[i].likestatus = 1;
                    temp[i].likes += 1;
                    temp[i].praising = true;
                    this.setData({
                        list: temp
                    })
                }
            })
        }
    },
    aniend(e) {
        let temp = this.data.list;
        temp[e.currentTarget.dataset.index].praising = false;
        this.setData({
            list: temp
        })
    },
    join() {
        let circle = this.data.circle;
        let param = {fs_id: this.id};
        return app.circle.join(param).then((msg) => {
            if (msg.code === 1) {
                wx.showToast({
                    title: '您已成功加入\r\n【' + circle.title + '】学友圈',
                    icon: 'none',
                    duration: 1500
                });
                circle.joined = 1;
                circle.members += 1;
                this.setData({
                    circle: circle
                })

            }
        })
    },
    //图片预览
    previewImage(e) {
        let urls = e.currentTarget.dataset.urls;
        let current = e.currentTarget.dataset.current;
        this.setData({
            preview: true
        });
        wx.previewImage({
            current: current,
            urls: urls, // 需要预览的图片http链接列表
            complete: () => {
                this.setData({
                    preview: false
                })
            }
        })
    },
    navigate(e) {
        if (!this.data.preview) {
            wx.navigateTo({
                url: '../pDetail/pDetail?id=' + e.currentTarget.dataset.id,
            })
        }
    },
    //下拉刷新
    onPullDownRefresh() {
        this.param.page = 1;
        this.setData({
            isRefreshing: true
        })
        this.getList([]).then(() => {
            wx.stopPullDownRefresh();
            setTimeout(() => {
                wx.hideLoading();
                this.setData({
                    isRefreshing: false
                });
            }, 500)
        });
    },
    //上拉加载
    onReachBottom() {
        this.param.page++;
        this.getList();
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', {"name": "学友圈详情页"})
    }
})