import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Printer, Download, Loader2 } from "lucide-react";
import api from "../services/api";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getItemPrice = (product) => {
  if (!product) return 0;

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;

  return price - (price * discount) / 100;
};

const getItemTotal = (item) => {
  const finalPrice = getItemPrice(item.product);
  const quantity = Number(item.quantity) || 0;

  return finalPrice * quantity;
};

// =====================================================
// PDF STYLES - 80MM THERMAL
// =====================================================

const pdfStyles = StyleSheet.create({
  page: {
    width: 226.77,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 8,
    fontFamily: "Helvetica",
  },

  // ---------------- HEADER ----------------

  header: {
    alignItems: "center",
    marginBottom: 8,
  },

  companyName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },

  invoiceTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },

  headerText: {
    fontSize: 7,
    color: "#555",
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop: 7,
    marginBottom: 7,
  },

  // ---------------- BILL INFO ----------------

  billInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  billInfoLeft: {
    width: "50%",
  },

  billInfoRight: {
    width: "50%",
    alignItems: "flex-end",
  },

  label: {
    fontSize: 6.5,
    color: "#555",
    marginBottom: 2,
  },

  value: {
    fontSize: 7.5,
  },

  boldValue: {
    fontSize: 7.5,
    fontWeight: "bold",
  },

  // ---------------- CUSTOMER ----------------

  customerSection: {
    marginBottom: 7,
  },

  customerName: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
  },

  customerInfo: {
    fontSize: 7,
    marginBottom: 1,
  },

  // ---------------- TABLE ----------------

  table: {
    width: "100%",
  },

  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#000",
    borderBottomColor: "#000",
    paddingTop: 4,
    paddingBottom: 4,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingTop: 4,
    paddingBottom: 4,
  },

  colNo: {
    width: "7%",
    fontSize: 6.5,
  },

  colProduct: {
    width: "39%",
    fontSize: 6.5,
  },

  colPrice: {
    width: "17%",
    fontSize: 6.5,
    textAlign: "right",
  },

  colQty: {
    width: "10%",
    fontSize: 6.5,
    textAlign: "center",
  },

  colDiscount: {
    width: "11%",
    fontSize: 6.5,
    textAlign: "right",
  },

  colTotal: {
    width: "16%",
    fontSize: 6.5,
    textAlign: "right",
  },

  productName: {
    fontSize: 6.5,
    fontWeight: "bold",
  },

  productCode: {
    fontSize: 5.5,
    color: "#666",
    marginTop: 1,
  },

  // ---------------- TOTAL ----------------

  totalSection: {
    marginTop: 8,
    alignItems: "flex-end",
  },

  totalRow: {
    width: "65%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 5,
  },

  totalLabel: {
    fontSize: 9,
    fontWeight: "bold",
  },

  totalAmount: {
    fontSize: 9,
    fontWeight: "bold",
  },

  // ---------------- FOOTER ----------------

  footer: {
    borderTopWidth: 0.5,
    borderTopColor: "#999",
    marginTop: 12,
    paddingTop: 7,
    alignItems: "center",
  },

  footerText: {
    fontSize: 6.5,
    color: "#555",
    marginBottom: 2,
  },

  thankYou: {
    fontSize: 7.5,
    fontWeight: "bold",
    marginBottom: 3,
  },
});

// =====================================================
// PDF COMPONENT
// =====================================================

