import React, { useState, useMemo, useEffect } from "react";
import useProducts from "./hooks/useProducts";
import useCustomers from "./hooks/useCustomers";
import usePurchases from "./hooks/usePurchases";

import ProductStats from "./components/ProductStats";
import SearchFilters from "./components/SearchFilters";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import PurchaseForm from "./components/PurchaseForm";
import PurchaseList from "./components/PurchaseList";
import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";

import "./ProductDashboard.css";

const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Food",
  "Books",
  "Home",
  "Sports",
  "Other",
];

const roles = {
  admin: {
    products: ["view", "add", "edit", "delete"],
    customers: ["view", "add", "edit", "delete"],
    purchases: ["view", "add", "edit", "delete"],
  },
  manager: {
    products: ["view", "add", "edit"],
    customers: ["view", "add"],
    purchases: ["view", "add", "edit"],
  },
  viewer: {
    products: ["view"],
    customers: ["view"],
    purchases: ["view"],
  },
};

export default function ProductDashboard() {
  const {
    products,
    loading: productLoading,
    error: productError,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const {
    customers,
    loading: customerLoading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();
  const {
    purchases,
    loading: purchaseLoading,
    createPurchase,
    updatePurchase,
    deletePurchase,
  } = usePurchases();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const [activePage, setActivePage] = useState("products");

  const hasPermission = (module, action) => {
    if (!user || !user.role) return false;
    return roles[user.role]?.[module]?.includes(action);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== "All")
      list = list.filter((p) => p.category === selectedCategory);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(t) ||
          (p.description || "").toLowerCase().includes(t) ||
          (p.brand || "").toLowerCase().includes(t)
      );
    }
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // ================== Handlers ==================
  const onAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };
  const onEditProduct = (p) => {
    setEditingProduct(p);
    setShowProductModal(true);
  };
  const handleSubmitProduct = async (payload) => {
    try {
      if (editingProduct) await updateProduct(editingProduct._id, payload);
      else await createProduct(payload);
      setMessage(editingProduct ? "Product updated" : "Product created");
      setTimeout(() => setMessage(""), 3000);
      setShowProductModal(false);
    } catch {}
  };
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await deleteProduct(id);
    setMessage("Product deleted");
    setTimeout(() => setMessage(""), 3000);
  };

  const onAddCustomer = () => {
    setEditingCustomer(null);
    setShowCustomerModal(true);
  };
  const onEditCustomer = (c) => {
    setEditingCustomer(c);
    setShowCustomerModal(true);
  };
  const handleSubmitCustomer = async (payload) => {
    try {
      if (editingCustomer) await updateCustomer(editingCustomer._id, payload);
      else await createCustomer(payload);
      setMessage(editingCustomer ? "Customer updated" : "Customer added");
      setTimeout(() => setMessage(""), 3000);
      setShowCustomerModal(false);
    } catch {}
  };
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Delete customer?")) return;
    await deleteCustomer(id);
    setMessage("Customer deleted");
    setTimeout(() => setMessage(""), 3000);
  };

  const onAddPurchase = () => {
    setEditingPurchase(null);
    setShowPurchaseModal(true);
  };
  const onEditPurchase = (p) => {
    setEditingPurchase(p);
    setShowPurchaseModal(true);
  };
  const handleSubmitPurchase = async (payload) => {
    const product = products.find((pr) => pr._id === payload.productId);
    if (!product) return alert("Product not found");
    if (payload.quantity > product.stock) return alert("Not enough stock");

    try {
      if (editingPurchase) await updatePurchase(editingPurchase._id, payload);
      else await createPurchase(payload);
      await updateProduct(payload.productId, {
        stock: product.stock - payload.quantity,
      });
      setMessage(editingPurchase ? "Purchase updated" : "Purchase added");
      setTimeout(() => setMessage(""), 3000);
      setShowPurchaseModal(false);
    } catch {}
  };
  const handleDeletePurchase = async (id) => {
    if (!window.confirm("Delete purchase?")) return;
    await deletePurchase(id);
    setMessage("Purchase deleted");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSignUp = (signupData) => {
    setUser({
      ...signupData,
      confirmed: false,
      role: signupData.role || "viewer",
    });
    setShowSignUp(false);
  };
  const handleSignIn = (signinData) => {
    const role =
      signinData.role ||
      (signinData.email.includes("admin") ? "admin" : "viewer");
    setUser({
      name: signinData.email.split("@")[0],
      email: signinData.email,
      confirmed: true,
      role,
    });
    setShowSignIn(false);
  };
  const handleConfirmEmail = () => {
    setUser({ ...user, confirmed: true });
    alert("Email confirmed! Full access granted.");
  };

  useEffect(() => {
    if (!user) {
      setShowProductModal(false);
      setShowCustomerModal(false);
      setShowPurchaseModal(false);
    }
  }, [user]);

  // ================== Render ==================
  return (
    <main className="product-hub">
      <div className="background-blur" aria-hidden></div>
      <div className="container">
        <header className="header">
          <h1>Product Hub</h1>
          <p>Manage your inventory with style</p>
        </header>

        {/* Auth Buttons */}
        <div className="auth-buttons-top">
          {!user && (
            <>
              <button
                className="auth-button signup"
                onClick={() => setShowSignUp(true)}
              >
                Sign Up
              </button>
              <button
                className="auth-button signin"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </button>
            </>
          )}
          {user && !user.confirmed && (
            <button className="auth-button signup" onClick={handleConfirmEmail}>
              Confirm Email
            </button>
          )}
          {user && user.confirmed && (
            <>
              <span className="welcome-text">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                className="auth-button logout"
                onClick={() => setUser(null)}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Alerts */}
        {message && <div className="alert success">{message}</div>}
        {productError && <div className="alert error">{productError}</div>}

        {/* Dashboard Pages Menu */}
        {user && user.confirmed && (
          <div className="dashboard-menu">
            <button
              className={activePage === "products" ? "active" : ""}
              disabled={!hasPermission("products", "view")}
              title={
                !hasPermission("products", "view")
                  ? "No access to Products"
                  : ""
              }
              onClick={() =>
                hasPermission("products", "view") && setActivePage("products")
              }
            >
              Products
            </button>
            <button
              className={activePage === "customers" ? "active" : ""}
              disabled={!hasPermission("customers", "view")}
              title={
                !hasPermission("customers", "view")
                  ? "No access to Customers"
                  : ""
              }
              onClick={() =>
                hasPermission("customers", "view") && setActivePage("customers")
              }
            >
              Customers
            </button>
            <button
              className={activePage === "purchases" ? "active" : ""}
              disabled={!hasPermission("purchases", "view")}
              title={
                !hasPermission("purchases", "view")
                  ? "No access to Purchases"
                  : ""
              }
              onClick={() =>
                hasPermission("purchases", "view") && setActivePage("purchases")
              }
            >
              Purchases
            </button>
          </div>
        )}

        {/* Products Page */}
        {user &&
          user.confirmed &&
          activePage === "products" &&
          hasPermission("products", "view") && (
            <>
              <ProductStats products={products} />
              <SearchFilters
                categories={categories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onAdd={
                  hasPermission("products", "add") ? onAddProduct : undefined
                }
                disableAdd={
                  !hasPermission("products", "add") ||
                  productLoading.create ||
                  productLoading.update
                }
                user={user}
              />
              <ProductList
                products={filteredProducts}
                onEdit={
                  hasPermission("products", "edit") ? onEditProduct : undefined
                }
                onDelete={
                  hasPermission("products", "delete")
                    ? handleDeleteProduct
                    : undefined
                }
                loadingOps={productLoading}
                userRole={user?.role}
              />
              {showProductModal && (
                <div className="modal">
                  <div className="modal-content">
                    <ProductForm
                      initial={editingProduct}
                      onCancel={() => setShowProductModal(false)}
                      onSubmit={handleSubmitProduct}
                      categories={categories}
                      submitting={
                        productLoading.create || productLoading.update
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}

        {/* Customers Page */}
        {user &&
          user.confirmed &&
          activePage === "customers" &&
          hasPermission("customers", "view") && (
            <section>
              {/* 👇 Hide Add Customer button for viewers */}
              {(user.role === "admin" || user.role === "manager") && (
                <button onClick={onAddCustomer}>Add Customer</button>
              )}

              <CustomerList
                customers={customers}
                onEdit={
                  hasPermission("customers", "edit")
                    ? onEditCustomer
                    : undefined
                }
                onDelete={
                  hasPermission("customers", "delete")
                    ? handleDeleteCustomer
                    : undefined
                }
              />

              {showCustomerModal && (
                <div className="modal">
                  <div className="modal-content">
                    <CustomerForm
                      initial={editingCustomer}
                      onCancel={() => setShowCustomerModal(false)}
                      onSubmit={handleSubmitCustomer}
                    />
                  </div>
                </div>
              )}
            </section>
          )}

        {/* Purchases Page */}
        {user &&
          user.confirmed &&
          activePage === "purchases" &&
          hasPermission("purchases", "view") && (
            <section>
              {/* 👇 Hide Add Purchase button for viewers */}
              {(user.role === "admin" || user.role === "manager") && (
                <button onClick={onAddPurchase}>Add Purchase</button>
              )}

              <PurchaseList
                purchases={purchases}
                products={products}
                customers={customers}
                onEdit={
                  hasPermission("purchases", "edit")
                    ? onEditPurchase
                    : undefined
                }
                onDelete={
                  hasPermission("purchases", "delete")
                    ? handleDeletePurchase
                    : undefined
                }
              />

              {showPurchaseModal && (
                <div className="modal">
                  <div className="modal-content">
                    <PurchaseForm
                      initial={editingPurchase}
                      onCancel={() => setShowPurchaseModal(false)}
                      onSubmit={handleSubmitPurchase}
                      products={products}
                      customers={customers}
                    />
                  </div>
                </div>
              )}
            </section>
          )}

        {/* SignUp / SignIn Modals */}
        {showSignUp && (
          <div className="modal">
            <div className="modal-content">
              <SignUpForm
                onCancel={() => setShowSignUp(false)}
                onSubmit={handleSignUp}
                switchToSignIn={() => {
                  setShowSignUp(false);
                  setShowSignIn(true);
                }}
              />
            </div>
          </div>
        )}
        {showSignIn && (
          <div className="modal">
            <div className="modal-content">
              <SignInForm
                onCancel={() => setShowSignIn(false)}
                onSubmit={handleSignIn}
                switchToSignUp={() => {
                  setShowSignIn(false);
                  setShowSignUp(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
