// import React, { useState, useEffect, useCallback } from "react";
// import { router } from '@inertiajs/react';
// import parse from 'html-react-parser';

// const InscriptionPage = ({ inscription }) => {
//     const [activeTab, setActiveTab] = useState("Description");
//     const [selectedImage, setSelectedImage] = useState(0);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//     const [imageLoading, setImageLoading] = useState(true);
//     const [visibleThumbnails, setVisibleThumbnails] = useState(5);
//     const [bannerError, setBannerError] = useState(false);
//     const [mainImageError, setMainImageError] = useState(false);
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const tabs = [
//         "Description",
//         "Background",
//         "Text",
//         "Translation",
//         "References",
//         "Glossary",
//     ];

//     // Update visible thumbnails based on screen size
//     useEffect(() => {
//         const updateVisibleThumbnails = () => {
//             if (window.innerWidth < 768) {
//                 setVisibleThumbnails(3);
//             } else if (window.innerWidth < 1024) {
//                 setVisibleThumbnails(4);
//             } else {
//                 setVisibleThumbnails(5);
//             }
//         };

//         updateVisibleThumbnails();
//         window.addEventListener("resize", updateVisibleThumbnails);

//         return () =>
//             window.removeEventListener("resize", updateVisibleThumbnails);
//     }, []);

//     const handlePrevSlide = useCallback(() => {
//         if (currentSlide > 0) {
//             setCurrentSlide((prev) => prev - 1);
//         }
//     }, [currentSlide]);

//     const handleNextSlide = useCallback(() => {
//         if (!inscription?.images) return;
        
//         const maxSlide = Math.max(0, inscription.images.length - visibleThumbnails);
//         if (currentSlide < maxSlide) {
//             setCurrentSlide((prev) => prev + 1);
//         }
//     }, [currentSlide, inscription?.images?.length, visibleThumbnails]);

//     const handleThumbnailClick = useCallback(
//         (index) => {
//             setSelectedImage(index);
//             setMainImageError(false); // Reset error when changing images

//             // Ensure the clicked thumbnail is visible in the swiper
//             const maxStartIndex = Math.max(
//                 0,
//                 (inscription?.images?.length || 0) - visibleThumbnails,
//             );
//             let newSlide = currentSlide;

//             if (index > currentSlide + visibleThumbnails - 1) {
//                 newSlide = Math.min(
//                     maxStartIndex,
//                     index - visibleThumbnails + 1,
//                 );
//             } else if (index < currentSlide) {
//                 newSlide = Math.max(0, index);
//             }

//             setCurrentSlide(newSlide);
//         },
//         [currentSlide, inscription?.images?.length, visibleThumbnails],
//     );

//     useEffect(() => {
//         // Reset loading state and error when image changes
//         setImageLoading(true);
//         setMainImageError(false);
//     }, [selectedImage]);

//     // Reset banner error when inscription changes
//     useEffect(() => {
//         setBannerError(false);
//     }, [inscription]);

//     const handleVideoPlay = () => {
//         setIsVideoPlaying(true);
//     };

//     const handleVideoPause = () => {
//         setIsVideoPlaying(false);
//     };

//     // Calculate thumbnail width percentage based on visible thumbnails
//     const thumbnailWidth = 100 / visibleThumbnails;

//     // Helper function to get full image URL
//     const getImageUrl = (path) => {
//         if (!path) return "";
//         // If it's already a full URL (like placeholder images), return as-is
//         if (path.startsWith('http')) return path;
//         // For stored images, prepend the storage URL
//         return `${imgurl}/${path}`;
//     };

//     // Helper function to get full video URL
//     const getVideoUrl = (path) => {
//         if (!path) return "";
//         if (path.startsWith('http')) return path;
//         return `/storage/${path}`;
//     };

//     // Helper function to safely parse HTML content
//     const renderHtmlContent = (htmlString, defaultText = "No content available.") => {
//         if (!htmlString || htmlString.trim() === '') {
//             return <p className="text-gray-500 italic">{defaultText}</p>;
//         }
        
//         try {
//             return parse(htmlString);
//         } catch (error) {
//             console.error('Error parsing HTML:', error);
//             return <p className="text-red-500">Error displaying content. Please check the format.</p>;
//         }
//     };

//     // Check if banner image exists and is valid
//     const hasValidBanner = inscription?.banner_image && !bannerError;
    
//     // Check if main image exists and is valid
//     const hasValidMainImage = inscription?.images && 
//                              inscription.images.length > 0 && 
//                              inscription.images[selectedImage]?.image_path && 
//                              !mainImageError;

//     // If inscription is not available (shouldn't happen with Inertia, but just in case)
//     if (!inscription) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
//                 <div className="text-center p-8 max-w-md">
//                     <div className="text-red-500 text-6xl mb-4">⚠️</div>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
//                     <p className="text-gray-600 mb-6">Inscription not found</p>
//                     <button
//                         onClick={() => window.history.back()}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         Go Back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//             {/* Hero Section */}
//             <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
//                 {hasValidBanner ? (
//                     <>
//                         <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 z-10" />
//                         <img
//                             alt={inscription.title || "Licchavi Inscription"}
//                             className="w-full h-full object-cover object-center transition-all duration-1000 hover:scale-105"
//                             src={getImageUrl(inscription.banner_image)}
//                             loading="eager"
//                             onError={() => setBannerError(true)}
//                         />
//                     </>
//                 ) : (
//                     /* Fallback UI when no banner image is available */
//                     <div className="w-full h-full flex items-center justify-center bg-white">
//                         <div className="absolute inset-0 bg-black/80 z-10" />
//                         <div className="relative z-20 text-center">
//                             <svg 
//                                 className="w-24 h-24 mx-auto mb-4 text-gray-400" 
//                                 fill="none" 
//                                 stroke="currentColor" 
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path 
//                                     strokeLinecap="round" 
//                                     strokeLinejoin="round" 
//                                     strokeWidth={1.5} 
//                                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
//                                 />
//                             </svg>
//                             <p className="text-gray-300 text-lg">No banner image available</p>
//                         </div>
//                     </div>
//                 )}
                
//                 {/* Title overlay - always visible regardless of banner image */}
//                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
//                     <div className=" backdrop-blur-sm  p-6 md:p-8">
//                         <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 drop-shadow-2xl">
//                             {inscription.title || "A Licchavi Inscription"}
//                         </h1>
//                         <p className="text-white/90 text-center text-lg md:text-xl font-light">
//                             {inscription.inscription_number ? `Inscription ID: ${inscription.inscription_number}` : "Historical Stone Inscription"} • Licchavi Period
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
//                 {/* Image Gallery Section */}
//                 <div className="mb-12">
//                     {/* Thumbnail Swiper - Only show if there are images */}
//                     {inscription.images && inscription.images.length > 0 && (
//                         <div className="relative mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//                             <div className="overflow-hidden">
//                                 <div
//                                     className="flex transition-transform duration-300 ease-out"
//                                     style={{
//                                         transform: `translateX(-${currentSlide * thumbnailWidth}%)`,
//                                     }}
//                                 >
//                                     {inscription.images.map((image, index) => (
//                                         <div
//                                             key={image.id}
//                                             className="flex-shrink-0 px-2 cursor-pointer group"
//                                             style={{ width: `${thumbnailWidth}%` }}
//                                             onClick={() => handleThumbnailClick(index)}
//                                         >
//                                             <div
//                                                 className={`relative overflow-hidden rounded-lg transition-all duration-300 border-2 ${
//                                                     selectedImage === index
//                                                         ? "border-blue-500 shadow-lg transform scale-[1.02]"
//                                                         : "border-gray-200 hover:border-gray-300"
//                                                 }`}
//                                             >
//                                                 <img
//                                                     className="w-full h-32 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110"
//                                                     alt={image.alt_text || inscription.title}
//                                                     src={getImageUrl(image.image_path)}
//                                                     loading="lazy"
//                                                     onError={(e) => {
//                                                         e.target.src = "/images/fallback.png";
//                                                     }}
//                                                 />
//                                                 {selectedImage === index && (
//                                                     <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg"></div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Navigation Buttons - Only show if there are enough thumbnails */}
//                             {inscription.images.length > visibleThumbnails && (
//                                 <>
//                                     <button
//                                         onClick={handlePrevSlide}
//                                         disabled={currentSlide === 0}
//                                         className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 ${
//                                             currentSlide === 0
//                                                 ? "opacity-30 cursor-not-allowed"
//                                                 : "hover:bg-gray-50 hover:border-gray-300"
//                                         }`}
//                                         aria-label="Previous thumbnails"
//                                     >
//                                         <svg
//                                             className="w-4 h-4 md:w-5 md:h-5 text-gray-800"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M15 19l-7-7 7-7"
//                                             />
//                                         </svg>
//                                     </button>

//                                     <button
//                                         onClick={handleNextSlide}
//                                         disabled={
//                                             currentSlide >=
//                                             inscription.images.length - visibleThumbnails
//                                         }
//                                         className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 ${
//                                             currentSlide >=
//                                             inscription.images.length - visibleThumbnails
//                                                 ? "opacity-30 cursor-not-allowed"
//                                                 : "hover:bg-gray-50 hover:border-gray-300"
//                                         }`}
//                                         aria-label="Next thumbnails"
//                                     >
//                                         <svg
//                                             className="w-4 h-4 md:w-5 md:h-5 text-gray-800"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M9 5l7 7-7 7"
//                                             />
//                                         </svg>
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     )}

