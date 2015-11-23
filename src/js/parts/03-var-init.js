//------------------------------------定义全局变量------------------------------------
var document = window.document,
    $document = $(document),
    $window = $(window),
    $body = $('body'),

    hostname = window.location.hostname,
    isDemo = hostname === 'wangeditor.github.io' || hostname === 'wangEditor.github.io',
    // isDemo = hostname === 'localhost',

    //是否支持W3C的selection操作？
	supportRange = typeof document.createRange === 'function',
    //浏览器类型
    isIE = !!window.ActiveXObject || "ActiveXObject" in window,  //包括IE11
    isFireFox = navigator.userAgent.indexOf("Firefox") > 0,

    //id前缀
    idPrefix = 'wangeditor_' + Math.random().toString().replace('.', '') + '_',
    globalNum = 1,

    //最大的缓存步数
    comandRecordMaxLength = 10,

    //url中的不安全关键字
    urlUnsafeKeywords = ['<', '>', '(', ')'],

    //全局的构造函数
	$E = function($textarea, options){
        return new $E.fn.init($textarea, options);
    };

//prototype简写为fn
$E.fn = $E.prototype;