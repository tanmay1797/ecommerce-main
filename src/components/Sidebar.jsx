// import React from "react";

// const Sidebar = ({ categories, selectedCategory, setSelectedCategory }) => {
//   return (
//     <div className="col-md-2 mb-4">
//       <div
//         className="card sticky-top"
//         style={{
//           top: "70px",
//           height: "calc(100vh - 70px)",
//           overflowY: "auto",
//         }}
//       >
//         <div className="card-header fw-bold">Filter by Category</div>
//         <ul className="list-group list-group-flush">
//           {categories.map((cat) => (
//             <li
//               key={cat.name}
//               className={`list-group-item ${
//                 selectedCategory === cat.name ? "active" : ""
//               }`}
//               style={{ cursor: "pointer" }}
//               onClick={() => setSelectedCategory(cat.name)}
//             >
//               {cat.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";

const Sidebar = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <>
      {/* Mobile view: horizontal scrollable top bar */}
      <div className="d-block d-md-none bg-white py-2 px-3 border-bottom sticky-top pb-3" style={{ top: "56px", zIndex: 1020 }}>
        <div className="d-flex gap-2 overflow-auto flex-nowrap">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`btn btn-outline-primary ${
                selectedCategory === cat.name ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop view: vertical sidebar */}
      <div className="col-md-2 mb-4 d-none d-md-block">
        <div
          className="card sticky-top b-2"
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
    </>
  );
};

export default Sidebar;
