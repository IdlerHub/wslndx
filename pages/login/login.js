// pages/login/login.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getPhoneNumber')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        setTimeout(wx.hideLoading,500) ;
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getPhoneNumber: function (e) {
        if (e.detail.errMsg !== 'getPhoneNumber:ok') {
            return;
        }
        let param = {
            mobileEncryptedData: e.detail.encryptedData,
            mobileiv: e.detail.iv
        }
        app.user.profile(param).then((msg) => {
            if (msg.code === 1) {
                wx.setStorageSync('userInfo', msg.data.userInfo);
                app.globalData.userInfo = msg.data.userInfo;
                /*返回首页*/
                wx.reLaunch({url: '/pages/index/index'})
            }
        })
    }
})