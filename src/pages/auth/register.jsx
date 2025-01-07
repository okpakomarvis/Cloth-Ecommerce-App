import { useState } from "react"
import CommonForm from "@/components/common/form"
import { registerFormControls } from "@/components/config"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { registerUser } from "@/store/auth-slice"
import { useToast } from "@/hooks/use-toast"


const initialState = {
    username: '',
    email:'',
    password:''
}

function AuthRegister(){
    const [formData , setFormData] = useState(initialState);
    console.log("form : "+formData.email);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();

    function onSubmit(event){
        event.preventDefault()
        dispatch(registerUser(formData)).then((data)=> {
            if(data?.payload?.success){
                toast({
                    title: data?.payload?.message
                })
                navigate('/auth/login')
            } else{
                 toast({
                    title: data?.payload?.message,
                    variant: "destructive"
                })
            }
            //console.log("data: "+data);
        });
    }

    return(
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3x1 font-bold tracking-tight text-forground">Create new account</h1>
                <p className="mt-2">Already have an Account</p>
                <Link  className="font-medium ml-2 text-primary hover:underline" to="/auth/login">Login</Link>
            </div>
            <CommonForm 
            formControls={registerFormControls}
            buttonText={'Signup'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            /> 
        </div>
    )
}

export default AuthRegister