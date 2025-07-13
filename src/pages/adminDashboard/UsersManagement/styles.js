export const tableStyles = {
  table: "w-full table-fixed",
  tableHeader: "border-gray border-b bg-[#D9D9D9]",
  headerCell: "px-6 py-4 text-left text-sm font-semibold text-[#142237]",
  tableBody: "divide-y divide-gray-200",
  tableRow: "hover:bg-[#F0F0F0] hover:shadow-md transition-all duration-200",
  tableCell: "px-6 py-4 text-sm text-gray-900",
  emailCell: "px-6 py-4 text-sm font-medium max-w-[200px] truncate cursor-pointer hover:text-[#142237]",
  actionCell: "px-6 py-4",
  actionButton: {
    edit: "text-[#142237] hover:bg-blue-50 rounded-lg transition-colors duration-200",
    delete: "text-[#E5181D] hover:bg-red-50 rounded-lg transition-colors duration-200",
    services: "text-black hover:bg-green-50 rounded-lg transition-colors duration-200",
    upgrade: "text-[#142237] hover:bg-green-50 rounded-lg transition-colors duration-200 px-2"
  }
};

export const cardStyles = {
  container: "p-4 border-b border-gray-200 hover:bg-[#F0F0F0] transition-all duration-200",
  content: "space-y-2",
  header: "flex justify-between items-start",
  userInfo: {
    name: "font-medium text-[#142237]",
    email: "text-sm text-gray-600 max-w-[200px] truncate cursor-pointer hover:text-[#142237]",
    address: "text-sm text-gray-600 truncate max-w-[250px]",
    role: "text-sm font-medium text-[#142237]"
  },
  actions: {
    container: "flex gap-2",
    button: {
      edit: "text-[#142237] hover:bg-blue-50 rounded-lg transition-colors duration-200",
      delete: "text-[#E5181D] hover:bg-red-50 rounded-lg transition-colors duration-200",
      services: "text-black hover:bg-green-50 rounded-lg transition-colors duration-200",
      upgrade: "text-[#142237] hover:bg-green-50 rounded-lg transition-colors duration-200 px-2 text-sm"
    }
  }
};

export const paginationStyles = {
  desktop: {
    container: "hidden md:flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200",
    info: "flex items-center text-sm text-gray-700",
    controls: "flex gap-2",
    button: (active, disabled) => `
      px-4 py-2 border rounded-lg
      ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
        active ? 'bg-[#142237] text-white' : 'bg-white text-[#142237] hover:bg-gray-50'}
      transition-colors duration-200
    `
  },
  mobile: {
    container: "md:hidden flex flex-col items-center gap-4 px-4 py-4 bg-gray-50 border-t border-gray-200",
    info: "text-sm text-gray-700 text-center",
    controls: "flex items-center gap-4",
    button: (disabled) => `
      px-4 py-2 border rounded-lg text-sm
      ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#142237] hover:bg-gray-50'}
      transition-colors duration-200
    `
  }
};

export const tooltipStyles = {
  overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
  container: "bg-white rounded-lg p-6 max-w-md w-full",
  header: {
    container: "flex justify-between items-center mb-4",
    title: "text-lg font-semibold text-[#142237]",
    closeButton: "p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
  },
  content: "text-gray-700 break-all",
  footer: {
    container: "mt-6 flex justify-end",
    button: "px-4 py-2 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200"
  }
}; 