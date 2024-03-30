import React from "react";
import ResponablesTable from "../components/ResponablesTable";
import { Link } from "react-router-dom";

function ResponsablesPage() {
  return (
    <div>
      <div className="">
        <Link
          to="/responsables/nuevo"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Agregar
        </Link>
      </div>
      <ResponablesTable />
    </div>
  );
}

export default ResponsablesPage;
