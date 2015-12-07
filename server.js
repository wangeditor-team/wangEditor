
// nodejs API 参考：http://nodeapi.ucdok.com/#/api/

// 需要本地安装 formidable ，参见 https://github.com/felixge/node-formidable
var formidable = require('formidable');
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

// 文件将要上传到哪个文件夹下面
var uploadfoldername = 'uploadfiles';
var uploadfolderpath = __dirname + '/' + uploadfoldername;

// 提交的 form 中，input-file 的 name
var inputfilename = 'file';

var port = 8888;

http.createServer(function (req, res) {

	// ----------------------用 '/upload' 这个路由来处理文件上传----------------------
	if (req.url === '/upload' && req.method.toLowerCase() === 'post') {

		// 使用第三方的 formidable 插件初始化一个 form 对象
		var form = new formidable.IncomingForm();

		// 处理 request
		form.parse(req, function (err, fields, files) {
			if (err) {
				return console.log('formidable, form.parse err');
			}

			// inputfilename 变量存储的是客户端页面中 form 中的 input-file 标签的 name 属性值
			var file = files[inputfilename];
			// formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
			var tempfilepath = file.path;
			// 获取文件类型
			var type = file.type;

			// 获取文件名，并根据文件名获取扩展名
			var filename = file.name;
			var extname = filename.lastIndexOf('.') >= 0
							? filename.slice(filename.lastIndexOf('.') - filename.length)
							: '';
			// 文件名没有扩展名时候，则从文件类型中取扩展名（如粘贴图片时）
			if (extname === '' && type.indexOf('/') >= 0) {
				extname = '.' + type.split('/')[1];
			}
			// 将文件名重新赋值为一个随机数（避免文件重名）
			filename = Math.random().toString().slice(2) + extname;

			// 构建将要存储的文件的路径
			var filenewpath = uploadfolderpath + '/' + filename;

			// 将临时文件保存为正式的文件
			fs.rename(tempfilepath, filenewpath, function (err) {
				// 存储结果
				var result = '';

				if (err) {
					// 发生错误
					console.log('fs.rename err');
					result = 'error';
				} else {
					// 保存成功
					console.log('fs.rename done');
					// 拼接图片url地址
					result = 'http://localhost:' + port + '/' + uploadfoldername + '/' + filename;
				}
				
				// 返回结果
				res.writeHead(200, {
					'Content-type': 'text/html'
				});
				res.end(result);
			});
		});
	} else if (req.url === '/uploadXDomain' && req.method.toLowerCase() === 'post') {
		
		// ---------------------- 跨域上传 ----------------------
		// 使用第三方的 formidable 插件初始化一个 form 对象
		var form = new formidable.IncomingForm();

		// wangEditor_uploadImg_assist.html 页面的url地址
		var assitUrl = 'http://localhost:8888/test/wangEditor_uploadImg_assist.html';

		// 处理 request
		form.parse(req, function (err, fields, files) {
			if (err) {
				return console.log('formidable, form.parse err');
			}

			var file = files['wangEditor_uploadImg'];
			// formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
			var tempfilepath = file.path;
			// 获取文件类型
			var type = file.type;

			// 获取文件名，并根据文件名获取扩展名
			var filename = file.name;
			var extname = filename.lastIndexOf('.') >= 0
							? filename.slice(filename.lastIndexOf('.') - filename.length)
							: '';
			// 文件名没有扩展名时候，则从文件类型中取扩展名（如粘贴图片时）
			if (extname === '' && type.indexOf('/') >= 0) {
				extname = '.' + type.split('/')[1];
			}
			// 将文件名重新赋值为一个随机数（避免文件重名）
			filename = Math.random().toString().slice(2) + extname;

			// 构建将要存储的文件的路径
			var filenewpath = uploadfolderpath + '/' + filename;

			// 将临时文件保存为正式的文件
			fs.rename(tempfilepath, filenewpath, function (err) {
				// 存储结果
				var result = '';
				var imgUrl = '';

				if (err) {
					// 发生错误
					console.log('fs.rename err');
					result = assitUrl + '#上传失败';
				} else {
					// 保存成功
					console.log('fs.rename done');
					// 拼接图片url地址
					imgUrl = 'http://localhost:' + port + '/' + uploadfoldername + '/' + filename;
					result = assitUrl + '#ok|' + imgUrl;
				}
				
				// 返回结果
				res.writeHead(200, {
					'Content-type': 'text/html'
				});
				res.end('<iframe src="' + result + '"></iframe>');
			});
		});

	} else {
		// ---------------------- 其他路由，直接作为静态文件返回 ----------------------
		var pathname = url.parse(req.url).pathname;
		var filepath = path.join(__dirname, pathname);
		fs.readFile(filepath, function (err, file) {
			if (err) {
				res.writeHead(404);
				console.log('response file error: ' + filepath);
				res.end('404 NOT FOUND...');
				return;
			}

			if (filepath.slice(filepath.lastIndexOf('.') - filepath.length) === '.css') {
				// 兼容IE
				res.writeHead('200', {'Content-type': 'text/css'});
			} else {
				res.writeHead('200');
			}
			console.log('response file success: ' + filepath);
			res.end(file);
		});
	}

}).listen(port);

// 监听 localhost port 端口
console.log('server start at ' + port + '...');
