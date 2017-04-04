(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.wangEditor = factory());
}(this, (function () { 'use strict';

/*
    poly-fill
*/

var polyfill = function () {

    // Object.assign
    if (typeof Object.assign != 'function') {
        Object.assign = function (target, varArgs) {
            // .length of function is 2
            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) {
                    // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
};

/*
    DOM 操作 API
*/

// 根据 html 代码片段创建 dom 对象
function createElemByHTML(html) {
    var div = void 0;
    div = document.createElement('div');
    div.innerHTML = html;
    return div.children;
}

// 是否是 DOM List
function isDOMList(selector) {
    if (!selector) {
        return false;
    }
    if (selector instanceof HTMLCollection || selector instanceof NodeList) {
        return true;
    }
    return false;
}

// 封装 document.querySelectorAll
function querySelectorAll(selector) {
    var result = document.querySelectorAll(selector);
    if (isDOMList(result)) {
        return result;
    } else {
        return [result];
    }
}

// 创建构造函数
function DomElement(selector) {
    if (!selector) {
        return;
    }

    // selector 本来就是 DomElement 对象，直接返回
    if (selector instanceof DomElement) {
        return selector;
    }

    this.selector = selector;

    // 根据 selector 得出的结果（如 DOM，DOM List）
    var selectorResult = [];
    if (selector.nodeType === 1) {
        // 单个 DOM 节点
        selectorResult = [selector];
    } else if (isDOMList(selector)) {
        // DOM List
        selectorResult = selector;
    } else if (typeof selector === 'string') {
        // 字符串
        if (selector.indexOf('<') === 0) {
            // 如 <div>
            selectorResult = createElemByHTML(selector);
        } else {
            // 如 #id .class
            selectorResult = querySelectorAll(selector);
        }
    }

    var length = selectorResult.length;
    if (!length) {
        return;
    }

    // 加入 DOM 节点
    var i = void 0;
    for (i = 0; i < length; i++) {
        this[i] = selectorResult[i];
    }
    this.length = length;
}

// 修改原型
DomElement.prototype = {
    constructor: DomElement,

    // 类数组，forEach
    forEach: function forEach(fn) {
        var i = void 0;
        for (i = 0; i < this.length; i++) {
            var dom = this[i];
            fn.call(dom, dom);
        }
        return this;
    },

    // 绑定事件
    on: function on(type, fn) {
        return this.forEach(function (dom) {
            dom.addEventListener(type, fn.bind(dom));
        });
    },

    // 修改属性
    attr: function attr(key, val) {
        return this.forEach(function (dom) {
            dom.setAttribute(key, val);
        });
    },

    // 添加 class
    addClass: function addClass(className) {
        if (!className) {
            return this;
        }
        return this.forEach(function (dom) {
            if (dom.className) {
                dom.className = dom.className + ' ' + className;
            } else {
                dom.className = className;
            }
        });
    },

    // 修改 css
    css: function css(key, val) {
        return this.forEach(function (dom) {
            var style = dom.getAttribute('style');
            if (style) {
                // style 有值
                style = key + ': ' + val + ';' + style;
            } else {
                // style 无值
                style = key + ': ' + val + ';';
            }
            dom.setAttribute('style', style);
        });
    },

    // 增加子节点
    append: function append(elem) {
        if (!elem) {
            return this;
        }
        return this.forEach(function (dom) {
            if (elem.nodeType === 1) {
                // elem 是 DOM 节点
                dom.appendChild(elem);
            } else if (elem instanceof DomElement) {
                // elem 是 DomElement 对象
                elem.forEach(function (elemDom) {
                    dom.appendChild(elemDom);
                });
            }
        });
    },

    // 移除当前节点
    remove: function remove() {
        return this.forEach(function (dom) {
            if (dom.remove) {
                dom.remove();
            } else {
                var parent = dom.parentElement;
                parent.removeChild(dom);
            }
        });
    }
};

var $ = (function (selector) {
    return new DomElement(selector);
});

/*
    配置信息
*/

var config = {
    menus: ['bold', 'head', 'link']
};

/*
    工具
*/

// 遍历对象
function objForEach(obj, fn) {
    var key = void 0,
        result = void 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            result = fn.call(obj, key, obj[key]);
            if (result === false) {
                break;
            }
        }
    }
}

/*
    bold-menu
*/
// 构造函数
function Bold(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-bold"><i/></div>');
    this.type = 'click';

    // 当前是否 active 状态
    this.active = false;
}

// 原型
Bold.prototype = {
    constructor: Bold,

    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {}
};

/*
    droplist
*/

// 构造函数
function DropList() {}

// 原型
DropList.prototype = {
    constructor: DropList,

    // 显示（插入DOM）
    show: function show() {},

    // 隐藏（移除DOM）
    hide: function hide() {}
};

/*
    menu - header
*/
// 构造函数
function Head(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-header"><i/></div>');
    this.type = 'droplist';

    // 当前是否 active 状态
    this.active = false;

    // 初始化 droplist
    this.droplist = new DropList();
}

// 原型
Head.prototype = {
    constructor: Head,

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {}
};

/*
    panel
*/

// 构造函数
function Panel() {}

// 原型
Panel.prototype = {
    constructor: Panel,

    // 显示（插入DOM）
    show: function show() {},

    // 隐藏（移除DOM）
    hide: function hide() {}
};

/*
    menu - link
*/
// 构造函数
function Link(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-link"><i/></div>');
    this.type = 'panel';

    // 当前是否 active 状态
    this.active = false;

    // 初始化 Panel
    this.panel = new Panel();
}

// 原型
Link.prototype = {
    constructor: Link,

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {}
};

/*
    所有菜单的汇总
*/

// 存储菜单的构造函数
var MenuConstructors = {};

MenuConstructors.bold = Bold;

MenuConstructors.head = Head;

MenuConstructors.link = Link;

/*
    菜单集合
*/
// 构造函数
function Menus(editor) {
    this.editor = editor;
    this.menus = {};
}

// 修改原型
Menus.prototype = {
    constructor: Menus,

    // 初始化菜单
    init: function init() {
        var _this = this;

        var editor = this.editor;
        var config = editor.config || {};
        var configMenus = config.menus || []; // 获取配置中的菜单

        // 根据配置信息，创建菜单
        configMenus.forEach(function (menuKey) {
            var MenuConstructor = MenuConstructors[menuKey];
            if (MenuConstructor && typeof MenuConstructor === 'function') {
                // 创建单个菜单
                _this.menus[menuKey] = new MenuConstructor(editor);
            }
        });

        // 添加到菜单栏
        this._addToToolbar();

        // 绑定事件
        this._bindEvent();
    },

    // 添加到菜单栏
    _addToToolbar: function _addToToolbar() {
        var editor = this.editor;
        var $toolbarElem = editor.$toolbarElem;
        var menus = this.menus;
        objForEach(menus, function (key, menu) {
            var $elem = menu.$elem;
            if ($elem) {
                $toolbarElem.append($elem);
            }
        });
    },

    // 绑定菜单 click mouseenter 事件
    _bindEvent: function _bindEvent() {
        var menus = this.menus;
        objForEach(menus, function (key, menu) {
            var type = menu.type;
            if (!type) {
                return;
            }
            var $elem = menu.$elem;
            var droplist = menu.droplist;
            var panel = menu.panel;

            // 点击类型，例如 bold
            if (type === 'click' && menu.onClick) {
                $elem.on('click', function (e) {
                    menu.onClick(e);
                });
            }

            // 下拉框，例如 head
            if (type === 'droplist' && droplist) {
                $elem.on('mouseenter', function (e) {
                    // 显示
                    if (droplist.hideTimeoutId) {
                        // 清除之前的定时隐藏
                        clearTimeout(droplist.hideTimeoutId);
                    }
                    droplist.show();
                }).on('mouseleave', function (e) {
                    // 定时隐藏
                    droplist.hideTimeoutId = setTimeout(function () {
                        droplist.hide();
                    }, 500);
                });
            }

            // 弹框类型，例如 link
            if (type === 'panel' && panel) {
                $elem.on('click', function (e) {
                    panel.show();
                });
            }
        });
    },

    // 尝试修改菜单状态
    changeActive: function changeActive() {
        var menus = this.menus;
        objForEach(menus, function (key, menu) {
            if (menu.tryChangeActive) {
                menu.tryChangeActive();
            }
        });
    }
};

/*
    编辑区域
*/

// 构造函数
function Text(editor) {
    this.editor = editor;
}

// 修改原型
Text.prototype = {
    constructor: Text,

    // 初始化
    init: function init() {
        // 绑定事件
        this._bindEvent();
    },

    // 绑定事件
    _bindEvent: function _bindEvent() {}
};

/*
    命令，封装 document.execCommand
*/

// 构造函数
function Command(editor) {
    this.editor = editor;
}

// 修改原型
Command.prototype = {
    constructor: Command
};

/*
    selection range API
*/

// 构造函数
function API(editor) {
    this.editor = editor;
    this.currentRange = null;
}

// 修改原型
API.prototype = {
    constructor: API,

    // 设置选区
    setSelection: function setSelection(range) {
        if (range) {
            this.currentRange = range;
        } else {
            this.currentRange = window.getSelection();
        }
    },

    // 选中区域的文字
    getSelectionText: function getSelectionText() {},

    // 选区的 Elem
    getSelectionElem: function getSelectionElem() {},

    // 恢复选区
    restoreSelection: function restoreSelection() {}
};

/*
    编辑器构造函数
*/

// id，累加
var editorId = 1;

// 构造函数
function Editor(toolbarSelector, textSelector) {
    if (toolbarSelector == null) {
        // 没有传入任何参数，报错
        throw new Error('错误：初始化编辑器时候未传入任何参数，请查阅文档');
    }
    // id，用以区分单个页面不同的编辑器对象
    this.id = 'wangEditor-' + editorId++;

    this.toolbarSelector = toolbarSelector;
    this.textSelector = textSelector;

    // 自定义配置
    this.customConfig = {};
}

// 修改原型
Editor.prototype = {
    constructor: Editor,

    // 初始化 DOM
    _initDom: function _initDom() {
        var toolbarSelector = this.toolbarSelector;
        var textSelector = this.textSelector;
        if (textSelector == null) {
            // 只传入一个参数，即是容器的选择器或元素，toolbar 和 text 的元素自行创建
            var $toolbarElem = $('<div><!--wangEditor toolbar--></div>');
            var $textElem = $('<div><!--wangEditor text--><p><br></p></div>');
            // 添加到 DOM 结构中
            $(toolbarSelector).append($toolbarElem).append($textElem);

            // 记录属性
            this.$toolbarElem = $toolbarElem;
            this.$textElem = $textElem;

            // 自行创建的，需要配置默认的样式
            this.$toolbarElem.css('background-color', '#f1f1f1').css('border', '1px solid #ccc');
            this.$textElem.css('border-top', 'none').css('border', '1px solid #ccc').css('min-height', '300px');
        } else {
            // toolbar 和 text 的选择器都有值，记录属性
            this.$toolbarElem = $(toolbarSelector);
            this.$textElem = $(textSelector);
        }

        // 设置样式
        this.$toolbarElem.addClass('w-e-toolbar');
        this.$textElem.addClass('w-e-text');

        // 设置编辑区域可编辑
        this.$textElem.attr('contenteditable', 'true');
    },

    // 初始化配置
    _initConfig: function _initConfig() {
        // _config 是默认配置，this.customConfig 是用户自定义配置，将它们 merge 之后再赋值
        var target = {};
        this.config = Object.assign(target, config, this.customConfig);
    },

    // 初始化菜单
    _initMenus: function _initMenus() {
        this.menus = new Menus(this);
        this.menus.init();
    },

    // 添加 text 区域
    _initText: function _initText() {
        this.text = new Text(this);
        this.text.init();
    },

    // 封装 command
    _initCommand: function _initCommand() {
        this.cmd = new Command(this);
    },

    // 封装 selection range API
    _initSelectionAPI: function _initSelectionAPI() {
        this.sAPI = new API(this);
    },

    // 创建编辑器
    create: function create() {
        // 初始化 DOM
        this._initDom();

        // 初始化配置信息
        this._initConfig();

        // 初始化菜单
        this._initMenus();

        // 添加 text
        this._initText();

        // 封装 command API
        this._initCommand();

        // 封装 selection range API
        this._initSelectionAPI();
    }
};

// polyfill
polyfill();

// 将 css 代码添加到 <style> 中
function createStyle(cssContent) {
    var style;
    if (document.all) {
        window.style = cssContent;
        document.createStyleSheet('javascript:style');
    } else {
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = cssContent;
        document.getElementsByTagName('HEAD').item(0).appendChild(style);
    }
}
// 这里的 `inlinecss` 将被替换成 css 代码的内容，详情可去 ./gulpfile.js 中搜索 `inlinecss` 关键字
var inlinecss = '.w-e-toolbar,.w-e-text,.w-e-menu-panel {  padding: 0;  margin: 0;  box-sizing: border-box;}.w-e-toolbar *,.w-e-text *,.w-e-menu-panel * {  padding: 0;  margin: 0;  box-sizing: border-box;}.w-e-clear-fix:after {  content: "";  display: table;  clear: both;}@font-face {  font-family: \'icomoon\';  src: url(data:application/x-font-ttf;charset=utf-8;base64,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);  src: url(data:application/x-font-ttf;charset=utf-8;base64,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) format(\'truetype\'), url(data:application/x-font-woff;charset=utf-8;base64,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) format(\'woff\');  font-weight: normal;  font-style: normal;}[class^="w-e-icon-"],[class*=" w-e-icon-"] {  /* use !important to prevent issues with browser extensions that change fonts */  font-family: \'icomoon\' !important;  speak: none;  font-style: normal;  font-weight: normal;  font-variant: normal;  text-transform: none;  line-height: 1;  /* Better Font Rendering =========== */  -webkit-font-smoothing: antialiased;  -moz-osx-font-smoothing: grayscale;}.w-e-icon-header:before {  content: "\\f1dc";}.w-e-icon-pencil2:before {  content: "\\e906";}.w-e-icon-paint-format:before {  content: "\\e90c";}.w-e-icon-image:before {  content: "\\e90d";}.w-e-icon-film:before {  content: "\\e913";}.w-e-icon-location:before {  content: "\\e947";}.w-e-icon-undo:before {  content: "\\e965";}.w-e-icon-redo:before {  content: "\\e966";}.w-e-icon-quotes-left:before {  content: "\\e977";}.w-e-icon-list-numbered:before {  content: "\\e9b9";}.w-e-icon-list2:before {  content: "\\e9bb";}.w-e-icon-link:before {  content: "\\e9cb";}.w-e-icon-happy:before {  content: "\\e9df";}.w-e-icon-bold:before {  content: "\\ea62";}.w-e-icon-underline:before {  content: "\\ea63";}.w-e-icon-italic:before {  content: "\\ea64";}.w-e-icon-strikethrough:before {  content: "\\ea65";}.w-e-icon-table2:before {  content: "\\ea71";}.w-e-icon-paragraph-left:before {  content: "\\ea77";}.w-e-icon-paragraph-center:before {  content: "\\ea78";}.w-e-icon-paragraph-right:before {  content: "\\ea79";}.w-e-icon-terminal:before {  content: "\\ea81";}.w-e-toolbar {  display: -webkit-box;  display: -ms-flexbox;  display: flex;  padding: 0 5px;}.w-e-toolbar .w-e-menu {  text-align: center;  padding: 5px 10px;  cursor: pointer;  opacity: .5;  filter: alpha(opacity=50);}.w-e-toolbar .w-e-menu:hover {  opacity: .8;  filter: alpha(opacity=80);}.w-e-toolbar .active {  color: #1e88e5;  opacity: 1;  filter: alpha(opacity=100);}.w-e-text {  padding: 0 10px;  overflow-y: scroll;}.w-e-text p {  margin: 10px 0;  line-height: 1.5;}.w-e-text:focus {  outline: none;}';
createStyle(inlinecss);

// 返回
var index = window.wangEditor || Editor;

return index;

})));
