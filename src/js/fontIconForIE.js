(function($){
	//判断IE6、7、8
    var isIE6 = false, 
        isIE7 = false, 
        isIE8 = false,
        appVersion;
    if(navigator.appName === "Microsoft Internet Explorer"){
        appVersion = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
        isIE6 = appVersion === 'MSIE6.0';
        isIE7 = appVersion === 'MSIE7.0';
        isIE8 = appVersion === 'MSIE8.0';
    }
    //------------------------------------配置IE6、7、8的font-Icon------------------------------------
    if(isIE6 || isIE7 || isIE8){
        //只针对IE6、7、8
        window.onload = function() {
            function addIcon(elem, entity) {
                elem.className = '';
                elem.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>';
            }
            var icons = {
                'icon-wangEditor-link' : '&#xe800;',
                'icon-wangEditor-unlink' : '&#xe801;',
                'icon-wangEditor-code' : '&#xe802;',
                'icon-wangEditor-cancel': '&#xe803;',
                'icon-wangEditor-terminal':'&#xe804;',
                'icon-wangEditor-angle-down':'&#xe805;',
                'icon-wangEditor-font':'&#xe806;',
                'icon-wangEditor-bold':'&#xe807;',
                'icon-wangEditor-italic':'&#xe808;',
                'icon-wangEditor-header':'&#xe809;',
                'icon-wangEditor-align-left':'&#xe80a;',
                'icon-wangEditor-align-center':'&#xe80b;',
                'icon-wangEditor-align-right':'&#xe80c;',
                'icon-wangEditor-list-bullet':'&#xe80d;',
                'icon-wangEditor-indent-left':'&#xe80e;',
                'icon-wangEditor-indent-right':'&#xe80f;',
                'icon-wangEditor-list-numbered':'&#xe810;',
                'icon-wangEditor-underline':'&#xe811;',
                'icon-wangEditor-table':'&#xe812;',
                'icon-wangEditor-eraser':'&#xe813;',
                'icon-wangEditor-text-height':'&#xe814;',
                'icon-wangEditor-brush':'&#xe815;',
                'icon-wangEditor-pencil':'&#xe816;',
                'icon-wangEditor-minus':'&#xe817;',
                'icon-wangEditor-picture':'&#xe818;',
                'icon-wangEditor-file-image':'&#xe819;',
                'icon-wangEditor-cw':'&#xe81a;',
                'icon-wangEditor-ccw':'&#xe81b;',
                'icon-wangEditor-music':'&#xe911;',
                'icon-wangEditor-play':'&#xe912;',
                'icon-wangEditor-location':'&#xe947;',
                'icon-wangEditor-happy':'&#xe9df;',
                'icon-wangEditor-sigma':'&#xea67'
            };

            //遍历菜单按钮，替换fontIcon
            $('.wangEditor-container i').each(function(){
                var elem = this,
                    className = this.className,
                    matchs = className.match(/icon-wangEditor-[^\s'"]+/);
                if (matchs) {
                    addIcon(elem, icons[matchs[0]]);
                }
            });
        };
    }
})(window.jQuery);