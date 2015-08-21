$.extend($E, {

	//检测命令是否支持
    'commandEnabled': function(commandName){
        var enabled;
        try{
            enabled = document.queryCommandEnabled(commandName);
        }catch(ex){
            enabled = false;
        }
        return enabled;
    },

    //获取可以插入表格的元素，用于 commandHooks['insertHTML']
    'getElemForInsertTable': function($elem){
        if ($elem[0].nodeName.toLowerCase() === 'body') {
            return;
        }
        if ($elem.parent().is('div[contenteditable="true"]')) {
            return $elem;
        }
        if ($elem.is('div[contenteditable="true"]')) {
            if($elem.children().length === 0){
                $elem.append( $('<p></p>') );
            }
            return $elem.children().last();
        } else {
            return this.getElemForInsertTable($elem.parent());
        }
    }
});