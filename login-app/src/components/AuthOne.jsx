import { useState } from 'react'
import "./AuthOne.css"
import api from "./../api.js"
import { useNavigate } from "react-router-dom"

// smki qpje djbc zkef

const AuthOne = () => {
    const [isLogin,setLogin] = useState(true);
    const [isForgot,setForgot] = useState(false);
    const [isCodeSend,setCodeSend] = useState(false);
    const [isSendCode,setSendCode] = useState("");
    const [forgotEmail,setForgotEmail] = useState("");
    const [forgotResetCode,setForgotResetCode] = useState("");
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [hideUpdatePassword, setHideUpdatePassword] = useState(false);

    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        username:"",
        email:"",
        password:""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    }

    const updateNewPassword = async (e) => {
        e.preventDefault();
        if(!newPassword || !confirmPassword){
            alert("Please enter both passwords");
            return;
        }
        if(newPassword !== confirmPassword){
            alert("Passwords do not match");
            return;
        }
        try{
            const response = await api.post(
                "/update-password",
                {email:forgotEmail,reset_code:forgotResetCode,new_password:newPassword}
            );
            alert(response.data.message);
            setShowUpdatePassword(false);
            setForgot(false);
            setHideUpdatePassword(true);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            alert(error.response.data.detail);
        }
    }

    const sendCode = async (e) => {
        e.preventDefault();
        if(!forgotEmail){
            alert("Please enter your email address");
            return;
        }else{
            try{
                const response = await api.post(
                    "/send-reset-code",
                    {email:forgotEmail}
                )
                setCodeSend(true);
                setForgotResetCode(response.data.reset_code);
            } catch (error) {
                alert(error.response.data.detail);
            }
        }
    }

    const validateCodeSubmit = async (e) => {
        e.preventDefault();
        if(!isSendCode){
            alert("Please enter your send code");
            return;
        }else{
            if(forgotResetCode == isSendCode){
                alert("Code validated successfully. You can now reset your password.");
                //setForgot(false);
                setShowUpdatePassword(true);
            }else{
                alert("Invalid code. Please try again.");
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(isLogin){
             try {

                const response = await api.post(
                    "/login",
                    formData
                );

                localStorage.setItem(
                    "token",
                    response.data.access_token
                );

                await syncCartAfterLogin();

                alert("Login Successful"+response.data.access_token);
                    navigate("/dashboard");
            } catch (error) {

                console.log(error);

                alert(
                    error?.response?.data?.detail ||
                    error.message ||
                    "Something went wrong"
                );

            }
            console.log("Login Data:",formdata);
        }else{
            try {

                const response = await api.post(
                    "/register",
                    formData
                );

                alert(response.data.message);

                } catch (error) {

                alert(error.response.data.detail);

                }
            console.log("Register Data:",formData);
        }
    }

    const syncCartAfterLogin = async () => {
        const token = localStorage.getItem("token");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) return;

        try {
            const response = await api.post(
                "/cart/save",
                cart,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Cart:- ", response.data);
            localStorage.removeItem("cart");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex login-outer maroon-c justify-center align-center">
            <div className="login-block flex flex-col justify-center px-6 py-12 lg:px-8">
                <div className={`login-form ${!isLogin ? "hide-block" : ""} ${isForgot ? "forgot-hide-block" : ""}`}>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label for="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
                            <div className="mt-2">
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required autocomplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                            <label for="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
                            <div className="text-sm">
                                <a href="javascript:void(0)" onClick={() => setForgot(true)} className="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                            </div>
                            </div>
                            <div className="mt-2">
                            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required autocomplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
                        </div>
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-400">
                        Not a member?
                        <a href="javascript:void(0)" onClick={() => setLogin(false)} className="font-semibold text-indigo-400 hover:text-indigo-300"> Create an account</a>
                        </p>
                    </div>
                </div> 

                <div className={`${showUpdatePassword ? "show-update-password" : "hide-update-password"} ${hideUpdatePassword ? "hide-update-password" : ""}`}>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Update Password</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={updateNewPassword} className="space-y-6">
                        <div>
                            <label for="newPassword" className="block text-sm/6 font-medium text-gray-100">New Password</label>
                            <div className="mt-2">
                            <input id="newPassword" type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autocomplete="new-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                            <label for="confirmPassword" className="block text-sm/6 font-medium text-gray-100">Confirm New Password</label>
                            </div>
                            <div className="mt-2">
                            <input id="confirmPassword" type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Update Password</button>
                        </div>
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-400">
                        Not a member?
                        <a href="javascript:void(0)" onClick={() => {setShowUpdatePassword(false);setForgot(false);setHideUpdatePassword(true)}} className="font-semibold text-indigo-400 hover:text-indigo-300"> Login</a>
                        </p>
                    </div>    
                </div> 

                <div className={showUpdatePassword ? "forgot-ac-block-hide" : isForgot ? "forgot-account" : "forgot-ac-block-hide"}>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Forgot Password</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={validateCodeSubmit} className="space-y-6">
                        <div>
                            <label for="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
                            <div className="mt-2">
                            <input id="email" type="email" name="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required autocomplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                            <label for="code" className="block text-sm/6 font-medium text-gray-100">Enter Code</label>
                            <div className="text-sm">
                                <a href="javascript:void(0)" onClick={sendCode} className="font-semibold text-indigo-400 hover:text-indigo-300">{isCodeSend ? "Resend Code" : "Send Code"}?</a>
                            </div>
                            </div>
                            <div className="mt-2">
                            <input id="code" type="text" name="code" value={isSendCode} onChange={(e) => setSendCode(e.target.value)} required className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Validate Code</button>
                        </div>
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-400">
                        If you got password, Please login?
                        <a href="javascript:void(0)" onClick={() => setForgot(false)} className="font-semibold text-indigo-400 hover:text-indigo-300"> Login</a>
                        </p>
                    </div>    
                </div> 
                <div className={isLogin ? "hide-account" : "create-account"}>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" />
                        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-white">Create your account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                            <label for="fullName" className="block text-sm/6 font-medium text-gray-100">Full name</label>
                            <div className="mt-2">
                            <input id="fullName" type="text" name="username" value={formData.username} onChange={handleChange} required autocomplete="name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>
                        <div>
                            <label for="email" className="block text-sm/6 font-medium text-gray-100">Email address</label>
                            <div className="mt-2">
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required autocomplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                            <label for="password" className="block text-sm/6 font-medium text-gray-100">Password</label>
                            </div>
                            <div className="mt-2">
                            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required autocomplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
                        </div>
                        </form>

                        <p className="mt-5 text-center text-sm/6 text-gray-400">
                        If you have an account, Please login ?
                        <a href="javascript:void(0)" onClick={() => setLogin(true)} className="font-semibold text-indigo-400 hover:text-indigo-300"> Login</a>
                        </p>
                    </div>
                </div>      
            </div>
        </div>
    )
}

export default AuthOne;