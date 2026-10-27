import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Plus,
    Minus,
    Trash2,
    UserPlus,
    X,
    Receipt,
    Loader2,
    ShoppingCart,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Billing = ({login}) => {
    const navigate = useNavigate();

    // ==============================
    // STATE
    // ==============================

    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [productSearch, setProductSearch] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [cart, setCart] = useState([]);

    const [showCustomerDropdown, setShowCustomerDropdown] =
        useState(false);

    const [showAddCustomer, setShowAddCustomer] =
        useState(false);

    const [loadingProducts, setLoadingProducts] =
        useState(true);

    const [loadingCustomers, setLoadingCustomers] =
        useState(true);

    const [creatingBill, setCreatingBill] =
        useState(false);

    const [creatingCustomer, setCreatingCustomer] =
        useState(false);

    const [error, setError] = useState("");

    const [customerForm, setCustomerForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (!login) {
            navigate("/login");
        }
    }, [login, navigate]);

    // ==============================
    // FETCH PRODUCTS
    // ==============================

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);

            const response = await api.get("/getProducts");

            // Backend returns:
            // { products: [...] }

            setProducts(response.data.products || []);
        } catch (error) {
            console.error(
                "Error fetching products:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to load products"
            );

            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    };

    // ==============================
    // FETCH CUSTOMERS
    // ==============================

    const fetchCustomers = async () => {
        try {
            setLoadingCustomers(true);

            const response = await api.get("/getCustomers");

            // Backend should return:
            // { customers: [...] }

            setCustomers(response.data.customers || []);
        } catch (error) {
            console.error(
                "Error fetching customers:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to load customers"
            );

            setCustomers([]);
        } finally {
            setLoadingCustomers(false);
        }
    };

    // ==============================
    // INITIAL LOAD
    // ==============================

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    // ==============================
    // FILTER PRODUCTS
    // ==============================

    const filteredProducts = useMemo(() => {
        const search =
            productSearch.trim().toLowerCase();

        if (!search) {
            return products;
        }

        return products.filter((product) => {
            return (
                product.name
                    ?.toLowerCase()
                    .includes(search) ||
                product.productcode
                    ?.toLowerCase()
                    .includes(search) ||
                product.description
                    ?.toLowerCase()
                    .includes(search)
            );
        });
    }, [products, productSearch]);

    // ==============================
    // FILTER CUSTOMERS
    // ==============================

    const filteredCustomers = useMemo(() => {
        const search =
            customerSearch.trim().toLowerCase();

        if (!search) {
            return customers;
        }

        return customers.filter((customer) => {
            return (
                customer.name
                    ?.toLowerCase()
                    .includes(search) ||
                customer.email
                    ?.toLowerCase()
                    .includes(search) ||
                customer.phone
                    ?.toLowerCase()
                    .includes(search)
            );
        });
    }, [customers, customerSearch]);

    // ==============================
    // FORMAT CURRENCY
    // ==============================

    const formatCurrency = (amount) => {
        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
            }
        );
    };

    // ==============================
    // FINAL PRODUCT PRICE
    // ==============================

    const getFinalPrice = (product) => {
        const price = Number(product?.price) || 0;

        const discount =
            Number(product?.discount) || 0;

        return (
            price -
            (price * discount) / 100
        );
    };

    // ==============================
    // ADD PRODUCT
    // ==============================

    const addToCart = (product) => {
        setError("");

        setCart((previousCart) => {
            const existingProduct =
                previousCart.find(
                    (item) =>
                        item.product._id ===
                        product._id
                );

            if (existingProduct) {
                return previousCart.map((item) =>
                    item.product._id ===
                    product._id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + 1,
                          }
                        : item
                );
            }

            return [
                ...previousCart,
                {
                    product,
                    quantity: 1,
                },
            ];
        });
    };

    // ==============================
    // INCREASE QUANTITY
    // ==============================

    const increaseQuantity = (productId) => {
        setCart((previousCart) =>
            previousCart.map((item) =>
                item.product._id === productId
                    ? {
                          ...item,
                          quantity:
                              item.quantity + 1,
                      }
                    : item
            )
        );
    };

    // ==============================
    // DECREASE QUANTITY
    // ==============================

    const decreaseQuantity = (productId) => {
        setCart((previousCart) =>
            previousCart
                .map((item) =>
                    item.product._id === productId
                        ? {
                              ...item,
                              quantity:
                                  item.quantity - 1,
                          }
                        : item
                )
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    };

    // ==============================
    // REMOVE PRODUCT
    // ==============================

    const removeFromCart = (productId) => {
        setCart((previousCart) =>
            previousCart.filter(
                (item) =>
                    item.product._id !==
                    productId
            )
        );
    };

    // ==============================
    // SUBTOTAL
    // ==============================

    const subtotal = useMemo(() => {
        return cart.reduce(
            (total, item) => {
                const price =
                    Number(
                        item.product.price
                    ) || 0;

                const quantity =
                    Number(item.quantity) || 0;

                return (
                    total +
                    price * quantity
                );
            },
            0
        );
    }, [cart]);

    // ==============================
    // TOTAL DISCOUNT
    // ==============================

    const totalDiscount = useMemo(() => {
        return cart.reduce(
            (total, item) => {
                const price =
                    Number(
                        item.product.price
                    ) || 0;

                const discount =
                    Number(
                        item.product.discount
                    ) || 0;

                const quantity =
                    Number(item.quantity) || 0;

                const discountAmount =
                    (price * discount) / 100;

                return (
                    total +
                    discountAmount *
                        quantity
                );
            },
            0
        );
    }, [cart]);

    // ==============================
    // FINAL TOTAL
    // ==============================

    const totalAmount = useMemo(() => {
        return subtotal - totalDiscount;
    }, [subtotal, totalDiscount]);

    // ==============================
    // TOTAL ITEMS
    // ==============================

    const totalItems = useMemo(() => {
        return cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );
    }, [cart]);

    // ==============================
    // CUSTOMER FORM
    // ==============================

    const handleCustomerInput = (event) => {
        const { name, value } =
            event.target;

        setCustomerForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ==============================
    // SELECT CUSTOMER
    // ==============================

    const handleSelectCustomer = (
        customer
    ) => {
        setSelectedCustomer(customer);

        setCustomerSearch(
            customer.name
        );

        setShowCustomerDropdown(false);

        setError("");
    };

    // ==============================
    // CREATE CUSTOMER
    // ==============================

    const handleCreateCustomer = async (
        event
    ) => {
        event.preventDefault();

        setError("");

        if (
            !customerForm.name.trim()
        ) {
            setError(
                "Customer name is required."
            );
            return;
        }

        if (
            !customerForm.email.trim()
        ) {
            setError(
                "Customer email is required."
            );
            return;
        }

        if (
            !customerForm.phone.trim()
        ) {
            setError(
                "Customer phone is required."
            );
            return;
        }

        try {
            setCreatingCustomer(true);

            const response =
                await api.post(
                    "/addCustomer",
                    {
                        name: customerForm.name.trim(),
                        email: customerForm.email.trim(),
                        phone: customerForm.phone.trim(),
                    }
                );

            /*
             * Depending on your controller,
             * response may be:
             *
             * { customer: {...} }
             *
             * or directly:
             *
             * {...}
             */

            const newCustomer =
                response.data?.customer ||
                response.data;

            if (!newCustomer?._id) {
                throw new Error(
                    "Customer was created but customer data was not returned."
                );
            }

            setCustomers(
                (previous) => [
                    newCustomer,
                    ...previous,
                ]
            );

            setSelectedCustomer(
                newCustomer
            );

            setCustomerSearch(
                newCustomer.name
            );

            setCustomerForm({
                name: "",
                email: "",
                phone: "",
            });

            setShowAddCustomer(false);
        } catch (error) {
            console.error(
                "Error creating customer:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                    error.message ||
                    "Failed to create customer"
            );
        } finally {
            setCreatingCustomer(false);
        }
    };

    // ==============================
    // CREATE BILL
    // ==============================

    const handleCreateBill = async () => {
        setError("");

        if (!selectedCustomer) {
            setError(
                "Please select a customer."
            );
            return;
        }

        if (cart.length === 0) {
            setError(
                "Please add at least one product."
            );
            return;
        }

        try {
            setCreatingBill(true);

            /*
             * Matches your Bill schema:
             *
             * customer: ObjectId
             *
             * description: [
             *   {
             *      product: ObjectId,
             *      quantity: Number
             *   }
             * ]
             *
             * amount: Number
             */

            const billData = {
                customer:
                    selectedCustomer._id,

                description:
                    cart.map((item) => ({
                        product:
                            item.product._id,
                        quantity:
                            item.quantity,
                    })),

                amount: Number(
                    totalAmount.toFixed(2)
                ),
            };

            const response =
                await api.post(
                    "/addBill",
                    billData
                );

            /*
             * Expected response:
             *
             * {
             *    bill: {...}
             * }
             *
             * or directly:
             *
             * {...}
             */

            const bill =
                response.data?.bill ||
                response.data;

            const billId =
                bill?._id ||
                response.data?.billId ||
                response.data?.id;

            if (!billId) {
                throw new Error(
                    "Bill was created but no bill ID was returned."
                );
            }

            // Open the created bill
            navigate(
                `/bills/${billId}`
            );
        } catch (error) {
            console.error(
                "Error creating bill:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                    error.message ||
                    "Failed to create bill"
            );
        } finally {
            setCreatingBill(false);
        }
    };

    // ==============================
    // JSX
    // ==============================

    return (
        <div className="w-full mt-16 min-h-screen bg-gray-50 p-4 md:p-6">

            {/* ==========================
                PAGE HEADER
            ========================== */}

            <div className="mb-6">

                <div className="flex items-center gap-3">

                    <div className="p-3 bg-blue-600 rounded-xl text-white">
                        <Receipt size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Create New Bill
                        </h1>

                        <p className="text-sm text-gray-500">
                            Select customer and add products
                        </p>
                    </div>

                </div>

            </div>

            {/* ==========================
                ERROR MESSAGE
            ========================== */}

            {error && (
                <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <span>{error}</span>

                    <button
                        onClick={() =>
                            setError("")
                        }
                        className="text-red-500 hover:text-red-700"
                    >
                        <X size={18} />
                    </button>

                </div>
            )}

            {/* ==========================
                MAIN GRID
            ========================== */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* =====================================================
                    PRODUCTS
                ===================================================== */}

                <div className="xl:col-span-2">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* PRODUCT HEADER */}

                        <div className="p-5 border-b border-gray-200">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div>

                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Products
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Select products to add to bill
                                    </p>

                                </div>

                                <div className="relative w-full sm:w-80">

                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        value={
                                            productSearch
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setProductSearch(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Search product..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* PRODUCT LIST */}

                        <div className="p-5">

                            {loadingProducts ? (
                                <div className="flex justify-center py-16">

                                    <Loader2
                                        className="animate-spin text-blue-600"
                                        size={30}
                                    />

                                </div>
                            ) : filteredProducts.length ===
                              0 ? (
                                <div className="text-center py-16 text-gray-500">

                                    <ShoppingCart
                                        size={40}
                                        className="mx-auto mb-3 text-gray-300"
                                    />

                                    <p>
                                        No products found
                                    </p>

                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                    {filteredProducts.map(
                                        (
                                            product
                                        ) => (
                                            <button
                                                key={
                                                    product._id
                                                }
                                                onClick={() =>
                                                    addToCart(
                                                        product
                                                    )
                                                }
                                                className="text-left border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition bg-white"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="min-w-0">

                                                        <h3 className="font-semibold text-gray-800 truncate">
                                                            {
                                                                product.name
                                                            }
                                                        </h3>

                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {
                                                                product.productcode
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="shrink-0 p-2 rounded-lg bg-blue-50 text-blue-600">

                                                        <Plus
                                                            size={
                                                                18
                                                            }
                                                        />

                                                    </div>

                                                </div>

                                                <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                                                    {
                                                        product.description
                                                    }
                                                </p>

                                                <div className="mt-4 flex items-center justify-between gap-2">

                                                    <div>

                                                        <span className="font-bold text-gray-800">
                                                            {formatCurrency(
                                                                getFinalPrice(
                                                                    product
                                                                )
                                                            )}
                                                        </span>

                                                        {Number(
                                                            product.discount
                                                        ) >
                                                            0 && (
                                                            <span className="ml-2 text-xs text-gray-400 line-through">
                                                                {formatCurrency(
                                                                    product.price
                                                                )}
                                                            </span>
                                                        )}

                                                    </div>

                                                    {Number(
                                                        product.discount
                                                    ) >
                                                        0 && (
                                                        <span className="text-xs font-medium text-green-600">
                                                            {
                                                                product.discount
                                                            }
                                                            % OFF
                                                        </span>
                                                    )}

                                                </div>

                                            </button>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    RIGHT SIDE
                ===================================================== */}

                <div className="space-y-5">

                    {/* =================================================
                        CUSTOMER
                    ================================================= */}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

                        <div className="flex items-center justify-between mb-4">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Customer
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Who is this bill for?
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowAddCustomer(
                                        true
                                    )
                                }
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                            >
                                <UserPlus
                                    size={16}
                                />

                                Add
                            </button>

                        </div>

                        {/* CUSTOMER SEARCH */}

                        <div className="relative">

                            <div className="relative">

                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={
                                        customerSearch
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        setCustomerSearch(
                                            e
                                                .target
                                                .value
                                        );

                                        setSelectedCustomer(
                                            null
                                        );

                                        setShowCustomerDropdown(
                                            true
                                        );
                                    }}
                                    onFocus={() =>
                                        setShowCustomerDropdown(
                                            true
                                        )
                                    }
                                    placeholder="Search customer..."
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <ChevronDown
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                            </div>

                            {/* CUSTOMER DROPDOWN */}

                            {showCustomerDropdown && (
                                <div className="absolute z-30 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">

                                    {loadingCustomers ? (
                                        <div className="p-5 text-center">

                                            <Loader2
                                                size={
                                                    20
                                                }
                                                className="animate-spin mx-auto text-blue-600"
                                            />

                                        </div>
                                    ) : filteredCustomers.length ===
                                      0 ? (
                                        <div className="p-5 text-center text-sm text-gray-500">
                                            No customers found.
                                        </div>
                                    ) : (
                                        filteredCustomers.map(
                                            (
                                                customer
                                            ) => (
                                                <button
                                                    key={
                                                        customer._id
                                                    }
                                                    onClick={() =>
                                                        handleSelectCustomer(
                                                            customer
                                                        )
                                                    }
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 border-gray-100"
                                                >

                                                    <p className="font-medium text-gray-800">
                                                        {
                                                            customer.name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {
                                                            customer.phone
                                                        }

                                                        {" • "}

                                                        {
                                                            customer.email
                                                        }
                                                    </p>

                                                </button>
                                            )
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                        {/* SELECTED CUSTOMER */}

                        {selectedCustomer && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="font-semibold text-gray-800">
                                            {
                                                selectedCustomer.name
                                            }
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            {
                                                selectedCustomer.phone
                                            }
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {
                                                selectedCustomer.email
                                            }
                                        </p>

                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedCustomer(
                                                null
                                            );

                                            setCustomerSearch(
                                                ""
                                            );
                                        }}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X
                                            size={
                                                18
                                            }
                                        />
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        CURRENT BILL
                    ================================================= */}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* CART HEADER */}

                        <div className="p-5 border-b border-gray-200">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Current Bill
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {totalItems}{" "}
                                        {totalItems ===
                                        1
                                            ? "item"
                                            : "items"}
                                    </p>

                                </div>

                                <ShoppingCart
                                    size={22}
                                    className="text-blue-600"
                                />

                            </div>

                        </div>

                        {/* CART ITEMS */}

                        <div className="max-h-105 overflow-y-auto">

                            {cart.length ===
                            0 ? (
                                <div className="py-12 px-5 text-center text-gray-400">

                                    <ShoppingCart
                                        size={
                                            40
                                        }
                                        className="mx-auto mb-3 text-gray-300"
                                    />

                                    <p className="text-sm">
                                        No products added
                                    </p>

                                    <p className="text-xs mt-1">
                                        Click a product to add it
                                    </p>

                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">

                                    {cart.map(
                                        (
                                            item
                                        ) => {
                                            const product =
                                                item.product;

                                            const finalPrice =
                                                getFinalPrice(
                                                    product
                                                );

                                            const itemTotal =
                                                finalPrice *
                                                item.quantity;

                                            return (
                                                <div
                                                    key={
                                                        product._id
                                                    }
                                                    className="p-4"
                                                >

                                                    <div className="flex items-start gap-3">

                                                        <div className="flex-1 min-w-0">

                                                            <h3 className="font-medium text-gray-800 truncate">
                                                                {
                                                                    product.name
                                                                }
                                                            </h3>

                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {formatCurrency(
                                                                    finalPrice
                                                                )}{" "}
                                                                each
                                                            </p>

                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    product._id
                                                                )
                                                            }
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>

                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between">

                                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">

                                                            <button
                                                                onClick={() =>
                                                                    decreaseQuantity(
                                                                        product._id
                                                                    )
                                                                }
                                                                className="p-2 hover:bg-gray-100"
                                                            >
                                                                <Minus
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            </button>

                                                            <span className="px-4 text-sm font-semibold">
                                                                {
                                                                    item.quantity
                                                                }
                                                            </span>

                                                            <button
                                                                onClick={() =>
                                                                    increaseQuantity(
                                                                        product._id
                                                                    )
                                                                }
                                                                className="p-2 hover:bg-gray-100"
                                                            >
                                                                <Plus
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            </button>

                                                        </div>

                                                        <p className="font-semibold text-gray-800">
                                                            {formatCurrency(
                                                                itemTotal
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </div>

                        {/* BILL SUMMARY */}

                        <div className="border-t border-gray-200 p-5">

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between text-gray-600">

                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        {formatCurrency(
                                            subtotal
                                        )}
                                    </span>

                                </div>

                                <div className="flex justify-between text-green-600">

                                    <span>
                                        Discount
                                    </span>

                                    <span>
                                        -{" "}
                                        {formatCurrency(
                                            totalDiscount
                                        )}
                                    </span>

                                </div>

                                <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between items-center">

                                    <span className="font-semibold text-gray-800">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(
                                            totalAmount
                                        )}
                                    </span>

                                </div>

                            </div>

                            {/* CREATE BILL BUTTON */}

                            <button
                                onClick={
                                    handleCreateBill
                                }
                                disabled={
                                    creatingBill ||
                                    cart.length ===
                                        0 ||
                                    !selectedCustomer
                                }
                                className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition"
                            >

                                {creatingBill ? (
                                    <>
                                        <Loader2
                                            size={
                                                20
                                            }
                                            className="animate-spin"
                                        />

                                        Creating Bill...
                                    </>
                                ) : (
                                    <>
                                        <Receipt
                                            size={
                                                20
                                            }
                                        />

                                        Create Bill
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* =====================================================
                ADD CUSTOMER MODAL
            ===================================================== */}

            {showAddCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between p-5 border-b border-gray-200">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Add Customer
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Create a customer for this bill
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowAddCustomer(
                                        false
                                    )
                                }
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* MODAL FORM */}

                        <form
                            onSubmit={
                                handleCreateCustomer
                            }
                            className="p-5 space-y-4"
                        >

                            {/* NAME */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        customerForm.name
                                    }
                                    onChange={
                                        handleCustomerInput
                                    }
                                    placeholder="Customer name"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* EMAIL */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        customerForm.email
                                    }
                                    onChange={
                                        handleCustomerInput
                                    }
                                    placeholder="customer@example.com"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* PHONE */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        customerForm.phone
                                    }
                                    onChange={
                                        handleCustomerInput
                                    }
                                    placeholder="Phone number"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* BUTTONS */}

                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddCustomer(
                                            false
                                        )
                                    }
                                    className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        creatingCustomer
                                    }
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium"
                                >

                                    {creatingCustomer ? (
                                        <>
                                            <Loader2
                                                size={
                                                    18
                                                }
                                                className="animate-spin"
                                            />

                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus
                                                size={
                                                    18
                                                }
                                            />

                                            Add Customer
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Billing;