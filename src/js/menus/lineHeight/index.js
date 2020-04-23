/*
    menu - fontSize
*/

import $ from '../../util/dom-core.js'
import {isContentditor,getNodeToArray,isDOMList} from '../../util/util.js'
import DropList from '../droplist.js'


//行高
function LineHeight(editor) {
    var _this = this;

    this.editor = editor;
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-text-heigh"></i></div>');
    this.type = 'droplist';

    this._active = false;

    this.droplist = new DropList(this, {
        width: 160,
        $title: $('<p>行高</p>'),
        type: 'list',
        list: [{
            $elem: $('<span style="line-height: 1 ;">1倍</span>'),
            value: '1'
        }, {
            $elem: $('<span style="line-height: 1.5 ;">1.5倍</span>'),
            value: '1.5'
        }, {
            $elem: $('<span style="line-height: 1.8 ;">1.8倍</span>'),
            value: '1.8'
        }, {
            $elem: $('<span style="line-height: 2;">2倍</span>'),
            value: '2'
        }, {
            $elem: $('<span style="line-height: 2.5 ;">2.5倍</span>'),
            value: '2.5'
        }, {$elem: $('<span style="line-height: 3;">3倍</span>'),
            value: '3'
        }],
        onClick: function onClick(value) {
            _this._command(value);
        }
    });
}

LineHeight.prototype = {
    constructor: LineHeight,

    _command: function _command(value) {
        var editor = this.editor;
        // 使用 styleWithCSS
        if (!editor._useStyleWithCSS) {
            document.execCommand('styleWithCSS', null, true);
            editor._useStyleWithCSS = true;
        }

        // 如果无选区，忽略
        if (!editor.selection.getRange()) {
            return;
        }

        // 恢复选取
        editor.selection.restoreSelection();

        //1. 处理选区节点样式
        var $parent = editor.selection.getSelectionContainerElem()[0];
        console.log($parent);
        //1.1 如果选区只有一行
        if (isDOMList($parent) === false && $parent.nodeType === 1 && isContentditor($parent) == false) {
            while ($parent.nodeName != 'P') {
                //提升节点至外层p段落
                $parent = $parent.parentNode;
            }
            $parent.style.lineHeight = value;
            //1.1.1 一行的选区也可能有嵌套元素
            var nodeArray = new Array();
            getNodeToArray($parent, nodeArray);
            nodeArray.shift();
            for (var node of nodeArray) {
                node.style.lineHeight = value;
            }
        } else {
            //1.2 如果选区有多行
            var $start = editor.selection.getSelectionStartElem()[0];
            var $end = editor.selection.getSelectionEndElem()[0];

            var startNodeIndex;
            var endNodeIndex;

            //获取编辑区域下的所有节点
            var nodeArray = new Array();
            getNodeToArray($parent, nodeArray);
            nodeArray.shift();

            //1.3 处理选区内的节点及其子节点
            var $pNodes = nodeArray;
            console.log($pNodes);
            for (var i = 0; i < $pNodes.length; i++) {
                if ($pNodes[i] == $start) {
                    startNodeIndex = i;
                    break;
                }
            }
            for (var i = 0; i < $pNodes.length; i++) {
                if ($pNodes[i] == $end) {
                    endNodeIndex = i;
                    break;
                }
            }
            var rangeNodes = new Array();
            for (var i = startNodeIndex; i <= endNodeIndex; i++) {
                rangeNodes.push($pNodes[i]);
            }

            for (var node of rangeNodes) {
                node.style.lineHeight = value;
            }
        }

        // 修改菜单状态
        editor.menus.changeActive();

        // 最后，恢复选取保证光标在原来的位置闪烁
        editor.selection.saveRange();
        editor.selection.restoreSelection();

        // 触发 onchange
        editor.change && editor.change();
    }
};



export default LineHeight