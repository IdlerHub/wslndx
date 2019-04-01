//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        list: [],
        phoneMask: false
    },
    onShow() {
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
        this.setData({
            userInfo: userInfo
        })
        if (!!that.data.cur) {
            if (that.data.cur.fs_joined == 1) {
                that.data.list.forEach(function(item, index) {
                    if (item.fs_id == that.data.cur.fs_id) {
                        item.fs_joined = 1;
                    }
                    var temp = "list[" + index + "]";
                    that.setData({
                        [temp]: item,
                        list: that.data.list
                    })
                })
                app.aldstat.sendEvent('加圈', { "name": that.data.cur.title })
            }
        }
        if (!that.data.back) app.PhoneMask(that);
    },
    onLoad(options) {
        var that = this;
        this.videoContext = wx.createVideoContext('myVideo');
        this.param = { id: options.id ? options.id : '', page: 1, pageSize: 10 };

        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        if (!prePage) {
            this.setData({
                back: true
            });
        }
        this.getList([], function() {
            that.setData({
                cur: that.data.list[0],
                index: 0
            })
            app.addVisitedNum(`v${that.data.cur.id}`)
            app.aldstat.sendEvent('短视频播放', { "name": that.data.cur.title })
        })
        app.aldstat.sendEvent('菜单', { "name": "短视频" })
    },
    getList(list, callback) {
        var that = this;
        var list = list ? list : that.data.list;
        wx.showNavigationBarLoading()
        app.video.list(this.param, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                msg.data.forEach(function(item) {
                    item.pw = app.util.tow(item.praise);
                    item.fw = app.util.tow(item.forward);
                    list.push(item);
                })
                that.setData({
                    list: list,
                })
            }
            if (callback) {
                callback();
            }
        }, function() {}, this.data.back)
    },
    tap() {
        if (this.data.pause) {
            this.videoContext.play()
            this.setData({
                pause: false
            })
        } else {
            this.videoContext.pause()
            this.setData({
                pause: true
            })
        }
    },
    scrollTouchStart(e) {
        this.sy = e.touches[0].pageY
    },
    scrollTouchEnd(e) {
        var that = this;
        var list = this.data.list;
        var cur = this.data.cur;
        var index = this.data.index;
        this.ey = e.changedTouches[0].pageY
        if (this.ey - this.sy > 30) {
            // 下拉
            that.setData({
                cur: (index <= 0 ? list[0] : list[index - 1]),
                index: (index <= 0 ? 0 : index - 1),
                pause: false
            })
        } else if (this.ey - this.sy < -30) {
            // 上拉
            that.setData({
                cur: (index >= list.length - 1 ? list[0] : list[index + 1]),
                index: (index >= list.length - 1 ? 0 : index + 1),
                pause: false
            })
            if (index >= list.length - 2) {
                // 加载新数据
                that.param.page++;
                that.param.id = '';
                that.getList();
            }
        }
        app.addVisitedNum(`v${that.data.cur.id}`)
            //判断是否显示phoneMask
        if (!that.data.back) app.PhoneMask(that);
        app.aldstat.sendEvent('短视频播放', { "name": that.data.cur.title })
    },
    praise() {
        var that = this;
        var list = this.data.list;
        var index = this.data.index;
        var param = {
            id: list[index].id
        }
        if (list[index].praised == 1) {
            // 取消点赞
            app.video.delPraise(param, function(msg) {
                if (msg.code == 1) {
                    list[index].praised = 0;
                    list[index].praise--;
                    that.setData({
                        list: list,
                        cur: list[index]
                    })
                }
            }, function() {})
        } else {
            // 点赞
            app.video.praise(param, function(msg) {
                if (msg.code == 1) {
                    list[index].praised = 1;
                    list[index].praise++;
                    list[index].praising = true;
                    that.setData({
                        list: list,
                        cur: list[index]
                    })
                }
            }, function() {})
            app.aldstat.sendEvent('短视频点赞', { "name": that.data.cur.title })
        }
    },
    aniend(e) {
        var list = this.data.list;
        var index = this.data.index;
        list[index].praising = false;
        this.setData({
            list: list,
            cur: list[index]
        })
    },
    // 转发
    onShareAppMessage: function(res) {
        var that = this;
        var list = this.data.list;
        var index = this.data.index;
        var param = {
                id: list[index].id
            }
            // 分享
        app.video.share(param, function(msg) {
            if (msg.code == 1) {
                list[index].forward++;
                that.setData({
                    list: list,
                    cur: list[index]
                })
                app.aldstat.sendEvent('短视频转发', { "name": that.data.cur.title })
            }
        }, function() {})
        return {
            title: list[index].title,
            imageUrl: list[index].cimg,
            path: 'pages/video/video?id=' + list[index].id
        }
    },
    // 首页
    back() {
        wx.reLaunch({
            url: '../index/index'
        })
    },
    // 跳转学友圈
    navigate() {
        var cur = this.data.cur;
        if (!this.data.userInfo.nickname) {
            wx.showModal({
                title: '',
                showCancel: false,
                content: '您还没有授权，请先授权',
                success: function(res) {
                    if (res.confirm) {
                        wx.reLaunch({
                            url: '../index/index'
                        })
                    }
                }
            })
        } else {
            app.aldstat.sendEvent('短视频跳转', { "name": that.data.cur.title })
            wx.navigateTo({
                url: '../cDetail/cDetail?id=' + cur.fs_id,
            })
        }
    },
    // 加入学友圈
    join() {
        var that = this;
        var cur = this.data.cur;
        wx.navigateTo({
            url: '../cDetail/cDetail?id=' + cur.fs_id + '&join=true',
        })
    },
    // 完整视频
    complete() {
        var that = this;
        var cur = this.data.cur;
        wx.navigateTo({
            url: '../detail/detail?id=' + cur.target_id,
        })
    },
    result() {
        var that = this;
        var list = this.data.list;
        var index = this.data.index;
        list[index].fs_joined = 1;
        that.setData({
            list: list,
            cur: list[index]
        })
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', { "name": "短视频页" })
    },

    //获取用户号码
    getPhoneNumber: function(e) {
        app.phone(e, this);
    },

})