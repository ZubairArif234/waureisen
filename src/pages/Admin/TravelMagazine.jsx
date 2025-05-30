import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, AlertTriangle, Plus } from "lucide-react";
import BlogCard from "../../components/Admin/BlogCard";
import BlogForm from "../../components/Admin/BlogForm";
import { getAllBlogs, deleteBlog } from "../../api/travelMagazineAPI";
import toast from "react-hot-toast";
import { changeMetaData } from "../../utils/extra";

// Skeleton cards for loading state
const SkeletonCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <div className="mb-3">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="w-3/4">
                <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            </div>
            <div className="mt-6">
              <div className="h-9 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, blogTitle }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">Delete Blog Post</h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "
            <span className="font-medium">{blogTitle}</span>"? This action
            cannot be undone.
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

const TravelMagazine = () => {
    useEffect(() => {
         
          
            changeMetaData(`Travel Magazine - Admin`);
          }, []);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: "",
  });
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory !== "all") {
        filters.category = selectedCategory;
      }

      const blogsData = await getAllBlogs(filters);
      setBlogs(blogsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blog posts");
      toast.error("Error loading blog posts");
    } finally {
      setLoading(false);
    }
  };

  // Refetch blogs when category changes
  useEffect(() => {
    if (!loading) {
      fetchBlogs();
    }
  }, [selectedCategory]);

  // Handler for editing a blog
  const handleEdit = (blog) => {
      const formattedTitle = blog.title?.replace(/ /g, "-");
    navigate(`/admin/travel-magazine/edit/${formattedTitle}`);
  };

  // Handler for deleting a blog
  const handleDelete = (id) => {
    const blog = blogs.find((blog) => blog._id === id);
    setDeleteModal({
      isOpen: true,
      id,
      title: blog?.title || "this blog post",
    });
  };

  // Handler for confirming deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteBlog(deleteModal.id);

      // Update local state
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== deleteModal.id)
      );

      toast.success("Blog post deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setDeleteModal({ isOpen: false, id: null, title: "" });
    }
  };

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
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
          onClick={() => navigate("/admin/travel-magazine/create")}
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

      {/* Loading State */}
      {loading && <SkeletonCards />}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          <p className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </p>
          <button onClick={fetchBlogs} className="mt-2 text-sm underline">
            Try again
          </button>
        </div>
      )}

      {/* Blog Posts Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={{
                  id: blog._id,
                  title: blog.title,
                  description: blog.description,
                  excerpt: blog.excerpt,
                  category: blog.category,
                  featuredImage: blog.featuredImage,
                  publishDate: new Date(blog.publishDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  ),
                }}
                onEdit={() => handleEdit(blog)}
                onDelete={() => handleDelete(blog._id)}
              />
            ))}
          </div>

          {/* No results message */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No blog posts found</p>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: "" })}
        onConfirm={handleConfirmDelete}
        blogTitle={deleteModal.title}
      />
    </div>
  );
};

export default TravelMagazine;
