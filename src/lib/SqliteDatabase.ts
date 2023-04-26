/**
    原生sqlite3中：
    1、db.run表示以数据库身份执行一条sql
    2、db.exec表示以数据库身份执行多条sql（可以用多次执行db.run代替exec）
    3、db.prepare(sql) 表示预编译单条sql，可以防止SQL注入，返回statement，简称stam
    4、stam.run(arg[]) 表示以执行方式执行预编译SQL,arg[]为占位符参数
    5、stam.all(arg[],callback) 表示以查询方式执行预编译SQL，查询结果以callback一次性返回
    6、stam.each(arg[],callback) 表示以查询方式执行预编译SQL，与all区别不同，each是查询到一条结果就调用一次callback，以callback方式返回
    7、db有run、exec（预编译没有）、each、get、all等，与预编译区别就是，db的是使用数据库身份，没有经过预编译，容易被SQL注入
*/


import { Database, RunResult, Statement } from "sqlite3"
import * as fs_extra from 'fs-extra';

export enum ChainCallbackFlag {
    KeepGoing, Commit, Rollback
}
export type chainCallbackReturn = { flag: ChainCallbackFlag, nextChainParams?: any }
export type ChainSqlExecutor = (arg: any[]) => Promise<RunResult | any[]>
export type ChainCallback = (executor: ChainSqlExecutor, lastChainParams?: any) => Promise<chainCallbackReturn>
export class TransactionChain {
    name: string
    next: TransactionChain = null
    pre: TransactionChain = null
    callback: ChainCallback
    constructor(name: string, callback: ChainCallback) {
        this.name = name;
        this.callback = callback;
    }
    public doChain(name: string, callback: ChainCallback): TransactionChain {
        this.next = new TransactionChain(name, callback)
        this.next.pre = this
        return this.next
    }
}



/**
 * 将statement的run变成同步执行
 * @param stam 
 * @param args 
 */
async function statementRunAsync(stam: Statement, args: any[]): Promise<RunResult> {
    return new Promise((res, rej) => {
        stam.run(args, function (err: Error) {
            if (err) {
                rej(err)
            } else res(this)
        })
    })
}
/**
 * 将statement的all变成同步执行
 * @param stam 
 * @param args 
 */
async function statementAllAsync(stam: Statement, args: any[]): Promise<any[]> {
    return new Promise((res, rej) => {
        stam.all(args, function (err: Error, row: any[]) {
            if (err) {
                rej(err)
            } else res(row)
        })
    })
}

type PrepareSqlObj = {
    sql: string
    statement: Statement
    isQuery: boolean
}

export class SqliteDatabase {
    // 数据库命令常量
    private static CommandOfDB = {
        BEGIN_TRANSACTION: "BEGIN TRANSACTION",
        COMMIT: "COMMIT",
        ROLLBACK: "ROLLBACK",
        READ_UNCOMMITTED: "PRAGMA read_uncommitted = 0"
    }

    // 数据库预存储，用于保持会话一致
    private static databaseMap = new Map<string, SqliteDatabase>();

