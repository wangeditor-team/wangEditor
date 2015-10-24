$.extend($E, {

    //console.log提示
    'consoleLog': function(info){
        if(window.console && window.console.log && typeof window.console.log === 'function'){
            window.console.log('wangEditor提示：', info);
        }
    },

    //获取唯一的id
    'getUniqeId': function(){
        return idPrefix + (globalNum++); 
    },

    //专门针对url的xss验证
    'filterXSSForUrl': function(url){
        var result = true;
        // if(url.indexOf("javascript:") >= 0){
        //     return false;
        // }
        $.each(urlUnsafeKeywords, function(key, val){
            if(url.indexOf(val) >= 0){
                result = false;
            }
        });
        return result;
    },

    //替换html中的单引号（&#39;）、双引号(&quot;)
    'replaceQuotes': function(html){
        if(html === ''){
            return html;
        }

        //去掉换行
        //var result = html.replace(/\n/mg, "");  //去掉换行，会在更新代码时高亮代码不换行了
        var result = html;
        //过滤单引号，双引号
        result = result.replace( /(<.*?>)|(')|(")/mg, function(a,b,c,d){ 
            if( b ){
                return b;
            }else if(c){
                return "&#39;";
            }else if(d){
                return "&quot;";
            }
        });

        return result;
    },
    
    //将table的边框强制显示
    'showTableBorder': function($content){
        $content.find('table').each(function(){
            var $this = $(this),
                mark = 'wangEditor_table_border_mark',
                markValue = $this.attr(mark);
            if(!markValue){
                //没有做标记的进来设置
                $this.attr('border', "1");
                $this.attr('bordercolor', "#cccccc");
                $this.attr('cellpadding', '0');
                $this.attr('cellspacing', '0');
                $this.css({
                    'border-collapse': 'collapse'
                    
                });
                // 暂时先屏蔽掉这个最小宽度，因为有些 td 比较窄，100px太宽了
                // $this.find('tr').first().find('td,th').css({
                //     'min-width': '100px'
                // });

                //做一个标记
                $this.attr(mark, '1');
            }
        });
    }
});