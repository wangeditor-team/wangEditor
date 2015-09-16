$.extend($E.fn, {

	//初始化编辑器的语言

	'initLang': function(lang){
		var editor = this,
			langs = $E.langs,
			defaultLang = 'zhs',  //默认语言为中文 zhs
			langConfig = langs[defaultLang];  //语言的详细配置

		if(typeof lang === 'object'){
			//lang传入的是对象形式

			if(lang === null){
				lang = {};
			}

			//将 lang 对象中的配置，覆盖进 langConfig 中
			//langConfig 可能会被修改
			$.extend(true, langConfig, lang);

		}else if(typeof lang === 'string'){
			//lang 为字符串形式，即直接制定默认配置中的一个语言

			if(lang in langs){
				//如果 lang 字符串是现有语言配置中的一项
				//获取编辑器配置集合中的语言配置（lang为undefined和string的情况）
				langConfig = langs[lang];
			}else{
				//不是 langs 配置中的一项，则设置回默认
				lang = defaultLang;
			}
		}else{
			//lang 既不是对象，又不是字符串，就设置为默认
			lang = defaultLang;
		}

		//赋值
		editor.defaultLang = defaultLang;
		editor.lang = lang;
		editor.langConfig = langConfig;
	}
});