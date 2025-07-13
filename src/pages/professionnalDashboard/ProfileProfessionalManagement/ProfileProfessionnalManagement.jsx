import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getCurrentUserProfile, getProfileImage, uploadProfileImage, updateUserProfile } from "../../../Services/profileService";
import { useTranslation } from 'react-i18next';

function ProfileProfessionnalManagement() {
    const { user } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        userAddress: {
            streetNumber: 0,
            streetName: "",
            streetType: "",
            provinceName: "",
            postalCode: "",
            city: "",
            country: "",
        },
        phoneNumber:""
    });

    // Add the parseStreetAddress function inside the component
    const parseStreetAddress = (streetString) => {
        if (!streetString) return { streetNumber: 0, streetName: "", streetType: "" };
        
        // Regex to match the pattern: [streetName] [streetNumber] [streetType]
        const regex = /^([A-Za-z\s]+)\s+(\d+)\s+([A-Za-z\s]+)$/;
        const match = streetString.match(regex);
        
        if (match) {
            return {
                streetName: match[1].trim(),
                streetNumber: parseInt(match[2], 10),
                streetType: match[3].trim()
            };
        }
        return { streetNumber, streetName, streetType };
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (userDetails) {
          
            
            // Parse street address if it exists
            let addressData = userDetails.userAddress || {
                streetNumber: 0,
                streetName: "",
                streetType: "",
                provinceName: "",
                postalCode: "",
                city: "",
                country: ""
            };
            
            // If we have a street field but not the parsed components
            if (userDetails.userAddress && userDetails.userAddress.street) {
                const parsedStreet = parseStreetAddress(userDetails.userAddress.street);
                addressData = {
                    ...addressData,
                    streetNumber: parsedStreet.streetNumber,
                    streetName: parsedStreet.streetName,
                    streetType: parsedStreet.streetType
                };
            }
            
            setFormData({
                firstname: userDetails.firstname || "",
                lastname: userDetails.lastname || "",
                email: userDetails.email || "",
                phoneNumber : userDetails.phoneNumber || "",
                userAddress: addressData
            });
        }
    }, [userDetails]);

    const fetchUserDetails = async () => {
        try {
            // Use getCurrentUserProfile instead of getUserDetails
            const data = await getCurrentUserProfile();
            setUserDetails(data);
            if (data.id) {
                fetchProfileImage(data.id);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("Erreur lors de la récupération des détails de l'utilisateur");
        }
    };

    const fetchProfileImage = async (userId) => {
        try {
            const imageData = await getProfileImage(userId);
            const imageUrl = URL.createObjectURL(imageData);
            setProfileImage(imageUrl);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Handle case when user has no profile image
                console.log("No profile image found for user");
                setProfileImage(null);
            } else {
                console.error("Error fetching profile image:", error);
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error(t('professionalDashboard.profileManagement.errors.selectImage'));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t('professionalDashboard.profileManagement.errors.imageTooLarge'));
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !userDetails?.id) {
            toast.error(t('professionalDashboard.profileManagement.errors.selectImage'));
            return;
        }

        setUploading(true);

        try {
            await uploadProfileImage(userDetails.id, selectedFile);
            toast.success(t('professionalDashboard.profileManagement.success.imageUpdated'));
            fetchProfileImage(userDetails.id);
            setSelectedFile(null);
        } catch (error) {
            let errorMessage = t('professionalDashboard.profileManagement.errors.imageUpdateFailed');
            if (error.response && error.response.data) {
                errorMessage = error.response.data || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section === 'address') {
            setFormData(prev => ({
                ...prev,
                userAddress: {
                    ...prev.userAddress,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create a copy of the form data
            const dataToSubmit = { ...formData };
            
            // If the API expects a single street field, combine the components
            if (dataToSubmit.userAddress) {
                const { streetNumber, streetName, streetType } = dataToSubmit.userAddress;
                if (streetName || streetNumber || streetType) {
                    dataToSubmit.userAddress.street = `${streetName} ${streetNumber} ${streetType}`.trim();
                }
                if (dataToSubmit.userAddress.state) {
                    dataToSubmit.userAddress.provinceName = `${dataToSubmit.userAddress.state}`;
                }
                if (dataToSubmit.userAddress.zipCode) {
                    dataToSubmit.userAddress.postalCode = `${dataToSubmit.userAddress.zipCode}`;
                }
            }
            
            const updatedUser = await updateUserProfile(userDetails.email, dataToSubmit);
            toast.success(t('professionalDashboard.profileManagement.success.profileUpdated'));
            setIsEditing(false);
            
            if (updatedUser) {
                setUserDetails(updatedUser);
            } else {
                fetchUserDetails();
            }
        } catch (error) {
            let errorMessage = t('professionalDashboard.profileManagement.errors.updateFailed');
            if (error.response && error.response.data) {
                errorMessage = error.response.data || errorMessage;
            }
            toast.error(errorMessage);
        }
    };

    if (!user || user.role !== "PROFESSIONAL") {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
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
        <div className="w-[80vw] mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-[#142237] mb-8 border-b-2 border-[#E5181D] pb-2 inline-block">{t('professionalDashboard.profileManagement.title')}</h1>

            <div className="bg-white shadow-lg p-8 border-t-4 ">
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                            <h2 className="text-xl font-semibold text-[#142237]">{t('professionalDashboard.profileManagement.personalInfo')}</h2>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    isEditing 
                                    ? "bg-gray-200 text-[#142237] hover:bg-gray-300" 
                                    : "bg-[#142237] text-white hover:bg-[#1d2f4a]"
                                }`}
                            >
                                {isEditing ? t('professionalDashboard.profileManagement.cancel') : t('professionalDashboard.profileManagement.edit')}
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col md:flex-row gap-24 mb-6 md:col-span-2">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-[#142237] shadow-md mb-3">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                {t('professionalDashboard.profileManagement.noImage')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('profilePhotoInput').click()}
                                            className="text-sm text-[#142237] font-medium hover:underline mb-2"
                                        >
                                            {t('professionalDashboard.profileManagement.changePhoto')}
                                        </button>

                                        <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-[#142237] font-medium mb-3">{t('professionalDashboard.profileManagement.changeProfilePhoto')}</h3>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#142237] file:text-white hover:file:bg-[#1d2f4a] mb-4"
                                            />
                                            <button
                                                onClick={handleUpload}
                                                disabled={!selectedFile || uploading}
                                                className={`w-full px-6 py-3 rounded-lg ${
                                                    !selectedFile || uploading
                                                        ? 'bg-gray cursor-not-allowed'
                                                        : 'bg-[#E5181D] hover:bg-red'
                                                } text-white transition-colors font-medium shadow-md`}
                                            >
                                                {uploading ? t('professionalDashboard.profileManagement.uploading') : t('professionalDashboard.profileManagement.updatePhoto')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-[50px] md:w-[50px] xxs:w-full">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.lastName')}</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="lastname"
                                                value={formData.lastname}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                            />
                                        ) : (
                                            <p className="font-medium text-[#142237]">{formData.lastname || t('professionalDashboard.profileManagement.notSpecified')}</p>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.firstName')}</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="firstname"
                                                value={formData.firstname}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                            />
                                        ) : (
                                            <p className="font-medium text-[#142237]">{formData.firstname || t('professionalDashboard.profileManagement.notSpecified')}</p>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.email')}</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                            />
                                        ) : (
                                            <p className="font-medium text-[#142237]">{formData.email || t('professionalDashboard.profileManagement.notSpecified')}</p>
                                        )}
                                    </div>
                                    {/* Ajout du champ phoneNumber */}
                                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                        <label className="block text-gray-600 mb-1 font-medium">
                                            {t('professionalDashboard.profileManagement.phoneNumber') || 'Numéro de téléphone'}
                                        </label>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="+216 12 345 678"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {t('professionalDashboard.profileManagement.phoneNumberFormat') || 'Format: +216 12 345 678'}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="font-medium text-[#142237]">
                                                {formData.phoneNumber || t('professionalDashboard.profileManagement.notSpecified')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hidden file input that will be triggered by the button */}
                        <input
                            id="profilePhotoInput"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {!isEditing && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-[#142237] mb-4 border-b border-gray-200 pb-2">{t('professionalDashboard.profileManagement.address')}</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {formData.userAddress && 
                                     Object.values(formData.userAddress).some(value => value !== null && value !== "" && value !== 0) ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="border-l-2 border-[#E5181D] pl-3">
                                                <p className="text-gray-600 text-sm font-medium">{t('professionalDashboard.profileManagement.street')}</p>
                                                <p className="font-medium text-[#142237]">{formData.userAddress.streetNumber || ""} {formData.userAddress.streetType || ""} {formData.userAddress.streetName || ""}</p>
                                            </div>
                                           
                                            <div className="border-l-2 border-[#E5181D] pl-3">
                                                <p className="text-gray-600 text-sm font-medium">{t('professionalDashboard.profileManagement.province')}</p>
                                                <p className="font-medium text-[#142237]">{formData.userAddress.state || t('professionalDashboard.profileManagement.notSpecified')}</p>
                                            </div>
                                            <div className="border-l-2 border-[#E5181D] pl-3">
                                                <p className="text-gray-600 text-sm font-medium">{t('professionalDashboard.profileManagement.postalCode')}</p>
                                                <p className="font-medium text-[#142237]">{formData.userAddress.zipCode || t('professionalDashboard.profileManagement.notSpecified')}</p>
                                            </div>
                                            <div className="border-l-2 border-[#E5181D] pl-3">
                                                <p className="text-gray-600 text-sm font-medium">{t('professionalDashboard.profileManagement.city')}</p>
                                                <p className="font-medium text-[#142237]">{formData.userAddress.city || t('professionalDashboard.profileManagement.notSpecified')}</p>
                                            </div>
                                            <div className="border-l-2 border-[#E5181D] pl-3">
                                                <p className="text-gray-600 text-sm font-medium">{t('professionalDashboard.profileManagement.country')}</p>
                                                <p className="font-medium text-[#142237]">{formData.userAddress.country || t('professionalDashboard.profileManagement.notSpecified')}</p>
                                            </div>
                                            
                                            {/* Affichage du numéro de téléphone dans la section d'adresse */}
                                            <div className="border-l-2 border-[#E5181D] pl-3">
                                                <p className="text-gray-600 text-sm font-medium">{t('professionalDashboard.profileManagement.phoneNumber') || 'Numéro de téléphone'}</p>
                                                <p className="font-medium text-[#142237]">{formData.phoneNumber || t('professionalDashboard.profileManagement.notSpecified')}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">{t('professionalDashboard.profileManagement.noAddress')}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {isEditing && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-[#142237] mb-4 border-b border-gray-200 pb-2">{t('professionalDashboard.profileManagement.address')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.streetNumber')}</label>
                                        <input
                                            type="number"
                                            name="streetNumber"
                                            value={formData.userAddress.streetNumber}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.streetName')}</label>
                                        <input
                                            type="text"
                                            name="streetName"
                                            value={formData.userAddress.streetName}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.streetType')}</label>
                                        <input
                                            type="text"
                                            name="streetType"
                                            value={formData.userAddress.streetType}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.province')}</label>
                                        <input
                                            type="text"
                                            name="provinceName"
                                            value={formData.userAddress.state}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.postalCode')}</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.userAddress.zipCode}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.city')}</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.userAddress.city || ""}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 mb-1 font-medium">{t('professionalDashboard.profileManagement.country')}</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.userAddress.country || ""}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isEditing && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#E5181D] text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
                                >
                                    {t('professionalDashboard.profileManagement.saveChanges')}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfileProfessionnalManagement;
