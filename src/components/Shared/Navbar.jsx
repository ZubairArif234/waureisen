import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Globe,
  Menu,
  User,
  X,
  MessageSquare,
  Map,
  Heart,
  Home,
  UserCircle,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Calendar,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useLanguage } from "../../utils/LanguageContext";
import { useSocket } from "../../utils/SocketContext"; // Import the socket context
import {
  isAuthenticated,
  logout,
  getCurrentUser,
  getUserType,
} from "../../utils/authService";
import { getUserUnreadCount, getProviderUnreadCount } from "../../api/conversationAPI";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [profileImageError, setProfileImageError] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const navigate = useNavigate();
  const { language, switchLanguage, t } = useLanguage();
  const { socket } = useSocket(); // Get socket from context

  // Extract fetchUnreadCount function outside of useEffect for reuse
  const fetchUnreadCount = async () => {
    if (!isLoggedIn) {
      setUnreadMessageCount(0);
      return;
    }
    
    try {
      if (userType === "provider") {
        const count = await getProviderUnreadCount();
        setUnreadMessageCount(count);
      } else if (userType === "user") {
        const count = await getUserUnreadCount();
        setUnreadMessageCount(count);
      }
    } catch (error) {
      //console.error("Failed to fetch unread messages:", error);
    }
  };

  // Fetch unread count on mount and periodically
  useEffect(() => {
    if (!isLoggedIn) return;
    
    fetchUnreadCount();
    
    // Set up interval to check periodically
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, [isLoggedIn, userType]);

  // Socket integration for real-time updates
  useEffect(() => {
    if (!socket || !isLoggedIn) return;
    
    // console.log("Setting up socket listeners in Navbar");
    
    // Listen for new messages
    const handleNewMessage = (message) => {
      //console.log("New message received in Navbar:", message);
      
      // Increment count immediately when receiving a message meant for this user
      const shouldIncrement = 
        (userType === 'user' && message.senderType === 'Provider') ||
        (userType === 'provider' && message.senderType === 'User');
        
      if (shouldIncrement) {
        //console.log("Incrementing unread count");
        setUnreadMessageCount(prev => prev + 1);
      }
    };
    
    socket.on('new_message', handleNewMessage);
    
    return () => {
      //console.log("Cleaning up socket listeners in Navbar");
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, isLoggedIn, userType]);

  // Check authentication status when component mounts or when dependencies change
  useEffect(() => {
    const checkAuth = () => {
      //console.log("Checking auth status in Navbar");
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);

      if (authStatus) {
        // Always reset the profile image error state when checking authentication
        setProfileImageError(false);

        // Get current user from localStorage first (for immediate display)
        const user = getCurrentUser();
        //console.log("Current user data:", user);

        if (user) {
          setCurrentUser(user);
          setUserType(getUserType());

          // Verify the profile picture URL by preloading it
          if (user.profilePicture) {
            //console.log("Found profile picture:", user.profilePicture);

            // Create a test image element to verify the URL works
            const testImg = new Image();
            testImg.onload = () => {
              //console.log("Profile image loaded successfully");
              setProfileImageError(false);
            };
            testImg.onerror = () => {
              //console.error(
              //  "Failed to load profile image:",
              //  user.profilePicture
              //);
              setProfileImageError(true);
            };
            testImg.src = user.profilePicture;
          }
        }
      } else {
        //console.log("User not authenticated");
        setCurrentUser(null);
        setUserType(null);
      }
    };

    // Check auth immediately when component mounts
    checkAuth();

    // Add an event listener for storage events to detect changes to localStorage
    // This helps with synchronizing login/logout across tabs
    const handleStorageChange = (event) => {
      //console.log("Storage changed, rechecking auth");
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Define menu items for different user types
  const customerMenuItems = [
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: t("messages"),
      path: "/messages",
      badge: unreadMessageCount > 0 ? unreadMessageCount : null,
    },
    {
      icon: <Map className="h-4 w-4" />,
      label: t("your_trips"),
      path: "/trips",
    },
    {
      icon: <Heart className="h-4 w-4" />,
      label: t("favorites"),
      path: "/wishlist",
    },
    {
      icon: <UserCircle className="h-4 w-4" />,
      label: t("profile"),
      path: "/profile",
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: t("account"),
      path: "/account",
    },
  ];

  const providerMenuItems = [
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: t("messages"),
      path: "/provider/messages",
      badge: unreadMessageCount > 0 ? unreadMessageCount : null,
    },
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: t("Dashboard"),
      path: "/provider/dashboard",
      onClick: () => navigate("/"),
    },
    {
      icon: <Home className="h-4 w-4" />,
      label: t("your_listings"),
      path: "/provider/your-listings",
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: t("bookings"),
      path: "/provider/bookings",
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: t("account"),
      path: "/provider/account",
    },
  ];

  // Determine which menu items to show based on user type
  const getMenuItems = () => {
    if (userType === "provider") {
      return providerMenuItems;
    }
    return customerMenuItems; // Default to customer menu items
  };

  const handleLanguageSelect = (langCode) => {
    switchLanguage(langCode);
  };

  const handleLogout = () => {
    // Call the logout function from authService
    logout();
    // Update local state
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserType(null);
    setIsProfileMenuOpen(false);
    setProfileImageError(false);
    setUnreadMessageCount(0);
    // Redirect to home page
    navigate("/");
  };

  // Check if we should show the menu icon (not for admin users)
  const shouldShowMenuIcon = isLoggedIn && userType !== "admin";
//console.log(userType)
  return (
    <nav className="fixed w-full top-0 z-50 px-6 py-4 bg-white/20 backdrop-blur-sm rounded-b-2xl shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 ml-2 sm:ml-4 md:ml-8">
          <Link to="/">
            <img src={logo} alt="Wau Logo" className="h-12" />
          </Link>
        </div>

        {/* Desktop & Tablet Navigation Links */}
        {userType != "provider" && 
       ( <div className="hidden md:flex items-center space-x-4 lg:space-x-8 lg:ml-[410px] md:ml-auto">
          <Link
            to="/camper-rental"
            className="text-gray-700 hover:text-gray-100 text-sm font-medium whitespace-nowrap"
          >
            {t("camper_rental")}
          </Link>
          <Link
            to="/travelshop"
            className="text-gray-700 hover:text-gray-100 text-sm font-medium whitespace-nowrap"
          >
            {t("Travelshop")}
          </Link>
          <a
            href="https://calendly.com/hallo-waureisen/austausch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-100 text-sm font-medium whitespace-nowrap"
          >
            {t("book_appointment")}
          </a>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              if (isLoggedIn) {
                navigate("/host");
              } else {
                navigate("/signup?redirect=host");
              }
            }}
            className="text-gray-700 hover:text-gray-100 text-sm font-medium whitespace-nowrap"
          >
            {t("register_accommodation")}
          </Link>
        </div>)
        }

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 sm:gap-4 mr-2 sm:mr-4 md:mr-8">
          {/* Language Button */}
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-300 rounded-full"
              onClick={() => setIsLanguagePopupOpen(!isLanguagePopupOpen)}
            >
              <Globe className="h-6 w-6 text-gray-700" />
            </button>

            {isLanguagePopupOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLanguagePopupOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-[300px] bg-white rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-md font-semibold">
                        {t("language_region")}
                      </h2>
                      <button
                        onClick={() => setIsLanguagePopupOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <button
                        onClick={() => handleLanguageSelect("en")}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          language === "en" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => handleLanguageSelect("de")}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          language === "de" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        Deutsch
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Menu Button - Only show for customers and providers, not for admins */}
          {shouldShowMenuIcon && (
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-300 rounded-full relative"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <>
                    <Menu className="h-6 w-6 text-gray-700" />
                    {/* Notification dot */}
                    {unreadMessageCount > 0 && (
                      <span className="absolute top-0 right-0 h-3 w-3 bg-[#B4A481] rounded-full"></span>
                    )}
                  </>
                )}
              </button>

              {/* Menu Dropdown */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-1 px-1 z-50">
                    {/* Mobile Navigation Links */}
                    <div className="md:hidden border-b border-gray-200 mb-1 pb-1">
                      <Link
                        to="/camper-rental"
                        className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        {t("camper_rental")}
                      </Link>
                      <Link
                        to="/travelshop"
                        className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        {t("travelshop")}
                      </Link>
                      <a
                        href="https://meet.brevo.com/waureisen"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        {t("book_appointment")}
                      </a>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (isLoggedIn) {
                            navigate("/host");
                          } else {
                            navigate("/signup?redirect=host");
                          }
                        }}
                        className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        {t("register_accommodation")}
                      </Link>
                    </div>

                    {/* Menu Items based on user type */}
                    {getMenuItems().map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={item.onClick}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                      >
                        {item.icon}
                        <span className="text-gray-700">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-brand text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Profile Button */}
          <div className="relative">
            <button
              className="rounded-full flex items-center justify-center overflow-hidden p-0"
              style={{
                backgroundColor:
                  currentUser?.profilePicture && !profileImageError
                    ? "transparent"
                    : "#B4A481",
                width: "40px",
                height: "40px",
              }}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              {isLoggedIn &&
              currentUser &&
              currentUser.profilePicture &&
              !profileImageError ? (
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  // onError={(e) => {
                  //   console.error("Profile image load error:", e);
                  //   setProfileImageError(true);
                  // }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
            </button>

            {/* Profile Menu Popup */}
            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 py-1">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        <span>{t("log_in")}</span>
                      </Link>
                      <Link
                        to="/signup"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        <span>{t("sign_up")}</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      {currentUser && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center">
                            <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {currentUser.profilePicture &&
                              !profileImageError ? (
                                <img
                                  src={currentUser.profilePicture}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    //console.error(
                                    //  "Profile image load error:",
                                    //  e
                                    //);
                                    setProfileImageError(true);
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-medium text-sm text-gray-800 truncate">
                                {currentUser.firstName ||
                                  currentUser.name ||
                                  "User"}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {currentUser.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>{t("log_out")}</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;