import { ChartNoAxesCombined, LayoutDashboard, Logs, ShoppingBasket, X } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <Logs />,
  }
];

const SidebarMenuItems = ({ setOpen }) => {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-gray-500 hover:bg-blue-100 hover:text-[#121212]"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <aside className="hidden w-64 flex-col border-r border-r-gray-200 bg-white p-6 lg:flex">
        <div onClick={() => navigate('/admin')} className="flex items-center gap-2 cursor-pointer">
          <ChartNoAxesCombined color="black" size={30} />
          <h1 className="text-2xl font-extrabold text-black">Admin Panel</h1>
        </div>
        <SidebarMenuItems />
      </aside>

      {/*Drawer for small screens*/}
      <div className="lg:hidden">
        {open && (
          <div className="fixed inset-0 z-40">
            {/*overlay*/}
            <div className="absolute inset-0 bg-gray-700/60" onClick={() => setOpen(false)}>
            </div>
            <div className="relative z-50 w-64 h-screen bg-white border-r border-r-gray-200 p-4">
              {/* Close button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost btn-sm p-1"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined color="black" size={30} />
                <h1 className="text-2xl font-extrabold text-black">Admin Panel</h1>
              </div>
              <SidebarMenuItems setOpen={setOpen} />
            </div>
          </div>
        )} 
      </div>  
        
    </Fragment>
  );
};

export default AdminSidebar;
