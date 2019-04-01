//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        nav: [{ name: '收藏课程' }, { name: '学习历史' }, { name: '我的圈子' }],
        height: 0
    },
    onShow() {
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
        this.setData({
            userInfo: userInfo,
        })

    },
    onLoad(options) {
        var that = this;
        let systemInfo = wx.getSystemInfoSync();
        let windowHeight = systemInfo.windowHeight;
        let query = wx.createSelectorQuery().in(that);
        query.select('.top').boundingClientRect();
        query.select('.nav').boundingClientRect();
        query.exec((res) => {
            let headerHeight = res[0].height;
            let navHeight = res[1].height;
            let scrollViewHeight = windowHeight - headerHeight - navHeight;
            that.setData({
                height: scrollViewHeight,
            });
        });
        this.setData({
            collect: [],
            history: {},
            circle: [],
            currentTab: 0,
            navScrollLeft: 0,
        })
        this.collectParam = this.historyParam = this.circleParam = { page: 1, pageSize: 10 };
        this.getCollect([]);
        this.getHistory([]);
        this.getCircle([]);
    },
    switchNav(event) {
        var cur = event.currentTarget.dataset.current;
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
    },
    switchTab(event) {
        var cur = event.detail.current;
        this.setData({
            currentTab: cur,
        });
    },
    getUserInfo(e) {
        var that = this;
        if (e.detail.errMsg != 'getUserInfo:ok') return
        var param = {
            userInfo: JSON.stringify(e.detail.userInfo)
        }
        app.user.profile(param, function(msg) {
            if (msg.code == 1) {
                wx.setStorageSync('userInfo', msg.data.userInfo)
                var userInfo = wx.getStorageSync('userInfo');
                if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
                that.setData({
                    userInfo: userInfo,
                })
            }
        }, function() {})
    },
    getCollect(list, callback) {
        var that = this;
        var collect = list ? list : that.data.collect;
        wx.showNavigationBarLoading()
        app.user.collect(this.collectParam, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                msg.data.forEach(function(item) {
                    item.thousand = (item.browse / 10000) > 1 ? (item.browse / 10000).toFixed(1) : null;
                    collect.push(item);
                })
                that.setData({
                    collect: collect
                })
            }
            if (callback) {
                callback();
            }
        }, function() {})
    },
    getHistory(list, callback) {
        var that = this;
        var history = that.data.history;
        var list = list ? list : that.data.history.history;
        wx.showNavigationBarLoading()
        app.user.history(this.historyParam, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                for (let i in msg.data.history) {
                    msg.data.history[i].forEach(function(item) {
                        item.createtime = app.util.formatTime(new Date(item.createtime * 1000)).slice(10)
                    })
                    list.push({ date: i, data: msg.data.history[i] });
                }
                that.setData({
                    'history.history': list,
                    'history.last_lesson': msg.data.last_lesson
                })
            }
            if (callback) {
                callback();
            }
        }, function() {})
    },
    getCircle(list, callback) {
        var that = this;
        var circle = list ? list : that.data.circle;
        wx.showNavigationBarLoading()
        this.circleParam.us_id = 0;
        app.circle.news(this.circleParam, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                if (msg.data) {
                    msg.data.forEach(function(item) {
                        var arr = [];
                        item.images.forEach(function(i) {
                            arr.push(i.image)
                        });
                        item.images = arr;
                        item.auditing = ((new Date()).getTime() - new Date(item.createtime * 1000)) < 7000 ? true : false;
                        item.pause = true;
                        circle.push(item);
                    })
                }
                that.setData({
                    circle: circle
                })

            }
            if (callback) {
                callback();
            }
        }, function() {})
    },
    del(e) {
        var that = this;
        var i = e.currentTarget.dataset.index;
        var circle = this.data.circle;
        var param = {
            blog_id: circle[i].id
        }
        wx.showModal({
            title: '',
            content: '是否删除帖子',
            success: function(res) {
                if (res.confirm) {
                    app.circle.delPost(param, function(msg) {
                        if (msg.code == 1) {
                            that.circleParam.page = 1;
                            that.getCircle([]);
                        }
                    }, function() {})
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    // 写帖成功动效
    rlSuc() {
        this.setData({
            rlAni: true
        })
        this.circleParam.page = 1;
        this.getCircle([]);
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
        this.collectParam.page = this.historyParam.page = this.circleParam.page = 1;
        this.getCollect([], function() {
            wx.stopPullDownRefresh();
        });
        this.getHistory([]);
        this.getCircle([]);
    },
    //上拉加载
    collectLower() {
        this.collectParam.page++;
        this.getCollect();
    },
    historyLower() {
        this.historyParam.page++;
        this.getHistory();
    },
    circleLower() {
        this.circleParam.page++;
        this.getCircle();
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', { "name": "个人中心页" })
    }
})