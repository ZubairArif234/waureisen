import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, Edit3 } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';
import { getProviderProfile, updateProviderProfile } from '../../api/providerAPI';
import { getCurrentProvider } from '../../utils/authService';
import { uploadImageToCloudinary } from '../../utils/cloudinaryUtils';
import toast from 'react-hot-toast';

const ProviderProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    phoneNumber: '',
    profilePicture: '',
    bio: '',
    businessName: '',
    businessType: 'individual',
    vatNumber: '',
    website: '',
    hostingExperience: 'none',
    propertyCount: '1'
  });

  // Preview image for profile picture upload
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch provider profile data
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setIsLoading(true);
        const data = await getProviderProfile();
        
        // Set form data from API response
        setFormData({
          username: data.username || '',
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          displayName: data.displayName || '',
          phoneNumber: data.phoneNumber || '',
          profilePicture: data.profilePicture || '',
          bio: data.bio || '',
          businessName: data.businessName || '',
          businessType: data.businessType || 'individual',
          vatNumber: data.vatNumber || '',
          website: data.website || '',
          hostingExperience: data.hostingExperience || 'none',
          propertyCount: data.propertyCount || '1'
        });

        // Set profile picture preview if available
        if (data.profilePicture) {
          setPreviewImage(data.profilePicture);
        }
      } catch (err) {
        console.error('Error fetching provider profile:', err);
        setError('Failed to load profile data. Please try again.');
        
        // Fallback to cached data
        const cachedProvider = getCurrentProvider();
        if (cachedProvider) {
          setFormData({
            username: cachedProvider.username || '',
            email: cachedProvider.email || '',
            firstName: cachedProvider.firstName || '',
            lastName: cachedProvider.lastName || '',
            displayName: cachedProvider.displayName || '',
            phoneNumber: cachedProvider.phoneNumber || '',
            profilePicture: cachedProvider.profilePicture || '',
            bio: cachedProvider.bio || '',
            businessName: cachedProvider.businessName || '',
            businessType: cachedProvider.businessType || 'individual',
            vatNumber: cachedProvider.vatNumber || '',
            website: cachedProvider.website || '',
            hostingExperience: cachedProvider.hostingExperience || 'none',
            propertyCount: cachedProvider.propertyCount || '1'
          });
          
          if (cachedProvider.profilePicture) {
            setPreviewImage(cachedProvider.profilePicture);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleBusinessTypeChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      businessType: type
    }));
  };

  const handlePropertyCountChange = (count) => {
    setFormData((prevData) => ({
      ...prevData,
      propertyCount: count
    }));
  };

  const handleHostingExperienceChange = (experience) => {
    setFormData((prevData) => ({
      ...prevData,
      hostingExperience: experience
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    
    try {
      setUploadingImage(true);
      
      // Upload image to Cloudinary
      const uploadedImageUrl = await uploadImageToCloudinary(file);
      
      // Update form data with the new image URL
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: uploadedImageUrl
      }));
      
      toast.success(t('image_uploaded_successfully'));
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error(t('image_upload_failed'));
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Prepare data for API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        profilePicture: formData.profilePicture,
        bio: formData.bio,
        businessName: formData.businessName,
        businessType: formData.businessType,
        vatNumber: formData.vatNumber,
        website: formData.website,
        hostingExperience: formData.hostingExperience,
        propertyCount: formData.propertyCount
      };
      
      // Update profile
      const updatedProfile = await updateProviderProfile(updateData);
      
      // Success notification
      toast.success(t('profile_updated_successfully'));
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      toast.error(t('profile_update_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FEFCF5]">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-brand/10 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/provider/account')}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {t('profile_settings')}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{t('personal_info_management')}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? t('cancel_editing') : t('edit_profile')}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 m-6 p-4 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-brand/20 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {uploadingImage ? (
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
                  ) : previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <>
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full cursor-pointer hover:bg-brand/90 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </label>
                    <input
                      type="file"
                      id="profile-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                    />
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">{t('supported_formats')}</p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('username')}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  disabled={true} // Username cannot be changed
                  className="w-full px-4 py-2 rounded-lg border bg-gray-50 text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('email_address')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={true} // Email cannot be changed
                  className="w-full px-4 py-2 rounded-lg border bg-gray-50 text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('first_name')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('last_name')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('display_name')}
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('phone_number')}
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t('about_you')}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder={t('bio_placeholder')}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500 min-h-[120px] resize-none"
              />
              <p className="text-sm text-gray-500">{t('bio_description')}</p>
            </div>

            {/* Business Information */}
            <div className="space-y-6 pt-4 border-t">
              <h2 className="text-xl font-semibold text-gray-800">{t('business_information')}</h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('business_type')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'individual', label: t('individual'), desc: t('renting_personal_property') },
                    { value: 'company', label: t('company'), desc: t('represent_registered_business') },
                    { value: 'property_manager', label: t('property_manager'), desc: t('manage_properties_for_others') }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`border rounded-lg p-4 cursor-pointer ${
                        !isEditing ? 'cursor-default' : ''
                      } ${
                        formData.businessType === option.value
                          ? 'border-brand bg-brand/5'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => isEditing && handleBusinessTypeChange(option.value)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          formData.businessType === option.value ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {formData.businessType === option.value && (
                            <div className="w-3 h-3 rounded-full bg-brand"></div>
                          )}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        {option.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {formData.businessType !== 'individual' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('business_name')}
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('vat_number')} ({t('optional')})
                </label>
                <input
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('website')} ({t('optional')})
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="https://"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Experience Information */}
            <div className="space-y-6 pt-4 border-t">
              <h2 className="text-xl font-semibold text-gray-800">{t('hosting_information')}</h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('properties_to_list')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['1', '2-5', '6-10', '10+'].map((count) => (
                    <div
                      key={count}
                      className={`border rounded-lg p-4 cursor-pointer ${
                        !isEditing ? 'cursor-default' : ''
                      } ${
                        formData.propertyCount === count
                          ? 'border-brand bg-brand/5'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => isEditing && handlePropertyCountChange(count)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          formData.propertyCount === count ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {formData.propertyCount === count && (
                            <div className="w-3 h-3 rounded-full bg-brand"></div>
                          )}
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hosting_experience')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'none', label: t('none') },
                    { value: 'other_platforms', label: t('on_other_platforms') },
                    { value: 'professional', label: t('professional') }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`border rounded-lg p-4 cursor-pointer ${
                        !isEditing ? 'cursor-default' : ''
                      } ${
                        formData.hostingExperience === option.value
                          ? 'border-brand bg-brand/5'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => isEditing && handleHostingExperienceChange(option.value)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          formData.hostingExperience === option.value ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {formData.hostingExperience === option.value && (
                            <div className="w-3 h-3 rounded-full bg-brand"></div>
                          )}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('saving')}</span>
                    </div>
                  ) : (
                    t('save_changes')
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderProfilePage;