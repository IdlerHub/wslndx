import Store from "wxministore"

let store = new Store({
  state: {
    userInfo: {} /* 用户信息 */,
    authUserInfo: false /* 用户信息授权状态 */,
    visitedNum: [] /* 最多10个未授权视频 */,
    baseInfo: false /* 提示已超过10个视频，要求授权 */,
    imgHost: "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com/images/pro" /*  静态资源服务器 dev/pro    */,
    authKey: "" /* 小程序进入h5的身份标识 */
  },
  pageLisener: {
    onLoad(opts) {},
    onUnload() {}
  },
  methods: {}
})

module.exports = store
