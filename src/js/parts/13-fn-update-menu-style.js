$.extend($E.fn, {

	//获取$btnContainer中带有commandName的btns
	'getCommandBtns': function(){
	    if(this.$btnsWithCommandName == null){
	        this.$btnsWithCommandName = this.$btnContainer.find('a[commandName]');
	    }
	    return this.$btnsWithCommandName;
	},

	//更新菜单btn样式
	'updateMenuStyle': function(){
	    var commandBtns = this.getCommandBtns();
	    if(commandBtns.length <= 0){
	        return;
	    }
	    //遍历所有带有commandName属性的按钮，如果当前正处于commandName状态，则按钮高亮显示
	    commandBtns.each(function(){
	        var $btn = $(this),
	            commandName = $.trim($btn.attr('commandName')).toLowerCase();
	        if(commandName === 'insertunorderedlist' || commandName === 'insertorderedlist'){
	            return;  //firefox中，如果是刚刷新的页面，无选中文本的情况下，执行这两个的 queryCommandState 报 bug
	        }
	        if($E.commandEnabled(commandName) && document.queryCommandState(commandName)){
	            $btn.addClass('wangEditor-btn-container-btn-selected');
	        }else{
	            $btn.removeClass('wangEditor-btn-container-btn-selected');
	        }
	    });
	}
	
});