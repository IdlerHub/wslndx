
class SVGCON {
  constructor() {

  }

  svgXml(n, c) {
    let name = n;
    let data = '';
    let casualData = this[name]();
    let newArray = [];
    let color = 'black';
    let newFill = '';
    // 颜色转换
    if (c && c.indexOf('#') >= 0) {
      color = c.replace('#', '%23');
    } else if (c) {
      color = c;
    }
    newFill = "fill=" + "'" + color + "'";
    // 更新颜色，加入fill=color(svg去掉fill=color相关代码)
    // 查找svg中的path数量
    newArray = casualData.split('></path>');
    casualData = '';
    for (let i = 0; i < newArray.length; i++) {
      if (i == newArray.length - 1) {

      } else {
        newArray[i] = newArray[i] + ' ' + newFill + "></path>";
      }
      casualData = casualData + newArray[i];
    }

    // 转换成svg+xml
    data = casualData;
    data = data.replace('<', '%3C');
    data = data.replace('>', '%3E');
    data = 'data:image/svg+xml,' + data;
    //双引号展示不出来，需要转换成单引号
    data = data.replace(/\"/g, "'");

    return data;
  }

  search() { //搜索
    return '<svg t="1616985896302" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6393" width="200" height="200"><path d="M836.48 496A340.48 340.48 0 1 0 496 836.48 340.8 340.8 0 0 0 836.48 496z m75.52 0a416 416 0 1 1-416-416 416 416 0 0 1 416 416z" p-id="6394"></path><path d="M761.28 806.72a32 32 0 0 1 45.44-45.44l128 128a32 32 0 0 1-45.44 45.44z" p-id="6395"></path></svg>'
  }

  arrowTop() {   //向上箭头
    return '<svg t="1605862823707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="674" width="128" height="128"><path d="M512.711 353.28L129.46 736.53c-17.573 17.574-46.066 17.574-63.64 0-17.573-17.573-17.573-46.066 0-63.64L512.712 226l446.892 446.891c17.573 17.574 17.573 46.067 0 63.64-17.574 17.574-46.066 17.574-63.64 0L512.711 353.28z" p-id="675"></path></svg>'
  }

  arrowBottom() {   //向下箭头
    return '<svg t="1616990140744" class="icon" viewBox="0 0 1609 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8458" width="200" height="200"><path d="M804.502631 670.900141l574.759307-627.994314A127.029057 127.029057 0 0 1 1509.667842 5.462547 141.330999 141.330999 0 0 1 1604.914805 109.250948 156.129537 156.129537 0 0 1 1569.259268 250.383309L899.650275 980.775558a126.333824 126.333824 0 0 1-190.295288 0L39.745994 250.383309A156.129537 156.129537 0 0 1 4.587052 108.754353 141.033042 141.033042 0 0 1 99.834015 5.462547a127.128376 127.128376 0 0 1 129.909309 37.840556L804.502631 670.900141z" p-id="8459"></path></svg>'
  }

  arrowLeft() {   //向左箭头
    return '<svg t="1616989870256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8328" width="200" height="200"><path d="M716.234419 1022.690233L220.249302 526.586047a84.24186 84.24186 0 0 1 0-29.172094L716.353488 1.309767a76.68093 76.68093 0 0 1 29.172093 0L803.691163 59.534884c1.666977 15.24093 1.726512 26.254884 0 29.172093L395.222326 497.413953a26.254884 26.254884 0 0 0 0 29.172094l408.468837 408.587906c1.607442 2.857674 1.786047 13.812093 0 29.172094l-58.403721 58.344186c-14.288372 1.726512-24.945116 1.786047-29.053023 0z" p-id="8329"></path></svg>'
  }

  arrowRight() {   //向右箭头
    return '<svg t="1616989325566" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8198" width="200" height="200"><path d="M603.0848 512L243.4048 182.784a72.7552 72.7552 0 0 1-21.8112-74.4448 80.6912 80.6912 0 0 1 59.4432-54.4768 89.2416 89.2416 0 0 1 81.1008 19.9168l418.3552 383.6928a72.4992 72.4992 0 0 1 0 109.056l-418.3552 383.6928a89.2416 89.2416 0 0 1-81.1008 19.9168 80.7936 80.7936 0 0 1-59.392-54.4768 72.8064 72.8064 0 0 1 21.7088-74.4448l359.7312-329.216z" p-id="8199"></path></svg>'
  }

  closeOutline() {  //镂空圆形边界关闭
    return '<svg t="1602660624486" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19876" width="128" height="128"><path d="M512 64a448 448 0 1 1-448 448 448 448 0 0 1 448-448m0-64a512 512 0 1 0 512 512 512 512 0 0 0-512-512z" p-id="19877"></path><path d="M715.52 671.36L556.8 512l159.36-159.36a32 32 0 0 0-45.44-44.8L512 466.56 353.92 309.12a32 32 0 0 0-45.44 45.44L465.92 512l-157.44 157.44a32 32 0 0 0 45.44 45.44L512 557.44l159.36 159.36a31.36 31.36 0 0 0 44.8-44.8z" p-id="19878"></path></svg>'
  }

  wechat() {  //微信
    return '<svg t="1605867588202" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="920" width="128" height="128"><path d="M992.896 624.448c0-133.824-131.008-242.368-292.608-242.368-161.6 0-292.608 108.48-292.608 242.368 0 133.952 131.008 242.432 292.608 242.432 37.376 0 73.024-6.016 105.792-16.576l92.224 50.496-24.32-81.344c0.32-0.192 0.704-0.32 1.024-0.512C946.56 774.656 992.896 704.064 992.896 624.448zM594.624 578.688c-21.696 0-39.168-17.6-39.168-39.168 0-21.632 17.472-39.168 39.168-39.168 21.568 0 39.104 17.536 39.104 39.168C633.728 561.088 616.192 578.688 594.624 578.688zM792.64 578.688c-21.632 0-39.104-17.6-39.104-39.168 0-21.632 17.472-39.168 39.104-39.168s39.168 17.536 39.168 39.168C831.808 561.088 814.272 578.688 792.64 578.688z" p-id="921"></path><path d="M689.984 371.904c4.608 0 9.216 0.064 13.696 0.256-18.304-139.968-161.408-248.96-335.232-248.96-186.24 0-337.28 125.12-337.28 279.36 0 91.776 53.376 173.184 135.872 224.128 0.384 0.192 0.768 0.384 1.152 0.64l-27.968 93.76 106.24-58.24c37.888 12.16 78.912 19.072 121.984 19.072 13.504 0 26.816-0.704 39.936-2.048-7.04-20.8-10.944-42.816-10.944-65.536C397.376 480.384 528.448 371.904 689.984 371.904zM490.24 259.456c24.896 0 45.12 20.224 45.12 45.184 0 24.896-20.224 45.12-45.12 45.12-24.96 0-45.184-20.224-45.184-45.12C445.12 279.68 465.344 259.456 490.24 259.456zM261.952 349.76c-24.896 0-45.12-20.224-45.12-45.12 0-24.96 20.16-45.184 45.12-45.184 24.96 0 45.184 20.224 45.184 45.184C307.136 329.536 286.912 349.76 261.952 349.76z" p-id="922"></path></svg>'
  }

  copy() {  //复制
    return '<svg t="1605867664653" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="773" width="128" height="128"><path d="M715.436342 780.14204c-21.404496 0-38.724976 17.3389-38.724976 38.724976l0 30.31033c0 18.379603-14.938224 33.335223-33.316803 33.335223L176.316681 882.512568c-18.379603 0-33.354666-14.956643-33.354666-33.335223L142.962016 382.098441c0-18.379603 14.976086-33.316803 33.354666-33.316803l26.888394 0c21.404496 0 38.724976-17.3389 38.724976-38.724976s-17.320481-38.724976-38.724976-38.724976l-26.888394 0c-61.112869 0-110.803595 49.691749-110.803595 110.765733l0 467.078905c0 61.093427 49.691749 110.785176 110.803595 110.785176l467.078905 0c61.075007 0 110.765733-49.691749 110.765733-110.785176l0-30.31033C754.161319 797.48094 736.840838 780.14204 715.436342 780.14204z" p-id="774"></path><path d="M842.313008 64.037479 386.012587 64.037479c-64.062038 0-116.173906 52.111868-116.173906 116.173906l0 456.282001c0 64.062038 52.111868 116.173906 116.173906 116.173906l456.30042 0c64.062038 0 116.173906-52.111868 116.173906-116.173906l0-456.282001C958.486914 116.149347 906.375046 64.037479 842.313008 64.037479zM881.037984 636.493385c0 21.348214-17.358343 38.724976-38.724976 38.724976L386.012587 675.218362c-21.366633 0-38.724976-17.376763-38.724976-38.724976l0-456.282001c0-21.348214 17.358343-38.724976 38.724976-38.724976l456.30042 0c21.366633 0 38.724976 17.376763 38.724976 38.724976L881.037984 636.493385z" p-id="775"></path></svg>'
  }

  playVideo() { //视频播放
    return '<svg t="1616999140941" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1527" width="200" height="200"><path d="M516.05 61C761.463 61 961.1 260.637 961.1 506.05S761.463 951.1 516.05 951.1 71 751.463 71 506.05 270.637 61 516.05 61z m-99.886 260.884c-19.054 0-34.5 15.446-34.5 34.5v303.932a34.5 34.5 0 0 0 4.592 17.197c9.498 16.518 30.588 22.209 47.106 12.711L697.65 538.258a34.5 34.5 0 0 0 12.71-12.71c9.499-16.519 3.808-37.608-12.71-47.106L433.362 326.476a34.5 34.5 0 0 0-17.198-4.592z" p-id="1528"></path></svg>'
  }

  pitch() { //选中
    return '<svg t="1617091126051" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2047" width="200" height="200"><path d="M515.328 958.976c-247.1424 0-448.2048-201.0624-448.2048-448.2048s201.0624-448.2048 448.2048-448.2048 448.2048 201.0624 448.2048 448.2048c-0.0512 247.1936-201.1136 448.2048-448.2048 448.2048z m0-834.9184c-213.248 0-386.7648 173.5168-386.7648 386.7648 0 213.248 173.5168 386.7648 386.7648 386.7648s386.7648-173.5168 386.7648-386.7648c-0.0512-213.2992-173.5168-386.7648-386.7648-386.7648z" p-id="2048"></path><path d="M458.4448 679.3216c-15.0528 0-29.5936-6.2464-39.936-17.2544L312.2176 549.376a30.73024 30.73024 0 0 1 1.28-43.4176 30.73024 30.73024 0 0 1 43.4176 1.28l101.4784 107.52 208.7936-229.1712a30.69952 30.69952 0 0 1 43.4176-1.9968 30.69952 30.69952 0 0 1 1.9968 43.4176l-213.5552 234.3936c-10.24 11.264-24.8832 17.7664-40.0896 17.92h-0.512z" p-id="2049"></path></svg>'
  }

  heart() { //爱心
    return '<svg t="1617157062092" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2388" width="200" height="200"><path d="M535.9 216.7l-22.9 23-22.9-23.1c-89.2-89.7-234.3-90.1-323.9-0.8l-0.8 0.8c-89.7 90.1-89.7 235.8 0 326L476 859.3c20.1 20.4 52.9 20.7 73.4 0.7l0.7-0.7 310.7-316.7c89.7-90.1 89.7-235.8 0-326-89.2-89.7-234.3-90.1-323.9-0.9l-1 1z" p-id="2389"></path></svg>'
  }

  triangleRight() { //左三角
    return '<svg t="1617162277573" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="834" width="200" height="200"><path d="M861.769143 609.601829L283.969829 991.700114A117.028571 117.028571 0 0 1 102.4 894.069029V129.930971a117.028571 117.028571 0 0 1 181.569829-97.631085l577.799314 382.098285a117.028571 117.028571 0 0 1 0 195.203658z" p-id="835"></path></svg>'
  }
}
export {
  SVGCON
};