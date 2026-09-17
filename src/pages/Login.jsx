import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

function Login({login,setLogin,user,setUser}) {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const response = await api.post("/login", formData, {withCredentials: true});
            setLogin(true);
            setUser(response.data.user.name);
            console.log(response.data.user.name);
            // go to dashboard page after login
            navigate("/dashboard"); // assuming you have a route for the dashboard and have imported useNavigate from react-router-dom
        } catch (error) {
            // Handle login error here, e.g., show an error message to the user
            alert("Login failed: " + (error.response?.data?.message || error.message));
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="fixed inset-0 w-screen h-screen">

            {/* ================= BACKGROUND IMAGE ================= */}

            <img
                src="https://images.pexels.com/photos/3913017/pexels-photo-3913017.jpeg"
                alt="Login Background"
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                "
            />

            {/* ================= DARK OVERLAY ================= */}

            <div className="
                absolute
                inset-0
                bg-black/50
            ">
            </div>


            {/* ================= LOGIN CONTAINER ================= */}

            <div className="
                relative
                z-10
                w-full
                h-full
                flex
                items-center
                justify-center
                px-4
            ">

                {/* ================= LOGIN FORM ================= */}

                <div className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    p-8
                    sm:p-10
                ">

                    {/* Logo */}

                    <div className="text-center mb-8">

                        <h1 className="
                            text-4xl
                            font-bold
                            text-gray-900
                        ">
                            BillEase
                        </h1>

                        <p className="
                            text-gray-500
                            mt-2
                        ">
                            Sign in to your account
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    border-gray-300
                                    rounded-xl
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                "
                            />

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <div className="
                                flex
                                justify-between
                                items-center
                                mb-2
                            ">

                                <label
                                    htmlFor="password"
                                    className="
                                        text-sm
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="
                                        text-sm
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >
                                    Forgot password?
                                </button>

                            </div>


                            <div className="relative">

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        pr-16
                                        border
                                        border-gray-300
                                        rounded-xl
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:border-blue-500
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-sm
                                        text-gray-500
                                        hover:text-gray-800
                                    "
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* REMEMBER ME */}

                        <div className="flex items-center">

                            <label className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-gray-600
                            ">

                                <input
                                    type="checkbox"
                                    className="
                                        w-4
                                        h-4
                                        accent-blue-600
                                    "
                                />

                                Remember me

                            </label>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="
                                w-full
                                py-3
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-semibold
                                rounded-xl
                                transition
                                duration-200
                            "
                        >
                            Login
                        </button>

                    </form>


                    {/* FOOTER */}

                    <p className="
                        text-center
                        text-sm
                        text-gray-400
                        mt-8
                    ">
                        © 2026 BillEase
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;