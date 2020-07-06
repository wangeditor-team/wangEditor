module.exports = {
    // 遍历对象
    objForEach: function (obj, fn) {
        let key, result
        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result = fn.call(obj, key, obj[key])
                if (result === false) {
                    break
                }
            }
        }
    },
}
