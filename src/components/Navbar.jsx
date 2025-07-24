// import React from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useCart } from "../context/CartContext"; // ✅ Custom cart context

// export default function Navbar({
//   loggedInUser,
//   setLoggedInUser,
//   setSearchTerm,
// }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { cartCount, clearCart } = useCart(); // ✅ Get cart count from context

//   const handleLogout = () => {
//     clearCart();
//     localStorage.removeItem("token");
//     setLoggedInUser(null);
//     navigate("/login");
//     toast.success("Logged out. See you again soon!");
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
//       <div className="container-fluid">
//         <button
//           className="navbar-brand btn btn-link mx-4 text-decoration-none text-white"
//           onClick={() => {
//             setTimeout(() => {
//               navigate("/");
//             }, 500);
//           }}
//         >
//           MyShop
//         </button>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon" />
//         </button>

//         <div className="collapse navbar-collapse mx-4" id="navbarNav">
//           {location.pathname === "/" && (
//             <form className="d-flex mx-3 col-md-6" role="search">
//               <input
//                 className="form-control me-2"
//                 type="search"
//                 placeholder="Search products"
//                 aria-label="Search"
//                 onChange={handleSearchChange}
//               />
//             </form>
//           )}

//           <ul className="navbar-nav ms-auto align-items-center">
//             {loggedInUser ? (
//               <li className="nav-item dropdown">
//                 <button
//                   className="nav-link dropdown-toggle text-primary btn btn-link"
//                   id="userDropdown"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                   type="button"
//                 >
//                   Welcome, <strong className="fs-5">{loggedInUser.name}</strong>
//                 </button>
//                 <ul
//                   className="dropdown-menu dropdown-menu-end"
//                   aria-labelledby="userDropdown"
//                 >
//                   <li>
//                     <button
//                       className="dropdown-item"
//                       onClick={() => navigate("/profile")}
//                     >
//                       My Profile
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item"
//                       onClick={() => navigate("/my-orders")}
//                     >
//                       My Orders
//                     </button>
//                   </li>
//                   <li>
//                     <button className="dropdown-item" onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </li>
//                 </ul>
//               </li>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login">
//                     Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/register">
//                     Register
//                   </Link>
//                 </li>
//               </>
//             )}

//             <li className="nav-item position-relative">
//               <button
//                 className="nav-link btn btn-link text-decoration-none"
//                 onClick={() => {
//                   if (!loggedInUser) {
//                     toast.error("You're not logged in!");
//                   } else {
//                     navigate("/cart");
//                   }
//                 }}
//               >
//                 <i className="fa fa-shopping-cart fs-3" aria-hidden="true"></i>
//                 {loggedInUser && cartCount > 0 && (
//                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger my-2">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

export default function Navbar({
  loggedInUser,
  setLoggedInUser,
  setSearchTerm,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, clearCart } = useCart();

  const handleLogout = () => {
    clearCart();
    localStorage.removeItem("token");
    setLoggedInUser(null);
    navigate("/login");
    toast.success("Logged out. See you again soon!");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
        <div className="container-fluid">
          {/* Brand */}
          <button
            className="navbar-brand btn btn-link mx-4 text-decoration-none text-white"
            onClick={() => {
              setTimeout(() => {
                navigate("/");
              }, 500);
            }}
          >
            MyShop
          </button>

          <div>
            <button
              className="btn btn-link text-white d-lg-none position-relative me-2"
              onClick={() => {
                if (!loggedInUser) {
                  toast.error("You're not logged in!");
                } else {
                  navigate("/cart");
                }
              }}
            >
              <i className="fa fa-shopping-cart fs-5"></i>
              {loggedInUser && cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger toggler - triggers offcanvas */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          {/* Desktop nav */}
          <div className="collapse navbar-collapse mx-4 d-none d-lg-flex">
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

            <ul className="navbar-nav ms-auto align-items-center">
              {loggedInUser ? (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle text-primary btn btn-link"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    Welcome,{" "}
                    <strong className="fs-5">{loggedInUser.name}</strong>
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
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate("/my-orders")}
                      >
                        My Orders
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item position-relative">
                <button
                  className="nav-link btn btn-link text-decoration-none"
                  onClick={() => {
                    if (!loggedInUser) {
                      toast.error("You're not logged in!");
                    } else {
                      navigate("/cart");
                    }
                  }}
                >
                  <i
                    className="fa fa-shopping-cart fs-3"
                    aria-hidden="true"
                  ></i>
                  {loggedInUser && cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger my-2">
                      {cartCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Offcanvas Menu */}
      <div
        className="offcanvas offcanvas-start w-75 text-bg-dark"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileMenuLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {/* {location.pathname === "/" && (
            <form className="d-flex mb-3" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search products"
                aria-label="Search"
                onChange={handleSearchChange}
              />
            </form>
          )} */}

          <ul className="navbar-nav">
            {loggedInUser ? (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-white"
                    onClick={() => {
                      navigate("/profile");
                      document
                        .querySelector(".offcanvas")
                        .classList.remove("show");
                    }}
                  >
                    My Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-white"
                    onClick={() => {
                      navigate("/my-orders");
                      document
                        .querySelector(".offcanvas")
                        .classList.remove("show");
                    }}
                  >
                    My Orders
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-white"
                    onClick={() => {
                      navigate("/login");
                      document
                        .querySelector("#mobileMenu")
                        .classList.remove("show");
                      document.body.classList.remove(
                        "offcanvas-backdrop",
                        "show"
                      );
                      document.body.style.overflow = "auto"; // Optional: Re-enable scroll
                    }}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-white"
                    onClick={() => {
                      navigate("/register");
                      document
                        .querySelector("#mobileMenu")
                        .classList.remove("show");
                      document.body.classList.remove(
                        "offcanvas-backdrop",
                        "show"
                      );
                      document.body.style.overflow = "auto"; // Optional: Re-enable scroll
                    }}
                  >
                    Register
                  </button>
                </li>
              </>
            )}

            <li className="nav-item mt-3">
              <button
                className="btn btn-outline-light w-100"
                onClick={() => {
                  if (!loggedInUser) {
                    toast.error("You're not logged in!");
                  } else {
                    navigate("/cart");
                    document
                      .querySelector(".offcanvas")
                      .classList.remove("show");
                  }
                }}
              >
                <i className="fa fa-shopping-cart me-2"></i> View Cart
                {loggedInUser && cartCount > 0 && (
                  <span className="badge bg-danger ms-2">{cartCount}</span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