//                     {/* Main Image and Video Grid */}
//                     <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
//                         {/* Selected Image */}
//                         <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
//                             <div className="relative h-[400px]">
//                                 {imageLoading && hasValidMainImage && (
//                                     <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//                                         <div className="flex flex-col items-center">
//                                             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-500 mb-3"></div>
//                                             <p className="text-gray-500 text-sm">
//                                                 Loading image...
//                                             </p>
//                                         </div>
//                                     </div>
//                                 )}
                                
//                                 {hasValidMainImage ? (
//                                     <img
//                                         alt="Selected inscription detail"
//                                         className={`w-full h-full object-contain bg-gray-50 transition-all duration-500 ${
//                                             imageLoading ? "opacity-0" : "opacity-100"
//                                         }`}
//                                         src={getImageUrl(inscription.images[selectedImage]?.image_path)}
//                                         onLoad={() => setImageLoading(false)}
//                                         onError={() => {
//                                             setMainImageError(true);
//                                             setImageLoading(false);
//                                         }}
//                                     />
//                                 ) : (
//                                     /* Fallback UI when no main image is available */
//                                     <div className="w-full h-full flex items-center justify-center bg-black/80">
//                                         <div className="text-center">
//                                             <svg 
//                                                 className="w-20 h-20 mx-auto mb-4 text-gray-400" 
//                                                 fill="none" 
//                                                 stroke="currentColor" 
//                                                 viewBox="0 0 24 24"
//                                             >
//                                                 <path 
//                                                     strokeLinecap="round" 
//                                                     strokeLinejoin="round" 
//                                                     strokeWidth={1.5} 
//                                                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
//                                                 />
//                                             </svg>
//                                             <p className="text-gray-300 text-lg">No image available</p>
//                                             {inscription.images && inscription.images.length > 0 && (
//                                                 <p className="text-gray-400 text-sm mt-2">Image failed to load</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}
                                
