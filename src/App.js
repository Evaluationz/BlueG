import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./views/dashboard";
import ReportDownload from "./views/reportDownload";
import './App.css';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reportDownload" element={<ReportDownload />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/dashboard">About</Link>
      </nav>
    </>
  );
}

export default App;
