import Header from "./components/Header";
import Landing from "./pages/landing/Landing";
import About from "./pages/about/About";
import SignIn from "./pages/signIn/SignIn";
import PlanRoute from "./pages/planroute/PlanRoute";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/planroute" element={<PlanRoute />} />
      </Routes>
    </>
  );
}

export default App;