//                                 {/* Image counter - only show if there are images */}
//                                 {inscription.images && inscription.images.length > 0 && (
//                                     <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow border border-gray-200">
//                                         <span className="text-blue-600 font-bold">
//                                             {selectedImage + 1}
//                                         </span>
//                                         <span className="mx-2 text-gray-400">/</span>
//                                         <span>{inscription.images.length}</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Video */}
//                         <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
//                             <div className="relative h-[400px]">
//                                 {inscription.video ? (
//                                     <video
//                                         src={getVideoUrl(inscription.video)}
//                                         controls
//                                         className="w-full h-full object-cover bg-gray-900"
//                                         onPlay={handleVideoPlay}
//                                         poster={`${imgurl}/${inscription?.video_banner}`}
//                                         onPause={handleVideoPause}
//                                         preload="metadata"
//                                     >
//                                         Your browser does not support the video tag.
//                                     </video>
//                                 ) : (
//                                     <div className="w-full h-full flex items-center justify-center bg-black/80">
//                                         <div className="text-center">
//                                             <svg 
//                                                 className="w-20 h-20 mx-auto mb-4 text-gray-400" 
//                                                 fill="none" 
//                                                 stroke="currentColor" 
//                                                 viewBox="0 0 24 24"
//                                             >
//                                                 <path 
//                                                     strokeLinecap="round" 
//                                                     strokeLinejoin="round" 
//                                                     strokeWidth={1.5} 
//                                                     d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
//                                                 />
//                                             </svg>
//                                             <p className="text-gray-300 text-lg">No video available</p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tabs and Content */}
//                 <div className="max-w-5xl mx-auto mb-4 py-4">
//                     {/* Tab Navigation */}
//                     <div className="flex flex-wrap gap-8 border-b">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab}
//                                 onClick={() => setActiveTab(tab)}
//                                 className={`text-md font-bold transition px-4 py-2 rounded ${
//                                     activeTab === tab
//                                         ? "bg-black text-white"
//                                         : "text-black hover:text-black"
//                                 }`}
//                             >
//                                 {tab}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Tab Content */}
//                     <div className="py-6 text-black font-medium leading-relaxed text-md sm:text-lg prose prose-lg max-w-none">
//                         {activeTab === "Description" && (
//                             <div>
//                                 {renderHtmlContent(inscription.description, "No description available.")}
//                                 {inscription.inscription_number && (
//                                     <p className="mt-4"><strong>Inscription ID:</strong> {inscription.inscription_number}</p>
//                                 )}
//                             </div>
//                         )}
//                         {activeTab === "Background" && (
//                             <div>
//                                 {renderHtmlContent(inscription.background, "No background information available.")}
//                             </div>
//                         )}
//                         {activeTab === "Text" && (
//                             <div>
//                                 {renderHtmlContent(inscription.text, "No text available.")}
//                             </div>
//                         )}
//                         {activeTab === "Translation" && (
//                             <div>
//                                 {renderHtmlContent(inscription.translation, "No translation available.")}
//                             </div>
//                         )}
//                         {activeTab === "References" && (
//                             <div>
//                                 {renderHtmlContent(inscription.references, "No references available.")}
//                             </div>
//                         )}
//                         {activeTab === "Glossary" && (
//                             <div>
//                                 {renderHtmlContent(inscription.glossary, "No glossary available.")}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InscriptionPage;



