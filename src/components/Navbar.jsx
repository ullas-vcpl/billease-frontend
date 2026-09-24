import { Link } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

function Navbar({ login, setLogin, user }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
     if (loading) {

        return (

            <div className="
                min-h-[80vh]
                flex
                items-center
                justify-center
                w-full
            ">

                <div className="
                    w-10
                    h-10
                    border-4
                    border-gray-300
                    border-t-blue-600
                    rounded-full
                    animate-spin
                " />

            </div>

        );

    }

    const handleLogout = async () => {
        try {
        setLoading(true);
        const response = await api.post("/logout", {withCredentials: true});
        console.log(response);
        setLogin(false);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        
       <div className="fixed top-0 left-0 bg-gray-800 text-white p-4 h-16 w-full">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold" >
                        <Link to="/">BillEase</Link>
                    </div>
                    <div className="space-x-5">
                        <Link to="/dashboard" className="text-white hover:text-blue-600">
                            Dashboard
                        </Link>
                        <Link to="/bills" className="text-white hover:text-blue-600">
                            Bills
                        </Link>
                        <Link to="/customers" className="text-white hover:text-blue-600">
                            Customers
                        </Link>
                       
                        <Link to="/billing" className="text-white hover:text-blue-600">
                            Billing
                        </Link>
                        <Link to="/products" className="text-white hover:text-blue-600">
                            Products
                        </Link>
                         <Link to="/settings" className="text-white hover:text-blue-600">
                            Settings
                        </Link>
                    </div>
                    <div>
                        <button className="text-red-500 cursor-pointer" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                    
                  </div>       
                  
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700 text-2xl"
                        onClick={() => setOpen(!open)}
                    >
                        {open? "✖" : "☰"}
                    </button>

                {/* Mobile Navigation */}
                <div className={`md:hidden border-t border-gray-100 py-3 ${open ? "block" : "hidden"}`}>
                    <div className="flex flex-col gap-3">

                        <Link
                            to="/dashboard"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/products"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Products
                        </Link>

                        <Link
                            to="/customers"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Customers
                        </Link>

                        <Link
                            to="/billing"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Billing
                        </Link>

                        <Link
                            to="/reports"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Reports
                        </Link>

                        <button className="text-left text-red-500" onClick={handleLogout}>
                            Logout
                        </button>

                    </div>
                </div>
            </div>
    );
}

export default Navbar;