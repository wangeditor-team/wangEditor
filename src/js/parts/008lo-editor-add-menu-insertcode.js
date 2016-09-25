// insertcode 菜单
_e(function (E, $) {

    // 加载 highlightjs 代码
    function loadHljs() {
        if (E.userAgent.indexOf('MSIE 8') > 0) {
            // 不支持 IE8
            return;
        }
        if (window.hljs) {
            // 不要重复加载
            return;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//cdn.bootcss.com/highlight.js/9.2.0/highlight.min.js";
        document.body.appendChild(script);
    }
    

    E.createMenu(function (check) {
        var menuId = 'insertcode';
        if (!check(menuId)) {
            return;
        }

        // 加载 highlightjs 代码
        setTimeout(loadHljs, 0);

        var editor = this;
        var config = editor.config;
        var lang = config.lang;
        var $txt = editor.txt.$txt;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.insertcode
        });

        // click 事件
        menu.clickEvent = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;

            // 隐藏
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // 显示
            $textarea.val('');
            dropPanel.show();

            // highlightjs 语言列表
            var hljs = window.hljs;
            if (hljs && hljs.listLanguages) {
                if ($langSelect.children().length !== 0) {
                    return;
                }
                $langSelect.css({
                    'margin-top': '9px',
                    'margin-left': '5px'
                });
                $.each(hljs.listLanguages(), function (key, lang) {
                    if (lang === 'xml') {
                        lang = 'html';
                    }
                    if (lang === config.codeDefaultLang) {
                        $langSelect.append('<option value="' + lang + '" selected="selected">' + lang + '</option>');
                    } else {
                        $langSelect.append('<option value="' + lang + '">' + lang + '</option>');
                    }
                });
            } else {
                $langSelect.hide();
            }
        };

        // 选中状态下的 click 事件
        menu.clickEventSelected = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;

            // 隐藏
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // 显示
            dropPanel.show();

            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getSelfOrParentByName(rangeElem, 'pre');
            var $targetElem;
            var className;
            if (targetElem) {
                // 确定找到 pre 之后，再找 code
                targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
            }
            if (!targetElem) {
                return;
            }
            $targetElem = $(targetElem);

            // 赋值内容
            $textarea.val($targetElem.text());
            if ($langSelect) {
                // 赋值语言
                className = $targetElem.attr('class');
                if (className) {
                    $langSelect.val(className.split(' ')[0]);
                }
            }
        };

        // 定义更新选中状态的事件
        menu.updateSelectedEvent = function () {
            var self = this; //菜单对象
            var editor = self.editor;
            var rangeElem;

            rangeElem = editor.getRangeElem();
            rangeElem = editor.getSelfOrParentByName(rangeElem, 'pre');

            if (rangeElem) {
                return true;
            }

            return false;
        };

        // 创建 panel
        var $content = $('<div></div>');
        var $textarea = $('<textarea></textarea>');
        var $langSelect = $('<select></select>');
        contentHandle($content);
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 500
        });

        // 增加到editor对象中
        editor.menus[menuId] = menu;

        // ------ 增加 content 内容 ------
        function contentHandle($content) {
            // textarea 区域
            var $textareaContainer = $('<div></div>');
            $textareaContainer.css({
                margin: '15px 5px 5px 5px',
                height: '160px',
                'text-align': 'center'
            });
            $textarea.css({
                width: '100%',
                height: '100%',
                padding: '10px'
            });
            $textarea.on('keydown', function (e) {
                // 取消 tab 键默认行为
                if (e.keyCode === 9) {
                    e.preventDefault();
                }
            });
            $textareaContainer.append($textarea);
            $content.append($textareaContainer);

            // 按钮区域
            var $btnContainer = $('<div></div>');
            var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
            var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

            $btnContainer.append($btnSubmit).append($btnCancel).append($langSelect);
            $content.append($btnContainer);

            // 取消按钮
            $btnCancel.click(function (e) {
                e.preventDefault();
                menu.dropPanel.hide();
            });

            // 确定按钮
            var codeTpl = '<pre style="max-width:100%;overflow-x:auto;"><code{#langClass}>{#content}</code></pre>';
            $btnSubmit.click(function (e) {
                e.preventDefault();
                var val = $textarea.val();
                if (!val) {
                    // 无内容
                    $textarea.focus();
                    return;
                }

                var rangeElem = editor.getRangeElem();
                if ($.trim($(rangeElem).text()) && codeTpl.indexOf('<p><br></p>') !== 0) {
                    codeTpl = '<p><br></p>' + codeTpl;
                }

                var lang = $langSelect ? $langSelect.val() : ''; // 获取高亮语言
                var langClass = '';
                var doHightlight = function () {
                    $txt.find('pre code').each(function (i, block) {
                        var $block = $(block);
                        if ($block.attr('codemark')) {
                            // 有 codemark 标记的代码块，就不再重新格式化了
                            return;
                        } else if (window.hljs) {
                            // 新代码块，格式化之后，立即标记 codemark
                            window.hljs.highlightBlock(block);
                            $block.attr('codemark', '1');
                        }
                    });
                };

                // 语言高亮样式
                if (lang) {
                    langClass = ' class="' + lang + ' hljs"';
                }

                // 替换标签
                val = val.replace(/&/gm, '&amp;')
                         .replace(/</gm, '&lt;')
                         .replace(/>/gm, '&gt;');

                // ---- menu 未选中状态 ----
                if (!menu.selected) {
                    // 拼接html
                    var html = codeTpl.replace('{#langClass}', langClass).replace('{#content}', val);
                    editor.command(e, 'insertHtml', html, doHightlight);
                    return;
                }

                // ---- menu 选中状态 ----
                var targetElem = editor.getSelfOrParentByName(rangeElem, 'pre');
                var $targetElem;
                if (targetElem) {
                    // 确定找到 pre 之后，再找 code
                    targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
                }
                if (!targetElem) {
                    return;
                }
                $targetElem = $(targetElem);

                function commandFn() {
                    var className;
                    if (lang) {
                        className = $targetElem.attr('class');
                        if (className !== lang + ' hljs') {
                            $targetElem.attr('class', lang + ' hljs');
                        }
                    }
                    $targetElem.html(val);
                }
                function callback() {
                    editor.restoreSelectionByElem(targetElem);
                    doHightlight();
                }
                editor.customCommand(e, commandFn, callback);
            });
        }

        // ------ enter 时，不另起标签，只换行 ------
        $txt.on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
            if (!targetElem) {
                return;
            }

            editor.command(e, 'insertHtml', '\n');
        });

        // ------ 点击时，禁用其他标签 ------
        function updateMenu() {
            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
            if (targetElem) {
                // 在 code 之内，禁用其他菜单
                editor.disableMenusExcept('insertcode');
            } else {
                // 不是在 code 之内，启用其他菜单
                editor.enableMenusExcept('insertcode');
            }
        }
        $txt.on('keydown click', function (e) {
            // 此处必须使用 setTimeout 异步处理，否则不对
            setTimeout(updateMenu);
        });
    });

});