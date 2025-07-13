import React from "react";
import { Plus } from "lucide-react";

const AddServiceButton = ({ onClick }) => (
  <button
    className="flex items-center gap-2 px-6 py-3 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200 shadow-md"
    onClick={onClick}
  >
    <Plus className="w-5 h-5" />
    <span className="font-semibold">New Service</span>
  </button>
);

export default AddServiceButton;