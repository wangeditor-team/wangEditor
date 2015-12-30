'mobilePreView': {
	'title': langMenus.mobilePreView.title,
    'type': 'modal',
    'cssClass': 'wangeditor-menu-img-tablet',
    'modal': function (editor) {
        var contentId = $E.getUniqeId();
        var content = [
            '<center><div class="mobile-prev-container">',
            '   <div class="prev-tip-top"></div>',
            '   <div class="prev-content" id="' + contentId + '"></div>',
            '   <div class="prev-tip-bottom"></div>',
            '</div></center>'
        ].join('');

        var $modal = $(
            $E.htmlTemplates.modalSmall.replace('{content}', content)
        );

        var triggerClass = this.cssClass;

        $(function () {
            var $content = $('#' + contentId);
            editor.$btnContainer.find('.' + triggerClass) //找到<i>
                                .parent() //找到 <a> 即 btn
            .click(function () {
                $content.html(editor.html());
            });
        });

        return $modal;
    }
}