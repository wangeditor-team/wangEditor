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

    // 是否开启 debug 模式（debug 模式下错误会 throw error 形式抛出）
    debug: false,

    // 是否显示添加网络图片的 tab
    showLinkImg: true,

    // 默认上传图片 max size: 5M
    uploadImgMaxSize: 5 * 1024 * 1024,

    // 上传图片，是否显示 base64 格式
    uploadImgShowBase64: false,

    // 上传图片，server 地址（如果有值，则 base64 格式的配置则失效）
    // uploadImgServer: '/upload',

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
    uploadImgTimeout: 5000,

    // 上传图片 hook 
    uploadImgHooks: {
        before: function (xhr, editor, files) {

        },
        success: function (xhr, editor, result) {

        },
        fail: function (xhr, editor, result) {

        },
        error: function (xhr, editor) {

        },
        timeout: function (xhr, editor) {

        }
    }
}

export default config