import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, Printer, Download } from "lucide-react";

const Bills = ({login}) => {

    const navigate = useNavigate();
    useEffect(() => {
        if (!login) {
            // Redirect to login page or handle unauthorized access
            navigate("/login");
        }
    }, [login, navigate]);

  const handlePrint = (billId) => {
    console.log("Print bill:", billId);

    // Later we will open a printable invoice page
  };

  const handleDownload = (billId) => {
    console.log("Download bill:", billId);

    // Later we will generate/download the PDF
  };
  const handleView = (billId) => {
    navigate(`/bills/${billId}`);

    // Later we will open a detailed view page for the bill
  };

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);


  const [filters, setFilters] = useState({
    search: "",
    customer: "",
    from: "",
    to: "",
    minAmount: "",
    maxAmount: "",
    sort: "newest",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBills: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // --------------------------------
  // Fetch bills
  // --------------------------------

  const getBills = async () => {
    try {
      setLoading(true);

      const response = await api.get("/getBills", {
        params: filters,
      });

      setBills(response.data.bills);

      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching bills:", error);

      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Fetch whenever filters change
  // --------------------------------

  useEffect(() => {
    getBills();
  }, [
    filters.search,
    filters.customer,
    filters.from,
    filters.to,
    filters.minAmount,
    filters.maxAmount,
    filters.sort,
    filters.page,
  ]);

  // --------------------------------
  // Handle input changes
  // --------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  // --------------------------------
  // Clear filters
  // --------------------------------

  const clearFilters = () => {
    setFilters({
      search: "",
      customer: "",
      from: "",
      to: "",
      minAmount: "",
      maxAmount: "",
      sort: "newest",
      page: 1,
      limit: 10,
    });
  };

  // --------------------------------
  // Pagination
  // --------------------------------

  const nextPage = () => {
    if (pagination.hasNextPage) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const previousPage = () => {
    if (pagination.hasPreviousPage) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  // --------------------------------
  // Format date
  // --------------------------------

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mt-16 h-full w-full bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Bills</h1>

        <p className="text-gray-500 mt-1">View and manage your bills</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by bill number, customer name or phone..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* From date */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>

            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To date */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>

            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Minimum amount */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Min Amount
            </label>

            <input
              type="number"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleChange}
              placeholder="₹ Minimum"
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Maximum amount */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Max Amount
            </label>

            <input
              type="number"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleChange}
              placeholder="₹ Maximum"
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sort</label>

            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Clear button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600
                                   border border-gray-300 rounded-lg
                                   hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="px-4 sm:px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-800">Bill History</h2>

              <p className="text-sm text-gray-500 mt-1">
                {pagination.totalBills} bills found
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-gray-500">
            Loading bills...
          </div>
        )}

        {/* Empty */}
        {!loading && bills.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-500">No bills found</p>

            <button
              onClick={clearFilters}
              className="mt-3 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Desktop table */}
        {!loading && bills.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                    Bill No.
                  </th>

                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                    Customer
                  </th>

                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                    Date
                  </th>

                  <th className="text-center px-6 py-3 text-sm font-medium text-gray-600">
                    Items
                  </th>

                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-600">
                    Amount
                  </th>

                  <th className="text-center px-6 py-3 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {bill.billNumber || bill._id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {bill.customer?.name || "Unknown"}
                      </div>

                      <div className="text-sm text-gray-500">
                        {bill.customer?.phone || ""}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(bill.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-center text-gray-600">
                      {bill.description?.length || 0}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      ₹{Number(bill.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => {
                            handleView(bill._id);
                          }}
                          title="View Bill"
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50
                       transition"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Print */}
                        <button
                          onClick={() => handlePrint(bill._id)}
                          title="Print Bill"
                          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100
                       transition"
                        >
                          <Printer size={18} />
                        </button>

                        {/* Download */}
                        <button
                          onClick={() => handleDownload(bill._id)}
                          title="Download Bill"
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50
                       transition"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile cards */}
        {!loading && bills.length > 0 && (
          <div className="md:hidden divide-y">
            {bills.map((bill) => (
              <div key={bill._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {bill.billNumber || bill._id}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {bill.customer?.name || "Unknown"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {bill.customer?.phone || ""}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-800">
                    ₹{Number(bill.amount).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-3 text-sm">
                  <div className="text-gray-500">
                    {formatDate(bill.createdAt)}
                    {" • "}
                    {bill.description?.length || 0} items
                  </div>
                  <div className="flex items-center gap-1">
                    {/* View */}
                    <button
                      onClick={() => {
                        handleView(bill._id);
                      }}
                      title="View Bill"
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                    >
                      <Eye size={17} />
                    </button>

                    {/* Print */}
                    <button
                      onClick={() => handlePrint(bill._id)}
                      title="Print Bill"
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                      <Printer size={17} />
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => handleDownload(bill._id)}
                      title="Download Bill"
                      className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                    >
                      <Download size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && bills.length > 0 && (
        <div
          className="flex flex-col sm:flex-row justify-between
                                items-center gap-4 mt-5"
        >
          <p className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={previousPage}
              disabled={!pagination.hasPreviousPage}
              className="px-4 py-2 border rounded-lg
                                       disabled:opacity-40
                                       disabled:cursor-not-allowed
                                       hover:bg-gray-100"
            >
              Previous
            </button>

            <button
              onClick={nextPage}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 border rounded-lg
                                       disabled:opacity-40
                                       disabled:cursor-not-allowed
                                       hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
