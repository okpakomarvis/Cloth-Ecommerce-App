import { useState } from "react"
import CommonForm from "@/components/common/form"
import { loginFormControls, registerFormControls } from "@/components/config"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginUser } from "@/store/auth-slice"
import { useToast } from "@/hooks/use-toast"


const initialState = {
    email:'',
    password:''
}

function AuthLogin(){
    const [formData , setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const {toast} = useToast();

    function onSubmit(event){
        event.preventDefault();
        dispatch(loginUser(formData)).then((data)=>{
            console.log(data);
            if(data?.payload?.success){
                toast({
                    title: data?.payload?.message,
                })
                //navigate('/auth/login')
            }else{
                 toast({
                    title: data?.payload?.message,
                    variant: "destructive"
                })
            }
        })
    }
    return(
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3x1 font-bold tracking-tight text-forground">Sign in to your account</h1>
                <p className="mt-2">Don't have an Account</p>
                <Link  className="font-medium ml-2 text-primary hover:underline" to="/auth/register">register</Link>
            </div>
            <CommonForm 
            formControls={loginFormControls}
            buttonText={'sign in'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            /> 
        </div>
    )
}

export default AuthLogin