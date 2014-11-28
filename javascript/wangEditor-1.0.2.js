/*
*   wangEditor
*   v1.0.2
*   2014/11/19
*   王福朋
*/
(function (window, $, undefined) {
    //检查jQuery
    if (!$) {
        throw new Error('wangEditor: 找不到window.jQuery（即参数 $），请检查是否引用了jQuery！')
    }
    var
        //核心函数
        coreFn, 

        //默认配置
        defaultOptions = {
            codeTargetId: false,
            frameHeight: '300px',
            initStr: '欢迎使用<b>wangEitor</b>，请输入...'
        };

    //IE8及以下浏览器的处理
    if (window.navigator.appName === 'Microsoft Internet Explorer' && (/MSIE\s*(?=5.0|6.0|7.0|8.0)/i).test(window.navigator.appVersion)) {
        /* 核心函数，将通过 extend 函数添加到 $.fn 中
        * options.codeTargetId: 存储源码的textarea或input的ID
        * options.frameHeight: 高度
        * options.initStr: 初始化用的字符串
        */
        coreFn = function (options) {
            //用options覆盖defaultOptions
            options = $.extend(defaultOptions, options)
            var initStr = options.initStr,
                height = options.frameHeight,
                $target = (options.codeTargetId && typeof options.codeTargetId === 'string') ? $('#' + options.codeTargetId) : false,
                $txt = $('<textarea style="width:100%; height:' + height + '"></textarea>'),
                $lowBrowserInfo = $('<p style="color:#666666;background-color:#f1f1f1;"></p>'),

                rhtmlCode = /(<.*?>)|(&.*?;)/gm,
                alertInfo = '抱歉，IE8及以下浏览器只能输入纯文本...',
                saveTxt = function () {
                    var txt = $txt.text();
                    txt = txt.replace('&', '&amp;')
                             .replace('<', '&lt;')
                             .replace('>', '&gt;')
                             .replace('\n', '<br />')
                             .replace(/\s{1}/gm, '&nbsp;');

                    if ($target[0].nodeName.toLowerCase() === 'input') {
                        $target.val('<p>' + txt + '</p>');
                    } else {
                        $target.text('<p>' + txt + '</p>');
                    }
                };

            if (rhtmlCode.test(initStr)) {
                // 包含 <> html标签，要删掉<>标签
                initStr = initStr.replace(rhtmlCode, '');
                alertInfo = '抱歉，在IE8及以下浏览器中编辑<b style="color:red;">可能会丢失样式、链接或图片，请慎重保存！</b>';
            }
            $txt.text(initStr);
            $lowBrowserInfo.html(alertInfo);

            //随时保存内容
            if ($target) {
                $txt.click(saveTxt);
                $txt.keyup(saveTxt);
            }

            //插入txt和说明
            this.append($lowBrowserInfo).append($txt);
        }
    }
    else {
        //IE9+继续往下执行：
        var i,
            //id前缀，避免和其他id冲突
            idPrefix = 'wangeditor_' + Math.random().toString().replace('.', '') + '_',

            //-----------------------字体、字号、颜色配置---------------------start
            //字体配置
            fontFamilyOptionsLiStr = (function () {
                var temp = '<li><a href="#" style="font-family:${0}">${1}</a></li>',
                    options = ['宋体', '黑体', '楷体', '隶书', '幼圆', '微软雅黑', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS'],
                    length = options.length,
                    str = (function () {
                        var arr = [],
                            i,
                            value;
                        for (i = 0; i < length; i++) {
                            value = options[i];
                            arr.push(temp.replace('${0}', value)
                                         .replace('${1}', value)
                                );
                        }
                        return arr.join('');
                    })();
                return str;
            })(),
            //颜色配置
            colorOptions = {
                '#880000': '暗红色',
                '#800080': '紫色',
                '#ff0000': '红色',
                '#ff00ff': '鲜粉色',
                '#000080': '深蓝色',
                '#0000ff': '蓝色',
                '#00ffff': '湖蓝色',
                '#008080':'蓝绿色',
                '#008000':'绿色',
                '#808000':'橄榄色',
                '#00ff00':'浅绿色',
                '#ffcc00':'橙黄色',
                '#808080':'灰色',
                '#c0c0c0':'银色',
                '#000000':'黑色'
            },
            colorOptionsLiStr = (function () {
                var temp = '<li><a href="#" style="color:${0};">${1}</a></li>',
                    str = (function () {
                        var arr = [],
                            item,
                            value;
                        for (item in colorOptions) {
                            if (Object.prototype.hasOwnProperty.call(colorOptions, item)) {
                                value = colorOptions[item];
                                arr.push(temp.replace('${0}', item)
                                             .replace('${1}', value)
                                    );
                            }
                        }
                        return arr.join('');
                    })();
                return str;
            })(),
            bgColorOptionsLiStr = (function () {
                var temp = '<li><a href="#"><span style="background-color:${0};">&nbsp;&nbsp;&nbsp;</span> ${1}</a></li>',
                    str = (function () {
                        var arr = [],
                            item,
                            value;
                        for (item in colorOptions) {
                            if (Object.prototype.hasOwnProperty.call(colorOptions, item)) {
                                value = colorOptions[item];
                                arr.push(temp.replace('${0}', item)
                                             .replace('${1}', value)
                                    );
                            }
                        }
                        return arr.join('');
                    })();
                return str;
            })(),
            //字号配置
            fontsizeOptionsLiStr = (function () {
                var fontsizeOptions = {
                    1: '10px',
                    2: '13px',
                    3: '16px',
                    4: '19px',
                    5: '22px',
                    6: '25px',
                    7: '28px'
                },
                    temp = '<li><a href="#" fontSize="${0}" style="font-size:${1};">${2}</a></li>',
                    str = (function () {
                        var arr = [],
                            item,
                            value;
                        for (item in fontsizeOptions) {
                            if (Object.prototype.hasOwnProperty.call(fontsizeOptions, item)) {
                                value = fontsizeOptions[item];
                                arr.push(temp.replace('${0}', item)
                                             .replace('${1}', value)
                                             .replace('${2}', value)
                                    );
                            }
                        }
                        return arr.join('');
                    })();
                return str;
            })();
            //-----------------------字体、字号、颜色配置---------------------end

        /* 核心函数，将通过 extend 函数添加到 $.fn 中
        * options.codeTargetId: 存储源码的textarea或input的ID
        * options.frameHeight: 高度
        * options.initStr: 初始化用的字符串
        */
        coreFn = function (options) {
            //用options覆盖defaultOptions
            options = $.extend(defaultOptions, options);

            var
                //检查字符串
                strCheck = function (value) {
                    if (!value || typeof value !== 'string' || value.length === 0) {
                        throw new Error('错误：【' + value + '】不是字符串！');
                    }
                },

                //menu container
                $menuContainer = $('<div></div>'),

                //menu toolbar===================================================start
                //btn-group （用于clone）
                $btnGroup = $('<div class="btn-group"></div>'),

                /*模板方法：生成button标签
                * title: button标题
                * iconClass: button中的图标样式
                * isDropdown: 是否关联下来菜单
                * modalTarget: 弹出层的id
                * btnContent: 自定义button内部的内容，取代 <i icon>
                * btnSingleCommandName: 单参数execCommand操作，如'bold'、'underline'等
                */
                btnTemp = function (title, iconClass, isDropdown, modalTarget, btnContent, btnSingleCommandName) {
                    //验证：
                    strCheck(title);
                    if (btnContent) {
                        strCheck(btnContent);
                    } else {
                        strCheck(iconClass);
                    }
                    if (modalTarget) {
                        strCheck(modalTarget);
                    }
                    if (btnSingleCommandName) {
                        strCheck(btnSingleCommandName);
                    }

                    var temp = '<button type="button" title="$title$" class="$class$" $data-Prop$>$content$</button>', //模板
                        dataProp = '',
                        content = '',
                        btnClass = 'btn';

                    //是否是下拉按钮
                    if (isDropdown) {
                        btnClass = 'btn dropdown-toggle';
                    }
                    //title class
                    temp = temp.replace('$title$', title)
                               .replace('$class$', btnClass);
                    // data-Prop
                    if (isDropdown) {
                        dataProp += ' data-toggle="dropdown" ';
                    }
                    if (modalTarget) {
                        dataProp += ' data-target="' + modalTarget + '" data-backdrop="false"  data-toggle="modal" ';
                    }
                    if (btnSingleCommandName) {
                        dataProp += ' singleCommandName="' + btnSingleCommandName + '" ';
                    }
                    temp = temp.replace('$data-Prop$', dataProp);

                    //content
                    if (btnContent) {
                        content += btnContent;
                    } else {
                        content += '<i class="' + iconClass + '"></i>';
                    }
                    if (isDropdown) {
                        content += '<span class="caret"></span>';
                    }
                    temp = temp.replace('$content$', content);
                    return temp;
                },

                /*模板方法：生成dropdown menu ul
                * headerText: 标题
                * content: 菜单内容
                */
                dropdownMenuTemp = function (headerText, content) {
                    //验证
                    strCheck(content);
                    if (headerText) {
                        strCheck(headerText);
                    }

                    var temp = '<ul class="dropdown-menu">${0} ${1}</ul>';
                    if (headerText) {
                        temp = temp.replace('${0}', '<li class="nav-header">' + headerText + '</li>');
                    }
                    temp = temp.replace('${1}', content);

                    return temp;
                },

                //粗体、斜体、下划线
                $btnGroup_bold = $btnGroup.clone(),
                $menuBold = $(btnTemp('加粗', 'icon-bold', false, false, false, 'bold')),
                $menuItalic = $(btnTemp('斜体', 'icon-italic', false, false, false, 'italic')),
                $menuUnderline = $(btnTemp('下划线', 'icon-underline', false, false, false, 'underline')),
                _nodata = $btnGroup_bold.append($menuBold).append($menuItalic).append($menuUnderline),

                //字号
                $btnGroup_fontsize = $btnGroup.clone(),
                $menuFontsize = $(btnTemp('字号', 'icon-text-height', true)),
                $dropdownMenuFontsize = $(dropdownMenuTemp('字号：', fontsizeOptionsLiStr)),
                _nodata = $btnGroup_fontsize.append($menuFontsize).append($dropdownMenuFontsize),

                //字体
                $btnGroup_fontfamily = $btnGroup.clone(),
                $menuFontFamily = $(btnTemp('字体', 'icon-font', true)),
                $dropdownMenuFontFamily = $(dropdownMenuTemp('字体：', fontFamilyOptionsLiStr)),
                _nodata = $btnGroup_fontfamily.append($menuFontFamily).append($dropdownMenuFontFamily),

                //前景色
                $btnGroup_fontColor = $btnGroup.clone(),
                $menuFontColor = $(btnTemp('前景色', null, true, null, '<b style="color:red;">A</b>')),
                $dropdownMenuFontColor = $(dropdownMenuTemp('前景色：', colorOptionsLiStr)),
                _nodata = $btnGroup_fontColor.append($menuFontColor).append($dropdownMenuFontColor),

                //背景色
                $btnGroup_bgColor = $btnGroup.clone(),
                $menubgColor = $(btnTemp('背景色', null, true, null, '<b style="background-color:blue;color:white;">&nbsp;A&nbsp;</b>')),
                $dropdownMenuBgColor = $(dropdownMenuTemp('背景色：', bgColorOptionsLiStr)),
                _nodata = $btnGroup_bgColor.append($menubgColor).append($dropdownMenuBgColor),

                //列表
                $btnGroup_list = $btnGroup.clone(),
                $menuOrderedList = $(btnTemp('有序列表', 'icon-list-ol', false, false, false, 'InsertOrderedList')),
                $menuUnorderedList = $(btnTemp('无序列表', 'icon-list-ul', false, false, false, 'InsertUnorderedList')),
                _nodata = $btnGroup_list.append($menuUnorderedList).append($menuOrderedList),

                //对齐
                $btnGroup_align = $btnGroup.clone(),
                $menuAlignLeft = $(btnTemp('左对齐', 'icon-align-left', false, false, false, 'JustifyLeft')),
                $menuAlignCenter = $(btnTemp('居中', 'icon-align-center', false, false, false, 'JustifyCenter')),
                $menuAlignRight = $(btnTemp('右对齐', 'icon-align-right', false, false, false, 'JustifyRight')),
                _nodata = $btnGroup_align.append($menuAlignLeft).append($menuAlignCenter).append($menuAlignRight),

                //链接
                $btnGroup_link = $btnGroup.clone(),
                linkModalId = idPrefix + 'LinkModal',
                $menuLink = $(btnTemp('插入链接', 'icon-link', false, '#' + linkModalId)),
                $menuRemoveLink = $(btnTemp('删除链接', 'icon-remove', false, false, false, 'unlink')),
                _nodata = $btnGroup_link.append($menuLink).append($menuRemoveLink),

                //表格
                $btnGroup_table = $btnGroup.clone(),
                tableModalId = idPrefix + 'TableModal',
                $menuTable = $(btnTemp('插入表格', 'icon-table', false, '#' + tableModalId)),
                _nodata = $btnGroup_table.append($menuTable),

                //图片
                $btnGroup_img = $btnGroup.clone(),
                imgModalId = idPrefix + 'imgModal',
                $menuImg = $(btnTemp('插入图片', 'icon-picture', false, '#' + imgModalId)),
                _nodata = $btnGroup_img.append($menuImg),

                //代码
                $btnGroup_code = $btnGroup.clone(),
                codeModalId = idPrefix + 'codeModal',
                $menuCode = $(btnTemp('插入代码', undefined, false, '#' + codeModalId, '<i class="icon-angle-left"></i>%<i class="icon-angle-right"></i>')),
                _nodata = $btnGroup_code.append($menuCode),

                //撤销、恢复
                $btnGroup_undo = $btnGroup.clone(),
                $menuUndo = $(btnTemp('撤销', 'icon-undo', false, false, false, 'Undo')),
                $menuRedo = $(btnTemp('恢复', 'icon-repeat', false, false, false, 'Redo')),
                _nodata = $btnGroup_undo.append($menuUndo).append($menuRedo),

                $menuToolbar = $('<div class="btn-toolbar"></div>'),
                _nodata = $menuToolbar.append($btnGroup_fontfamily)  //字体
                                      .append($btnGroup_fontsize) //字号
                                      .append($btnGroup_bold) //粗体、斜体、下划线
                                      .append($btnGroup_fontColor) //前景色
                                      .append($btnGroup_bgColor) //背景色
                                      .append($btnGroup_list) //列表
                                      .append($btnGroup_align) //对齐
                                      .append($btnGroup_link) //链接
                                      .append($btnGroup_table) //表格
                                      .append($btnGroup_img) //图片
                                      .append($btnGroup_code) //代码
                                      .append($btnGroup_undo), //撤销、恢复
                _nodata = $menuContainer.append($menuToolbar) //插入 menu toolbar
                                        .find('button').tooltip({ container: 'body' }), //menu tooltip 效果
                //menu toolbar===================================================end

                //menu modal===================================================start
                $menuModal = $('<div></div>'),

                /*模板方法：生成modal层
                * id: id
                * title: 标题，字符串
                * bodyContents: 要加入body中的内容，数组
                * footerContents: 底部内容，数组
                */
                modalTemp = function (id, title, bodyContents, footerContents) {
                    //验证
                    strCheck(id);
                    strCheck(title);

                    var i,
                        modal = $('<div id="' + id + '" class="modal hide fade">'),
                        modalTitle = $(
                                        '<div class="modal-header">' +
                                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                                        '<h4>' + title + '</h4>' +
                                        '</div>'
                                       ),
                        modalBody = $('<div class="modal-body">'),
                        modalFooter = $('<div class="modal-footer">');

                    modal.append(modalTitle);  //插入title

                    if (bodyContents && typeof bodyContents.length === 'number' && bodyContents.length > 0) {
                        for (i = 0; i < bodyContents.length; i++) {
                            modalBody.append(bodyContents[i]);
                        }
                        modal.append(modalBody); //插入body
                    }
                    if (footerContents && typeof footerContents.length === 'number' && footerContents.length > 0) {
                        for (i = 0; i < footerContents.length; i++) {
                            modalFooter.append(footerContents[i]);
                        }
                        modal.append(modalFooter); //插入footer
                    }

                    return modal;
                },

                //插入链接 modal
                $linkModalBody_desc = $('<p>链接地址：</p>'),
                $linkModalBody_txtUrl = $('<input type="text" placeholder="http(s)://" class="input-block-level"/>'),
                linkModalBodyContents = [$linkModalBody_desc, $linkModalBody_txtUrl],
                //$linkModalBody_target = $('<p>链接目标：</p>'),
                //$linkModalBody_sltTarget = $('<select><option>_blank</option><option>_self</option></select>'),
                //linkModalBodyContents = [$linkModalBody_desc, $linkModalBody_txtUrl, $linkModalBody_target, $linkModalBody_sltTarget],

                $linkModalFooter_save = $('<a href="#" class="btn btn-primary">插入链接</a>'),
                linkModalFooterContents = [$linkModalFooter_save],

                $linkModal = modalTemp(linkModalId, '插入链接', linkModalBodyContents, linkModalFooterContents),

                //插入表格 modal
                $tableModalBody_rowLabel = $('<span>行数：</span>'),
                $tableModalBody_rowNum = $('<input type="text" style="width:50px;" value="3"/>'),
                $tableModalBody_colLabel = $('<span>&nbsp;&nbsp;&nbsp;&nbsp;列数：</span>'),
                $tableModalBody_colNum = $('<input type="text" style="width:50px;" value="5"/>'),
                $tableModalBody_firstRowBoldLabel = $('<span>&nbsp;&nbsp;&nbsp;&nbsp;首行加粗 </span>'),
                $tableModalBody_firstRowBold = $('<input type="checkbox" checked="checked"/>'),
                tableModalBodyContents = [
                                            $tableModalBody_rowLabel,
                                            $tableModalBody_rowNum,
                                            $tableModalBody_colLabel,
                                            $tableModalBody_colNum,
                                            $tableModalBody_firstRowBoldLabel,
                                            $tableModalBody_firstRowBold
                                        ],

                $tableModalFooter_save = $('<a href="#" class="btn btn-primary">插入表格</a>'),
                tableModalFooterContents = [$tableModalFooter_save],

                $tableModal = modalTemp(tableModalId, '插入表格', tableModalBodyContents, tableModalFooterContents),

                //插入图片 modal
                $imgModalBody_desc = $('<p>输入图片URL地址：</p>'),
                $imgModalBody_txtUrl = $('<input type="text" placeholder="http(s)://" class="input-block-level"/>'),
                imgModalBodyContents = [$imgModalBody_desc, $imgModalBody_txtUrl],

                $imgModalFooter_save = $('<a href="#" class="btn btn-primary">插入</a>'),
                imgModalFooterContents = [$imgModalFooter_save],

                $imgModal = modalTemp(imgModalId, '插入图片', imgModalBodyContents, imgModalFooterContents),

                //插入代码 modal
                $codeModalBody_content = $('<div></div>'),
                $codeModalBody_langLabel = $('<span>语言：</span>'),
                $codeModalBody_langSlt = $('<select class="input-medium"></select>'),
                $codeModalBody_themeLabel = $('<span>&nbsp;&nbsp;主题：</span>'),
                $codeModalBody_themeSlt = $('<select class="input-medium"></select>'),
                _nodata = $codeModalBody_content.append($codeModalBody_langLabel)
                                                .append($codeModalBody_langSlt)
                                                .append($codeModalBody_themeLabel)
                                                .append($codeModalBody_themeSlt),
                $codeModalBody_text = $('<textarea rows="10" cols="50" style="width:95%"></textarea>'),
                codeModalBodyContents = [$codeModalBody_content, $codeModalBody_text],

                $codeModalFooter_save = $('<a href="#" class="btn btn-primary">插入</a>'),
                $codeModalFooterContents = [$codeModalFooter_save],

                $codeModal = modalTemp(codeModalId, '插入代码', codeModalBodyContents, $codeModalFooterContents),

                //插入所有modal
                _nodata = $menuModal.append($linkModal)
                                    .append($imgModal)
                                    .append($codeModal)
                                    .append($tableModal),
                _nodata = $menuContainer.append($menuModal),
                //menu modal===================================================end

                //iframe container==========================================start
                iframeHeight = options.frameHeight,
                $iframeContainer = $('<div style="width: 100%; height: ' + iframeHeight + '; border: 1px solid #cccccc;"></div>'),
                $iframe = $('<iframe frameborder="0" width="100%" height="100%"></iframe>'),
                initStr = options.initStr,
                _nodata = $iframeContainer.append($iframe),

                iframeWindow,
                $iframeWindow,
                iframeDocument,
                $iframeDocument,
                $codeTarget = (options.codeTargetId && typeof options.codeTargetId === 'string') ? $('#' + options.codeTargetId) : false,  //代码存储的目标（通过 $(options.codeTargetId) 获取）
                execCommand,

                currentSelectionData; //记录当前选择的内容，有时需要恢复
            //iframe container==========================================end

            //插入代码modal：绑定语言和主题下拉框
            if (window.wangHighLighter) {
                (function () {
                    var langArray = window.wangHighLighter.getLangArray(),
                        langLength = langArray.length,
                        langOptionsArray = [],
                        themeArray = window.wangHighLighter.getThemeArray(),
                        themeLength = themeArray.length,
                        themeOptionsArray = [],
                        i,
                        item;

                    for (i = 0; i < langLength; i++) {
                        item = langArray[i];
                        langOptionsArray.push('<option value="' + item + '">' + item + '</option>');
                    }
                    $codeModalBody_langSlt.append($(langOptionsArray.join('')));

                    for (i = 0; i < themeLength; i++) {
                        item = themeArray[i];
                        themeOptionsArray.push('<option value="' + item + '">' + item + '</option>');
                    }
                    $codeModalBody_themeSlt.append($(themeOptionsArray.join('')));
                })();
            }

            //插入 $menuContainer
            this.append($menuContainer);
            //插入 $iframeContainer
            this.append($iframeContainer);

            //配置 iframe ==================================start
            iframeWindow = $iframe[0].contentWindow;
            $iframeWindow = $(iframeWindow);
            iframeDocument = iframeWindow.document;
            $iframeDocument = $(iframeDocument);
            iframeDocument.open();
            iframeDocument.write(
                                    '<!DOCTYPE html>' +
                                    '<html xmlns="http://www.w3.org/1999/xhtml">' +
                                    '<head><title></title></head>' +
                                    '<body>' +
                                    initStr +   //传入的内容（options.initStr），用于编辑
                                    '</body>' +
                                    '</html>'
                                );
            iframeDocument.close();
            iframeDocument.designMode = 'on';
            $(window).load(function () {
                //在window.onload再验证 ifrDoc.designMode 是否为 'on'; （chrome有时候需要这一步验证）
                if (iframeDocument.designMode.toLowerCase() === 'off') {
                    iframeDocument.designMode = 'on';
                }
            });
            execCommand = function (command, b, value) {
                iframeDocument.execCommand(command, b, value);
            };

            //获取iframe中的代码，保存到options.codeTargetId中
            function saveIframeCode() {
                if ($codeTarget) {
                    if ($codeTarget[0].nodeName.toLowerCase() === 'input') {
                        $codeTarget.val(iframeDocument.body.innerHTML);
                    } else {
                        $codeTarget.text(iframeDocument.body.innerHTML);
                    }
                }
            }

            //失去焦点时，及时记录文字内容
            $iframeWindow.blur(saveIframeCode);
            //配置 iframe ==================================end


            //监听选中文字的样式=============================start
            //根据鼠标焦点，动态设置菜单按钮的样式
            function updateMenuStyle(command) {
                if (typeof command === 'string') {
                    command = command.toLowerCase();
                }
                //是否加粗
                if (command === 'bold' || command === undefined) {
                    if (iframeDocument.queryCommandState('bold')) {
                        $menuBold.addClass('btn-primary');
                    } else {
                        $menuBold.removeClass('btn-primary');
                    }
                }
                //是否斜体
                if (command === 'italic' || command === undefined) {
                    if (iframeDocument.queryCommandState('italic')) {
                        $menuItalic.addClass('btn-primary');
                    } else {
                        $menuItalic.removeClass('btn-primary');
                    }
                }
                //是否下划线
                if (command === 'underline' || command === undefined) {
                    if (iframeDocument.queryCommandState('underline')) {
                        $menuUnderline.addClass('btn-primary');
                    } else {
                        $menuUnderline.removeClass('btn-primary');
                    }
                }
                //是否左对齐
                if (command === 'JustifyLeft' || command === undefined) {
                    if (iframeDocument.queryCommandState('JustifyLeft')) {
                        $menuAlignLeft.addClass('btn-primary');
                    } else {
                        $menuAlignLeft.removeClass('btn-primary');
                    }
                }
                //是否居中
                if (command === 'JustifyCenter' || command === undefined) {
                    if (iframeDocument.queryCommandState('JustifyCenter')) {
                        $menuAlignCenter.addClass('btn-primary');
                    } else {
                        $menuAlignCenter.removeClass('btn-primary');
                    }
                }
                //是否右对齐
                if (command === 'JustifyRight' || command === undefined) {
                    if (iframeDocument.queryCommandState('JustifyRight')) {
                        $menuAlignRight.addClass('btn-primary');
                    } else {
                        $menuAlignRight.removeClass('btn-primary');
                    }
                }
                //是否是列表
                if (command === 'InsertOrderedList' || command === undefined) {
                    if (iframeDocument.queryCommandState('InsertOrderedList')) {
                        $menuOrderedList.addClass('btn-primary');
                    } else {
                        $menuOrderedList.removeClass('btn-primary');
                    }
                }
                if (command === 'InsertUnorderedList' || command === undefined) {
                    if (iframeDocument.queryCommandState('InsertUnorderedList')) {
                        $menuUnorderedList.addClass('btn-primary');
                    } else {
                        $menuUnorderedList.removeClass('btn-primary');
                    }
                }
            }
            //监听函数
            function iframeListener(e) {
                var eType = e.type,
                    kCode = e.keyCode,
                    keyForMoveCursor = false,
                    kCodes = [33, 34, 35, 36, 37, 38, 39, 40];

                keyForMoveCursor = (eType === 'keyup') && (kCodes.indexOf(kCode) !== -1);
                if (eType !== 'click' && !keyForMoveCursor) {
                    //只监听鼠标点击和[33, 34, 35, 36, 37, 38, 39, 40]这几个键，其他的不监听
                    return;
                }

                //更新菜单按钮的样式
                updateMenuStyle();

                //记录当前的选择内容
                currentSelectionData = iframeDocument.getSelection().getRangeAt(0);
            }
            //添加监听事件
            $iframeDocument.click(iframeListener);
            $iframeDocument.keyup(iframeListener);
            //监听选中文字的样式=============================end


            //菜单操作 =========================================start
            //单参数的execCommand操作
            $menuToolbar.find('button').each(function () {
                var $this = $(this),
                    command = $this.attr('singleCommandName');
                if (command) {
                    $this.click(function () {
                        execCommand(command);
                        updateMenuStyle(command);
                    });
                }
            });
            //前景色
            $dropdownMenuFontColor.find('a').each(function () {
                var menuColor = $(this),
                    value = this.style.color;
                menuColor.click(function (e) {
                    execCommand('ForeColor', false, value);
                    e.preventDefault();
                });
            });
            //背景色
            $dropdownMenuBgColor.find('a').each(function () {
                var menuBgColor = $(this),
                    value = menuBgColor.children().first()[0].style.backgroundColor;
                menuBgColor.click(function (e) {
                    execCommand('backColor', false, value);
                    e.preventDefault();
                });
            });
            //字体
            $dropdownMenuFontFamily.find('a').each(function () {
                var menuFamily = $(this),
                    value = menuFamily.css('font-family');
                menuFamily.click(function (e) {
                    execCommand('FontName', false, value);
                    e.preventDefault();
                });
            });
            //字号
            $dropdownMenuFontsize.find('a').each(function () {
                var menuFontSize = $(this),
                    value = menuFontSize.attr('fontSize');
                menuFontSize.click(function (e) {
                    execCommand('FontSize', false, value);
                    e.preventDefault();
                });
            });
            //插入链接
            $linkModalFooter_save.click(function (e) {
                var selection = iframeDocument.getSelection(),
                    url = $linkModalBody_txtUrl.val(),
                    target = $linkModalBody_sltTarget.val();

                //恢复当前的选择内容（for IE,Opera）
                if (selection && currentSelectionData) {
                    selection.removeAllRanges();
                    selection.addRange(currentSelectionData);
                }

                execCommand('createLink', false, url);
                e.preventDefault();
                $linkModal.modal('hide');
            });
            //插入表格
            $tableModalFooter_save.click(function (e) {
                var selection = iframeDocument.getSelection(),
                    $elem,

                    //获取基本配置
                    rowNum = $tableModalBody_rowNum.val(),
                    rowNum = isNaN(+rowNum) ? 3 : rowNum,
                    colNum = $tableModalBody_colNum.val(),
                    colNum = isNaN(+colNum) ? 5 : colNum,
                    firstRowBold = $tableModalBody_firstRowBold.is(':checked'),

                    i, j,
                    //表格模板
                    table = '',
                    tableTemp = '<table border="0" cellpadding="0" cellspacing="0" style="${style}" > ${content} </table>',
                    trArray = [],
                    firstTrTemp = '<tr style="font-weight:bold;background-color:#f1f1f1;">${content}</tr>',
                    trTemp = '<tr>${content}</tr>',
                    tdArray = [],
                    tdTemp = '<td style="width:100px; ${style}">&nbsp;</td>',
                    borderStyle = '1px solid #cccccc';
                //完善模板
                tableTemp = tableTemp.replace('${style}', 'border-left:' + borderStyle + ';border-top:' + borderStyle + ';');
                tdTemp = tdTemp.replace('${style}', 'border-bottom:' + borderStyle + ';border-right:' + borderStyle + ';');

                //生成table代码
                for (i = 0; i < rowNum; i++) {
                    tdArray = [];
                    for (j = 0; j < colNum; j++) {
                        tdArray.push(tdTemp);
                    }
                    if (i === 0 && firstRowBold) {
                        trArray.push(firstTrTemp.replace('${content}', tdArray.join('')));
                    } else {
                        trArray.push(trTemp.replace('${content}', tdArray.join('')));
                    }
                }
                table = tableTemp.replace('${content}', trArray.join(''));

                //恢复当前的选择内容（for IE,Opera）
                if (selection && currentSelectionData) {
                    selection.removeAllRanges();
                    selection.addRange(currentSelectionData);

                    //定位在哪个elem后面插入table
                    if (selection.focusNode.nodeType === 3) {
                        $elem = $(selection.focusNode.parentNode);
                    } else {
                        $elem = $(selection.focusNode);
                    }
                    //插入代码
                    if ($elem.next().length === 0) {
                        table += '<p>&nbsp;</p>';
                    }
                    $elem.after($(table));
                }

                e.preventDefault();
                $tableModal.modal('hide');
            });
            //插入图片
            $imgModalFooter_save.click(function (e) {
                var selection = iframeDocument.getSelection(),
                    url = $imgModalBody_txtUrl.val();

                //恢复当前的选择内容（for IE,Opera）
                if (selection && currentSelectionData) {
                    selection.removeAllRanges();
                    selection.addRange(currentSelectionData);
                }

                execCommand('insertImage', false, url);
                e.preventDefault();
                $imgModal.modal('hide');
            });
            //插入代码
            $codeModalFooter_save.click(function (e) {
                var selection = iframeDocument.getSelection(),
                    $elem,
                    lang = $codeModalBody_langSlt.val(),
                    theme = $codeModalBody_themeSlt.val(),
                    code = $codeModalBody_text.val();
                $codeModalBody_text.val('');  //及时清空

                if (!window.wangHighLighter) {
                    throw new Error('未引用wangHighLighter.js，无法格式化代码...');
                    return;
                }
                code = window.wangHighLighter.highLight(lang, theme, code);
                //恢复当前的选择内容（for IE,Opera）
                if (selection && currentSelectionData) {
                    selection.removeAllRanges();
                    selection.addRange(currentSelectionData);

                    //定位在哪个elem后面插入code表格
                    if (selection.focusNode.nodeType === 3) {
                        $elem = $(selection.focusNode.parentNode);
                    } else {
                        $elem = $(selection.focusNode);
                    }
                    //插入代码
                    if ($elem.next().length === 0) {
                        code += '<p>&nbsp;</p>';
                    }
                    $elem.after($(code));
                }
                e.preventDefault();
                $codeModal.modal('hide');
            });
            //每个菜单按钮点击时，都随时记录源码
            $menuContainer.click(function () {
                saveIframeCode();
            });
            //菜单操作 =========================================end
        }
    }
    //制作jquery插件
    $.fn.extend({
        wangEditor: coreFn
    });
})(window, window.jQuery);