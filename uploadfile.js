var http = require('http');
var fs = require('fs');
var url = require('url');

//设定
const htmldir = "/www";
const port = 80;

//初始化变量
netreq=0;

// 创建服务器
http.createServer( function (request, response) {
	netreq = netreq + 1;
	
	// 解析请求，包括文件名
	var pathname = url.parse(request.url,true).pathname;
	var pathpart = url.parse(request.url,true).query;
	var pathval = url.parse(request.url,true).search;
   
	if (pathname == "/" ) {
		//无附加默认重定向index
		var pathname="/uploadimg.html";
		console.log("["+netreq+"]index.html");
		
	} else if ( pathname == "/upload" ){
		console.log("["+netreq+" UPLOAD] "+pathval);
		
		//获取图片数据流
		const chunks = [];
		request.on('data', chunk => {
			chunks.push(chunk);
		});
		
		//获取完写入HTTP服务器里
		request.on('end', () => {
			const buffer = Buffer.concat(chunks);
			var file="." + htmldir + "/p/" + pathpart.filename;
			
			//防止被覆盖
			fs.access(file,fs.constants.F_OK, (err) => {
				if(err){
					fs.writeFileSync(file, buffer ,function (err){
						if (err) console(err);
					});
					response.end("0");
				} else {
					console.log("Exist image file!");
					response.end("1");
				}
			});
		});
		return;
		
	} else {
		//输出信息
		console.log("["+netreq+"]"+htmldir + pathname);
	}

	//设定html目录
	var pathname= htmldir + pathname;
	   
	//获取文件类型
	var pathname_f = '.' + pathname;
	var headType = pathname_f.substr(pathname_f.lastIndexOf(".") + 1, pathname_f.length);
	   
	// 从文件系统中读取请求的文件内容
	fs.readFile(pathname.substr(1), function (err, data) {
		if (err) {
			// 404
			console.log(err + "\n" );
			response.writeHead(404, {'Content-Type': 'text/html'});
			response.end('<!DOCTYPE html><html><head><meta charset="utf-8"><style>.center {padding: 70px 0;text-align: center;}</style></head><body><h2><p class="center">Notfound</p></h2><p>' + err + '</p></body></html>'); 
		}else{
			//根据文件类型更改头部
			if (headType=="gif" || headType=="png" || headType=="jpg") {
				response.writeHead(200, {'Content-Type': 'image/' + headType});
			} else if (headType=="svg") {
				response.writeHead(200, {'Content-Type': 'image/svg+xml'});
			} else if (headType=="js") {
				response.writeHead(200, {'Content-Type': 'application/javascript'});
			} else if (headType=="mp4") {
				response.writeHead(200, {'Content-Type': 'video/' + headType});
			} else {
				response.writeHead(200, {'Content-Type': 'text/' + headType});
			}
		}
		
		// 响应文件内容
		response.end(data);
	});
}).listen(port);

// 控制台会输出以下信息
console.log('OK! Server running at http://127.0.0.1:' + port + '/');
console.log('____________________________________________\n');
console.log('');
