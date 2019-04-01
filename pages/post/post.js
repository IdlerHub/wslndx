//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        rlSucFlag: false
    },
    onLoad(options) {
        this.param = { page: 1, pageSize: 10 };
        this.setData({
            list: [],
        })
        if (options.rlSuc) {
            this.setData({ rlSucFlag: true })
        }
        app.aldstat.sendEvent('菜单', { "name": "学有圈" })
    },

    onShow: function() {
        if (this.data.rlSucFlag) {
            this.rlSuc()
        } else {
            this.getList([]);
        }

    },
    getList(list, callback) {
        var that = this;
        var list = list ? list : that.data.list;
        wx.showNavigationBarLoading()
        app.circle.news(this.param, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                if (msg.data) {
                    msg.data.forEach(function(item) {
                        var arr = [];
                        item.lw = app.util.tow(item.likes);
                        item.cw = app.util.tow(item.comments);
                        item.images.forEach(function(i) {
                            arr.push(i.image)
                        });
                        item.images = arr;
                        item.auditing = ((new Date()).getTime() - new Date(item.createtime * 1000)) < 7000 ? true : false;
                        item.pause = true;
                        list.push(item);
                    })
                    that.setData({
                        list: list
                    })
                }

            }
            if (callback) {
                callback();
            }
        }, function() {})
    },
    praise(e) {
        var that = this;
        var i = e.currentTarget.dataset.index;
        var list = this.data.list;
        var param = {
            blog_id: list[i].id
        }
        if (list[i].likestatus == 1) {
            // 取消点赞
            app.circle.delPraise(param, function(msg) {
                if (msg.code == 1) {
                    list[i].likestatus = 0;
                    list[i].likes--;
                    that.setData({
                        list: list
                    })
                }
            }, function() {})
        } else {
            // 点赞
            app.circle.praise(param, function(msg) {
                if (msg.code == 1) {
                    list[i].likestatus = 1;
                    list[i].likes++;
                    list[i].praising = true;
                    that.setData({
                        list: list
                    })
                }
            }, function() {})
        }
    },
    aniend(e) {
        var i = e.currentTarget.dataset.index;
        var list = this.data.list;
        list[i].praising = false;
        this.setData({
            list: list
        })
    },
    // 加圈
    result(id, data) {
        var param = {
            fs_id: id
        }
        app.circle.join(param, function(msg) {
            if (msg.code == 1) {
                data.forEach(function(item, index) {
                    setTimeout(function() {
                        wx.showToast({
                            title: '    您已成功加入\r\n【' + item.title + '】学友圈',
                            icon: 'none',
                            duration: 1000
                        })
                    }, index * 1000 + 500)
                })
            }
        }, function() {})
    },
    // 写帖成功动效
    rlSuc() {
        this.setData({
            rlAni: true
        })
        this.getList([]);
    },
    rlAniend() {
        this.setData({
            rlAni: false
        })
    },
    //图片预览
    previewImage(e) {
        var that = this;
        var urls = [];
        var current = {};
        var urls = e.currentTarget.dataset.urls;
        var current = e.currentTarget.dataset.current;
        that.setData({
            preview: true
        })
        wx.previewImage({
            current: current,
            urls: urls, // 需要预览的图片http链接列表
            complete: function() {
                that.setData({
                    preview: false
                })
            }
        })
    },
    navigate(e) {
        var id = e.currentTarget.dataset.id;
        if (!this.data.preview) {
            wx.navigateTo({
                url: '../pDetail/pDetail?id=' + id,
            })
        }
    },
    //下拉刷新
    onPullDownRefresh() {
        this.param.page = 1;
        this.getList([], function() {
            wx.stopPullDownRefresh();
        });
    },
    //上拉加载
    onReachBottom() {
        this.param.page++;
        this.getList();
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', { "name": "学友圈页" })
    }
})