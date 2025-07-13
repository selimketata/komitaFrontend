import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./../../../Context/AuthContext";
import ReactModal from "react-modal";
import { getServicesByUser } from "../../../Services/servicesProService";
import { deleteService } from "../../../Services/serviceService";
import "reactjs-popup/dist/index.css";
import deleteIcon from "/DeleteIcon.svg";
import deleteIconWhite from "/DeleteIconWhite.svg";
import ModifyIcon from "/ModifyIcon.svg";
import addIcon from "/addIcon.svg";
import Verified from "/Verification.svg";
// Import icons for service states
import { FaCircleCheck, FaCirclePause, FaCircleXmark } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';


const initialNotifs = [
  "L'administrateur a vérifié votre nouveau service \"Dev Web\", et vous encourage de commencer l'aventure !",
  "L'administrateur a vérifié votre nouveau service \"Dev Mobile\", et vous encourage de commencer l'aventure !"
];

const Notification = ({ id, content, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 flex items-center justify-between border-l-4 border-[#142237]">
      <p className="text-[#142237] text-sm lg:text-base font-medium">{content}</p>
      <button
        onClick={() => onDelete(id)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <img src={deleteIcon} className="w-4 h-4" alt="Delete" />
      </button>
    </div>
  );
};

const Button = ({ text, color, icon, handle }) => {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${color} hover:opacity-90 transition-all shadow-md hover:shadow-lg`}
      onClick={handle}
    >
      <span className="hidden lg:block font-medium">{text}</span>
      <img src={icon} className="w-4 h-4" alt="" />
    </button>
  );
};

const Service = ({ currService, id, handleDelete }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Service state component
  const ServiceState = ({ state }) => {
    let icon, color, label;
    
    switch(state) {
      case 'ACTIVE':
        icon = <FaCircleCheck className="w-5 h-5" />;
        color = "text-green-600";
        label = t('professionalDashboard.servicesManagement.stateActive');
        break;
      case 'SUSPENDED':
        icon = <FaCirclePause className="w-5 h-5" />;
        color = "text-amber-500";
        label = t('professionalDashboard.servicesManagement.stateSuspended');
        break;
      case 'INACTIVE':
        icon = <FaCircleXmark className="w-5 h-5" />;
        color = "text-red";
        label = t('professionalDashboard.servicesManagement.stateInactive');
        break;
      default:
        icon = <FaCirclePause className="w-5 h-5" />;
        color = "text-gray-400";
        label = t('professionalDashboard.servicesManagement.stateUnknown');
    }
    
    return (
      <div className={`flex items-center gap-1.5 ${color}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  };

  const DeletePopup = () => {
    return (
      <>
        <Button
          text="Supprimer"
          icon={deleteIconWhite}
          color="bg-[#E5181D]"
          handle={() => setOpen(true)}
        />
        <ReactModal
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          style={{
            content: { 
              position: 'relative', 
              border: 'none', 
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'none', 
              padding: 0,
              width: '80vw',
            }
          }}
          isOpen={open}
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
        >
          <div className="bg-white w-[400px] mx-auto rounded-2xl shadow-lg p-6 transform transition-all">
            <div className="relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute -right-2 -top-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
              >
                <img src={deleteIcon} className="w-4 h-4" alt="Close" />
              </button>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                    <img src={deleteIcon} alt="Delete" className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#142237]">
                    {t('professionalDashboard.servicesManagement.deleteService')}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {t('professionalDashboard.servicesManagement.deleteConfirmation')}<br/>
                    <span className="font-semibold text-[#142237]">"{currService.name}"</span> ?
                  </p>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-32 px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                  >
                    {t('professionalDashboard.servicesManagement.cancel')}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(currService.id);
                      setOpen(false);
                    }}
                    className="w-32 px-6 py-2.5 rounded-lg bg-[#E5181D] text-white hover:bg-[#cc1619] transition-colors font-medium"
                  >
                    {t('professionalDashboard.servicesManagement.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ReactModal>
      </>
    );
  };

  const Tag = ({ Word, Styling }) => (
    <span className={`${Styling} px-3 py-1 rounded-full text-sm font-medium`}>
      {Word}
    </span>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex flex-col lg:flex-row lg:h-80">
        <div className="lg:w-1/3 relative">
          <img
            className="h-64 lg:h-80 w-full object-cover"
            src={currService.images && currService.images.length > 0 
              ? `http://localhost:8085/api/v1/images/${currService.images[0].id}/data`
              : '/assets/default-image.png'}
            alt={currService.name}
            onError={(e) => {
              if (!e.target.src.includes('default-image.png')) {
                e.target.src = '/assets/default-image.png';
              }
              e.target.onerror = null;
            }}
          />
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-[#142237]">
                  {currService.name}
                </h3>
                {currService.checked && (
                  <img src={Verified} alt="Verified" className="w-6 h-6" />
                )}
                {/* Add service state indicator */}
                <ServiceState state={currService.state || 'INACTIVE'} />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Tag
                  Word={currService.category.name}
                  Styling="bg-[#FDEFBE] text-[#142237]"
                />
                <Tag
                  Word={currService.subcategory.name}
                  Styling="bg-[#FDEFBE] text-[#142237]"
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              {new Date(currService.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <p className="text-gray-600 mb-6 line-clamp-3">
            {currService.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {currService.keywordList.map((item) => (
              <span key={item.id} className="text-sm text-gray-500">
                #{item.keywordName}
              </span>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Link to={`/professional/services-management/edit-service?id=${id}`} state={{ currService }}>
              <Button text="Modifier" icon={ModifyIcon} color="bg-[#142237]" />
            </Link>
            <DeletePopup />
          </div>
        </div>
      </div>
    </div>
  );
};

function ServicesProfessionnalManagement() {
  const [notifs, setNotifs] = useState([]);
  const { token, user, login, logout } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const userId = user ? user.id : null;
  // Use translation
  const { t } = useTranslation();



  useEffect(() => {
    const loadServiceByUser = async (userId) => {
      if (userId) {
        const dataServicesOfUser = await fetchServiceByUser(userId);
        setServices(dataServicesOfUser);
      }
    };
    loadServiceByUser(userId);
  }, [userId]); // Add userId as a dependency


  const fetchServiceByUser = async (userId) => {
    const response = await getServicesByUser(userId);
    return response;
  };



  // Handle notification deletion
  const handleDeleteNotif = (id) => {
    const updatedNotifs = notifs.filter((_, index) => index !== id);
    setNotifs(updatedNotifs);
  };

  // Handle service deletion
  const handleDeleteService = async (serv) => {
    try {
      console.log("Deleting service with ID:", serv);
      const response = await deleteService(serv);
      console.log("Delete response:", response);

      // Mettre à jour l'état des services après la suppression
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serv)
      );
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // Early return if the user is not authorized
  if (!user || user.role !== "PROFESSIONAL") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100/90">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-[#142237] mb-4">{t('professionalDashboard.common.accessDenied')}</h1>
          <p className="text-gray-600 mb-6">
            {t('professionalDashboard.common.permissionError')}
          </p>
          <Link to="/login">
            <button className="w-full py-2 bg-[#E5181D] text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              {t('professionalDashboard.common.login')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#142237] mb-2">{t('professionalDashboard.servicesManagement.title')}</h1>
        <p className="text-gray-600">{t('professionalDashboard.servicesManagement.subtitle')}</p>
      </div>

      {notifs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#E5181D] mb-4">Notifications</h2>
          <div className="space-y-3">
            {notifs.map((content, index) => (
              <Notification
                key={index}
                id={index}
                content={content}
                onDelete={handleDeleteNotif}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#E5181D]">{t('professionalDashboard.servicesManagement.services')}</h2>
          <Link to="/professional/services-management/add-service">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#142237] text-[#142237] hover:bg-gray-50 transition-colors font-medium">
              <img src={addIcon} className="w-4 h-4" alt="" />
              <span>{t('professionalDashboard.servicesManagement.addService')}</span>
            </button>
          </Link>
        </div>

        <div className="space-y-6">
        {
   services.length === 0 ? (
    <p className="text-gray text-center w-[78vw] mt-24">
      {t('professionalDashboard.servicesManagement.noServices')}
    </p>
  ) : null
}

          {Array.isArray(services) && services.map((el) => (
            <Service
              key={el.id}
              id={el.id}
              currService={el}
              handleDelete={handleDeleteService}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesProfessionnalManagement;