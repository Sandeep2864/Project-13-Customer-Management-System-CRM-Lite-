import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import AddCustomerPage from "./pages/AddCustomerPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import CustomerTablePage from "./pages/CustomerTablePage";
import DashboardPage from "./pages/DashboardPage";
import EditCustomerPage from "./pages/EditCustomerPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import SuperAdminPanel from "./pages/SuperAdminPanel";

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-(--crm-bg)">
    <div className="rounded-full border border-(--crm-line) bg-white px-5 py-3 text-sm font-semibold text-slate-500 shadow-sm">
      Loading please wait😊...
    </div>
  </div>
);

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
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
          <Route path="/customers/:customerId/edit" element={<EditCustomerPage />} />
          <Route path="/admins" element={<Navigate to="/superadmins" replace />} />
          <Route path="/superadmin" element={<Navigate to="/superadmins" replace />} />
          <Route
            path="/superadmins"
            element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperAdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
