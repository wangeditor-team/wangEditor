//检测jquery是否正常
if(!$){
	alert('检测到页面没有引用jQuery，请先引用，否则wangEditor将无法使用。');
    return;
} else if(typeof $ !== 'function' || /^\d+\.\d+\.\d+$/.test($().jquery) === false){
	alert('检测到 window.jQuery 已被修改，wangEditor无法使用。');
    return;
}