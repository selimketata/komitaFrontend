import React, { useContext } from "react"
import { AuthContext } from "./../../../Context/AuthContext"; // Assurez-vous d'importer votre contexte Auth
import { Link } from "react-router-dom";

function OverviewPro() {
  const { user } = useContext(AuthContext); // Accédez au contexte pour récupérer l'utilisateur


  // Si l'utilisateur n'a pas le rôle ADMIN, afficher "Access Denied"
  if (user?.role !== "PROFESSIONAL") {
    return (
      <div className="flex justify-center items-center w-full bg-gray-100 absolute top-1/4 left-1/2 transform -translate-x-1/2">
        <div className="bg-red-600 text-black p-8 rounded-lg shadow-lg text-center w-1/2 sm:w-1/3">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg">You do not have the required permissions to view this page.</p>
          <Link to="/login"><button
            type="submit"
            className="w-full mt-4 px-4 py-2 text-white bg-red rounded-lg hover:bg-red-600 focus:outline-none"
          > Login
          </button></Link>
        </div>
      </div>
    );
  }

  return (
    <div>Overview Pro</div>
  )
}

export default OverviewPro