$(function(){
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
    if(isIE6 || isIE7 || isIE8){
        //只针对IE6、7、8
        window.onload = function() {
            function addIcon(elem, entity) {
                elem.className = '';
                elem.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>';
            }
            var icons = {
                'wangeditor-menu-img-link' : '&#xe800;',
                'wangeditor-menu-img-unlink' : '&#xe801;',
                'wangeditor-menu-img-code' : '&#xe802;',
                'wangeditor-menu-img-cancel': '&#xe803;',
                'wangeditor-menu-img-terminal':'&#xe804;',
                'wangeditor-menu-img-angle-down':'&#xe805;',
                'wangeditor-menu-img-font':'&#xe806;',
                'wangeditor-menu-img-bold':'&#xe807;',
                'wangeditor-menu-img-italic':'&#xe808;',
                'wangeditor-menu-img-header':'&#xe809;',
                'wangeditor-menu-img-align-left':'&#xe80a;',
                'wangeditor-menu-img-align-center':'&#xe80b;',
                'wangeditor-menu-img-align-right':'&#xe80c;',
                'wangeditor-menu-img-list-bullet':'&#xe80d;',
                'wangeditor-menu-img-indent-left':'&#xe80e;',
                'wangeditor-menu-img-indent-right':'&#xe80f;',
                'wangeditor-menu-img-list-numbered':'&#xe810;',
                'wangeditor-menu-img-underline':'&#xe811;',
                'wangeditor-menu-img-table':'&#xe812;',
                'wangeditor-menu-img-eraser':'&#xe813;',
                'wangeditor-menu-img-text-height':'&#xe814;',
                'wangeditor-menu-img-brush':'&#xe815;',
                'wangeditor-menu-img-pencil':'&#xe816;',
                'wangeditor-menu-img-minus':'&#xe817;',
                'wangeditor-menu-img-picture':'&#xe818;',
                'wangeditor-menu-img-file-image':'&#xe819;',
                'wangeditor-menu-img-cw':'&#xe81a;',
                'wangeditor-menu-img-ccw':'&#xe81b;',
                'wangeditor-menu-img-music':'&#xe911;',
                'wangeditor-menu-img-play':'&#xe912;',
                'wangeditor-menu-img-location':'&#xe947;',
                'wangeditor-menu-img-happy':'&#xe9df;',
                'wangeditor-menu-img-sigma':'&#xea67',
                'wangeditor-menu-img-enlarge2':'&#xe98b;',
                'wangeditor-menu-img-shrink2':'&#xe98c;',
                'wangeditor-menu-img-newspaper':'&#xe904;',
                'wangeditor-menu-img-camera':'&#xe90f;',
                'wangeditor-menu-img-video-camera':'&#xe914;',
                'wangeditor-menu-img-file-zip':'&#xe92b;',
                'wangeditor-menu-img-stack':'&#xe92e;',
                'wangeditor-menu-img-credit-card':'&#xe93f;',
                'wangeditor-menu-img-address-book':'&#xe944;',
                'wangeditor-menu-img-envelop':'&#xe945;',
                'wangeditor-menu-img-drawer':'&#xe95c;',
                'wangeditor-menu-img-download':'&#xe960;',
                'wangeditor-menu-img-upload':'&#xe961;',
                'wangeditor-menu-img-lock':'&#xe98f;',
                'wangeditor-menu-img-unlocked':'&#xe990;',
                'wangeditor-menu-img-wrench':'&#xe991;',
                'wangeditor-menu-img-eye':'&#xe9ce;',
                'wangeditor-menu-img-eye-blocked':'&#xe9d1;',
                'wangeditor-menu-img-command':'&#xea4e;',
                'wangeditor-menu-img-font2':'&#xea5c;',
                'wangeditor-menu-img-libreoffice':'&#xeade;',
                'wangeditor-menu-img-quotes-left':'&#xe977;',
                'wangeditor-menu-img-strikethrough':'&#xea65;',
                'wangeditor-menu-img-desktop':'&#xf108;',
                'wangeditor-menu-img-tablet':'&#xf10a;'
            };

            //遍历菜单按钮，替换fontIcon
            $('.wangEditor-container i').each(function(){
                var elem = this,
                    className = this.className,
                    matchs = className.match(/wangeditor-menu-img-[^\s'"]+/);
                if (matchs) {
                    addIcon(elem, icons[matchs[0]]);
                }
            });
        };
    } 
});