    static createDatabase(filename: string): Promise<SqliteDatabase> {
        return new Promise((resolve, reject) => {
            if (SqliteDatabase.databaseMap.has(filename)) {
                resolve(SqliteDatabase.databaseMap.get(filename))
            } else {
                if(!fs_extra.existsSync(filename)){
                    let dir = (filename.replace(/\\/g,"/")).slice(0,filename.lastIndexOf("/"))
                    fs_extra.mkdirSync(dir)
                }
                let db = new SqliteDatabase(filename, (err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        SqliteDatabase.databaseMap.set(filename, db)
                        resolve(db);
                    }
                });
            }
        })
    }



    private db: Database
    private prepareSqlMap = new Map<string, PrepareSqlObj>();
    private constructor(filename: string, callback: (err: Error) => void) {
        this.db = new Database(filename, (err: Error) => {
            if (!err) {
                // 可重复读隔离级别
                this.db.run(SqliteDatabase.CommandOfDB.READ_UNCOMMITTED)
            }
            callback(err)
        });
    }

    /**
     * 准备预编译sql
     * @param name sql索引名称
     * @param sql 单条sql语句
     * @param replaceOld 强制替换 
     */
    prepareSql(name: string, sql: string, replaceOld: boolean = false): boolean {
        if (!this.prepareSqlMap.has(name) || replaceOld == true) {
            if (replaceOld && this.prepareSqlMap.has(name)) {
                this.prepareSqlMap.get(name).statement.finalize();
            }
            sql = sql.trim();
            let stam = this.db.prepare(sql);
            let isQuery = sql.toLowerCase().indexOf("select") == 0;
            this.prepareSqlMap.set(name, { sql: sql, statement: stam, isQuery: isQuery })
            return true
        }
        return false
    }
    /**
     * 释放预编译sql
     * @param name 
     */
    releasePrepare(name: string): void {
        if (this.prepareSqlMap.has(name)) {
            this.prepareSqlMap.get(name).statement.finalize();
            this.prepareSqlMap.delete(name)
        }
    }

    /**
     * 执行预编译SQL（常用于更新、插入、删除）
     * @param name 预编译SQL名称
     * @param args SQL参数
     */
    runByPrepareSql(name: string, ...args: any): Promise<RunResult> {
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.prepareSqlMap.has(name)) {
                let stam = that.prepareSqlMap.get(name).statement;
                stam.run(...args, function (err: Error) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(this)
                    }
                })
            } else {
                reject(`Cannot find sql prepared of name of '${name}'`)
            }
        })
    }

    /**
     * 以查询方式执行预编译SQL
     * @param name 
     * @param args 
     */
    queryByPrepareSql(name: string, args: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (this.prepareSqlMap.has(name)) {
                let stam = this.prepareSqlMap.get(name).statement;
                stam.all(args, (err: Error, row: any[]) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row)
                    }
                })
            } else {
                reject(`Cannot find sql prepared of name of '${name}'`)
            }
        })
    }

    /**
     * 直接执行多条SQL语句（小心sql注入）
     * @param sql 
     */
    execSql(sql: string): Promise<Statement> {
        return new Promise((res, rej) => {
            this.db.exec(sql, function (err) {
                if (err) {
                    rej(err)
                } else {
                    res(this)
                }
            })
        })
    }

    /**
     * 获取数据库本体
     */
    getDatabase(): Database {
        return this.db
    }


    /**
     * 以串行化事务方式执行预编译SQL
     * @param names 预编译名称列表
     * @param argsArray 参数数组
     * @param throwErrIfNameNotExists 如果名称不存在是否报错 
    */
    prepareSqlSerializedTransaction(config: { name: string, args: any[] }[], throwErrIfNameNotExists: boolean = false): Promise<RunResult[]> {
        let that = this;
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(SqliteDatabase.CommandOfDB.BEGIN_TRANSACTION, async function (err: Error) {
                    if(err){return reject(err);}

                    let result: RunResult[] = []
                    for (let i = 0; i < config.length; i++) {
                        let prepareSqlName = config[i].name;
                        if (that.prepareSqlMap.has(prepareSqlName)) {
                            let stam = that.prepareSqlMap.get(prepareSqlName).statement;
    
                            try {
                                let _result = await statementRunAsync(stam, config[i].args)
                                result.push({ lastID: _result.lastID, changes: _result.changes } as RunResult)
                            } catch (err) {
                                that.db.run(SqliteDatabase.CommandOfDB.ROLLBACK)
                                return reject(err)
                            }
    
                        } else if (throwErrIfNameNotExists == true) {
                            that.db.run(SqliteDatabase.CommandOfDB.ROLLBACK)
                            return reject(`Cannot find sql prepared of name of '${[prepareSqlName]}'`)
                        }
                    }
    
                    that.db.run(SqliteDatabase.CommandOfDB.COMMIT)
                    return resolve(result)
                })
            })
        })
    }


    prepareSqlChainTransaction(chain: TransactionChain, throwErrIfNameNotExists: boolean = false): Promise<void> {
        let that = this;
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(SqliteDatabase.CommandOfDB.BEGIN_TRANSACTION, async function (err: Error) {
                    if(err){return reject(err);}
                    
                    let _chain = chain;
                    let lastChainParam = null
                    while (_chain != null) {
                        let prepareSqlName = _chain.name;

                        if (that.prepareSqlMap.has(prepareSqlName)) {
                            let prepareObj = that.prepareSqlMap.get(prepareSqlName);
                            let callbackResult: chainCallbackReturn = null

                            try {
                                let callbackExecutor: ChainSqlExecutor
                                if (prepareObj.isQuery) {
                                    callbackExecutor = async function (args: any[]) {
                                        return await statementAllAsync(prepareObj.statement, args)
                                    }
                                } else {
                                    callbackExecutor = async function (args: any[]) {
                                        return await statementRunAsync(prepareObj.statement, args)
                                    }
                                }
                                callbackResult = await _chain.callback(callbackExecutor, lastChainParam)
                                if (callbackResult != null) {
                                    lastChainParam = callbackResult.nextChainParams

                                    if (callbackResult.flag == ChainCallbackFlag.Commit) {
                                        that.db.run(SqliteDatabase.CommandOfDB.COMMIT)
                                        return resolve()
                                    } else if (callbackResult.flag == ChainCallbackFlag.Rollback) {
                                        that.db.run(SqliteDatabase.CommandOfDB.ROLLBACK)
                                        return resolve()
                                    }
                                }
                            } catch (err) {
                                that.db.run(SqliteDatabase.CommandOfDB.ROLLBACK)
                                return reject(err)
                            }

                        } else if (throwErrIfNameNotExists == true) {
                            that.db.run(SqliteDatabase.CommandOfDB.ROLLBACK)
                            return reject(`Cannot find sql prepared of name of '${[prepareSqlName]}'`)
                        }

                        _chain = _chain.next;
                    }
                    //没有显式的提交则默认提交
                    that.db.run(SqliteDatabase.CommandOfDB.COMMIT)
                    return resolve()
                })
            })
        })
    }
}





