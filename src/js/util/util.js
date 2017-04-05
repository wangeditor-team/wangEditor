/*
    工具
*/

// 遍历对象
export function objForEach(obj, fn) {
    let key, result
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            result = fn.call(obj, key, obj[key])
            if (result === false) {
                break
            }
        }
    }
}

// 遍历类数组
export function arrForEach(fakeArr, fn) {
    let i, item, result
    const length = fakeArr.length || 0
    for (i = 0; i < length; i++) {
        item = fakeArr[i]
        result = fn.call(fakeArr, item, i)
        if (result === false) {
            break
        }
    }
}