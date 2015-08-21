'setHead': {
    'title': '设置标题',
    'type': 'dropMenu', 
    'cssClass':'icon-wangEditor-header',
    'command': 'formatBlock ',
    'dropMenu': function(){ 
        var liListStr =  '<li><a href="#" commandValue="<h1>"><h1>标题1</h1></a></li>' + 
                    '<li><a href="#" commandValue="<h2>"><h2>标题2</h2></a></li>' + 
                    '<li><a href="#" commandValue="<h3>"><h3>标题3</h3></a></li>' + 
                    '<li><a href="#" commandValue="<h4>"><h4>标题4</h4></a></li>' + 
                    '<li><a href="#" commandValue="<p>">正文</a></li>';
        return $( $E.htmlTemplates.dropMenu.replace('{content}', liListStr) );
    }
},