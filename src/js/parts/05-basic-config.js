$.extend($E, {

    //样式配置
    'styleConfig': {
        'fontFamilyOptions': [
            '宋体', '黑体', '楷体', '隶书', '幼圆', '微软雅黑', 
            'Arial', 'Verdana', 'Georgia', 'Times New Roman', 
            'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS'
        ],
        'colorOptions': {
            '#880000': '暗红色',
            '#800080': '紫色',
            '#ff0000': '红色',
            '#ff00ff': '鲜粉色',
            '#000080': '深蓝色',
            '#0000ff': '蓝色',
            '#00ffff': '湖蓝色',
            '#008080': '蓝绿色',
            '#008000': '绿色',
            '#808000': '橄榄色',
            '#00ff00': '浅绿色',
            '#ffcc00': '橙黄色',
            '#808080': '灰色',
            '#c0c0c0': '银色',
            '#000000': '黑色',
            '#ffffff': '白色'
        },
        'fontsizeOptions': {
            1: '10px',
            2: '13px',
            3: '16px',
            4: '19px',
            5: '22px',
            6: '25px',
            7: '28px'
        },
        'blockQuoteStyle': 'display:block; border-left: 5px solid #d0e5f2; padding:0 0 0 10px; margin:0; line-height:1.4; font-size: 100%;'
    },

    //html模板
    'htmlTemplates': {
        //删除table,img的按钮
        'elemDeleteBtn': '<a href="#" class="wangEditor-elemDeleteBtn"><i class="icon-wangEditor-cancel"></i></a>',
        'imgResizeBtn': '<div class="wangEditor-imgResize"></div>',

        //整个编辑器的容器
        'editorContainer': '<div class="wangEditor-container"></div>',
        //菜单容器（加上clearfix）
        'btnContainer': '<div class="wangEditor-btn-container clearfix"></div>',
        //菜单组
        'btnContainerGroup': '<div class="wangEditor-btn-container-group"></div>',
        //单个菜单按钮（一定要有 herf='#'，否则无法监听blur事件）
        'btn': '<a class="wangEditor-btn-container-btn wangEditor-btn-container-btn-default" href="#"></a>', 
        //下拉按钮右侧的小三角
        'btnAngleDown': '<i class="icon-wangEditor-angle-down" style="margin-left:3px;"></i>',
        //btn tooltip
        'tooltip': '<div class="wangEditor-toolTip"></div>',
        //btn tooltipContent
        'tooltipContent': '<div class="wangEditor-toolTip-content">{title}</div>',
        //所有弹出框modal的容器
        'modalContainer': '<div class="wangEditor-modal-container"></div>',
        //modal（按大小分为4种）
        'modal': '<div class="wangEditor-modal">{content}</div>',
        'modalBig': '<div class="wangEditor-modal wangEditor-modal-big">{content}</div>',
        'modalSmall': '<div class="wangEditor-modal wangEditor-modal-small">{content}</div>',
        'modalMini': '<div class="wangEditor-modal wangEditor-modal-mini">{content}</div>',
        //modal header
        'modalHeader': '<div class="wangEditor-modal-header clearfix">' + 
                            '<a href="#" commandName="close" class="wangEditor-modal-header-close"><i class="icon-wangEditor-cancel"></i></a>' + 
                            '<b>{title}</b>' + 
                            '<div class="wangEditor-modal-header-line"></div>' + 
                        '</div>',
        //编辑框的容器
        'txtContainer': '<div class="wangEditor-textarea-container"></div>',
        //编辑框
        'txt': '<div class="wangEditor-textarea" contenteditable="true"><p><br/></p></div>',
        //dropmenu
        'dropMenu': '<ul class="wangEditor-drop-menu">{content}</ul>',
        //dropPanel
        'dropPanel': '<div class="wangEditor-drop-panel">{content}</div>',
        //dropPanel-big
        'dropPanelBig': '<div class="wangEditor-drop-panel wangEditor-drop-panel-big">{content}</div>',
        //dropPanel-floatItem（即 dropPanel 里面一个一个的块 ）
        'dropPanel_floatItem': '<div class="wangEditor-drop-panel-floatItem">{content}</div>',
        
        //表情dropPanel的tab容器
        'dropPanel_expression_tab_container': '<div class="clearfix wangEditor-expression-tab-container">{content}</div>',
        //表情dropPanel中的tab
        'dropPanel_expression_tab': '<div index="{index}" class="wangEditor-expression-tab">{content}</div>',
        //表情分组的容器
        'dropPanel_expression_group_container': '<div class="wangEditor-expression-group-container">{content}</div>',
        //表情分组
        'dropPanel_expression_group': '<div index="{index}" class="clearfix wangEditor-expression-group">{content}</div>',

        //视频
        'videoEmbed': '<embed src="{src}" allowFullScreen="true" quality="high" width="{width}" height="{height}" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>',
        //代码块
        'codePre': '<pre style="border:1px solid #ccc; background-color: #f5f5f5; padding: 10px; margin: 5px 0px; line-height: 1.4; font-size: 0.8em; font-family: Menlo, Monaco, Consolas; border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;"><code>{content}</code></pre><p><br></p>',
        //代码块（highlight插件）
        'codePreWidthHightLight': '<pre><code class="{lang}">{content}</code></pre>'
    },
    
    //表情配置（1.gif, 2.gif, 3.gif ... 100.gif）
    'expressionConfig': {
        'path':'http://www.wangeditor.com/expressions/',
        'fileNames':[1,100],
        'ext':'.gif'
    }
});