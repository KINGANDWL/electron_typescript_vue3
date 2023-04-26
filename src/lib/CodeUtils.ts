export class CodeUtils {
    private static getErrorLine(filepath:string): string {
        try {
            throw new Error("findLine");
        } catch (_err) {
            let err: Error = _err
            let lines: string[] = err.stack.toString().split("\n");//console.log(lines)
            let last: string = null
            for (let i in lines) {
                if (lines[i].indexOf(filepath) >= 0) {
                    last = lines[i]
                }
            }
            return last
        }
    }

    /**
     * 调用当前函数的代码所在行号
     */
    static currentCodeLine(your__filename:string): number {
        let codeLine = CodeUtils.getErrorLine(your__filename)
        if (codeLine != null) {
            let startPos = codeLine.search(/[0-9]+:[0-9]+/)
            let endPos = codeLine.search(/:[0-9]+\)/)
            if (startPos >= 0 && endPos >= 0) {
                let line = parseInt(codeLine.slice(startPos, endPos))
                return line
            }
        }
        return -1
    }

    /**
     * 调用当前函数的的代码所在位置（完整路径）
     */
    static currentCodePosition(filepath:string): string {
        let codeLine = CodeUtils.getErrorLine(filepath)
        if (codeLine != null) {
            let startPos = codeLine.indexOf(" (") + 2
            let endPos = codeLine.length - 1
            if (startPos >= 0 && endPos >= 0) {
                let position: string = codeLine.slice(startPos, endPos)
                return position
            }
        }
        return null
    }

    /**
     * 获取当前函数名称
     * @param level 跳出层次，1是函数getFunName
     * function myfun(){
     *  let name = getFunName(2); //选择2，第一层是getFunName，第二层是当前函数
     *  console.log(name); //myfun
     * }
     */
    static getFunName(level: number) {
        return new Error().stack.split("\n")[level].trim().split(" ")[1];
    }
}