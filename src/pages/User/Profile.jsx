import React, { useState } from 'react';
import { Upload, Camera, Edit3 } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Hamza',
    lastName: 'Bin Shahid',
    bio: '',
    profilePicture: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData(prev => ({ ...prev, profilePicture: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
    <Navbar />
    
    <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-brand/10 px-6 py-8 sm:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Profile Settings</h1>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancel editing' : 'Edit profile'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 space-y-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-brand/20 overflow-hidden bg-gray-50 flex items-center justify-center">
                {previewImage ? (
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
                  />
                </>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Supported formats: JPG, PNG (max. 20MB)
            </p>
          </div>

          {/* Rest of the form remains unchanged */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First name</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last name</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">About you</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Tell us a little bit about yourself..."
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500 min-h-[120px] resize-none"
            />
            <p className="text-sm text-gray-500">
              Waureisen is built on relationships. Help other people get to know you.
            </p>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium"
              >
                Save changes
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

export default Profile;