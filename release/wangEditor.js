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
        selector = selector.replace('/\n/mg', '').trim();
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
        // 空数组
        return this;
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
            var elem = this[i];
            fn.call(elem, elem);
        }
        return this;
    },

    // 获取第几个元素
    get: function get(index) {
        var length = this.length;
        if (index >= length) {
            index = index % length;
        }
        return $(this[index]);
    },

    // 第一个
    first: function first() {
        return this.get(0);
    },

    // 最后一个
    last: function last() {
        var length = this.length;
        return this.get(length - 1);
    },

    // 绑定事件
    on: function on(type, fn) {
        return this.forEach(function (elem) {
            elem.addEventListener(type, fn.bind(elem));
        });
    },

    // 获取/设置 属性
    attr: function attr(key, val) {
        if (val == null) {
            // 获取值
            return this[0].getAttribute(key);
        } else {
            // 设置值
            return this.forEach(function (elem) {
                elem.setAttribute(key, val);
            });
        }
    },

    // 添加 class
    addClass: function addClass(className) {
        if (!className) {
            return this;
        }
        return this.forEach(function (elem) {
            var arr = void 0;
            if (elem.className) {
                // 解析当前 className 转换为数组
                arr = elem.className.split(/\s/);
                arr = arr.filter(function (item) {
                    return !!item.trim();
                });
                // 添加 class
                if (arr.indexOf(className) < 0) {
                    arr.push(className);
                }
                // 修改 elem.class
                elem.className = arr.join(' ');
            } else {
                elem.className = className;
            }
        });
    },

    // 删除 class
    removeClass: function removeClass(className) {
        if (!className) {
            return this;
        }
        return this.forEach(function (elem) {
            var arr = void 0;
            if (elem.className) {
                // 解析当前 className 转换为数组
                arr = elem.className.split(/\s/);
                arr = arr.filter(function (item) {
                    item = item.trim();
                    // 删除 class
                    if (!item || item === className) {
                        return false;
                    }
                    return true;
                });
                // 修改 elem.class
                elem.className = arr.join(' ');
            }
        });
    },

    // 修改 css
    css: function css(key, val) {
        var currentStyle = key + ':' + val + ';';
        return this.forEach(function (elem) {
            var style = (elem.getAttribute('style') || '').trim();
            var styleArr = void 0,
                resultArr = [];
            if (style) {
                // 将 style 按照 ; 拆分为数组
                styleArr = style.split(';');
                styleArr.forEach(function (item) {
                    // 对每项样式，按照 : 拆分为 key 和 value
                    var arr = item.split(':').map(function (i) {
                        return i.trim();
                    });
                    if (arr.length === 2) {
                        resultArr.push(arr[0] + ':' + arr[1]);
                    }
                });
                // 替换或者新增
                resultArr = resultArr.map(function (item) {
                    if (item.indexOf(key) === 0) {
                        return currentStyle;
                    } else {
                        return item;
                    }
                });
                if (resultArr.indexOf(currentStyle) < 0) {
                    resultArr.push(currentStyle);
                }
                // 结果
                elem.setAttribute('style', resultArr.join('; '));
            } else {
                // style 无值
                elem.setAttribute('style', currentStyle);
            }
        });
    },

    // 显示
    show: function show() {
        return this.css('display', 'block');
    },

    // 隐藏
    hide: function hide() {
        return this.css('display', 'none');
    },

    // 获取子节点
    children: function children() {
        var elem = this[0];
        if (!elem) {
            return null;
        }

        return $(elem.children);
    },

    // 增加子节点
    append: function append($children) {
        return this.forEach(function (elem) {
            $children.forEach(function (child) {
                elem.appendChild(child);
            });
        });
    },

    // 移除当前节点
    remove: function remove() {
        return this.forEach(function (elem) {
            if (elem.remove) {
                elem.remove();
            } else {
                var parent = elem.parentElement;
                parent.removeChild(elem);
            }
        });
    },

    // 是否包含某个子节点
    isContain: function isContain($child) {
        var elem = this[0];
        var child = $child[0];
        return elem.contains(child);
    },

    // 尺寸数据
    getSizeData: function getSizeData() {
        var elem = this[0];
        return elem.getBoundingClientRect(); // 可得到 bottom height left right top width 的数据
    },

    // 封装 nodeName
    getNodeName: function getNodeName() {
        var elem = this[0];
        return elem.nodeName;
    },

    // 从当前元素查找
    find: function find(selector) {
        var elem = this[0];
        return $(elem.querySelectorAll(selector));
    },

    // 获取当前元素的 text
    text: function text() {
        var elem = this[0];
        return elem.innerHTML.replace(/<.*?>/g, function () {
            return '';
        });
    },

    // 获取 value
    val: function val() {
        var elem = this[0];
        return elem.value.trim();
    }
};

