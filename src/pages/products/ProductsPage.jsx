import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import "../../App.css";
import Sidebar from "../../components/Sidebar";
import Carousel from "../../components/Carousel";

export default function ProductsPage({
  products,
  setProducts,
  searchTerm,
  loggedInUser,
  setLoggedInUser,
  setShowLoginModal,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/category/get", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategories([{ name: "All", _id: null }, ...res.data.data]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/product/get?limit=${PRODUCTS_PER_PAGE}&page=${currentPage}`
        );

        setProducts(res.data.products);
        setTotalProducts(res.data.totalCount || res.data.total || 0);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, setProducts]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const selectedCategoryObj = categories.find(
      (cat) => cat.name === selectedCategory
    );
    const selectedCategoryId = selectedCategoryObj?._id;

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategoryId ||
      product.category?._id === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <div className="container-fluid py-5 flex-grow-1">
        <Carousel />
        <div className="row">
          {/* Sidebar - Category Filter */}
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Product Grid */}
          <div className="col-md-10">
            <h2 className="mb-4">Featured Products</h2>

            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : filteredProducts.length > 0 ? (
              <div className="row">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                    setShowLoginModal={setShowLoginModal}
                  />
                ))}
              </div>
            ) : (
              <p>No products found.</p>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && totalPages > 1 && (
              <nav className="mt-4 d-flex justify-content-center">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
