import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import About from "../pages/about/About";
import AccountConfig from "../pages/accountconfig/AccountConfig";
import Budget from "../pages/budget/Budget";
import Contact from "../pages/contact/Contact";
import Dashboard from "../pages/dashboard/Dashboard";
import Gestion from "../pages/gestion/gestion";
import Log from "../pages/log/Log";
import Profil from "../pages/profil/Profil";
import TermsConditions from "../pages/termsconditions/TermsConditions";
import Landing from "../pages/landing/landing";
import NotFound from "../pages/404/404";
import TokenExpiration from "../components/tokenexpiration/tokenexpiration";

// Redirige vers la connexion si aucun token n'est présent
function RequireAuth({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="page-wrapper">
      <BrowserRouter>
        <TokenExpiration />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Log />} />
            <Route path="/about" element={<About />} />
            <Route path="/config" element={<RequireAuth><AccountConfig /></RequireAuth>} />
            <Route path="/budget" element={<RequireAuth><Budget /></RequireAuth>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/account" element={<RequireAuth><Gestion /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profil /></RequireAuth>} />
            <Route path="/legal" element={<TermsConditions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
