/*
    配置信息
*/

const config = {

    // 默认菜单配置
    menus: [
        'head',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'foreColor',
        'backColor',
        'link',
        'list',
        'justify',
        'quote',
        'emoticon',
        'image',
        'table',
        'video',
        'code',
        'undo',
        'redo'
    ],

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
        '#ffffff'
    ],

    // // 语言配置
    // lang: {
    //     '设置标题': 'title',
    //     '正文': 'p',
    //     '链接文字': 'link text',
    //     '链接': 'link',
    //     '插入': 'insert',
    //     '创建': 'init'
    // },

    // 表情
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
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
                },
                {
                    alt: '[舔屏]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
                },
                {
                    alt: '[污]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/pcmoren_wu_org.png'
                },
                {
                    alt: '[允悲]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2c/moren_yunbei_org.png'
                },
                {
                    alt: '[笑而不语]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3a/moren_xiaoerbuyu_org.png'
                },
                {
                    alt: '[费解]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/moren_feijie_org.png'
                },
                {
                    alt: '[憧憬]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/37/moren_chongjing_org.png'
                },
                {
                    alt: '[并不简单]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fc/moren_bbjdnew_org.png'
                },
                {
                    alt: '[微笑]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/5c/huanglianwx_org.gif'
                },
                {
                    alt: '[酷]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/pcmoren_cool2017_org.png'
                },
                {
                    alt: '[嘻嘻]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/tootha_org.gif'
                },
                {
                    alt: '[哈哈]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6a/laugh.gif'
                },
                {
                    alt: '[可爱]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/tza_org.gif'
                },
                {
                    alt: '[可怜]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/kl_org.gif'
                },
                {
                    alt: '[挖鼻]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/wabi_org.gif'
                },
                {
                    alt: '[吃惊]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f4/cj_org.gif'
                },
                {
                    alt: '[害羞]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/shamea_org.gif'
                },
                {
                    alt: '[挤眼]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c3/zy_org.gif'
                },
                {
                    alt: '[闭嘴]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/bz_org.gif'
                },
                {
                    alt: '[鄙视]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/bs2_org.gif'
                },
                {
                    alt: '[爱你]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/lovea_org.gif'
                },
                {
                    alt: '[泪]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/sada_org.gif'
                },
                {
                    alt: '[偷笑]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/19/heia_org.gif'
                },
                {
                    alt: '[亲亲]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/qq_org.gif'
                },
                {
                    alt: '[生病]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b6/sb_org.gif'
                },
                {
                    alt: '[太开心]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_org.gif'
                },
                {
                    alt: '[白眼]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/landeln_org.gif'
                },
                {
                    alt: '[右哼哼]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/98/yhh_org.gif'
                },
                {
                    alt: '[左哼哼]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/zhh_org.gif'
                },
                {
                    alt: '[嘘]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a6/x_org.gif'
                },
                {
                    alt: '[衰]',
                    src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/cry.gif'
                }
            ]
        },
        {
            // tab 的标题
            title: '新浪',
            // type -> 'emoji' / 'image'
            type: 'image',
            // content -> 数组
            content: [
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif',
                    alt: '[草泥马]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif',
                    alt: '[神马]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif',
                    alt: '[浮云]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif',
                    alt: '[给力]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif',
                    alt: '[围观]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif',
                    alt: '[威武]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/panda_thumb.gif',
                    alt: '[熊猫]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/rabbit_thumb.gif',
                    alt: '[兔子]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/otm_thumb.gif',
                    alt: '[奥特曼]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/j_thumb.gif',
                    alt: '[囧]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/hufen_thumb.gif',
                    alt: '[互粉]'
                },
                {
                    src: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/liwu_thumb.gif',
                    alt: '[礼物]'
                }
            ]
        },
        {
            // tab 的标题
            title: 'emoji',
            // type -> 'emoji' / 'image'
            type: 'emoji',
            // content -> 数组
            content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁  😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/)
        },
        // {
        //     // tab 的标题
        //     title: '手势',
        //     // type -> 'emoji' / 'image'
        //     type: 'emoji',
        //     // content -> 数组
        //     content: ['🙌', '👏', '👋', '👍', '👎', '👊', '✊', '️👌', '✋', '👐', '💪', '🙏', '️👆', '👇', '👈', '👉', '🖕', '🖐', '🤘']
        // }
    ],

    // 编辑区域的 z-index
    zIndex: 10000,

    // 是否开启 debug 模式（debug 模式下错误会 throw error 形式抛出）
    debug: false,

    // 插入链接时候的格式校验
    linkCheck: function (text, link) {
        // text 是插入的文字
        // link 是插入的链接
        return true // 返回 true 即表示成功
        // return '校验失败' // 返回字符串即表示失败的提示信息
    },

    // 插入网络图片的校验
    linkImgCheck: function (src) {
        // src 即图片的地址
        return true // 返回 true 即表示成功
        // return '校验失败'  // 返回字符串即表示失败的提示信息
    },

    // 粘贴过滤样式，默认开启
    pasteFilterStyle: true,

    // 对粘贴的文字进行自定义处理，返回处理后的结果。编辑器会将处理后的结果粘贴到编辑区域中。
    // IE 暂时不支持
    pasteTextHandle: function (content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        return content
    },

    // onchange 事件
    // onchange: function (html) {
    //     // html 即变化之后的内容
    //     console.log(html)
    // },

    // 是否显示添加网络图片的 tab
    showLinkImg: true,

    // 插入网络图片的回调
    linkImgCallback: function (url) {
        // console.log(url)  // url 即插入图片的地址
    },

    // 默认上传图片 max size: 5M
    uploadImgMaxSize: 5 * 1024 * 1024,

    // 配置一次最多上传几个图片
    // uploadImgMaxLength: 5,

    // 上传图片，是否显示 base64 格式
    uploadImgShowBase64: false,

    // 上传图片，server 地址（如果有值，则 base64 格式的配置则失效）
    // uploadImgServer: '/upload',

    // 自定义配置 filename
    uploadFileName: '',

    // 上传图片的自定义参数
    uploadImgParams: {
        // token: 'abcdef12345'
    },

    // 上传图片的自定义header
    uploadImgHeaders: {
        // 'Accept': 'text/x-json'
    },

    // 配置 XHR withCredentials
    withCredentials: false,

    // 自定义上传图片超时时间 ms
    uploadImgTimeout: 10000,

    // 上传图片 hook 
    uploadImgHooks: {
        // customInsert: function (insertLinkImg, result, editor) {
        //     console.log('customInsert')
        //     // 图片上传并返回结果，自定义插入图片的事件，而不是编辑器自动插入图片
        //     const data = result.data1 || []
        //     data.forEach(link => {
        //         insertLinkImg(link)
        //     })
        // },
        before: function (xhr, editor, files) {
            // 图片上传之前触发

            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //     prevent: true,
            //     msg: '放弃上传'
            // }
        },
        success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
        },
        fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
        },
        error: function (xhr, editor) {
            // 图片上传出错时触发
        },
        timeout: function (xhr, editor) {
            // 图片上传超时时触发
        }
    },

    // 是否上传七牛云，默认为 false
    qiniu: false,

    // 上传图片自定义提示方法
    // customAlert: function (info) {
    //     // 自定义上传提示
    // },
    
    // // 自定义上传图片
    // customUploadImg: function (files, insert) {
    //     // files 是 input 中选中的文件列表
    //     // insert 是获取图片 url 后，插入到编辑器的方法
    //     insert(imgUrl)
    // }
}

export default config