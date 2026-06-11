import { useState, useEffect } from "react";
import api from "./../api.js"
import { useAuth } from "../AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import defaultUser from "../assets/default-user.jpg";
import { TrashIcon } from "@heroicons/react/24/outline";
//import "./Cart.css";

function Cart(){
    const location = useLocation();
    const navigate = useNavigate();
    const { token , cartCount , getExistingCartCount , isLoggedIn , setIsLoggedIn , isRegisteredOrLogin , setIsRegisteredOrLogin } = useAuth();
    //setIsLoggedIn(false);
    const [cartItems, setCartItems] = useState([]);
    const [addressSelected, setAddressSelected] = useState(false);
    const [cartData, setCartData] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""    
    });
    const [addressData, setAddressData] = useState({
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const getAddress = async () => {
        try {
            const response = await api.get("/address");

            setUserDetails({
                username: response.data.username,
                email: response.data.email,
                phone: response.data.phone || "",
                address: response.data.address || "",
                city: response.data.city || "",
                state: response.data.state || "",
                pincode: response.data.pincode || ""
            });

            console.log("Address Data:- ", response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setAddressData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const loadCartItems = async (e) => {
        try {
            if(token){
                const response = await api.get("/cart");
                setCartItems(response.data);
            }else{
                const cart = localStorage.getItem("cart");
                console.log("Cart:- ", cart);
                if(cart){
                    setCartItems(JSON.parse(cart));
                }
            }
        } catch (error) {
            console.error("Error loading cart items:", error);
        }
    }

    const saveAddress = async (e) => {
        try {
            const response = await api.put("/address/update", addressData);
            setShowAddressForm(false);
            getAddress();
        } catch (error) {
            console.error("Error saving address:", error);
        }
    }

    const cartHandleInputChange = (productId, value) => {
        const quantity = parseInt(value, 10);

        setCartQuantities(prev => ({
            ...prev,
            [productId]: isNaN(quantity) ? 1 : Math.max(1, quantity)
        }));
    };

    const cartHandleQuantityChange = (productId, change, currentQuantity) => {
        setCartData(prev => {
            const item = prev[productId];

            const quantity = Math.max(1, item.quantity + change);
            //const response = await api.post("/add-cart",{product_id:product.id,quantity:quantity});

            return {
                ...prev,
                [productId]: {
                    ...item,
                    quantity,
                    total: quantity * item.price
                }
            };
        });
    };  

    const confirmDelete = async () => {
        if (!selectedItem) return;

        try {
            await api.delete(`/cart/${selectedItem.id}`);

            setCartItems(prev =>
                prev.filter(item => item.id !== selectedItem.id)
            );

            setCartData(prev => {
                const updated = { ...prev };
                delete updated[selectedItem.product.id];
                return updated;
            });

            setSuccessMessage(
                `${selectedItem.product.name} removed from cart successfully`
            );

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

            setShowDeleteModal(false);
            setSelectedItem(null);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const total = Object.values(cartData)
            .reduce((sum, item) => sum + item.total, 0);

        setTotalAmount(total);
    }, [cartData]);

    useEffect(() => {
        const data = {};

        cartItems.forEach(item => {
            data[item.product.id] = {
                cart_id: item.id,
                product_id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.images?.[0]?.image_url,
                quantity: item.quantity,
                total: item.quantity * item.product.price
            };
        });

        setCartData(data);
        console.log("Cart Data:- ", data);
    }, [cartItems]);

    useEffect(() => {
        loadCartItems();
        getAddress();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {successMessage && (
                <div className="fixed top-5 right-5 z-[9999] bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl animate-bounce">
                    ✅ {successMessage}
                </div>
            )}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT SIDE - CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">

                <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-2xl font-semibold mb-4">
                    Shopping Cart ({cartItems.length} Items)
                </h2>

                {cartItems.map((item) => {

                    const quantity =
                        cartData[item.product.id]?.quantity || item.quantity;

                    const totalAmount =
                        item.product.price * quantity;

                    return (
                        <div
                            key={item.id}
                            className="
                                relative
                                flex flex-col md:flex-row
                                gap-4
                                p-4
                                bg-white
                                rounded-2xl
                                border
                                border-gray-200
                                shadow-sm
                                hover:shadow-lg
                                transition-all
                                duration-300
                                mb-4
                            "
                        >

                            {/* Delete Button */}
                            <button
                                onClick={() => {
                                    setSelectedItem(item);
                                    setShowDeleteModal(true);
                                }}
                                className="
                                    absolute
                                    top-3
                                    right-3
                                    p-2
                                    rounded-full
                                    bg-red-50
                                    text-red-500
                                    hover:bg-red-500
                                    hover:text-white
                                    hover:rotate-12
                                    hover:scale-110
                                    transition-all
                                    duration-300
                                "
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>

                            {/* Product Image */}
                            <img
                                src={item.product.images?.[0]?.image_url || ""}
                                alt={item.product.name}
                                className="
                                    w-28
                                    h-28
                                    rounded-xl
                                    object-cover
                                    border
                                "
                            />

                            {/* Product Details */}
                            <div className="flex-1 pr-10">
                                <h3 className="font-semibold text-lg">
                                    {item.product.name}
                                </h3>

                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                    {item.product.description}
                                </p>

                                <div className="mt-3">
                                    <span className="text-xl font-bold text-green-600">
                                        ₹{item.product.price.toFixed(2)}
                                    </span>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 mt-4">
                                    <button
                                        className="
                                            w-9
                                            h-9
                                            rounded-lg
                                            border
                                            border-gray-300
                                            hover:bg-gray-100
                                            transition
                                        "
                                        onClick={() =>
                                            cartHandleQuantityChange(
                                                item.product.id,
                                                -1,
                                                quantity
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span className="font-semibold text-lg min-w-[30px] text-center">
                                        {quantity}
                                    </span>

                                    <button
                                        className="
                                            w-9
                                            h-9
                                            rounded-lg
                                            border
                                            border-gray-300
                                            hover:bg-gray-100
                                            transition
                                        "
                                        onClick={() =>
                                            cartHandleQuantityChange(
                                                item.product.id,
                                                1,
                                                quantity
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="absolute bottom-4 right-4 text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Total
                                </p>

                                <p className="text-lg font-bold text-blue-600">
                                    ₹{totalAmount.toFixed(2)}
                                </p>
                            </div>

                        </div>
                    );
                })}
                </div>

            </div>

            {/* RIGHT SIDE - STEPS */}
            <div className="space-y-4">

                {/* STEP 1 - LOGIN */}
                {!isLoggedIn ? (
                <div className="bg-white rounded-xl shadow p-5">
                    <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                        Step 1: Login Required
                    </h3>

                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white">
                        1
                    </span>
                    </div>

                    <p className="text-gray-500 mb-4">
                    Please sign in to continue checkout.
                    </p>

                    <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg" onClick={() => {setIsRegisteredOrLogin(false);navigate("/login", {state: {from: location.pathname}});}}>
                        {/* <Link to="/login" state={{ from: location.pathname }} onClick={() => setIsRegisteredOrLogin(false)}>Sign In
                        </Link> */}
                        Sign In
                    </button>

                    <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg" onClick={() => {setIsRegisteredOrLogin(true);navigate("/login", {state: {from: location.pathname}});}}>
                        {/* <Link to="/login" state={{ from: location.pathname }} onClick={() => setIsRegisteredOrLogin(true)}>Sign Up</Link> */}
                        Sign Up
                    </button>
                    </div>
                </div>
                ) : (
                    <div className="bg-white rounded-xl shadow p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">
                                Step 1: Logged In
                            </h3>

                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white">
                                ✓
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <img
                                src={userDetails.image || defaultUser}
                                alt="Profile"
                                className="w-14 h-14 rounded-full object-cover border"
                            />

                            <div>
                                <p className="font-medium">
                                    {userDetails.username}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {userDetails.email}
                                </p>
                            </div>
                        </div>
                    </div>)}

                {/* STEP 2 - ADDRESS */}
                <div
                className={`bg-white rounded-xl shadow p-5 ${
                    !isLoggedIn
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                    Step 2: Delivery Address
                    </h3>

                    <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                        isLoggedIn
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                    >
                    2
                    </span>
                </div>

                
                <div className="border rounded-lg p-3">

                    <p className="font-medium">{userDetails.username}</p>

                    <p className="text-sm text-gray-600">
                        {userDetails.address}<br/>
                        {userDetails.city}, {userDetails.state}
                    </p>

                    <p className="text-sm text-gray-600">
                        {userDetails.pincode}
                    </p>

                    {showAddressForm && (
                        <div className="mt-4 border-t pt-4 space-y-3">
                            {/* Address Fields */}

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={addressData.phone}
                                onChange={handleAddressChange}
                                className="w-full border rounded-md px-3 py-2"
                            />

                            <textarea
                                name="address"
                                placeholder="Address"
                                rows="3"
                                value={addressData.address}
                                onChange={handleAddressChange}
                                className="w-full border rounded-md px-3 py-2"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={addressData.city}
                                    onChange={handleAddressChange}
                                    className="border rounded-md px-3 py-2"
                                />

                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={addressData.state}
                                    onChange={handleAddressChange}
                                    className="border rounded-md px-3 py-2"
                                />
                            </div>

                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={addressData.pincode}
                                onChange={handleAddressChange}
                                className="w-full border rounded-md px-3 py-2"
                            />
                            {/* Other fields */}

                            <div className="flex gap-2">
                                <button
                                    onClick={saveAddress}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Save Address
                                </button>

                                <button
                                    onClick={() => setShowAddressForm(false)}
                                    className="border px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            className="w-full text-blue-600 font-medium"
                            onClick={() => setShowAddressForm(!showAddressForm)}
                        >
                            {showAddressForm ? "Hide Address Form" : "Change Address"}
                        </button>

                        {/* <button
                            onClick={handleContinue}
                            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
                        >
                            Continue
                        </button> */}

                        <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg" onClick={() => setAddressSelected(true)}>
                            Continue
                        </button>
                    </div>

                </div>

                </div>

                {/* STEP 3 - PAYMENT */}
                <div
                className={`bg-white rounded-xl shadow p-5 ${
                    !addressSelected
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                    Step 3: Payment
                    </h3>

                    <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                        addressSelected
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                    >
                    3
                    </span>
                </div>

                <div className="space-y-2 border-b pb-4">
                    <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                    </div>

                    <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹100</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalAmount + 100}</span>
                    </div>
                </div>

                <button
                    disabled={!addressSelected}
                    className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
                >
                    Payment
                </button>
                </div>

            </div>
            </div>
            {showDeleteModal && (
                <div
                    className="
                        fixed inset-0
                        bg-black/50
                        backdrop-blur-sm
                        flex items-center justify-center
                        z-50
                        animate-fadeIn
                    "
                >
                    <div
                        className="
                            bg-white
                            rounded-3xl
                            p-6
                            w-[90%]
                            max-w-md
                            shadow-2xl
                            animate-[bounceIn_0.3s_ease-out]
                        "
                    >
                        <div className="text-center">

                            <div
                                className="
                                    mx-auto
                                    w-16 h-16
                                    rounded-full
                                    bg-red-100
                                    flex items-center justify-center
                                "
                            >
                                <TrashIcon className="w-8 h-8 text-red-500" />
                            </div>

                            <h3 className="mt-4 text-xl font-bold">
                                Remove Item?
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Are you sure you want to remove
                                <span className="font-semibold text-black">
                                    {" "}
                                    {selectedItem?.product?.name}
                                </span>
                                {" "}from your cart?
                            </p>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedItem(null);
                                    }}
                                    className="
                                        flex-1
                                        py-3
                                        rounded-xl
                                        border
                                        border-gray-300
                                        hover:bg-gray-100
                                        transition
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmDelete}
                                    className="
                                        flex-1
                                        py-3
                                        rounded-xl
                                        bg-red-500
                                        text-white
                                        hover:bg-red-600
                                        transition
                                    "
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
        
        );
}

export default Cart