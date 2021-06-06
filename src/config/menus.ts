/**
 * @description 菜单配置
 * @author wangfupeng
 */

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

// 特殊字符菜单数据结构类型
export type CharactersType = {
    title: string
    content: Array<string>
}

// font-size 类型
export type FontSizeConfType = {
    [key: string]: {
        name: string
        value: string
    }
}

// liuWei 2020-04-17 对于字体增加扩展类型
// font-style 类型
export type FontStyleType = Array<
    | {
          name: string
          value: string
      }
    | string
>

// indent
export interface IndentationOptions {
    value: number
    unit: string
}
export type IndentationType = string | IndentationOptions

// tooltip-position类型
export type tooltipPositionType = 'up' | 'down'

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
        'backColor',
        'link',
        'list',
        'todo',
        'justify',
        'quote',
        'character',
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
    //  fontNames: [{ name: '宋体', value: '宋体' }],

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
        '#ffffff',
        '#eeece0',
        '#1c487f',
        '#4d80bf',
        '#c24f4a',
        '#8baa4a',
        '#7b5ba1',
        '#46acc8',
        '#f9963b',
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
            title: '表情',
            // type -> 'emoji' / 'image'
            type: 'emoji',
            // content -> 数组
            content:
                '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😛 😝 😜 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😢 😭 😤 😠 😡 😳 😱 😨 🤗 🤔 😶 😑 😬 🙄 😯 😴 😷 🤑 😈 🤡 💩 👻 💀 👀 👣'.split(
                    /\s/
                ),
        },
        {
            // tab 的标题
            title: '手势',
            // type -> 'emoji' / 'image'
            type: 'emoji',
            // content -> 数组
            content:
                '👐 🙌 👏 🤝 👍 👎 👊 ✊ 🤛 🤜 🤞 ✌️ 🤘 👌 👈 👉 👆 👇 ☝️ ✋ 🤚 🖐 🖖 👋 🤙 💪 🖕 ✍️ 🙏'.split(
                    /\s/
                ),
        },
    ],
    /**
     * 特殊字符配置菜单
     * character:Array<CharactersType>
     */
    characters: [
        {
            // tab 的标题
            title: '所有',
            // type: 'character',
            content:
                '$ ¢ € £ ¥ ¤ ₠ ₡ ₢ ₣ ₤ ₥ ₦ ₧ ₨ ₩ ₪ ₫ ₭ ₮ ₯ ₰ ₱ ₲ ₳ ₴ ₵ ₶ ₷ ₸ ₹ ₺ ₻ ₼ ₽ 円 元 圓 圆 © ® ™ ‰ µ · • … ′ ″ § ¶ ß ‹ › « » ‘ ’ “ ” ‚ „ < > ≤ ≥ – — ¯ ‾ ¤ ¦ ¨ ¡ ¿ ˆ ˜ ° − ± ÷ ⁄ × ¹ ² ³ ¼ ½ ¾ ƒ ∫ ∑ ∞ √ ∼ ≅ ≈ ≠ ≡ ∈ ∉ ∋ ∏ ∧ ∨ ¬ ∩ ∪ ∂ ∀ ∃ ∅ ∇ ∗ ∝ ∠ À Á Â Ã Ä Å Ā Æ Ç È É Ê Ë Ē Ì Í Î Ï Ī Ð Ñ Ò Ó Ô Õ Ö Ø Ō Œ Š Ù Ú Û Ü Ū Ý Ÿ Ȳ Þ à á â ã ä å ā æ ç è é ê ë ē ì í î ï ī ð ñ ò ó ô õ ö ø ō œ š ù ú û ü ū ý þ ÿ ȳ Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω ℵ ϖ ℜ ϒ ℘ ℑ ← ↑ → ↓ ↔ ↵ ⇐ ⇑ ⇒ ⇓ ⇔ ∴ ⊂ ⊃ ⊄ ⊆ ⊇ ⊕ ⊗ ⊥ ⋅ ⌈ ⌉ ⌊ ⌋ 〈 〉 ◊ ♠ ♣ ♥ ♦'.split(
                    /\s/
                ),
        },
        {
            // tab 的标题
            title: '货币',
            // type: 'character',
            content:
                '$ ¢ € £ ¥ ¤ ₠ ₡ ₢ ₣ ₤ ₥ ₦ ₧ ₨ ₩ ₪ ₫ ₭ ₮ ₯ ₰ ₱ ₲ ₳ ₴ ₵ ₶ ₷ ₸ ₹ ₺ ₻ ₼ ₽ 円 元 圓 圆'.split(
                    /\s/
                ),
        },
        {
            // tab 的标题
            title: '文本',
            // type: 'character',
            content: '© ® ™ ‰ µ · • … ′ ″ § ¶ ß'.split(/\s/),
        },
        {
            // tab 的标题
            title: '报价单',
            // type: 'character',
            content:
                '‹ › « » ‘ ’ “ ” ‚ „ < > ≤ ≥ – — ¯ ‾ ¤ ¦ ¨ ¡ ¿ ˆ ˜ ° − ± ÷ ⁄ × ¹ ² ³ ¼ ½ ¾'.split(
                    /\s/
                ),
        },
        {
            // tab 的标题
            title: '数学',
            // type: 'character',
            content: 'ƒ ∫ ∑ ∞ √ ∼ ≅ ≈ ≠ ≡ ∈ ∉ ∋ ∏ ∧ ∨ ¬ ∩ ∪ ∂ ∀ ∃ ∅ ∇ ∗ ∝ ∠'.split(/\s/),
        },
        {
            // tab 的标题
            title: '拉丁语',
            // type: 'character',
            content:
                'À Á Â Ã Ä Å Ā Æ Ç È É Ê Ë Ē Ì Í Î Ï Ī Ð Ñ Ò Ó Ô Õ Ö Ø Ō Œ Š Ù Ú Û Ü Ū Ý Ÿ Ȳ Þ à á â ã ä å ā æ ç è é ê ë ē ì í î ï ī ð ñ ò ó ô õ ö ø ō œ š ù ú û ü ū ý þ ÿ ȳ Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω'.split(
                    /\s/
                ),
        },
        {
            // tab 的标题
            title: '符号',
            // type: 'character',
            content: 'ℵ ϖ ℜ ϒ ℘ ℑ'.split(/\s/),
        },
        {
            // tab 的标题
            title: '箭头',
            // type: 'character',
            content: '← ↑ → ↓ ↔ ↵ ⇐ ⇑ ⇒ ⇓ ⇔ ∴ ⊂ ⊃ ⊄ ⊆ ⊇ ⊕ ⊗ ⊥ ⋅ ⌈ ⌉ ⌊ ⌋ 〈 〉 ◊ ♠ ♣ ♥ ♦'.split(
                /\s/
            ),
        },
    ],

    lineHeights: ['1', '1.15', '1.6', '2', '2.5', '3'],

    undoLimit: 20,

    indentation: '2em',

    showMenuTooltips: true,

    // 菜单栏tooltip为上标还是下标
    menuTooltipPosition: 'up',
}
