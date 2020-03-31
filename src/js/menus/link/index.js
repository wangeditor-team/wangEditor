/*
    menu - link
*/
import $ from '../../util/dom-core.js'
import { getRandom } from '../../util/util.js'
import Panel from '../panel.js'

// 构造函数
function Link(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-link"></i></div>')
    this.type = 'panel'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Link.prototype = {
    constructor: Link,

    // 点击事件
    onClick: function (e) {
        const editor = this.editor
        let $linkelem

        if (this._active) {
            // 当前选区在链接里面
            $linkelem = editor.selection.getSelectionContainerElem()
            if (!$linkelem) {
                return
            }
            // 将该元素都包含在选取之内，以便后面整体替换
            editor.selection.createRangeByElem($linkelem)
            editor.selection.restoreSelection()
            // 显示 panel
            this._createPanel($linkelem.text(), $linkelem.attr('href'), $linkelem.attr('app-id'), $linkelem.attr('path'));
        } else {
            // 当前选区不在链接里面
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this._createPanel('', '', '', '');
            } else {
                // 选中内容了
                this._createPanel(editor.selection.getSelectionText(), '', '', '');
            }
        }
    },

    // 创建 panel
    // 创建 panel
    _createPanel: function _createPanel(text, link, appid, apppath) {
        var _this = this;

        // panel 中需要用到的id
        var inputLinkId = getRandom('input-link');
        var inputTextId = getRandom('input-text');
        var inputAppId = getRandom('input-appid');
        var inputAppPathId = getRandom('input-path');
        var btnOkId = getRandom('btn-ok');
        var btnDelId = getRandom('btn-del');

        // 是否显示“删除链接”
        var delBtnDisplay = this._active ? 'inline-block' : 'none';

        // 初始化并显示 panel
        var panel = new Panel(this, {
            width: 300,
            // panel 中可包含多个 tab
            tabs: [{
                // tab 的标题
                title: '链接',
                // 模板
                tpl: '<div>\n                            <input id="' + inputTextId + '" type="text" class="block" value="' + text + '" placeholder="\u94FE\u63A5\u6587\u5B57"/></td>\n                            <input id="' + inputLinkId + '" type="text" class="block" value="' + link + '" placeholder="http://..."/></td>\n                            <input id="' + inputAppId + '" type="text" class="block" value="' + appid + '" placeholder="\u0061\u0070\u0070\u0069\u0064"/></td>\n                            <input id="' + inputAppPathId + '" type="text" class="block" value="' + apppath + '" placeholder="\u0070\u0061\u0074\u0068"/></td>\n                            <div class="w-e-button-container">\n                                <button id="' + btnOkId + '" class="right">\u63D2\u5165</button>\n                                <button id="' + btnDelId + '" class="gray right" style="display:' + delBtnDisplay + '">\u5220\u9664\u94FE\u63A5</button>\n                            </div>\n                        </div>',                // 事件绑定
                events: [
                // 插入链接
                {
                    selector: '#' + btnOkId,
                    type: 'click',
                    fn: function fn() {
                        // 执行插入链接
                        var $link = $('#' + inputLinkId);
                        var $text = $('#' + inputTextId);
                        var $appid = $('#' + inputAppId);
                        var $apppath = $('#' + inputAppPathId);
                        var link = $link.val();
                        var text = $text.val();
                        var appid = $appid.val();
                        var apppath = $apppath.val();
                        _this._insertLink(text, link, appid, apppath);

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

        // 记录属性
        this.panel = panel;
    },

    // 删除当前链接
    _delLink: function () {
        if (!this._active) {
            return
        }
        const editor = this.editor
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if (!$selectionELem) {
            return
        }
        const selectionText = editor.selection.getSelectionText()
        editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>')
    },

    // 插入链接
    _insertLink: function _insertLink(text, link, appid, apppath) {
        var editor = this.editor;
        var config = editor.config;
        var linkCheck = config.linkCheck;
        var checkResult = true; // 默认为 true
        if (linkCheck && typeof linkCheck === 'function') {
            checkResult = linkCheck(text, link);
        }
        if (checkResult === true) {
            editor.cmd.do('insertHTML', '<a path="' + apppath + '" app-id="' + appid + '" href="' + link + '" target="_blank">' + text + '</a>');
        } else {
            alert(checkResult);
        }
    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {
        const editor = this.editor
        const $elem = this.$elem
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if (!$selectionELem) {
            return
        }
        if ($selectionELem.getNodeName() === 'A') {
            this._active = true
            $elem.addClass('w-e-active')
        } else {
            this._active = false
            $elem.removeClass('w-e-active')
        }
    }
}

export default Link