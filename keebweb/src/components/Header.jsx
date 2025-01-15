import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [isNavActive, setIsNavActive] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set login status based on user presence
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth]);

  // Function to toggle the navigation menu
  const handleToggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
      navigate('/authentication'); // Redirect to the authentication page
    } catch (error) {
      alert(`Failed to log out: ${error.message}`);
    }
  };

  // If user is not logged in, return null to hide the header
  if (!isLoggedIn) {
    return null;
  }

  return (
    <header>
      <h1>Mechanical Keyboard Hub</h1>
      <button
        id="nav-toggle"
        aria-label="Toggle Navigation"
        onClick={handleToggleNav}
      >
        &#9776;
      </button>
      <nav
        aria-label="Main Navigation"
        className={isNavActive ? 'active' : ''}
      >
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/explore">Explore</Link></li>
          <li><Link to="/guide">Guide</Link></li>
          <li><Link to="/more">More</Link></li>
          <li><Link to="/change-password">Change Password</Link></li>
          <li>
            <button id="logout-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
