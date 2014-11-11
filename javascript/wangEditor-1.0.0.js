/*
    wangEditor
    v1.0.0
    2014/11/06
    王福朋
*/
//检查jQuery
if (!window.jQuery) {
    throw new Error('wangEditor: 找不到window.jQuery，请检查是否引用了jQuery！')
}
(function ($, window, undefined) {

    //IE8及以下浏览器的处理
    if (navigator.appName === 'Microsoft Internet Explorer' && (/MSIE\s*(?=5.0|6.0|7.0|8.0)/i).test(navigator.appVersion)) {

        jQuery.fn.extend({
            wangEditor: function (options) {
                var
                    height = options.frameHeight || '300px',
                    initWords = options.initWords || '请输入...',
                    $txt = $('<textarea style="width:100%; height:' + height + '">' + initWords + '</textarea>'),
                    $lowBrowserInfo = $('<p style="color:#666666;background-color:#f1f1f1;">（抱歉，暂不支持IE8及以下浏览器，现在只能输入纯文本...）</p>'),
                    $target = (options.codeTargetId && typeof options.codeTargetId === 'string') ? $('#' + options.codeTargetId) : false,
                    saveTxt = function () {
                        if ($target[0].nodeName.toLowerCase() === 'input') {
                            $target.val('<p>' + $txt.text() + '</p>');
                        } else {
                            $target.text('<p>' + $txt.text() + '</p>');
                        }
                    };

                //保存内容
                if ($target) {
                    $txt.click(saveTxt);
                    $txt.keyup(saveTxt);
                }

                //插入txt和说明
                this.append($lowBrowserInfo).append($txt);
            }
        });
        //该情况下就此结束，不再进行
        return;
    }

    //IE9+继续往下执行
    var
        pluginName = 'wangEditor',
        version = 'v1.0.0',
        updateTime = '2014/11/06',
        email = 'wangfupeng1988#163.com',
        githubUrl = 'https://github.com/wangfupeng1988/wangEditor/',

        i, item,

        //id前缀，避免和其他
        idPrefix = 'wangeditor_' + Math.random().toString().replace('.', '') + '_',

        ////字体配置
        //fontFamilyOptionsStr = '',
        //fontFamilyOptions = ['宋体', '黑体', '楷体', '隶书', '幼圆', '微软雅黑', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS'],

        ////颜色配置
        //colorOptionsStr = '',
        //bgColorOptionsStr = '',
        //colorOptions = {
        //    red: '红色',
        //    blue: '蓝色',
        //    green: '绿色',
        //    yellow: '黄色',
        //    black: '黑色',
        //    gray: '灰色',
        //    silver: '银色'
        //},
        ////字号配置
        //fontsizeOptionsStr = '',
        //fontsizeOptions = {
        //    1: '10px',
        //    2: '13px',
        //    3: '16px',
        //    4: '19px',
        //    5: '22px',
        //    6: '25px',
        //    7: '28px'
        //},
        ////循环中将要用到的变量
        //valueForLoop,


        /*——————————————————————linkFly重构代码——————————————————————*/
        toolTemplent = [
            '<li><a href="javascript:;" fontSize="${0}" style="font-size:${1}">${1}</a></li>',//fontSize
            '<li><a href="javascript:;" style="color:${0};">${1}</a></li>',//backgroundColor
            '<li><a href="javascript:;" style="font-family:${0}">${0}</a></li>'//fontFamily
        ],
        format = function (str, object) {
            /// <summary>
            ///     1: format(str,object) - 格式化一组字符串，参阅C# string.format()
            ///     &#10;    1.1 - format(str,object) - 通过对象格式化
            ///     &#10;    1.2 - format(str,Array) - 通过数组格式化
            /// </summary>
            /// <param name="str" type="String">
            ///     格式化模板(字符串模板)
            /// </param>
            /// <param name="object" type="Object">
            ///     Object:使用对象的key格式化字符串，模板中使用${name}占位：${data},${value}
            ///     Array:使用数组格式化，模板中使用${Index}占位：${0},${1}
            /// </param>
            /// <returns type="String" />
            var array = Array.prototype.slice.call(arguments, 1);
            //可以被\符转义
            return str.replace(/\\?\${([^{}]+)\}/gm, function (match, key) {
                //匹配转义符"\"
                if (match.charAt(0) == '\\')
                    return match.slice(1);
                var index = Number(key);
                if (index >= 0)
                    return array[index];
                return object[key] !== undefined ? object[key] : match;
            });
        },
        toolData =
        //尚有简化空间
        [
            ['fontFmalily',
                ['宋体', '黑体', '楷体', '隶书', '幼圆', '微软雅黑', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS'],
                function (i, value) {
                    return format(toolTemplent[2], value);
                }
            ],
            ['color', {
                red: '红色',
                blue: '蓝色',
                green: '绿色',
                yellow: '黄色',
                black: '黑色',
                gray: '灰色',
                silver: '银色'
            }, function (key, value) {
                return format(toolTemplent[1], key, value);
            }
            ],
            ['fontSize', ['10px', '13px', '16px', '19px', '22px', '25px', '28px'], function (key, value) {
                return format(toolTemplent[0], key, value);
            }]
        ];
    var HTMLtemplent = {}, tempStr = [], curr;
    //批量生成
    $.each(toolData, function (i, item) {
        curr = toolData[i];
        $.each(curr[1], function (name, value) {
            tempStr.push(curr[2](name, value));
        });
        HTMLtemplent[curr[0]] = tempStr.join('');
        tempStr.splice(0, tempStr.length);
        curr = null;
    });
    //为了兼容过去的代码，赋值到这些变量中
    var fontFamilyOptionsStr = HTMLtemplent.fontFmalily,
        colorOptionsStr = HTMLtemplent.color,
        //可以优化
        bgColorOptionsStr = HTMLtemplent.color.replace(/color/g, 'background-color'),
        fontsizeOptionsStr = HTMLtemplent.fontSize;

    /*——————————————————————linkFly重构代码——————————————————————*/

    ////生成字号 html li
    //for (item in fontsizeOptions) {
    //    if (Object.prototype.hasOwnProperty.call(fontsizeOptions, item)) {
    //        valueForLoop = fontsizeOptions[item];
    //        fontsizeOptionsStr += '<li><a href="#" fontSize="' + item + '" style="font-size:' + valueForLoop + ';">' + valueForLoop + '</a></li>';
    //    }
    //}
    ////生成前景色 html li
    //for (item in colorOptions) {
    //    if (Object.prototype.hasOwnProperty.call(colorOptions, item)) {
    //        valueForLoop = colorOptions[item];
    //        colorOptionsStr += '<li><a href="#" style="color:' + item + ';">' + valueForLoop + '</a></li>';
    //    }
    //}
    ////生成背景色 html li
    //for (item in colorOptions) {
    //    if (Object.prototype.hasOwnProperty.call(colorOptions, item)) {
    //        valueForLoop = colorOptions[item];
    //        bgColorOptionsStr += '<li><a href="#" style="background-color:' + item + '; color:white;">' + valueForLoop + '</a></li>';
    //    }
    //}
    ////生成字体 html li
    //for (i = 0; i < fontFamilyOptions.length; i++) {
    //    valueForLoop = fontFamilyOptions[i];
    //    fontFamilyOptionsStr += '<li><a href="#" style="font-family:' + valueForLoop + '">' + valueForLoop + '</a></li>';
    //}

    //制作jquery插件
    jQuery.fn.extend({
        wangEditor: function (options) {

            //options: { codeTargetId:'txt1', frameHeight:'300px', initWords:'请输入文字...', showInfo:true/false }

            var
                //menu container
                $menuContainer = $('<div></div>'),

                //menu toolbar===================================================start
                $menuToolbar = $('<div class="btn-toolbar"></div>'),

                //btn-group （用于clone）
                $btnGroup = $('<div class="btn-group"></div>'),

                //模板方法：生成button标签
                // title: button标题
                // iconClass: button中的图标样式
                // isDropdown: 是否关联下来菜单
                // modalTarget: 弹出层的id
                // btnContent: 自定义button内部的内容，取代 <i icon>
                btnTemp = function (title, iconClass, isDropdown, modalTarget, btnContent) {

                    var temp = '',
                        btnClass = 'btn';

                    //验证
                    if (!title || typeof title !== 'string') {
                        throw new Error('wangEditor_btnTemp：必须传入title参数，而且title必须是字符串类型！');
                        return;
                    }
                    if ((!iconClass || typeof iconClass !== 'string') && !btnContent) {
                        throw new Error('wangEditor_btnTemp：必须传入iconClass参数，而且iconClass必须是字符串类型！');
                        return;
                    }
                    isDropdown = !!isDropdown;
                    if (isDropdown) {
                        btnClass = 'btn dropdown-toggle';
                    }
                    if (modalTarget && typeof modalTarget !== 'string') {
                        throw new Error('wangEditor_btnTemp：传入的modalTarget参数必须是字符串类型！');
                        return;
                    }

                    // <button>
                    temp += '<button title="' + title + '" class="' + btnClass + '" ';
                    if (isDropdown) {
                        temp += ' data-toggle="dropdown" ';
                    }
                    if (modalTarget) {
                        temp += ' data-target="' + modalTarget + '" data-backdrop="false"  data-toggle="modal" ';
                    }
                    temp += '>';

                    // button 内容
                    if (btnContent && typeof btnContent === 'string') {
                        //自定义内容，代替 <i (icon)>
                        temp += btnContent;
                    } else {
                        // <i (icon)>
                        temp += '<i class="' + iconClass + '">';
                    }

                    // <span (caret)> 
                    if (isDropdown) {
                        temp += '<span class="caret"></span>';
                    }

                    // </button>
                    temp += '</button>';

                    return temp;
                },

                //模板方法：生成dropdown menu ul
                // headerText: 标题
                // content: 菜单内容
                dropdownMenuTemp = function (headerText, content) {

                    //验证
                    if (!content || typeof content !== 'string') {
                        throw new Error('wangEditor_dropdownMenuTemp：content参数不能为空，且必须为字符串类型！');
                        return;
                    }

                    var temp = '';

                    temp += '<ul class="dropdown-menu">';
                    if (headerText && typeof headerText === 'string') {
                        temp += '<li class="nav-header">' + headerText + '</li>';
                    }
                    temp += content;
                    temp += '</ul>';

                    return temp;
                },

                //粗体、斜体、下划线
                $btnGroup_bold = $btnGroup.clone(),
                $menuBold = $(btnTemp('加粗', 'icon-bold')),
                $menuItalic = $(btnTemp('斜体', 'icon-italic')),
                $menuUnderline = $(btnTemp('下划线', 'icon-underline')),
                _nodata = $btnGroup_bold.append($menuBold).append($menuItalic).append($menuUnderline),

                //字号
                $btnGroup_fontsize = $btnGroup.clone(),
                $menuFontsize = $(btnTemp('字号', 'icon-text-height', true)),
                $dropdownMenuFontsize = $(dropdownMenuTemp('字号：', fontsizeOptionsStr)),
                _nodata = $btnGroup_fontsize.append($menuFontsize).append($dropdownMenuFontsize),

                //字体
                $btnGroup_fontfamily = $btnGroup.clone(),
                $menuFontFamily = $(btnTemp('字体', 'icon-font', true)),
                $dropdownMenuFontFamily = $(dropdownMenuTemp('字体：', fontFamilyOptionsStr)),
                _nodata = $btnGroup_fontfamily.append($menuFontFamily).append($dropdownMenuFontFamily),

                //前景色
                $btnGroup_fontColor = $btnGroup.clone(),
                $menuFontColor = $(btnTemp('前景色', null, true, null, '<b style="color:red;">A</b>')),
                $dropdownMenuFontColor = $(dropdownMenuTemp('前景色：', colorOptionsStr)),
                _nodata = $btnGroup_fontColor.append($menuFontColor).append($dropdownMenuFontColor),

                //背景色
                $btnGroup_bgColor = $btnGroup.clone(),
                $menubgColor = $(btnTemp('背景色', null, true, null, '<b style="background-color:blue;color:white;">&nbsp;A&nbsp;</b>')),
                $dropdownMenuBgColor = $(dropdownMenuTemp('背景色：', bgColorOptionsStr)),
                _nodata = $btnGroup_bgColor.append($menubgColor).append($dropdownMenuBgColor),

                //列表
                $btnGroup_list = $btnGroup.clone(),
                $menuOrderedList = $(btnTemp('有序列表', 'icon-list-ol')),
                $menuUnorderedList = $(btnTemp('无序列表', 'icon-list-ul')),
                _nodata = $btnGroup_list.append($menuUnorderedList).append($menuOrderedList),

                //对齐
                $btnGroup_align = $btnGroup.clone(),
                $menuAlignLeft = $(btnTemp('左对齐', 'icon-align-left')),
                $menuAlignCenter = $(btnTemp('居中', 'icon-align-center')),
                $menuAlignRight = $(btnTemp('右对齐', 'icon-align-right')),
                _nodata = $btnGroup_align.append($menuAlignLeft).append($menuAlignCenter).append($menuAlignRight),

                //链接
                $btnGroup_link = $btnGroup.clone(),
                linkModalId = idPrefix + 'LinkModal',
                $menuLink = $(btnTemp('链接', 'icon-link', false, '#' + linkModalId)),
                $menuRemoveLink = $(btnTemp('删除链接', 'icon-remove')),
                _nodata = $btnGroup_link.append($menuLink).append($menuRemoveLink),

                //图片
                $btnGroup_img = $btnGroup.clone(),
                imgModalId = idPrefix + 'imgModal',
                $menuImg = $(btnTemp('插入图片', 'icon-picture', false, '#' + imgModalId)),
                _nodata = $btnGroup_img.append($menuImg),

                //撤销、恢复
                $btnGroup_undo = $btnGroup.clone(),
                $menuUndo = $(btnTemp('撤销', 'icon-undo')),
                $menuRedo = $(btnTemp('恢复', 'icon-repeat')),
                _nodata = $btnGroup_undo.append($menuUndo).append($menuRedo),

                //关于
                $btnGroup_info = $btnGroup.clone(),
                infoModalId = idPrefix + 'infoModal',
                $menuInfo = $(btnTemp('关于', 'icon-info-sign', false, '#' + infoModalId)),
                _nodata = $btnGroup_info.append($menuInfo),
                //menu toolbar===================================================end

                //menu modal===================================================start
                $menuModal = $('<div></div>'),

                //模板方法：生成modal层
                // id: id
                // title: 标题，字符串
                // bodyContents: 要加入body中的内容，数组
                // footerContents: 底部内容，数组
                modalTemp = function (id, title, bodyContents, footerContents) {
                    //验证
                    if (!id || typeof id !== 'string') {
                        throw new Error('wangEditor_modalTemp: id参数不能为空，且必须为字符串类型');
                        return;
                    }
                    if (!title || typeof title !== 'string') {
                        throw new Error('wangEditor_modalTemp: title参数不能为空，且必须为字符串类型');
                        return;
                    }

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
                $linkModal,
                //插入图片 modal
                $imgModal,
                //关于 modal
                $infoModal,
                //menu modal===================================================end

                //iframe container==========================================start
                iframeHeight = options.frameHeight || '300px',
                $iframeContainer = $('<div style="width: 100%; height: ' + iframeHeight + '; border: 1px solid #cccccc;"></div>'),
                $iframe = $('<iframe frameborder="0" width="100%" height="100%"></iframe>'),
                initWords = options.initWords || '请输入...',
                _nodata = $iframeContainer.append($iframe),

                iframeWindow,
                $iframeWindow,
                iframeDocument,
                $iframeDocument,
                $codeTarget,  //代码存储的目标（通过 $(options.codeTargetId) 获取）

                //记录当前选择的内容，有时需要恢复
                currentSelectionData;
            //iframe container==========================================end


            //插入 menu toolbar（注意，各组的顺序可调整）：==============start
            //字体
            $menuToolbar.append($btnGroup_fontfamily);
            //字号
            $menuToolbar.append($btnGroup_fontsize);
            //粗体、斜体、下划线
            $menuToolbar.append($btnGroup_bold);
            //前景色
            $menuToolbar.append($btnGroup_fontColor);
            //背景色
            $menuToolbar.append($btnGroup_bgColor);
            //列表
            $menuToolbar.append($btnGroup_list);
            //对齐
            $menuToolbar.append($btnGroup_align);
            //链接
            $menuToolbar.append($btnGroup_link);
            //图片
            $menuToolbar.append($btnGroup_img);
            //撤销、恢复
            $menuToolbar.append($btnGroup_undo);
            //关于
            if (options.showInfo) {
                $menuToolbar.append($btnGroup_info);
            }

            //插入 menu toolbar
            $menuContainer.append($menuToolbar);

            //menu tooltip 效果
            $menuContainer.find('button').tooltip();
            //插入 ======================================================end

            //插入menu modal ==================================start
            //插入链接 modal
            var $linkModalBody_desc = $('<p>链接地址：</p>'),
                $linkModalBody_txtUrl = $('<input type="text" placeholder="http(s)://" class="input-block-level"/>'),
                $linkModalBody_target = $('<p>链接目标：</p>'),
                $linkModalBody_sltTarget = $('<select><option>_blank</option><option>_self</option></select>'),
                linkModalBodyContents = [$linkModalBody_desc, $linkModalBody_txtUrl, $linkModalBody_target, $linkModalBody_sltTarget],

                $linkModalFooter_save = $('<a href="#" class="btn btn-primary">插入链接</a>'),
                linkModalFooterContents = [$linkModalFooter_save];
            $linkModal = modalTemp(linkModalId, '插入链接', linkModalBodyContents, linkModalFooterContents);

            //插入图片 modal
            var $imgModalBody_desc = $('<p>输入图片URL地址：</p>'),
                $imgModalBody_txtUrl = $('<input type="text" placeholder="http(s)://" class="input-block-level"/>'),
                imgModalBodyContents = [$imgModalBody_desc, $imgModalBody_txtUrl],

                $imgModalFooter_save = $('<a href="#" class="btn btn-primary">插入</a>'),
                imgModalFooterContents = [$imgModalFooter_save];
            $imgModal = modalTemp(imgModalId, '插入图片', imgModalBodyContents, imgModalFooterContents);

            //关于 modal
            var $infoModalBody_info = $(
                    '<p>当前版本：' + version + '</p>' +
                    '<p>更新日期：' + updateTime + '</p>' +
                    '<p>联系我们：' + email + '（#换成@）</p>' +
                    '<p>获取代码：<a href="' + githubUrl + '" target="_blank">' + githubUrl + '</a></p>'
                ),
                infoModalBodyContents = [$infoModalBody_info];
            $infoModal = modalTemp(infoModalId, pluginName, infoModalBodyContents);

            //插入 menu modal
            $menuModal.append($linkModal).append($imgModal).append($infoModal);
            $menuContainer.append($menuModal);
            //插入menu modal ==================================end


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
                                    '<body><p>' + initWords + '</p></body>' +
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

            //获取iframe中的代码，保存到options.codeTargetId中
            function saveIframeCode() {
                if (!$codeTarget) {
                    if (!options || !options.codeTargetId || typeof options.codeTargetId !== 'string') {
                        return;
                    }
                    var $target = $('#' + options.codeTargetId);
                    if ($target.length === 0) {
                        return;
                    }
                }

                if ($target[0].nodeName.toLowerCase() === 'input') {
                    $target.val(iframeDocument.body.innerHTML);
                } else {
                    $target.text(iframeDocument.body.innerHTML);
                }
            }

            //失去焦点时，及时记录文字内容
            $iframeWindow.blur(saveIframeCode);
            //配置 iframe ==================================end


            //监听选中文字的样式=============================start
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

                //是否加粗
                if (iframeDocument.queryCommandState('bold')) {
                    $menuBold.addClass('btn-primary');
                } else {
                    $menuBold.removeClass('btn-primary');
                }
                //是否斜体
                if (iframeDocument.queryCommandState('italic')) {
                    $menuItalic.addClass('btn-primary');
                } else {
                    $menuItalic.removeClass('btn-primary');
                }
                //是否下划线
                if (iframeDocument.queryCommandState('underline')) {
                    $menuUnderline.addClass('btn-primary');
                } else {
                    $menuUnderline.removeClass('btn-primary');
                }
                //是否左对齐
                if (iframeDocument.queryCommandState('JustifyLeft')) {
                    $menuAlignLeft.addClass('btn-primary');
                } else {
                    $menuAlignLeft.removeClass('btn-primary');
                }
                //是否居中
                if (iframeDocument.queryCommandState('JustifyCenter')) {
                    $menuAlignCenter.addClass('btn-primary');
                } else {
                    $menuAlignCenter.removeClass('btn-primary');
                }
                //是否右对齐
                if (iframeDocument.queryCommandState('JustifyRight')) {
                    $menuAlignRight.addClass('btn-primary');
                } else {
                    $menuAlignRight.removeClass('btn-primary');
                }
                //是否是列表
                if (iframeDocument.queryCommandState('InsertOrderedList')) {
                    $menuOrderedList.addClass('btn-primary');
                } else {
                    $menuOrderedList.removeClass('btn-primary');
                }
                if (iframeDocument.queryCommandState('InsertUnorderedList')) {
                    $menuUnorderedList.addClass('btn-primary');
                } else {
                    $menuUnorderedList.removeClass('btn-primary');
                }
                //记录当前的选择内容
                currentSelectionData = iframeDocument.getSelection().getRangeAt(0);
            }
            //添加监听事件
            $iframeDocument.click(iframeListener);
            $iframeDocument.keyup(iframeListener);
            //监听选中文字的样式=============================end


            //菜单操作 =========================================start
            //加粗
            $menuBold.click(function () {
                iframeDocument.execCommand('bold');

                if (iframeDocument.queryCommandState('bold')) {
                    $menuBold.addClass('btn-primary');
                } else {
                    $menuBold.removeClass('btn-primary');
                }
            });
            //斜线
            $menuItalic.click(function () {
                iframeDocument.execCommand('italic');
                if (iframeDocument.queryCommandState('italic')) {
                    $menuItalic.addClass('btn-primary');
                } else {
                    $menuItalic.removeClass('btn-primary');
                }
            });
            //下划线
            $menuUnderline.click(function () {
                iframeDocument.execCommand('Underline');

                if (iframeDocument.queryCommandState('Underline')) {
                    $menuUnderline.addClass('btn-primary');
                } else {
                    $menuUnderline.removeClass('btn-primary');
                }
            });
            //前景色
            $dropdownMenuFontColor.find('a').each(function () {
                var menuColor = $(this),
                    value = this.style.color;
                menuColor.click(function (e) {
                    iframeDocument.execCommand('ForeColor', false, value);
                    e.preventDefault();
                });
            });
            //背景色
            $dropdownMenuBgColor.find('a').each(function () {
                var menuBgColor = $(this),
                    value = this.style.backgroundColor;
                menuBgColor.click(function (e) {
                    iframeDocument.execCommand('backColor', false, value);
                    e.preventDefault();
                });
            });
            //字体
            $dropdownMenuFontFamily.find('a').each(function () {
                var menuFamily = $(this),
                    value = menuFamily.css('font-family');
                menuFamily.click(function (e) {
                    iframeDocument.execCommand('FontName', false, value);
                    e.preventDefault();
                });
            });
            //字号
            $dropdownMenuFontsize.find('a').each(function () {
                var menuFontSize = $(this),
                    value = menuFontSize.attr('fontSize');
                menuFontSize.click(function (e) {
                    iframeDocument.execCommand('FontSize', false, value);
                    e.preventDefault();
                });
            });
            //插入链接
            $linkModalFooter_save.click(function (e) {
                var selection = iframeDocument.getSelection(),
                    url = $linkModalBody_txtUrl.val(),
                    target = $linkModalBody_sltTarget.val();

                //恢复当前的选择内容（for IE,Opera）
                if (!selection || selection.anchorOffset === 0) {
                    selection.removeAllRanges();
                    selection.addRange(currentSelectionData);
                }

                iframeDocument.execCommand('createLink', false, url);
                e.preventDefault();
                $linkModal.modal('hide');
            });
            //移除链接
            $menuRemoveLink.click(function () {
                iframeDocument.execCommand('unlink');
            });
            //插入图片
            $imgModalFooter_save.click(function (e) {
                var selection = iframeDocument.getSelection(),
                    url = $imgModalBody_txtUrl.val();

                //恢复当前的选择内容（for IE,Opera）
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(currentSelectionData);
                }

                iframeDocument.execCommand('insertImage', false, url)
                e.preventDefault();
                $imgModal.modal('hide');
            });
            //左对齐
            $menuAlignLeft.click(function () {
                iframeDocument.execCommand('JustifyLeft');

                if (iframeDocument.queryCommandState('JustifyLeft')) {
                    $menuAlignLeft.addClass('btn-primary');
                } else {
                    $menuAlignLeft.removeClass('btn-primary');
                }
            });
            //居中
            $menuAlignCenter.click(function () {
                iframeDocument.execCommand('JustifyCenter');

                if (iframeDocument.queryCommandState('JustifyCenter')) {
                    $menuAlignCenter.addClass('btn-primary');
                } else {
                    $menuAlignCenter.removeClass('btn-primary');
                }
            });
            //右对齐
            $menuAlignRight.click(function () {
                iframeDocument.execCommand('JustifyRight');

                if (iframeDocument.queryCommandState('JustifyRight')) {
                    $menuAlignRight.addClass('btn-primary');
                } else {
                    $menuAlignRight.removeClass('btn-primary');
                }
            });
            //列表
            $menuOrderedList.click(function () {
                iframeDocument.execCommand('InsertOrderedList');
            });
            $menuUnorderedList.click(function () {
                iframeDocument.execCommand('InsertUnorderedList');
            });
            //撤销
            $menuUndo.click(function () {
                iframeDocument.execCommand('Undo');
            });
            $menuRedo.click(function () {
                iframeDocument.execCommand('Redo');
            });
            //及时记录code变化
            $menuContainer.click(function () {
                saveIframeCode();
            });
            //菜单操作 =========================================end
        }
    });

})(window.jQuery, window);