// new 一个对象
function $(selector) {
    return new DomElement(selector);
}

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

// 遍历类数组


// 获取随机数
function getRandom(prefix) {
    return prefix + Math.random().toString().slice(2);
}

/*
    bold-menu
*/
// 构造函数
function Bold(editor) {
    this.editor = editor;
    this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-bold"><i/>\n        </div>');
    this.type = 'click';

    // 当前是否 active 状态
    this._active = false;
}

// 原型
Bold.prototype = {
    constructor: Bold,

    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里

        var editor = this.editor;
        var isSeleEmpty = editor.selection.isSelectionEmpty();

        if (isSeleEmpty) {
            // 选区是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange();
        }

        // 执行 bold 命令
        editor.cmd.do('bold');

        if (isSeleEmpty) {
            // 需要将选取折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        if (editor.cmd.queryCommandState('bold')) {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    droplist
*/
var _emptyFn = function _emptyFn() {};

// 构造函数
function DropList(menu, opt) {
    var _this = this;

    // droplist 所依附的菜单
    this.menu = menu;
    this.opt = opt;
    // 容器
    var $container = $('<div class="w-e-droplist"></div>');

    // 标题
    var $title = opt.$title;
    if ($title) {
        $title.addClass('w-e-dp-title');
        $container.append($title);
    }

    var list = opt.list || [];
    var onClick = opt.onClick || _emptyFn;

    // 加入 DOM 并绑定事件
    var $list = $('<ul></ul>');
    $container.append($list);
    list.forEach(function (item) {
        var $elem = item.$elem;
        var value = item.value;
        if ($elem) {
            $list.append($elem);
            $elem.on('click', function (e) {
                onClick(value);

                // 隐藏
                _this.hideTimeoutId = setTimeout(function () {
                    _this.hide();
                }, 200);
            });
        }
    });

    // 绑定隐藏事件
    $container.on('mouseleave', function (e) {
        _this.hideTimeoutId = setTimeout(function () {
            _this.hide();
        }, 200);
    });

    // 记录属性
    this.$container = $container;

    // 基本属性
    this._rendered = false;
    this._show = false;
}

// 原型
DropList.prototype = {
    constructor: DropList,

    // 显示（插入DOM）
    show: function show() {
        if (this.hideTimeoutId) {
            // 清除之前的定时隐藏
            clearTimeout(this.hideTimeoutId);
        }

        var menu = this.menu;
        var $menuELem = menu.$elem;
        var $container = this.$container;
        if (this._show) {
            return;
        }
        if (this._rendered) {
            // 显示
            $container.show();
        } else {
            // 加入 DOM 之前先定位位置
            var menuHeight = $menuELem.getSizeData().height || 0;
            var width = this.opt.width || 100; // 默认为 100
            $container.css('margin-top', menuHeight + 'px').css('width', width + 'px');

            // 加入到 DOM
            $menuELem.append($container);
            this._rendered = true;
        }

        // 修改属性
        this._show = true;
    },

    // 隐藏（移除DOM）
    hide: function hide() {
        if (this.showTimeoutId) {
            // 清除之前的定时显示
            clearTimeout(this.showTimeoutId);
        }

        var $container = this.$container;
        if (!this._show) {
            return;
        }
        // 隐藏并需改属性
        $container.hide();
        this._show = false;
    }
};

/*
    menu - header
*/
// 构造函数
function Head(editor) {
    var _this = this;

    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-header"><i/></div>');
    this.type = 'droplist';

    // 当前是否 active 状态
    this._active = false;

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>设置标题</p>'),
        list: [{ $elem: $('<li><h1>H1</h1></li>'), value: 'h1' }, { $elem: $('<li><h2>H2</h2></li>'), value: 'h2' }, { $elem: $('<li><h3>H3</h3></li>'), value: 'h3' }, { $elem: $('<li><h4>H4</h4></li>'), value: 'h4' }, { $elem: $('<li><h5>H5</h5></li>'), value: 'h5' }, { $elem: $('<li><p>正文</p></li>'), value: 'p' }],
        onClick: function onClick(value) {
            // 注意 this 是指向当前的 Head 对象
            _this._command(value);
        }
    });
}

