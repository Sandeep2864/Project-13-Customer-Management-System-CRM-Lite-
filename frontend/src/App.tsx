import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import AddCustomerPage from "./pages/AddCustomerPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import CustomerTablePage from "./pages/CustomerTablePage";
import DashboardPage from "./pages/DashboardPage";
import EditCustomerPage from "./pages/EditCustomerPage";
import LoginPage from "./pages/LoginPage";
import SuperAdminPanel from "./pages/SuperAdminPanel";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--crm-bg)]">
        <div className="rounded-full border border-[var(--crm-line)] bg-white px-5 py-3 text-sm font-semibold text-slate-500 shadow-sm">
          Loading workspace...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomerTablePage />} />
          <Route path="/customers/new" element={<AddCustomerPage />} />
          <Route path="/customers/:customerId" element={<CustomerProfilePage />} />
          <Route
            path="/customers/:customerId/edit"
            element={<EditCustomerPage />}
          />
          <Route
            path="/admins"
            element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperAdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
