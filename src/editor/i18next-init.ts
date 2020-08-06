/**
 * @description 国际化 初始化
 * @author 童汉
 */

import Editor from './index'

function i18nextInit(editor: Editor) {
    const { lang, languages } = editor.config

    if (editor.i18next != null) {
        try {
            editor.i18next.init({
                ns: 'wangEditor',
                lng: lang,
                defaultNS: 'wangEditor',
                resources: languages,
            })
        } catch (error) {
            throw new Error('i18next introduction error')
        }
        return
    }

    editor.i18next = {
        t(str: string) {
            const strArr = str.split('.')
            return strArr[strArr.length - 1]
        },
    }
}

export default i18nextInit
