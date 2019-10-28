//matching algorithm
// export const doubleMetaphoneCompare = (tuple1, tuple2, threshold) => {
//     const thresholdEnum = Object.freeze({ STRONG: 1, NORMAL: 2, WEAK: 3})

//     if (threshold === thresholdEnum.WEAK) {
//         if (tuple1[1] === tuple2[1]) {
//             return true;
//         }
//     } else if (threshold === thresholdEnum.NORMAL) {
//         debugger
//         if (tuple1[0] === tuple2[1] || tuple1[1] === tuple2[0]) {
//             debugger
//             return true;
//         }
//     } else {
//         if (tuple1[0] === tuple2[0]) {
//             return true; 
//         } 
        
//         return false;
//     }
// }

import {stylizeString} from './stylizeBankNames'


const alphaNumerizer = (string) => {
    const alphanumeric = ('0123456789ABCDEFGHIJKLMOPQRSTUVWXYZ').split('');
    let result = ''

    for (let i = 0; i < string.length; i++) {
        if (alphanumeric.includes(string[i])) {
            result += string[i]
        }
    }

    return result
}


export const nameMatcher = (inputName, matchToName) => {
    const name = alphaNumerizer(inputName.toUpperCase());
    const matchNameArray = alphaNumerizer(matchToName.toUpperCase()).split('');
    const denominator = matchNameArray.length;
    let matchCount = 0;

    for (let i = 0; i < name.length; i++) {
        if (matchNameArray.includes(name[i])){
            matchCount += 1;
        }
        return matchCount;
    }
    
    debugger

    if (denominator === 0) {
        return 0;
    } else {
        return (matchCount/denominator);
    }
}


export const uniquefier = (nameset) => {
    let arr = Array.from(nameset)
    let result = {};
    
    for (let i = 0; i < arr.length; i++) {
        let key = stylizeString(arr[i])

        if (result[key] === undefined ) {
            result[key] = key;
        } else {
            if (nameMatcher(key, result[key]) > 0.8) {
                let value = result[key];
                result[key] = stylizeString(value);
            } else {
                result[key] = stylizeString(key);
            }
        }
    }
    
    return result;
}