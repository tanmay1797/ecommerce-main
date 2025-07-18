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
  const [sortOption, setSortOption] = useState("default");

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

  // ✅ Sort filtered products based on selected option
  const sortedProducts = [...filteredProducts];

  if (sortOption === "priceLowHigh") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHighLow") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "nameAsc") {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "nameDesc") {
    sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="mb-0">Featured Products</h2>
              {/* ✅ Sort Dropdown */}
              <select
                className="form-select w-auto"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Sort By</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </select>
            </div>

            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : sortedProducts.length > 0 ? (
              <div className="row">
                {sortedProducts.map((product) => (
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
            {sortedProducts.length > 0 && totalPages > 1 && (
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
