$.extend($E, {

    //创建一个菜单组
    'createMenuGroup': function(menuGroup, editor){
        if(menuGroup instanceof Array === false){
            return;
        }
        var $group = $( $E.htmlTemplates.btnContainerGroup );
        $.each(menuGroup, function(key, menuId){
            //遍历这个菜单组，创建每一个菜单
            var btn = $E.createMenu(menuId, editor);
            if(btn instanceof Array){
                $.each(btn, function(key, value){
                    $group.append(value);
                });
            }else{
                $group.append(btn);
            }
        });
        //插入这个菜单组
        editor.insertMenuGroup($group);
    },
    
    //创建一个菜单
    'createMenu': function(menu, editor){
        //验证
        if(menu == null){
            return;
        }
        menu = $.trim( menu.toString() );
        menu = editor.menus[menu];
        if(!menu){
            return;
        }

        var title = menu.title,
            type = menu.type,
            cssClass = menu.cssClass,
            txt,
            style = menu.style,
            command = menu.command,  //函数或者字符串
            commandValue = menu.commandValue, //字符串或者undefined
            hotKey = menu.hotKey, //快捷键
            fnKeys = [],
            keyCode,
            beforeFn = menu.beforeFn,  //在menus配置文件中定义的，点击按钮之前的事件
            $dropMenu = menu.dropMenu && menu.dropMenu(),
            $dropPanel = menu.dropPanel && menu.dropPanel(editor),
            $modal = menu.modal && menu.modal(editor),
            callback = menu.callback,
            $btn = $( $E.htmlTemplates.btn ),  
            resultArray = [$btn],

            //将在下文定义的函数
            btnClick,
            isFnKeys,
            hideDropMenu,
            hideDropPanel,
            showToolTip,

            $editorContainer = editor.$editorContainer;

        if(typeof command === 'string'){
            command = $.trim(command);
        }

        //btn txt
        if(style){
            txt = '<i class="' + cssClass + '" style="' + style + '"></i>';
        }else{
            txt = '<i class="' + cssClass + '"></i>';
        }
        $btn.html(txt);

        //btn title
        if(title){
            $btn.attr('title', title);
        }

        //普通按钮
        if(type === 'btn'){
            //记录commandName
            if(typeof command === 'string'){
                $btn.attr('commandName', command);
            }

            //基本命令（command是字符串）
            if(typeof command === 'string'){
                btnClick = function(e){
                    editor.hideModal();   //先视图隐藏目前显示的modal
                    //执行操作
                    editor.command(e, command, commandValue, callback);

                    e.stopPropagation();  //最后阻止冒泡
                };
            }
            //自定义命令（command是函数）
            if(typeof command === 'function'){
                btnClick = function(e){
                    editor.hideModal();   //先视图隐藏目前显示的modal
                    
                    command(e);  //如果command是函数，则直接执行command
                    
                    e.stopPropagation();  //最后阻止冒泡
                };
            }
            if(hotKey){
                //快捷键
                hotKey = hotKey.toLowerCase();
                keyCode = $.trim( hotKey.split('+')[1] );
                fnKeys = hotKey.split('+')[0].split(',');
                $.each(fnKeys, function(key, value){
                    fnKeys[key] = $.trim(value);
                });
                isFnKeys = function(e){
                    //判断功能键，暂时支持 ['ctrl', 'shift', 'alt', 'meta']
                    var flag = true;
                    $.each(['ctrl', 'shift', 'alt', 'meta'], function(key, value){
                        if(fnKeys.indexOf(value) !== -1 && !e[value + 'Key']){
                            flag = false;
                        }else if(fnKeys.indexOf(value) === -1 && e[value + 'Key']){
                            flag = false;
                        }
                    });
                    return flag;
                };
                editor.bindEventFor$txt('keydown', function(e){
                    if(isFnKeys(e) === false){
                        return;
                    }
                    if( String.fromCharCode(e.keyCode).toLowerCase() === keyCode ){
                        e.preventDefault();
                        $btn.click();  //通过模拟按钮点击的方式触发
                    }
                });
            }
        }
        //下拉菜单
        else if(type === 'dropMenu'){
            $btn.append($( $E.htmlTemplates.btnAngleDown ));  //btn后面的下拉箭头

            //渲染下拉菜单
            resultArray.unshift($dropMenu);

            hideDropMenu = function(){
                $dropMenu.hide();
            };
            btnClick = function(e){
                editor.hideModal();   //先视图隐藏目前显示的modal

                $dropMenu.css('display', 'inline-block');
                e.preventDefault();
                $btn.focus();  //for 360急速浏览器
                
                e.stopPropagation();  //最后阻止冒泡
            };
            $btn.blur(function(e){
                setTimeout(hideDropMenu, 200);  //待执行完命令（等待200ms），再隐藏
            });

            //命令（使用事件代理）
            $dropMenu.on('click', 'a[commandValue], a[customCommandName]', function(e){
                var $this = $(this),
                    value = $this.attr('commandValue'),
                    commandName = $this.attr('customCommandName');

                //下拉菜单类型中，有些可能每个菜单的commandName不同，例如列表、对齐方式
                if(commandName){
                    command = commandName;
                }
                
                editor.command(e, command, value, callback);
            });

            hideDropMenu();  //刚加载时先隐藏起来
        }
        //下拉面板
        else if(type === 'dropPanel'){
            //渲染下拉面板
            resultArray.unshift($dropPanel);

            hideDropPanel = function(){
                $dropPanel.hide();
            };
            btnClick = function(e){
                editor.hideModal();   //先视图隐藏目前显示的modal

                $dropPanel.css('display', 'inline-block');

                // 计算dropPanel的位置
                var containerLeft = $editorContainer.offset().left,
                    containerWidth = $editorContainer.outerWidth(),
                    panelLeft = $dropPanel.offset().left,
                    panelWidth = $dropPanel.outerWidth(),
                    diff = (panelLeft + panelWidth) - (containerLeft + containerWidth);

                if (diff > 0) {
                    // 说明panel溢出了container之外
                    $dropPanel.css('margin-left', 0 - diff);
                }

                e.preventDefault();
                $btn.focus();  //for 360急速浏览器
                
                e.stopPropagation();  //最后阻止冒泡
            };

            //0916 - 因为表情tab切换时，会出发 $btn.blur 会隐藏 dropPanel
            //       因此暂时注释掉
            //       带来的问题：点击editor外面的body，dropPanel不隐藏
            // $btn.blur(function(e){
            //     setTimeout(hideDropPanel, 200);  //待执行完命令，再隐藏
            // });

            //命令（使用事件代理）
            $dropPanel.on('click', 'a[commandValue]', function(e){
                var $this = $(this),
                    value = $this.attr('commandValue');
                
                editor.command(e, command, value, callback);
            });

            hideDropPanel();  //刚加载时先隐藏起来
        }
        //弹出框
        else if(type === 'modal'){
            //$modal 头部信息
            $modal.prepend($(
                $E.htmlTemplates.modalHeader.replace('{title}', title)
            ));

            //插入编辑器
            editor.insertModal($modal);

            btnClick = function(e){
                editor.hideModal();   //先视图隐藏目前显示的modal

                // 显示modal，才能取出top、left
                $modal.show();

                //计算margin-left;
                var editorContainerWidth = editor.$editorContainer.outerWidth(),
                    modalWidth = $modal.outerWidth(),
                    editorContainerLeft = editor.$editorContainer.offset().left,
                    modalLeft = $modal.offset().left;
                $modal.css('margin-left', (editorContainerLeft - modalLeft) + (editorContainerWidth/2 - modalWidth/2));

                //计算margin-top，让modal紧靠在$txt上面
                var txtTop = editor.$txt.offset().top,
                    modalContainerTop = $modal.offset().top;
                $modal.css('margin-top', txtTop - modalContainerTop + 5);

                //最后阻止默认时间、阻止冒泡
                e.preventDefault();
                e.stopPropagation();
            };
            $modal.find('[commandName=close]').click(function(e){
                $modal.css({
                    'margin-left': 0,
                    'margin-top': 0
                }).hide();
                e.preventDefault();
            });
        }

        //绑定按钮点击事件
        $btn.click(function(e){
            if(beforeFn && typeof beforeFn === 'function'){
                beforeFn(editor);
            }
            if(btnClick && typeof btnClick === 'function'){
                btnClick(e);
            }
        });

        //按钮 tooltip 效果
        if(title){
            $btn.attr('title', '');
            // if(hotKey){
            //     title = title + '('  + hotKey + ')';  //加入快捷键提示
                    //PS：注释掉这个，是因为名称较长的菜单，加上之后，tooltip的小三角位置不对
            // }

            var $toolTip = $( $E.htmlTemplates.tooltip ),
                $toolTipContent = $( $E.htmlTemplates.tooltipContent.replace('{title}', title) ),
                timer,
                margin_left;

            $toolTip.append($toolTipContent);
            resultArray.unshift($toolTip);

            showToolTip = function(){
                $toolTip.css('display', 'inline-block');
            };
            $btn.mouseenter(function(){
                //计算$tooltip的margin-left，只计算一次
                if(!margin_left){
                    margin_left = $toolTip.css('margin-left');
                }
                if(margin_left === '0px'){
                    margin_left = ( 0 - ($toolTip.outerWidth()/2 - $btn.outerWidth()/2) ) + 'px';
                    $toolTip.css('margin-left', margin_left);
                }

                timer = setTimeout(showToolTip, 200);  //0.2s之后才显示tooltip，防止鼠标快速经过时会闪烁
            }).mouseleave(function(){
                clearTimeout(timer);
                $toolTip.hide();
            });
        }

        //返回菜单
        return resultArray;
    }
});