import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Eye,
  Save,
  X,
  Check,
  Sparkles,
  Pencil,
} from "lucide-react";
import {
  createBlog,
  getBlogById,
  updateBlog,
} from "../../api/travelMagazineAPI";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUtils";
import toast from "react-hot-toast";
import {
  initAutocomplete,
  loadGoogleMapsScript,
} from "../../utils/googleMapsUtils";
import { changeMetaData } from "../../utils/extra";

const CreateBlogPost = () => {
  const { title } = useParams(); // For edit mode
  useEffect(() => {
    changeMetaData(`${title ? "Edit Blog" : "Create Blog"} - Admin`);
  }, []);
  const navigate = useNavigate();
  const isEditMode = !!title;
  const locationInputRef = useRef(null);
  // Main state for the blog post
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    category: "",
    featuredImage: "",
    imageTitle: "",
    content: [],
    excerpt: "",
  });

  // State for content editing
  const [content, setContent] = useState({});
  const [contentType, setContentType] = useState(null);
  const [contentText, setContentText] = useState("");
  const [contentImg, setContentImg] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load blog data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          const formattedTitle = title?.replace(/-/g, " ");
          const blog = await getBlogById(formattedTitle);
          setBlogData({
            id: blog._id || "",
            title: blog.title || "",
            description: blog.description || "",
            category: blog.category || "",
            country: blog.country || "",
            featuredImage: blog.featuredImage || "",
            imageTitle: blog.imageTitle || "",
            content: blog.content || [],
            excerpt: blog.excerpt || "",
          });
        } catch (error) {
          toast.error("Error loading blog post");
          console.error("Error fetching blog:", error);
        }
      };

      fetchBlog();
    }
  }, [title, isEditMode]);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (window.google && window.google.maps && locationInputRef.current) {
        const autocomplete = initAutocomplete(locationInputRef, (place) => {
          if (place && place.formatted_address) {
            // Update the location in camperData state
            setBlogData((prev) => ({
              ...prev,
              country: place.formatted_address,
            }));
          }
        });
      }
    });
  }, []);

  // Generate excerpt from content
  useEffect(() => {
    if (blogData.content.length > 0) {
      // Find the first paragraph or use the first content element
      const firstParagraph = blogData.content.find((item) => item.type === "p");
      const firstContent = blogData.content[0];

      // Use the paragraph text or the first content text
      const excerptText = firstParagraph
        ? firstParagraph.text
        : firstContent.text;

      // Truncate to 150 characters
      const truncatedText =
        excerptText?.length > 150
          ? excerptText.substring(0, 150) + "..."
          : excerptText;

      setBlogData((prev) => ({
        ...prev,
        excerpt: truncatedText,
      }));
    }
  }, [blogData.content]);

  const normalizeUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (url.startsWith("www.") || url.includes(".")) {
      return `https://${url}`;
    }

    return `https://${url}`;
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // Create a temporary URL for preview
    const imageUrl = URL.createObjectURL(file);
    setBlogData({
      ...blogData,
      featuredImage: imageUrl, // Temporary URL for preview
    });
  };

  const handleContentImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a temporary URL for preview
    const imageUrl = URL.createObjectURL(file);
    setContentImg({ file: file, url: imageUrl });
    setContentText("uiu");
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return blogData.featuredImage; // Return existing URL if no new file

    setUploading(true);
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(imageFile);
      setUploading(false);
      return cloudinaryUrl;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  // Handle content addition
  const addContent = async () => {
    if (!contentText) return;

    let newContent;

    switch (contentType) {
      case "h1":
        newContent = { type: "h1", text: contentText };
        break;
      case "h2":
        newContent = { type: "h2", text: contentText };
        break;
      case "p":
        newContent = { type: "p", text: contentText };
        break;
      case "link":
        if (!linkUrl) return;
        newContent = {
          type: "link",
          text: contentText,
          url: normalizeUrl(linkUrl),
        };
        break;
      case "cta":
        if (!linkUrl) return;
        newContent = {
          type: "cta",
          text: contentText,
          url: normalizeUrl(linkUrl),
        };
        break;
      case "img":
        if (!contentImg?.file) return;
        const cloudinaryUrl = await uploadImageToCloudinary(contentImg?.file);
        newContent = {
          type: "img",
          url: cloudinaryUrl,
        };
        break;
      default:
        return;
    }

    setBlogData({
      ...blogData,
      content: [...blogData.content, newContent],
    });

    // Reset the content inputs
    setContentType(null);
    setContentText("");
    setLinkUrl("");
  };

  // Handle content edit
  const editContent = async () => {
    let newContent;
    if (contentType === "h1" || contentType === "h2" || contentType === "p") {
      newContent = { type: content.type, text: contentText };
    } else if (contentType === "link" || contentType === "cta") {
      if (!linkUrl) return;
      newContent = {
        type: content,
        text: contentText,
        url: normalizeUrl(linkUrl),
      };
    } else if (contentType === "img") {
      if (!contentImg?.file) return;
      const cloudinaryUrl = await uploadImageToCloudinary(contentImg?.file);
      newContent = {
        type: "img",
        url: cloudinaryUrl,
      };
    }
    const updatedContent = blogData.content.map((c, i) =>
      i === content.index ? newContent : c
    );

    setBlogData({
      ...blogData,
      content: updatedContent,
    });

    setContentType(null);
    setContent(null);
    setContentText("");
    setLinkUrl("");
  };

  // Remove a content item
  const removeContent = (index) => {
    const newContent = [...blogData.content];
    newContent.splice(index, 1);
    setBlogData({
      ...blogData,
      content: newContent,
    });
  };

  // Validate form data
  const validateForm = () => {
    if (!blogData.title) return "Title is required";
    if (!blogData.description) return "Description is required";
    if (!blogData.category) return "Category is required";
    if (!blogData.featuredImage && !imageFile)
      return "Featured image is required";
    if (blogData.content.length === 0) return "Content is required";
    return null;
  };

  // Handle saving
  const handleSave = async () => {
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // First upload image to Cloudinary if there's a new image
      const cloudinaryUrl = imageFile
        ? await uploadImage()
        : blogData.featuredImage;

      // Prepare data for API
      const formattedData = {
        ...blogData,
        featuredImage: cloudinaryUrl,
      };

      // Create or update blog
      if (isEditMode) {
        await updateBlog(blogData?.id, formattedData);
        toast.success("Blog post updated!");
      } else {
        await createBlog(formattedData);
        toast.success("Blog post created!");
      }

      // Navigate back to travel magazine
      navigate("/admin/travel-magazine");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(error.response?.data?.message || "Error saving blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render content preview
  const renderContentPreview = () => {
    return blogData.content.map((item, index) => {
      switch (item.type) {
        case "h1":
          return (
            <h1 key={index} className="text-3xl font-bold my-4 text-gray-900">
              {item.text}
            </h1>
          );
        case "h2":
          return (
            <h2
              key={index}
              className="text-2xl font-semibold my-3 text-gray-800"
            >
              {item.text}
            </h2>
          );
        case "p":
          return (
            <p key={index} className="my-3 text-gray-600">
              {item.text}
            </p>
          );
        case "link":
          return (
            <p key={index} className="my-2">
              <a
                href={item.url}
                className="text-[#B4A481] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.text}
              </a>
            </p>
          );
        case "cta":
          return (
            <p key={index} className="my-4">
              <a
                href={item.url}
                className="inline-block bg-[#B4A481] text-white px-6 py-2 rounded-lg hover:bg-[#a3927b] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.text}
              </a>
            </p>
          );
          case 'img':
          return (
            <div key={index} className={`my-4 flex justify-center mx-[8rem]`}>
             <img src={item?.url}  className='w-full h-[40vh]'/>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/travel-magazine")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-5 h-5" />
            {showPreview ? "Edit" : "Preview"}
          </button>

          <button
            onClick={handleSave}
            disabled={isSubmitting || uploading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSubmitting || uploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#B4A481] text-white hover:bg-[#a3927b]"
            }`}
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview Mode */
        <div className="w-full">
          {" "}
          {/* Remove max-width, padding, and border constraints */}
          {/* Featured Image at top with full width */}
          {blogData.featuredImage && (
            <div className="relative w-full h-[60vh]">
              {" "}
              {/* Full height hero image */}
              <img
                src={blogData.featuredImage}
                alt={blogData.imageTitle}
                className="w-full h-full object-cover"
              />
              {/* Overlay for text with dark gradient */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {blogData.imageTitle || "Untitled Blog Post"}
                </h1>
                <p className="text-lg md:text-xl text-white max-w-2xl px-4">
                  {blogData.description || "No description provided."}
                </p>
              </div>
            </div>
          )}
          {/* Content section */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="prose max-w-none">
              {blogData.content.length > 0 ? (
                renderContentPreview()
              ) : (
                <p className="text-gray-400 italic">No content added yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="max-w-4xl mx-auto">
          {/* Main Information Section */}
          <section className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Main Information
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  disabled={title}
                  value={blogData.title}
                  onChange={(e) =>
                    setBlogData({ ...blogData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                  placeholder="Enter blog title"
                />
                <div className="bg-amber-100 flex items-center gap-2 py-2 px-3 border border-amber-600 rounded-lg mt-2">
                  <Sparkles color="#d97706" size={18} />
                  <p className="text-xs text-amber-600">
                    Do not repeat the title, it must always be unique to boast
                    the SEO perfomance
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={blogData.description}
                  onChange={(e) =>
                    setBlogData({ ...blogData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                  placeholder="Enter a brief description of the blog"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={blogData.category}
                  onChange={(e) =>
                    setBlogData({ ...blogData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                >
                  <option value="">Select category</option>
                  <option value="Destinations">Destinations</option>
                  <option value="Food & Cuisine">Food & Cuisine</option>
                  <option value="Travel Tips">Travel Tips</option>
                  <option value="Pet Travel">Pet Travel</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  ref={locationInputRef}
                  value={blogData.country}
                  onChange={(e) =>
                    setBlogData({ ...blogData, country: e.target.value })
                  }
                  // onChange={(e) =>
                  //   handleInputChange("", e.target.value)
                  // }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                  placeholder="Start typing a location..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select a location from the dropdown suggestions
                </p>
              </div>
            </div>
          </section>

          {/* Image & Title Section */}
          <section className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Image & Title
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image (Cloudinary)
                </label>

                {blogData.featuredImage ? (
                  <div className="relative">
                    <img
                      src={blogData.featuredImage}
                      alt="Blog cover"
                      className="w-full h-[300px] object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setBlogData({ ...blogData, featuredImage: "" });
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#B4A481] rounded-full animate-spin mb-3"></div>
                          <span className="text-gray-600 font-medium">
                            Uploading to Cloudinary...
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mb-3" />
                          <span className="text-gray-600 font-medium mb-1">
                            Drag & drop your image here
                          </span>
                          <span className="text-gray-500 text-sm mb-3">or</span>
                          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Choose File
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="imageTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image Title (will be overlayed on the image)
                </label>
                <input
                  type="text"
                  id="imageTitle"
                  value={blogData.imageTitle}
                  onChange={(e) =>
                    setBlogData({ ...blogData, imageTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                  placeholder="Enter image title"
                />
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Content
            </h2>

            {/* Content Builder */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => {
                    setContentType("h1");
                    setContentText("");
                    setContent(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "h1"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  H1
                </button>

                <button
                  onClick={() => {
                    setContentType("h2");
                    setContentText("");
                    setContent(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "h2"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  H2
                </button>

                <button
                  onClick={() => {
                    setContentType("p");
                    setContentText("");
                    setContent(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "p"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  P
                </button>

                <button
                  onClick={() => {
                    setContentType("link");
                    setContentText("");
                    setContent(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "link"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Link
                </button>

                <button
                  onClick={() => {
                    setContentType("cta");
                    setContentText("");
                    setContent(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "cta"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  CTA
                </button>

                <button
                  onClick={() => {
                    setContentType("img");
                    setContentText("");
                    setContent(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "img"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Image
                </button>
              </div>

              {/* Content Input Form */}
              {contentType && (
                <div className="p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">
                      {content ? "Edit" : "Add"} {contentType.toUpperCase()}{" "}
                      Content
                    </h3>
                    <button
                      onClick={() => setContentType(null)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {contentType == "img" ? (
                      contentImg?.url ? (
                        <div className="relative">
                          <img
                            src={contentImg.url}
                            alt="Camper cover"
                            className="w-full h-[300px] object-cover rounded-lg"
                          />
                          <button
                            onClick={() => {
                              setContentImg(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                          >
                            <X className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="w-12 h-12 text-gray-400 mb-3" />
                          <span className="text-gray-600 font-medium mb-1">
                            Drag & drop your image here
                          </span>
                          <span className="text-gray-500 text-sm mb-3">or</span>
                          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Choose File
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleContentImageUpload}
                            disabled={uploading}
                          />
                        </label>
                      )
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {contentType === "link" || contentType === "cta"
                            ? "Text to Display"
                            : "Content Text"}
                        </label>
                        <input
                          type="text"
                          value={contentText}
                          onChange={(e) => setContentText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                          placeholder={`Enter ${contentType} text`}
                        />
                      </div>
                    )}

                    {(contentType === "link" || contentType === "cta") && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                          placeholder="https://example.com"
                        />
                      </div>
                    )}

                    <button
                      onClick={content ? editContent : addContent}
                      disabled={
                        ((contentType === "link" || contentType === "cta") &&
                          !linkUrl) ||
                        (contentType === "img" && !contentImg) ||
                        (contentType !== "img" &&
                          contentType !== "link" &&
                          contentType !== "cta" &&
                          !contentText)
                      }
                      // {/}

                      className={`w-full py-2 flex items-center justify-center gap-2 rounded-lg transition-colors ${
                        !contentText ||
                        ((contentType === "link" || contentType === "cta") &&
                          !linkUrl)
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#B4A481] text-white hover:bg-[#a3927b]"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {content ? "Edit" : "Add"} {contentType.toUpperCase()}
                    </button>
                  </div>
                </div>
              )}

              {/* Content Preview */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">
                  Content Elements
                </h3>

                {blogData.content.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">
                      No content elements added yet
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Use the buttons above to add content
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {blogData.content.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              item.type === "h1"
                                ? "bg-purple-100 text-purple-800"
                                : item.type === "h2"
                                ? "bg-blue-100 text-blue-800"
                                : item.type === "p"
                                ? "bg-green-100 text-green-800"
                                : item.type === "link"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.type === "img"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.type.toUpperCase()}
                          </span>
                          <div className="truncate flex-1 min-w-0">
                            <span className="text-gray-700">{item.text}</span>
                            {(item.type === "link" || item.type === "cta") && (
                              <span className="text-gray-400 text-xs ml-2 block truncate">
                                {item.url}
                              </span>
                            )}
                            {item.type === "img" && (
                              <div className="flex items-center gap-2">
                                <img src={item.url} className="w-6 h-6" />

                                <span className="text-gray-400 text-xs ml-2 block truncate">
                                  {item.url}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setContentType(item?.type);
                            setContentText(item?.text);
                            setLinkUrl(item?.url);
                            setContent({ ...item, index: index });
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
                        >
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => removeContent(index)}
                          className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default CreateBlogPost;
