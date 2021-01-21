/**
 * @description 菜单配置
 * @author wangfupeng
 */

const SINA_PATH1 = 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal'
const SINA_PATH2 = 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal'

// 表情菜单数据结构类型
export type EmotionsContentType = {
    alt: string
    src: string
}
export type EmotionsType = {
    title: string
    type: string
    content: Array<EmotionsContentType | string>
}

// font-size 类型
export type FontSizeConfType = {
    [key: string]: {
        name: string
        value: string
    }
}

// indent
export interface IndentationOptions {
    value: number
    unit: string
}
export type IndentationType = string | IndentationOptions

/*表情菜单数据结构类型END*/
export default {
    menus: [
        'head',
        'bold',
        'fontSize',
        // 'customFontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        // 'foreColorPicker',
        'backColor',
        // 'backColorPicker',
        'link',
        'list',
        'todo',
        'justify',
        'quote',
        'emoticon',
        'image',
        'video',
        'table',
        'code',
        'splitLine',
        'undo',
        'redo',
    ],

    fontNames: [
        '黑体',
        '仿宋',
        '楷体',
        '标楷体',
        '华文仿宋',
        '华文楷体',
        '宋体',
        '微软雅黑',
        'Arial',
        'Tahoma',
        'Verdana',
        'Times New Roman',
        'Courier New',
    ],

    fontSizes: {
        'x-small': {
            name: '10px',
            value: '1',
        },
        small: {
            name: '13px',
            value: '2',
        },
        normal: {
            name: '16px',
            value: '3',
        },
        large: {
            name: '18px',
            value: '4',
        },
        'x-large': {
            name: '24px',
            value: '5',
        },
        'xx-large': {
            name: '32px',
            value: '6',
        },
        'xxx-large': {
            name: '48px',
            value: '7',
        },
    },

    // customFontSize: [ // 该菜单暂时不用 - 王福朋 20200924
    //     { value: '9px', text: '9' },
    //     { value: '10px', text: '10' },
    //     { value: '12px', text: '12' },
    //     { value: '14px', text: '14' },
    //     { value: '16px', text: '16' },
    //     { value: '20px', text: '20' },
    //     { value: '42px', text: '42' },
    //     { value: '72px', text: '72' },
    // ],

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

    //插入代码语言配置
    languageType: [
        'Bash',
        'C',
        'C#',
        'C++',
        'CSS',
        'Java',
        'JavaScript',
        'JSON',
        'TypeScript',
        'Plain text',
        'Html',
        'XML',
        'SQL',
        'Go',
        'Kotlin',
        'Lua',
        'Markdown',
        'PHP',
        'Python',
        'Shell Session',
        'Ruby',
    ],

    languageTab: '　　　　',
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
                    src: `${SINA_PATH1}/50/pcmoren_huaixiao_org.png`,
                },
                {
                    alt: '[舔屏]',
                    src: `${SINA_PATH1}/40/pcmoren_tian_org.png`,
                },
                {
                    alt: '[污]',
                    src: `${SINA_PATH1}/3c/pcmoren_wu_org.png`,
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
                    src: `${SINA_PATH2}/7a/shenshou_thumb.gif`,
                    alt: '[草泥马]',
                },
                {
                    src: `${SINA_PATH2}/60/horse2_thumb.gif`,
                    alt: '[神马]',
                },
                {
                    src: `${SINA_PATH2}/bc/fuyun_thumb.gif`,
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

    lineHeights: ['1', '1.15', '1.6', '2', '2.5', '3'],

    undoLimit: 20,

    indentation: '2em',

    showMenuTooltips: true,
}
