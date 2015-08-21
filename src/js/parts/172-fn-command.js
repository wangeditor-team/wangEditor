$.extend($E.fn, {
	'command': function(e, commandName, commandValue, callback){
        if( !this.currentRange() ){
            alert('未选中编辑区，无法执行操作');
        }else{
            var commandHook;

            //恢复选中区
            this.restoreSelection();

            //执行
            if($E.commandEnabled(commandName) === true){
                //针对html多做一步处理：在value后面加一个换行
                if (commandName === 'insertHTML') {
                    commandValue += '<p><br/></p>';
                }

                document.execCommand(commandName, false, commandValue);
            }else{
                commandHook = this.commandHooks[commandName];
                if(commandHook){
                    commandHook.call(this, commandName, commandValue);
                }else{
                    $E.consoleLog('不支持“' + commandName + '”命令，请检查。');
                }
            }

            //重新保存，否则chrome，360，safari，opera中会清空currentRange
            this.saveSelection();
            
            //执行回调函数
            if(callback && typeof callback === 'function'){
                callback(this);
            }

            //更新菜单样式
            this.updateMenuStyle();

            //记录，以便撤销
            this.addCommandRecord();

            //变化监控
            this.change();
        }

        //关闭modal
        this.hideModal();

        if(e){
            e.preventDefault();
        }
    }
});