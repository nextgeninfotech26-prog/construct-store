from sqlalchemy.orm import Session
from models import *
from database import SessionLocal
from datetime import datetime, timedelta
import random
from auth import hash_password, verify_password, create_access_token
from sqlalchemy import text
from database import engine

db: Session = SessionLocal()

tables = [
    "password_reset_codes",
    "cart_items",
    "wishlist_items",
    "order_items",
    "reviews",
    "inventory",
    "orders",
    "product_images",
    "products",
    "categories",
    "coupons",
    "banners",
    "users"
]

with engine.connect() as conn:
    conn.execute(text("SET FOREIGN_KEY_CHECKS=0"))

    for table in tables:
        conn.execute(text(f"TRUNCATE TABLE {table}"))

    conn.execute(text("SET FOREIGN_KEY_CHECKS=1"))
    conn.commit()

print("✅ All tables truncated successfully")

# ---------------- USERS ----------------

users = []
for i in range(1, 21):
    user = User(
        username=f"user{i}",
        email=f"user{i}@gmail.com",
        password=hash_password("password123"),
        password_text="password123",
        role=UserRole.ADMIN if i <= 2 else UserRole.CUSTOMER,
        phone=f"9876543{i:03}",
        address=f"Street {i}",
        city="Vijayawada",
        state="Andhra Pradesh",
        pincode=f"5200{i:02}",
    )
    users.append(user)

db.add_all(users)
db.commit()

# ---------------- PASSWORD RESET ----------------

for i in range(20):
    db.add(
        PasswordResetCode(
            user_id=users[i].id,
            reset_code=f"CODE{i+100}",
            last_password=hash_password("oldpass"),
            last_password_text="oldpass",
            new_password=hash_password("newpass"),
            new_password_text="newpass"
        )
    )

db.commit()

# ---------------- CATEGORIES ----------------

categories = []

category_names = [
    "Cement",
    "Steel",
    "Bricks",
    "Sand",
    "Paints",
    "Tiles",
    "Electrical",
    "Plumbing",
    "Roofing",
    "Hardware",
    "Tools",
    "Doors",
    "Windows",
    "Plywood",
    "Granite",
    "Marble",
    "Concrete",
    "Fencing",
    "Water Tanks",
    "Safety Equipment"
]

for i in range(20):
    cat = Category(
        name=category_names[i],
        description=f"{category_names[i]} category",
        image_url=f"https://picsum.photos/300/300?cat={i}"
    )
    categories.append(cat)

db.add_all(categories)
db.commit()

# ---------------- PRODUCTS ----------------

products = []

for i in range(1, 21):
    product = Product(
        category_id=categories[(i - 1)].id,
        name=f"Product {i}",
        description=f"Construction material {i}",
        brand=f"Brand {i}",
        price=random.randint(100, 5000),
        discount_percent=random.randint(0, 20),
        gst_percent=18,
        stock_quantity=random.randint(20, 200),
        rating=round(random.uniform(3, 5), 1),
        is_featured=i % 3 == 0
    )
    products.append(product)

db.add_all(products)
db.commit()

# ---------------- PRODUCT IMAGES ----------------

for product in products:
    db.add(
        ProductImage(
            product_id=product.id,
            image_url=f"https://picsum.photos/600/600?product={product.id}",
            is_primary=True
        )
    )

db.commit()

# ---------------- CART ITEMS ----------------

for i in range(20):
    db.add(
        CartItem(
            user_id=users[i].id,
            product_id=products[i].id,
            quantity=random.randint(1, 5)
        )
    )

db.commit()

# ---------------- WISHLIST ----------------

for i in range(20):
    db.add(
        WishlistItem(
            user_id=users[i].id,
            product_id=products[(19 - i)].id
        )
    )

db.commit()

# ---------------- ORDERS ----------------

orders = []

for i in range(20):
    order = Order(
        user_id=users[i].id,
        order_number=f"ORD2025{i+1000}",
        status=random.choice(list(OrderStatus)),
        total_amount=random.randint(500, 10000),
        tax_amount=random.randint(50, 500),
        shipping_address=f"Shipping Address {i}"
    )
    orders.append(order)

db.add_all(orders)
db.commit()

# ---------------- ORDER ITEMS ----------------

for i in range(20):
    db.add(
        OrderItem(
            order_id=orders[i].id,
            product_id=products[i].id,
            quantity=random.randint(1, 10),
            unit_price=products[i].price,
            discount_amount=50,
            tax_amount=products[i].price * 0.18
        )
    )

db.commit()

# ---------------- REVIEWS ----------------

for i in range(20):
    db.add(
        Review(
            product_id=products[i].id,
            user_id=users[i].id,
            rating=random.randint(3, 5),
            comment=f"Excellent product {i}"
        )
    )

db.commit()

# ---------------- INVENTORY ----------------

for i in range(20):
    stock_in = random.randint(100, 500)
    stock_out = random.randint(10, 50)

    db.add(
        Inventory(
            product_id=products[i].id,
            stock_in=stock_in,
            stock_out=stock_out,
            available_stock=stock_in - stock_out,
            reorder_level=10
        )
    )

db.commit()

# ---------------- COUPONS ----------------

for i in range(20):
    db.add(
        Coupon(
            code=f"SAVE{i+10}",
            discount_percent=random.randint(5, 25),
            max_uses=100,
            current_uses=random.randint(0, 50),
            expiry_date=datetime.utcnow() + timedelta(days=90)
        )
    )

db.commit()

# ---------------- BANNERS ----------------

for i in range(20):
    db.add(
        Banner(
            title=f"Banner {i+1}",
            description=f"Special Offer {i+1}",
            image_url=f"https://picsum.photos/1200/500?banner={i}",
            button_text="Shop Now",
            button_link="/products",
            display_order=i + 1
        )
    )

db.commit()

print("✅ Successfully inserted 20 records into every table.")


#Truncate all Tables using MYSQL Commands

# SET FOREIGN_KEY_CHECKS = 0;

# TRUNCATE TABLE password_reset_codes;
# TRUNCATE TABLE cart_items;
# TRUNCATE TABLE wishlist_items;
# TRUNCATE TABLE order_items;
# TRUNCATE TABLE reviews;
# TRUNCATE TABLE inventory;
# TRUNCATE TABLE orders;
# TRUNCATE TABLE product_images;
# TRUNCATE TABLE products;
# TRUNCATE TABLE categories;
# TRUNCATE TABLE coupons;
# TRUNCATE TABLE banners;
# TRUNCATE TABLE users;

# SET FOREIGN_KEY_CHECKS = 1;