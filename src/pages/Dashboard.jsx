import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import api from "../services/api";

function Dashboard({login}) {
    useEffect(() => {
        if (!login) {
            // Redirect to login page or handle unauthorized access
            window.location.href = "/login";
        }
    }, [login]);
    const [summary, setSummary] = useState({
        todaySales: 0,
        todayBills: 0,
        totalProducts: 0,
        totalCustomers: 0
    });

    const [salesData, setSalesData] = useState([]);
    const [recentBills, setRecentBills] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // FETCH DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    summaryResponse,
                    salesResponse,
                    billsResponse
                ] = await Promise.all([

                    api.get("/dashboard/summary", { withCredentials: true }),

                    api.get(
                        "/dashboard/sales-overview?days=7",
                        { withCredentials: true }
                    ),

                    api.get(
                        "/dashboard/recent-bills",
                        { withCredentials: true }
                    )

                ]);


                setSummary(summaryResponse.data);

                setSalesData(salesResponse.data);

                setRecentBills(billsResponse.data);

            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard data"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboardData();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="
                min-h-[80vh]
                flex
                items-center
                justify-center
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


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="
                min-h-[80vh]
                flex
                items-center
                justify-center
                px-4
            ">

                <div className="
                    bg-red-50
                    border
                    border-red-200
                    text-red-600
                    px-6
                    py-4
                    rounded-xl
                    text-center
                ">

                    {error}

                </div>

            </div>

        );

    }


    return (

        <div className="ml-16 z-10 space-y-6 w-full max-w-full p-1.5 mt-16">


            {/* =====================================
                HEADER
            ====================================== */}

            <div>

                <h1 className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-gray-800
                ">
                    Dashboard
                </h1>

                <p className="
                    mt-1
                    text-sm
                    sm:text-base
                    text-gray-500
                ">
                    Here's what's happening with your business today.
                </p>

            </div>


            {/* =====================================
                SUMMARY CARDS
            ====================================== */}

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-5
                w-full
            ">


                {/* TODAY'S SALES */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-5
                    shadow-sm
                    border
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-gray-500
                            ">
                                Today's Sales
                            </p>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-800
                                mt-2
                            ">
                                ₹
                                {Number(
                                    summary.todaySales || 0
                                ).toLocaleString("en-IN")}
                            </h2>

                        </div>

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-green-100
                            flex
                            items-center
                            justify-center
                            text-green-600
                            text-xl
                            font-bold
                        ">
                            ₹
                        </div>

                    </div>

                </div>


                {/* TODAY'S BILLS */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-5
                    shadow-sm
                    border
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-gray-500
                            ">
                                Today's Bills
                            </p>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-800
                                mt-2
                            ">
                                {summary.todayBills || 0}
                            </h2>

                        </div>

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                            text-blue-600
                            text-xl
                        ">
                            🧾
                        </div>

                    </div>

                </div>


                {/* PRODUCTS */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-5
                    shadow-sm
                    border
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-gray-500
                            ">
                                Total Products
                            </p>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-800
                                mt-2
                            ">
                                {summary.totalProducts || 0}
                            </h2>

                        </div>

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-purple-100
                            flex
                            items-center
                            justify-center
                            text-purple-600
                            text-xl
                        ">
                            📦
                        </div>

                    </div>

                </div>


                {/* CUSTOMERS */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-5
                    shadow-sm
                    border
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-gray-500
                            ">
                                Total Customers
                            </p>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-800
                                mt-2
                            ">
                                {summary.totalCustomers || 0}
                            </h2>

                        </div>

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-orange-100
                            flex
                            items-center
                            justify-center
                            text-orange-600
                            text-xl
                        ">
                            👥
                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================
                SALES CHART
            ====================================== */}

            <div className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                p-5
                sm:p-6
            ">

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-2
                    mb-6
                ">

                    <div>

                        <h2 className="
                            text-lg
                            sm:text-xl
                            font-semibold
                            text-gray-800
                        ">
                            Sales Overview
                        </h2>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            Sales for the last 7 days
                        </p>

                    </div>

                </div>


                <div className="
                    w-full
                    h-75
                ">

                    {salesData.length === 0 ? (

                        <div className="
                            h-full
                            flex
                            items-center
                            justify-center
                            text-gray-400
                        ">
                            No sales data available
                        </div>

                    ) : (

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart
                                data={salesData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="date"
                                    tick={{
                                        fontSize: 12
                                    }}
                                />

                                <YAxis
                                    tick={{
                                        fontSize: 12
                                    }}
                                />

                                <Tooltip
                                    formatter={(value) => [
                                        `₹${Number(
                                            value
                                        ).toLocaleString("en-IN")}`,
                                        "Sales"
                                    ]}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{
                                        r: 4
                                    }}
                                    activeDot={{
                                        r: 6
                                    }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    )}

                </div>

            </div>


            {/* =====================================
                RECENT BILLS
            ====================================== */}

            <div className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                overflow-hidden
            ">

                <div className="
                    p-5
                    sm:p-6
                    border-b
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                sm:text-xl
                                font-semibold
                                text-gray-800
                            ">
                                Recent Bills
                            </h2>

                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">
                                Latest transactions
                            </p>

                        </div>

                    </div>

                </div>


                {/* DESKTOP TABLE */}

                <div className="
                    hidden
                    md:block
                    overflow-x-auto
                ">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                ">
                                    Bill Number
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                ">
                                    Customer
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                ">
                                    Amount
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                ">
                                    Date
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {recentBills.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="
                                            px-6
                                            py-10
                                            text-center
                                            text-gray-400
                                        "
                                    >
                                        No bills found
                                    </td>

                                </tr>

                            ) : (

                                recentBills.map((bill) => (

                                    <tr
                                        key={bill._id}
                                        className="
                                            border-t
                                            border-gray-100
                                            hover:bg-gray-50
                                            transition
                                        "
                                    >

                                        <td className="
                                            px-6
                                            py-4
                                            font-medium
                                            text-gray-800
                                        ">
                                            {bill.billNumber || "-"}
                                        </td>


                                        <td className="
                                            px-6
                                            py-4
                                            text-gray-600
                                        ">
                                            {typeof bill.customer === "object"
                                                ? bill.customer?.name || "-"
                                                : bill.customer || "-"
                                            }
                                        </td>


                                        <td className="
                                            px-6
                                            py-4
                                            font-medium
                                            text-gray-800
                                        ">
                                            ₹
                                            {Number(
                                                bill.totalAmount || 0
                                            ).toLocaleString("en-IN")}
                                        </td>


                                        <td className="
                                            px-6
                                            py-4
                                            text-gray-500
                                        ">
                                            {bill.createdAt
                                                ? new Date(
                                                    bill.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                                : "-"
                                            }
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>


                {/* MOBILE BILLS */}

                <div className="md:hidden">

                    {recentBills.length === 0 ? (

                        <div className="
                            px-5
                            py-10
                            text-center
                            text-gray-400
                        ">
                            No bills found
                        </div>

                    ) : (

                        recentBills.map((bill) => (

                            <div
                                key={bill._id}
                                className="
                                    p-5
                                    border-t
                                    border-gray-100
                                "
                            >

                                <div className="
                                    flex
                                    justify-between
                                    gap-4
                                ">

                                    <div>

                                        <p className="
                                            font-semibold
                                            text-gray-800
                                        ">
                                            {bill.billNumber || "-"}
                                        </p>

                                        <p className="
                                            text-sm
                                            text-gray-500
                                            mt-1
                                        ">
                                            {typeof bill.customer === "object"
                                                ? bill.customer?.name || "-"
                                                : bill.customer || "-"
                                            }
                                        </p>

                                    </div>


                                    <p className="
                                        font-semibold
                                        text-gray-800
                                    ">
                                        ₹
                                        {Number(
                                            bill.totalAmount || 0
                                        ).toLocaleString("en-IN")}
                                    </p>

                                </div>


                                <p className="
                                    text-xs
                                    text-gray-400
                                    mt-3
                                ">
                                    {bill.createdAt
                                        ? new Date(
                                            bill.createdAt
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )
                                        : "-"
                                    }
                                </p>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;