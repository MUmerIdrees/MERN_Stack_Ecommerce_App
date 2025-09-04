import accountImg from "../../assets/account.jpg";
import ShoppingOrders from "./ShoppingOrders";
import Address from "./Address";

const AccountPage = () => {
    return (
        <div className="flex flex-col">
            <div className="relative w-full h-[300px] overflow-hidden">
                <img 
                    src={accountImg}  
                    className="w-full h-full object-cover object-center"
                />
            </div>
            <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
                <div className="flex flex-col rounded-lg p-6">
                    <div className="tabs tabs-box">
                        <input type="radio" name="my_tabs_6" className="tab checked:text-black" aria-label="Orders" defaultChecked />
                        <div className="tab-content bg-base-100 border-base-300 text-black p-6">
                            <ShoppingOrders />
                        </div>
                        <input type="radio" name="my_tabs_6" className="tab checked:text-black" aria-label="Address" />
                        <div className="tab-content bg-base-100 border-base-300 text-black p-6">
                            <Address />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
