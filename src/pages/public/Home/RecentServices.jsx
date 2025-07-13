import React, { useRef, useState, useEffect } from "react";
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getRecentProfessionals } from "../../../Services/serviceService";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { homeContent } from "../../../config/content";
import { useTranslation } from 'react-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function RecentServices() {
    const { t } = useTranslation();
    const swiperRef = useRef(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Add navigate hook
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    // Add function to check if user is authenticated
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    // Add function to handle service click
    const handleServiceClick = (e, serviceId) => {
        e.preventDefault();
        
        if (isAuthenticated()) {
            // If authenticated, navigate to service details
            navigate(`/service/${serviceId}`);
            // Scroll to top before navigation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // If not authenticated, show the modal
            setSelectedServiceId(serviceId);
            setShowAuthModal(true);
        }
    };
    
    // Handle login button click
    const handleLogin = () => {
        setShowAuthModal(false);
        navigate('/login', { state: { from: `/service/${selectedServiceId}` } });
    };

    // Handle cancel button click
    const handleCancel = () => {
        setShowAuthModal(false);
    };

    // Authentication Modal Component
    const AuthModal = () => {
        if (!showAuthModal) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                    <button 
                        onClick={handleCancel}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        {t("service.authModal.title", "Authentification requise")}
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                        {t("service.authModal.message", "Pour consulter les détails de ce service, veuillez vous connecter ou continuer la navigation sur la page actuelle.")}
                    </p>
                    
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {t("service.authModal.cancelButton", "Annuler")}
                        </button>
                        <button
                            onClick={handleLogin}
                            className="px-4 py-2 bg-[#E5181D] text-white rounded hover:bg-red-700 transition-colors"
                        >
                            {t("service.authModal.loginButton", "Se connecter")}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await getRecentProfessionals(6);
                console.log("Services data:", data); // Debug log to see the actual data structure
                // Sort by creation date (newest first)
                const sortedServices = [...data].sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                ).slice(0, 10); // Get the 10 most recent services
                setServices(sortedServices);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching recent services:", err);
                setError("Failed to load recent services");
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const RecentService = ({ item }) => {
        // Debug log to see individual item structure
        console.log("Service item:", item);
        
        // Safely access nested properties based on the actual data structure
        const imageUrl = item.primaryImageId
            ? `http://localhost:8085/api/v1/images/${item.primaryImageId}/data`
            : '/assets/default-image.png';
            
        const professionalName = item.professionalName || t('common.unknown');
        
        // Check if professionalProfileImage is a base64 string or a URL
        const profileImageSrc = item.professionalProfileImage 
            ? (item.professionalProfileImage.startsWith('/9j/') 
                ? `data:image/jpeg;base64,${item.professionalProfileImage}` 
                : item.professionalProfileImage)
            : "/Mask group.png";
                
        const location = item.city || t('common.locationNotSpecified');
        
        return (
            <div className="relative group w-full flex justify-center items-center rounded-xl xxs:w-[100%]">
                <div className="relative border-b-1 border-gray-200 rounded-[2rem] w-80 my-5 transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.1)] overflow-hidden h-[450px] flex flex-col">
                    
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[2rem] z-10">
                        <a 
                            href="#"
                            onClick={(e) => handleServiceClick(e, item.id)}
                        >
                            <button className="bg-red text-white py-2 px-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-semibold">
                                {t('home.recentServices.viewDetailsButton')}
                            </button>
                        </a>
                    </div>
                    
                    <div className="rounded-t-[2rem] h-64 overflow-hidden">
                        <img 
                            src={imageUrl} 
                            className="w-full h-full object-cover"
                            alt={item.name || t('common.service')}
                            onError={(e) => {
                                if (!e.target.src.includes('default-image.png')) {
                                    e.target.src = '/assets/default-image.png';
                                }
                                e.target.onerror = null;
                            }}
                        />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        <div className="flex flex-direction px-5 py-2 space-x-2">
                            <span className="text-2xl text-red-600 font-bold font-calibri truncate">{item.name || t('common.service')}</span>
                            {item.checked && (
                                <img src="/Verification.svg" className="h-4 mx-10 my-3 flex-shrink-0" alt={t('common.verified')} />
                            )}
                        </div>
                        
                        <div className="px-5 text-gray-400 text-xs font-calibri h-12 line-clamp-2">{item.description || t('common.noDescriptionAvailable')}</div>
                        
                        <div className="text-gray-400 text-xs px-5 py-1">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : t('common.dateNotAvailable')}
                        </div>
                        
                        <div className=" px-5 py-2">
                            <div className="flex items-center mb-2">
                                <div className="h-5 w-5 flex-shrink-0 rounded-full overflow-hidden">
                                    <img 
                                        src={profileImageSrc} 
                                        className="h-full w-full object-cover"
                                        alt={t('common.professional')}
                                        onError={(e) => {
                                            e.target.src = "/Mask group.png";
                                            e.target.onerror = null;
                                        }}
                                    />
                                </div>
                                <span className="px-2 text-0.8xl truncate">{professionalName}</span>
                            </div>
                            
                            <div className="flex items-center text-xs">
                                <img src="/Vector.png" className="h-3.5 flex-shrink-0" alt={t('common.location')} />
                                <span className="px-2 truncate">{location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    const updateOpacity = (swiper) => {
        const activeIndex = swiper.activeIndex;
        const visibleSlides = swiper.params.slidesPerView;

        swiper.slides.forEach((slide, index) => {
            slide.style.opacity = (index >= activeIndex && index < activeIndex + visibleSlides) ? '1' : '0.3';
        });
    };

    if (loading) {
        return (
            <div className="my-5 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-5 flex justify-center items-center h-64">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <>
            <div className="my-5">
                <div className="flex flex-col xxs:px-6 xs:px-10 sm:px-14 md:px-20 md:w-[70%]">
                    <span className="xxs:text-[1.6rem] md:px-10 sm:text-3xl font-semibold lg:text-3xl underline underline-offset-8" style={{ textDecorationColor: '#DC2626' }}>
                        {t('home.recentServices.title')}
                    </span>
                </div>
                
                {services.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">{t('home.recentServices.emptyMessage')}</p>
                    </div>
                ) : (
                    <Swiper
                        onInit={(swiper) => { swiperRef.current = swiper; updateOpacity(swiper); }}
                        onSlideChange={(swiper) => updateOpacity(swiper)}
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={30}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            280: { slidesPerView: 1, spaceBetween: 10 },
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            970: { slidesPerView: 3, spaceBetween: 10 },
                            1350: { slidesPerView: 4, spaceBetween: 10 },
                        }}
                        className="xxs:mx:2 xxs:px-10 xl:mx-10 xl:px-16 my-5"
                    >
                        {services.map((service, index) => (
                            <SwiperSlide key={service.id || index}>
                                <RecentService item={service} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
            <AuthModal />
        </>
    );
}

export default RecentServices;
