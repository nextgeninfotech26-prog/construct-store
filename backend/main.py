from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
import random

from database import engine, SessionLocal
from auth import hash_password, verify_password, create_access_token, get_current_user
from mail import send_email

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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
        models.CartItem.product_id == cart_item.product_id
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
            models.CartItem.product_id == item.product_id
        ).first()

        if existing:
            existing.quantity += item.quantity
        else:
            db.add(
                models.CartItem(
                    user_id=user_id,
                    product_id=item.product_id,
                    quantity=item.quantity
                )
            )

    db.commit()

    return cart_item    

       