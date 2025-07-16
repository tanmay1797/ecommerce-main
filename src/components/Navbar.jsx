import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Navbar({
  loggedInUser,
  setLoggedInUser,
  setSearchTerm,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
    // navigate("/login");
    window.location.href = "/login";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button
          className="navbar-brand btn btn-link mx-4 text-decoration-none text-white"
          onClick={() => {
            setTimeout(() => {
              navigate("/");
            }, 500); // ✅ 500ms delay
          }}
        >
          MyShop
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse mx-4" id="navbarNav">
          {location.pathname === "/" && (
            <form className="d-flex mx-3 col-md-6" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search products"
                aria-label="Search"
                onChange={handleSearchChange}
              />
            </form>
          )}

          <ul className="navbar-nav ms-auto">
            {loggedInUser ? (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-dark dropdown-toggle text-primary"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    Welcome, {loggedInUser.name}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate("/profile")}
                      >
                        My Profile
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}

            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-decoration-none"
                onClick={() => {
                  if (!loggedInUser) {
                    alert("You're not logged in!");
                  } else {
                    navigate("/cart");
                  }
                }}
              >
                Cart
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
