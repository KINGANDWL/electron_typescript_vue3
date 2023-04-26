// const ExcludeAssetsPlugin = require('webpack-exclude-assets-plugin');
module.exports = {
	outputDir: 'buildVue',
	publicPath: "./",
	productionSourceMap: true, //false将关闭调试的源码文件，在打包时设置为false ！！

	// configureWebpack: {
	// 	devtool: ''
	// },

	// configureWebpack: {
	// 	plugins: [
	// 		new ExcludeAssetsPlugin({
	// 			path: __dirname,
	// 			excludeAssets: /\.ts$/
	// 		})
	// 	]
	// }

}  
