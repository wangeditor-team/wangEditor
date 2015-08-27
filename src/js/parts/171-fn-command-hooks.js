$.extend($E.fn, {
	'commandHooks':{

        //插入html，for IE
        'insertHTML': function(commandName, commandValue){
            var $elem,
                currentRange = this.currentRange(),
                parentElem = this.parentElemForCurrentRange();

            if(!currentRange){
                return;
            }
            $elem = $E.getElemForInsertTable($(parentElem));
            if($elem.next().length === 0){
                commandValue += '<p><br/></p>';
            }
            $elem.after($(commandValue));
        },

        //自定义插入链接，包含title，target
        'customCreateLink': function(commandName, commandValue){
            var url = commandValue.url,
                title = commandValue.title,
                isBlank = commandValue.isBlank,
                id = $E.getUniqeId(),
                oldLinks,
                newLinks;

            //对当前的 a 先进行标记
            oldLinks = this.$txt.find('a');
            if(oldLinks.length > 0){
                oldLinks.attr(id, '1');
            }

            //执行
            document.execCommand("createLink", false, url);

            //获取新产生的 a （即没有标记）
            newLinks= this.$txt.find('a').not('[' + id + ']');
            if(title){
                newLinks.attr('title', title);
            }
            if(isBlank){
                newLinks.attr('target', '_blank');
            }

            //去掉上文对a的标记
            if(oldLinks.length > 0){
                oldLinks.removeAttr(id);
            }
        },

        //自定义插入image，包含title，alt
        'customeInsertImage': function(commandName, commandValue){
            var url = commandValue.url,
                title = commandValue.title,
                link = commandValue.link,
                id = $E.getUniqeId(),
                oldImgs,
                newImgs;

            //对当前的 img 先进行标记
            oldImgs = this.$txt.find('img');
            if(oldImgs.length > 0){
                oldImgs.attr(id, '1');
            }

            //执行
            document.execCommand("insertImage", false, url);

            //获取新产生的 img （即没有标记）
            newImgs = this.$txt.find('img').not('[' + id + ']');
            newImgs.attr('title', title);
            newImgs.attr('alt', title);

            //加链接
            if(link && typeof link === 'string'){
                newImgs.wrap('<a href="' + link + '" target="_blank"></a>');
            }

            //去掉上文对img的标记
            if(oldImgs.length > 0){
                oldImgs.removeAttr(id);
            }
        },

        //删除 $table $img 命令
        'delete$elem': function(commandName, commandValue){
            commandValue.remove();  //例如：$table.remove();
        },

        //撤销命令
        'commonUndo': function(commandName, commandValue){
            //this是editor对象
            this.undo(commandName, commandValue);
        },

        //重做命令
        'commonRedo': function(commandName, commandValue){
            //this是editor对象
            this.redo(commandName, commandValue);
        },

        //覆盖整个源码
        'replaceSourceCode': function(commandName, commandValue){
            this.html(commandValue);
        },
        
        //切换全屏
        'fullScreen': function(commandName, commandValue){
            var $txtContainer = this.$txtContainer,
                $editorContainer = this.getEditorContainer(),
                position =$editorContainer.css('position'),

                enlargeClass = 'icon-wangEditor-enlarge2',
                shrinkClass = 'icon-wangEditor-shrink2',

                $enlargeIcon = $editorContainer.find('.' + enlargeClass),
                $shrinkIcon = $editorContainer.find('.' + shrinkClass);

            //切换icon
            if($enlargeIcon.length){
                $enlargeIcon.removeClass(enlargeClass).addClass(shrinkClass);
            }else if($shrinkIcon.length){
                $shrinkIcon.removeClass(shrinkClass).addClass(enlargeClass);
            }

            if(position !== 'fixed'){
                //记录txtContainer高度
                this._txtContainerHeight = $txtContainer.height();
                //修改txtContainer高度
                $txtContainer.css({
                    'height': '90%'
                });

                //切换到全屏
                $editorContainer.css({
                    'position': 'fixed',
                    'top': 25,
                    'left': 20,
                    'right': 20,
                    'bottom': 20,
                    'z-index': 1000,

                    '-webkit-box-shadow': '0 0 30px #999', 
                    '-moz-box-shadow': '0 0 30px #999',
                    'box-shadow': '0 0 30px #999'
                });
            }else{
                //还原txtContainer高度
                $txtContainer.height(this._txtContainerHeight);
                //还原
                $editorContainer.css({
                    'position': 'relative',
                    'top': 0,
                    'left': 0,
                    'right': 0,
                    'bottom': 0,
                    'z-index': 0,

                    '-webkit-box-shadow': '0 0 0 #CCC', 
                    '-moz-box-shadow': '0 0 0 #CCC',
                    'box-shadow': '0 0 0 #CCC'
                });
            }
        }
    }
});