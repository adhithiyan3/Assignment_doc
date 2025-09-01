import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Home from "./pages/Home";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import Versions from "./pages/Versions";
import ActivityFeed from "./pages/ActivityFeed";
import EditDocument from "./pages/EditDocument";
import Search from "./pages/Search";
import CreateDocument from "./pages/CreateDocument";


function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Navbar />
     <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/upload" element={<Upload />} />
  <Route path="/documents" element={<Documents />} />
  <Route path="/documents/:id" element={<DocumentDetail />} />
  <Route path="/documents/:id/versions" element={<Versions />} />
  <Route path="/documents/:id/edit" element={<EditDocument />} />
  <Route path="/activity" element={<ActivityFeed />} />
  <Route path="/search" element={<Search />} />
  <Route path="/documents/create" element={<CreateDocument />} />
</Routes>

    </div>
  );
}

export default App;
