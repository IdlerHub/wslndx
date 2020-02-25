/*
 * @Date: 2019-12-20 10:54:37
 * @LastEditors: hxz
 * @LastEditTime: 2020-02-25 15:27:44
 */
const getPolicyEncode = require("./getPolicy.js");
const getSignature = require("./GetSignature.js");

import store from "../store";
import http from "../utils/index";

function randomUUID() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = new Array(36),
    rnd = 0,
    r;
  for (var i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i == 18 || i == 23) {
      uuid[i] = "-";
    } else if (i === 14) {
      uuid[i] = "4";
    } else {
      if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
      r = rnd & 0xf;
      rnd = rnd >> 4;
      uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
    }
  }
  return uuid
    .join("")
    .replace(/-/gm, "")
    .toLowerCase();
}

function cacheUrl(dir, type) {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  return dir + "/" + year + "/" + month + "/" + randomUUID() + type;
}

function checkType(file) {
  const legalType = [".jpg", ".jpe", ".jpeg", ".png", ".gif"];
  const map = [
    "image/jpeg",
    "image/jpeg",
    "image/jpeg",
    "image/png",
    "image/gif"
  ];
  let attrs = null;
  legalType.some((v, i) => {
    if (file.endsWith(v)) {
      attrs = { type: v, ct: map[i] };
      return true;
    }
  });

  return attrs;
}

const OBSupload = function(dir, filePath) {
  let checkRes = checkType(filePath);
  if (!checkRes) {
    uni.showToast({
      icon: "none",
      title: "图片类型未知,请重新选择上传",
      duration: 1500
    });
    return Promise.reject("");
  }
  let {
    access,
    expires_at,
    secret,
    securitytoken,
    bucket,
    endpoint
  } = store.state.Home.security;
  const fileName = cacheUrl(dir, checkRes.type); //指定上传到OBS桶中的对象名
  const OBSPolicy = {
    //设定policy内容
    expiration: expires_at,
    conditions: [
      { bucket: bucket }, //Bucket name
      { key: fileName },
      { "x-obs-security-token": securitytoken },
      { "Content-Type": checkRes.ct },
      { success_action_status: 200 },
      {
        success_action_redirect:
          http.config.baseUrl + "/uploadimage/putUploadParams"
      }
    ]
  };
  const policyEncoded = getPolicyEncode(OBSPolicy); //计算policy编码值
  const signature = getSignature(policyEncoded, secret); //计算signature

  return http
    .upload(endpoint, {
      filePath: filePath,
      name: "file",
      formData: {
        AccessKeyID: access,
        policy: policyEncoded,
        signature: signature,
        key: fileName,
        "Content-Type": checkRes.ct,
        success_action_status: 200,
        success_action_redirect:
          http.config.baseUrl + "/uploadimage/putUploadParams",
        "x-obs-security-token": securitytoken
      }
    })
    .then(() => {
      return endpoint + "/" + fileName;
    });
};

export default OBSupload;