// 原型
Head.prototype = {
    constructor: Head,

    // 执行命令
    _command: function _command(value) {
        var editor = this.editor;
        editor.cmd.do('formatBlock', value);
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        var reg = /^h/i;
        var cmdValue = editor.cmd.queryCommandValue('formatBlock');
        if (reg.test(cmdValue)) {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
};

/*
    panel
*/

var emptyFn = function emptyFn() {};

// 构造函数
function Panel(menu, opt) {
    this.menu = menu;
    this.opt = opt;

    // 状态
    this._show = false;
}

// 原型
Panel.prototype = {
    constructor: Panel,

    // 显示（插入DOM）
    show: function show() {
        var _this = this;

        if (this._show) {
            return;
        }

        var menu = this.menu;
        var editor = menu.editor;
        var $textContainerElem = editor.$textContainerElem;
        var opt = this.opt;

        // panel 的容器
        var $container = $('<div class="w-e-panel-container"></div>');
        var width = opt.width || 300; // 默认 300px
        var height = opt.height || 150; // 默认 100px
        $container.css('width', width + 'px').css('height', height + 'px').css('margin-left', (0 - width) / 2 + 'px');

        // 准备 tabs 容器
        var $tabTitleContainer = $('<ul class="w-e-panel-tab-title"></ul>');
        var $tabContentContainer = $('<div class="w-e-panel-tab-content"></div>');
        $container.append($tabTitleContainer).append($tabContentContainer);

        // tabs
        var tabs = opt.tabs || [];
        var tabTitleArr = [];
        var tabContentArr = [];
        tabs.forEach(function (tab, tabIndex) {
            var title = tab.title || '';
            var tpl = tab.tpl || '';

            // 添加到 DOM
            var $title = $('<li class="w-e-item">' + title + '</li>');
            $tabTitleContainer.append($title);
            var $content = $(tpl);
            $tabContentContainer.append($content);

            // 记录到内存
            $title._index = tabIndex;
            tabTitleArr.push($title);
            tabContentArr.push($content);

            // 设置 active 项
            if (tabIndex === 0) {
                $title._active = true;
                $title.addClass('w-e-active');
            } else {
                $content.hide();
            }

            // 绑定 tab 的事件
            $title.on('click', function (e) {
                if ($title._active) {
                    return;
                }
                // 隐藏所有的 tab
                tabTitleArr.forEach(function ($title) {
                    $title._active = false;
                    $title.removeClass('w-e-active');
                });
                tabContentArr.forEach(function ($content) {
                    $content.hide();
                });

                // 显示当前的 tab
                $title._active = true;
                $title.addClass('w-e-active');
                $content.show();
            });
        });

        // 绑定关闭事件
        $container.on('click', function (e) {
            // 点击时阻止冒泡
            e.stopPropagation();
        });
        $textContainerElem.on('click', function (e) {
            _this.hide();
        });

        // 添加到 DOM
        $textContainerElem.append($container);

        // 绑定 opt 的事件，只有添加到 DOM 之后才能绑定成功
        tabs.forEach(function (tab) {
            var events = tab.evnts || [];
            events.forEach(function (event) {
                var selector = event.selector;
                var type = event.type;
                var fn = event.fn || emptyFn;
                $container.find(selector).on(type, function (e) {
                    e.stopPropagation();
                    var needToHide = fn();
                    // 执行完事件之后，是否要关闭 panel
                    if (needToHide) {
                        _this.hide();
                    }
                });
            });
        });

        // 添加到属性
        this.$container = $container;
        this._show = true;
    },

    // 隐藏（移除DOM）
    hide: function hide() {
        if (!this._show) {
            return;
        }
        var $container = this.$container;
        $container.remove();
        this._show = false;
    }
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
    this._active = false;
}

// 原型
Link.prototype = {
    constructor: Link,

    // 点击事件
    onClick: function onClick(e) {
        var editor = this.editor;
        var $linkelem = void 0;

        if (this._active) {
            // 当前选区在链接里面
            $linkelem = editor.selection.getSelectionContainerElem();
            // 将该元素都包含在选取之内，以便后面整体替换
            editor.selection.createRangeByElem($linkelem);
            editor.selection.restoreSelection();
            // 显示 panel
            this._createPanel($linkelem.text(), $linkelem.attr('href'));
        } else {
            // 当前选区不在链接里面
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this._createPanel('', '');
            } else {
                // 选中内容了
                this._createPanel(editor.selection.getSelectionText(), '');
            }
        }
    },

    // 创建 panel
    _createPanel: function _createPanel(text, link) {
        var _this = this;

        // panel 中需要用到的id
        var inputLinkId = getRandom('input-link');
        var inputTextId = getRandom('input-text');
        var btnOkId = getRandom('btn-ok');
        var btnDelId = getRandom('btn-del');

        // 初始化并显示 panel
        var panel = new Panel(this, {
            width: 300,
            height: 150,
            // panel 中可包含多个 tab
            tabs: [{
                // tab 的标题
                title: '链接',
                // 模板
                tpl: '<div>\n                            <table>\n                                <tr>\n                                    <td>\u6587\u5B57</td>\n                                    <td><input id="' + inputTextId + '" type="text" value="' + text + '"/></td>\n                                </tr>\n                                <tr>\n                                    <td>\u94FE\u63A5</td>\n                                    <td><input id="' + inputLinkId + '" type="text" value="' + link + '" placeholder="http://..."/></td>\n                                </tr>\n                            </table>\n                            <div class="w-e-button-container w-e-clear-fix">\n                                <button id="' + btnOkId + '" class="default left">\u63D2\u5165</button>\n                                <button id="' + btnDelId + '" class="red right">\u5220\u9664\u94FE\u63A5</button>\n                            </div>\n                        </div>',
                // 事件绑定
                evnts: [
                // 插入链接
                {
                    selector: '#' + btnOkId,
                    type: 'click',
                    fn: function fn() {
                        // 执行插入链接
                        var $link = $('#' + inputLinkId);
                        var $text = $('#' + inputTextId);
                        var link = $link.val();
                        var text = $text.val();
                        _this._insertLink(text, link);

                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        return true;
                    }
                },
                // 删除链接
                {
                    selector: '#' + btnDelId,
                    type: 'click',
                    fn: function fn() {
                        // 执行删除链接
                        _this._delLink();
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        return true;
                    }
                }]
            } // tab end
            ] // tabs end
        });

        // 显示 panel
        panel.show();
    },

    // 删除当前链接
    _delLink: function _delLink() {
        if (!this._active) {
            return;
        }
        var editor = this.editor;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        var selectionText = editor.selection.getSelectionText();
        editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>');
    },

    // 插入链接
    _insertLink: function _insertLink(text, link) {
        if (!text || !link) {
            return;
        }
        var editor = this.editor;
        editor.cmd.do('insertHTML', '<a href="' + link + '" target="_blank">' + text + '</a>');
    },

    // 试图改变 active 状态
    tryChangeActive: function tryChangeActive(e) {
        var editor = this.editor;
        var $elem = this.$elem;
        var $selectionELem = editor.selection.getSelectionContainerElem();
        if ($selectionELem.getNodeName() === 'A') {
            this._active = true;
            $elem.addClass('w-e-active');
        } else {
            this._active = false;
            $elem.removeClass('w-e-active');
        }
    }
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
                    droplist.showTimeoutId = setTimeout(function () {
                        droplist.show();
                    }, 200);
                }).on('mouseleave', function (e) {
                    // 隐藏
                    droplist.hideTimeoutId = setTimeout(function () {
                        droplist.hide();
                    }, 200);
                });
            }

            // 弹框类型，例如 link
            if (type === 'panel' && menu.onClick) {
                $elem.on('click', function (e) {
                    // 在自定义事件中显示 panel
                    menu.onClick(e);
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
    _bindEvent: function _bindEvent() {
        var editor = this.editor;
        var $textElem = editor.$textElem;

        // 点击或者按键时触发
        function onClickAndKeyup(e) {

            // 记录内容用于撤销

            // 触发 onchange 函数

            // 随时保存选区
            editor.selection.saveRange();

            // 更新按钮 ative 状态
            editor.menus.changeActive();
        }
        $textElem.on('keyup', onClickAndKeyup);
        $textElem.on('click', onClickAndKeyup);
    }
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
    constructor: Command,

    // 执行命令
    do: function _do(name, value) {
        var editor = this.editor;

        // 如果无选区，忽略
        if (!editor.selection.getRange()) {
            return;
        }

        // 恢复选取
        editor.selection.restoreSelection();

        // 执行
        var _name = '_' + name;
        if (this[_name]) {
            // 有自定义事件
            this[_name](value);
        } else {
            // 默认 command
            this.execCommand(name, value);
        }

        // 修改菜单状态
        editor.menus.changeActive();

        // 最后，恢复选取保证光标在原来的位置闪烁
        editor.selection.saveRange();
        editor.selection.restoreSelection();
    },

    // 自定义 insertHTML 事件
    _insertHTML: function _insertHTML(html) {
        var editor = this.editor;
        var range = editor.selection.getRange();

        if (range.pasteHTML) {
            // IE
            range.pasteHTML(html);
        } else {
            // 非 IE
            this.execCommand('insertHTML', html);
        }
    },

    // 封装 execCommand
    execCommand: function execCommand(name, value) {
        document.execCommand(name, false, value);
    },

    // 封装 document.queryCommandValue
    queryCommandValue: function queryCommandValue(name) {
        return document.queryCommandValue(name);
    },

    // 封装 document.queryCommandState
    queryCommandState: function queryCommandState(name) {
        return document.queryCommandState(name);
    },

    // 封装 document.queryCommandSupported
    queryCommandSupported: function queryCommandSupported(name) {
        return document.queryCommandSupported(name);
    }
};

/*
    selection range API
*/

// 构造函数
function API(editor) {
    this.editor = editor;
    this._currentRange = null;
}

// 修改原型
API.prototype = {
    constructor: API,

    // 获取 range 对象
    getRange: function getRange() {
        return this._currentRange;
    },

    // 保存选取
    saveRange: function saveRange(_range) {
        if (_range) {
            // 保存已有选取
            this._currentRange = _range;
            return;
        }

        // 获取当前的选取
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);

        // 判断选取内容是否在编辑内容之内
        var $containerElem = this.getSelectionContainerElem(range);
        var editor = this.editor;
        var $textElem = editor.$textElem;
        if ($textElem.isContain($containerElem)) {
            // 是编辑内容之内的
            this._currentRange = range;
        }
    },

    // 折叠选取
    collapseRange: function collapseRange(toStart) {
        if (toStart == null) {
            // 默认为 false
            toStart = false;
        }
        var range = this._currentRange;
        if (range) {
            range.collapse(toStart);
        }
    },

    // 选中区域的文字
    getSelectionText: function getSelectionText() {
        var range = this._currentRange;
        if (range) {
            return this._currentRange.toString();
        } else {
            return '';
        }
    },

    // 选区的 $Elem
    getSelectionContainerElem: function getSelectionContainerElem(range) {
        range = range || this._currentRange;
        var elem = range.commonAncestorContainer;
        return $(elem.nodeType === 1 ? elem : elem.parentNode);
    },
    getSelectionStartElem: function getSelectionStartElem(range) {
        range = range || this._currentRange;
        var elem = range.startContainer;
        return $(elem.nodeType === 1 ? elem : elem.parentNode);
    },
    getSelectionEndElem: function getSelectionEndElem(range) {
        range = range || this._currentRange;
        var elem = range.endContainer;
        return $(elem.nodeType === 1 ? elem : elem.parentNode);
    },

    // 选取是否为空
    isSelectionEmpty: function isSelectionEmpty() {
        var range = this._currentRange;
        if (range && range.startContainer) {
            if (range.startContainer === range.endContainer) {
                if (range.startOffset === range.endOffset) {
                    return true;
                }
            }
        }
        return false;
    },

    // 恢复选区
    restoreSelection: function restoreSelection() {
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this._currentRange);
    },

    // 创建一个空白（即 &#8203 字符）选区
    createEmptyRange: function createEmptyRange() {
        var editor = this.editor;
        var range = this.getRange();
        if (!range) {
            // 当前无 range
            return;
        }
        if (!this.isSelectionEmpty()) {
            // 当前选取必须没有内容才可以
            return;
        }

        // 插入 &#8203
        editor.cmd.do('insertHTML', '&#8203');
        // 修改 offset 位置
        range.setEnd(range.endContainer, range.endOffset + 1);
        // 存储
        this.saveRange(range);
    },

    // 根据 $Elem 设置选取
    createRangeByElem: function createRangeByElem($elem, toStart) {
        // $elem - 经过封装的 elem
        // toStart - true 开始位置，false 结束位置
        if (!$elem.length) {
            return;
        }

        var elem = $elem[0];
        var range = document.createRange();
        range.selectNode(elem);

        if (typeof toStart === 'boolean') {
            range.collapse(toStart);
        }

        // 存储 range
        this.saveRange(range);
    }
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
        var $toolbarSelector = $(toolbarSelector);
        var textSelector = this.textSelector;

        // 定义变量
        var $toolbarElem = void 0,
            $textContainerElem = void 0,
            $textElem = void 0,
            $children = void 0;

        if (textSelector == null) {
            // 只传入一个参数，即是容器的选择器或元素，toolbar 和 text 的元素自行创建
            $toolbarElem = $('<div></div>');
            $textContainerElem = $('<div></div>');

            // 将编辑器区域原有的内容，暂存起来
            $children = $toolbarSelector.children();

            // 添加到 DOM 结构中
            $toolbarSelector.append($toolbarElem).append($textContainerElem);

            // 自行创建的，需要配置默认的样式
            $toolbarElem.css('background-color', '#f1f1f1').css('border', '1px solid #ccc');
            $textContainerElem.css('border', '1px solid #ccc').css('border-top', 'none').css('height', '300px');
        } else {
            // toolbar 和 text 的选择器都有值，记录属性
            $toolbarElem = $toolbarSelector;
            $textContainerElem = $(textSelector);
            // 将编辑器区域原有的内容，暂存起来
            $children = $textContainerElem.children();
        }

        // 编辑区域
        $textElem = $('<div></div>');
        $textElem.attr('contenteditable', 'true').css('width', '100%').css('height', '100%');

        // 初始化编辑区域内容
        if ($children && $children.length) {
            $textElem.append($children);
        } else {
            $textElem.append($('<p><br></p>'));
        }

        // 编辑区域加入DOM
        $textContainerElem.append($textElem);

        // 设置通用的 class
        $toolbarElem.addClass('w-e-toolbar');
        $textContainerElem.addClass('w-e-text-container');
        $textElem.addClass('w-e-text');

        // 记录属性
        this.$toolbarElem = $toolbarElem;
        this.$textContainerElem = $textContainerElem;
        this.$textElem = $textElem;
    },

    // 初始化配置
    _initConfig: function _initConfig() {
        // _config 是默认配置，this.customConfig 是用户自定义配置，将它们 merge 之后再赋值
        var target = {};
        this.config = Object.assign(target, config, this.customConfig);
    },

    // 封装 command
    _initCommand: function _initCommand() {
        this.cmd = new Command(this);
    },

    // 封装 selection range API
    _initSelectionAPI: function _initSelectionAPI() {
        this.selection = new API(this);
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

    // 创建编辑器
    create: function create() {
        // 初始化 DOM
        this._initDom();

        // 初始化配置信息
        this._initConfig();

        // 封装 command API
        this._initCommand();

        // 封装 selection range API
        this._initSelectionAPI();

        // 初始化菜单
        this._initMenus();

        // 添加 text
        this._initText();
    }
};

