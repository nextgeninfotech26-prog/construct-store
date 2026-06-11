from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
import random

from database import engine, SessionLocal
from auth import hash_password, verify_password, create_access_token, get_current_user
from mail import send_email
import os
import uuid

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register API
@app.post("/register")
def register(
    user: schemas.RegisterSchema,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        password_text=user.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Send Welcome Mail
    send_email(
        user.email,
        "Welcome",
        f"Hello {user.username}, Welcome to our app!"
    )

    return {
        "message": "User registered successfully"
    }

# Login API
@app.post("/login")
def login(
    user: schemas.LoginSchema,
    db: Session = Depends(get_db)
):

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    token = create_access_token({
        "sub": str(db_user.id)
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/profile")
def get_profile(
    current_user: models.User = Depends(get_current_user)
):
    return current_user

@app.post("/profile/upload-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    db_user = db.query(models.User).filter(
        models.User.id == current_user.id
    ).first()
    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    db_user.image_url = f"/uploads/profile/{filename}"

    db.commit()

    return {
        "image_url": db_user.image_url
    }

@app.put("/profile/update")
def update_profile(
    profile_data: schemas.UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    
    db_user = db.query(models.User).filter(
        models.User.id == current_user.id
    ).first()

    db_user.username = profile_data.username
    db_user.phone = profile_data.phone
    db_user.address = profile_data.address
    db_user.city = profile_data.city
    db_user.state = profile_data.state
    db_user.pincode = profile_data.pincode

    db.commit()
    #db.refresh(current_user)

    return {
        "success": True,
        "message": "Profile updated successfully",
        "user": current_user
    }

@app.post("/send-reset-code")
def sendResetCode(
    user: schemas.ResetCodeSchema,
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )
    code = str(random.randint(100000, 999999))
    
    # Send Reset Code Mail
    send_email(
        user.email,
        "Reset Code",
        f"Hello {db_user.username}, your reset code is {code}"
    )
    return {
        "reset_code":code
    }


@app.post("/update-password")
def updateNewPassword(
    user: schemas.UpdateNewPasswordSchema,
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )
    
    db_user.password = hash_password(user.new_password)

    db_user.password_text = user.new_password

    db.commit()


    reset_entry = models.PasswordResetCode(
        user_id=db_user.id,
        reset_code=user.reset_code,
        last_password_text=db_user.password_text,
        last_password=db_user.password,
        new_password=hash_password(user.new_password),
        new_password_text=user.new_password
    )

    db.add(reset_entry)

    db.commit()
    
    # Send Reset Code Mail
    send_email(
        user.email,
        "Password Updated",
        f"Hello {db_user.username}, your password has been updated successfully."
    )

    return {
        "message": "Password updated successfully"
    }

@app.get("/address", response_model=schemas.UserAddressResponse)
def get_address(
    current_user = Depends(get_current_user)
):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "image": current_user.image_url,
        "phone": current_user.phone,
        "address": current_user.address,
        "city": current_user.city,
        "state": current_user.state,
        "pincode": current_user.pincode
    }

@app.put("/address/update")
def update_address(
    request: schemas.AddressUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    print("User ID:", current_user.id)
    print("Before:", current_user.phone)

    user = db.query(models.User).filter(
        models.User.id == current_user.id
    ).first()

    user.phone = request.phone
    user.address = request.address
    user.city = request.city
    user.state = request.state
    user.pincode = request.pincode

    print("After:", user.phone)
    #print("Updated Address: ", request)
    db.commit()

    return {
        "success": True,
        "message": "Address updated successfully"
    }


@app.get("/products", response_model=list[schemas.ProductSchema])
def getProducts(db: Session = Depends(get_db)):

    return (
        db.query(models.Product)
        .options(joinedload(models.Product.images))
        .all()
    )

@app.post("/add-cart")
def add_cart(
    cart_item: schemas.CartSaveRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    user_id = current_user.id  # get from JWT

    existing = db.query(models.CartItem).filter(
        models.CartItem.user_id == user_id,
        models.CartItem.product_id == cart_item.product_id,
        models.CartItem.is_ordersaved == False
    ).first()

    if existing:
        existing.quantity += cart_item.quantity
    else:
        db.add(
            models.CartItem(
                user_id=user_id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity
            )
        )

    db.commit()

    return cart_item


@app.post("/cart/save")
def add_cart_save(
    cart_items: list[schemas.CartRequest],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    user_id = current_user.id  # get from JWT``
    for item in cart_items:
        existing = db.query(models.CartItem).filter(
            models.CartItem.user_id == user_id,
            models.CartItem.product_id == item.product.id,
            models.CartItem.is_ordersaved == False
        ).first()

        if existing:
            existing.quantity += item.quantity
        else:
            db.add(
                models.CartItem(
                    user_id=user_id,
                    product_id=item.product.id,
                    quantity=item.quantity
                )
            )

    db.commit()

    return cart_items    

@app.get("/cart-count")
def get_cart_count(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user_id = current_user.id
    count = db.query(models.CartItem).filter(models.CartItem.user_id == user_id, models.CartItem.is_ordersaved == False).count()
    print("Cart Count: ", count, "User ID: ", user_id)
    return {"count": count}

@app.get("/cart")
def get_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user_id = current_user.id
    # cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()
    # return cart_items

    cart_items = (
    db.query(models.CartItem)
    .filter(models.CartItem.user_id == user_id, models.CartItem.is_ordersaved == False)
    .options(
        joinedload(models.CartItem.product)
        .joinedload(models.Product.images)
    )
    .all()
)
    return cart_items


@app.delete("/cart/{cart_item_id}")
def remove_cart_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    cart_item = (
        db.query(models.CartItem)
        .filter(
            models.CartItem.id == cart_item_id,
            models.CartItem.user_id == current_user.id,
            models.CartItem.is_ordersaved == False
        )
        .first()
    )

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.delete(cart_item)
    db.commit()

    return {
        "success": True,
        "message": "Item removed from cart"
    }
