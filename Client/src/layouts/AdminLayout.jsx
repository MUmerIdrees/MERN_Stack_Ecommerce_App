import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { useState } from "react";

const AdminLayout = () => {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <div className="flex min-h-screen w-full">
            {/* Admin Sidebar */}
            <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
            <div className="flex flex-1 flex-col">
                {/* Admin Header */}
                <AdminHeader setOpen={setOpenSidebar} />
                <main className="flex flex-1 flex-col bg-gray-100/40 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
