from typing import List, Optional, Text

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


class CartRequestOld(BaseModel):
    cart_id: Optional[int] = None
    product_id: int
    name: str
    price: float
    image: Optional[str] = None
    quantity: int
    total: float

class AddressUpdateRequest(BaseModel):
    phone: Optional[str] = None
    address: Optional[Text] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None    

class UserAddressResponse(BaseModel):
    username: str
    email: str
    image: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None    

class ProductImage(BaseModel):
    image_url: Optional[str] = None

class ProductData(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    images: List[ProductImage] = []

class CartRequest(BaseModel):
    cart_id: Optional[int] = None
    quantity: int
    total: float
    product: ProductData


class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    image_url: Optional[str]

    class Config:
        from_attributes = True