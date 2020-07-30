/**
 * @description 菜单配置
 * @author wangfupeng
 */

/*表情菜单数据结构类型*/
/**
 *
 */
export type EmotionsContentType = {
    alt: string
    src: string
}
export type EmotionsType = {
    title: string
    type: string
    content: Array<EmotionsContentType | string>
}

/*表情菜单数据结构类型END*/
export default {
    menus: [
        'bold',
        'head',
        'link',
        'italic',
        'underline',
        'strikeThrough',
        'fontStyle',
        'justify',
        'fontSize',
        'quote',
        'backColor',
        'fontColor',
        'emoticon',
        'image',
        'video',
        'indent',
        'lineHeight',
    ],

    fontNames: ['宋体', '微软雅黑', 'Arial', 'Tahoma', 'Verdana'],

    fontSizes: {
        'x-small': '1',
        small: '2',
        normal: '3',
        large: '4',
        'x-large': '5',
        'xx-large': '6',
    },

    colors: [
        '#000000',
        '#eeece0',
        '#1c487f',
        '#4d80bf',
        '#c24f4a',
        '#8baa4a',
        '#7b5ba1',
        '#46acc8',
        '#f9963b',
        '#ffffff',
    ],
    /**
     * 表情配置菜单
     * 如果为emoji表情直接作为元素插入
     * emoticon:Array<EmotionsType>
     */
    emotions: [
        {
            // tab 的标题
            title: '默认',
            // type -> 'emoji' / 'image'
            type: 'image',
            // content -> 数组
            content: [
                {
                    alt: '[坏笑]',
                    src:
                        'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png',
                },
                {
                    alt: '[舔屏]',
                    src:
                        'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png',
                },
                {
                    alt: '[污]',
                    src:
                        'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/pcmoren_wu_org.png',
                },
            ],
        },
        {
            // tab 的标题
            title: '新浪',
            // type -> 'emoji' / 'image'
            type: 'image',
            // content -> 数组
            content: [
                {
                    src:
                        'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif',
                    alt: '[草泥马]',
                },
                {
                    src:
                        'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif',
                    alt: '[神马]',
                },
                {
                    src:
                        'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif',
                    alt: '[浮云]',
                },
            ],
        },
        {
            // tab 的标题
            title: 'emoji',
            // type -> 'emoji' / 'image'
            type: 'emoji',
            // content -> 数组
            content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/),
        },
        {
            // tab 的标题
            title: '手势',
            // type -> 'emoji' / 'image'
            type: 'emoji',
            // content -> 数组
            content: [
                '🙌',
                '👏',
                '👋',
                '👍',
                '👎',
                '👊',
                '✊',
                '️👌',
                '✋',
                '👐',
                '💪',
                '🙏',
                '️👆',
                '👇',
                '👈',
                '👉',
                '🖕',
                '🖐',
                '🤘',
            ],
        },
    ],
}
