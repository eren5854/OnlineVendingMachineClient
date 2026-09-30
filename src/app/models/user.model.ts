export class UserModel{
    id!:string;
    lastLoginAt?:string;
    role!:any;
    status!:UserStatus;
    userName!:string;
    email!:string;
    password!:string;
    confirmPassword!:string;
    isActive?:boolean;
    createdAt!:string;
    updatedAt?:string;
}

export class UserRole{
    name!:string;
    value!:number
}

export class UserStatus{
    name!:string;
    value!:number;
}