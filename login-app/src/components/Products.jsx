import { useEffect, useState } from "react";
import api from "./../api.js"
import "./Products.css";
import { useAuth } from "../AuthContext";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";


function Products() {
    const { token , cartCount , getExistingCartCount , quantities , handleInputChange , handleQuantityChange } = useAuth();
    const [Products, setProducts] = useState([]);
    const [showCartFloat, setShowCartFloat] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [activeImage, setActiveImage] = useState("");
    const navigate = useNavigate();
    
    const loadProducts = async (e) => {
        const reponse = await api.get("/products");
        console.log(reponse.data.images);
        setProducts(reponse.data);
    }

    useEffect(() => {
        loadProducts();
    },[]);

    const addCart = async (product) => {
        const quantity = quantities[product.id] || 1;

        // User logged in
        if (token) {

            try {
                const response = await api.post("/add-cart",{product_id:product.id,quantity:quantity});
                console.log("Cart:- ", response.data);
                setSuccessMessage("Item added to cart");
                setTimeout(() => {
                    setSuccessMessage("");
                }, 2500);
            } catch (error) {
                console.error(error);
            }

        } else {
            const existingCart =
                JSON.parse(localStorage.getItem("cart")) || [];

            const existingItem = existingCart.find(
                item => item.product_id === product.id
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                // existingCart.push({
                //     product_id: product.id,
                //     name: product.name,
                //     price: product.price,
                //     image: product.images?.[0]?.image_url,
                //     quantity: quantity,
                //     total: quantity * product.price
                // });

                existingCart.push({
                    quantity: quantity,
                    total: quantity * product.price,
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        images: product.images
                    }
                });
            }

            localStorage.setItem(
                "cart",
                JSON.stringify(existingCart)
            );
            console.log("Cart:- ", localStorage.getItem("cart"));
            localStorage.setItem("cartCount", existingCart.length);
            setSuccessMessage("Item added to cart");
            setTimeout(() => {
                setSuccessMessage("");
            }, 2500);
        }
        getExistingCartCount();
    };

    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
            {successMessage && (
            <div
                className="
                    fixed
                    bottom-24
                    right-6
                    bg-green-500
                    text-white
                    px-4
                    py-3
                    rounded-xl
                    shadow-xl
                    z-50
                "
            >
                ✅ {successMessage}
            </div>
        )}
            {Products?.map(product => (
                <div
                    key={product.id}
                    className="
                        group
                        cursor-pointer
                        bg-white
                        rounded-3xl
                        overflow-hidden
                        shadow-md
                        hover:shadow-2xl
                        hover:-translate-y-2
                        transition-all
                        duration-500
                        border
                        border-gray-100
                    "
                >
                    {/* Image */}
                    <div className="relative overflow-hidden"
                        onClick={() => {
                            setSelectedProduct(product);
                            setActiveImage(product.images?.[0]?.image_url || "");
                            setShowPreview(true);
                        }}
                    >
                        <img
                            src={product.images?.[0]?.image_url}
                            alt={product.name}
                            className="
                                w-full
                                h-64
                                object-cover
                                transition-transform
                                duration-700
                                group-hover:scale-110
                            "
                        />

                        <div
                            className={`
                                absolute top-4 right-4
                                px-3 py-1
                                rounded-full
                                text-xs font-semibold
                                shadow-md
                                ${
                                    product.is_available
                                        ? "bg-green-500 text-white"
                                        : "bg-red-500 text-white"
                                }
                            `}
                        >
                            {product.is_available
                                ? "Available"
                                : "Out of Stock"}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-5">
                        <h2 className="font-bold text-xl text-gray-800 truncate"
                            onClick={() => {
                                setSelectedProduct(product);
                                setActiveImage(product.images?.[0]?.image_url || "");
                                setShowPreview(true);
                            }}
                        >
                            {product.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {product.brand}
                        </p>

                        <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                            {product.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">
                                ₹{product.price}
                            </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-5 flex items-center justify-center gap-3">
                            <button
                                onClick={() =>
                                    handleQuantityChange(product.id, -1)
                                }
                                className="
                                    w-10 h-10
                                    rounded-full
                                    bg-gray-100
                                    hover:bg-gray-200
                                    text-lg
                                    font-bold
                                    transition
                                "
                            >
                                −
                            </button>

                            <input
                                type="number"
                                min="1"
                                value={quantities[product.id] || 1}
                                onChange={(e) =>
                                    handleInputChange(product.id, e.target.value)
                                }
                                className="
                                    quantity-input
                                    !w-[52px]
                                    h-10
                                    text-center
                                    font-medium
                                    border
                                    border-gray-300
                                    rounded-lg
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-orange-500
                                    focus:border-orange-500
                                "
                            />

                            <button
                                onClick={() =>
                                    handleQuantityChange(product.id, 1)
                                }
                                className="
                                    w-10 h-10
                                    rounded-full
                                    bg-gray-100
                                    hover:bg-gray-200
                                    text-lg
                                    font-bold
                                    transition
                                "
                            >
                                +
                            </button>
                        </div>

                        {/* Add To Cart */}
                        <button
                            onClick={() => addCart(product)}
                            className="
                                mt-6
                                w-full
                                py-3
                                rounded-xl
                                bg-gradient-to-r
                                from-orange-500
                                to-orange-600
                                text-white
                                font-semibold
                                shadow-lg
                                hover:from-orange-600
                                hover:to-orange-700
                                hover:scale-105
                                hover:shadow-xl
                                transition-all
                                duration-300
                            "
                        >
                            🛒 Add to Cart
                        </button>
                    </div>
                </div>
            ))}

            {cartCount > 0 && (
                <div
                    className="
                        fixed
                        bottom-6
                        right-6
                        z-50
                        animate-[cartBounceIn_0.4s_ease-out]
                    "
                >
                    <button
                        onClick={() => navigate("/cart")}
                        className="
                            relative
                            w-16
                            h-16
                            rounded-full
                            bg-orange-500
                            text-white
                            shadow-2xl
                            flex
                            items-center
                            justify-center
                            hover:bg-orange-600
                            hover:scale-110
                            transition-all
                            duration-300
                        "
                    >
                        <ShoppingCartIcon className="w-8 h-8" />

                        <span
                            className="
                                absolute
                                -top-2
                                -right-2
                                min-w-[24px]
                                h-6
                                px-1
                                bg-red-500
                                text-white
                                text-xs
                                font-bold
                                rounded-full
                                flex
                                items-center
                                justify-center
                                animate-pulse
                            "
                        >
                            {cartCount}
                        </span>
                    </button>
                </div>
            )}

            {showPreview && selectedProduct && (
                <div className="fixed inset-0 z-50">
                    
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowPreview(false)}
                    />

                    {/* Drawer */}
                    <div
                        // className="
                        //     absolute
                        //     bottom-0
                        //     left-0
                        //     right-0
                        //     bg-white
                        //     rounded-t-3xl
                        //     shadow-2xl
                        //     max-h-[90vh]
                        //     overflow-y-auto
                        //     animate-[slideUp_0.4s_ease-out]
                        // "

                        className="
                            fixed
                            top-[5%]
                            left-[5%]
                            right-[5%]
                            bottom-[5%]
                            bg-white
                            rounded-3xl
                            shadow-2xl
                            overflow-hidden
                            animate-[zoomIn_0.3s_ease-out]
                        "
                    >
                        <div className="h-full overflow-y-auto p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                                {/* LEFT SIDE IMAGES */}
                                {/* <div>

                                    <div className="border rounded-3xl overflow-hidden bg-gray-50">
                                        <img
                                            src={activeImage}
                                            alt={selectedProduct.name}
                                            className="
                                                w-full
                                                h-[500px]
                                                object-contain
                                                transition-all
                                                duration-500
                                                hover:scale-105
                                            "
                                        />
                                    </div>
                                    <div className="grid grid-cols-5 gap-3 mt-4">
                                        {selectedProduct.images?.map((img) => (
                                            <img
                                                key={img.image_url}
                                                src={img.image_url}
                                                alt=""
                                                onMouseEnter={() => setActiveImage(img.image_url)}
                                                className={`
                                                    w-full
                                                    h-20
                                                    object-cover
                                                    rounded-xl
                                                    border-2
                                                    cursor-pointer
                                                    transition-all
                                                    duration-300
                                                    hover:scale-105
                                                    ${
                                                        activeImage === img.image_url
                                                            ? "border-orange-500"
                                                            : "border-gray-200"
                                                    }
                                                `}
                                            />
                                        ))}
                                    </div>
                                </div> */ }

                                {/* <div className="flex gap-4">

                                    
                                    <div className="flex flex-col gap-3">
                                        {selectedProduct.images?.map((img) => (
                                            <img
                                                key={img.image_url}
                                                src={img.image_url}
                                                alt=""
                                                onMouseEnter={() =>
                                                    setActiveImage(img.image_url)
                                                }
                                                className={`
                                                    w-20
                                                    h-20
                                                    object-cover
                                                    rounded-xl
                                                    border-2
                                                    cursor-pointer
                                                    transition-all
                                                    duration-300
                                                    hover:scale-105
                                                    ${
                                                        activeImage === img.image_url
                                                            ? "border-orange-500"
                                                            : "border-gray-200"
                                                    }
                                                `}
                                            />
                                        ))}
                                    </div>

                                    
                                    <div className="flex-1 border rounded-3xl overflow-hidden bg-gray-50">
                                        <img
                                            src={activeImage}
                                            alt={selectedProduct.name}
                                            className="
                                                w-full
                                                h-[550px]
                                                object-contain
                                                transition-all
                                                duration-500
                                                hover:scale-110
                                            "
                                        />
                                    </div>

                                </div> */}

                                <div className="flex gap-4 h-full">

                                    {/* Thumbnail Column */}
                                    <div className="flex flex-col gap-2 w-24">
                                        {selectedProduct.images?.slice(0, 6).map((img) => (
                                            <img
                                                key={img.image_url}
                                                src={img.image_url}
                                                alt=""
                                                onMouseEnter={() =>
                                                    setActiveImage(img.image_url)
                                                }
                                                className={`
                                                    flex-1
                                                    min-h-0
                                                    object-cover
                                                    rounded-xl
                                                    border-2
                                                    cursor-pointer
                                                    transition-all
                                                    duration-300
                                                    hover:scale-105
                                                    ${
                                                        activeImage === img.image_url
                                                            ? "border-orange-500"
                                                            : "border-gray-200"
                                                    }
                                                `}
                                            />
                                        ))}
                                    </div>

                                    {/* Main Image */}
                                    <div className="flex-1 border rounded-3xl overflow-hidden bg-gray-50">
                                        <img
                                            src={activeImage}
                                            alt={selectedProduct.name}
                                            className="
                                                w-full
                                                h-full
                                                object-contain
                                                transition-all
                                                duration-500
                                                hover:scale-105
                                            "
                                        />
                                    </div>

                                </div>

                                {/* RIGHT SIDE DETAILS */}
                                <div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-4xl font-bold text-gray-900">
                                                {selectedProduct.name}
                                            </h2>

                                            <p className="mt-2 text-lg text-gray-500">
                                                {selectedProduct.brand}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setShowPreview(false)}
                                            className="
                                                w-10 h-10
                                                rounded-full
                                                bg-gray-100
                                                hover:bg-red-100
                                                transition
                                            "
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-6">
                                        <span className="text-5xl font-bold text-green-600">
                                            ₹{selectedProduct.price}
                                        </span>
                                    </div>

                                    {/* Availability */}
                                    <div className="mt-5">
                                        <span
                                            className={`
                                                px-4 py-2
                                                rounded-full
                                                text-sm
                                                font-semibold
                                                ${
                                                    selectedProduct.is_available
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }
                                            `}
                                        >
                                            {selectedProduct.is_available
                                                ? "✓ In Stock"
                                                : "✗ Out Of Stock"}
                                        </span>
                                    </div>

                                    {/* Product Details */}
                                    <div className="mt-8">
                                        <h3 className="font-bold text-xl mb-3">
                                            Product Description
                                        </h3>

                                        <p className="text-gray-600 leading-8">
                                            {selectedProduct.description}
                                        </p>
                                    </div>

                                    {/* Quantity */}
                                    <div className="mt-10">
                                        <h3 className="font-semibold mb-3">
                                            Quantity
                                        </h3>

                                        <div className="flex items-center gap-4">

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        selectedProduct.id,
                                                        -1
                                                    )
                                                }
                                                className="
                                                    w-12
                                                    h-12
                                                    rounded-full
                                                    bg-orange-100
                                                    text-orange-600
                                                    hover:bg-orange-500
                                                    hover:text-white
                                                    transition
                                                "
                                            >
                                                −
                                            </button>

                                            <input
                                                type="number"
                                                min="1"
                                                value={
                                                    quantities[selectedProduct.id] || 1
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        selectedProduct.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                    quantity-input
                                                    w-[70px]
                                                    h-12
                                                    text-center
                                                    border
                                                    rounded-xl
                                                "
                                            />

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        selectedProduct.id,
                                                        1
                                                    )
                                                }
                                                className="
                                                    w-12
                                                    h-12
                                                    rounded-full
                                                    bg-orange-100
                                                    text-orange-600
                                                    hover:bg-orange-500
                                                    hover:text-white
                                                    transition
                                                "
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add Cart */}
                                    <button
                                        onClick={() => addCart(selectedProduct)}
                                        className="
                                            mt-10
                                            w-full
                                            py-4
                                            rounded-2xl
                                            bg-gradient-to-r
                                            from-orange-500
                                            to-orange-600
                                            text-white
                                            text-lg
                                            font-bold
                                            shadow-xl
                                            hover:scale-[1.02]
                                            hover:shadow-2xl
                                            transition-all
                                            duration-300
                                        "
                                    >
                                        🛒 Add To Cart
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Products;