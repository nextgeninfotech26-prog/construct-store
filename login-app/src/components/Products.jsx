import { useEffect, useState } from "react";
import api from "./../api.js"
import "./Products.css";


function Products() {

    const [Products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [quantities, setQuantities] = useState({});
    
    useEffect(() => {
        loadProducts();
    },[]);

    const loadProducts = async (e) => {
        const reponse = await api.get("/products");
        console.log(reponse.data.images);
        setProducts(reponse.data);
    }

    const handleInputChange = (productId, value) => {
        const quantity = parseInt(value, 10);

        setQuantities(prev => ({
            ...prev,
            [productId]: isNaN(quantity) ? 1 : Math.max(1, quantity)
        }));
    };

    const handleQuantityChange = (productId, change) => {
        // Implement quantity change logic here
        //console.log(`Change quantity of product ${productId} by ${change}`);
        //setQuantity(quantity+change);
        setQuantities((prev) => ({
            
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + change)
        }));
    }

    const addCart = async (product) => {
        const quantity = quantities[product.id] || 1;

        const token = localStorage.getItem("token");

        // User logged in
        if (token) {

            try {
                 const response = await api.post(
                    "/add-cart",
                    {product_id:product.id,quantity:quantity},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Added to cart");
                console.log("Cart:- ", response.data);
            } catch (error) {
                console.error(error);
            }

        } else {
            const existingCart =
                JSON.parse(localStorage.getItem("cart")) || [];

            const existingItem = existingCart.find(
                item => item.productId === product.id
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                existingCart.push({
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0]?.image_url,
                    quantity: quantity
                });
            }

            localStorage.setItem(
                "cart",
                JSON.stringify(existingCart)
            );
            console.log("Cart:- ", localStorage.getItem("cart"));
            alert("Added to Cart");
        }
    };

    return(
        <div className="products-container">
            {Products?.map(product => (
                
                    <div key={product.id} id={product.id} className="product-card">
                        <div className="full-width">
                            <div><img src={product.images?.[0]?.image_url} alt={product.name} /></div>
                            <div className="product-available">
                                {product.is_available ? "is Available" : "Not Available"}
                            </div>
                            <div className="product-details">
                                <div>{product.name}</div>
                                <div>Price: ${product.price}</div>
                                <div>Brand: {product.brand}</div>
                                <div>Description: {product.description}</div>
                                <div>
                                    <div className="quantity-control">
                                        <div onClick={() => handleQuantityChange(product.id, -1)}></div>
                                        <div><input type="number" min="1" placeholder="Quantity" onChange={(e) => handleInputChange(product.id, e.target.value)} className="quantity-input" value={quantities[product.id] || 1}/></div>
                                        <div onClick={() => handleQuantityChange(product.id, 1)}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="add-cart-container"><div className="add-cart-btn" onClick={() => addCart(product)}>Add to Cart</div></div>
                        </div>
                    </div>
            ))}
        </div>
    )
}
export default Products;