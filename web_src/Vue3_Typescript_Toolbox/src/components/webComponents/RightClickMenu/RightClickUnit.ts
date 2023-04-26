export interface RightClickListUnit {
    checked?: boolean,
    title: string;
    click: (obj: any) => boolean | null | undefined | void; //当返回false表示菜单选项被点击后不必关闭
    subUnit?: Array<RightClickListUnit> //子菜单，仅支持两层
}



