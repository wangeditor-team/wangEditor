// location 菜单
_e(function (E, $) {

    // 判断浏览器的 input 是否支持 keyup
    var inputKeyup = (function (input) {
        return 'onkeyup' in input;
    })(document.createElement('input'));

    // 百度地图的key
    E.baiduMapAk = 'TVhjYjq1ICT2qqL5LdS8mwas';

    // 一个页面中，如果有多个编辑器，地图会出现问题。这个参数记录一下，如果超过 1 就提示
    E.numberOfLocation = 0;

    E.createMenu(function (check) {
        var menuId = 'location';
        if (!check(menuId)) {
            return;
        }

        if (++E.numberOfLocation > 1) {
            E.error('目前不支持在一个页面多个编辑器上同时使用地图，可通过自定义菜单配置去掉地图菜单');
            return;
        }

        var editor = this;
        var config = editor.config;
        var lang = config.lang;
        var ak = config.mapAk;

        // 地图的变量存储到这个地方
        editor.mapData = {};
        var mapData = editor.mapData;

        // ---------- 地图事件 ----------
        mapData.markers = [];
        mapData.mapContainerId = 'map' + E.random();

        mapData.clearLocations = function () {
            var map = mapData.map;
            if (!map) {
                return;
            }
            map.clearOverlays();

            //同时，清空marker数组
            mapData.markers = [];
        };

        mapData.searchMap = function () {
            var map = mapData.map;
            if (!map) {
                return;
            }

            var BMap = window.BMap;
            var cityName = $cityInput.val();
            var locationName = $searchInput.val();
            var myGeo, marker;

            if(cityName !== ''){
                if(!locationName || locationName === ''){
                    map.centerAndZoom(cityName, 11);
                }

                //地址解析
                if(locationName && locationName !== ''){
                    myGeo = new BMap.Geocoder();
                    // 将地址解析结果显示在地图上,并调整地图视野
                    myGeo.getPoint(locationName, function(point){
                        if (point) {
                            map.centerAndZoom(point, 13);
                            marker = new BMap.Marker(point);
                            map.addOverlay(marker);
                            marker.enableDragging();  //允许拖拽
                            mapData.markers.push(marker);  //将marker加入到数组中
                        }else{
                            // alert('未找到');
                            map.centerAndZoom(cityName, 11);  //找不到则重新定位到城市
                        }
                    }, cityName);
                }
            } // if(cityName !== '')
        };

        // load script 之后的 callback
        var hasCallback = false;
        window.baiduMapCallBack = function(){
            // 避免重复加载
            if (hasCallback) {
                return;
            } else {
                hasCallback = true;
            }

            var BMap = window.BMap;
            if (!mapData.map) {
                // 创建Map实例
                mapData.map = new BMap.Map(mapData.mapContainerId);
            }
            var map = mapData.map;

            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

            //根据IP定位
            function locationFun(result){
                var cityName = result.name;
                map.setCenter(cityName);

                // 设置城市名称
                $cityInput.val(cityName);
                if (E.placeholder) {
                    $searchInput.focus();
                }
                var timeoutId, searchFn;
                if (inputKeyup) {
                   // 并绑定搜索事件 - input 支持 keyup
                   searchFn = function (e) {
                       if (e.type === 'keyup' && e.keyCode === 13) {
                           e.preventDefault();
                       }
                       if (timeoutId) {
                           clearTimeout(timeoutId);
                       }
                       timeoutId = setTimeout(mapData.searchMap, 500);
                   };
                   $cityInput.on('keyup change paste', searchFn);
                   $searchInput.on('keyup change paste', searchFn); 
                } else {
                    // 并绑定搜索事件 - input 不支持 keyup
                    searchFn = function () {
                        if (!$content.is(':visible')) {
                            // panel 不显示了，就不用再监控了
                            clearTimeout(timeoutId);
                            return;
                        }

                        var currentCity = '';
                        var currentSearch = '';
                        var city = $cityInput.val();
                        var search = $searchInput.val();

                        if (city !== currentCity || search !== currentSearch) {
                            // 刚获取的数据和之前的数据不一致，执行查询
                            mapData.searchMap();
                            // 更新数据
                            currentCity = city;
                            currentSearch = search;
                        }

                        // 继续监控
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                        }
                        timeoutId = setTimeout(searchFn, 1000);
                    };
                    // 开始监控
                    timeoutId = setTimeout(searchFn, 1000);
                }
            }
            var myCity = new BMap.LocalCity();
            myCity.get(locationFun);

            //鼠标点击，创建位置
            map.addEventListener("click", function(e){
                var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); 
                map.addOverlay(marker);  
                marker.enableDragging();
                mapData.markers.push(marker);  //加入到数组中
            }, false);
        };

        mapData.loadMapScript = function () {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://api.map.baidu.com/api?v=2.0&ak=" + ak + "&s=1&callback=baiduMapCallBack";  // baiduMapCallBack是一个本地函数
            try {
                // IE10- 报错
                document.body.appendChild(script);
            } catch (ex) {
                E.error('加载地图过程中发生错误');
            }
        };

        // 初始化地图
        mapData.initMap = function () {
            if (window.BMap) {
                // 不是第一次，直接处理地图即可
                window.baiduMapCallBack();
            } else {
                // 第一次，先加载地图 script，再处理地图（script加载完自动执行处理）
                mapData.loadMapScript();
            }
        };

        // ---------- 创建 menu 对象 ----------

        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.location
        });

        editor.menus[menuId] = menu;

        // ---------- 构建UI ----------

        // panel content 
        var $content = $('<div></div>');

        // 搜索框
        var $inputContainer = $('<div style="margin:10px 0;"></div>');
        var $cityInput = $('<input type="text"/>');
        $cityInput.css({
            width: '80px',
            'text-align': 'center'
        });
        var $searchInput = $('<input type="text"/>');
        $searchInput.css({
            width: '300px',
            'margin-left': '10px'
        }).attr('placeholder', lang.searchlocation);
        var $clearBtn = $('<button class="right link">' + lang.clearLocation + '</button>');
        $inputContainer.append($clearBtn)
                       .append($cityInput)
                       .append($searchInput);
        $content.append($inputContainer);

        // 清除位置按钮
        $clearBtn.click(function (e) {
            $searchInput.val('');
            $searchInput.focus();
            mapData.clearLocations();
            e.preventDefault();
        });

        // 地图
        var $map = $('<div id="' + mapData.mapContainerId + '"></div>');
        $map.css({
            height: '260px',
            width: '100%',
            position: 'relative',
            'margin-top': '10px',
            border: '1px solid #f1f1f1'
        });
        var $mapLoading = $('<span>' + lang.loading + '</span>');
        $mapLoading.css({
            position: 'absolute',
            width: '100px',
            'text-align': 'center',
            top: '45%',
            left: '50%',
            'margin-left': '-50px'
        });
        $map.append($mapLoading);
        $content.append($map);

        // 按钮
        var $btnContainer = $('<div style="margin:10px 0;"></div>');
        var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
        var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');
        var $checkLabel = $('<label style="display:inline-block;margin-top:10px;color:#666;"></label>');
        var $check = $('<input type="checkbox">');
        $checkLabel.append($check).append('<span style="display:inline-block;margin-left:5px;">  ' + lang.dynamicMap + '</span>');
        $btnContainer.append($checkLabel)
                     .append($btnSubmit)
                     .append($btnCancel);
        $content.append($btnContainer);

        function callback() {
            $searchInput.val('');
        }

        // 『取消』按钮事件
        $btnCancel.click(function (e) {
            e.preventDefault();
            callback();
            menu.dropPanel.hide();
        });

        // 『确定』按钮事件
        $btnSubmit.click(function (e) {
            e.preventDefault();
            var map = mapData.map,
                isDynamic = $check.is(':checked'),
                markers =  mapData.markers,

                center = map.getCenter(),
                centerLng = center.lng,
                centerLat = center.lat,

                zoom = map.getZoom(),

                size = map.getSize(),
                sizeWidth = size.width,
                sizeHeight = size.height,

                position,
                src,
                iframe;

            if(isDynamic){
                //动态地址
                src = 'http://ueditor.baidu.com/ueditor/dialogs/map/show.html#';
            }else{
                //静态地址
                src = 'http://api.map.baidu.com/staticimage?';
            }

            //src参数
            src = src +'center=' + centerLng + ',' + centerLat +
                '&zoom=' + zoom +
                '&width=' + sizeWidth +
                '&height=' + sizeHeight;
            if(markers.length > 0){
                src = src + '&markers=';

                //添加所有的marker
                $.each(markers, function(key, value){
                    position = value.getPosition();
                    if(key > 0){
                        src = src + '|';
                    }
                    src = src + position.lng + ',' + position.lat;
                });
            }

            if(isDynamic){
                if(markers.length > 1){
                    alert( lang.langDynamicOneLocation );
                    return;
                }

                src += '&markerStyles=l,A';

                //插入iframe
                iframe = '<iframe class="ueditor_baidumap" src="{src}" frameborder="0" width="' + sizeWidth + '" height="' + sizeHeight + '"></iframe>';
                iframe = iframe.replace('{src}', src);
                editor.command(e, 'insertHtml', iframe, callback);
            }else{
                //插入图片
                editor.command(e, 'insertHtml', '<img style="max-width:100%;" src="' + src + '"/>', callback);
            }
        });

        // 根据 UI 创建菜单 panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 500
        });

        // ---------- 事件 ----------

        // render 时执行事件
        menu.onRender = function () {
            if (ak === E.baiduMapAk) {
                E.warn('建议在配置中自定义百度地图的mapAk，否则可能影响地图功能，文档：' + E.docsite);
            }
        };

        // click 事件
        menu.clickEvent = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;
            var firstTime = false;

            // -------------隐藏-------------
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // -------------显示-------------
            if (!mapData.map) {
                // 第一次，先加载地图
                firstTime = true;
            }
            
            dropPanel.show();
            mapData.initMap();

            if (!firstTime) {
                $searchInput.focus();
            }
        };

    });

});