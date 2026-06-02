import { useState } from 'react'

const Auth = () => {
    const [isLogin,setLogin] = useState(true);

    const [formData,setFormData] = useState({
        name:"",
        email:"",
        password:""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isLogin){
            console.log("Login Data:",formdata);
            alert("Login Successfull");
        }else{
            console.log("Register Data:",formData);
            alert("Registration Successfull");
        }
    }

    return (
        <div class="flex login-outer maroon-c justify-center align-center">
            <div class="login-block flex flex-col justify-center px-6 py-12 lg:px-8">
                <div className={`login-form ${!isLogin ? "hide-block" : ""}`}>
                    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" class="mx-auto h-10 w-auto" />
                        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
                    </div>

                    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} class="space-y-6">
                        <div>
                            <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
                            <div class="mt-2">
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required autocomplete="email" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
                            <div class="text-sm">
                                <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                            </div>
                            </div>
                            <div class="mt-2">
                            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required autocomplete="current-password" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
                        </div>
                        </form>

                        <p class="mt-10 text-center text-sm/6 text-gray-400">
                        Not a member?
                        <a href="javascript:void(0)" onClick={() => setLogin(false)} class="font-semibold text-indigo-400 hover:text-indigo-300"> Create an account</a>
                        </p>
                    </div>
                </div>  
                <div class={isLogin ? "hide-account" : "create-account"}>
                    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" class="mx-auto h-10 w-auto" />
                        <h2 class="text-center text-2xl/9 font-bold tracking-tight text-white">Create your account</h2>
                    </div>

                    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} class="space-y-6">
                            <div>
                            <label for="fullName" class="block text-sm/6 font-medium text-gray-100">Full name</label>
                            <div class="mt-2">
                            <input id="fullName" type="text" name="name" value={formData.name} onChange={handleChange} required autocomplete="name" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>
                        <div>
                            <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
                            <div class="mt-2">
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required autocomplete="email" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
                            </div>
                            <div class="mt-2">
                            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required autocomplete="current-password" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
                        </div>
                        </form>

                        <p class="mt-5 text-center text-sm/6 text-gray-400">
                        Not a member?
                        <a href="javascript:void(0)" onClick={() => setLogin(true)} class="font-semibold text-indigo-400 hover:text-indigo-300"> Login</a>
                        </p>
                    </div>
                </div>      
            </div>
        </div>
    )
}

export default Auth;