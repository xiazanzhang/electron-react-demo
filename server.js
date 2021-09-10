
const url = require('url')
const path = require('path');

const Koa = require('koa');
const server = require('koa-static');
const proxy = require('koa-proxies')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')

const app = new Koa();

/**
 * 
 * @param {*} port 
 */
exports.createServer = (port) => {
  return new Promise((resolve) => {
    // 去除请求的静态资源文件 hash 值
    app.use(async (ctx, next) => {
      var pathname = __dirname + url.parse('/dist' + ctx.req.url).pathname

      if (ctx.url.indexOf('/media') !== -1) {
        ctx.url = ctx.url.split('.')[0] + path.extname(pathname)
      }

      await next();
    });

    // 静态文件解析
    app.use(server('build'))

    // 日志
    app.use(logger())

    // 反向代理
    app.use(proxy('/api/*', {
      target: 'http://ip-api.com',
      changeOrigin: true,
      logs: true
    }))

    // 处理 POST 请求数据
    app.use(bodyParser())

    // 监听端口
    app.listen(port);

    const host = `http://127.0.0.1:${port}`

    console.log(`http server start: ${host}`);

    resolve(host)
  })
}