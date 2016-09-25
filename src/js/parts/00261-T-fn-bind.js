// Txt.fn bind fn
_e(function (E, $) {

    var Txt = E.Txt;

    // 初始化
    Txt.fn.init = function () {
        var self = this;
        var editor = self.editor;
        var $valueContainer = editor.$valueContainer;
        var currentValue = editor.getInitValue();
        var $txt;

        if ($valueContainer.get(0).nodeName === 'DIV') {
            // 如果传入生成编辑器的元素就是div，则直接使用
            $txt = $valueContainer;
            $txt.addClass("wangEditor-txt");
            $txt.attr('contentEditable', 'true');
        } else {
            // 如果不是div（是textarea），则创建一个div
            $txt = $(
                '<div class="wangEditor-txt" contentEditable="true">' +
                    currentValue +
                '</div>'
            );
        }

        // 试图最后插入一个空行，ready之后才行
        editor.ready(function () {
            self.insertEmptyP();
        });

        self.$txt = $txt;

        // 删除时，如果没有内容了，就添加一个 <p><br></p>
        self.contentEmptyHandle();

        // enter时，不能使用 div 换行
        self.bindEnterForDiv();

        // enter时，用 p 包裹 text
        self.bindEnterForText();

        // tab 插入4个空格
        self.bindTabEvent();

        // 处理粘贴内容
        self.bindPasteFilter();

        // $txt.formatText() 方法
        self.bindFormatText();

        // 定义 $txt.html() 方法
        self.bindHtml();
    };

    // 删除时，如果没有内容了，就添加一个 <p><br></p>
    Txt.fn.contentEmptyHandle = function () {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;
        var $p;

        $txt.on('keydown', function (e) {
            if (e.keyCode !== 8) {
                return;
            }
            var txtHtml = $.trim($txt.html().toLowerCase());
            if (txtHtml === '<p><br></p>') {
                // 如果最后还剩余一个空行，就不再继续删除了
                e.preventDefault();
                return;
            }
        });

        $txt.on('keyup', function (e) {
            if (e.keyCode !== 8) {
                return;
            }
            var txtHtml = $.trim($txt.html().toLowerCase());
            // ff时用 txtHtml === '<br>' 判断，其他用 !txtHtml 判断
            if (!txtHtml || txtHtml === '<br>') {
                // 内容空了
                $p = $('<p><br/></p>');
                $txt.html(''); // 一定要先清空，否则在 ff 下有问题
                $txt.append($p);
                editor.restoreSelectionByElem($p.get(0));
            }
        });
    };

    // enter时，不能使用 div 换行
    Txt.fn.bindEnterForDiv = function () {
        var tags = E.config.legalTags; // 配置中编辑器要求的合法标签，如 p head table blockquote ul ol 等
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;

        var $keydownDivElem;
        function divHandler() {
            if (!$keydownDivElem) {
                return;
            }

            var $pElem = $('<p>' + $keydownDivElem.html() + '</p>');
            $keydownDivElem.after($pElem);
            $keydownDivElem.remove();
        }

        $txt.on('keydown keyup', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            // 查找合法标签
            var rangeElem = editor.getRangeElem();
            var targetElem = editor.getLegalTags(rangeElem);
            var $targetElem;
            var $pElem;

            if (!targetElem) {
                // 没找到合法标签，就去查找 div
                targetElem = editor.getSelfOrParentByName(rangeElem, 'div');
                if (!targetElem) {
                    return;
                }
                $targetElem = $(targetElem);

                if (e.type === 'keydown') {
                    // 异步执行（同步执行会出现问题）
                    $keydownDivElem = $targetElem;
                    setTimeout(divHandler, 0);
                }

                if (e.type === 'keyup') {
                    // 将 div 的内容移动到 p 里面，并移除 div
                    $pElem = $('<p>' + $targetElem.html() + '</p>');
                    $targetElem.after($pElem);
                    $targetElem.remove();

                    // 如果是回车结束，将选区定位到行首
                    editor.restoreSelectionByElem($pElem.get(0), 'start');
                }
            }
        });
    };

    // enter时，用 p 包裹 text
    Txt.fn.bindEnterForText = function () {
        var self = this;
        var $txt = self.$txt;
        var handle;
        $txt.on('keyup', function (e) {
            if (e.keyCode !== 13) {
                return;
            }
            if (!handle) {
                handle = function() {
                    self.wrapImgAndText();
                };
            }
            setTimeout(handle);
        });
    };

    // tab 时，插入4个空格
    Txt.fn.bindTabEvent = function () {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;

        $txt.on('keydown', function (e) {
            if (e.keyCode !== 9) {
                // 只监听 tab 按钮
                return;
            }
            // 如果浏览器支持 insertHtml 则插入4个空格。如果不支持，就不管了
            if (editor.queryCommandSupported('insertHtml')) {
                editor.command(e, 'insertHtml', '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        });
    };

    // 处理粘贴内容
    Txt.fn.bindPasteFilter = function () {
        var self = this;
        var editor = self.editor;
        var resultHtml = '';  //存储最终的结果
        var $txt = self.$txt;
        var legalTags = editor.config.legalTags;
        var legalTagArr = legalTags.split(',');

        $txt.on('paste', function (e) {
            if (!editor.config.pasteFilter) {
                // 配置中取消了粘贴过滤
                return;
            }

            var currentNodeName = editor.getRangeElem().nodeName;
            if (currentNodeName === 'TD' || currentNodeName === 'TH') {
                // 在表格的单元格中粘贴，忽略所有内容。否则会出现异常情况
                return;
            }

            resultHtml = ''; // 先清空 resultHtml

            var pasteHtml, $paste;
            var data = e.clipboardData || e.originalEvent.clipboardData;
            var ieData = window.clipboardData;

            if (editor.config.pasteText) {
                // 只粘贴纯文本

                if (data && data.getData) {
                    // w3c
                    pasteHtml = data.getData('text/plain');
                } else if (ieData && ieData.getData) {
                    // IE
                    pasteHtml = ieData.getData('text');
                } else {
                    // 其他情况
                    return;
                }

                // 拼接为 <p> 标签
                if (pasteHtml) {
                    resultHtml = '<p>' + pasteHtml + '</p>';
                }

            } else {
                // 粘贴过滤了样式的、只有标签的 html

                if (data && data.getData) {
                    // w3c

                    // 获取粘贴过来的html
                    pasteHtml = data.getData('text/html');
                    if (pasteHtml) {
                        // 创建dom
                        $paste = $('<div>' + pasteHtml + '</div>');
                        // 处理，并将结果存储到 resultHtml 『全局』变量
                        handle($paste.get(0));
                    } else {
                        // 得不到html，试图获取text
                        pasteHtml = data.getData('text/plain');
                        if (pasteHtml) {
                            // 替换特殊字符
                            pasteHtml = pasteHtml.replace(/[ ]/g, '&nbsp;')
                                                 .replace(/</g, '&lt;')
                                                 .replace(/>/g, '&gt;')
                                                 .replace(/\n/g, '</p><p>');
                            // 拼接
                            resultHtml = '<p>' + pasteHtml + '</p>';

                            // 查询链接
                            resultHtml = resultHtml.replace(/<p>(https?:\/\/.*?)<\/p>/ig, function (match, link) {
                                return '<p><a href="' + link + '" target="_blank">' + link + '</p>';
                            });
                        }
                    }
                    
                } else if (ieData && ieData.getData) {
                    // IE 直接从剪切板中取出纯文本格式
                    resultHtml = ieData.getData('text');
                    if (!resultHtml) {
                        return;
                    }
                    // 拼接为 <p> 标签
                    resultHtml = '<p>' + resultHtml + '</p>';
                    resultHtml = resultHtml.replace(new RegExp('\n', 'g'), '</p><p>');
                } else {
                    // 其他情况
                    return;
                }
            }

            // 执行命令
            if (resultHtml) {
                editor.command(e, 'insertHtml', resultHtml);

                // 删除内容为空的 p 和嵌套的 p
                self.clearEmptyOrNestP();
            }
        });

        // 处理粘贴的内容
        function handle(elem) {
            if (!elem || !elem.nodeType || !elem.nodeName) {
                return;
            }
            var $elem;
            var nodeName = elem.nodeName.toLowerCase();
            var nodeType = elem.nodeType;
            var childNodesClone;

            // 只处理文本和普通node标签
            if (nodeType !== 3 && nodeType !== 1) {
                return;
            }

            $elem = $(elem);

            // 如果是容器，则继续深度遍历
            if (nodeName === 'div') {
                childNodesClone = [];
                $.each(elem.childNodes, function (index, item) {
                    // elem.childNodes 可获取TEXT节点，而 $elem.children() 就获取不到
                    // 先将 elem.childNodes 拷贝一份，一面在循环递归过程中 elem 发生变化
                    childNodesClone.push(item);
                });
                // 遍历子元素，执行操作
                $.each(childNodesClone, function () {
                    handle(this);
                });
                return;
            }
            
            if (legalTagArr.indexOf(nodeName) >= 0) {
                // 如果是合法标签之内的，则根据元素类型，获取值
                resultHtml += getResult(elem);
            } else if (nodeType === 3) {
                // 如果是文本，则直接插入 p 标签
                resultHtml += '<p>' + elem.textContent + '</p>';
            } else if (nodeName === 'br') {
                // <br>保留
                resultHtml += '<br/>';
            }
            else {
                // 忽略的标签
                if (['meta', 'style', 'script', 'object', 'form', 'iframe', 'hr'].indexOf(nodeName) >= 0) {
                    return;
                }
                // 其他标签，移除属性，插入 p 标签
                $elem = $(removeAttrs(elem));
                // 注意，这里的 clone() 是必须的，否则会出错
                resultHtml += $('<div>').append($elem.clone()).html();
            }
        }

        // 获取元素的结果
        function getResult(elem) {
            var nodeName = elem.nodeName.toLowerCase();
            var $elem;
            var htmlForP = '';
            var htmlForLi = '';

            if (['blockquote'].indexOf(nodeName) >= 0) {

                // 直接取出元素text即可
                $elem = $(elem);
                return '<' + nodeName + '>' + $elem.text() + '</' + nodeName + '>';

            } else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5'].indexOf(nodeName) >= 0) {

                //p head 取出 text 和链接
                elem = removeAttrs(elem);
                $elem = $(elem);
                htmlForP = $elem.html();

                // 剔除 a img 之外的元素
                htmlForP = htmlForP.replace(/<.*?>/ig, function (tag) {
                    if (tag === '</a>' || tag.indexOf('<a ') === 0 || tag.indexOf('<img ') === 0) {
                        return tag;
                    } else {
                        return '';
                    }
                });

                return '<' + nodeName + '>' + htmlForP + '</' + nodeName + '>';

            } else if (['ul', 'ol'].indexOf(nodeName) >= 0) {
                
                // ul ol元素，获取子元素（li元素）的text link img，再拼接
                $elem = $(elem);
                $elem.children().each(function () {
                    var $li = $(removeAttrs(this));
                    var html = $li.html();

                    html = html.replace(/<.*?>/ig, function (tag) {
                        if (tag === '</a>' || tag.indexOf('<a ') === 0 || tag.indexOf('<img ') === 0) {
                            return tag;
                        } else {
                            return '';
                        }
                    });

                    htmlForLi += '<li>' + html + '</li>';
                });
                return '<' + nodeName + '>' + htmlForLi + '</' + nodeName + '>';
            
            } else {
                
                // 其他元素，移除元素属性
                $elem = $(removeAttrs(elem));
                return $('<div>').append($elem).html();
            }
        }

        // 移除一个元素（子元素）的attr
        function removeAttrs(elem) {
            var attrs = elem.attributes || [];
            var attrNames = [];
            var exception = ['href', 'target', 'src', 'alt', 'rowspan', 'colspan']; //例外情况

            // 先存储下elem中所有 attr 的名称
            $.each(attrs, function (key, attr) {
                if (attr && attr.nodeType === 2) {
                    attrNames.push(attr.nodeName);
                }
            });
            // 再根据名称删除所有attr
            $.each(attrNames, function (key, attr) {
                if (exception.indexOf(attr) < 0) {
                    // 除了 exception 规定的例外情况，删除其他属性
                    elem.removeAttribute(attr);
                }
            });


            // 递归子节点
            var children = elem.childNodes;
            if (children.length) {
                $.each(children, function (key, value) {
                    removeAttrs(value);
                });
            }

            return elem;
        }
    };

    // 绑定 $txt.formatText() 方法
    Txt.fn.bindFormatText = function () {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;
        var legalTags = E.config.legalTags;
        var legalTagArr = legalTags.split(',');
        var length = legalTagArr.length;
        var regArr = [];

        // 将 E.config.legalTags 配置的有效字符，生成正则表达式
        $.each(legalTagArr, function (k, tag) {
            var reg = '\>\\s*\<(' + tag + ')\>';
            regArr.push(new RegExp(reg, 'ig'));
        });

        // 增加 li 
        regArr.push(new RegExp('\>\\s*\<(li)\>', 'ig'));

        // 增加 tr
        regArr.push(new RegExp('\>\\s*\<(tr)\>', 'ig'));

        // 增加 code
        regArr.push(new RegExp('\>\\s*\<(code)\>', 'ig'));

        // 生成 formatText 方法
        $txt.formatText = function () {
            var $temp = $('<div>');
            var html = $txt.html();

            // 去除空格
            html = html.replace(/\s*</ig, '<');

            // 段落、表格之间换行
            $.each(regArr, function (k, reg) {
                if (!reg.test(html)) {
                    return;
                }
                html = html.replace(reg, function (matchStr, tag) {
                    return '>\n<' + tag + '>';
                });
            });

            $temp.html(html);
            return $temp.text();
        };
    };

    // 定制 $txt.html 方法
    Txt.fn.bindHtml = function () {
        var self = this;
        var editor = self.editor;
        var $txt = self.$txt;
        var $valueContainer = editor.$valueContainer;
        var valueNodeName = editor.valueNodeName;

        $txt.html = function (html) {
            var result;

            if (valueNodeName === 'div') {
                // div 生成的编辑器，取值、赋值，都直接触发jquery的html方法
                result = $.fn.html.call($txt, html);
            }

            // textarea 生成的编辑器，则需要考虑赋值时，也给textarea赋值

            if (html === undefined) {
                // 取值，直接触发jquery原生html方法
                result = $.fn.html.call($txt);

                // 替换 html 中，src和href属性中的 & 字符。
                // 因为 .html() 或者 .innerHTML 会把所有的 & 字符都改成 &amp; 但是 src 和 href 中的要保持 &
                result = result.replace(/(href|src)\=\"(.*)\"/igm, function (a, b, c) {
                    return b + '="' + c.replace('&amp;', '&') + '"';
                });
            } else {
                // 赋值，需要同时给 textarea 赋值
                result = $.fn.html.call($txt, html);
                $valueContainer.val(html);
            }

            if (html === undefined) {
                return result;
            } else {
                // 手动触发 change 事件，因为 $txt 监控了 change 事件来判断是否需要执行 editor.onchange 
                $txt.change();
            }
        };
    };
});