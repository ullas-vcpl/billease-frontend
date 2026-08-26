import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="fixed left-0 top-0 h-screen w-72 z-50 group">

            {/* Sidebar */}
            <aside
                className="
                    absolute
                    left-0
                    top-0
                    h-full
                    w-64
                    bg-gray-900
                    text-white
                    p-5
                    -translate-x-full
                    group-hover:translate-x-0
                    transition-transform
                    duration-300
                    ease-in-out
                    shadow-2xl
                "
            >

                {/* Logo */}
                <div className="mb-10">
                    <h1 className="text-2xl font-bold">
                        BillEase
                    </h1>

                    <p className="text-sm text-gray-400 mt-1">
                        Billing Software
                    </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">

                    <Link
                        to="/"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/billing"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Billing
                    </Link>

                    <Link
                        to="/products"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Products
                    </Link>

                    <Link
                        to="/customers"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Customers
                    </Link>

                    <Link
                        to="/bills"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Bills
                    </Link>

                    <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Settings
                    </Link>

                </nav>

            </aside>


            {/* Arrow Trigger */}
            <div
                className="
                    absolute
                    left-0
                    top-1/2
                    -translate-y-1/2
                    w-8
                    h-16
                    bg-gray-900
                    rounded-r-xl
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-lg
                    transition-opacity
                    duration-300
                    group-hover:opacity-0
                "
            >

                {/* Arrow */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="
                        w-5
                        h-5
                        animate-pulse
                    "
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L19.5 12l-6 7.5M4.5 12h14"
                    />
                </svg>

            </div>

        </div>
    );
}

export default Sidebar;