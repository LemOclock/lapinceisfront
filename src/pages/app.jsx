import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Log />} />
        <Route path="/about" element={<About />} />
        <Route path="/config" element={<AccountConfig />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Gestion />} />
        <Route path="/profile" element={<Profil />} />
        <Route path="/legal" element={<TermsConditions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
