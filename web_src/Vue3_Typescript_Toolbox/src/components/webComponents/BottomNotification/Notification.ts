import { ElNotification } from 'element-plus'


export class NotificationUnit{
    key:string="null"
    title:string=""
    message:string=""
    type:NotificationType=NotificationType.info
    duration:number=0
    onConfirm:(()=>void)|null=null
    onDelete:(()=>void)|null=null
    
    constructor(key:string,title:string,message:string,type:NotificationType,duration:number,onConfirm:()=>void,onDelete:(()=>void)|null){
        this.key = key
        this.title = title
        this.message = message
        this.type = type
        this.duration = duration<8000?8000:duration
        this.onConfirm = onConfirm
        this.onDelete = onDelete
    }
    // 重新弹出

    static _getType(type:NotificationType){
        let comments={
            
        }

        switch(type){
            case NotificationType.success:return "success";
            case NotificationType.warning:return "warning";
            case NotificationType.info:return "info";
            case NotificationType.error:return "error";
        }
    }

    showNotification(){
        let _message = this.message.slice(0,100)+"...[点击查看详情]"
        console.log(this.duration)
        return ElNotification({
            title: this.title,
            message: _message,
            type:NotificationUnit._getType(this.type),
            duration:this.duration,
            position: 'bottom-right',
            zIndex:5000,
            onClick(){
                //什么都不做
                // console.log("click!!")
            },
            onClose(){
                //什么都不做
                // console.log("close!!")
            }
        });
    }
}

export enum NotificationType{
    info,success,warning,error
}