const BillPDF = ({ bill }) => {
  return (
    <Document title={`Bill-${bill._id}`} author="BillEase">
      <Page size={[226.77, 600]} style={pdfStyles.page}>
        {/* HEADER */}

        <View style={pdfStyles.header}>
          <Text style={pdfStyles.companyName}>BillEase</Text>

          <Text style={pdfStyles.invoiceTitle}>TAX INVOICE</Text>

          <Text style={pdfStyles.headerText}>Computerized Bill</Text>
        </View>

        <View style={pdfStyles.separator} />

        {/* BILL INFORMATION */}

        <View style={pdfStyles.billInfo}>
          <View style={pdfStyles.billInfoLeft}>
            <Text style={pdfStyles.label}>BILL ID</Text>

            <Text style={pdfStyles.boldValue}>
              {String(bill._id).slice(-8)}
            </Text>
          </View>

          <View style={pdfStyles.billInfoRight}>
            <Text style={pdfStyles.label}>DATE</Text>

            <Text style={pdfStyles.value}>{formatDate(bill.createdAt)}</Text>

            <Text style={pdfStyles.value}>{formatTime(bill.createdAt)}</Text>
          </View>
        </View>

        {/* CUSTOMER */}

        <View style={pdfStyles.customerSection}>
          <Text style={pdfStyles.label}>BILL TO</Text>

          {bill.customer ? (
            <>
              <Text style={pdfStyles.customerName}>{bill.customer.name}</Text>

              {bill.customer.phone && (
                <Text style={pdfStyles.customerInfo}>
                  {bill.customer.phone}
                </Text>
              )}

              {bill.customer.email && (
                <Text style={pdfStyles.customerInfo}>
                  {bill.customer.email}
                </Text>
              )}
            </>
          ) : (
            <Text style={pdfStyles.customerName}>Walk-in Customer</Text>
          )}
        </View>

        {/* PRODUCTS */}

        <View style={pdfStyles.table}>
          {/* TABLE HEADER */}

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.colNo}>#</Text>

            <Text style={pdfStyles.colProduct}>PRODUCT</Text>

            <Text style={pdfStyles.colPrice}>PRICE</Text>

            <Text style={pdfStyles.colQty}>QTY</Text>

            <Text style={pdfStyles.colDiscount}>DISC.</Text>

            <Text style={pdfStyles.colTotal}>TOTAL</Text>
          </View>

          {/* PRODUCTS */}

          {bill.description?.map((item, index) => {
            const product = item.product;

            const price = Number(product?.price) || 0;

            const discount = Number(product?.discount) || 0;

            const total = getItemTotal(item);

            return (
              <View style={pdfStyles.tableRow} key={index}>
                <Text style={pdfStyles.colNo}>{index + 1}</Text>

                <View style={pdfStyles.colProduct}>
                  <Text style={pdfStyles.productName}>
                    {product?.name || "Product"}
                  </Text>

                  {product?.productcode && (
                    <Text style={pdfStyles.productCode}>
                      {product.productcode}
                    </Text>
                  )}
                </View>

                <Text style={pdfStyles.colPrice}>₹{price.toFixed(2)}</Text>

                <Text style={pdfStyles.colQty}>{item.quantity}</Text>

                <Text style={pdfStyles.colDiscount}>{discount}%</Text>

                <Text style={pdfStyles.colTotal}>₹{total.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* GRAND TOTAL */}

        <View style={pdfStyles.totalSection}>
          <View style={pdfStyles.totalRow}>
            <Text style={pdfStyles.totalLabel}>TOTAL</Text>

            <Text style={pdfStyles.totalAmount}>
              ₹{Number(bill.amount || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* FOOTER */}

        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.thankYou}>Thank you for your business!</Text>

          <Text style={pdfStyles.footerText}>Generated by BillEase</Text>
        </View>
      </Page>
    </Document>
  );
};

// =====================================================
// BILL VIEW PAGE
// =====================================================

const BillView = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const action = searchParams.get("action");

  const [bill, setBill] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =================================================
  // GET BILL
  // =================================================

  useEffect(() => {
    const getBill = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/getBillById/${id}`);

        setBill(response.data);
      } catch (error) {
        console.error("Error fetching bill:", error);

        setError(error.response?.data?.message || "Unable to load bill");
      } finally {
        setLoading(false);
      }
    };

    getBill();
  }, [id]);

  useEffect(() => {
    if (!bill) return;

    if (action === "print") {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }

    if (action === "download") {
      setTimeout(() => {
        handleDownload();
      }, 500);
    }
  }, [bill, action]);

  // =================================================
  // PRINT THERMAL RECEIPT
  // =================================================

  const handlePrint = () => {
    if (!bill) return;

    const productRows = bill.description
      ?.map((item, index) => {
        const product = item.product;

        const price = Number(product?.price) || 0;

        const discount = Number(product?.discount) || 0;

        const total = getItemTotal(item);

        return `
                        <tr>

                            <td class="center">
                                ${index + 1}
                            </td>

                            <td>
                                <strong>
                                    ${product?.name || "Product"}
                                </strong>

                                ${
                                  product?.productcode
                                    ? `
                                            <div class="code">
                                                ${product.productcode}
                                            </div>
                                        `
                                    : ""
                                }
                            </td>

                            <td class="right">
                                ₹${price.toFixed(2)}
                            </td>

                            <td class="center">
                                ${item.quantity}
                            </td>

                            <td class="right">
                                ${discount}%
                            </td>

                            <td class="right">
                                ₹${total.toFixed(2)}
                            </td>

                        </tr>
                    `;
      })
      .join("");

    const customerHTML = bill.customer
      ? `
                    <strong>
                        ${bill.customer.name}
                    </strong>

                    ${
                      bill.customer.phone
                        ? `
                                <div>
                                    ${bill.customer.phone}
                                </div>
                            `
                        : ""
                    }

                    ${
                      bill.customer.email
                        ? `
                                <div>
                                    ${bill.customer.email}
                                </div>
                            `
                        : ""
                    }
                `
      : `
                    <strong>
                        Walk-in Customer
                    </strong>
                `;

    const printWindow = window.open("", "_blank", "width=400,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the receipt.");

      return;
    }

    printWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    Bill-${bill._id}
                </title>


                <style>

                    * {
                        box-sizing: border-box;
                    }


                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }


                    html,
                    body {

                        margin: 0;
                        padding: 0;

                        width: 80mm;

                        background: white;

                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;

                        color: #000;

                    }


                    body {

                        padding: 5mm 3mm;

                    }


                    .receipt {

                        width: 100%;

                    }


                    .header {

                        text-align: center;

                        margin-bottom: 8px;

                    }


                    .company {

                        font-size: 20px;

                        font-weight: bold;

                    }


                    .invoice {

                        font-size: 10px;

                        font-weight: bold;

                        margin-top: 2px;

                    }


                    .small {

                        font-size: 9px;

                        color: #555;

                        margin-top: 2px;

                    }


                    .separator {

                        border-top: 1px dashed #000;

                        margin: 7px 0;

                    }


                    .info {

                        display: flex;

                        justify-content:
                            space-between;

                        font-size: 9px;

                        margin-bottom: 7px;

                    }


                    .info-left {

                        text-align: left;

                    }


                    .info-right {

                        text-align: right;

                    }


                    .label {

                        font-size: 8px;

                        color: #555;

                        text-transform: uppercase;

                        margin-bottom: 2px;

                    }


                    .customer {

                        font-size: 9px;

                        line-height: 1.4;

                        margin-bottom: 8px;

                    }


                    table {

                        width: 100%;

                        border-collapse:
                            collapse;

                        table-layout: fixed;

                    }


                    th {

                        font-size: 7px;

                        padding: 4px 1px;

                        border-top:
                            1px solid #000;

                        border-bottom:
                            1px solid #000;

                    }


                    td {

                        font-size: 7px;

                        padding: 4px 1px;

                        border-bottom:
                            1px dotted #aaa;

                        vertical-align:
                            top;

                        word-wrap:
                            break-word;

                    }


                    th:nth-child(1),
                    td:nth-child(1) {

                        width: 7%;

                    }


                    th:nth-child(2),
                    td:nth-child(2) {

                        width: 38%;

                    }


                    th:nth-child(3),
                    td:nth-child(3) {

                        width: 17%;

                    }


                    th:nth-child(4),
                    td:nth-child(4) {

                        width: 10%;

                    }


                    th:nth-child(5),
                    td:nth-child(5) {

                        width: 12%;

                    }


                    th:nth-child(6),
                    td:nth-child(6) {

                        width: 16%;

                    }


                    .right {

                        text-align: right;

                    }


                    .center {

                        text-align: center;

                    }


                    .code {

                        font-size: 6px;

                        color: #666;

                        margin-top: 2px;

                    }


                    .total {

                        display: flex;

                        justify-content:
                            space-between;

                        border-top:
                            1px solid #000;

                        margin-top: 10px;

                        padding-top: 6px;

                        font-size: 12px;

                        font-weight: bold;

                    }


                    .footer {

                        text-align: center;

                        border-top:
                            1px dashed #000;

                        margin-top: 12px;

                        padding-top: 8px;

                        font-size: 8px;

                        color: #555;

                    }


                    .thank-you {

                        font-size: 9px;

                        font-weight: bold;

                        color: #000;

                        margin-bottom: 3px;

                    }


                    @media print {

                        body {

                            width: 80mm;

                            padding: 5mm 3mm;

                        }

                    }

                </style>

            </head>


            <body>

                <div class="receipt">


                    <!-- HEADER -->

                    <div class="header">

                        <div class="company">
                            BillEase
                        </div>

                        <div class="invoice">
                            TAX INVOICE
                        </div>

                        <div class="small">
                            Computerized Bill
                        </div>

                    </div>


                    <div class="separator"></div>


                    <!-- BILL INFO -->

                    <div class="info">

                        <div class="info-left">

                            <div class="label">
                                Bill ID
                            </div>

                            <strong>
                                ${String(bill._id).slice(-8)}
                            </strong>

                        </div>


                        <div class="info-right">

                            <div class="label">
                                Date
                            </div>

                            <strong>
                                ${formatDate(bill.createdAt)}
                            </strong>

                            <div>
                                ${formatTime(bill.createdAt)}
                            </div>

                        </div>

                    </div>


                    <!-- CUSTOMER -->

                    <div class="customer">

                        <div class="label">
                            Bill To
                        </div>

                        ${customerHTML}

                    </div>


                    <!-- PRODUCTS -->

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    PRODUCT
                                </th>

                                <th class="right">
                                    PRICE
                                </th>

                                <th>
                                    QTY
                                </th>

                                <th class="right">
                                    DISC.
                                </th>

                                <th class="right">
                                    TOTAL
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${productRows}

                        </tbody>

                    </table>


                    <!-- TOTAL -->

                    <div class="total">

                        <span>
                            GRAND TOTAL
                        </span>

                        <span>
                            ₹${Number(bill.amount || 0).toFixed(2)}
                        </span>

                    </div>


                    <!-- FOOTER -->

                    <div class="footer">

                        <div class="thank-you">
                            Thank you for your business!
                        </div>

                        <div>
                            Generated by BillEase
                        </div>

                    </div>


                </div>


                <script>

                    window.onload = function () {

                        setTimeout(
                            function () {

                                window.print();

                            },
                            300
                        );

                    };


                    window.onafterprint =
                        function () {

                            window.close();

                        };

                </script>


            </body>

            </html>

        `);

    printWindow.document.close();
  };

  // =================================================
  // LOADING
  // =================================================

  if (loading) {
    return (
      <div
        className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-50
            "
      >
        <div
          className="
                    flex
                    items-center
                    gap-2
                    text-gray-600
                "
        >
          <Loader2 size={22} className="animate-spin" />
          Loading bill...
        </div>
      </div>
    );
  }

  // =================================================
  // ERROR
  // =================================================

  if (error || !bill) {
    return (
      <div
        className="
                min-h-screen
                flex
                flex-col
                items-center
                justify-center
                bg-gray-50
                p-6
            "
      >
        <p
          className="
                    text-red-600
                    mb-4
                "
        >
          {error || "Bill not found"}
        </p>

        <button
          onClick={() => navigate("/bills")}
          className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        bg-gray-800
                        text-white
                        rounded-lg
                        hover:bg-gray-900
                    "
        >
          <ArrowLeft size={18} />
          Back to Bills
        </button>
      </div>
    );
  }

  // =================================================
  // PAGE
  // =================================================

  return (
    <div
      className="
            mt-16
            min-h-screen
            bg-gray-100
            p-4
            md:p-6
        "
    >
      {/* ACTION BAR */}

      <div
        className="
                max-w-4xl
                mx-auto
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
                mb-5
            "
      >
        <button
          onClick={() => navigate("/bills")}
          className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        bg-white
                        border
                        border-gray-300
                        rounded-lg
                        hover:bg-gray-50
                    "
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div
          className="
                    flex
                    gap-2
                "
        >
          {/* PRINT */}

          <button
            onClick={handlePrint}
            className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            bg-gray-800
                            text-white
                            rounded-lg
                            hover:bg-gray-900
                        "
          >
            <Printer size={18} />
            Print
          </button>

          {/* DOWNLOAD */}

          <PDFDownloadLink
            document={<BillPDF bill={bill} />}
            fileName={`Bill-${bill._id}.pdf`}
            className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            bg-blue-600
                            text-white
                            rounded-lg
                            hover:bg-blue-700
                        "
          >
            {({ loading }) => (
              <>
                {loading ? (
                  <Loader2
                    size={18}
                    className="
                                            animate-spin
                                        "
                  />
                ) : (
                  <Download size={18} />
                )}

                {loading ? "Generating..." : "Download"}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* BILL PREVIEW */}

      <div
        className="
                max-w-4xl
                mx-auto
            "
      >
        <div
          className="
                    bg-white
                    shadow-lg
                    rounded-xl
                    p-5
                    md:p-8
                "
        >
          {/* PREVIEW HEADER */}

          <div
            className="
                        flex
                        justify-between
                        items-start
                        border-b
                        border-gray-300
                        pb-5
                        mb-5
                    "
          >
            <div>
              <h1
                className="
                                text-2xl
                                md:text-3xl
                                font-bold
                            "
              >
                BILL
              </h1>

              <p
                className="
                                text-xs
                                text-gray-500
                                mt-1
                                break-all
                            "
              >
                Bill ID: {bill._id}
              </p>
            </div>

            <div
              className="
                            text-right
                        "
            >
              <h2
                className="
                                text-xl
                                font-bold
                            "
              >
                BillEase
              </h2>

              <p
                className="
                                text-sm
                                text-gray-500
                            "
              >
                Invoice
              </p>
            </div>
          </div>

          {/* CUSTOMER / DATE */}

          <div
            className="
                        flex
                        justify-between
                        gap-5
                        mb-7
                    "
          >
            <div>
              <p
                className="
                                text-xs
                                uppercase
                                font-semibold
                                text-gray-500
                                mb-2
                            "
              >
                Bill To
              </p>

              {bill.customer ? (
                <>
                  <p
                    className="
                                        font-semibold
                                    "
                  >
                    {bill.customer.name}
                  </p>

                  {bill.customer.email && (
                    <p
                      className="
                                            text-sm
                                            text-gray-600
                                        "
                    >
                      {bill.customer.email}
                    </p>
                  )}

                  {bill.customer.phone && (
                    <p
                      className="
                                            text-sm
                                            text-gray-600
                                        "
                    >
                      {bill.customer.phone}
                    </p>
                  )}
                </>
              ) : (
                <p
                  className="
                                    font-semibold
                                "
                >
                  Walk-in Customer
                </p>
              )}
            </div>

            <div
              className="
                            text-right
                        "
            >
              <p
                className="
                                text-xs
                                uppercase
                                font-semibold
                                text-gray-500
                                mb-2
                            "
              >
                Date
              </p>

              <p
                className="
                                font-semibold
                            "
              >
                {formatDate(bill.createdAt)}
              </p>

              <p
                className="
                                text-sm
                                text-gray-500
                            "
              >
                {formatTime(bill.createdAt)}
              </p>
            </div>
          </div>

          {/* PRODUCT TABLE */}

          <div
            className="
                        overflow-x-auto
                    "
          >
            <table
              className="
                            w-full
                            text-sm
                        "
            >
              <thead>
                <tr
                  className="
                                    border-y-2
                                    border-gray-800
                                "
                >
                  <th
                    className="
                                        text-left
                                        py-3
                                        px-2
                                    "
                  >
                    #
                  </th>

                  <th
                    className="
                                        text-left
                                        py-3
                                        px-2
                                    "
                  >
                    Product
                  </th>

                  <th
                    className="
                                        text-right
                                        py-3
                                        px-2
                                    "
                  >
                    Price
                  </th>

                  <th
                    className="
                                        text-center
                                        py-3
                                        px-2
                                    "
                  >
                    Qty
                  </th>

                  <th
                    className="
                                        text-right
                                        py-3
                                        px-2
                                    "
                  >
                    Discount
                  </th>

                  <th
                    className="
                                        text-right
                                        py-3
                                        px-2
                                    "
                  >
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {bill.description?.map((item, index) => {
                  const product = item.product;

                  const price = Number(product?.price) || 0;

                  const discount = Number(product?.discount) || 0;

                  const total = getItemTotal(item);

                  return (
                    <tr
                      key={index}
                      className="
                                                    border-b
                                                    border-gray-200
                                                "
                    >
                      <td
                        className="
                                                    py-3
                                                    px-2
                                                "
                      >
                        {index + 1}
                      </td>

                      <td
                        className="
                                                    py-3
                                                    px-2
                                                "
                      >
                        <div
                          className="
                                                        font-medium
                                                    "
                        >
                          {product?.name || "Product"}
                        </div>

                        {product?.productcode && (
                          <div
                            className="
                                                            text-xs
                                                            text-gray-500
                                                        "
                          >
                            Code: {product.productcode}
                          </div>
                        )}
                      </td>

                      <td
                        className="
                                                    py-3
                                                    px-2
                                                    text-right
                                                "
                      >
                        ₹{price.toFixed(2)}
                      </td>

                      <td
                        className="
                                                    py-3
                                                    px-2
                                                    text-center
                                                "
                      >
                        {item.quantity}
                      </td>

                      <td
                        className="
                                                    py-3
                                                    px-2
                                                    text-right
                                                "
                      >
                        {discount}%
                      </td>

                      <td
                        className="
                                                    py-3
                                                    px-2
                                                    text-right
                                                    font-medium
                                                "
                      >
                        ₹{total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* GRAND TOTAL */}

          <div
            className="
                        flex
                        justify-end
                        mt-6
                    "
          >
            <div
              className="
                            w-full
                            sm:w-72
                            border-t-2
                            border-gray-800
                            pt-3
                            flex
                            justify-between
                            font-bold
                            text-lg
                        "
            >
              <span>Grand Total</span>

              <span>₹{Number(bill.amount || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* FOOTER */}

          <div
            className="
                        border-t
                        border-gray-200
                        mt-10
                        pt-4
                        text-center
                        text-xs
                        text-gray-500
                    "
          >
            <p
              className="
                            font-medium
                            text-gray-700
                        "
            >
              Thank you for your business.
            </p>

            <p className="mt-1">Generated by BillEase</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillView;
