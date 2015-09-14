'setHead': {
    'title': langMenus.setHead.title,
    'type': 'dropMenu', 
    'cssClass':'icon-wangEditor-header',
    'command': 'formatBlock ',
    'dropMenu': function(){
        var head = langMenus.setHead.title,
            content = langMenus.setHead.content;

        var liListStr =  '<li><a href="#" commandValue="<h1>"><h1>' + head + '1</h1></a></li>' + 
                    '<li><a href="#" commandValue="<h2>"><h2>' + head + '2</h2></a></li>' + 
                    '<li><a href="#" commandValue="<h3>"><h3>' + head + '3</h3></a></li>' + 
                    '<li><a href="#" commandValue="<h4>"><h4>' + head + '4</h4></a></li>' + 
                    '<li><a href="#" commandValue="<p>">' + content + '</a></li>';
        return $( $E.htmlTemplates.dropMenu.replace('{content}', liListStr) );
    }
},