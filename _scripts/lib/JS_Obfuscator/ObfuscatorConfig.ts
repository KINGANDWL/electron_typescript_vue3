export interface ObfuscatorConfig {
    /**
     * 代码压缩（压缩无用的空格回车换行等）
     */
    compact?: boolean,
    /**
     * 死代码注入
     */
    deadCodeInjection?: boolean,
    /**
     * 死代码注入比例
     */
    deadCodeInjectionThreshold?: number,
    /**
     * 控制流平展化（相当于使用数组进行代码流跳转，隐藏了正常情况下的控制流逻辑）
     */
    controlFlowFlattening?: boolean,
    /**
     * 控制流平展化比例
     */
    controlFlowFlatteningThreshold?: number,
    /**
     * 数字常量替换为表达式
     */
    numbersToExpressions?: boolean,
    /**
     * 变量名称简化
     */
    simplify?: boolean,
    /**
     * 字符串数组化且打乱
     */
    stringArrayShuffle?: boolean,
    /**
     * 分割字符串为多个部分
     */
    splitStrings?: boolean,
    /**
     * 字符串分割且数组化
     */
    stringArray?: boolean,
}


export const ObfuscatorDefaultConfig:ObfuscatorConfig = {
    compact: true,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    stringArrayShuffle: true,
    splitStrings: true,
    stringArray:true,
}