// async function main() {
//     let sd = await SqliteDatabase.createDatabase("./t.db");
//     try {
//         let result = await sd.execSql(`
//             CREATE TABLE testdb (
//                 key TEXT primary key,
//                 value TEXT
//             );
//         `)
//     } catch (err) { }

//     sd.prepareSql("insert", `insert into testdb values(?,?)`)
//     sd.prepareSql("query", `select * from testdb where key = ?`)
//     sd.prepareSql("queryAll", `select * from testdb`)

//     try{
//         for(let i=0; i<5; i++){
//             let result = await sd.runByPrepareSql("insert",["key"+i,"value"+i])
//             console.log(result)
//         }
//         let result = await sd.runByPrepareSql("insert",["key"+2,"value"+2])
//         console.log(result)
//     }catch(err){
//         console.log(err.stack)
//     }

    // console.log(await sd.prepareSqlSerializedTransaction([
    //     {name:"insert",args:["key1","value1"]}, 
    //     {name:"insert",args:["key2","value2"]}, 
    //     {name:"insert",args:["key3","value3"]}, 
    //     {name:"insert",args:["key4","value4"]}, 
    //     {name:"query",args:["key3"]}, 
    //     {name:"queryAll",args:[]}, 
    // ]))

    // let transactionChain = new TransactionChain("insert", async (executor, lastChainParams) => {
    //     let result = await executor(["key1", "value1"])
    //     return new Promise((res, rej) => {
    //         res({ flag: ChainCallbackFlag.KeepGoing, nextChainParams: "nextChainParams insert" })
    //     })
    // })
    // .doChain("insert", async (executor, lastChainParams) => {
    //     let result = await executor(["key2", "value2"])
    //     return new Promise((res, rej) => {
    //         res({ flag: ChainCallbackFlag.KeepGoing, nextChainParams: "nextChainParams insert" })
    //     })
    // })
    // .doChain("insert", async (executor, lastChainParams) => {
    //     let result = await executor(["key3", "value3"])
    //     return new Promise((res, rej) => {
    //         res({ flag: ChainCallbackFlag.KeepGoing, nextChainParams: "nextChainParams insert" })
    //     })
    // })
    // .doChain("insert", async (executor, lastChainParams) => {
    //     let result = await executor(["key4", "value4"])
    //     return new Promise((res, rej) => {
    //         res({ flag: ChainCallbackFlag.KeepGoing, nextChainParams: "nextChainParams insert" })
    //     })
    // })
    // .doChain("query", async (executor, lastChainParams) => {
    //     let result = await executor(["key2"])
    //     return new Promise((res, rej) => {
    //         res({ flag: ChainCallbackFlag.KeepGoing, nextChainParams: "nextChainParams query" })
    //     })
    // })
    // .doChain("queryAll", async (executor, lastChainParams) => {
    //     let result = await executor([])
    //     console.log(result)
    //     return new Promise((res, rej) => {
    //         res({ flag: ChainCallbackFlag.Commit, nextChainParams: "nextChainParams queryAll" })
    //     })
    // })
    // while(transactionChain.pre != null){
    //     transactionChain = transactionChain.pre
    // }
    // sd.prepareSqlChainTransaction(transactionChain, true)
// }
// main()