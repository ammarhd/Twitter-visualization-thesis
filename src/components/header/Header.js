import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
function Header() {
  return (
    <div className="flex justify-center mt-5 ">
      <div className="headeer flex justify-start space-x-5 pt-10 pb-2  ">
        <div>
          <Link to="/" className="a">
            <button className="w-36 bg-gray-800 bg-opacity-60 shadow hover:bg-gray-800 text-white font-semibold py-3  px-4 rounded-md">
              Network
            </button>
          </Link>
        </div>

        <div>
          <Link to="/Tree" className="a">
            <button className="w-36 bg-gray-800 bg-opacity-60 shadow hover:bg-gray-800 text-white font-semibold py-3  px-4 rounded-md">
              Time Series
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