import React, { useState, useEffect, useCallback } from "react";
import { router } from '@inertiajs/react';
import parse from 'html-react-parser';
import { ChevronDown } from 'lucide-react';

const InscriptionPage = ({ inscription }) => {
    const [activeTab, setActiveTab] = useState("Description");
    const [selectedImage, setSelectedImage] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [visibleThumbnails, setVisibleThumbnails] = useState(5);
    const [bannerError, setBannerError] = useState(false);
    const [mainImageError, setMainImageError] = useState(false);
    
    // Language state for each tab individually
    const [tabLanguages, setTabLanguages] = useState({
        Description: "romanized",
        Background: "romanized",
        Text: "romanized",
        Translation: "romanized",
        References: "romanized",
        Glossary: "romanized"
    });
    
    const [openDropdown, setOpenDropdown] = useState(null);
    
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const tabs = [
        "Description",
        "Background",
        "Text",
        "Translation",
        "References",
        "Glossary",
    ];

    // Update visible thumbnails based on screen size
    useEffect(() => {
        const updateVisibleThumbnails = () => {
            if (window.innerWidth < 768) {
                setVisibleThumbnails(3);
            } else if (window.innerWidth < 1024) {
                setVisibleThumbnails(4);
            } else {
                setVisibleThumbnails(5);
            }
        };

        updateVisibleThumbnails();
        window.addEventListener("resize", updateVisibleThumbnails);

        return () =>
            window.removeEventListener("resize", updateVisibleThumbnails);
    }, []);

    const handlePrevSlide = useCallback(() => {
        if (currentSlide > 0) {
            setCurrentSlide((prev) => prev - 1);
        }
    }, [currentSlide]);

    const handleNextSlide = useCallback(() => {
        if (!inscription?.images) return;
        
        const maxSlide = Math.max(0, inscription.images.length - visibleThumbnails);
        if (currentSlide < maxSlide) {
            setCurrentSlide((prev) => prev + 1);
        }
    }, [currentSlide, inscription?.images?.length, visibleThumbnails]);

    const handleThumbnailClick = useCallback(
        (index) => {
            setSelectedImage(index);
            setMainImageError(false);

            const maxStartIndex = Math.max(
                0,
                (inscription?.images?.length || 0) - visibleThumbnails,
            );
            let newSlide = currentSlide;

            if (index > currentSlide + visibleThumbnails - 1) {
                newSlide = Math.min(
                    maxStartIndex,
                    index - visibleThumbnails + 1,
                );
            } else if (index < currentSlide) {
                newSlide = Math.max(0, index);
            }

            setCurrentSlide(newSlide);
        },
        [currentSlide, inscription?.images?.length, visibleThumbnails],
    );

    useEffect(() => {
        setImageLoading(true);
        setMainImageError(false);
    }, [selectedImage]);

    useEffect(() => {
        setBannerError(false);
    }, [inscription]);

    const handleVideoPlay = () => {
        setIsVideoPlaying(true);
    };

    const handleVideoPause = () => {
        setIsVideoPlaying(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && !event.target.closest('.language-dropdown')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    // Calculate thumbnail width percentage based on visible thumbnails
    const thumbnailWidth = 100 / visibleThumbnails;

    // Helper function to get full image URL
    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        return `${imgurl}/${path}`;
    };

    // Helper function to get full video URL
    const getVideoUrl = (path) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        return `/storage/${path}`;
    };

    // Get language for current tab
    const getCurrentLanguage = () => {
        return tabLanguages[activeTab] || "romanized";
    };

    // Set language for a specific tab
    const setTabLanguage = (tab, language) => {
        setTabLanguages(prev => ({
            ...prev,
            [tab]: language
        }));
    };

    // Get content based on tab and language
    const getTabContent = () => {
        const language = getCurrentLanguage();
        
        switch (activeTab) {
            case "Description":
                if (language === "devanagari") {
                    return inscription.dev_description || inscription.description || "No description available.";
                }
                return inscription.description || inscription.dev_description || "No description available.";
            case "Background":
                if (language === "devanagari") {
                    return inscription.dev_background || inscription.background || "No background information available.";
                }
                return inscription.background || inscription.dev_background || "No background information available.";
            case "Text":
                if (language === "devanagari") {
                    return inscription.dev_text || inscription.text || "No text available.";
                }
                return inscription.text || inscription.dev_text || "No text available.";
            case "Translation":
                if (language === "devanagari") {
                    return inscription.dev_translation || inscription.translation || "No translation available.";
                }
                return inscription.translation || inscription.dev_translation || "No translation available.";
            case "References":
                if (language === "devanagari") {
                    return inscription.dev_references || inscription.references || "No references available.";
                }
                return inscription.references || inscription.dev_references || "No references available.";
            case "Glossary":
                if (language === "devanagari") {
                    return inscription.dev_glossary || inscription.glossary || "No glossary available.";
                }
                return inscription.glossary || inscription.dev_glossary || "No glossary available.";
            default:
                return "No content available.";
        }
    };

    // Check if Devanagari content exists for a specific tab
    const hasDevanagariContent = (tab) => {
        switch (tab) {
            case "Description":
                return !!inscription.dev_description;
            case "Background":
                return !!inscription.dev_background;
            case "Text":
                return !!inscription.dev_text;
            case "Translation":
                return !!inscription.dev_translation;
            case "References":
                return !!inscription.dev_references;
            case "Glossary":
                return !!inscription.dev_glossary;
            default:
                return false;
        }
    };

    // Check if Romanized content exists for a specific tab
    const hasRomanizedContent = (tab) => {
        switch (tab) {
            case "Description":
                return !!inscription.description;
            case "Background":
                return !!inscription.background;
            case "Text":
                return !!inscription.text;
            case "Translation":
                return !!inscription.translation;
            case "References":
                return !!inscription.references;
            case "Glossary":
                return !!inscription.glossary;
            default:
                return false;
        }
    };

    // Helper function to safely parse HTML content
    const renderHtmlContent = (htmlString) => {
        if (!htmlString || htmlString.trim() === '') {
            return <p className="text-gray-500 italic">No content available.</p>;
        }
        
        try {
            return parse(htmlString);
        } catch (error) {
            console.error('Error parsing HTML:', error);
            return <p className="text-red-500">Error displaying content. Please check the format.</p>;
        }
    };

    // Toggle dropdown for a specific tab
    const toggleDropdown = (tab) => {
        if (openDropdown === tab) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(tab);
        }
    };

    // Check if banner image exists and is valid
    const hasValidBanner = inscription?.banner_image && !bannerError;
    
    // Check if main image exists and is valid
    const hasValidMainImage = inscription?.images && 
                             inscription.images.length > 0 && 
                             inscription.images[selectedImage]?.image_path && 
                             !mainImageError;

    // If inscription is not available
    if (!inscription) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center p-8 max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">Inscription not found</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                {hasValidBanner ? (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 z-10" />
                        <img
                            alt={inscription.title || "Licchavi Inscription"}
                            className="w-full h-full object-cover object-center transition-all duration-1000 hover:scale-105"
                            src={getImageUrl(inscription.banner_image)}
                            loading="eager"
                            onError={() => setBannerError(true)}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white">
                        <div className="absolute inset-0 bg-black/80 z-10" />
                        <div className="relative z-20 text-center">
                            <svg 
                                className="w-24 h-24 mx-auto mb-4 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                />
                            </svg>
                            <p className="text-gray-300 text-lg">No banner image available</p>
                        </div>
                    </div>
                )}
                
                {/* Title overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
                    <div className="backdrop-blur-sm p-6 md:p-8">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 drop-shadow-2xl">
                            {inscription.title || "A Licchavi Inscription"}
                        </h1>
                        <p className="text-white/90 text-center text-lg md:text-xl font-light">
                            {inscription.inscription_number ? `Inscription ID: ${inscription.inscription_number}` : "Historical Stone Inscription"} • Licchavi Period
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Image Gallery Section */}
                <div className="mb-12">
                    {/* Thumbnail Swiper */}
                    {inscription.images && inscription.images.length > 0 && (
                        <div className="relative mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-300 ease-out"
                                    style={{
                                        transform: `translateX(-${currentSlide * thumbnailWidth}%)`,
                                    }}
                                >
                                    {inscription.images.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="flex-shrink-0 px-2 cursor-pointer group"
                                            style={{ width: `${thumbnailWidth}%` }}
                                            onClick={() => handleThumbnailClick(index)}
                                        >
                                            <div
                                                className={`relative overflow-hidden rounded-lg transition-all duration-300 border-2 ${
                                                    selectedImage === index
                                                        ? "border-blue-500 shadow-lg transform scale-[1.02]"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <img
                                                    className="w-full h-32 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt={image.alt_text || inscription.title}
                                                    src={getImageUrl(image.image_path)}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = "/images/fallback.png";
                                                    }}
                                                />
                                                {selectedImage === index && (
                                                    <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            {inscription.images.length > visibleThumbnails && (
                                <>
                                    <button
                                        onClick={handlePrevSlide}
                                        disabled={currentSlide === 0}
                                        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 ${
                                            currentSlide === 0
                                                ? "opacity-30 cursor-not-allowed"
                                                : "hover:bg-gray-50 hover:border-gray-300"
                                        }`}
                                        aria-label="Previous thumbnails"
                                    >
                                        <svg
                                            className="w-4 h-4 md:w-5 md:h-5 text-gray-800"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={handleNextSlide}
                                        disabled={
                                            currentSlide >=
                                            inscription.images.length - visibleThumbnails
                                        }
                                        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 ${
                                            currentSlide >=
                                            inscription.images.length - visibleThumbnails
                                                ? "opacity-30 cursor-not-allowed"
                                                : "hover:bg-gray-50 hover:border-gray-300"
                                        }`}
                                        aria-label="Next thumbnails"
                                    >
                                        <svg
                                            className="w-4 h-4 md:w-5 md:h-5 text-gray-800"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Main Image and Video Grid */}
                    <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Selected Image */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
                            <div className="relative h-[400px]">
                                {imageLoading && hasValidMainImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                        <div className="flex flex-col items-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-500 mb-3"></div>
                                            <p className="text-gray-500 text-sm">
                                                Loading image...
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                {hasValidMainImage ? (
                                    <img
                                        alt="Selected inscription detail"
                                        className={`w-full h-full object-contain bg-gray-50 transition-all duration-500 ${
                                            imageLoading ? "opacity-0" : "opacity-100"
                                        }`}
                                        src={getImageUrl(inscription.images[selectedImage]?.image_path)}
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => {
                                            setMainImageError(true);
                                            setImageLoading(false);
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black/80">
                                        <div className="text-center">
                                            <svg 
                                                className="w-20 h-20 mx-auto mb-4 text-gray-400" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={1.5} 
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                                />
                                            </svg>
                                            <p className="text-gray-300 text-lg">No image available</p>
                                            {inscription.images && inscription.images.length > 0 && (
                                                <p className="text-gray-400 text-sm mt-2">Image failed to load</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {inscription.images && inscription.images.length > 0 && (
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow border border-gray-200">
                                        <span className="text-blue-600 font-bold">
                                            {selectedImage + 1}
                                        </span>
                                        <span className="mx-2 text-gray-400">/</span>
                                        <span>{inscription.images.length}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Video */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
                            <div className="relative h-[400px]">
                                {inscription.video ? (
                                    <video
                                        src={getVideoUrl(inscription.video)}
                                        controls
                                        className="w-full h-full object-cover bg-gray-900"
                                        onPlay={handleVideoPlay}
                                        poster={inscription?.video_banner ? `${imgurl}/${inscription.video_banner}` : undefined}
                                        onPause={handleVideoPause}
                                        preload="metadata"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black/80">
                                        <div className="text-center">
                                            <svg 
                                                className="w-20 h-20 mx-auto mb-4 text-gray-400" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={1.5} 
                                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                                                />
                                            </svg>
                                            <p className="text-gray-300 text-lg">No video available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs and Content - Updated with dropdown next to each tab label */}
                <div className="max-w-5xl mx-auto mb-4 py-4">
                    {/* Tab Navigation with inline language selectors */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 mb-6">
                        {tabs.map((tab) => {
                            const currentLang = tabLanguages[tab] || "romanized";
                            const hasDev = hasDevanagariContent(tab);
                            const hasRom = hasRomanizedContent(tab);
                            
                            return (
                                <div key={tab} className="relative language-dropdown flex items-center">
                                    {/* Tab Button */}
                                    <button
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                                            activeTab === tab
                                                ? "text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                    
                                    {/* Language Dropdown Button - Small, next to tab label */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(tab);
                                        }}
                                        className={`ml-1 flex items-center gap-0.5 px-1.5 py-1 text-xs rounded transition-colors ${
                                            activeTab === tab
                                                ? "text-blue-500 hover:text-blue-700"
                                                : "text-gray-400 hover:text-gray-600"
                                        }`}
                                        aria-label="Select language"
                                    >
                                        <ChevronDown size={12} />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {openDropdown === tab && (
                                        <div className="absolute left-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                                            <button
                                                onClick={() => {
                                                    if (hasRom) {
                                                        setTabLanguage(tab, "romanized");
                                                        setOpenDropdown(null);
                                                        if (activeTab !== tab) setActiveTab(tab);
                                                    }
                                                }}
                                                disabled={!hasRom}
                                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${
                                                    currentLang === "romanized" 
                                                        ? "bg-blue-50 text-blue-600 font-medium" 
                                                        : "text-gray-700"
                                                } ${!hasRom ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                Romanized
                                                {!hasRom && <span className="text-gray-400 ml-1 text-xs">(unavailable)</span>}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (hasDev) {
                                                        setTabLanguage(tab, "devanagari");
                                                        setOpenDropdown(null);
                                                        if (activeTab !== tab) setActiveTab(tab);
                                                    }
                                                }}
                                                disabled={!hasDev}
                                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${
                                                    currentLang === "devanagari" 
                                                        ? "bg-blue-50 text-blue-600 font-medium" 
                                                        : "text-gray-700"
                                                } ${!hasDev ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                Devanagari
                                                {!hasDev && <span className="text-gray-400 ml-1 text-xs">(unavailable)</span>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-gray-700 font-medium leading-relaxed text-md sm:text-lg prose prose-lg max-w-none">
                            {renderHtmlContent(getTabContent())}
                            {activeTab === "Description" && inscription.inscription_number && (
                                <p className="mt-4 pt-4 border-t border-gray-100">
                                    <strong>Inscription ID:</strong> {inscription.inscription_number}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InscriptionPage;