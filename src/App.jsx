import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServiceDetails from "./pages/public/ServiceDetails/ServiceDetails";
import Service from "./pages/public/Service/Service";
import Profile from "./pages/public/Profile/Profile";
// Change these imports to match your actual file names
import Login1 from "./pages/public/Login/Login1";
import SignUp from "./pages/public/Sign up/SIgnUp1";
import Home from "./pages/public/Home/Home";
import About from "./pages/public/About/About";
import UsersManagement from "./pages/adminDashboard/UsersManagement/UsersManagement";
import CategoryManagement from "./pages/adminDashboard/CategoryManagement/CategoryManagement";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SidebarAdminDashboard from "./components/SidebarAdminDashboard";
import SidebarProDashboard from "./components/SidebarProDashboard";
import ServicesProfessionnalManagement from "./pages/professionnalDashboard/ServicesProfessionnalManagement/ServicesProfessionalManagement";
import AddServiceProfessionnalManagement from "./pages/professionnalDashboard/ServicesProfessionnalManagement/AddService";
import EditServiceProfessionnalManagement from "./pages/professionnalDashboard/ServicesProfessionnalManagement/EditService";
import ProfileProfessionnalManagement from "./pages/professionnalDashboard/ProfileProfessionalManagement/ProfileProfessionnalManagement";
import Overview from "./pages/adminDashboard/Overview/Overview";
import OverviewPro from "./pages/professionnalDashboard/Overview/Overview";
import ServicesAdminManagement from "./pages/adminDashboard/ServicesAdminManagement/ServicesAdminManagment";
import ForgetPassword from "./pages/public/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/public/ForgetPassword/ResetPassword";
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUpPage1 from "./pages/public/Sign up/SIgnUp1";

// Add this new import for protected routes
import { Navigate } from "react-router-dom";


function App() {
  return (
    <GoogleOAuthProvider clientId="1098473380426-m890844i2n6s32adpar2d8c48hqm797p.apps.googleusercontent.com">

      <Routes>
        {/* Public routes with Navbar and Footer */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/service"
          element={
            <PublicLayout>
              <Service />
            </PublicLayout>
          }
        />
        <Route
          path="/Profile"
          element={
            <PublicLayout>
              <Profile />
            </PublicLayout>
          }
        />
        <Route
          path="/service/:id"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <ServiceDetails />
              </PublicLayout>
            </ProtectedRoute>
          }
        />

        {/* Login and Sign Up routes without Navbar and Footer */}
        
        <Route
          path="login"
          element={
            <AuthLayout>
              <Login1 />
            </AuthLayout>
          }
        />
        
        <Route
          path="signup"
          element={
            <AuthLayout>
              <SignUpPage1 />
            </AuthLayout>
          }
        />

<Route
          path="forgot-password"
          element={
            <AuthLayout>
              <ForgetPassword />
            </AuthLayout>
          }
        />

        <Route
          path="reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />

        {/* Admin Dashboard with Sidebar only */}
        <Route
          path="/admin"
          element={
            <DashboardAdminLayout currPage={"Overview"}>
              <Overview />
            </DashboardAdminLayout>
          }
        />
        <Route
          path="/admin/users-management"
          element={
            <DashboardAdminLayout currPage={"Users"}>
              <UsersManagement />
            </DashboardAdminLayout>
          }
        />
        <Route
          path="/admin/categories-management"
          element={
            <DashboardAdminLayout currPage={"Catégories"}>
              <CategoryManagement />
            </DashboardAdminLayout>
          }
        />
        <Route
          path="/admin/services-management"
          element={
            <DashboardAdminLayout currPage="Services">
              <ServicesAdminManagement />
            </DashboardAdminLayout>
          }
        />

        {/* Professional Dashboard with Sidebar only */}
        {/* <Route
          path="/professional"
          element={
            <DashboardProLayout currPage={"Overview"}>
              <OverviewPro />
            </DashboardProLayout>
          }
        /> */}
        <Route
          path="/professional/services-management"
          element={
            <DashboardProLayout currPage={"Services"}>
              <ServicesProfessionnalManagement />
            </DashboardProLayout>
          }
        />
        <Route
          path="/professional/services-management/add-service"
          element={
            <DashboardProLayout currPage={"Services"}>
              <AddServiceProfessionnalManagement />
            </DashboardProLayout>
          }
        />
        <Route
          path="/professional/services-management/edit-service"
          element={
            <DashboardProLayout currPage={"Services"}>
              <EditServiceProfessionnalManagement />
            </DashboardProLayout>
          }
        />
        <Route
          path="/professional/Profile-management"
          element={
            <DashboardProLayout currPage={"Profile"}>
              <ProfileProfessionnalManagement />
            </DashboardProLayout>
          }
        />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>

  );
}

// Public layout with Navbar and Footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />  
      <main>
      { children }
      </main>
      <Footer /> 
    </>
  );
}

// Auth layout without Navbar and Footer (for Login and SignUp)
function AuthLayout({ children }) {
  return <main>{children}</main>;
}

// Dashboard layout for Admin
function DashboardAdminLayout({ children, currPage }) {
  return (
    <div className="dashboard-container w-dvw lg:flex lg:flex-row gap-10">
      <SidebarAdminDashboard currPage={currPage} />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}

// Dashboard layout for Professional
function DashboardProLayout({ children, currPage }) {
  return (
    <div className="dashboard-container w-dvw lg:flex lg:flex-row gap-10">
      <SidebarProDashboard currPage={currPage} />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}

// Create a ProtectedRoute component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default App;
