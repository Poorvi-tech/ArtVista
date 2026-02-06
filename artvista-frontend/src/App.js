import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Leaderboard from "./pages/Leaderboard";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import GamesHub from "./pages/GamesHub";
import { CartProvider } from "./context/CartContext";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Exhibition from "./pages/Exhibition";
import ArtCreator from "./pages/ArtCreator";
import Profile from "./pages/Profile";
import SocialFeed from "./pages/SocialFeed";
import LearningPaths from "./pages/LearningPaths";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - Require Login */}
          <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute><GamesHub /></ProtectedRoute>} />
          <Route path="/exhibition" element={<ProtectedRoute><Exhibition /></ProtectedRoute>} />
          <Route path="/artcreator" element={<ProtectedRoute><ArtCreator /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/social" element={<ProtectedRoute><SocialFeed /></ProtectedRoute>} />
          <Route path="/learning" element={<ProtectedRoute><LearningPaths /></ProtectedRoute>} />
          
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
