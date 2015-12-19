'insertLocation':{
    'title': langMenus.insertLocation.title,
    'type': 'modal',
    'cssClass': 'icon-wangEditor-location',
    'modal': function(editor){
        var txtCityId = $E.getUniqeId(),
            txtLocationId = $E.getUniqeId(),
            btnSearchId = $E.getUniqeId(),
            btnClearId = $E.getUniqeId(),
            divMapId = $E.getUniqeId(),
            btnInsertId = $E.getUniqeId(),
            checkDynamicId = $E.getUniqeId();

        var langModal = langMenus.insertLocation.modal,
            langCity = langModal.city,
            langLocation = langModal.location,
            langSearch = langModal.search,
            langClear = langModal.clear,
            langLoading = langModal.loading,
            langDynamic = langModal.dynamic,

            langInsert = langCommon.insert,

            langAlert = langMenus.insertLocation.alert,
            langCantFindLocation = langAlert.cantFindLocation,
            langDynamicOneLocation = langAlert.dynamicOneLocation;

        var content = langCity + '：<input type="text" id="' + txtCityId + '" style="width:60px;"/> ' + 
                      langLocation + '：<input type="text" id="' + txtLocationId + '">' +
                      ' <button class="wangEditor-modal-btn" id="' + btnSearchId + '"  type="button">' +langSearch+ '</button>' + 
                      ' <button class="wangEditor-modal-btn" id="' + btnClearId + '"  type="button">' +langClear+ '</button>' +
                      ' <div id="' + divMapId + '" style="width:100%; height:220px; border:1px solid #ccc; margin:10px 0px;">' +langLoading+ '</div>' +
                      ' <button class="wangEditor-modal-btn" id="' + btnInsertId +'"  type="button">' +langInsert+ '</button>' +
                      ' <input type="checkbox" id="' + checkDynamicId + '"/>' + langDynamic;
        var $location_modal = $(
                $E.htmlTemplates.modal.replace('{content}', content)
            );

        var triggerClass = this.cssClass;

        //地图使用到的变量
        var map,
            markers = [];

        //初始化map
        window.baiduMapCallBack = function(){
            map = new BMap.Map( divMapId );    // 创建Map实例
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

            //根据IP定位
            function locationFun(result){
                var cityName = result.name;
                map.setCenter(cityName);
                $('#' + txtCityId).val(cityName);
            }
            var myCity = new BMap.LocalCity();
            myCity.get(locationFun);

            //鼠标点击，创建位置
            map.addEventListener("click", function(e){
                var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); 
                map.addOverlay(marker);  
                marker.enableDragging();
                markers.push(marker);  //加入到数组中
            });
        };

        // 点击菜单加载地图
        $(function(){
            var $trigger = $('.' + triggerClass).parent();
            $trigger.on('click.loadMap', function () {
                var ak = 'TVhjYjq1ICT2qqL5LdS8mwas';
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=baiduMapCallBack";  // baiduMapCallBack是一个本地函数
                document.body.appendChild(script);

                // 加载完毕，删除加载事件
                $trigger.off('click.loadMap');
            });
        });

        //搜索位置
        $location_modal.find('#' + btnSearchId).click(function(e){
            var cityName = $.trim( $('#' + txtCityId).val() ),
                locationName = $.trim( $('#' + txtLocationId).val() ),
                myGeo,
                marker;
            
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
                            markers.push(marker);  //将marker加入到数组中
                        }else{
                            alert( langCantFindLocation );
                            map.centerAndZoom(cityName, 11);  //找不到则重新定位到城市
                        }
                    }, cityName);
                }
            }
        });

        //清除位置
        $location_modal.find('#' + btnClearId).click(function(e){
            map.clearOverlays();
            markers = [];  //同时，清空marker数组
        });

        //插入位置的事件
        $location_modal.find('#' + btnInsertId).click(function(e){
            var isDynamic = $('#'+ checkDynamicId).is(':checked'),

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
                    alert( langDynamicOneLocation );
                    return;
                }

                src += '&markerStyles=l,A';

                //插入iframe
                iframe = '<iframe class="ueditor_baidumap" src="{src}" frameborder="0" width="' + sizeWidth + '" height="' + sizeHeight + '"></iframe>';
                iframe = iframe.replace('{src}', src);
                editor.command(e, 'insertHTML', iframe);
            }else{
                //插入图片
                editor.command(e, 'insertImage', src);
            }
        });

        return $location_modal;
    }
},