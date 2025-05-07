// src/pages/Admin/CreateCamperPost.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Eye,
  Save,
  X,
  Check,
  Image as ImageIcon,
  MoreHorizontal,
} from "lucide-react";
import { createCamper, getCamperById, updateCamper } from "../../api/camperAPI";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUtils";
import toast from "react-hot-toast";
import {
  loadGoogleMapsScript,
  initAutocomplete,
} from "../../utils/googleMapsUtils";

const CreateCamperPost = () => {
  const navigate = useNavigate();
  const locationInputRef = useRef(null);
  const { id } = useParams(); // For edit mode
  const isEditMode = !!id;

  // Main state for the camper post
  const [camperData, setCamperData] = useState({
    title: "",
    description: "",
    category: [],
    featuredImage: "",
    imageTitle: "",
    content: [],
    excerpt: "",
    price: 0,
    currency: "CHF",
    location: "",
    status: "Available",
  });

  // State for content editing
  const [contentType, setContentType] = useState(null);
  const [contentText, setContentText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (window.google && window.google.maps && locationInputRef.current) {
        const autocomplete = initAutocomplete(locationInputRef, (place) => {
          if (place && place.formatted_address) {
            // Update the location in camperData state
            handleInputChange("location", place.formatted_address);

            // If you want to store coordinates as well, uncomment these lines
            // if (place.geometry && place.geometry.location) {
            //   handleInputChange('latitude', place.geometry.location.lat());
            //   handleInputChange('longitude', place.geometry.location.lng());
            // }
          }
        });
      }
    });
  }, []);

  // Load camper data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCamper = async () => {
        try {
          const camper = await getCamperById(id);
          setCamperData({
            title: camper.title || "",
            description: camper.description || "",
            category: camper.category || "",
            featuredImage: camper.featuredImage || "",
            imageTitle: camper.imageTitle || "",
            content: camper.content || [],
            excerpt: camper.excerpt || "",
            price: camper.price || 0,
            currency: camper.currency || "CHF",
            location: camper.location || "",
            status: camper.status || "Available",
          });
        } catch (error) {
          toast.error("Error loading camper");
          console.error("Error fetching camper:", error);
        }
      };

      fetchCamper();
    }
  }, [id, isEditMode]);

  // Generate excerpt from content
  useEffect(() => {
    if (camperData.content.length > 0) {
      // Find the first paragraph or use the first content element
      const firstParagraph = camperData.content.find(
        (item) => item.type === "p"
      );
      const firstContent = camperData.content[0];

      // Use the paragraph text or the first content text
      const excerptText = firstParagraph
        ? firstParagraph.text
        : firstContent.text;

      // Truncate to 150 characters
      const truncatedText =
        excerptText.length > 150
          ? excerptText.substring(0, 150) + "..."
          : excerptText;

      setCamperData((prev) => ({
        ...prev,
        excerpt: truncatedText,
      }));
    }
  }, [camperData.content]);

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
    setCamperData({
      ...camperData,
      featuredImage: imageUrl, // Temporary URL for preview
    });
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return camperData.featuredImage; // Return existing URL if no new file

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
  const addContent = () => {
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
      default:
        return;
    }

    setCamperData({
      ...camperData,
      content: [...camperData.content, newContent],
    });

    // Reset the content inputs
    setContentType(null);
    setContentText("");
    setLinkUrl("");
  };

  // Remove a content item
  const removeContent = (index) => {
    const newContent = [...camperData.content];
    newContent.splice(index, 1);
    setCamperData({
      ...camperData,
      content: newContent,
    });
  };

  // Validate form data
  const validateForm = () => {
    if (!camperData.title) return "Title is required";
    if (!camperData.description) return "Description is required";
    if (!camperData.category) return "Category is required";
    if (!camperData.featuredImage && !imageFile)
      return "Featured image is required";
    if (camperData.content.length === 0) return "Content is required";
    if (!camperData.price) return "Price is required";
    if (!camperData.location) return "Location is required";
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
        : camperData.featuredImage;

      // Prepare data for API
      const formattedData = {
        ...camperData,
        featuredImage: cloudinaryUrl,
      };

      // Create or update camper
      if (isEditMode) {
        await updateCamper(id, formattedData);
        toast.success("Camper updated!");
      } else {
        await createCamper(formattedData);
        toast.success("Camper created!");
      }

      // Navigate back to campers
      navigate("/admin/campers");
    } catch (error) {
      console.error("Error saving camper:", error);
      toast.error(error.response?.data?.message || "Error saving camper");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change for general fields
  const handleInputChange = (field, value) => {
    if (field == "category") {
      const isExist = camperData?.category?.some((item)=>item == value)
      if(isExist){
toast.error("Category already selected!")
      }else{

        setCamperData((prev) => ({
          ...prev,
          category: [...prev?.category, value],
        }));
      }
    } else {
      setCamperData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Render content preview
  const renderContentPreview = () => {
    return camperData.content.map((item, index) => {
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
        default:
          return null;
      }
    });
  };

  const handleRemoveCategory = (cat) => {
    const updated = camperData?.category?.filter((val) => val !== cat);
    setCamperData((prev) => ({
      ...prev,
      category: updated,
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/campers")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? "Edit Camper" : "Create New Camper"}
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
          {/* Featured Image at top with full width */}
          {camperData.featuredImage && (
            <div className="relative w-full h-[60vh]">
              <img
                src={camperData.featuredImage}
                alt={camperData.imageTitle}
                className="w-full h-full object-cover"
              />
              {/* Overlay for text with dark gradient */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {camperData.imageTitle ||
                    camperData.title ||
                    "Untitled Camper"}
                </h1>
                <p className="text-lg md:text-xl text-white max-w-2xl px-4">
                  {camperData.description || "No description provided."}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="px-3 py-1 bg-white text-black rounded-full font-medium">
                    {camperData.price} {camperData.currency}
                  </span>
                  <span className="px-3 py-1 bg-[#B4A481] text-white rounded-full font-medium">
                    {camperData.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-800 text-white rounded-full font-medium">
                    {camperData.location}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content section */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="prose max-w-none">
              {camperData.content.length > 0 ? (
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
                  Camper Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={camperData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                  placeholder="Enter camper title"
                />
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
                  value={camperData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                  placeholder="Enter a brief description of the camper"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={camperData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                  >
                    <option value="">Select category</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Driver cabin">Driver cabin</option>
                    <option value="Living area & kitchen">
                      Living area & kitchen
                    </option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Dog facilities">Dog facilities</option>
                    <option value="Additional">Additional</option>
                    <option value="Security deposit">Security deposit</option>
                    <option value="Rules & requirements">
                      Rules & requirements
                    </option>
                  </select>
                  <div className="flex gap-2 items-center flex-wrap">
                    {camperData.category?.map((item, i) => (
                      <p
                        key={i}
                        className="text-xs flex items-center gap-4 border border-slate-300 mt-1 p-1 rounded-full"
                      >
                        {item}{" "}
                        <span>
                          <X onClick={()=>handleRemoveCategory(item)} size={12} className="cursor-pointer" />
                        </span>
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="price"
                      value={camperData.price}
                      onChange={(e) =>
                        handleInputChange("price", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                      placeholder="0"
                      min="0"
                      step="1"
                    />
                    <select
                      value={camperData.currency}
                      onChange={(e) =>
                        handleInputChange("currency", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                    >
                      <option value="CHF">CHF</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={camperData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B4A481]/20 focus:border-[#B4A481]"
                  >
                    <option value="Available">Available</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
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
                  value={camperData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
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

                {camperData.featuredImage ? (
                  <div className="relative">
                    <img
                      src={camperData.featuredImage}
                      alt="Camper cover"
                      className="w-full h-[300px] object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setCamperData({ ...camperData, featuredImage: "" });
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
                  value={camperData.imageTitle}
                  onChange={(e) =>
                    handleInputChange("imageTitle", e.target.value)
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
                  onClick={() => setContentType("h1")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "h1"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  H1
                </button>

                <button
                  onClick={() => setContentType("h2")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "h2"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  H2
                </button>

                <button
                  onClick={() => setContentType("p")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "p"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  P
                </button>

                <button
                  onClick={() => setContentType("link")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "link"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Link
                </button>

                <button
                  onClick={() => setContentType("cta")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    contentType === "cta"
                      ? "bg-[#B4A481] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  CTA
                </button>
              </div>

              {/* Content Input Form */}
              {contentType && (
                <div className="p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">
                      Add {contentType.toUpperCase()} Content
                    </h3>
                    <button
                      onClick={() => setContentType(null)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-3">
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
                      onClick={addContent}
                      disabled={
                        !contentText ||
                        ((contentType === "link" || contentType === "cta") &&
                          !linkUrl)
                      }
                      className={`w-full py-2 flex items-center justify-center gap-2 rounded-lg transition-colors ${
                        !contentText ||
                        ((contentType === "link" || contentType === "cta") &&
                          !linkUrl)
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#B4A481] text-white hover:bg-[#a3927b]"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      Add {contentType.toUpperCase()}
                    </button>
                  </div>
                </div>
              )}

              {/* Content Preview */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">
                  Content Elements
                </h3>

                {camperData.content.length === 0 ? (
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
                    {camperData.content.map((item, index) => (
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
                          </div>
                        </div>
                        <button
                          onClick={() => removeContent(index)}
                          className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
                        >
                          <X  className="w-4 h-4 text-gray-500" />
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

export default CreateCamperPost;
