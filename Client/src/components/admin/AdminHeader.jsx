import { AlignJustify, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setOpen }) => {
  const { logOut } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-center px-4 py-3 bg-white border-b border-b-gray-200">
      <button className="lg:hidden sm:block btn btn-neutral" onClick={() => setOpen(true)}>
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </button>
      <div className="flex flex-1 justify-end">
        <button 
          onClick={() => logOut(navigate)} 
          className="btn btn-neutral inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
