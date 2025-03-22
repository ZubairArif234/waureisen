import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const BlogForm = ({ isOpen, onClose, onSave, blog = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    featuredImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  
  // Initialize form data if editing an existing blog
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || '',
        featuredImage: blog.featuredImage || null
      });
      
      if (blog.featuredImage) {
        setImagePreview(blog.featuredImage);
      }
    }
  }, [blog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just create a URL to preview the image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData(prev => ({
        ...prev,
        featuredImage: imageUrl // In a real app, we'd upload this to server
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
        <div className="bg-white rounded-0 sm:rounded-2xl w-full max-w-3xl max-h-[100vh] sm:max-h-[90vh] flex flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  required
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="A short summary of the blog post"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter blog content..."
                  rows="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  required
                />
                <p className="text-xs text-gray-500">
                  You can use Markdown formatting for rich content
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Destinations">Destinations</option>
                  <option value="Food & Cuisine">Food & Cuisine</option>
                  <option value="Travel Tips">Travel Tips</option>
                  <option value="Pet Travel">Pet Travel</option>
                </select>
              </div>

              {/* Featured Image */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Featured Image
                </label>
                
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Featured" 
                      className="w-full max-h-48 object-cover rounded-lg"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, featuredImage: null }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                      <span className="text-gray-600 font-medium mb-1">Drag & drop your image here</span>
                      <span className="text-gray-500 text-sm mb-3">or</span>
                      <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Choose File
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Recommended: 1200 x 628 pixels, maximum size of 5MB
                </p>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
            >
              {blog ? 'Update Blog Post' : 'Publish Blog Post'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogForm;