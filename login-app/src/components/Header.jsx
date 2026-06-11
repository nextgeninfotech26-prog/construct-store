import "./Header.css";
import { useState, useEffect } from "react"
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom"
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import api from "./../api.js"

function Header(){
    const { cartCount } = useAuth();
    const [user, setUser] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        image_url: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {

            const response = await api.get(
                "/profile"
            );

            setUser(response.data);

        } catch (error) {
            console.error(error);
        }
    };
    return(
        <header>
            <div className="header flex justify-between items-center px-6 py-4">

                <div>
                    <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" alt="logo" className="w-10" />
                </div>

                <div className="flex gap-8">
                     <div className="link-hover-l-to-r">
                        <Link to="/">Products</Link>
                    </div>

                    <div className="link-hover-l-to-r">
                        <Link to="/orders">Orders</Link>
                    </div>

                    <div className="link-hover-l-to-r">
                        <Link to="/cart">Cart ({cartCount})</Link>
                    </div>
                </div>

                <div className="relative group">
                    <img
                        src={user?.image_url
                                ? `http://localhost:8000${user.image_url}`
                                : "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                        } alt="profile" className=" w-11 h-11 rounded-full object-cover cursor-pointer transition-all duration-300 group-hover:scale-110 border-2 border-gray-200"/>
                    <div
                        className="
                            absolute right-0 top-14
                            w-72
                            bg-white/80
                            backdrop-blur-lg
                            rounded-2xl
                            shadow-2xl
                            border border-gray-100

                            p-5

                            opacity-0
                            invisible

                            translate-y-4
                            scale-95

                            transition-all
                            duration-300

                            group-hover:opacity-100
                            group-hover:visible
                            group-hover:translate-y-0
                            group-hover:scale-100

                            z-50
                        "
                    >
                        <div className="flex justify-between items-start">
                            <img
                                src={
                                    user?.image_url
                                        ? `http://localhost:8000${user.image_url}`
                                        : "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                                }
                                alt="profile"
                                className="w-16 h-16 rounded-full object-cover"
                            />

                            <Link
                                to="/profile"
                                className="
                                    p-2
                                    rounded-full
                                    bg-gray-100
                                    hover:bg-blue-600
                                    hover:text-white
                                    transition-all
                                    duration-300
                                    hover:rotate-12
                                "
                            >
                                <PencilSquareIcon className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-semibold text-lg text-gray-800">
                                {user?.username}
                            </h3>

                            <p className="text-sm text-gray-500 break-all">
                                {user?.email}
                            </p>
                        </div>

                        <Link
                            to="/profile"
                            className="
                                mt-5
                                block
                                text-center
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                py-2.5
                                rounded-xl
                                font-medium
                                transition-all
                                duration-300
                            "
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>

        </header>    


    )
}
export default Header;