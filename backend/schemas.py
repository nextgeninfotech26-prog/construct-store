from typing import Optional

from pydantic import BaseModel

class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str

class LoginSchema(BaseModel):
    email: str
    password: str

class ResetCodeSchema(BaseModel):
    email: str

class UpdateNewPasswordSchema(BaseModel):
    email: str
    reset_code: str
    new_password: str

class ProductImageSchema(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True


class ProductSchema(BaseModel):
    id: int
    name: str
    price: float
    brand: str
    description: str
    is_available: bool
    images: list[ProductImageSchema] = []

    class Config:
        from_attributes = True    

class CartSaveRequest(BaseModel):
    product_id: int
    quantity: int


class CartRequest(BaseModel):
    product_id: int
    name: str
    price: float
    image: Optional[str] = None
    quantity: int    