// 引入svg文件
import {SVGCON} from './svgParams';
let newSvg = new SVGCON();

function svgNameSwtich(t){
    // 名字以-划分
    let name = t;
    let newArray = name.split('-');
    let switchName = '';
    for(let i = 0; i < newArray.length; i++){
        if(i != 0){
            let word = newArray[i];
            newArray[i] = word.substring(0,1).toUpperCase()+word.substring(1);
        }
        switchName = switchName + newArray[i]
    }
    return switchName;
}

export function svgIcon(t,c){
    let name = '';
    if(t){
        // t转换成对应的svg函数名
        name = svgNameSwtich(t);
        return newSvg.svgXml(name,c);
    }
}

export function iconClassName(t){
    let classType = t;
    let className = '';
    switch (classType){
        case 'loading':
            className = 'm-icon-loading'
            break;
        default:
            break;
    }
    return className;
}