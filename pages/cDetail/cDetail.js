//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        list: [],
        circle: null
    },
    onLoad(options) {
        var that = this;
        this.id = options.id;
        this.param = { fs_id: this.id, page: 1, pageSize: 10 };
        this.getList([], function() {
            if (options.join) {
                that.join(function() {
                    var pages = getCurrentPages();
                    var prePage = pages[pages.length - 2];
                    prePage.result();
                })
            }
        });
        this.getCircleInfo('',
            function() {
                wx.setNavigationBarTitle({
                    title: that.data.circle.title
                })
            }
        );
    },
    onUnload() {
        var that = this;
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];
        var prevPage = pages[pages.length - 2];
        if (prevPage.data.cur) {
            prevPage.setData({
                'cur.fs_joined': that.data.circle.joined
            })
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
                        item.lw = app.util.tow(item.likes);
                        item.cw = app.util.tow(item.comments);
                        var arr = [];
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

    getCircleInfo(param, callback) {
        var that = this;
        wx.showNavigationBarLoading()
        app.circle.fsinfo(this.param, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                that.setData({
                    circle: msg.data
                })
            }
            if (callback) {
                callback();
            }
        }, function() {})
    },

    play(e) {
        var i = e.currentTarget.dataset.index;
        var list = this.data.list;
        wx.navigateTo({
            url: '../pDetail/pDetail?id=' + list[i].id,
        })
    },
    praise(e) {
        var that = this;
        var i = e.currentTarget.dataset.index;
        var list = that.data.list;
        var param = {
            blog_id: list[i].id
        }
        if (list[i].likestatus) {
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
        var circle = this.data.circle;
        this.data.list[i].praising = false;
        this.setData({
            list: list
        })
    },
    join() {
        var that = this;
        var circle = that.data.circle;
        var param = { fs_id: this.id }
        app.circle.join(param, function(msg) {
            if (msg.code == 1) {
                wx.showToast({
                    title: '您已成功加入\r\n【' + circle.title + '】学友圈',
                    icon: 'none',
                    duration: 1500
                })
                circle.joined = 1;
                circle.members++;
                that.setData({
                    circle: circle
                })

            }
        }, function() {})
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
            setTimeout(function() {
                wx.hideLoading();
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
    app.aldstat.sendEvent('退出', { "name": "学友圈详情页" })
  }
})