// src/App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ChoiceDetails from './pages/ChoiceDetails';
import Guide from './pages/Guide';
import More from './pages/More';
import Authentication from './pages/authentication';
import ChangePassword from './pages/changePassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Route: Authentication */}
        <Route path="/authentication" element={<Authentication />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore/:choiceId"
          element={
            <ProtectedRoute>
              <ChoiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore/:choiceId/:subChoiceId"
          element={
            <ProtectedRoute>
              <ChoiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide"
          element={
            <ProtectedRoute>
              <Guide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/more"
          element={
            <ProtectedRoute>
              <More />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
