// 定义构造函数
(function (window, $) {
    if (window.wangEditor) {
        // 重复引用
        alert('一个页面不能重复引用 wangEditor.js 或 wangEditor.min.js ！！！');
        return;
    }

    // 编辑器（整体）构造函数
    var E = function (elem) {
        // 支持 id 和 element 两种形式
        if (typeof elem === 'string') {
            elem = '#' + elem;
        }

        // ---------------获取基本节点------------------
        var $elem = $(elem);
        if ($elem.length !== 1) {
            return;
        }
        var nodeName = $elem[0].nodeName;
        if (nodeName !== 'TEXTAREA' && nodeName !== 'DIV') {
            // 只能是 textarea 和 div ，其他类型的元素不行
            return;   
        }
        this.valueNodeName = nodeName.toLowerCase();
        this.$valueContainer = $elem;

        // 记录 elem 的 prev 和 parent（最后渲染 editor 要用到）
        this.$prev = $elem.prev();
        this.$parent = $elem.parent();

        // ------------------初始化------------------
        this.init();
    };

    E.fn = E.prototype;

    E.$body = $('body');
    E.$document = $(document);
    E.$window = $(window);
    E.userAgent = navigator.userAgent;
    E.getComputedStyle = window.getComputedStyle;
    E.w3cRange = typeof document.createRange === 'function';
    E.hostname = location.hostname.toLowerCase();
    E.websiteHost = 'wangeditor.github.io|www.wangeditor.com|wangeditor.coding.me';
    E.isOnWebsite = E.websiteHost.indexOf(E.hostname) >= 0;
    E.docsite = 'http://www.kancloud.cn/wangfupeng/wangeditor2/113961';

    // 暴露给全局对象
    window.wangEditor = E;

    // 注册 plugin 事件，用于用户自定义插件
    // 用户在引用 wangEditor.js 之后，还可以通过 E.plugin() 注入自定义函数，
    // 该函数将会在 editor.create() 方法的最后一步执行
    E.plugin = function (fn) {
        if (!E._plugins) {
            E._plugins = [];
        }

        if (typeof fn === 'function') {
            E._plugins.push(fn);
        }
    };

})(window, $);