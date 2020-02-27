/*
 * @Date: 2020-02-26 10:33:14
 * @LastEditors: zxk
 */
var httpService = require("../utils/service.js")

//POST h5opus/getCategory 获取分类数据
function getCategory(){
    return httpService.post("h5opus/getCategory")
}

/** POST h5opus/getOpusList
 * @description: 获取作品列表
 * @param {type,page}
 * @return:  promise
 */
function getOpusList(params){
    return httpService.post("h5opus/getOpusList", params)
}

/** POST h5opus/praiseOpus
 * @description: 作品点赞
 * @param {type,id}
 * @return:  promise
 */
function praiseOpus(params) {
    return httpService.post("h5opus/praiseOpus", params)
}

/**
 *  @description: 获取桶上传的ak/sk等相关参数
 * @param {*}
 * @return:  promise
 * **/ 
function getSecureToken(params){
  return httpService.post('h5opus/getSecureToken')
}


module.exports = {
    getCategory,
    getOpusList,
    praiseOpus,
    getSecureToken
}