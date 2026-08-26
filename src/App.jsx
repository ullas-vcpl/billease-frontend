import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Bills from "./pages/Bills";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
function App() {
    const [login, setLogin] = useState(false);
    return (
        <BrowserRouter>
            <div className="flex">
                {login && <Sidebar />}
                <Routes>
                //send login state to routes if needed
                <Route path="/login" element={<Login login={login} setLogin={setLogin} />} />
                <Route path="/" element={<Dashboard login={login} setLogin={setLogin} />} />
                <Route path="/billing" element={<Billing login={login} setLogin={setLogin} />} />
                <Route path="/products" element={<Products login={login} setLogin={setLogin} />} />
                <Route path="/customers" element={<Customers login={login} setLogin={setLogin} />} />
                <Route path="/bills" element={<Bills login={login} setLogin={setLogin} />} />
                <Route path="/settings" element={<Settings login={login} setLogin={setLogin} />} />

            </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;