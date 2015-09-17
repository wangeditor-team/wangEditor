'insertExpression': {
    'title': langMenus.insertExpression.title,
    'type': 'dropPanel',
    'command': 'insertImage',
    'cssClass': 'icon-wangEditor-happy',
    'dropPanel': function(editor){
        //生成表情配置列表
        var config = $E.expressionConfig,
            path = config.path,
            fileNames = config.fileNames,  // [1,100]
            firstName = fileNames[0],  // 1
            lastName = fileNames[1],  // 100
            ext = config.ext,  //.gif
            expressionArr = [],
            i = 1;

        if(editor.expressions){
            //自定义配置的表情图片配置
            expressionArr = editor.expressions;
        }else{
            //默认的表情图片配置
            for(; i<=lastName; i++){
                expressionArr.push( path + i + ext );
            }
        }

        //生成dropPanel
        var $panel,
            temp = 
                '<a href="#" commandValue="${value}">' +   //注意，此处commandValue必填项，否则程序不会跟踪
                '   <img src="${src}" expression="1"/>' + 
                '</a>',
            
            //应对一组表情
            arr = [],  

            //应对多组表情
            exprIndex = 0,
            tabArr = [],
            tabContainer,
            groupArr = [],
            groupContainer;

        if( typeof expressionArr[0] === 'string' ){
            //只有一组表情

            //遍历数组，生成表情dom
            $.each(expressionArr, function(key, value){
                var floatItem = temp.replace('${value}', value)
                                    .replace('${src}', value);
                arr.push(
                    $E.htmlTemplates.dropPanel_floatItem.replace('{content}', floatItem)
                );
            });
            //用dropPanel包裹生成的dom
            $panel = $( 
                $E.htmlTemplates.dropPanelBig.replace('{content}', arr.join('')) 
            );
        }else{
            //多组表情

            //遍历数组，每个元素都是一个表情包
            $.each(expressionArr, function(key, value){
                //计数加1
                exprIndex = exprIndex + 1;

                var title = value.title,  //标题
                    tab,
                    exprValueArr = value.items, //表情包中的表情数组
                    groupHtmlArr = [],
                    group;

                //将标题变为 tab，添加到 tabArr
                tab = $E.htmlTemplates.dropPanel_expression_tab.replace('{content}', title)
                                                                .replace('{index}', exprIndex);
                tabArr.push( tab );

                //遍历表情数组，拼接每个表情的html代码，到临时数组中
                $.each(exprValueArr, function(key, value){
                    var floatItem = temp.replace('${value}', value)
                                        .replace('${src}', value);
                    groupHtmlArr.push(
                        $E.htmlTemplates.dropPanel_floatItem.replace('{content}', floatItem)
                    );
                });
                //将表情html数组，join出来，到group中
                group = $E.htmlTemplates.dropPanel_expression_group.replace('{content}', groupHtmlArr.join(''))
                                                                    .replace('{index}', exprIndex);
                //将 group 添加到 groupArr
                groupArr.push(group);
            }); 
            //遍历结束之后，tabArr 和 groupArr 都会填充完成

            //将 tabArr 和 groupArr 都填充到相应的 container 容器中
            tabContainer = $E.htmlTemplates.dropPanel_expression_tab_container.replace('{content}', tabArr.join(''));
            groupContainer = $E.htmlTemplates.dropPanel_expression_group_container.replace('{content}', groupArr.join(''));
            
            //用dropPanel包裹这两个容器
            $panel = $( 
                $E.htmlTemplates.dropPanelBig.replace('{content}', tabContainer + groupContainer) 
            );

            //控制显示和隐藏
            $(function(){

                var $tabContainer = $('.wangEditor-expression-tab-container'),
                    $tabs = $tabContainer.children(),
                    $groupContainer = $('.wangEditor-expression-group-container'),
                    $groups = $groupContainer.children();

                //显示指定tab的方法
                function showTab($tab){
                    var index = $tab.attr('index');

                    //显示这一个tab
                    $tabs.removeClass('selected');
                    $tab.addClass('selected');

                    //显示相应的group
                    $groups.hide();
                    $groupContainer.find('[index=' + index + ']').show();
                }

                //默认显示第一个tab
                showTab( $tabs.first() );

                //为每个tab注册点击时间
                $tabs.click(function(e){
                    showTab( $(this) );
                    e.stopPropagation();
                });
            });
        }
        
        return $panel; 
    }
},