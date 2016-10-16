// 编辑器区域 img toolbar
_e(function (E, $) {

    if (E.userAgent.indexOf('MSIE 8') > 0) {
        return;
    }
    
    E.plugin(function () {
        var editor = this;
        var lang = editor.config.lang;
        var txt = editor.txt;
        var $txt = txt.$txt;
        var html = '';
        // 说明：设置了 max-height 之后，$txt.parent() 负责滚动处理
        var $currentTxt = editor.useMaxHeight ? $txt.parent() : $txt;
        var $editorContainer = editor.$editorContainer;
        var $currentImg;
        var currentLink = '';

        // 用到的dom节点
        var isRendered = false;
        var $dragPoint = $('<div class="img-drag-point"></div>');

        var $toolbar = $('<div class="txt-toolbar"></div>');
        var $triangle = $('<div class="tip-triangle"></div>');

        var $menuContainer = $('<div></div>');
        var $delete = $('<a href="#"><i class="wangeditor-menu-img-trash-o"></i></a>');
        var $zoomSmall = $('<a href="#"><i class="wangeditor-menu-img-search-minus"></i></a>');
        var $zoomBig = $('<a href="#"><i class="wangeditor-menu-img-search-plus"></i></a>');
        // var $floatLeft = $('<a href="#"><i class="wangeditor-menu-img-align-left"></i></a>');
        // var $noFloat = $('<a href="#"><i class="wangeditor-menu-img-align-justify"></i></a>');
        // var $floatRight = $('<a href="#"><i class="wangeditor-menu-img-align-right"></i></a>');
        var $alignLeft = $('<a href="#"><i class="wangeditor-menu-img-align-left"></i></a>');
        var $alignCenter = $('<a href="#"><i class="wangeditor-menu-img-align-center"></i></a>');
        var $alignRight = $('<a href="#"><i class="wangeditor-menu-img-align-right"></i></a>');
        var $link = $('<a href="#"><i class="wangeditor-menu-img-link"></i></a>');
        var $unLink = $('<a href="#"><i class="wangeditor-menu-img-unlink"></i></a>');

        var $linkInputContainer = $('<div style="display:none;"></div>');
        var $linkInput = $('<input type="text" style="height:26px; margin-left:10px; width:200px;"/>');
        var $linkBtnSubmit = $('<button class="right">' + lang.submit + '</button>');
        var $linkBtnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

        // 记录是否正在拖拽
        var isOnDrag = false;

        // 获取 / 设置 链接
        function imgLink(e, url) {
            if (!$currentImg) {
                return;
            }
            var commandFn;
            var callback = function () {
                // 及时保存currentLink
                if (url != null) {
                    currentLink = url;
                }
                if (html !== $txt.html()) {
                    $txt.change();
                }
            };
            var $link;
            var inLink = false;
            var $parent = $currentImg.parent();
            if ($parent.get(0).nodeName.toLowerCase() === 'a') {
                // 父元素就是图片链接
                $link = $parent;
                inLink = true;
            } else {
                // 父元素不是图片链接，则重新创建一个链接
                $link = $('<a target="_blank"></a>');
            }

            if (url == null) {
                // url 无值，是获取链接
                return $link.attr('href') || '';
            } else if (url === '') {
                // url 是空字符串，是取消链接
                if (inLink) {
                    commandFn = function () {
                        $currentImg.unwrap();
                    };
                }
            } else {
                // url 有值，是设置链接
                if (url === currentLink) {
                    return;
                }
                commandFn = function () {
                    $link.attr('href', url);

                    if (!inLink) {
                        // 当前图片未包含在链接中，则包含进来
                        $currentImg.wrap($link);
                    }
                };
            }

            // 执行命令
            if (commandFn) {
                // 记录下执行命令之前的html内容
                html = $txt.html();
                // 执行命令
                editor.customCommand(e, commandFn, callback);
            }
        }

        // 渲染到页面
        function render() {
            if (isRendered) {
                return;
            }
            
            // 绑定事件
            bindToolbarEvent();
            bindDragEvent();

            // 菜单放入 container
            $menuContainer.append($delete)
                            .append($zoomSmall)
                            .append($zoomBig)
                            // .append($floatLeft)
                            // .append($noFloat)
                            // .append($floatRight);
                            .append($alignLeft)
                            .append($alignCenter)
                            .append($alignRight)
                            .append($link)
                            .append($unLink);

            // 链接input放入container
            $linkInputContainer.append($linkInput)
                               .append($linkBtnCancel)
                               .append($linkBtnSubmit);

            // 拼接 渲染到页面上
            $toolbar.append($triangle)
                    .append($menuContainer)
                    .append($linkInputContainer);
                    
            editor.$editorContainer.append($toolbar).append($dragPoint);
            isRendered = true;
        }

        // 绑定toolbar事件
        function bindToolbarEvent() {
            // 统一执行命令的方法
            var commandFn;
            function customCommand(e, callback) {
                var cb;
                // 记录下执行命令之前的html内容
                html = $txt.html();
                cb = function () {
                    if (callback) {
                        callback();
                    }
                    if (html !== $txt.html()) {
                        $txt.change();
                    }
                };
                // 执行命令
                if (commandFn) {
                    editor.customCommand(e, commandFn, cb);
                }
            }

            // 删除
            $delete.click(function (e) {
                // 删除之前先unlink
                imgLink(e, '');

                // 删除图片
                commandFn = function () {
                    $currentImg.remove();
                };
                customCommand(e, function () {
                    setTimeout(hide, 100);
                });
            });

            // 放大
            $zoomBig.click(function (e) {
                commandFn = function () {
                    var img = $currentImg.get(0);
                    var width = img.width;
                    var height = img.height;
                    width = width * 1.1;
                    height = height * 1.1;

                    $currentImg.css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                };
                customCommand(e, function () {
                    setTimeout(show);
                });
            });

            // 缩小
            $zoomSmall.click(function (e) {
                commandFn = function () {
                    var img = $currentImg.get(0);
                    var width = img.width;
                    var height = img.height;
                    width = width * 0.9;
                    height = height * 0.9;

                    $currentImg.css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                };
                customCommand(e, function () {
                    setTimeout(show);
                });
            });

            // // 左浮动
            // $floatLeft.click(function (e) {
            //     commandFn = function () {
            //         $currentImg.css({
            //             float: 'left'
            //         });
            //     };
            //     customCommand(e, function () {
            //         setTimeout(hide, 100);
            //     });
            // });

            // alignLeft
            $alignLeft.click(function (e) {
                commandFn = function () {
                    // 如果 img 增加了链接，那么 img.parent() 就是 a 标签，设置 align 没用的，因此必须找到 P 父节点来设置 align
                    $currentImg.parents('p').css({
                        'text-align': 'left'
                    }).attr('align', 'left');
                };
                customCommand(e, function () {
                    setTimeout(hide, 100);
                });
            });

            // // 右浮动
            // $floatRight.click(function (e) {
            //     commandFn = function () {
            //         $currentImg.css({
            //             float: 'right'
            //         });
            //     };
            //     customCommand(e, function () {
            //         setTimeout(hide, 100);
            //     });
            // });

            // alignRight
            $alignRight.click(function (e) {
                commandFn = function () {
                    // 如果 img 增加了链接，那么 img.parent() 就是 a 标签，设置 align 没用的，因此必须找到 P 父节点来设置 align
                    $currentImg.parents('p').css({
                        'text-align': 'right'
                    }).attr('align', 'right');
                };
                customCommand(e, function () {
                    setTimeout(hide, 100);
                });
            });

            // // 无浮动
            // $noFloat.click(function (e) {
            //     commandFn = function () {
            //         $currentImg.css({
            //             float: 'none'
            //         });
            //     };
            //     customCommand(e, function () {
            //         setTimeout(hide, 100);
            //     });
            // });

            // alignCenter
            $alignCenter.click(function (e) {
                commandFn = function () {
                    // 如果 img 增加了链接，那么 img.parent() 就是 a 标签，设置 align 没用的，因此必须找到 P 父节点来设置 align
                    $currentImg.parents('p').css({
                        'text-align': 'center'
                    }).attr('align', 'center');
                };
                customCommand(e, function () {
                    setTimeout(hide, 100);
                });
            });

            // link
            // 显示链接input
            $link.click(function (e) {
                e.preventDefault();

                // 获取当前链接，并显示
                currentLink = imgLink(e);
                $linkInput.val(currentLink);

                $menuContainer.hide();
                $linkInputContainer.show();
            });
            // 设置链接
            $linkBtnSubmit.click(function (e) {
                e.preventDefault();

                var url = $.trim($linkInput.val());
                if (url) {
                    // 设置链接，同时会自动更新 currentLink 的值
                    imgLink(e, url);
                }

                // 隐藏 toolbar
                setTimeout(hide);
            });
            // 取消设置链接
            $linkBtnCancel.click(function (e) {
                e.preventDefault();

                // 重置链接 input
                $linkInput.val(currentLink);

                $menuContainer.show();
                $linkInputContainer.hide();
            });

            // unlink
            $unLink.click(function (e) {
                e.preventDefault();

                // 执行 unlink
                imgLink(e, '');

                // 隐藏 toolbar
                setTimeout(hide);
            });
        }

        // 绑定drag事件
        function bindDragEvent() {
            var _x, _y;
            var dragMarginLeft, dragMarginTop;
            var imgWidth, imgHeight;

            function mousemove (e) {
                var diffX, diffY;

                // 计算差额
                diffX = e.pageX - _x;
                diffY = e.pageY - _y;

                // --------- 计算拖拽点的位置 ---------
                var currentDragMarginLeft = dragMarginLeft + diffX;
                var currentDragMarginTop = dragMarginTop + diffY;
                $dragPoint.css({
                    'margin-left': currentDragMarginLeft,
                    'margin-top': currentDragMarginTop
                });

                // --------- 计算图片的大小 ---------
                var currentImgWidth = imgWidth + diffX;
                var currentImggHeight = imgHeight + diffY;
                $currentImg && $currentImg.css({
                    width: currentImgWidth,
                    height: currentImggHeight
                });
            }

            $dragPoint.on('mousedown', function(e){
                if (!$currentImg) {
                    return;
                }
                // 当前鼠标位置
                _x = e.pageX;
                _y = e.pageY;

                // 当前拖拽点的位置
                dragMarginLeft = parseFloat($dragPoint.css('margin-left'), 10);
                dragMarginTop = parseFloat($dragPoint.css('margin-top'), 10);

                // 当前图片的大小
                imgWidth = $currentImg.width();
                imgHeight = $currentImg.height();

                // 隐藏 $toolbar
                $toolbar.hide();

                // 绑定计算事件
                E.$document.on('mousemove._dragResizeImg', mousemove);
                E.$document.on('mouseup._dragResizeImg', function (e) {
                    // 取消绑定
                    E.$document.off('mousemove._dragResizeImg');
                    E.$document.off('mouseup._dragResizeImg');

                    // 隐藏，并还原拖拽点的位置
                    hide();
                    $dragPoint.css({
                        'margin-left': dragMarginLeft,
                        'margin-top': dragMarginTop
                    });

                    // 记录
                    isOnDrag = false;
                });

                // 记录
                isOnDrag = true;
            });
        }

        // 显示 toolbar
        function show() {
            if (editor._disabled) {
                // 编辑器已经被禁用，则不让显示
                return;
            }
            if ($currentImg == null) {
                return;
            }
            $currentImg.addClass('clicked');
            var imgPosition = $currentImg.position();
            var imgTop = imgPosition.top;
            var imgLeft = imgPosition.left;
            var imgHeight = $currentImg.outerHeight();
            var imgWidth = $currentImg.outerWidth();


            // --- 定位 dragpoint ---
            $dragPoint.css({
                top: imgTop + imgHeight,
                left: imgLeft + imgWidth
            });

            // --- 定位 toolbar ---

            // 计算初步结果
            var top = imgTop + imgHeight;
            var left = imgLeft;
            var marginLeft = 0;

            var txtTop = $currentTxt.position().top;
            var txtHeight = $currentTxt.outerHeight();
            if (top > (txtTop + txtHeight)) {
                // top 不得超出编辑范围
                top = txtTop + txtHeight;
            } else {
                // top 超出编辑范围，dragPoint就不显示了
                $dragPoint.show();
            }

            // 显示（方便计算 margin）
            $toolbar.show();

            // 计算 margin
            var width = $toolbar.outerWidth();
            marginLeft = imgWidth / 2 - width / 2;

            // 定位
            $toolbar.css({
                top: top + 5,
                left: left,
                'margin-left': marginLeft
            });
            // 如果定位太靠左了
            if (marginLeft < 0) {
                // 得到三角形的margin-left
                $toolbar.css('margin-left', '0');
                $triangle.hide();
            } else {
                $triangle.show();
            }

            // disable 菜单
            editor.disableMenusExcept();
        }
        
        // 隐藏 toolbar
        function hide() {
            if ($currentImg == null) {
                return;
            }
            $currentImg.removeClass('clicked');
            $currentImg = null;

            $toolbar.hide();
            $dragPoint.hide();

            // enable 菜单
            editor.enableMenusExcept();
        }

        // 判断img是否是一个表情
        function isEmotion(imgSrc) {
            var result = false;
            if (!editor.emotionUrls) {
                return result;
            }
            $.each(editor.emotionUrls, function (index, url) {
                var flag = false;
                if (imgSrc === url) {
                    result = true;
                    flag = true;
                }
                if (flag) {
                    return false;  // break 循环
                }
            });
            return result;
        }

        // click img 事件
        $currentTxt.on('mousedown', 'img', function (e) {
            e.preventDefault();
        }).on('click', 'img', function (e) {
            var $img = $(e.currentTarget);
            var src = $img.attr('src');

            if (!src || isEmotion(src)) {
                // 是一个表情图标
                return;
            }

            // ---------- 不是表情图标 ---------- 

            // 渲染
            render();

            if ($currentImg && ($currentImg.get(0) === $img.get(0))) {
                setTimeout(hide, 100);
                return;
            }

            // 显示 toolbar
            $currentImg = $img;
            show();

            // 默认显示menuContainer，其他默认隐藏
            $menuContainer.show();
            $linkInputContainer.hide();

            // 阻止冒泡
            e.preventDefault();
            e.stopPropagation();
            
        }).on('click keydown scroll', function (e) {
            if (!isOnDrag) {
                setTimeout(hide, 100);
            }
        });

    });

});