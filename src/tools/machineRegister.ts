const child_process = require("child_process")
const os = require("os")
const md5 = require("md5-node")
const iconv = require('iconv-lite');

// 更换盐即可更换结果
// let salt = "qw789v9zx877bv654j6h4g5oiu987xb3cv1das654fqw65e";

export enum ExceptionType{
    // 平台错误、机器信息缺失、检测到虚拟机
    MachinePlatformWrong,MachineMessageLoss,VMwarePlatformDetected
}
export function getExceptionMessage(type:ExceptionType){
    switch(type){
        case ExceptionType.MachinePlatformWrong: return "MachinePlatformWrong";
        case ExceptionType.MachineMessageLoss: return "MachineMessageLoss";
        case ExceptionType.VMwarePlatformDetected: return "VMwarePlatformDetected";
        default: return "Unknown"
    }
}

export function getMachineCode(salt:string,callback: (code: string | null,err:ExceptionType | null) => void) {
    //获取系统信息
    child_process.exec("systeminfo", { encoding: 'binary' }, (err, stdout, stderr) => {
        //编码转换
        let info = iconv.decode(stdout.replace(/(^\r\n)|(\r\n$)/g, ""), 'cp936')
        //转数组
        let infoArray = info.split("\r\n")
        let infoFilter = {
            hostName: {
                keyWord: "主机名",
                data: ""
            },
            userName: {
                keyWord: "注册的所有人",
                data: ""
            },
            productID: {
                keyWord: "产品 ID",
                data: ""
            },
            installDate: {
                keyWord: "初始安装日期",
                data: ""
            },
            manufacturer: {
                keyWord: "系统制造商",
                data: ""
            },
            systemModel: {
                keyWord: "系统型号",
                data: ""
            },
            systemType: {
                keyWord: "系统类型",
                data: ""
            },
            BOISVersion: {
                keyWord: "BIOS 版本",
                data: ""
            }
        }


        for (let key in infoFilter) {
            let get = false
            for (let i = 0; i < infoArray.length; i++) {
                let keyWord = infoFilter[key].keyWord
                if (infoArray[i].indexOf(keyWord) >= 0) {
                    infoFilter[key].data = infoArray[i].replace(keyWord + ":", "").replace(/^[ ]+/g, "")
                    get = true;
                    break
                }
            }
            //信息缺失
            if (!get) {
                // console.error(key + " cannot be found.")
                callback(null,ExceptionType.MachineMessageLoss)
                return;
            }
        }

        //非windows平台
        if (os.platform() != "win32") {
            // console.error("Program must be run in windows")
            callback(null,ExceptionType.MachinePlatformWrong)
            return;
        }

        //虚拟机
        if (
            infoFilter.BOISVersion.data.indexOf("VMware") >= 0 ||
            infoFilter.systemModel.data.indexOf("VMware") >= 0 ||
            infoFilter.manufacturer.data.indexOf("VMware") >= 0
        ) {
            // console.error("Unknown error")
            callback(null,ExceptionType.VMwarePlatformDetected)
            return;
        }

        let machineCode =
            md5(infoFilter.hostName.data + infoFilter.productID.data +salt) +
            md5(infoFilter.userName.data + infoFilter.installDate.data +salt) +
            md5(infoFilter.manufacturer.data + infoFilter.systemModel.data + infoFilter.systemType.data +salt) +
            md5(infoFilter.BOISVersion.data +salt);
        machineCode += md5(machineCode)

        // console.log("平台: " + os.platform())
        // console.log(infoFilter)

        // 前128位是机器码、后32为是校验码
        // 665d017fa1fa740d989b5bd4b06f23275f931cc4f734b6e80c47fdce32c3b5ce2e92c783eeb712517046e920ffadabec13d19344e5fa43b805621eaaf283ba24ebf1fec386c72bd6874f665deae709fd 160
        // console.log("机器码： 【" + machineCode + "】" + machineCode.length)
        // return machineCode
        
        callback(machineCode,null)
    })
}

export function getRegisterCode(salt:string,machineCode: string): string {
    if (machineCode != null && machineCode.length == 160) {
        let machineCodeMd5 = machineCode.slice(128, 160)
        machineCode = machineCode.slice(0, 128)
        if (md5(machineCode) == machineCodeMd5) {
            let num = [], chars = []
            for (let i = 0; i < 128; i++) {
                if (machineCode.charAt(i) >= '0' && machineCode.charAt(i) <= '9') {
                    num.push(machineCode.charAt(i))
                } else {
                    chars.push(machineCode.charAt(i))
                }
            }
            let newStr = num.join("") + chars.join("");
            // 20+30+40+38
            let _registerCode = md5(newStr.slice(0, 20)+salt) + md5(newStr.slice(20, 50)+salt) + md5(newStr.slice(50, 90)+salt) + md5(newStr.slice(90, 128)+salt)
            return _registerCode + md5(_registerCode)
        }
    }
    return null
}

export function isRegisterCode(salt:string,machineCode: string, registerCode: string): boolean {
    if (registerCode != null && registerCode.length == 160) {
        let registerCodeMd5 = registerCode.slice(128, 160)
        registerCode = registerCode.slice(0, 128)
        if (md5(registerCode) == registerCodeMd5) {
            let realRegisterCode = getRegisterCode(salt,machineCode)
            return realRegisterCode != null && realRegisterCode === (registerCode + registerCodeMd5)
        }
    }
    return false
}

let salt = "qw789v9zx877bv654j6h4g5oiu987xb3cv1das654fqw65e";
getMachineCode(salt,(code:string | null,err:ExceptionType | null)=>{
    // let machineCode = "665d017fa1fa740d989b5bd4b06f23275f931cc4f734b6e80c47fdce32c3b5ce2e92c783eeb712517046e920ffadabec13d19344e5fa43b805621eaaf283ba24ebf1fec386c72bd6874f665deae709fd";
    if(err != null){
        console.log(getExceptionMessage(err))
    }else{
        let machineCode = code;
        let registerCode =  getRegisterCode(salt,machineCode)
        
        console.log("机器码",machineCode)
        console.log("注册码",registerCode)
        console.log("匹配结果",isRegisterCode(salt,machineCode,registerCode))
    }
})
