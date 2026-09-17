import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    X,
    Loader2
} from "lucide-react";
import { Navigate } from "react-router-dom";

const Products = ({ login, setLogin, user }) => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================
    useEffect(() => {
        if (!login) {
            // Redirect to login page or handle unauthorized access
            navigate("/login");
        }
    }, [login]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [modalType, setModalType] = useState("add");
    // add | view | edit

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [deleteProduct, setDeleteProduct] =
        useState(null);

    const [message, setMessage] = useState({
        type: "",
        text: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        productcode: "",
        discount: ""
    });


    // =====================================================
    // GET PRODUCTS
    // =====================================================

    const getProducts = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/getProducts");

            /*
                Handles both:

                response.data
                OR
                response.data.products
            */

            const data = response.data;

            if (Array.isArray(data)) {

                setProducts(data);

            } else {

                setProducts(data.products || []);

            }

        } catch (error) {

            console.error(
                "Error fetching products:",
                error
            );

            setProducts([]);

            showMessage(
                "error",
                error.response?.data?.message ||
                "Unable to fetch products"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getProducts();

    }, []);


    // =====================================================
    // MESSAGE
    // =====================================================

    const showMessage = (type, text) => {

        setMessage({
            type,
            text
        });

        setTimeout(() => {

            setMessage({
                type: "",
                text: ""
            });

        }, 3000);

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredProducts = products.filter(
        (product) => {

            const searchText =
                search.toLowerCase();

            return (

                product.name
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                product.productcode
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                product.description
                    ?.toLowerCase()
                    .includes(searchText)

            );

        }
    );


    // =====================================================
    // FORM CHANGE
    // =====================================================

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


    // =====================================================
    // OPEN ADD
    // =====================================================

    const openAddModal = () => {

        setModalType("add");

        setSelectedProduct(null);

        setFormData({
            name: "",
            description: "",
            price: "",
            productcode: "",
            discount: ""
        });

        setShowModal(true);

    };


    // =====================================================
    // OPEN VIEW
    // =====================================================

    const openViewModal = (product) => {

        setModalType("view");

        setSelectedProduct(product);

        setShowModal(true);

    };


    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEditModal = (product) => {

        setModalType("edit");

        setSelectedProduct(product);

        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            productcode: product.productcode || "",
            discount: product.discount ?? ""
        });

        setShowModal(true);

    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        if (actionLoading) return;

        setShowModal(false);

        setSelectedProduct(null);

    };


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    const handleAddProduct = async (e) => {

        e.preventDefault();

        try {

            setActionLoading(true);

            const payload = {
                name: formData.name.trim(),
                description:
                    formData.description.trim(),
                price: Number(formData.price),
                productcode:
                    formData.productcode.trim(),
                discount:
                    formData.discount === ""
                        ? 0
                        : Number(formData.discount)
            };


            const response =
                await api.post(
                    "/addProduct",
                    payload
                );


            /*
                Add newly created product
                to the existing list.
            */

            const newProduct =
                response.data?.product ||
                response.data;


            if (
                newProduct &&
                newProduct._id
            ) {

                setProducts((prev) => [
                    newProduct,
                    ...prev
                ]);

            } else {

                /*
                    If backend doesn't return
                    the created product,
                    refresh the list.
                */

                await getProducts();

            }


            closeModal();

            showMessage(
                "success",
                "Product added successfully"
            );

        } catch (error) {

            console.error(
                "Add product error:",
                error
            );

            showMessage(
                "error",
                error.response?.data?.message ||
                "Unable to add product"
            );

        } finally {

            setActionLoading(false);

        }

    };


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    const handleUpdateProduct = async (e) => {

        e.preventDefault();

        if (!selectedProduct?._id) return;

        try {

            setActionLoading(true);

            const payload = {
                name: formData.name.trim(),
                description:
                    formData.description.trim(),
                price: Number(formData.price),
                productcode:
                    formData.productcode.trim(),
                discount:
                    formData.discount === ""
                        ? 0
                        : Number(formData.discount)
            };


            const response =
                await api.put(
                    `/update/${selectedProduct._id}`,
                    payload
                );


            const updatedProduct =
                response.data?.product ||
                response.data;


            setProducts((prev) =>
                prev.map((product) => {

                    if (
                        product._id ===
                        selectedProduct._id
                    ) {

                        return (
                            updatedProduct?._id
                                ? updatedProduct
                                : {
                                    ...product,
                                    ...payload
                                }
                        );

                    }

                    return product;

                })
            );


            closeModal();

            showMessage(
                "success",
                "Product updated successfully"
            );

        } catch (error) {

            console.error(
                "Update product error:",
                error
            );

            showMessage(
                "error",
                error.response?.data?.message ||
                "Unable to update product"
            );

        } finally {

            setActionLoading(false);

        }

    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDeleteProduct = async () => {

        if (!deleteProduct?._id) return;

        try {

            setActionLoading(true);

            await api.delete(
                `/delete/${deleteProduct._id}`
            );


            setProducts((prev) =>
                prev.filter(
                    (product) =>
                        product._id !==
                        deleteProduct._id
                )
            );


            setDeleteProduct(null);

            showMessage(
                "success",
                "Product deleted successfully"
            );

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            showMessage(
                "error",
                error.response?.data?.message ||
                "Unable to delete product"
            );

        } finally {

            setActionLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-50
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                    text-gray-600
                ">

                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    Loading products...

                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================
   
    return (

        <div className="
            min-h-screen
            bg-gray-50
            p-4
            md:p-6
            mt-16
            w-full
        ">


            {/* =========================================
                HEADER
            ========================================== */}

            <div className="
                max-w-7xl
                mx-auto
            ">

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    mb-6
                ">


                    <div>

                        <h1 className="
                            text-2xl
                            md:text-3xl
                            font-bold
                            text-gray-900
                        ">
                            Products
                        </h1>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            Manage your products and pricing
                        </p>

                    </div>


                    <button
                        onClick={openAddModal}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2.5
                            bg-blue-600
                            text-white
                            rounded-lg
                            hover:bg-blue-700
                            transition
                        "
                    >

                        <Plus size={19} />

                        Add Product

                    </button>


                </div>


                {/* =====================================
                    MESSAGE
                ====================================== */}

                {message.text && (

                    <div className={`
                        mb-5
                        px-4
                        py-3
                        rounded-lg
                        text-sm
                        ${
                            message.type === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }
                    `}>

                        {message.text}

                    </div>

                )}


                {/* =====================================
                    SEARCH
                ====================================== */}

                <div className="
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    p-4
                    mb-5
                ">

                    <div className="
                        relative
                        max-full
                    ">

                        <Search
                            size={18}
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
                                Search by product name, code or description...
                            "
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                pl-2
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


                {/* =====================================
                    DESKTOP TABLE
                ====================================== */}

                <div className="
                    hidden
                    md:block
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    overflow-hidden
                ">

                    <div className="
                        overflow-x-auto
                    ">

                        <table className="
                            w-full
                            text-sm
                        ">

                            <thead>

                                <tr className="
                                    bg-gray-50
                                    border-b
                                    border-gray-200
                                ">

                                    <th className="
                                        text-left
                                        px-5
                                        py-4
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Product
                                    </th>

                                    <th className="
                                        text-left
                                        px-5
                                        py-4
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Product Code
                                    </th>

                                    <th className="
                                        text-right
                                        px-5
                                        py-4
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Price
                                    </th>

                                    <th className="
                                        text-right
                                        px-5
                                        py-4
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Discount
                                    </th>

                                    <th className="
                                        text-right
                                        px-5
                                        py-4
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Final Price
                                    </th>

                                    <th className="
                                        text-center
                                        px-5
                                        py-4
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredProducts.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="
                                                text-center
                                                py-12
                                                text-gray-500
                                            "
                                        >
                                            No products found.
                                        </td>

                                    </tr>

                                ) : (

                                    filteredProducts.map(
                                        (product) => {

                                            const price =
                                                Number(
                                                    product.price
                                                ) || 0;

                                            const discount =
                                                Number(
                                                    product.discount
                                                ) || 0;

                                            const finalPrice =
                                                price -
                                                (
                                                    price *
                                                    discount
                                                ) / 100;


                                            return (

                                                <tr
                                                    key={
                                                        product._id
                                                    }
                                                    className="
                                                        border-b
                                                        border-gray-100
                                                        hover:bg-gray-50
                                                    "
                                                >

                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">

                                                        <div className="
                                                            font-medium
                                                            text-gray-900
                                                        ">
                                                            {
                                                                product.name
                                                            }
                                                        </div>

                                                        <div className="
                                                            text-xs
                                                            text-gray-500
                                                            mt-1
                                                        ">
                                                            {
                                                                product.description
                                                            }
                                                        </div>

                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-gray-600
                                                    ">
                                                        {
                                                            product.productcode
                                                        }
                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-right
                                                        font-medium
                                                    ">
                                                        ₹{price.toFixed(2)}
                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-right
                                                    ">

                                                        {discount}%

                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-right
                                                        font-semibold
                                                        text-gray-900
                                                    ">
                                                        ₹{finalPrice.toFixed(2)}
                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">

                                                        <div className="
                                                            flex
                                                            justify-center
                                                            gap-2
                                                        ">


                                                            {/* VIEW */}

                                                            <button
                                                                onClick={() =>
                                                                    openViewModal(
                                                                        product
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
                                                                    openEditModal(
                                                                        product
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
                                                                onClick={() =>
                                                                    setDeleteProduct(
                                                                        product
                                                                    )
                                                                }
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

                                            );

                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =====================================
                    MOBILE CARDS
                ====================================== */}

                <div className="
                    md:hidden
                    space-y-4
                ">

                    {filteredProducts.length === 0 ? (

                        <div className="
                            bg-white
                            rounded-xl
                            border
                            p-8
                            text-center
                            text-gray-500
                        ">
                            No products found.
                        </div>

                    ) : (

                        filteredProducts.map(
                            (product) => {

                                const price =
                                    Number(
                                        product.price
                                    ) || 0;

                                const discount =
                                    Number(
                                        product.discount
                                    ) || 0;

                                const finalPrice =
                                    price -
                                    (
                                        price *
                                        discount
                                    ) / 100;


                                return (

                                    <div
                                        key={
                                            product._id
                                        }
                                        className="
                                            bg-white
                                            rounded-xl
                                            border
                                            border-gray-200
                                            p-4
                                        "
                                    >

                                        <div className="
                                            flex
                                            justify-between
                                            gap-3
                                        ">

                                            <div>

                                                <h3 className="
                                                    font-semibold
                                                    text-gray-900
                                                ">
                                                    {
                                                        product.name
                                                    }
                                                </h3>

                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                ">
                                                    Code:{" "}
                                                    {
                                                        product.productcode
                                                    }
                                                </p>

                                            </div>


                                            <span className="
                                                font-semibold
                                                text-gray-900
                                            ">
                                                ₹{finalPrice.toFixed(2)}
                                            </span>

                                        </div>


                                        <p className="
                                            text-sm
                                            text-gray-600
                                            mt-3
                                        ">
                                            {
                                                product.description
                                            }
                                        </p>


                                        <div className="
                                            flex
                                            justify-between
                                            text-sm
                                            mt-4
                                            pt-3
                                            border-t
                                            border-gray-100
                                        ">

                                            <span>
                                                Price: ₹{price.toFixed(2)}
                                            </span>

                                            <span>
                                                Discount: {discount}%
                                            </span>

                                        </div>


                                        <div className="
                                            flex
                                            justify-end
                                            gap-2
                                            mt-4
                                        ">


                                            <button
                                                onClick={() =>
                                                    openViewModal(
                                                        product
                                                    )
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-blue-600
                                                    bg-blue-50
                                                    rounded-lg
                                                "
                                            >

                                                <Eye size={16} />

                                                View

                                            </button>


                                            <button
                                                onClick={() =>
                                                    openEditModal(
                                                        product
                                                    )
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-green-600
                                                    bg-green-50
                                                    rounded-lg
                                                "
                                            >

                                                <Pencil
                                                    size={16}
                                                />

                                                Edit

                                            </button>


                                            <button
                                                onClick={() =>
                                                    setDeleteProduct(
                                                        product
                                                    )
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-red-600
                                                    bg-red-50
                                                    rounded-lg
                                                "
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                                Delete

                                            </button>


                                        </div>

                                    </div>

                                );

                            }

                        )

                    )}

                </div>


                {/* =====================================
                    PRODUCT MODAL
                ====================================== */}

                {showModal && (

                    <div className="
                        fixed
                        inset-0
                        z-50
                        bg-black/50
                        flex
                        items-center
                        justify-center
                        p-4
                    ">


                        <div className="
                            bg-white
                            rounded-xl
                            shadow-xl
                            w-full
                            max-w-lg
                            max-h-[90vh]
                            overflow-y-auto
                        ">


                            {/* MODAL HEADER */}

                            <div className="
                                flex
                                items-center
                                justify-between
                                px-5
                                py-4
                                border-b
                            ">

                                <h2 className="
                                    text-lg
                                    font-semibold
                                ">

                                    {modalType === "add"
                                        ? "Add Product"
                                        : modalType === "edit"
                                            ? "Edit Product"
                                            : "Product Details"}

                                </h2>


                                <button
                                    onClick={closeModal}
                                    className="
                                        p-1.5
                                        rounded-lg
                                        hover:bg-gray-100
                                    "
                                >

                                    <X size={20} />

                                </button>

                            </div>


                            {/* VIEW */}

                            {modalType === "view" && (

                                <div className="
                                    p-5
                                    space-y-5
                                ">


                                    <div>

                                        <p className="
                                            text-xs
                                            text-gray-500
                                            mb-1
                                        ">
                                            Product Name
                                        </p>

                                        <p className="
                                            font-semibold
                                            text-gray-900
                                        ">
                                            {
                                                selectedProduct?.name
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="
                                            text-xs
                                            text-gray-500
                                            mb-1
                                        ">
                                            Product Code
                                        </p>

                                        <p className="
                                            text-gray-900
                                        ">
                                            {
                                                selectedProduct?.productcode
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="
                                            text-xs
                                            text-gray-500
                                            mb-1
                                        ">
                                            Description
                                        </p>

                                        <p className="
                                            text-gray-900
                                        ">
                                            {
                                                selectedProduct?.description
                                            }
                                        </p>

                                    </div>


                                    <div className="
                                        grid
                                        grid-cols-2
                                        gap-4
                                    ">


                                        <div>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                                mb-1
                                            ">
                                                Price
                                            </p>

                                            <p className="
                                                font-semibold
                                            ">
                                                ₹{Number(
                                                    selectedProduct?.price ||
                                                    0
                                                ).toFixed(2)}
                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                                mb-1
                                            ">
                                                Discount
                                            </p>

                                            <p className="
                                                font-semibold
                                            ">
                                                {
                                                    selectedProduct?.discount ||
                                                    0
                                                }%
                                            </p>

                                        </div>


                                    </div>


                                    <div className="
                                        pt-4
                                        border-t
                                    ">

                                        <p className="
                                            text-xs
                                            text-gray-500
                                            mb-1
                                        ">
                                            Final Price
                                        </p>

                                        <p className="
                                            text-xl
                                            font-bold
                                        ">

                                            ₹{(
                                                (
                                                    Number(
                                                        selectedProduct?.price
                                                    ) || 0
                                                ) -
                                                (
                                                    (
                                                        Number(
                                                            selectedProduct?.price
                                                        ) || 0
                                                    ) *
                                                    (
                                                        Number(
                                                            selectedProduct?.discount
                                                        ) || 0
                                                    )
                                                ) / 100
                                            ).toFixed(2)}

                                        </p>

                                    </div>


                                    <button
                                        onClick={closeModal}
                                        className="
                                            w-full
                                            py-2.5
                                            bg-gray-800
                                            text-white
                                            rounded-lg
                                            hover:bg-gray-900
                                        "
                                    >
                                        Close
                                    </button>


                                </div>

                            )}


                            {/* ADD / EDIT FORM */}

                            {(modalType === "add" ||
                                modalType === "edit") && (

                                <form
                                    onSubmit={
                                        modalType === "add"
                                            ? handleAddProduct
                                            : handleUpdateProduct
                                    }
                                    className="
                                        p-5
                                        space-y-4
                                    "
                                >


                                    {/* NAME */}

                                    <div>

                                        <label className="
                                            block
                                            text-sm
                                            font-medium
                                            text-gray-700
                                            mb-1
                                        ">
                                            Product Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            placeholder="
                                                Enter product name
                                            "
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
                                        />

                                    </div>


                                    {/* PRODUCT CODE */}

                                    <div>

                                        <label className="
                                            block
                                            text-sm
                                            font-medium
                                            text-gray-700
                                            mb-1
                                        ">
                                            Product Code
                                        </label>

                                        <input
                                            type="text"
                                            name="productcode"
                                            value={
                                                formData.productcode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            placeholder="
                                                Enter product code
                                            "
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
                                        />

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div>

                                        <label className="
                                            block
                                            text-sm
                                            font-medium
                                            text-gray-700
                                            mb-1
                                        ">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            rows="3"
                                            placeholder="
                                                Enter product description
                                            "
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
                                                resize-none
                                            "
                                        />

                                    </div>


                                    {/* PRICE + DISCOUNT */}

                                    <div className="
                                        grid
                                        grid-cols-2
                                        gap-4
                                    ">


                                        <div>

                                            <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-gray-700
                                                mb-1
                                            ">
                                                Price
                                            </label>

                                            <input
                                                type="number"
                                                name="price"
                                                value={
                                                    formData.price
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
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
                                            />

                                        </div>


                                        <div>

                                            <label className="
                                                block
                                                text-sm
                                                font-medium
                                                text-gray-700
                                                mb-1
                                            ">
                                                Discount (%)
                                            </label>

                                            <input
                                                type="number"
                                                name="discount"
                                                value={
                                                    formData.discount
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                placeholder="0"
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
                                            />

                                        </div>


                                    </div>


                                    {/* BUTTONS */}

                                    <div className="
                                        flex
                                        justify-end
                                        gap-3
                                        pt-3
                                    ">


                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            disabled={
                                                actionLoading
                                            }
                                            className="
                                                px-4
                                                py-2.5
                                                border
                                                border-gray-300
                                                rounded-lg
                                                hover:bg-gray-50
                                            "
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            disabled={
                                                actionLoading
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                px-4
                                                py-2.5
                                                bg-blue-600
                                                text-white
                                                rounded-lg
                                                hover:bg-blue-700
                                                disabled:opacity-60
                                            "
                                        >

                                            {actionLoading && (

                                                <Loader2
                                                    size={17}
                                                    className="
                                                        animate-spin
                                                    "
                                                />

                                            )}


                                            {modalType === "add"
                                                ? "Add Product"
                                                : "Update Product"}

                                        </button>


                                    </div>


                                </form>

                            )}

                        </div>

                    </div>

                )}


                {/* =====================================
                    DELETE CONFIRMATION
                ====================================== */}

                {deleteProduct && (

                    <div className="
                        fixed
                        inset-0
                        z-60
                        bg-black/50
                        flex
                        items-center
                        justify-center
                        p-4
                    ">

                        <div className="
                            bg-white
                            rounded-xl
                            shadow-xl
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
                                mb-4
                            ">

                                <Trash2 size={22} />

                            </div>


                            <h2 className="
                                text-lg
                                font-semibold
                                text-gray-900
                            ">
                                Delete Product?
                            </h2>


                            <p className="
                                text-sm
                                text-gray-600
                                mt-2
                            ">

                                Are you sure you want to
                                delete{" "}

                                <strong>
                                    {deleteProduct.name}
                                </strong>

                                ? This action cannot be
                                undone.

                            </p>


                            <div className="
                                flex
                                justify-end
                                gap-3
                                mt-6
                            ">


                                <button
                                    onClick={() =>
                                        setDeleteProduct(
                                            null
                                        )
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="
                                        px-4
                                        py-2.5
                                        border
                                        border-gray-300
                                        rounded-lg
                                        hover:bg-gray-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    onClick={
                                        handleDeleteProduct
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        bg-red-600
                                        text-white
                                        rounded-lg
                                        hover:bg-red-700
                                        disabled:opacity-60
                                    "
                                >

                                    {actionLoading && (

                                        <Loader2
                                            size={17}
                                            className="
                                                animate-spin
                                            "
                                        />

                                    )}

                                    Delete

                                </button>


                            </div>


                        </div>

                    </div>

                )}

            </div>

        </div>

    );
};

export default Products;
