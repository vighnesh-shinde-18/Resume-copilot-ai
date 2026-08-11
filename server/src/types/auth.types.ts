export interface RegisterUserBody
{
    username:string;
    email:string;
    password:string;
}
export interface RegisterUserResponse{
    username:string;
    email:string;
}

export interface LoginUserBody{
    email:string;
    password:string;
}
export interface LoginUserResponse{
     username:string;
    email:string;
}


