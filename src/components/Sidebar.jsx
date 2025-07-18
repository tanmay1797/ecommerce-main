import React from "react";

const Sidebar = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="col-md-2 mb-4">
      <div
        className="card sticky-top"
        style={{
          top: "70px",
          height: "calc(100vh - 70px)",
          overflowY: "auto",
        }}
      >
        <div className="card-header fw-bold">Filter by Category</div>
        <ul className="list-group list-group-flush">
          {categories.map((cat) => (
            <li
              key={cat.name}
              className={`list-group-item ${
                selectedCategory === cat.name ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
