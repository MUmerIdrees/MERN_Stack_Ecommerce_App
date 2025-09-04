import { Outlet } from "react-router-dom";
import ShoppingHeader from "../components/shopping/ShoppingHeader";

const ShoppingLayout = () => {
    return (
        <div className="flex flex-col bg-white overflow-hidden">
            {/* Shopping Header */}
            <ShoppingHeader />
            <main className="flex flex-col w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default ShoppingLayout;
