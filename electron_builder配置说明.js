// electron npm镜像:
let electron_mirror = "https://npmmirror.com/mirrors/electron/"


// electron-builder配置说明:
let electron_builder配置说明 = {
    "build": {
        "appId": "com.test", // appid
        "productName": "test",// 程序名称
        "files": [
            // 需要打包的文件目录，如果根目录有项目的文件，需要把这些文件都写进去，不要的不用写
            "build/icons/*", "src/**/*", "main.js", "preload.js", "renderer.js", "index.html", "node_modules/**/*"
        ],
        "directories": {
            // 打包输出的目录
            "output": "build/app",
            // package所在路径
            "app": "./",
            // 打包所需资源路径
            "buildResources": "assets"
        },
        "nsis": { //nsis安装器配置
            // 是否需要点击安装，自动更新需要关掉
            "oneClick": false,
            //是否能够选择安装路径
            "allowToChangeInstallationDirectory": true,
            // 安装程序图标（最好用256 × 256以上的图标）
            "installerIcon": "./dist/icons/installer.ico",
            // 安装时界面头部右边图片，只能用bmp格式的
            "installerHeader": "./build/icons/installerHeader.bmp",
            //卸载程序图标（最好用256 × 256以上的图标）
            "uninstallerIcon": "./dist/icons/uninstaller.ico",
            // 是否需要辅助安装页面
            "perMachine": true,
            // 创建桌面图标
            "createDesktopShortcut": true,
            // 创建开始菜单图标
            "createStartMenuShortcut": false,
            //安装界面的软件许可证，如果不配置，不会出现软件许可证界面
            "license": "./src/license/license.html"
        },
        "win": {
            "icon": "./dist/icons/aims.ico",
            //图标文件，分辨率至少在256*256以上，不然会报错
            "target": [{
                "target": "nsis",
                // 输出目录的方式
                "arch": [
                    // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大，所以建议直接打32的安装包。
                    "x64", "ia32"
                ]
            }]
        },
        "linux": {
            //Linux打包配置，现在只是在windows打包，未测试过
            "icon": "./dist/icons/main.png"
            //图片当前格式只能是512x512分辨率的
        },
        "mac": {
            //Mac打包配置，现在只是在windows打包，未测试过
            "target": "dmg",
            "icon": "./dist/icons/main.png"
            //图标的分辨率至少在512x512以上
        },
        "dmg": {
            //mac打包dmg格式配置，现在只是在windows打包，未测试过
            "title": "Mac程序",
            "icon": "./dist/icons/main.png",
            "contents": [
                { "x": 110, "y": 150 },
                //现在只是在windows打包，未测试过,不清楚该配置是什么
                { "x": 240, "y": 150, "type": "link", "path": "/Applications" }],
            "window": { "x": 400, "y": 400 }
        },
        "publish": [
            //版本更新配置，以后有需要的再学习
            { "provider": "generic", "url": "http://127.0.0.1:8080/updata/" }
        ]
    }
}