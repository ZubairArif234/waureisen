import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Plus, AlertTriangle } from 'lucide-react';
import BlogCard from '../../components/Admin/BlogCard';
import BlogForm from '../../components/Admin/BlogForm'; // Updated import
import magazine from '../../assets/magazine.jpg';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, blogTitle }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">Delete Blog Post</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<span className="font-medium">{blogTitle}</span>"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to truncate HTML content for previews
const truncateHtml = (html, maxLength = 150) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get the text content
  let text = tempDiv.textContent || tempDiv.innerText || '';
  
  // Truncate the text
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  
  return text;
};

const TravelMagazine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  
  // Mock data for blog posts
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: '10 Must-Visit Destinations in Switzerland',
      excerpt: 'Discover the breathtaking beauty of Switzerland\'s most stunning locations...',
      content: '<h1>10 Must-Visit Destinations in Switzerland</h1><p>Switzerland is known for its breathtaking landscapes, pristine lakes, and charming villages. Here are ten must-visit destinations for any traveler exploring this beautiful country.</p><h2>1. Zurich</h2><p>As the largest city in Switzerland, Zurich offers a perfect blend of urban sophistication and natural beauty. Visit the historic old town, take a boat ride on Lake Zurich, or explore the city\'s world-class museums and galleries.</p><h2>2. Lucerne</h2><p>With its medieval architecture, covered bridges, and stunning lake views, Lucerne is like stepping into a fairy tale. Don\'t miss the iconic Chapel Bridge and the Lion Monument.</p>',
      category: 'Destinations',
      featuredImage: magazine,
      publishDate: 'March 15, 2023'
    },
    {
      id: 2,
      title: 'Mediterranean Cuisine: A Culinary Journey',
      excerpt: 'Explore the rich flavors and culinary traditions of the Mediterranean coast...',
      content: '<h1>Mediterranean Cuisine: A Culinary Journey</h1><p>The Mediterranean diet is not just healthy—it\'s also incredibly delicious and diverse. From Spanish tapas to Italian pasta, Greek meze to Moroccan tagines, the region offers an incredible variety of flavors and cooking techniques.</p><h2>Key Ingredients</h2><ul><li>Olive oil</li><li>Fresh vegetables</li><li>Whole grains</li><li>Fish and seafood</li><li>Herbs and spices</li></ul>',
      category: 'Food & Cuisine',
      featuredImage: magazine,
      publishDate: 'March 10, 2023'
    },
    {
      id: 3,
      title: 'Essential Packing Tips for Long-Term Travel',
      excerpt: 'Learn how to pack efficiently for extended trips without overpacking...',
      content: '<h1>Essential Packing Tips for Long-Term Travel</h1><p>Packing for a long-term journey requires strategy and restraint. Here are some essential tips to help you pack efficiently without weighing yourself down.</p><h2>Pack Versatile Clothing</h2><p>Choose items that can be mixed and matched, and that work for different weather conditions. Neutral colors are your friend!</p><h2>Minimize Electronics</h2><p>Only bring gadgets you\'ll use regularly. Consider a multi-purpose device like a smartphone or tablet instead of carrying multiple electronics.</p>',
      category: 'Travel Tips',
      featuredImage: magazine,
      publishDate: 'March 5, 2023'
    },
    {
      id: 4,
      title: 'Dog-Friendly Beaches in Europe',
      excerpt: 'Discover the best beaches across Europe where your furry friend is welcome...',
      content: '<h1>Dog-Friendly Beaches in Europe</h1><p>Planning a beach vacation with your four-legged friend? Europe offers many beautiful coastlines where dogs are welcome. Here\'s our guide to the best dog-friendly beaches across the continent.</p><h2>Spain: Playa de la Rubina, Costa Brava</h2><p>This wide, sandy beach allows dogs year-round and offers shallow waters perfect for doggy paddles.</p><h2>Italy: Bau Bau Village, Rimini</h2><p>This dedicated dog beach comes complete with umbrellas, dog showers, and even doggy lifeguards!</p>',
      category: 'Pet Travel',
      featuredImage: magazine,
      publishDate: 'February 28, 2023'
    }
  ]);

  // Handler for editing a blog
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  // Handler for deleting a blog
  const handleDelete = (id) => {
    const blog = blogs.find(blog => blog.id === id);
    setDeleteModal({ 
      isOpen: true, 
      id, 
      title: blog?.title || 'this blog post' 
    });
  };

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    setBlogs(prevBlogs => 
      prevBlogs.filter(blog => blog.id !== deleteModal.id)
    );
    setDeleteModal({ isOpen: false, id: null, title: '' });
  };

  // Handler for saving a blog (create or update)
  const handleSaveBlog = (blogData) => {
    if (editingBlog) {
      // Update existing blog
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog.id === editingBlog.id 
            ? { 
                ...blog, 
                ...blogData, 
                id: blog.id,
                // Generate excerpt from content if not provided
                excerpt: blogData.excerpt || truncateHtml(blogData.content)
              } 
            : blog
        )
      );
    } else {
      // Create new blog
      const newBlog = {
        ...blogData,
        id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
        publishDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        // Generate excerpt from content if not provided
        excerpt: blogData.excerpt || truncateHtml(blogData.content)
      };
      setBlogs(prevBlogs => [...prevBlogs, newBlog]);
    }

    // Close form and reset editing state
    setIsFormOpen(false);
    setEditingBlog(null);
  };

  // Filter blogs based on search query and category
  const filteredBlogs = blogs.filter(blog => 
    (selectedCategory === 'all' || blog.category === selectedCategory) &&
    (blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Travel Magazine
          </h1>
          <p className="text-gray-600">
            Manage blog posts and content for the travel magazine
          </p>
        </div>
        
        <button 
          onClick={() => {
            setEditingBlog(null);
            setIsFormOpen(true);
          }}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Blog
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1 mb-4 md:mb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand w-full md:w-auto"
          >
            <option value="all">All Categories</option>
            <option value="Destinations">Destinations</option>
            <option value="Food & Cuisine">Food & Cuisine</option>
            <option value="Travel Tips">Travel Tips</option>
            <option value="Pet Travel">Pet Travel</option>
          </select>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map(blog => (
          <BlogCard 
            key={blog.id} 
            blog={blog}
            onEdit={() => handleEdit(blog)}
            onDelete={() => handleDelete(blog.id)}
          />
        ))}
      </div>
      
      {/* No results message */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No blog posts found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
      
      {/*  Blog Form Modal */}
      {isFormOpen && (
        <BlogForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBlog(null);
          }}
          onSave={handleSaveBlog}
          blog={editingBlog}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={handleConfirmDelete}
        blogTitle={deleteModal.title}
      />
    </div>
  );
};

export default TravelMagazine;