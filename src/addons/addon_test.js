const lib = require('../../build/Release/Hello.node')
lib.Hello('wow')
console.log(lib.MOD_ID)

//nodejs的addon原生插件需要在node本地环境运行或者使用electron进行运行，无法在vue的web项目下直接运行