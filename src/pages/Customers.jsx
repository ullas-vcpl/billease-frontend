import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';




import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    Users,
    Mail,
    Phone
} from "lucide-react";

import api from "../services/api";

const Customers = ({login}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!login) {
            // Redirect to login page or show a message
            navigate('/login');
        }
    }, [login]);

    // =========================================================
    // STATES
    // =========================================================

    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    // Pagination

    const [currentPage, setCurrentPage] = useState(1);

    const customersPerPage = 10;


    // =========================================================
    // FORM
    // =========================================================

    const emptyForm = {
        name: "",
        email: "",
        phone: ""
    };

    const [formData, setFormData] = useState(emptyForm);


    // =========================================================
    // GET CUSTOMERS
    // =========================================================

    const getCustomers = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get("/getCustomers");

            /*
                Depending on your backend response, this supports:

                response.data

                OR

                response.data.customers
            */

            const customerData =
                response.data.customers ||
                response.data;

            setCustomers(customerData);

        } catch (error) {

            console.error(
                "Error getting customers:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load customers"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        getCustomers();

    }, []);


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredCustomers = customers.filter(
        (customer) => {

            const searchText =
                search.trim().toLowerCase();

            return (

                customer.name
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                customer.email
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                customer.phone
                    ?.toLowerCase()
                    .includes(searchText)

            );
        }
    );


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.ceil(
        filteredCustomers.length /
        customersPerPage
    );


    const startIndex =
        (currentPage - 1) *
        customersPerPage;


    const paginatedCustomers =
        filteredCustomers.slice(
            startIndex,
            startIndex + customersPerPage
        );


    // =========================================================
    // SEARCH HANDLER
    // =========================================================

    const handleSearch = (e) => {

        setSearch(e.target.value);

        // Reset pagination when search changes

        setCurrentPage(1);
    };


    // =========================================================
    // PAGE NUMBERS
    // =========================================================

    const getPageNumbers = () => {

        const pages = [];

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            pages.push(i);

        }

        return pages;
    };


    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // =========================================================
    // ADD CUSTOMER
    // =========================================================

    const handleAddCustomer = async (e) => {

        e.preventDefault();

        try {

            setSubmitting(true);

            const response =
                await api.post(
                    "/addCustomer",
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone
                    }
                );


            const newCustomer =
                response.data.customer ||
                response.data;


            setCustomers((prev) => [
                ...prev,
                newCustomer
            ]);


            setFormData(emptyForm);

            setShowAddModal(false);

            setCurrentPage(1);

        } catch (error) {

            console.error(
                "Add customer error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to add customer"
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =========================================================
    // VIEW CUSTOMER
    // =========================================================

    const handleView = (customer) => {

        setSelectedCustomer(customer);

        setShowViewModal(true);
    };


    // =========================================================
    // EDIT CUSTOMER
    // =========================================================

    const handleEdit = (customer) => {

        setSelectedCustomer(customer);

        setFormData({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || ""
        });

        setShowEditModal(true);
    };


    // =========================================================
    // UPDATE CUSTOMER
    // =========================================================

    const handleUpdateCustomer = async (e) => {

        e.preventDefault();

        if (!selectedCustomer) {
            return;
        }


        try {

            setSubmitting(true);

            const response =
                await api.put(
                    `/updateCustomer/${selectedCustomer._id}`,
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone
                    }
                );


            const updatedCustomer =
                response.data.customer ||
                response.data;


            setCustomers((prev) =>
                prev.map((customer) =>
                    customer._id ===
                    selectedCustomer._id
                        ? updatedCustomer
                        : customer
                )
            );


            setShowEditModal(false);

            setSelectedCustomer(null);

            setFormData(emptyForm);

        } catch (error) {

            console.error(
                "Update customer error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update customer"
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =========================================================
    // DELETE CUSTOMER
    // =========================================================

    const handleDeleteCustomer = async () => {

        if (!selectedCustomer) {
            return;
        }


        try {

            setSubmitting(true);


            await api.delete(
                `/deleteCustomer/${selectedCustomer._id}`
            );


            setCustomers((prev) =>
                prev.filter(
                    (customer) =>
                        customer._id !==
                        selectedCustomer._id
                )
            );


            setShowDeleteModal(false);

            setSelectedCustomer(null);


            /*
                If the last customer on the current
                page was deleted, move back one page.
            */

            const remainingCustomers =
                filteredCustomers.length - 1;


            const newTotalPages =
                Math.ceil(
                    remainingCustomers /
                    customersPerPage
                );


            if (
                currentPage > newTotalPages &&
                newTotalPages > 0
            ) {

                setCurrentPage(
                    newTotalPages
                );

            }

        } catch (error) {

            console.error(
                "Delete customer error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete customer"
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =========================================================
    // CLOSE MODALS
    // =========================================================

    const closeAddModal = () => {

        setShowAddModal(false);

        setFormData(emptyForm);
    };


    const closeViewModal = () => {

        setShowViewModal(false);

        setSelectedCustomer(null);
    };


    const closeEditModal = () => {

        setShowEditModal(false);

        setSelectedCustomer(null);

        setFormData(emptyForm);
    };


    const closeDeleteModal = () => {

        setShowDeleteModal(false);

        setSelectedCustomer(null);
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                flex
                items-center
                justify-center
                min-h-[400px]
            ">

                <div className="text-gray-500">

                    Loading customers...

                </div>

            </div>

        );
    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="p-4 md:p-6 w-full mt-16">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
                mb-6
            ">

                <div>

                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-800
                    ">
                        Customers
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        Manage your customers
                    </p>

                </div>


                <button
                    onClick={() =>
                        setShowAddModal(true)
                    }
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-4
                        py-2.5
                        rounded-lg
                        transition
                    "
                >

                    <Plus size={18} />

                    Add Customer

                </button>

            </div>


            {/* ================================================= */}
            {/* SEARCH */}
            {/* ================================================= */}

            <div className="
                bg-white
                rounded-xl
                shadow-sm
                border
                border-gray-200
                p-4
                mb-6
            ">

                <div className="relative">

                    <Search
                        size={19}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input
                        type="text"
                        placeholder="
                            Search by name, email or phone...
                        "
                        value={search}
                        onChange={handleSearch}
                        className="
                            w-full
                            pl-10
                            pr-4
                            py-2.5
                            border
                            border-gray-300
                            rounded-lg
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                </div>

            </div>


            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (

                <div className="
                    bg-red-50
                    border
                    border-red-200
                    text-red-600
                    px-4
                    py-3
                    rounded-lg
                    mb-6
                ">

                    {error}

                </div>

            )}


            {/* ================================================= */}
            {/* CUSTOMER TABLE */}
            {/* ================================================= */}

            <div className="
                bg-white
                rounded-xl
                shadow-sm
                border
                border-gray-200
                overflow-hidden
            ">


                {/* ================================================= */}
                {/* DESKTOP TABLE */}
                {/* ================================================= */}

                <div className="
                    hidden
                    md:block
                    overflow-x-auto
                ">

                    <table className="w-full">

                        <thead className="
                            bg-gray-50
                            border-b
                        ">

                            <tr>

                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                ">
                                    Customer
                                </th>


                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                ">
                                    Email
                                </th>


                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                ">
                                    Phone
                                </th>


                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                ">
                                    Total Purchase
                                </th>


                                <th className="
                                    text-right
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                ">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y">

                            {paginatedCustomers.length > 0 ? (

                                paginatedCustomers.map(
                                    (customer) => (

                                        <tr
                                            key={customer._id}
                                            className="
                                                hover:bg-gray-50
                                            "
                                        >

                                            {/* CUSTOMER */}

                                            <td className="px-6 py-4">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className="
                                                        w-10
                                                        h-10
                                                        rounded-full
                                                        bg-blue-100
                                                        text-blue-600
                                                        flex
                                                        items-center
                                                        justify-center
                                                        font-semibold
                                                    ">

                                                        {customer.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>


                                                    <div>

                                                        <div className="
                                                            font-medium
                                                            text-gray-800
                                                        ">
                                                            {customer.name}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td className="
                                                px-6
                                                py-4
                                                text-gray-600
                                            ">

                                                {customer.email}

                                            </td>


                                            {/* PHONE */}

                                            <td className="
                                                px-6
                                                py-4
                                                text-gray-600
                                            ">

                                                {customer.phone}

                                            </td>


                                            {/* TOTAL PURCHASE */}

                                            <td className="
                                                px-6
                                                py-4
                                                font-medium
                                                text-gray-800
                                            ">

                                                ₹
                                                {Number(
                                                    customer.TotalPurchase ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2
                                                    }
                                                )}

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-6 py-4">

                                                <div className="
                                                    flex
                                                    justify-end
                                                    gap-2
                                                ">

                                                    {/* VIEW */}

                                                    <button
                                                        onClick={() =>
                                                            handleView(
                                                                customer
                                                            )
                                                        }
                                                        title="View"
                                                        className="
                                                            p-2
                                                            rounded-lg
                                                            text-blue-600
                                                            hover:bg-blue-50
                                                        "
                                                    >

                                                        <Eye
                                                            size={18}
                                                        />

                                                    </button>


                                                    {/* EDIT */}

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                customer
                                                            )
                                                        }
                                                        title="Edit"
                                                        className="
                                                            p-2
                                                            rounded-lg
                                                            text-green-600
                                                            hover:bg-green-50
                                                        "
                                                    >

                                                        <Pencil
                                                            size={18}
                                                        />

                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        onClick={() => {

                                                            setSelectedCustomer(
                                                                customer
                                                            );

                                                            setShowDeleteModal(
                                                                true
                                                            );

                                                        }}
                                                        title="Delete"
                                                        className="
                                                            p-2
                                                            rounded-lg
                                                            text-red-600
                                                            hover:bg-red-50
                                                        "
                                                    >

                                                        <Trash2
                                                            size={18}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-gray-500
                                        "
                                    >

                                        <Users
                                            size={40}
                                            className="
                                                mx-auto
                                                mb-3
                                                text-gray-300
                                            "
                                        />

                                        No customers found.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* ================================================= */}
                {/* MOBILE CARDS */}
                {/* ================================================= */}

                <div className="md:hidden">

                    {paginatedCustomers.length > 0 ? (

                        <div className="divide-y">

                            {paginatedCustomers.map(
                                (customer) => (

                                    <div
                                        key={customer._id}
                                        className="p-4"
                                    >

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <div className="
                                                    w-10
                                                    h-10
                                                    rounded-full
                                                    bg-blue-100
                                                    text-blue-600
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-semibold
                                                ">

                                                    {customer.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>


                                                <div>

                                                    <h3 className="
                                                        font-semibold
                                                        text-gray-800
                                                    ">
                                                        {customer.name}
                                                    </h3>

                                                    <p className="
                                                        text-sm
                                                        text-gray-500
                                                    ">
                                                        {
                                                            customer.email
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="
                                                text-right
                                            ">

                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                ">
                                                    Total Purchase
                                                </p>

                                                <p className="
                                                    font-semibold
                                                    text-gray-800
                                                ">

                                                    ₹
                                                    {Number(
                                                        customer.TotalPurchase ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2
                                                        }
                                                    )}

                                                </p>

                                            </div>

                                        </div>


                                        {/* PHONE */}

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            mt-3
                                            text-sm
                                            text-gray-600
                                        ">

                                            <Phone size={15} />

                                            {customer.phone}

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="
                                            flex
                                            justify-end
                                            gap-2
                                            mt-3
                                        ">

                                            <button
                                                onClick={() =>
                                                    handleView(
                                                        customer
                                                    )
                                                }
                                                className="
                                                    p-2
                                                    text-blue-600
                                                "
                                            >

                                                <Eye size={18} />

                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        customer
                                                    )
                                                }
                                                className="
                                                    p-2
                                                    text-green-600
                                                "
                                            >

                                                <Pencil size={18} />

                                            </button>


                                            <button
                                                onClick={() => {

                                                    setSelectedCustomer(
                                                        customer
                                                    );

                                                    setShowDeleteModal(
                                                        true
                                                    );

                                                }}
                                                className="
                                                    p-2
                                                    text-red-600
                                                "
                                            >

                                                <Trash2 size={18} />

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="
                            px-6
                            py-12
                            text-center
                            text-gray-500
                        ">

                            <Users
                                size={40}
                                className="
                                    mx-auto
                                    mb-3
                                    text-gray-300
                                "
                            />

                            No customers found.

                        </div>

                    )}

                </div>


                {/* ================================================= */}
                {/* PAGINATION */}
                {/* ================================================= */}

                {totalPages > 1 && (

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        items-center
                        justify-between
                        gap-4
                        px-4
                        md:px-6
                        py-4
                        border-t
                        bg-gray-50
                    ">


                        {/* SHOWING */}

                        <p className="
                            text-sm
                            text-gray-600
                        ">

                            Showing{" "}

                            <span className="font-medium">

                                {startIndex + 1}

                            </span>

                            {" - "}

                            <span className="font-medium">

                                {Math.min(
                                    startIndex +
                                    customersPerPage,
                                    filteredCustomers.length
                                )}

                            </span>

                            {" of "}

                            <span className="font-medium">

                                {filteredCustomers.length}

                            </span>

                            {" customers"}

                        </p>


                        {/* PAGINATION */}

                        <div className="
                            flex
                            items-center
                            gap-1
                        ">


                            {/* PREVIOUS */}

                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                                disabled={
                                    currentPage === 1
                                }
                                className="
                                    p-2
                                    border
                                    rounded-lg
                                    bg-white
                                    hover:bg-gray-100
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                "
                                title="Previous"
                            >

                                <ChevronLeft
                                    size={18}
                                />

                            </button>


                            {/* PAGE NUMBERS */}

                            <div className="
                                flex
                                items-center
                                gap-1
                            ">

                                {getPageNumbers().map(
                                    (page) => (

                                        <button
                                            key={page}
                                            onClick={() =>
                                                setCurrentPage(
                                                    page
                                                )
                                            }
                                            className={`
                                                min-w-[38px]
                                                h-[38px]
                                                px-2
                                                rounded-lg
                                                text-sm
                                                border
                                                transition

                                                ${
                                                    currentPage ===
                                                    page
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                                }
                                            `}
                                        >

                                            {page}

                                        </button>

                                    )
                                )}

                            </div>


                            {/* NEXT */}

                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                className="
                                    p-2
                                    border
                                    rounded-lg
                                    bg-white
                                    hover:bg-gray-100
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                "
                                title="Next"
                            >

                                <ChevronRight
                                    size={18}
                                />

                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* ADD CUSTOMER MODAL */}
            {/* ================================================= */}

            {showAddModal && (

                <div className="
                    fixed
                    inset-0
                    bg-black/50
                    flex
                    items-center
                    justify-center
                    z-50
                    p-4
                ">

                    <div className="
                        bg-white
                        rounded-xl
                        w-full
                        max-w-lg
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            px-6
                            py-4
                            border-b
                        ">

                            <h2 className="
                                text-lg
                                font-semibold
                            ">
                                Add Customer
                            </h2>


                            <button
                                onClick={
                                    closeAddModal
                                }
                                className="
                                    text-gray-500
                                    hover:text-gray-800
                                "
                            >

                                <X size={20} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleAddCustomer
                            }
                            className="
                                p-6
                                space-y-4
                            "
                        >

                            <CustomerForm
                                formData={formData}
                                handleChange={
                                    handleChange
                                }
                            />


                            <div className="
                                flex
                                justify-end
                                gap-3
                                pt-4
                            ">

                                <button
                                    type="button"
                                    onClick={
                                        closeAddModal
                                    }
                                    className="
                                        px-4
                                        py-2
                                        border
                                        rounded-lg
                                        hover:bg-gray-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="
                                        px-4
                                        py-2
                                        bg-blue-600
                                        text-white
                                        rounded-lg
                                        hover:bg-blue-700
                                        disabled:opacity-50
                                    "
                                >

                                    {submitting
                                        ? "Adding..."
                                        : "Add Customer"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* VIEW CUSTOMER MODAL */}
            {/* ================================================= */}

            {showViewModal &&
                selectedCustomer && (

                    <div className="
                        fixed
                        inset-0
                        bg-black/50
                        flex
                        items-center
                        justify-center
                        z-50
                        p-4
                    ">

                        <div className="
                            bg-white
                            rounded-xl
                            w-full
                            max-w-lg
                        ">


                            <div className="
                                flex
                                items-center
                                justify-between
                                px-6
                                py-4
                                border-b
                            ">

                                <h2 className="
                                    text-lg
                                    font-semibold
                                ">
                                    Customer Details
                                </h2>


                                <button
                                    onClick={
                                        closeViewModal
                                    }
                                    className="
                                        text-gray-500
                                        hover:text-gray-800
                                    "
                                >

                                    <X size={20} />

                                </button>

                            </div>


                            <div className="
                                p-6
                                space-y-5
                            ">


                                {/* NAME */}

                                <Detail
                                    label="Customer Name"
                                    value={
                                        selectedCustomer.name
                                    }
                                />


                                {/* EMAIL */}

                                <Detail
                                    label="Email"
                                    value={
                                        selectedCustomer.email
                                    }
                                />


                                {/* PHONE */}

                                <Detail
                                    label="Phone"
                                    value={
                                        selectedCustomer.phone
                                    }
                                />


                                {/* TOTAL PURCHASE */}

                                <Detail
                                    label="Total Purchase"
                                    value={`₹${Number(
                                        selectedCustomer.TotalPurchase ||
                                        0
                                    ).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}`}
                                />


                                <div className="
                                    flex
                                    justify-end
                                    pt-2
                                ">

                                    <button
                                        onClick={
                                            closeViewModal
                                        }
                                        className="
                                            px-4
                                            py-2
                                            bg-gray-800
                                            text-white
                                            rounded-lg
                                            hover:bg-gray-900
                                        "
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


            {/* ================================================= */}
            {/* EDIT CUSTOMER MODAL */}
            {/* ================================================= */}

            {showEditModal && (

                <div className="
                    fixed
                    inset-0
                    bg-black/50
                    flex
                    items-center
                    justify-center
                    z-50
                    p-4
                ">

                    <div className="
                        bg-white
                        rounded-xl
                        w-full
                        max-w-lg
                    ">


                        <div className="
                            flex
                            items-center
                            justify-between
                            px-6
                            py-4
                            border-b
                        ">

                            <h2 className="
                                text-lg
                                font-semibold
                            ">
                                Edit Customer
                            </h2>


                            <button
                                onClick={
                                    closeEditModal
                                }
                                className="
                                    text-gray-500
                                    hover:text-gray-800
                                "
                            >

                                <X size={20} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleUpdateCustomer
                            }
                            className="
                                p-6
                                space-y-4
                            "
                        >

                            <CustomerForm
                                formData={formData}
                                handleChange={
                                    handleChange
                                }
                            />


                            <div className="
                                flex
                                justify-end
                                gap-3
                                pt-4
                            ">

                                <button
                                    type="button"
                                    onClick={
                                        closeEditModal
                                    }
                                    className="
                                        px-4
                                        py-2
                                        border
                                        rounded-lg
                                        hover:bg-gray-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="
                                        px-4
                                        py-2
                                        bg-blue-600
                                        text-white
                                        rounded-lg
                                        hover:bg-blue-700
                                        disabled:opacity-50
                                    "
                                >

                                    {submitting
                                        ? "Updating..."
                                        : "Update Customer"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* DELETE CUSTOMER MODAL */}
            {/* ================================================= */}

            {showDeleteModal &&
                selectedCustomer && (

                    <div className="
                        fixed
                        inset-0
                        bg-black/50
                        flex
                        items-center
                        justify-center
                        z-50
                        p-4
                    ">

                        <div className="
                            bg-white
                            rounded-xl
                            w-full
                            max-w-md
                            p-6
                        ">


                            <div className="
                                flex
                                items-center
                                justify-center
                                w-12
                                h-12
                                rounded-full
                                bg-red-100
                                text-red-600
                                mx-auto
                                mb-4
                            ">

                                <Trash2 size={22} />

                            </div>


                            <h2 className="
                                text-lg
                                font-semibold
                                text-center
                            ">
                                Delete Customer?
                            </h2>


                            <p className="
                                text-sm
                                text-gray-500
                                text-center
                                mt-2
                            ">

                                Are you sure you want to
                                delete{" "}

                                <span className="
                                    font-semibold
                                    text-gray-700
                                ">

                                    {
                                        selectedCustomer.name
                                    }

                                </span>

                                ?

                                <br />

                                This action cannot be
                                undone.

                            </p>


                            <div className="
                                flex
                                justify-center
                                gap-3
                                mt-6
                            ">

                                <button
                                    onClick={
                                        closeDeleteModal
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="
                                        px-4
                                        py-2
                                        border
                                        rounded-lg
                                        hover:bg-gray-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    onClick={
                                        handleDeleteCustomer
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="
                                        px-4
                                        py-2
                                        bg-red-600
                                        text-white
                                        rounded-lg
                                        hover:bg-red-700
                                        disabled:opacity-50
                                    "
                                >

                                    {submitting
                                        ? "Deleting..."
                                        : "Delete"}

                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>

    );
};


// =============================================================
// CUSTOMER FORM
// =============================================================

const CustomerForm = ({
    formData,
    handleChange
}) => {

    return (
        <>

            {/* NAME */}

            <div>

                <label className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-1
                ">
                    Customer Name
                </label>


                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="
                        w-full
                        px-3
                        py-2.5
                        border
                        border-gray-300
                        rounded-lg
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                    placeholder="Enter customer name"
                />

            </div>


            {/* EMAIL */}

            <div>

                <label className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-1
                ">
                    Email
                </label>


                <div className="relative">

                    <Mail
                        size={17}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />


                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="
                            w-full
                            pl-10
                            pr-3
                            py-2.5
                            border
                            border-gray-300
                            rounded-lg
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                        placeholder="Enter email address"
                    />

                </div>

            </div>


            {/* PHONE */}

            <div>

                <label className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-1
                ">
                    Phone
                </label>


                <div className="relative">

                    <Phone
                        size={17}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />


                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="
                            w-full
                            pl-10
                            pr-3
                            py-2.5
                            border
                            border-gray-300
                            rounded-lg
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                        placeholder="Enter phone number"
                    />

                </div>

            </div>

        </>
    );
};


// =============================================================
// DETAIL COMPONENT
// =============================================================

const Detail = ({
    label,
    value
}) => {

    return (

        <div>

            <p className="
                text-xs
                text-gray-500
                mb-1
            ">
                {label}
            </p>


            <p className="
                text-sm
                font-medium
                text-gray-800
            ">
                {value || "-"}
            </p>

        </div>

    );
};


export default Customers;