// 检验是否浏览器环境
try {
    document;
} catch (ex) {
    throw new Error('请在浏览器环境下运行');
}

// polyfill
polyfill();

// 将 css 代码添加到 <style> 中
document.addEventListener('DOMContentLoaded', function (e) {
    // 这里的 `inlinecss` 将被替换成 css 代码的内容，详情可去 ./gulpfile.js 中搜索 `inlinecss` 关键字
    var inlinecss = '.w-e-toolbar,.w-e-text-container,.w-e-menu-panel {  padding: 0;  margin: 0;  box-sizing: border-box;}.w-e-toolbar *,.w-e-text-container *,.w-e-menu-panel * {  padding: 0;  margin: 0;  box-sizing: border-box;}.w-e-clear-fix:after {  content: "";  display: table;  clear: both;}.w-e-toolbar .w-e-droplist {  position: absolute;  left: 0;  top: 0;  background-color: #fff;  border: 1px solid #f1f1f1;  border-right-color: #ccc;  border-bottom-color: #ccc;}.w-e-toolbar .w-e-droplist .w-e-dp-title {  text-align: center;  color: #999;  line-height: 1.5;  border-bottom: 1px solid #f1f1f1;}.w-e-toolbar .w-e-droplist ul {  list-style: none;  line-height: 1;}.w-e-toolbar .w-e-droplist li {  padding: 3px 0;}.w-e-toolbar .w-e-droplist li:hover {  background-color: #f1f1f1;}@font-face {  font-family: \'icomoon\';  src: url(data:application/x-font-woff;charset=utf-8;base64,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) format(\'truetype\');  font-weight: normal;  font-style: normal;}[class^="w-e-icon-"],[class*=" w-e-icon-"] {  /* use !important to prevent issues with browser extensions that change fonts */  font-family: \'icomoon\' !important;  speak: none;  font-style: normal;  font-weight: normal;  font-variant: normal;  text-transform: none;  line-height: 1;  /* Better Font Rendering =========== */  -webkit-font-smoothing: antialiased;  -moz-osx-font-smoothing: grayscale;}.w-e-icon-header:before {  content: "\\f1dc";}.w-e-icon-pencil2:before {  content: "\\e906";}.w-e-icon-paint-format:before {  content: "\\e90c";}.w-e-icon-image:before {  content: "\\e90d";}.w-e-icon-film:before {  content: "\\e913";}.w-e-icon-location:before {  content: "\\e947";}.w-e-icon-undo:before {  content: "\\e965";}.w-e-icon-redo:before {  content: "\\e966";}.w-e-icon-quotes-left:before {  content: "\\e977";}.w-e-icon-list-numbered:before {  content: "\\e9b9";}.w-e-icon-list2:before {  content: "\\e9bb";}.w-e-icon-link:before {  content: "\\e9cb";}.w-e-icon-happy:before {  content: "\\e9df";}.w-e-icon-bold:before {  content: "\\ea62";}.w-e-icon-underline:before {  content: "\\ea63";}.w-e-icon-italic:before {  content: "\\ea64";}.w-e-icon-strikethrough:before {  content: "\\ea65";}.w-e-icon-table2:before {  content: "\\ea71";}.w-e-icon-paragraph-left:before {  content: "\\ea77";}.w-e-icon-paragraph-center:before {  content: "\\ea78";}.w-e-icon-paragraph-right:before {  content: "\\ea79";}.w-e-icon-terminal:before {  content: "\\ea81";}.w-e-toolbar {  display: -webkit-box;  display: -ms-flexbox;  display: flex;  padding: 0 5px;  /* 单个菜单 */}.w-e-toolbar .w-e-menu {  position: relative;  z-index: 10001;  text-align: center;  padding: 5px 10px;  cursor: pointer;}.w-e-toolbar .w-e-menu i {  color: #999;}.w-e-toolbar .w-e-menu:hover i {  color: #333;}.w-e-toolbar .w-e-active i {  color: #1e88e5;}.w-e-toolbar .w-e-active:hover i {  color: #1e88e5;}.w-e-text-container .w-e-panel-container {  font-size: 100px;  position: absolute;  top: 0;  left: 50%;  border: 1px solid #ccc;  border-top: 0;  box-shadow: 1px 1px 2px #ccc;  background-color: #fff;  color: #333;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title {  list-style: none;  display: -webkit-box;  display: -ms-flexbox;  display: flex;  font-size: 0.16em;  background-color: #f1f1f1;  border-bottom: 1px solid #ccc;  padding: 2px 10px 0 10px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title .w-e-item {  padding: 3px 5px;  color: #999;  cursor: pointer;  margin: 0 3px;  position: relative;  top: 1px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title .w-e-active {  color: #333;  border-bottom: 1px solid #333;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content {  padding: 10px 15px 0 15px;  font-size: 0.16em;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content table {  width: 100%;  border: 0;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content table td input[type=text] {  width: 100%;  border: 0;  border-bottom: 1px solid #ccc;  font-size: 15px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content table td input[type=text]:focus {  border-bottom-color: #1e88e5;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container {  margin-top: 10px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button {  color: #999;  border: 1px solid #ccc;  font-size: 14px;  background-color: #fff;  padding: 2px 5px;  cursor: pointer;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.default {  color: #1e88e5;  border-color: #1e88e5;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.red {  color: red;  border-color: red;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.left {  float: left;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.right {  float: right;}.w-e-text-container .w-e-panel-container input:focus {  outline: none;}.w-e-text-container {  position: relative;  z-index: 10000;}.w-e-text {  padding: 0 10px;  overflow-y: scroll;}.w-e-text p,.w-e-text h1,.w-e-text h2,.w-e-text h3,.w-e-text h4,.w-e-text h5 {  margin: 10px 0;  line-height: 1.5;}.w-e-text:focus {  outline: none;}';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = inlinecss;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);
});

// 返回
var index = window.wangEditor || Editor;

return index;

})));
