import { Link } from "react-router-dom";
import api from "../services/api";

function Navbar({ login, setLogin, user }) {
    const handleLogout = async () => {
        try {
        const response = await api.post("/logout", {withCredentials: true});
        console.log(response);
        setLogin(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        
       <div className="fixed top-0 left-0 bg-gray-800 text-white p-4 h-16 w-full">
                         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-xl font-bold text-white"
                    >
                        BillEase
                    </Link>

                    {/* Navigation Options */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/dashboard"
                            className="text-gray-600 hover:text-blue-600 transition"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/products"
                            className="text-gray-600 hover:text-blue-600 transition"
                        >
                            Products
                        </Link>

                        <Link
                            to="/customers"
                            className="text-gray-600 hover:text-blue-600 transition"
                        >
                            Customers
                        </Link>

                        <Link
                            to="/billing"
                            className="text-gray-600 hover:text-blue-600 transition"
                        >
                            Billing
                        </Link>

                        <Link
                            to="/reports"
                            className="text-gray-600 hover:text-blue-600 transition"
                        >
                            Reports
                        </Link>

                        <button
                            className="text-gray-600 hover:text-red-600 transition"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700 text-2xl"
                        onClick={handleLogout}
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-100 py-3">
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

       </div>
    );
}

export default Navbar;