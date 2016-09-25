// Txt.fn api
_e(function (E, $) {

    var Txt = E.Txt;

    var txtChangeEventNames = 'propertychange change click keyup input paste';

    // 渲染
    Txt.fn.render = function () {
        var $txt = this.$txt;
        var $editorContainer = this.editor.$editorContainer;
        $editorContainer.append($txt);
    };

    // 计算高度
    Txt.fn.initHeight = function () {
        var editor = this.editor;
        var $txt = this.$txt;
        var valueContainerHeight = editor.$valueContainer.height();
        var menuHeight = editor.menuContainer.height();
        var txtHeight = valueContainerHeight - menuHeight;

        // 限制最小为 50px
        txtHeight = txtHeight < 50 ? 50 : txtHeight;

        $txt.height(txtHeight);

        // 记录原始高度
        editor.valueContainerHeight = valueContainerHeight;

        // 设置 max-height
        this.initMaxHeight(txtHeight, menuHeight);
    };

    // 计算最大高度
    Txt.fn.initMaxHeight = function (txtHeight, menuHeight) {
        var editor = this.editor;
        var $menuContainer = editor.menuContainer.$menuContainer;
        var $txt = this.$txt;
        var $wrap = $('<div>');

        // 需要浏览器支持 max-height，否则不管
        if (window.getComputedStyle && 'max-height'in window.getComputedStyle($txt.get(0))) {
            // 获取 max-height 并判断是否有值
            var maxHeight = parseInt(editor.$valueContainer.css('max-height'));
            if (isNaN(maxHeight)) {
                return;
            }

            // max-height 和『全屏』暂时有冲突
            if (editor.menus.fullscreen) {
                E.warn('max-height和『全屏』菜单一起使用时，会有一些问题尚未解决，请暂时不要两个同时使用');
                return;
            }

            // 标记
            editor.useMaxHeight = true;

            // 设置maxheight
            $wrap.css({
                'max-height': (maxHeight - menuHeight) + 'px',
                'overflow-y': 'auto'
            });
            $txt.css({
                'height': 'auto',
                'overflow-y': 'visible',
                'min-height': txtHeight + 'px'
            });

            // 滚动式，菜单阴影
            $wrap.on('scroll', function () {
                if ($txt.parent().scrollTop() > 10) {
                    $menuContainer.addClass('wangEditor-menu-shadow');
                } else {
                    $menuContainer.removeClass('wangEditor-menu-shadow');
                }
            });

            // 需在编辑器区域外面再包裹一层
            $txt.wrap($wrap);
        }
    };

    // 保存选区
    Txt.fn.saveSelectionEvent = function () {
        var $txt = this.$txt;
        var editor = this.editor;
        var timeoutId;
        var dt = Date.now();

        function save() {
            editor.saveSelection();
        }

        // 同步保存选区
        function saveSync() {
            // 100ms之内，不重复保存
            if (Date.now() - dt < 100) {
                return;
            }

            dt = Date.now();
            save();
        }

        // 异步保存选区
        function saveAync() {
            // 节流，防止高频率重复操作
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(save, 300);
        }

        // txt change 、focus、blur 时随时保存选区
        $txt.on(txtChangeEventNames + ' focus blur', function (e) {
            // 先同步保存选区，为了让接下来就马上要执行 editor.getRangeElem() 的程序
            // 能够获取到正确的 rangeElem
            saveSync();

            // 再异步保存选区，为了确定更加准确的选区，为后续的操作做准备
            saveAync();
        });

        // 鼠标拖拽选择时，可能会拖拽到编辑器区域外面再松手，此时 $txt 就监听不到 click事件了
        $txt.on('mousedown', function () {
            $txt.on('mouseleave.saveSelection', function (e) {
                // 先同步后异步，如上述注释
                saveSync();
                saveAync();

                // 顺道吧菜单状态也更新了
                editor.updateMenuStyle();
            });
        }).on('mouseup', function () {
            $txt.off('mouseleave.saveSelection');
        });
        
    };

    // 随时更新 value
    Txt.fn.updateValueEvent = function () {
        var $txt = this.$txt;
        var editor = this.editor;
        var timeoutId, oldValue;

        // 触发 onchange 事件
        function doOnchange() {
            var val = $txt.html();
            if (oldValue === val) {
                // 无变化
                return;
            }

            // 触发 onchange 事件
            if (editor.onchange && typeof editor.onchange === 'function') {
                editor.onchange.call(editor);
            }

            // 更新内容
            editor.updateValue();

            // 记录最新内容
            oldValue = val;
        }

        // txt change 时随时更新内容
        $txt.on(txtChangeEventNames, function (e) {
            // 初始化
            if (oldValue == null) {
                oldValue = $txt.html();
            }

            // 监控内容变化（停止操作 100ms 之后立即执行）
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(doOnchange, 100);
        });
    };

    // 随时更新 menustyle
    Txt.fn.updateMenuStyleEvent = function () {
        var $txt = this.$txt;
        var editor = this.editor;

        // txt change 时随时更新内容
        $txt.on(txtChangeEventNames, function (e) {
            editor.updateMenuStyle();
        });
    };

    // 最后插入试图插入 <p><br><p>
    Txt.fn.insertEmptyP = function () {
        var $txt = this.$txt;
        var $children = $txt.children();

        if ($children.length === 0) {
            $txt.append($('<p><br></p>'));
            return;
        }

        if ($.trim($children.last().html()).toLowerCase() !== '<br>') {
            $txt.append($('<p><br></p>'));
        }
    };

    // 将编辑器暴露出来的文字和图片，都用 p 来包裹
    Txt.fn.wrapImgAndText = function () {
        var $txt = this.$txt;
        var $imgs = $txt.children('img');
        var txt = $txt[0];
        var childNodes = txt.childNodes;
        var childrenLength = childNodes.length;
        var i, childNode, p;

        // 处理图片
        $imgs.length && $imgs.each(function () {
            $(this).wrap('<p>');
        });

        // 处理文字
        for (i = 0; i < childrenLength; i++) {
            childNode = childNodes[i];
            if (childNode.nodeType === 3 && childNode.textContent && $.trim(childNode.textContent)) {
                $(childNode).wrap('<p>');
            }
        }
    };

    // 清空内容为空的<p>，以及重复包裹的<p>（在windows下的chrome粘贴文字之后，会出现上述情况）
    Txt.fn.clearEmptyOrNestP = function () {
        var $txt = this.$txt;
        var $pList = $txt.find('p');

        $pList.each(function () {
            var $p = $(this);
            var $children = $p.children();
            var childrenLength = $children.length;
            var $firstChild;
            var content = $.trim($p.html());

            // 内容为空的p
            if (!content) {
                $p.remove();
                return;
            }

            // 嵌套的p
            if (childrenLength === 1) {
                $firstChild = $children.first();
                if ($firstChild.get(0) && $firstChild.get(0).nodeName === 'P') {
                    $p.html( $firstChild.html() );
                }
            }
        });
    };

    // 获取 scrollTop
    Txt.fn.scrollTop = function (val) {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;

        if (editor.useMaxHeight) {
            return $txt.parent().scrollTop(val);
        } else {
            return $txt.scrollTop(val);
        }
    };

    // 鼠标hover时候，显示p、head的高度
    Txt.fn.showHeightOnHover = function () {
        var editor = this.editor;
        var $editorContainer = editor.$editorContainer;
        var menuContainer = editor.menuContainer;
        var $txt = this.$txt;
        var $tip = $('<i class="height-tip"><i>');
        var isTipInTxt = false;

        function addAndShowTip($target) {
            if (!isTipInTxt) {
                $editorContainer.append($tip);
                isTipInTxt = true;
            }

            var txtTop = $txt.position().top;
            var txtHeight = $txt.outerHeight();

            var height = $target.height();
            var top = $target.position().top;
            var marginTop = parseInt($target.css('margin-top'), 10);
            var paddingTop = parseInt($target.css('padding-top'), 10);
            var marginBottom = parseInt($target.css('margin-bottom'), 10);
            var paddingBottom = parseInt($target.css('padding-bottom'), 10);

            // 计算初步的结果
            var resultHeight = height + paddingTop + marginTop + paddingBottom + marginBottom;
            var resultTop = top + menuContainer.height();
            
            // var spaceValue;

            // // 判断是否超出下边界
            // spaceValue = (resultTop + resultHeight) - (txtTop + txtHeight);
            // if (spaceValue > 0) {
            //     resultHeight = resultHeight - spaceValue;
            // }

            // // 判断是否超出了下边界
            // spaceValue = txtTop > resultTop;
            // if (spaceValue) {
            //     resultHeight = resultHeight - spaceValue;
            //     top = top + spaceValue;
            // }

            // 按照最终结果渲染
            $tip.css({
                height: height + paddingTop + marginTop + paddingBottom + marginBottom,
                top: top + menuContainer.height()
            });
        }
        function removeTip() {
            if (!isTipInTxt) {
                return;
            }
            $tip.remove();
            isTipInTxt = false;
        }

        $txt.on('mouseenter', 'ul,ol,blockquote,p,h1,h2,h3,h4,h5,table,pre', function (e) {
            addAndShowTip($(e.currentTarget));
        }).on('mouseleave', function () {
            removeTip();
        });
    };

});