import "./Header.css";

function Header(){

    return(
        <header>
            <div className="header">
                <div className="header-f-col">
                    <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" alt="logo" />
                </div>
                <div className="header-s-col">
                    <div className="link-hover-l-to-r">Products</div>
                    <div className="link-hover-l-to-r">Orders</div>
                    <div className="link-hover-l-to-r">Cart</div>
                </div>
                <div className="header-t-col">
                    <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="profile" />
                </div>
            </div>

        </header>    


    )
}
export default Header;