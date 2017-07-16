/*
    替换多语言
 */

export default function (editor, str) {
    const langArgs = editor.config.langArgs || []
    let result = str

    langArgs.forEach(item => {
        const reg = item.reg
        const val = item.val

        if (reg.test(result)) {
            result = result.replace(reg, function () {
                return val
            })
        }
    })

    return result
}