// import {
//     X,
//     Camera,
//     Upload,
//     Video,
//     Image,
//     Trash2,
//     GripVertical,
//     Link,
// } from "lucide-react";
// import React, { useEffect, useState, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditInscriptionForm = ({
//     showForm,
//     setShowForm,
//     editingInscription,
//     setReloadTrigger,
// }) => {
//     const inputClass =
//         "w-full p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";

//     // File size limits in bytes (only for images now)
//     const MAX_IMAGE_SIZE = 150 * 1024 * 1024; // 150MB

//     // Quill modules configuration
//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ script: "sub" }, { script: "super" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             [{ direction: "rtl" }],
//             [{ size: ["small", false, "large", "huge"] }],
//             [{ color: [] }, { background: [] }],
//             [{ font: [] }],
//             [{ align: [] }],
//             ["link", "image", "video"],
//             ["clean"],
//         ],
//     };

//     const quillFormats = [
//         "header",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "list",
//         "bullet",
//         "indent",
//         "link",
//         "image",
//         "video",
//         "script",
//         "color",
//         "background",
//         "font",
//         "align",
//         "size",
//     ];

//     // Quill height configuration
//     const quillHeight = {
//         description: "250px",
//         background: "250px",
//         text: "250px",
//         translation: "250px",
//         references: "250px",
//         glossary: "250px",
//     };

//     // State for React Quill content
//     const [description, setDescription] = useState("");
//     const [background, setBackground] = useState("");
//     const [text, setText] = useState("");
//     const [translation, setTranslation] = useState("");
//     const [references, setReferences] = useState("");
//     const [glossary, setGlossary] = useState("");

//     const [bannerPreview, setBannerPreview] = useState(null);
//     const [bannerFile, setBannerFile] = useState(null);
//     const [existingImages, setExistingImages] = useState([]);
//     const [newImagesPreviews, setNewImagesPreviews] = useState([]);
//     const [newImageFiles, setNewImageFiles] = useState([]);
//     const [videoUrl, setVideoUrl] = useState("");
//     const [submitting, setSubmitting] = useState(false);
//     const [removingImageIds, setRemovingImageIds] = useState([]);
//     const [draggingImage, setDraggingImage] = useState(null);
//     const [dragOverIndex, setDragOverIndex] = useState(null);
//     const [autoSaving, setAutoSaving] = useState(false);

//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const {
//         register,
//         handleSubmit: handleFormSubmit,
//         formState: { errors },
//         reset,
//         setValue,
//         getValues,
//     } = useForm();

//     // Initialize form with editing data
//     useEffect(() => {
//         if (editingInscription) {
//             // Set form values
//             setValue("title", editingInscription.title);
//             setValue(
//                 "inscription_number",
//                 editingInscription.inscription_number,
//             );
//             setValue("status", editingInscription.status || "draft");

//             // Set Quill content values
//             setDescription(editingInscription.description || "");
//             setBackground(editingInscription.background || "");
//             setText(editingInscription.text || "");
//             setTranslation(editingInscription.translation || "");
//             setReferences(
//                 editingInscription.references ||
//                     editingInscription.refrences ||
//                     "",
//             );
//             setGlossary(editingInscription.glossary || "");

//             // Also set form values for validation
//             setValue("description", editingInscription.description || "");
//             setValue("background", editingInscription.background || "");
//             setValue("text", editingInscription.text || "");
//             setValue("translation", editingInscription.translation || "");
//             setValue(
//                 "references",
//                 editingInscription.references ||
//                     editingInscription.refrences ||
//                     "",
//             );
//             setValue("glossary", editingInscription.glossary || "");

//             // Set previews for existing files
//             if (editingInscription.banner_image) {
//                 setBannerPreview(
//                     `${imgurl}/${editingInscription.banner_image}`,
//                 );
//             }

//             // Set video URL from existing video
//             if (editingInscription.video) {
//                 setVideoUrl(editingInscription.video);
//                 setValue("video", editingInscription.video);
//             }

//             // Set existing images with sort_order
//             if (
//                 editingInscription.images &&
//                 editingInscription.images.length > 0
//             ) {
//                 // Sort existing images by sort_order
//                 const sortedImages = [...editingInscription.images].sort(
//                     (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
//                 );
//                 setExistingImages(sortedImages);
//             }
//         } else {
//             resetForm();
//         }
//     }, [editingInscription, reset, setValue]);

//     // Handle Quill change functions
//     const handleDescriptionChange = (content) => {
//         setDescription(content);
//         setValue("description", content, { shouldValidate: true });
//     };

//     const handleBackgroundChange = (content) => {
//         setBackground(content);
//         setValue("background", content);
//     };

//     const handleTextChange = (content) => {
//         setText(content);
//         setValue("text", content);
//     };

//     const handleTranslationChange = (content) => {
//         setTranslation(content);
//         setValue("translation", content);
//     };

//     const handleReferencesChange = (content) => {
//         setReferences(content);
//         setValue("references", content);
//     };

//     const handleGlossaryChange = (content) => {
//         setGlossary(content);
//         setValue("glossary", content);
//     };

//     // Handle banner image change
//     const handleBannerChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Validate image file
//             if (!file.type.startsWith("image/")) {
//                 alert("Please select a valid image file");
//                 return;
//             }

//             // Validate file size (150MB max for images)
//             if (file.size > MAX_IMAGE_SIZE) {
//                 alert(
//                     `Banner image size should be less than 150MB (Current: ${formatFileSize(file.size)})`,
//                 );
//                 return;
//             }

//             setBannerFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setBannerPreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Handle multiple images change
//     const handleImagesChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length > 0) {
//             // Filter only image files
//             let imageFiles = files.filter((file) =>
//                 file.type.startsWith("image/"),
//             );

//             if (imageFiles.length !== files.length) {
//                 alert("Some files are not images and were ignored");
//             }

//             if (imageFiles.length > 0) {
//                 // Validate each file size (150MB max)
//                 const oversizedFiles = imageFiles.filter(
//                     (file) => file.size > MAX_IMAGE_SIZE,
//                 );
//                 if (oversizedFiles.length > 0) {
//                     alert(
//                         `${oversizedFiles.length} image(s) exceed 150MB limit and were ignored`,
//                     );
//                     imageFiles = imageFiles.filter(
//                         (file) => file.size <= MAX_IMAGE_SIZE,
//                     );
//                 }

//                 const newFiles = [...imageFiles];
//                 setNewImageFiles((prev) => [...prev, ...newFiles]);

//                 // Create previews for new files with temporary sort_order
//                 newFiles.forEach((file, index) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         const newPreview = {
//                             id: `new-${Date.now()}-${index}`,
//                             preview: reader.result,
//                             file: file,
//                             sort_order:
//                                 newImagesPreviews.length +
//                                 existingImages.length +
//                                 index,
//                         };
//                         setNewImagesPreviews((prev) => [...prev, newPreview]);
//                     };
//                     reader.readAsDataURL(file);
//                 });
//             }
//         }
//     };

//     // Handle video URL input
//     const handleVideoUrlChange = (e) => {
//         const url = e.target.value;
//         setVideoUrl(url);
//         setValue("video", url);
//     };

//     // Drag and drop handlers for existing images
//     const handleDragStart = useCallback((e, index, type) => {
//         e.dataTransfer.setData("text/plain", JSON.stringify({ index, type }));
//         setDraggingImage({ index, type });
//         e.currentTarget.classList.add("opacity-50");
//     }, []);

//     const handleDragOver = useCallback((e, index, type) => {
//         e.preventDefault();
//         setDragOverIndex({ index, type });
//     }, []);

//     const handleDragEnd = useCallback((e) => {
//         e.preventDefault();
//         setDraggingImage(null);
//         setDragOverIndex(null);
//         e.currentTarget.classList.remove("opacity-50");
//     }, []);

//     const handleDrop = useCallback(
//         (e, dropIndex, dropType) => {
//             e.preventDefault();
//             const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//             const { index: dragIndex, type: dragType } = data;

//             if (dragType === dropType) {
//                 if (dragType === "existing") {
//                     // Reorder existing images
//                     const updatedImages = [...existingImages];
//                     const [draggedItem] = updatedImages.splice(dragIndex, 1);
//                     updatedImages.splice(dropIndex, 0, draggedItem);

//                     // Update sort_order based on new position
//                     const reorderedImages = updatedImages.map((img, idx) => ({
//                         ...img,
//                         sort_order: idx + 1,
//                     }));

//                     setExistingImages(reorderedImages);
//                     // Auto-save after reordering existing images
//                     handleAutoSave(reorderedImages, newImagesPreviews);
//                 } else if (dragType === "new") {
//                     // Reorder new images
//                     const updatedPreviews = [...newImagesPreviews];
//                     const [draggedItem] = updatedPreviews.splice(dragIndex, 1);
//                     updatedPreviews.splice(dropIndex, 0, draggedItem);

//                     // Update sort_order based on new position
//                     const reorderedPreviews = updatedPreviews.map(
//                         (preview, idx) => ({
//                             ...preview,
//                             sort_order: existingImages.length + idx + 1,
//                         }),
//                     );

//                     setNewImagesPreviews(reorderedPreviews);

//                     // Also reorder files array
//                     const updatedFiles = [...newImageFiles];
//                     const [draggedFile] = updatedFiles.splice(dragIndex, 1);
//                     updatedFiles.splice(dropIndex, 0, draggedFile);
//                     setNewImageFiles(updatedFiles);
//                 }
//             }

//             setDraggingImage(null);
//             setDragOverIndex(null);
//         },
//         [existingImages, newImagesPreviews, newImageFiles],
//     );

//     // Auto-save function for image deletions and reordering
//     const handleAutoSave = async (updatedExistingImages = existingImages, updatedNewImages = newImagesPreviews) => {
//         try {
//             setAutoSaving(true);

//             const formData = new FormData();

//             // Get current form values
//             const formValues = getValues();

//             // Append all text fields
//             Object.keys(formValues).forEach((key) => {
//                 if (
//                     formValues[key] !== undefined &&
//                     formValues[key] !== null &&
//                     formValues[key] !== ""
//                 ) {
//                     formData.append(key, formValues[key]);
//                 }
//             });

//             // Add sort_order data for existing images
//             updatedExistingImages.forEach((img, index) => {
//                 formData.append(`existing_image_sort[${img.id}]`, index + 1);
//             });

//             // Add sort_order for new images
//             updatedNewImages.forEach((preview, index) => {
//                 formData.append(
//                     `new_image_sort[${index}]`,
//                     updatedExistingImages.length + index + 1,
//                 );
//             });

//             // Append removed image IDs
//             removingImageIds.forEach((id) => {
//                 formData.append("removed_image_ids[]", id);
//             });

//             // Append video URL
//             if (videoUrl !== undefined) {
//                 formData.append("video", videoUrl);
//             }

//             formData.append("_method", "PUT");

//             await axios.post(
//                 route("ourinscription.update", editingInscription.id),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );

//             // Clear removing image IDs after successful save
//             setRemovingImageIds([]);

//             // Trigger reload to refresh the parent component
//             setReloadTrigger((prev) => !prev);

//             // Show success message
//             setTimeout(() => {
//                 setAutoSaving(false);
//             }, 1000);

//         } catch (error) {
//             console.error("Auto-save error:", error);
//             alert("Failed to save changes. Please try again.");
//             setAutoSaving(false);
//         }
//     };

//     // Remove existing image with auto-save
//     const handleRemoveExistingImage = async (imageId) => {
//         // Add to removing list for UI feedback
//         setRemovingImageIds((prev) => [...prev, imageId]);

//         // Remove from UI immediately
//         const updatedImages = existingImages.filter((img) => img.id !== imageId);
//         setExistingImages(updatedImages);

//         // Auto-save the change
//         await handleAutoSave(updatedImages);
//     };

//     // Remove new image
//     const handleRemoveNewImage = (index) => {
//         setNewImagesPreviews((prev) => prev.filter((_, i) => i !== index));
//         setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
//         // Note: New images aren't saved until final submit
//     };

//     // Handle Update Inscription
//     const handleUpdate = async (formData) => {
//         try {
//             // Add sort_order data for existing images
//             existingImages.forEach((img, index) => {
//                 formData.append(`existing_image_sort[${img.id}]`, index + 1);
//             });

//             // Add sort_order for new images
//             newImagesPreviews.forEach((preview, index) => {
//                 formData.append(
//                     `new_image_sort[${index}]`,
//                     existingImages.length + index + 1,
//                 );
//             });

//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourinscription.update", editingInscription.id),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                     timeout: 1200000, // 20 minutes timeout for large file uploads
//                     onUploadProgress: (progressEvent) => {
//                         const percentCompleted = Math.round(
//                             (progressEvent.loaded * 100) / progressEvent.total,
//                         );
//                         console.log(`Upload progress: ${percentCompleted}%`);
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating inscription", error);
//             throw error;
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Validate banner image size (150MB)
//         if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) {
//             alert(
//                 `Banner image size exceeds 150MB limit (Current: ${formatFileSize(bannerFile.size)})`,
//             );
//             return;
//         }

//         // Validate all new images size (150MB each)
//         const oversizedImages = newImageFiles.filter(
//             (file) => file.size > MAX_IMAGE_SIZE,
//         );
//         if (oversizedImages.length > 0) {
//             alert(
//                 `${oversizedImages.length} image(s) exceed 150MB limit. Please remove them.`,
//             );
//             return;
//         }

//         const formData = new FormData();

//         // Append all text fields
//         Object.keys(data).forEach((key) => {
//             if (
//                 data[key] !== undefined &&
//                 data[key] !== null &&
//                 data[key] !== ""
//             ) {
//                 formData.append(key, data[key]);
//             }
//         });

//         // Append banner file if changed
//         if (bannerFile) {
//             formData.append("banner_image", bannerFile);
//         }

//         // Append video URL (always, even if empty)
//         if (videoUrl !== undefined) {
//             formData.append("video", videoUrl);
//         }

//         // Append new images
//         newImageFiles.forEach((file, index) => {
//             formData.append(`images[${index}]`, file);
//         });

//         // Append removed image IDs
//         removingImageIds.forEach((id) => {
//             formData.append("removed_image_ids[]", id);
//         });

//         try {
//             setSubmitting(true);

//             const result = await handleUpdate(formData);

//             if (result.success) {
//                 resetForm();
//                 alert(result.message || "Inscription updated successfully!");
//                 setShowForm(false);
//             } else {
//                 alert(result.message || "Failed to update inscription");
//             }
//         } catch (error) {
//             const errorMessage =
//                 error.response?.data?.message ||
//                 error.response?.data?.errors?.images?.[0] ||
//                 error.response?.data?.errors?.video?.[0] ||
//                 error.response?.data?.errors?.banner_image?.[0] ||
//                 error.response?.data?.errors?.inscription_number?.[0] ||
//                 "Error updating inscription";
//             alert(errorMessage);
//             console.error("Submission error:", error.response?.data);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Reset form function
//     const resetForm = () => {
//         reset();
//         setDescription("");
//         setBackground("");
//         setText("");
//         setTranslation("");
//         setReferences("");
//         setGlossary("");
//         setBannerPreview(null);
//         setBannerFile(null);
//         setExistingImages([]);
//         setNewImagesPreviews([]);
//         setNewImageFiles([]);
//         setVideoUrl("");
//         setRemovingImageIds([]);
//         setDraggingImage(null);
//         setDragOverIndex(null);
//         setAutoSaving(false);
//     };

//     // Handle close form
//     const handleClose = () => {
//         resetForm();
//         setShowForm(false);
//     };

//     // Format file size
//     const formatFileSize = (bytes) => {
//         if (bytes === 0) return "0 Bytes";
//         const k = 1024;
//         const sizes = ["Bytes", "KB", "MB", "GB"];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//     };

//     // Custom Quill CSS
//     const quillStyle = (field) => ({
//         backgroundColor: "white",
//         color: "#333",
//         borderRadius: "0.375rem",
//         border: "1px solid #d1d5db",
//         height: quillHeight[field] || "200px",
//     });

//     // Function to check if URL is a video
//     const isVideoUrl = (url) => {
//         if (!url) return false;
//         const videoExtensions = [
//             ".mp4",
//             ".avi",
//             ".mov",
//             ".wmv",
//             ".flv",
//             ".mkv",
//             ".webm",
//             ".mpg",
//             ".mpeg",
//         ];
//         return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
//     };

//     // Function to get video URL for preview
//     const getVideoPreviewUrl = (url) => {
//         if (!url) return null;
//         if (url.startsWith("http") || url.startsWith("blob:")) {
//             return url;
//         }
//         // If it's a storage path, prepend the image URL
//         return `${imgurl}/${url}`;
//     };

//     return (
//         <div
//             className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}
//         >
//             <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
//                 {/* Content */}
//                 <div className="h-full flex flex-col px-4 sm:px-6 py-4 sm:py-6 text-gray-800">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <div>
//                             <h2 className="text-xl sm:text-2xl font-bold">
//                                 Edit Inscription
//                             </h2>
//                             {autoSaving && (
//                                 <p className="text-xs text-green-600 mt-1">
//                                     Saving changes...
//                                 </p>
//                             )}
//                         </div>
//                         <button
//                             onClick={handleClose}
//                             className="hover:text-red-500"
//                             type="button"
//                         >
//                             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//                         </button>
//                     </div>

//                     {/* Scrollable Form */}
//                     <div className="overflow-y-auto flex-1 pr-2 space-y-4 sm:space-y-6">
//                         <form
//                             onSubmit={handleFormSubmit(onSubmit)}
//                             className="space-y-4 sm:space-y-6"
//                         >
//                             {/* Title */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Title *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className={`${inputClass} ${errors.title ? "border-2 border-red-500" : ""}`}
//                                     {...register("title", {
//                                         required: "Title is required",
//                                         minLength: {
//                                             value: 3,
//                                             message:
//                                                 "Title must be at least 3 characters",
//                                         },
//                                     })}
//                                 />
//                                 {errors.title && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.title.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Inscription Number */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Inscription Number *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className={`${inputClass} ${errors.inscription_number ? "border-2 border-red-500" : ""}`}
//                                     {...register("inscription_number", {
//                                         required:
//                                             "Inscription number is required",
//                                         minLength: {
//                                             value: 1,
//                                             message:
//                                                 "Inscription number must be at least 1 character",
//                                         },
//                                     })}
//                                 />
//                                 {errors.inscription_number && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.inscription_number.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Status */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Status *
//                                 </label>
//                                 <select
//                                     className={`${inputClass} ${errors.status ? "border-2 border-red-500" : ""}`}
//                                     {...register("status", {
//                                         required: "Status is required",
//                                     })}
//                                 >
//                                     <option value="draft">Draft</option>
//                                     <option value="published">Published</option>
//                                 </select>
//                                 {errors.status && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.status.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Banner Image */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <Camera
//                                         className="mr-2 sm:mr-3 text-gray-600"
//                                         size={20}
//                                     />
//                                     Banner Image (Single)
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {bannerPreview ? (
//                                         <div className="space-y-3 sm:space-y-4">
//                                             <div className="relative inline-block">
//                                                 <img
//                                                     src={bannerPreview}
//                                                     alt="Banner Preview"
//                                                     className="mx-auto h-32 sm:h-40 w-full object-cover rounded-lg shadow-lg bg-white"
//                                                 />
//                                                 {bannerFile && (
//                                                     <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
//                                                         New
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <p className="text-sm text-gray-600">
//                                                 Click to change image
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Max size: 150MB
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-3 sm:space-y-4">
//                                             <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                                             <p className="text-sm sm:text-lg text-gray-700">
//                                                 Click to upload banner image
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Recommended: 1200x400px
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Max size: 150MB
//                                             </p>
//                                         </div>
//                                     )}
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleBannerChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Multiple Images */}
//                             <div className="space-y-2">
//                                 <label className="flex flex-col sm:flex-row sm:items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <div className="flex items-center">
//                                         <Image
//                                             className="mr-2 sm:mr-3 text-gray-600"
//                                             size={20}
//                                         />
//                                         Gallery Images (Drag to reorder)
//                                     </div>

//                                     <span className="mt-1 sm:mt-0 sm:ml-3 text-sm font-medium text-green-600">
//                                         Changes are saved automatically
//                                     </span>
//                                 </label>

//                                 {/* Existing Images */}
//                                 {existingImages.length > 0 && (
//                                     <div className="mb-4">
//                                         <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-2">
//                                             Existing Images
//                                         </h4>
//                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
//                                             {existingImages.map(
//                                                 (image, index) => (
//                                                     <div
//                                                         key={image.id}
//                                                         className={`relative group border-2 rounded-lg transition-all duration-200 ${
//                                                             dragOverIndex?.index ===
//                                                                 index &&
//                                                             dragOverIndex?.type ===
//                                                                 "existing"
//                                                                 ? "border-blue-500 bg-blue-50"
//                                                                 : "border-transparent"
//                                                         } ${
//                                                             draggingImage?.index ===
//                                                                 index &&
//                                                             draggingImage?.type ===
//                                                                 "existing"
//                                                                 ? "cursor-grabbing"
//                                                                 : "cursor-grab"
//                                                         }`}
//                                                         draggable
//                                                         onDragStart={(e) =>
//                                                             handleDragStart(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                         onDragOver={(e) =>
//                                                             handleDragOver(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                         onDragEnd={
//                                                             handleDragEnd
//                                                         }
//                                                         onDrop={(e) =>
//                                                             handleDrop(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                     >
//                                                         <div className="flex items-center justify-between p-2 bg-gray-50 rounded-t-lg border-b">
//                                                             <div className="flex items-center gap-2">
//                                                                 <GripVertical
//                                                                     className="text-gray-400 cursor-move"
//                                                                     size={14}
//                                                                 />
//                                                                 <span className="text-xs text-gray-600 font-medium">
//                                                                     Pos:{" "}
//                                                                     {index + 1}
//                                                                 </span>
//                                                             </div>
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     handleRemoveExistingImage(
//                                                                         image.id,
//                                                                     )
//                                                                 }
//                                                                 className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
//                                                                 title="Remove image (auto-saves)"
//                                                             >
//                                                                 <Trash2
//                                                                     size={12}
//                                                                 />
//                                                             </button>
//                                                         </div>
//                                                         <img
//                                                             src={`${imgurl}/${image.image_path}`}
//                                                             alt={`Existing image`}
//                                                             className="h-20 sm:h-24 w-full object-cover rounded-b-lg"
//                                                         />
//                                                         {removingImageIds.includes(
//                                                             image.id,
//                                                         ) && (
//                                                             <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
//                                                                 <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">
//                                                                     Removing...
//                                                                 </span>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 ),
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* New Images */}
//                                 {newImagesPreviews.length > 0 && (
//                                     <div className="mb-4">
//                                         <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-2">
//                                             New Images (Will be added after
//                                             existing)
//                                         </h4>
//                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
//                                             {newImagesPreviews.map(
//                                                 (preview, index) => (
//                                                     <div
//                                                         key={preview.id}
//                                                         className={`relative group border-2 rounded-lg transition-all duration-200 ${
//                                                             dragOverIndex?.index ===
//                                                                 index &&
//                                                             dragOverIndex?.type ===
//                                                                 "new"
//                                                                 ? "border-blue-500 bg-blue-50"
//                                                                 : "border-transparent"
//                                                         } ${
//                                                             draggingImage?.index ===
//                                                                 index &&
//                                                             draggingImage?.type ===
//                                                                 "new"
//                                                                 ? "cursor-grabbing"
//                                                                 : "cursor-grab"
//                                                         }`}
//                                                         draggable
//                                                         onDragStart={(e) =>
//                                                             handleDragStart(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                         onDragOver={(e) =>
//                                                             handleDragOver(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                         onDragEnd={
//                                                             handleDragEnd
//                                                         }
//                                                         onDrop={(e) =>
//                                                             handleDrop(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                     >
//                                                         <div className="flex items-center justify-between p-2 bg-blue-50 rounded-t-lg border-b border-blue-200">
//                                                             <div className="flex items-center gap-2">
//                                                                 <GripVertical
//                                                                     className="text-blue-400 cursor-move"
//                                                                     size={14}
//                                                                 />
//                                                                 <span className="text-xs text-blue-600 font-medium">
//                                                                     Pos:{" "}
//                                                                     {existingImages.length +
//                                                                         index +
//                                                                         1}
//                                                                 </span>
//                                                             </div>
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     handleRemoveNewImage(
//                                                                         index,
//                                                                     )
//                                                                 }
//                                                                 className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
//                                                                 title="Remove image"
//                                                             >
//                                                                 <Trash2
//                                                                     size={12}
//                                                                 />
//                                                             </button>
//                                                         </div>
//                                                         <img
//                                                             src={
//                                                                 preview.preview
//                                                             }
//                                                             alt={`New image ${index + 1}`}
//                                                             className="h-20 sm:h-24 w-full object-cover rounded-b-lg"
//                                                         />
//                                                         <div className="absolute bottom-1 right-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs">
//                                                             New
//                                                         </div>
//                                                     </div>
//                                                 ),
//                                             )}
//                                         </div>
//                                         <p className="text-sm text-gray-600 mb-2">
//                                             Note: New images will be saved when
//                                             you click "Update Inscription"
//                                         </p>
//                                     </div>
//                                 )}

//                                 {/* Images Upload Area */}
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     <div className="space-y-3 sm:space-y-4">
//                                         <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                                         <div>
//                                             <p className="text-sm sm:text-lg text-gray-700">
//                                                 Click to upload multiple images
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Hold Ctrl/Cmd to select multiple
//                                                 files
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Max size: 150MB per file
//                                             </p>
//                                         </div>
//                                         {existingImages.length +
//                                             newImagesPreviews.length >
//                                             0 && (
//                                             <div className="mt-4">
//                                                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
//                                                     <span className="text-sm font-medium text-gray-700">
//                                                         Total Images:{" "}
//                                                         {existingImages.length +
//                                                             newImagesPreviews.length}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={handleImagesChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Video URL Input */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <Link
//                                         className="mr-2 sm:mr-3 text-gray-600"
//                                         size={20}
//                                     />
//                                     Video URL
//                                 </label>
//                                 <div className="space-y-4">
//                                     <div className="relative">
//                                         <input
//                                             type="url"
//                                             value={videoUrl}
//                                             onChange={handleVideoUrlChange}
//                                             placeholder="Enter video URL (e.g., inscriptions/videos/filename.mp4)"
//                                             className={`${inputClass} pr-10`}
//                                         />
//                                         <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//                                     </div>

//                                     {videoUrl && isVideoUrl(videoUrl) && (
//                                         <div className="border rounded-lg p-4 bg-gray-50">
//                                             <p className="text-sm font-medium text-gray-700 mb-2">
//                                                 Video Preview:
//                                             </p>
//                                             <div className="relative">
//                                                 <video
//                                                     src={getVideoPreviewUrl(
//                                                         videoUrl,
//                                                     )}
//                                                     className="w-full h-40 sm:h-48 object-cover rounded-lg"
//                                                     controls
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Description *
//                                 </label>
//                                 <div
//                                     className={`rounded overflow-hidden ${errors.description ? "border-2 border-red-500" : ""}`}
//                                 >
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={description}
//                                         onChange={handleDescriptionChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={{
//                                             ...quillStyle("description"),
//                                             height: "200px",
//                                         }}
//                                         className="rounded h-full quill-custom"
//                                     />
//                                 </div>
//                                 <input
//                                     type="hidden"
//                                     {...register("description", {
//                                         required: "Description is required",
//                                         validate: (value) => {
//                                             const textOnly = value
//                                                 ?.replace(/<[^>]*>/g, "")
//                                                 .trim();
//                                             return (
//                                                 (textOnly &&
//                                                     textOnly.length >= 10) ||
//                                                 "Description must be at least 10 characters"
//                                             );
//                                         },
//                                     })}
//                                 />
//                                 {errors.description && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.description.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Background */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Background
//                                 </label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={background}
//                                         onChange={handleBackgroundChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={{
//                                             ...quillStyle("background"),
//                                             height: "200px",
//                                         }}
//                                         className="rounded h-full quill-custom"
//                                     />
//                                 </div>
//                                 <input
//                                     type="hidden"
//                                     {...register("background")}
//                                 />
//                             </div>

//                             {/* Text */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Text
//                                 </label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={text}
//                                         onChange={handleTextChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={{
//                                             ...quillStyle("text"),
//                                             height: "200px",
//                                         }}
//                                         className="rounded h-full quill-custom"
//                                     />
//                                 </div>
//                                 <input type="hidden" {...register("text")} />
//                             </div>

//                             {/* Translation */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Translation
//                                 </label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={translation}
//                                         onChange={handleTranslationChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={{
//                                             ...quillStyle("translation"),
//                                             height: "200px",
//                                         }}
//                                         className="rounded h-full quill-custom"
//                                     />
//                                 </div>
//                                 <input
//                                     type="hidden"
//                                     {...register("translation")}
//                                 />
//                             </div>

//                             {/* References */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     References
//                                 </label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={references}
//                                         onChange={handleReferencesChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={{
//                                             ...quillStyle("references"),
//                                             height: "200px",
//                                         }}
//                                         className="rounded h-full quill-custom"
//                                     />
//                                 </div>
//                                 <input
//                                     type="hidden"
//                                     {...register("references")}
//                                 />
//                             </div>

//                             {/* Glossary */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Glossary
//                                 </label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={glossary}
//                                         onChange={handleGlossaryChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={{
//                                             ...quillStyle("glossary"),
//                                             height: "200px",
//                                         }}
//                                         className="rounded h-full quill-custom"
//                                     />
//                                 </div>
//                                 <input
//                                     type="hidden"
//                                     {...register("glossary")}
//                                 />
//                             </div>

//                             {/* Submit Button */}
//                             <div className="pt-4">
//                                 <button
//                                     type="submit"
//                                     disabled={submitting || autoSaving}
//                                     className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-base sm:text-lg ${submitting || autoSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
//                                 >
//                                     {submitting
//                                         ? "Updating..."
//                                         : autoSaving
//                                         ? "Saving changes..."
//                                         : "Update Inscription"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditInscriptionForm;



// import {
//     X,
//     Camera,
//     Upload,
//     Video,
//     Image,
//     Trash2,
//     GripVertical,
//     Link,
// } from "lucide-react";
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditInscriptionForm = ({
//     showForm,
//     setShowForm,
//     editingInscription,
//     setReloadTrigger,
// }) => {
//     const inputClass =
//         "w-full p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";

//     // File size limits in bytes (only for images now)
//     const MAX_IMAGE_SIZE = 150 * 1024 * 1024; // 150MB

//     // Quill modules configuration
//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ script: "sub" }, { script: "super" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             [{ direction: "rtl" }],
//             [{ size: ["small", false, "large", "huge"] }],
//             [{ color: [] }, { background: [] }],
//             [{ font: [] }],
//             [{ align: [] }],
//             ["link", "image", "video"],
//             ["clean"],
//         ],
//     };

//     const quillFormats = [
//         "header",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "list",
//         "bullet",
//         "indent",
//         "link",
//         "image",
//         "video",
//         "script",
//         "color",
//         "background",
//         "font",
//         "align",
//         "size",
//     ];

//     // Quill placeholder configurations
//     const quillPlaceholders = {
//         description:
//             "Enter the description in list format (• Point 1, • Point 2, • Point 3)...",

//         background: "Enter the background information in paragraph format...",

//         text: "Enter the original text in numbered format (1. First line, 2. Second line, 3. Third line)...",

//         translation:
//             "Enter the translation in list format (• Line 1 meaning, • Line 2 meaning)...",

//         references:
//             "Enter references in list format (• Book name, • Author, • URL, etc.)...",

//         glossary:
//             "Enter glossary terms in list format (• Term – Explanation)...",
//     };

//     // Refs to track Quill editor heights
//     const quillRefs = {
//         description: useRef(null),
//         background: useRef(null),
//         text: useRef(null),
//         translation: useRef(null),
//         references: useRef(null),
//         glossary: useRef(null),
//     };

//     const [bannerPreview, setBannerPreview] = useState(null);
//     const [bannerFile, setBannerFile] = useState(null);
//     const [existingImages, setExistingImages] = useState([]);
//     const [newImagesPreviews, setNewImagesPreviews] = useState([]);
//     const [newImageFiles, setNewImageFiles] = useState([]);
//     const [videoUrl, setVideoUrl] = useState("");
//     const [submitting, setSubmitting] = useState(false);
//     const [removingImageIds, setRemovingImageIds] = useState([]);
//     const [draggingImage, setDraggingImage] = useState(null);
//     const [dragOverIndex, setDragOverIndex] = useState(null);
//     const [autoSaving, setAutoSaving] = useState(false);

//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const {
//         register,
//         handleSubmit: handleFormSubmit,
//         control,
//         formState: { errors },
//         reset,
//         setValue,
//         getValues,
//     } = useForm();

//     // Effect to adjust Quill editor heights based on content
//     useEffect(() => {
//         const adjustQuillHeight = (field) => {
//             const editor = quillRefs[field]?.current;
//             if (editor) {
//                 const quillEditor = editor.getEditor();
//                 const editorContainer = quillEditor.root;

//                 // Reset to auto height first
//                 editorContainer.style.height = "auto";

//                 // Calculate content height
//                 const contentHeight = editorContainer.scrollHeight;

//                 // Set minimum height and add some padding
//                 const minHeight = 150; // Minimum height in pixels
//                 const newHeight = Math.max(contentHeight, minHeight);

//                 // Limit maximum height
//                 const maxHeight = 500; // Maximum height in pixels
//                 editorContainer.style.height = `${Math.min(newHeight, maxHeight)}px`;

//                 // Update Quill instance
//                 quillEditor.setSelection(null);
//             }
//         };

//         // Adjust all Quill editors after content changes
//         const timeoutId = setTimeout(() => {
//             Object.keys(quillRefs).forEach((field) => {
//                 adjustQuillHeight(field);
//             });
//         }, 100);

//         return () => clearTimeout(timeoutId);
//     }, [Object.values(quillRefs).map(ref => ref.current)]);

//     // Initialize form with editing data
//     useEffect(() => {
//         if (editingInscription) {
//             // Set form values
//             setValue("title", editingInscription.title);
//             setValue(
//                 "inscription_number",
//                 editingInscription.inscription_number,
//             );
//             setValue("status", editingInscription.status || "draft");

//             // Set Quill content values in form
//             setValue("description", editingInscription.description || "");
//             setValue("background", editingInscription.background || "");
//             setValue("text", editingInscription.text || "");
//             setValue("translation", editingInscription.translation || "");
//             setValue(
//                 "references",
//                 editingInscription.references ||
//                     editingInscription.refrences ||
//                     "",
//             );
//             setValue("glossary", editingInscription.glossary || "");

//             // Set previews for existing files
//             if (editingInscription.banner_image) {
//                 setBannerPreview(
//                     `${imgurl}/${editingInscription.banner_image}`,
//                 );
//             }

//             // Set video URL from existing video
//             if (editingInscription.video) {
//                 setVideoUrl(editingInscription.video);
//                 setValue("video", editingInscription.video);
//             }

//             // Set existing images with sort_order
//             if (
//                 editingInscription.images &&
//                 editingInscription.images.length > 0
//             ) {
//                 // Sort existing images by sort_order
//                 const sortedImages = [...editingInscription.images].sort(
//                     (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
//                 );
//                 setExistingImages(sortedImages);
//             }
//         } else {
//             resetForm();
//         }
//     }, [editingInscription, reset, setValue]);

//     // Handle banner image change
//     const handleBannerChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Validate image file
//             if (!file.type.startsWith("image/")) {
//                 alert("Please select a valid image file");
//                 return;
//             }

//             // Validate file size (150MB max for images)
//             if (file.size > MAX_IMAGE_SIZE) {
//                 alert(
//                     `Banner image size should be less than 150MB (Current: ${formatFileSize(file.size)})`,
//                 );
//                 return;
//             }

//             setBannerFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setBannerPreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Handle multiple images change
//     const handleImagesChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length > 0) {
//             // Filter only image files
//             let imageFiles = files.filter((file) =>
//                 file.type.startsWith("image/"),
//             );

//             if (imageFiles.length !== files.length) {
//                 alert("Some files are not images and were ignored");
//             }

//             if (imageFiles.length > 0) {
//                 // Validate each file size (150MB max)
//                 const oversizedFiles = imageFiles.filter(
//                     (file) => file.size > MAX_IMAGE_SIZE,
//                 );
//                 if (oversizedFiles.length > 0) {
//                     alert(
//                         `${oversizedFiles.length} image(s) exceed 150MB limit and were ignored`,
//                     );
//                     imageFiles = imageFiles.filter(
//                         (file) => file.size <= MAX_IMAGE_SIZE,
//                     );
//                 }

//                 const newFiles = [...imageFiles];
//                 setNewImageFiles((prev) => [...prev, ...newFiles]);

//                 // Create previews for new files with temporary sort_order
//                 newFiles.forEach((file, index) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         const newPreview = {
//                             id: `new-${Date.now()}-${index}`,
//                             preview: reader.result,
//                             file: file,
//                             sort_order:
//                                 newImagesPreviews.length +
//                                 existingImages.length +
//                                 index,
//                         };
//                         setNewImagesPreviews((prev) => [...prev, newPreview]);
//                     };
//                     reader.readAsDataURL(file);
//                 });
//             }
//         }
//     };

//     // Handle video URL input
//     const handleVideoUrlChange = (e) => {
//         const url = e.target.value;
//         setVideoUrl(url);
//         setValue("video", url);
//     };

//     // Drag and drop handlers for existing images
//     const handleDragStart = useCallback((e, index, type) => {
//         e.dataTransfer.setData("text/plain", JSON.stringify({ index, type }));
//         setDraggingImage({ index, type });
//         e.currentTarget.classList.add("opacity-50");
//     }, []);

//     const handleDragOver = useCallback((e, index, type) => {
//         e.preventDefault();
//         setDragOverIndex({ index, type });
//     }, []);

//     const handleDragEnd = useCallback((e) => {
//         e.preventDefault();
//         setDraggingImage(null);
//         setDragOverIndex(null);
//         e.currentTarget.classList.remove("opacity-50");
//     }, []);

//     const handleDrop = useCallback(
//         (e, dropIndex, dropType) => {
//             e.preventDefault();
//             const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//             const { index: dragIndex, type: dragType } = data;

//             if (dragType === dropType) {
//                 if (dragType === "existing") {
//                     // Reorder existing images
//                     const updatedImages = [...existingImages];
//                     const [draggedItem] = updatedImages.splice(dragIndex, 1);
//                     updatedImages.splice(dropIndex, 0, draggedItem);

//                     // Update sort_order based on new position
//                     const reorderedImages = updatedImages.map((img, idx) => ({
//                         ...img,
//                         sort_order: idx + 1,
//                     }));

//                     setExistingImages(reorderedImages);
//                     // Auto-save after reordering existing images
//                     handleAutoSave(reorderedImages, newImagesPreviews);
//                 } else if (dragType === "new") {
//                     // Reorder new images
//                     const updatedPreviews = [...newImagesPreviews];
//                     const [draggedItem] = updatedPreviews.splice(dragIndex, 1);
//                     updatedPreviews.splice(dropIndex, 0, draggedItem);

//                     // Update sort_order based on new position
//                     const reorderedPreviews = updatedPreviews.map(
//                         (preview, idx) => ({
//                             ...preview,
//                             sort_order: existingImages.length + idx + 1,
//                         }),
//                     );

//                     setNewImagesPreviews(reorderedPreviews);

//                     // Also reorder files array
//                     const updatedFiles = [...newImageFiles];
//                     const [draggedFile] = updatedFiles.splice(dragIndex, 1);
//                     updatedFiles.splice(dropIndex, 0, draggedFile);
//                     setNewImageFiles(updatedFiles);
//                 }
//             }

//             setDraggingImage(null);
//             setDragOverIndex(null);
//         },
//         [existingImages, newImagesPreviews, newImageFiles],
//     );

//     // Auto-save function for image deletions and reordering
//     const handleAutoSave = async (
//         updatedExistingImages = existingImages,
//         updatedNewImages = newImagesPreviews,
//     ) => {
//         try {
//             setAutoSaving(true);

//             const formData = new FormData();

//             // Get current form values
//             const formValues = getValues();

//             // Append all text fields
//             Object.keys(formValues).forEach((key) => {
//                 if (
//                     formValues[key] !== undefined &&
//                     formValues[key] !== null &&
//                     formValues[key] !== ""
//                 ) {
//                     formData.append(key, formValues[key]);
//                 }
//             });

//             // Add sort_order data for existing images
//             updatedExistingImages.forEach((img, index) => {
//                 formData.append(`existing_image_sort[${img.id}]`, index + 1);
//             });

//             // Add sort_order for new images
//             updatedNewImages.forEach((preview, index) => {
//                 formData.append(
//                     `new_image_sort[${index}]`,
//                     updatedExistingImages.length + index + 1,
//                 );
//             });

//             // Append removed image IDs
//             removingImageIds.forEach((id) => {
//                 formData.append("removed_image_ids[]", id);
//             });

//             // Append video URL
//             if (videoUrl !== undefined) {
//                 formData.append("video", videoUrl);
//             }

//             formData.append("_method", "PUT");

//             await axios.post(
//                 route("ourinscription.update", editingInscription.id),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );

//             // Clear removing image IDs after successful save
//             setRemovingImageIds([]);

//             // Trigger reload to refresh the parent component
//             setReloadTrigger((prev) => !prev);

//             // Show success message
//             setTimeout(() => {
//                 setAutoSaving(false);
//             }, 1000);
//         } catch (error) {
//             console.error("Auto-save error:", error);
//             alert("Failed to save changes. Please try again.");
//             setAutoSaving(false);
//         }
//     };

//     // Remove existing image with auto-save
//     const handleRemoveExistingImage = async (imageId) => {
//         // Add to removing list for UI feedback
//         setRemovingImageIds((prev) => [...prev, imageId]);

//         // Remove from UI immediately
//         const updatedImages = existingImages.filter(
//             (img) => img.id !== imageId,
//         );
//         setExistingImages(updatedImages);

//         // Auto-save the change
//         await handleAutoSave(updatedImages);
//     };

//     // Remove new image
//     const handleRemoveNewImage = (index) => {
//         setNewImagesPreviews((prev) => prev.filter((_, i) => i !== index));
//         setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
//         // Note: New images aren't saved until final submit
//     };

//     // Handle Update Inscription
//     const handleUpdate = async (formData) => {
//         try {
//             // Add sort_order data for existing images
//             existingImages.forEach((img, index) => {
//                 formData.append(`existing_image_sort[${img.id}]`, index + 1);
//             });

//             // Add sort_order for new images
//             newImagesPreviews.forEach((preview, index) => {
//                 formData.append(
//                     `new_image_sort[${index}]`,
//                     existingImages.length + index + 1,
//                 );
//             });

//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourinscription.update", editingInscription.id),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                     timeout: 1200000, // 20 minutes timeout for large file uploads
//                     onUploadProgress: (progressEvent) => {
//                         const percentCompleted = Math.round(
//                             (progressEvent.loaded * 100) / progressEvent.total,
//                         );
//                         console.log(`Upload progress: ${percentCompleted}%`);
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating inscription", error);
//             throw error;
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Validate banner image size (150MB)
//         if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) {
//             alert(
//                 `Banner image size exceeds 150MB limit (Current: ${formatFileSize(bannerFile.size)})`,
//             );
//             return;
//         }

//         // Validate all new images size (150MB each)
//         const oversizedImages = newImageFiles.filter(
//             (file) => file.size > MAX_IMAGE_SIZE,
//         );
//         if (oversizedImages.length > 0) {
//             alert(
//                 `${oversizedImages.length} image(s) exceed 150MB limit. Please remove them.`,
//             );
//             return;
//         }

//         const formData = new FormData();

//         // Append all text fields
//         Object.keys(data).forEach((key) => {
//             if (
//                 data[key] !== undefined &&
//                 data[key] !== null &&
//                 data[key] !== ""
//             ) {
//                 formData.append(key, data[key]);
//             }
//         });

//         // Append banner file if changed
//         if (bannerFile) {
//             formData.append("banner_image", bannerFile);
//         }

//         // Append video URL (always, even if empty)
//         if (videoUrl !== undefined) {
//             formData.append("video", videoUrl);
//         }

//         // Append new images
//         newImageFiles.forEach((file, index) => {
//             formData.append(`images[${index}]`, file);
//         });

//         // Append removed image IDs
//         removingImageIds.forEach((id) => {
//             formData.append("removed_image_ids[]", id);
//         });

//         try {
//             setSubmitting(true);

//             const result = await handleUpdate(formData);

//             if (result.success) {
//                 resetForm();
//                 alert(result.message || "Inscription updated successfully!");
//                 setShowForm(false);
//             } else {
//                 alert(result.message || "Failed to update inscription");
//             }
//         } catch (error) {
//             const errorMessage =
//                 error.response?.data?.message ||
//                 error.response?.data?.errors?.images?.[0] ||
//                 error.response?.data?.errors?.video?.[0] ||
//                 error.response?.data?.errors?.banner_image?.[0] ||
//                 error.response?.data?.errors?.inscription_number?.[0] ||
//                 "Error updating inscription";
//             alert(errorMessage);
//             console.error("Submission error:", error.response?.data);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Reset form function
//     const resetForm = () => {
//         reset();
//         setBannerPreview(null);
//         setBannerFile(null);
//         setExistingImages([]);
//         setNewImagesPreviews([]);
//         setNewImageFiles([]);
//         setVideoUrl("");
//         setRemovingImageIds([]);
//         setDraggingImage(null);
//         setDragOverIndex(null);
//         setAutoSaving(false);
//     };

//     // Handle close form
//     const handleClose = () => {
//         resetForm();
//         setShowForm(false);
//     };

//     // Format file size
//     const formatFileSize = (bytes) => {
//         if (bytes === 0) return "0 Bytes";
//         const k = 1024;
//         const sizes = ["Bytes", "KB", "MB", "GB"];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//     };

//     // Custom Quill CSS
//     const quillStyle = (field) => ({
//         backgroundColor: "white",
//         color: "#333",
//         borderRadius: "0.375rem",
//         border: "1px solid #d1d5db",
//         minHeight: "150px",
//         maxHeight: "500px",
//         overflow: "hidden",
//     });

//     // Function to check if URL is a video
//     const isVideoUrl = (url) => {
//         if (!url) return false;
//         const videoExtensions = [
//             ".mp4",
//             ".avi",
//             ".mov",
//             ".wmv",
//             ".flv",
//             ".mkv",
//             ".webm",
//             ".mpg",
//             ".mpeg",
//         ];
//         return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
//     };

//     // Function to get video URL for preview
//     const getVideoPreviewUrl = (url) => {
//         if (!url) return null;
//         if (url.startsWith("http") || url.startsWith("blob:")) {
//             return url;
//         }
//         // If it's a storage path, prepend the image URL
//         return `${imgurl}/${url}`;
//     };

//     return (
//         <div
//             className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}
//         >
//             <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
//                 {/* Content */}
//                 <div className="h-full flex flex-col px-4 sm:px-6 py-4 sm:py-6 text-gray-800">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <div>
//                             <h2 className="text-xl sm:text-2xl font-bold">
//                                 Edit Inscription
//                             </h2>
//                             {autoSaving && (
//                                 <p className="text-xs text-green-600 mt-1">
//                                     Saving changes...
//                                 </p>
//                             )}
//                         </div>
//                         <button
//                             onClick={handleClose}
//                             className="hover:text-red-500"
//                             type="button"
//                         >
//                             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//                         </button>
//                     </div>

//                     {/* Scrollable Form */}
//                     <div className="overflow-y-auto flex-1 pr-2 space-y-4 sm:space-y-6">
//                         <form
//                             onSubmit={handleFormSubmit(onSubmit)}
//                             className="space-y-4 sm:space-y-6"
//                         >
//                             {/* Title */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Title *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder="Enter inscription title"
//                                     className={`${inputClass} ${errors.title ? "border-2 border-red-500" : ""}`}
//                                     {...register("title", {
//                                         required: "Title is required",
//                                         minLength: {
//                                             value: 3,
//                                             message:
//                                                 "Title must be at least 3 characters",
//                                         },
//                                     })}
//                                 />
//                                 {errors.title && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.title.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Inscription Number */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Inscription Number *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder="INSN 00001"
//                                     className={`${inputClass} ${errors.inscription_number ? "border-2 border-red-500" : ""}`}
//                                     {...register("inscription_number", {
//                                         required:
//                                             "Inscription number is required",
//                                         minLength: {
//                                             value: 1,
//                                             message:
//                                                 "Inscription number must be at least 1 character",
//                                         },
//                                     })}
//                                 />
//                                 {errors.inscription_number && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.inscription_number.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Status */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Status *
//                                 </label>
//                                 <select
//                                     className={`${inputClass} ${errors.status ? "border-2 border-red-500" : ""}`}
//                                     {...register("status", {
//                                         required: "Status is required",
//                                     })}
//                                 >
//                                     <option value="draft">Draft</option>
//                                     <option value="published">Published</option>
//                                 </select>
//                                 {errors.status && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.status.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Banner Image */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <Camera
//                                         className="mr-2 sm:mr-3 text-gray-600"
//                                         size={20}
//                                     />
//                                     Banner Image (Single)
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {bannerPreview ? (
//                                         <div className="space-y-3 sm:space-y-4">
//                                             <div className="relative inline-block">
//                                                 <img
//                                                     src={bannerPreview}
//                                                     alt="Banner Preview"
//                                                     className="mx-auto h-32 sm:h-40 w-full object-cover rounded-lg shadow-lg bg-white"
//                                                 />
//                                                 {bannerFile && (
//                                                     <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
//                                                         New
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <p className="text-sm text-gray-600">
//                                                 Click to change image
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Max size: 150MB
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-3 sm:space-y-4">
//                                             <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                                             <p className="text-sm sm:text-lg text-gray-700">
//                                                 Click to upload banner image
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Recommended: 1200x400px
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Max size: 150MB
//                                             </p>
//                                         </div>
//                                     )}
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleBannerChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Multiple Images */}
//                             <div className="space-y-2">
//                                 <label className="flex flex-col sm:flex-row sm:items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <div className="flex items-center">
//                                         <Image
//                                             className="mr-2 sm:mr-3 text-gray-600"
//                                             size={20}
//                                         />
//                                         Gallery Images (Drag to reorder)
//                                     </div>

//                                     <span className="mt-1 sm:mt-0 sm:ml-3 text-sm font-medium text-green-600">
//                                         Changes are saved automatically
//                                     </span>
//                                 </label>

//                                 {/* Existing Images */}
//                                 {existingImages.length > 0 && (
//                                     <div className="mb-4">
//                                         <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-2">
//                                             Existing Images
//                                         </h4>
//                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
//                                             {existingImages.map(
//                                                 (image, index) => (
//                                                     <div
//                                                         key={image.id}
//                                                         className={`relative group border-2 rounded-lg transition-all duration-200 ${
//                                                             dragOverIndex?.index ===
//                                                                 index &&
//                                                             dragOverIndex?.type ===
//                                                                 "existing"
//                                                                 ? "border-blue-500 bg-blue-50"
//                                                                 : "border-transparent"
//                                                         } ${
//                                                             draggingImage?.index ===
//                                                                 index &&
//                                                             draggingImage?.type ===
//                                                                 "existing"
//                                                                 ? "cursor-grabbing"
//                                                                 : "cursor-grab"
//                                                         }`}
//                                                         draggable
//                                                         onDragStart={(e) =>
//                                                             handleDragStart(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                         onDragOver={(e) =>
//                                                             handleDragOver(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                         onDragEnd={
//                                                             handleDragEnd
//                                                         }
//                                                         onDrop={(e) =>
//                                                             handleDrop(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                     >
//                                                         <div className="flex items-center justify-between p-2 bg-gray-50 rounded-t-lg border-b">
//                                                             <div className="flex items-center gap-2">
//                                                                 <GripVertical
//                                                                     className="text-gray-400 cursor-move"
//                                                                     size={14}
//                                                                 />
//                                                                 <span className="text-xs text-gray-600 font-medium">
//                                                                     Pos:{" "}
//                                                                     {index + 1}
//                                                                 </span>
//                                                             </div>
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     handleRemoveExistingImage(
//                                                                         image.id,
//                                                                     )
//                                                                 }
//                                                                 className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
//                                                                 title="Remove image (auto-saves)"
//                                                             >
//                                                                 <Trash2
//                                                                     size={12}
//                                                                 />
//                                                             </button>
//                                                         </div>
//                                                         <img
//                                                             src={`${imgurl}/${image.image_path}`}
//                                                             alt={`Existing image`}
//                                                             className="h-20 sm:h-24 w-full object-cover rounded-b-lg"
//                                                         />
//                                                         {removingImageIds.includes(
//                                                             image.id,
//                                                         ) && (
//                                                             <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
//                                                                 <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">
//                                                                     Removing...
//                                                                 </span>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 ),
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* New Images */}
//                                 {newImagesPreviews.length > 0 && (
//                                     <div className="mb-4">
//                                         <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-2">
//                                             New Images (Will be added after
//                                             existing)
//                                         </h4>
//                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
//                                             {newImagesPreviews.map(
//                                                 (preview, index) => (
//                                                     <div
//                                                         key={preview.id}
//                                                         className={`relative group border-2 rounded-lg transition-all duration-200 ${
//                                                             dragOverIndex?.index ===
//                                                                 index &&
//                                                             dragOverIndex?.type ===
//                                                                 "new"
//                                                                 ? "border-blue-500 bg-blue-50"
//                                                                 : "border-transparent"
//                                                         } ${
//                                                             draggingImage?.index ===
//                                                                 index &&
//                                                             draggingImage?.type ===
//                                                                 "new"
//                                                                 ? "cursor-grabbing"
//                                                                 : "cursor-grab"
//                                                         }`}
//                                                         draggable
//                                                         onDragStart={(e) =>
//                                                             handleDragStart(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                         onDragOver={(e) =>
//                                                             handleDragOver(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                         onDragEnd={
//                                                             handleDragEnd
//                                                         }
//                                                         onDrop={(e) =>
//                                                             handleDrop(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                     >
//                                                         <div className="flex items-center justify-between p-2 bg-blue-50 rounded-t-lg border-b border-blue-200">
//                                                             <div className="flex items-center gap-2">
//                                                                 <GripVertical
//                                                                     className="text-blue-400 cursor-move"
//                                                                     size={14}
//                                                                 />
//                                                                 <span className="text-xs text-blue-600 font-medium">
//                                                                     Pos:{" "}
//                                                                     {existingImages.length +
//                                                                         index +
//                                                                         1}
//                                                                 </span>
//                                                             </div>
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     handleRemoveNewImage(
//                                                                         index,
//                                                                     )
//                                                                 }
//                                                                 className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
//                                                                 title="Remove image"
//                                                             >
//                                                                 <Trash2
//                                                                     size={12}
//                                                                 />
//                                                             </button>
//                                                         </div>
//                                                         <img
//                                                             src={
//                                                                 preview.preview
//                                                             }
//                                                             alt={`New image ${index + 1}`}
//                                                             className="h-20 sm:h-24 w-full object-cover rounded-b-lg"
//                                                         />
//                                                         <div className="absolute bottom-1 right-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs">
//                                                             New
//                                                         </div>
//                                                     </div>
//                                                 ),
//                                             )}
//                                         </div>
//                                         <p className="text-sm text-gray-600 mb-2">
//                                             Note: New images will be saved when
//                                             you click "Update Inscription"
//                                         </p>
//                                     </div>
//                                 )}

//                                 {/* Images Upload Area */}
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     <div className="space-y-3 sm:space-y-4">
//                                         <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                                         <div>
//                                             <p className="text-sm sm:text-lg text-gray-700">
//                                                 Click to upload multiple images
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Hold Ctrl/Cmd to select multiple
//                                                 files
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Max size: 150MB per file
//                                             </p>
//                                         </div>
//                                         {existingImages.length +
//                                             newImagesPreviews.length >
//                                             0 && (
//                                             <div className="mt-4">
//                                                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
//                                                     <span className="text-sm font-medium text-gray-700">
//                                                         Total Images:{" "}
//                                                         {existingImages.length +
//                                                             newImagesPreviews.length}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={handleImagesChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Video URL Input */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <Link
//                                         className="mr-2 sm:mr-3 text-gray-600"
//                                         size={20}
//                                     />
//                                     Video URL
//                                 </label>
//                                 <div className="space-y-4">
//                                     <div className="relative">
//                                         <input
//                                             type="url"
//                                             value={videoUrl}
//                                             onChange={handleVideoUrlChange}
//                                             placeholder="Enter video URL (e.g., https://yourdomain.com/storage/app/public/inscriptions/videos/filename.mp4)"
//                                             className={`${inputClass} pr-10`}
//                                         />
//                                         <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//                                     </div>

//                                     {videoUrl && isVideoUrl(videoUrl) && (
//                                         <div className="border rounded-lg p-4 bg-gray-50">
//                                             <p className="text-sm font-medium text-gray-700 mb-2">
//                                                 Video Preview:
//                                             </p>
//                                             <div className="relative">
//                                                 <video
//                                                     src={getVideoPreviewUrl(
//                                                         videoUrl,
//                                                     )}
//                                                     className="w-full h-40 sm:h-48 object-cover rounded-lg"
//                                                     controls
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Description *
//                                 </label>
//                                 <Controller
//                                     name="description"
//                                     control={control}
//                                     rules={{ required: "Description is required" }}
//                                     render={({ field }) => (
//                                         <div className={`rounded overflow-hidden ${errors.description ? "border-2 border-red-500" : ""}`}>
//                                             <ReactQuill
//                                                 ref={quillRefs.description}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("description")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={quillPlaceholders.description}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                                 {errors.description && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.description.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Background */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Background
//                                 </label>
//                                 <Controller
//                                     name="background"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.background}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("background")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={quillPlaceholders.background}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* Text */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Text
//                                 </label>
//                                 <Controller
//                                     name="text"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.text}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("text")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={quillPlaceholders.text}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* Translation */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Translation
//                                 </label>
//                                 <Controller
//                                     name="translation"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.translation}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("translation")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={quillPlaceholders.translation}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* References */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     References
//                                 </label>
//                                 <Controller
//                                     name="references"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.references}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("references")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={quillPlaceholders.references}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* Glossary */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Glossary
//                                 </label>
//                                 <Controller
//                                     name="glossary"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.glossary}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("glossary")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={quillPlaceholders.glossary}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* Submit Button */}
//                             <div className="pt-4">
//                                 <button
//                                     type="submit"
//                                     disabled={submitting || autoSaving}
//                                     className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-base sm:text-lg ${submitting || autoSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
//                                 >
//                                     {submitting
//                                         ? "Updating..."
//                                         : autoSaving
//                                           ? "Saving changes..."
//                                           : "Update Inscription"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditInscriptionForm;



//Important ///


// import {
//     X,
//     Camera,
//     Upload,
//     Video,
//     Image,
//     Trash2,
//     GripVertical,
//     Link,
//     Film,
// } from "lucide-react";
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditInscriptionForm = ({
//     showForm,
//     setShowForm,
//     editingInscription,
//     setReloadTrigger,
// }) => {
//     const inputClass =
//         "w-full p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";

//     // File size limits in bytes
//     const MAX_IMAGE_SIZE = 150 * 1024 * 1024; // 150MB

//     // Quill modules configuration
//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ script: "sub" }, { script: "super" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             [{ direction: "rtl" }],
//             [{ size: ["small", false, "large", "huge"] }],
//             [{ color: [] }, { background: [] }],
//             [{ font: [] }],
//             [{ align: [] }],
//             ["link", "image", "video"],
//             ["clean"],
//         ],
//     };

//     const quillFormats = [
//         "header",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "list",
//         "bullet",
//         "indent",
//         "link",
//         "image",
//         "video",
//         "script",
//         "color",
//         "background",
//         "font",
//         "align",
//         "size",
//     ];

//     // Quill placeholder configurations
//     const quillPlaceholders = {
//         description:
//             "Enter the description in list format (• Point 1, • Point 2, • Point 3)...",

//         background: "Enter the background information in paragraph format...",

//         text: "Enter the original text in numbered format (1. First line, 2. Second line, 3. Third line)...",

//         translation:
//             "Enter the translation in list format (• Line 1 meaning, • Line 2 meaning)...",

//         references:
//             "Enter references in list format (• Book name, • Author, • URL, etc.)...",

//         glossary:
//             "Enter glossary terms in list format (• Term – Explanation)...",
//     };

//     // Refs to track Quill editor heights
//     const quillRefs = {
//         description: useRef(null),
//         background: useRef(null),
//         text: useRef(null),
//         translation: useRef(null),
//         references: useRef(null),
//         glossary: useRef(null),
//     };

//     const [bannerPreview, setBannerPreview] = useState(null);
//     const [bannerFile, setBannerFile] = useState(null);
//     const [videoBannerPreview, setVideoBannerPreview] = useState(null);
//     const [videoBannerFile, setVideoBannerFile] = useState(null);
//     const [existingImages, setExistingImages] = useState([]);
//     const [newImagesPreviews, setNewImagesPreviews] = useState([]);
//     const [newImageFiles, setNewImageFiles] = useState([]);
//     const [videoUrl, setVideoUrl] = useState("");
//     const [submitting, setSubmitting] = useState(false);
//     const [removingImageIds, setRemovingImageIds] = useState([]);
//     const [draggingImage, setDraggingImage] = useState(null);
//     const [dragOverIndex, setDragOverIndex] = useState(null);
//     const [autoSaving, setAutoSaving] = useState(false);
//     const [deletingImageId, setDeletingImageId] = useState(null);

//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const {
//         register,
//         handleSubmit: handleFormSubmit,
//         control,
//         formState: { errors },
//         reset,
//         setValue,
//         getValues,
//     } = useForm();

//     // Effect to adjust Quill editor heights based on content
//     useEffect(() => {
//         const adjustQuillHeight = (field) => {
//             const editor = quillRefs[field]?.current;
//             if (editor) {
//                 const quillEditor = editor.getEditor();
//                 const editorContainer = quillEditor.root;

//                 // Reset to auto height first
//                 editorContainer.style.height = "auto";

//                 // Calculate content height
//                 const contentHeight = editorContainer.scrollHeight;

//                 // Set minimum height and add some padding
//                 const minHeight = 150; // Minimum height in pixels
//                 const newHeight = Math.max(contentHeight, minHeight);

//                 // Limit maximum height
//                 const maxHeight = 500; // Maximum height in pixels
//                 editorContainer.style.height = `${Math.min(newHeight, maxHeight)}px`;

//                 // Update Quill instance
//                 quillEditor.setSelection(null);
//             }
//         };

//         // Adjust all Quill editors after content changes
//         const timeoutId = setTimeout(() => {
//             Object.keys(quillRefs).forEach((field) => {
//                 adjustQuillHeight(field);
//             });
//         }, 100);

//         return () => clearTimeout(timeoutId);
//     }, [Object.values(quillRefs).map((ref) => ref.current)]);

//     // Initialize form with editing data
//     useEffect(() => {
//         if (editingInscription) {
//             // Set form values
//             setValue("title", editingInscription.title);
//             setValue(
//                 "inscription_number",
//                 editingInscription.inscription_number,
//             );
//             setValue("status", editingInscription.status || "draft");

//             // Set Quill content values in form
//             setValue("description", editingInscription.description || "");
//             setValue("background", editingInscription.background || "");
//             setValue("text", editingInscription.text || "");
//             setValue("translation", editingInscription.translation || "");
//             setValue(
//                 "references",
//                 editingInscription.references ||
//                     editingInscription.refrences ||
//                     "",
//             );
//             setValue("glossary", editingInscription.glossary || "");

//             // Set previews for existing files
//             if (editingInscription.banner_image) {
//                 setBannerPreview(
//                     `${imgurl}/${editingInscription.banner_image}`,
//                 );
//             }

//             // Set video banner preview if exists
//             if (editingInscription.video_banner) {
//                 setVideoBannerPreview(
//                     `${imgurl}/${editingInscription.video_banner}`,
//                 );
//             }

//             // Set video URL from existing video
//             if (editingInscription.video) {
//                 setVideoUrl(editingInscription.video);
//                 setValue("video", editingInscription.video);
//             }

//             // Set existing images with sort_order
//             if (
//                 editingInscription.images &&
//                 editingInscription.images.length > 0
//             ) {
//                 // Sort existing images by sort_order
//                 const sortedImages = [...editingInscription.images].sort(
//                     (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
//                 );
//                 setExistingImages(sortedImages);
//             }
//         } else {
//             resetForm();
//         }
//     }, [editingInscription, reset, setValue]);

//     // Handle banner image change
//     const handleBannerChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Validate image file
//             if (!file.type.startsWith("image/")) {
//                 alert("Please select a valid image file");
//                 return;
//             }

//             // Validate file size (150MB max for images)
//             if (file.size > MAX_IMAGE_SIZE) {
//                 alert(
//                     `Banner image size should be less than 150MB (Current: ${formatFileSize(file.size)})`,
//                 );
//                 return;
//             }

//             setBannerFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setBannerPreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Handle video banner image change
//     const handleVideoBannerChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Validate image file
//             if (!file.type.startsWith("image/")) {
//                 alert("Please select a valid image file");
//                 return;
//             }

//             // Validate file size (150MB max for images)
//             if (file.size > MAX_IMAGE_SIZE) {
//                 alert(
//                     `Video banner image size should be less than 150MB (Current: ${formatFileSize(file.size)})`,
//                 );
//                 return;
//             }

//             setVideoBannerFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setVideoBannerPreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Handle multiple images change
//     const handleImagesChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length > 0) {
//             // Filter only image files
//             let imageFiles = files.filter((file) =>
//                 file.type.startsWith("image/"),
//             );

//             if (imageFiles.length !== files.length) {
//                 alert("Some files are not images and were ignored");
//             }

//             if (imageFiles.length > 0) {
//                 // Validate each file size (150MB max)
//                 const oversizedFiles = imageFiles.filter(
//                     (file) => file.size > MAX_IMAGE_SIZE,
//                 );
//                 if (oversizedFiles.length > 0) {
//                     alert(
//                         `${oversizedFiles.length} image(s) exceed 150MB limit and were ignored`,
//                     );
//                     imageFiles = imageFiles.filter(
//                         (file) => file.size <= MAX_IMAGE_SIZE,
//                     );
//                 }

//                 const newFiles = [...imageFiles];
//                 setNewImageFiles((prev) => [...prev, ...newFiles]);

//                 // Create previews for new files with temporary sort_order
//                 newFiles.forEach((file, index) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         const newPreview = {
//                             id: `new-${Date.now()}-${index}`,
//                             preview: reader.result,
//                             file: file,
//                             sort_order:
//                                 newImagesPreviews.length +
//                                 existingImages.length +
//                                 index,
//                         };
//                         setNewImagesPreviews((prev) => [...prev, newPreview]);
//                     };
//                     reader.readAsDataURL(file);
//                 });
//             }
//         }
//     };

//     // Handle video URL input
//     const handleVideoUrlChange = (e) => {
//         const url = e.target.value;
//         setVideoUrl(url);
//         setValue("video", url);
//     };

//     // Drag and drop handlers for existing images
//     const handleDragStart = useCallback((e, index, type) => {
//         e.dataTransfer.setData("text/plain", JSON.stringify({ index, type }));
//         setDraggingImage({ index, type });
//         e.currentTarget.classList.add("opacity-50");
//     }, []);

//     const handleDragOver = useCallback((e, index, type) => {
//         e.preventDefault();
//         setDragOverIndex({ index, type });
//     }, []);

//     const handleDragEnd = useCallback((e) => {
//         e.preventDefault();
//         setDraggingImage(null);
//         setDragOverIndex(null);
//         e.currentTarget.classList.remove("opacity-50");
//     }, []);

//     const handleDrop = useCallback(
//         (e, dropIndex, dropType) => {
//             e.preventDefault();
//             const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//             const { index: dragIndex, type: dragType } = data;

//             if (dragType === dropType) {
//                 if (dragType === "existing") {
//                     // Reorder existing images
//                     const updatedImages = [...existingImages];
//                     const [draggedItem] = updatedImages.splice(dragIndex, 1);
//                     updatedImages.splice(dropIndex, 0, draggedItem);

//                     // Update sort_order based on new position
//                     const reorderedImages = updatedImages.map((img, idx) => ({
//                         ...img,
//                         sort_order: idx + 1,
//                     }));

//                     setExistingImages(reorderedImages);
//                     // Auto-save after reordering existing images
//                     handleAutoSave(reorderedImages, newImagesPreviews);
//                 } else if (dragType === "new") {
//                     // Reorder new images
//                     const updatedPreviews = [...newImagesPreviews];
//                     const [draggedItem] = updatedPreviews.splice(dragIndex, 1);
//                     updatedPreviews.splice(dropIndex, 0, draggedItem);

//                     // Update sort_order based on new position
//                     const reorderedPreviews = updatedPreviews.map(
//                         (preview, idx) => ({
//                             ...preview,
//                             sort_order: existingImages.length + idx + 1,
//                         }),
//                     );

//                     setNewImagesPreviews(reorderedPreviews);

//                     // Also reorder files array
//                     const updatedFiles = [...newImageFiles];
//                     const [draggedFile] = updatedFiles.splice(dragIndex, 1);
//                     updatedFiles.splice(dropIndex, 0, draggedFile);
//                     setNewImageFiles(updatedFiles);
//                 }
//             }

//             setDraggingImage(null);
//             setDragOverIndex(null);
//         },
//         [existingImages, newImagesPreviews, newImageFiles],
//     );

//     // Auto-save function for image deletions and reordering
//     const handleAutoSave = async (
//         updatedExistingImages = existingImages,
//         updatedNewImages = newImagesPreviews,
//     ) => {
//         try {
//             setAutoSaving(true);

//             const formData = new FormData();

//             // Get current form values
//             const formValues = getValues();

//             // Append all text fields
//             Object.keys(formValues).forEach((key) => {
//                 if (
//                     formValues[key] !== undefined &&
//                     formValues[key] !== null &&
//                     formValues[key] !== ""
//                 ) {
//                     formData.append(key, formValues[key]);
//                 }
//             });

//             // Append banner file if changed
//             if (bannerFile) {
//                 formData.append("banner_image", bannerFile);
//             }

//             // Append video banner file if changed
//             if (videoBannerFile) {
//                 formData.append("video_banner", videoBannerFile);
//             }

//             // Add sort_order data for existing images
//             updatedExistingImages.forEach((img, index) => {
//                 formData.append(`existing_image_sort[${img.id}]`, index + 1);
//             });

//             // Add sort_order for new images
//             updatedNewImages.forEach((preview, index) => {
//                 formData.append(
//                     `new_image_sort[${index}]`,
//                     updatedExistingImages.length + index + 1,
//                 );
//             });

//             // Append removed image IDs
//             removingImageIds.forEach((id) => {
//                 formData.append("removed_image_ids[]", id);
//             });

//             // Append video URL
//             if (videoUrl !== undefined) {
//                 formData.append("video", videoUrl);
//             }

//             formData.append("_method", "PUT");

//             await axios.post(
//                 route("ourinscription.update", editingInscription.id),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );

//             // Clear removing image IDs after successful save
//             setRemovingImageIds([]);

//             // Trigger reload to refresh the parent component
//             setReloadTrigger((prev) => !prev);

//             // Show success message
//             setTimeout(() => {
//                 setAutoSaving(false);
//             }, 1000);
//         } catch (error) {
//             console.error("Auto-save error:", error);
//             alert("Failed to save changes. Please try again.");
//             setAutoSaving(false);
//         }
//     };

//     // Remove existing image (auto-save approach)
//     const handleRemoveExistingImage = async (imageId) => {
//         try {
//             // Add to removing list and update UI immediately
//             setRemovingImageIds((prev) => [...prev, imageId]);
//             setExistingImages((prev) =>
//                 prev.filter((img) => img.id !== imageId),
//             );
//         } catch (error) {
//             console.error("Error removing image:", error);
//             alert("Failed to remove image");
//             // Rollback on error
//             setRemovingImageIds((prev) => prev.filter((id) => id !== imageId));
//             // You might want to refetch the images here or restore the original state
//         }
//     };

//     // Remove new image (not saved yet, just from preview)
//     const handleRemoveNewImage = (index) => {
//         setNewImagesPreviews((prev) => prev.filter((_, i) => i !== index));
//         setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     // Handle Update Inscription
//     const handleUpdate = async (formData) => {
//         try {
//             // Append banner file if changed
//             if (bannerFile) {
//                 formData.append("banner_image", bannerFile);
//             }

//             // Append video banner file if changed
//             if (videoBannerFile) {
//                 formData.append("video_banner", videoBannerFile);
//             }

//             // Add sort_order data for existing images
//             existingImages.forEach((img, index) => {
//                 formData.append(`existing_image_sort[${img.id}]`, index + 1);
//             });

//             // Add sort_order for new images
//             newImagesPreviews.forEach((preview, index) => {
//                 formData.append(
//                     `new_image_sort[${index}]`,
//                     existingImages.length + index + 1,
//                 );
//             });

//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourinscription.update", editingInscription.id),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                     timeout: 1200000, // 20 minutes timeout for large file uploads
//                     onUploadProgress: (progressEvent) => {
//                         const percentCompleted = Math.round(
//                             (progressEvent.loaded * 100) / progressEvent.total,
//                         );
//                         console.log(`Upload progress: ${percentCompleted}%`);
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating inscription", error);
//             throw error;
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Validate banner image size (150MB)
//         if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) {
//             alert(
//                 `Banner image size exceeds 150MB limit (Current: ${formatFileSize(bannerFile.size)})`,
//             );
//             return;
//         }

//         // Validate video banner image size (150MB)
//         if (videoBannerFile && videoBannerFile.size > MAX_IMAGE_SIZE) {
//             alert(
//                 `Video banner image size exceeds 150MB limit (Current: ${formatFileSize(videoBannerFile.size)})`,
//             );
//             return;
//         }

//         // Validate all new images size (150MB each)
//         const oversizedImages = newImageFiles.filter(
//             (file) => file.size > MAX_IMAGE_SIZE,
//         );
//         if (oversizedImages.length > 0) {
//             alert(
//                 `${oversizedImages.length} image(s) exceed 150MB limit. Please remove them.`,
//             );
//             return;
//         }

//         const formData = new FormData();

//         // Append all text fields
//         Object.keys(data).forEach((key) => {
//             if (
//                 data[key] !== undefined &&
//                 data[key] !== null &&
//                 data[key] !== ""
//             ) {
//                 formData.append(key, data[key]);
//             }
//         });

//         // Append banner file if changed
//         if (bannerFile) {
//             formData.append("banner_image", bannerFile);
//         }

//         // Append video banner file if changed
//         if (videoBannerFile) {
//             formData.append("video_banner", videoBannerFile);
//         }

//         // Append video URL (always, even if empty)
//         if (videoUrl !== undefined) {
//             formData.append("video", videoUrl);
//         }

//         // Append new images
//         newImageFiles.forEach((file, index) => {
//             formData.append(`images[${index}]`, file);
//         });

//         // Append removed image IDs
//         removingImageIds.forEach((id) => {
//             formData.append("removed_image_ids[]", id);
//         });

//         try {
//             setSubmitting(true);

//             const result = await handleUpdate(formData);

//             if (result.success) {
//                 resetForm();
//                 alert(result.message || "Inscription updated successfully!");
//                 setShowForm(false);
//             } else {
//                 alert(result.message || "Failed to update inscription");
//             }
//         } catch (error) {
//             const errorMessage =
//                 error.response?.data?.message ||
//                 error.response?.data?.errors?.images?.[0] ||
//                 error.response?.data?.errors?.video?.[0] ||
//                 error.response?.data?.errors?.banner_image?.[0] ||
//                 error.response?.data?.errors?.video_banner?.[0] ||
//                 error.response?.data?.errors?.inscription_number?.[0] ||
//                 "Error updating inscription";
//             alert(errorMessage);
//             console.error("Submission error:", error.response?.data);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Reset form function
//     const resetForm = () => {
//         reset();
//         setBannerPreview(null);
//         setBannerFile(null);
//         setVideoBannerPreview(null);
//         setVideoBannerFile(null);
//         setExistingImages([]);
//         setNewImagesPreviews([]);
//         setNewImageFiles([]);
//         setVideoUrl("");
//         setRemovingImageIds([]);
//         setDraggingImage(null);
//         setDragOverIndex(null);
//         setAutoSaving(false);
//         setDeletingImageId(null);
//     };

//     // Handle close form
//     const handleClose = () => {
//         resetForm();
//         setShowForm(false);
//     };

//     // Format file size
//     const formatFileSize = (bytes) => {
//         if (bytes === 0) return "0 Bytes";
//         const k = 1024;
//         const sizes = ["Bytes", "KB", "MB", "GB"];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//     };

//     // Custom Quill CSS
//     const quillStyle = (field) => ({
//         backgroundColor: "white",
//         color: "#333",
//         borderRadius: "0.375rem",
//         border: "1px solid #d1d5db",
//         minHeight: "150px",
//         maxHeight: "500px",
//         overflow: "hidden",
//     });

//     // Function to check if URL is a video
//     const isVideoUrl = (url) => {
//         if (!url) return false;
//         const videoExtensions = [
//             ".mp4",
//             ".avi",
//             ".mov",
//             ".wmv",
//             ".flv",
//             ".mkv",
//             ".webm",
//             ".mpg",
//             ".mpeg",
//         ];
//         return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
//     };

//     // Function to get video URL for preview
//     const getVideoPreviewUrl = (url) => {
//         if (!url) return null;
//         if (url.startsWith("http") || url.startsWith("blob:")) {
//             return url;
//         }
//         // If it's a storage path, prepend the image URL
//         return `${imgurl}/${url}`;
//     };

//     return (
//         <div
//             className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}
//         >
//             <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
//                 {/* Content */}
//                 <div className="h-full flex flex-col px-4 sm:px-6 py-4 sm:py-6 text-gray-800">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <div>
//                             <h2 className="text-xl sm:text-2xl font-bold">
//                                 Edit Inscription
//                             </h2>
//                             {autoSaving && (
//                                 <p className="text-xs text-green-600 mt-1">
//                                     Saving changes...
//                                 </p>
//                             )}
//                         </div>
//                         <button
//                             onClick={handleClose}
//                             className="hover:text-red-500"
//                             type="button"
//                         >
//                             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//                         </button>
//                     </div>

//                     {/* Scrollable Form */}
//                     <div className="overflow-y-auto flex-1 pr-2 space-y-4 sm:space-y-6">
//                         <form
//                             onSubmit={handleFormSubmit(onSubmit)}
//                             className="space-y-4 sm:space-y-6"
//                         >
//                             {/* Title */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Title *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder="Enter inscription title"
//                                     className={`${inputClass} ${errors.title ? "border-2 border-red-500" : ""}`}
//                                     {...register("title", {
//                                         required: "Title is required",
//                                         minLength: {
//                                             value: 3,
//                                             message:
//                                                 "Title must be at least 3 characters",
//                                         },
//                                     })}
//                                 />
//                                 {errors.title && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.title.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Inscription Number */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Inscription Number *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder="INSN 00001"
//                                     className={`${inputClass} ${errors.inscription_number ? "border-2 border-red-500" : ""}`}
//                                     {...register("inscription_number", {
//                                         required:
//                                             "Inscription number is required",
//                                         minLength: {
//                                             value: 1,
//                                             message:
//                                                 "Inscription number must be at least 1 character",
//                                         },
//                                     })}
//                                 />
//                                 {errors.inscription_number && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.inscription_number.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Status */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Status *
//                                 </label>
//                                 <select
//                                     className={`${inputClass} ${errors.status ? "border-2 border-red-500" : ""}`}
//                                     {...register("status", {
//                                         required: "Status is required",
//                                     })}
//                                 >
//                                     <option value="draft">Draft</option>
//                                     <option value="published">Published</option>
//                                 </select>
//                                 {errors.status && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.status.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Banner Image */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <Camera
//                                         className="mr-2 sm:mr-3 text-gray-600"
//                                         size={20}
//                                     />
//                                     Banner Image (Single)
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {bannerPreview ? (
//                                         <div className="space-y-3 sm:space-y-4">
//                                             <div className="relative inline-block">
//                                                 <img
//                                                     src={bannerPreview}
//                                                     alt="Banner Preview"
//                                                     className="mx-auto h-32 sm:h-40 w-full object-cover rounded-lg shadow-lg bg-white"
//                                                 />
//                                                 {bannerFile && (
//                                                     <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
//                                                         New
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <p className="text-sm text-gray-600">
//                                                 Click to change image
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Max size: 150MB
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-3 sm:space-y-4">
//                                             <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                                             <p className="text-sm sm:text-lg text-gray-700">
//                                                 Click to upload banner image
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Recommended: 1200x400px
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Max size: 150MB
//                                             </p>
//                                         </div>
//                                     )}
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleBannerChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Video Banner Image */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <Film
//                                         className="mr-2 sm:mr-3 text-gray-600"
//                                         size={20}
//                                     />
//                                     Video Banner Image (Optional)
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {videoBannerPreview ? (
//                                         <div className="space-y-3 sm:space-y-4">
//                                             <div className="relative inline-block">
//                                                 <img
//                                                     src={videoBannerPreview}
//                                                     alt="Video Banner Preview"
//                                                     className="mx-auto h-32 sm:h-40 w-full object-cover rounded-lg shadow-lg bg-white"
//                                                 />
//                                                 {videoBannerFile && (
//                                                     <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
//                                                         New
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <p className="text-sm text-gray-600">
//                                                 Click to change video banner
//                                                 image
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Max size: 150MB
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Used as thumbnail for videos
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-3 sm:space-y-4">
//                                             <Film className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                                             <p className="text-sm sm:text-lg text-gray-700">
//                                                 Click to upload video banner
//                                                 image
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Recommended: 16:9 aspect ratio
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Max size: 150MB
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Optional - used as video
//                                                 thumbnail
//                                             </p>
//                                         </div>
//                                     )}
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleVideoBannerChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Multiple Images */}
//                             <div className="space-y-2">
//                                 <label className="flex flex-col sm:flex-row sm:items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <div className="flex items-center">
//                                         <Image
//                                             className="mr-2 sm:mr-3 text-gray-600"
//                                             size={20}
//                                         />
//                                         Gallery Images (Drag to reorder)
//                                     </div>

//                                     <span className="mt-1 sm:mt-0 sm:ml-3 text-sm font-medium text-green-600">
//                                         Please update after deletion
//                                     </span>
//                                 </label>

//                                 {/* Existing Images */}
//                                 {existingImages.length > 0 && (
//                                     <div className="mb-4">
//                                         <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-2">
//                                             Existing Images
//                                         </h4>
//                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
//                                             {existingImages.map(
//                                                 (image, index) => (
//                                                     <div
//                                                         key={image.id}
//                                                         className={`relative group border-2 rounded-lg transition-all duration-200 ${
//                                                             dragOverIndex?.index ===
//                                                                 index &&
//                                                             dragOverIndex?.type ===
//                                                                 "existing"
//                                                                 ? "border-blue-500 bg-blue-50"
//                                                                 : "border-transparent"
//                                                         } ${
//                                                             draggingImage?.index ===
//                                                                 index &&
//                                                             draggingImage?.type ===
//                                                                 "existing"
//                                                                 ? "cursor-grabbing"
//                                                                 : "cursor-grab"
//                                                         }`}
//                                                         draggable
//                                                         onDragStart={(e) =>
//                                                             handleDragStart(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                         onDragOver={(e) =>
//                                                             handleDragOver(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                         onDragEnd={
//                                                             handleDragEnd
//                                                         }
//                                                         onDrop={(e) =>
//                                                             handleDrop(
//                                                                 e,
//                                                                 index,
//                                                                 "existing",
//                                                             )
//                                                         }
//                                                     >
//                                                         <div className="flex items-center justify-between p-2 bg-gray-50 rounded-t-lg border-b">
//                                                             <div className="flex items-center gap-2">
//                                                                 <GripVertical
//                                                                     className="text-gray-400 cursor-move"
//                                                                     size={14}
//                                                                 />
//                                                                 <span className="text-xs text-gray-600 font-medium">
//                                                                     Pos:{" "}
//                                                                     {index + 1}
//                                                                 </span>
//                                                             </div>
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     handleRemoveExistingImage(
//                                                                         image.id,
//                                                                     )
//                                                                 }
//                                                                 className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
//                                                                 title="Remove image (auto-saves)"
//                                                                 disabled={removingImageIds.includes(
//                                                                     image.id,
//                                                                 )}
//                                                             >
//                                                                 <Trash2
//                                                                     size={12}
//                                                                 />
//                                                             </button>
//                                                         </div>
//                                                         <img
//                                                             src={`${imgurl}/${image.image_path}`}
//                                                             alt={`Existing image`}
//                                                             className="h-20 sm:h-24 w-full object-cover rounded-b-lg"
//                                                         />
//                                                         {removingImageIds.includes(
//                                                             image.id,
//                                                         ) && (
//                                                             <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
//                                                                 <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">
//                                                                     Removing...
//                                                                 </span>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 ),
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* New Images */}
//                                 {newImagesPreviews.length > 0 && (
//                                     <div className="mb-4">
//                                         <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-2">
//                                             New Images (Will be added after
//                                             existing)
//                                         </h4>
//                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
//                                             {newImagesPreviews.map(
//                                                 (preview, index) => (
//                                                     <div
//                                                         key={preview.id}
//                                                         className={`relative group border-2 rounded-lg transition-all duration-200 ${
//                                                             dragOverIndex?.index ===
//                                                                 index &&
//                                                             dragOverIndex?.type ===
//                                                                 "new"
//                                                                 ? "border-blue-500 bg-blue-50"
//                                                                 : "border-transparent"
//                                                         } ${
//                                                             draggingImage?.index ===
//                                                                 index &&
//                                                             draggingImage?.type ===
//                                                                 "new"
//                                                                 ? "cursor-grabbing"
//                                                                 : "cursor-grab"
//                                                         }`}
//                                                         draggable
//                                                         onDragStart={(e) =>
//                                                             handleDragStart(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                         onDragOver={(e) =>
//                                                             handleDragOver(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                         onDragEnd={
//                                                             handleDragEnd
//                                                         }
//                                                         onDrop={(e) =>
//                                                             handleDrop(
//                                                                 e,
//                                                                 index,
//                                                                 "new",
//                                                             )
//                                                         }
//                                                     >
//                                                         <div className="flex items-center justify-between p-2 bg-blue-50 rounded-t-lg border-b border-blue-200">
//                                                             <div className="flex items-center gap-2">
//                                                                 <GripVertical
//                                                                     className="text-blue-400 cursor-move"
//                                                                     size={14}
//                                                                 />
//                                                                 <span className="text-xs text-blue-600 font-medium">
//                                                                     Pos:{" "}
//                                                                     {existingImages.length +
//                                                                         index +
//                                                                         1}
//                                                                 </span>
//                                                             </div>
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     handleRemoveNewImage(
//                                                                         index,
//                                                                     )
//                                                                 }
//                                                                 className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
//                                                                 title="Remove image"
//                                                             >
//                                                                 <Trash2
//                                                                     size={12}
//                                                                 />
//                                                             </button>
//                                                         </div>
//                                                         <img
//                                                             src={
//                                                                 preview.preview
//                                                             }
//                                                             alt={`New image ${index + 1}`}
//                                                             className="h-20 sm:h-24 w-full object-cover rounded-b-lg"
//                                                         />
//                                                         <div className="absolute bottom-1 right-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs">
//                                                             New
//                                                         </div>
//                                                     </div>
//                                                 ),
//                                             )}
//                                         </div>
//                                         <p className="text-sm text-gray-600 mb-2">
//                                             Note: New images will be saved when
//                                             you click "Update Inscription"
//                                         </p>
//                                     </div>
//                                 )}

//                                 {/* Images Upload Area */}
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     <div className="space-y-3 sm:space-y-4">
//                                         <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                                         <div>
//                                             <p className="text-sm sm:text-lg text-gray-700">
//                                                 Click to upload multiple images
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Hold Ctrl/Cmd to select multiple
//                                                 files
//                                             </p>
//                                             <p className="text-xs sm:text-sm text-gray-500">
//                                                 Max size: 150MB per file
//                                             </p>
//                                         </div>
//                                         {existingImages.length +
//                                             newImagesPreviews.length >
//                                             0 && (
//                                             <div className="mt-4">
//                                                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
//                                                     <span className="text-sm font-medium text-gray-700">
//                                                         Total Images:{" "}
//                                                         {existingImages.length +
//                                                             newImagesPreviews.length}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={handleImagesChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Video URL Input */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
//                                     <Link
//                                         className="mr-2 sm:mr-3 text-gray-600"
//                                         size={20}
//                                     />
//                                     Video URL
//                                 </label>
//                                 <div className="space-y-4">
//                                     <div className="relative">
//                                         <input
//                                             type="url"
//                                             value={videoUrl}
//                                             onChange={handleVideoUrlChange}
//                                             placeholder="Enter video URL (e.g., https://yourdomain.com/storage/app/public/inscriptions/videos/filename.mp4)"
//                                             className={`${inputClass} pr-10`}
//                                         />
//                                         <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//                                     </div>

//                                     {videoUrl && isVideoUrl(videoUrl) && (
//                                         <div className="border rounded-lg p-4 bg-gray-50">
//                                             <p className="text-sm font-medium text-gray-700 mb-2">
//                                                 Video Preview:
//                                             </p>
//                                             <div className="relative">
//                                                 <video
//                                                     src={getVideoPreviewUrl(
//                                                         videoUrl,
//                                                     )}
//                                                     className="w-full h-40 sm:h-48 object-cover rounded-lg"
//                                                     controls
//                                                     poster={videoBannerPreview}
//                                                 />
//                                                 {videoBannerPreview && (
//                                                     <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
//                                                         Banner Loaded
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Description *
//                                 </label>
//                                 <Controller
//                                     name="description"
//                                     control={control}
//                                     rules={{
//                                         required: "Description is required",
//                                     }}
//                                     render={({ field }) => (
//                                         <div
//                                             className={`rounded overflow-hidden ${errors.description ? "border-2 border-red-500" : ""}`}
//                                         >
//                                             <ReactQuill
//                                                 ref={quillRefs.description}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle(
//                                                     "description",
//                                                 )}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={
//                                                     quillPlaceholders.description
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                                 {errors.description && (
//                                     <p className="text-red-500 text-sm mt-1">
//                                         {errors.description.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Background */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Background
//                                 </label>
//                                 <Controller
//                                     name="background"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.background}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("background")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={
//                                                     quillPlaceholders.background
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* Text */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Text
//                                 </label>
//                                 <Controller
//                                     name="text"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.text}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("text")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={
//                                                     quillPlaceholders.text
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* Translation */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Translation
//                                 </label>
//                                 <Controller
//                                     name="translation"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.translation}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle(
//                                                     "translation",
//                                                 )}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={
//                                                     quillPlaceholders.translation
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* References */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     References
//                                 </label>
//                                 <Controller
//                                     name="references"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.references}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("references")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={
//                                                     quillPlaceholders.references
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* Glossary */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-base sm:text-lg">
//                                     Glossary
//                                 </label>
//                                 <Controller
//                                     name="glossary"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <div className="rounded overflow-hidden">
//                                             <ReactQuill
//                                                 ref={quillRefs.glossary}
//                                                 theme="snow"
//                                                 value={field.value || ""}
//                                                 onChange={field.onChange}
//                                                 onBlur={field.onBlur}
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 style={quillStyle("glossary")}
//                                                 className="rounded h-auto quill-custom"
//                                                 placeholder={
//                                                     quillPlaceholders.glossary
//                                                 }
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>

//                             {/* Submit Button */}
//                             <div className="pt-4">
//                                 <button
//                                     type="submit"
//                                     disabled={submitting || autoSaving}
//                                     className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-base sm:text-lg ${submitting || autoSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
//                                 >
//                                     {submitting
//                                         ? "Updating..."
//                                         : autoSaving
//                                           ? "Saving changes..."
//                                           : "Update Inscription"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditInscriptionForm;





import {
    X,
    Camera,
    Upload,
    Video,
    Image,
    Trash2,
    GripVertical,
    Link,
    Film,
} from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditInscriptionForm = ({
    showForm,
    setShowForm,
    editingInscription,
    setReloadTrigger,
}) => {
    const inputClass =
        "w-full p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";

    // File size limits in bytes
    const MAX_IMAGE_SIZE = 150 * 1024 * 1024; // 150MB

    // Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
        "script",
        "color",
        "background",
        "font",
        "align",
        "size",
    ];

    // Quill placeholder configurations
    const quillPlaceholders = {
        description:
            "Enter the description in list format (• Point 1, • Point 2, • Point 3)...",

        background: "Enter the background information in paragraph format...",

        text: "Enter the original text in numbered format (1. First line, 2. Second line, 3. Third line)...",

        dev_text: "Enter the Devnagari text in numbered format (1. First line, 2. Second line, 3. Third line)...",

        translation:
            "Enter the translation in list format (• Line 1 meaning, • Line 2 meaning)...",

        references:
            "Enter references in list format (• Book name, • Author, • URL, etc.)...",

        glossary:
            "Enter glossary terms in list format (• Term – Explanation)...",
    };

    // Refs to track Quill editor heights
    const quillRefs = {
        description: useRef(null),
        background: useRef(null),
        text: useRef(null),
        dev_text: useRef(null),
        translation: useRef(null),
        references: useRef(null),
        glossary: useRef(null),
    };

    const [bannerPreview, setBannerPreview] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [videoBannerPreview, setVideoBannerPreview] = useState(null);
    const [videoBannerFile, setVideoBannerFile] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [newImagesPreviews, setNewImagesPreviews] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [removingImageIds, setRemovingImageIds] = useState([]);
    const [draggingImage, setDraggingImage] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [autoSaving, setAutoSaving] = useState(false);
    const [deletingImageId, setDeletingImageId] = useState(null);

    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const {
        register,
        handleSubmit: handleFormSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
    } = useForm();

    // Effect to adjust Quill editor heights based on content
    useEffect(() => {
        const adjustQuillHeight = (field) => {
            const editor = quillRefs[field]?.current;
            if (editor) {
                const quillEditor = editor.getEditor();
                const editorContainer = quillEditor.root;

                // Reset to auto height first
                editorContainer.style.height = "auto";

                // Calculate content height
                const contentHeight = editorContainer.scrollHeight;

                // Set minimum height and add some padding
                const minHeight = 150; // Minimum height in pixels
                const newHeight = Math.max(contentHeight, minHeight);

                // Limit maximum height
                const maxHeight = 500; // Maximum height in pixels
                editorContainer.style.height = `${Math.min(newHeight, maxHeight)}px`;

                // Update Quill instance
                quillEditor.setSelection(null);
            }
        };

        // Adjust all Quill editors after content changes
        const timeoutId = setTimeout(() => {
            Object.keys(quillRefs).forEach((field) => {
                adjustQuillHeight(field);
            });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [Object.values(quillRefs).map((ref) => ref.current)]);

    // Initialize form with editing data
    useEffect(() => {
        if (editingInscription) {
            // Set form values
            setValue("title", editingInscription.title);
            setValue(
                "inscription_number",
                editingInscription.inscription_number,
            );
            setValue("status", editingInscription.status || "draft");

            // Set Quill content values in form
            setValue("description", editingInscription.description || "");
            setValue("background", editingInscription.background || "");
            setValue("text", editingInscription.text || "");
            setValue("dev_text", editingInscription.dev_text || "");
            setValue("translation", editingInscription.translation || "");
            setValue(
                "references",
                editingInscription.references ||
                    editingInscription.refrences ||
                    "",
            );
            setValue("glossary", editingInscription.glossary || "");

            // Set previews for existing files
            if (editingInscription.banner_image) {
                setBannerPreview(
                    `${imgurl}/${editingInscription.banner_image}`,
                );
            }

            // Set video banner preview if exists
            if (editingInscription.video_banner) {
                setVideoBannerPreview(
                    `${imgurl}/${editingInscription.video_banner}`,
                );
            }

            // Set video URL from existing video
            if (editingInscription.video) {
                setVideoUrl(editingInscription.video);
                setValue("video", editingInscription.video);
            }

            // Set existing images with sort_order
            if (
                editingInscription.images &&
                editingInscription.images.length > 0
            ) {
                // Sort existing images by sort_order
                const sortedImages = [...editingInscription.images].sort(
                    (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
                );
                setExistingImages(sortedImages);
            }
        } else {
            resetForm();
        }
    }, [editingInscription, reset, setValue]);

    // Handle banner image change
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image file
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file");
                return;
            }

            // Validate file size (150MB max for images)
            if (file.size > MAX_IMAGE_SIZE) {
                alert(
                    `Banner image size should be less than 150MB (Current: ${formatFileSize(file.size)})`,
                );
                return;
            }

            setBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle video banner image change
    const handleVideoBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image file
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file");
                return;
            }

            // Validate file size (150MB max for images)
            if (file.size > MAX_IMAGE_SIZE) {
                alert(
                    `Video banner image size should be less than 150MB (Current: ${formatFileSize(file.size)})`,
                );
                return;
            }

            setVideoBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle multiple images change
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Filter only image files
            let imageFiles = files.filter((file) =>
                file.type.startsWith("image/"),
            );

            if (imageFiles.length !== files.length) {
                alert("Some files are not images and were ignored");
            }

            if (imageFiles.length > 0) {
                // Validate each file size (150MB max)
                const oversizedFiles = imageFiles.filter(
                    (file) => file.size > MAX_IMAGE_SIZE,
                );
                if (oversizedFiles.length > 0) {
                    alert(
                        `${oversizedFiles.length} image(s) exceed 150MB limit and were ignored`,
                    );
                    imageFiles = imageFiles.filter(
                        (file) => file.size <= MAX_IMAGE_SIZE,
                    );
                }

                const newFiles = [...imageFiles];
                setNewImageFiles((prev) => [...prev, ...newFiles]);

                // Create previews for new files with temporary sort_order
                newFiles.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const newPreview = {
                            id: `new-${Date.now()}-${index}`,
                            preview: reader.result,
                            file: file,
                            sort_order:
                                newImagesPreviews.length +
                                existingImages.length +
                                index,
                        };
                        setNewImagesPreviews((prev) => [...prev, newPreview]);
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    };

    // Handle video URL input
    const handleVideoUrlChange = (e) => {
        const url = e.target.value;
        setVideoUrl(url);
        setValue("video", url);
    };

    // Drag and drop handlers for existing images
    const handleDragStart = useCallback((e, index, type) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ index, type }));
        setDraggingImage({ index, type });
        e.currentTarget.classList.add("opacity-50");
    }, []);

    const handleDragOver = useCallback((e, index, type) => {
        e.preventDefault();
        setDragOverIndex({ index, type });
    }, []);

    const handleDragEnd = useCallback((e) => {
        e.preventDefault();
        setDraggingImage(null);
        setDragOverIndex(null);
        e.currentTarget.classList.remove("opacity-50");
    }, []);

    const handleDrop = useCallback(
        (e, dropIndex, dropType) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData("text/plain"));
            const { index: dragIndex, type: dragType } = data;

            if (dragType === dropType) {
                if (dragType === "existing") {
                    // Reorder existing images
                    const updatedImages = [...existingImages];
                    const [draggedItem] = updatedImages.splice(dragIndex, 1);
                    updatedImages.splice(dropIndex, 0, draggedItem);

                    // Update sort_order based on new position
                    const reorderedImages = updatedImages.map((img, idx) => ({
                        ...img,
                        sort_order: idx + 1,
                    }));

                    setExistingImages(reorderedImages);
                    // Auto-save after reordering existing images
                    handleAutoSave(reorderedImages, newImagesPreviews);
                } else if (dragType === "new") {
                    // Reorder new images
                    const updatedPreviews = [...newImagesPreviews];
                    const [draggedItem] = updatedPreviews.splice(dragIndex, 1);
                    updatedPreviews.splice(dropIndex, 0, draggedItem);

                    // Update sort_order based on new position
                    const reorderedPreviews = updatedPreviews.map(
                        (preview, idx) => ({
                            ...preview,
                            sort_order: existingImages.length + idx + 1,
                        }),
                    );

                    setNewImagesPreviews(reorderedPreviews);

                    // Also reorder files array
                    const updatedFiles = [...newImageFiles];
                    const [draggedFile] = updatedFiles.splice(dragIndex, 1);
                    updatedFiles.splice(dropIndex, 0, draggedFile);
                    setNewImageFiles(updatedFiles);
                }
            }

            setDraggingImage(null);
            setDragOverIndex(null);
        },
        [existingImages, newImagesPreviews, newImageFiles],
    );

    // Auto-save function for image deletions and reordering
    const handleAutoSave = async (
        updatedExistingImages = existingImages,
        updatedNewImages = newImagesPreviews,
    ) => {
        try {
            setAutoSaving(true);

            const formData = new FormData();

            // Get current form values
            const formValues = getValues();

            // Append all text fields
            Object.keys(formValues).forEach((key) => {
                if (
                    formValues[key] !== undefined &&
                    formValues[key] !== null &&
                    formValues[key] !== ""
                ) {
                    formData.append(key, formValues[key]);
                }
            });

            // Append banner file if changed
            if (bannerFile) {
                formData.append("banner_image", bannerFile);
            }

            // Append video banner file if changed
            if (videoBannerFile) {
                formData.append("video_banner", videoBannerFile);
            }

            // Add sort_order data for existing images
            updatedExistingImages.forEach((img, index) => {
                formData.append(`existing_image_sort[${img.id}]`, index + 1);
            });

            // Add sort_order for new images
            updatedNewImages.forEach((preview, index) => {
                formData.append(
                    `new_image_sort[${index}]`,
                    updatedExistingImages.length + index + 1,
                );
            });

            // Append removed image IDs
            removingImageIds.forEach((id) => {
                formData.append("removed_image_ids[]", id);
            });

            // Append video URL
            if (videoUrl !== undefined) {
                formData.append("video", videoUrl);
            }

            formData.append("_method", "PUT");

            await axios.post(
                route("ourinscription.update", editingInscription.id),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            // Clear removing image IDs after successful save
            setRemovingImageIds([]);

            // Trigger reload to refresh the parent component
            setReloadTrigger((prev) => !prev);

            // Show success message
            setTimeout(() => {
                setAutoSaving(false);
            }, 1000);
        } catch (error) {
            console.error("Auto-save error:", error);
            alert("Failed to save changes. Please try again.");
            setAutoSaving(false);
        }
    };

    // Remove existing image (auto-save approach)
    const handleRemoveExistingImage = async (imageId) => {
        try {
            // Add to removing list and update UI immediately
            setRemovingImageIds((prev) => [...prev, imageId]);
            setExistingImages((prev) =>
                prev.filter((img) => img.id !== imageId),
            );
        } catch (error) {
            console.error("Error removing image:", error);
            alert("Failed to remove image");
            // Rollback on error
            setRemovingImageIds((prev) => prev.filter((id) => id !== imageId));
            // You might want to refetch the images here or restore the original state
        }
    };

    // Remove new image (not saved yet, just from preview)
    const handleRemoveNewImage = (index) => {
        setNewImagesPreviews((prev) => prev.filter((_, i) => i !== index));
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle Update Inscription
    const handleUpdate = async (formData) => {
        try {
            // Append banner file if changed
            if (bannerFile) {
                formData.append("banner_image", bannerFile);
            }

            // Append video banner file if changed
            if (videoBannerFile) {
                formData.append("video_banner", videoBannerFile);
            }

            // Add sort_order data for existing images
            existingImages.forEach((img, index) => {
                formData.append(`existing_image_sort[${img.id}]`, index + 1);
            });

            // Add sort_order for new images
            newImagesPreviews.forEach((preview, index) => {
                formData.append(
                    `new_image_sort[${index}]`,
                    existingImages.length + index + 1,
                );
            });

            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourinscription.update", editingInscription.id),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 1200000, // 20 minutes timeout for large file uploads
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        console.log(`Upload progress: ${percentCompleted}%`);
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error updating inscription", error);
            throw error;
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        // Validate banner image size (150MB)
        if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) {
            alert(
                `Banner image size exceeds 150MB limit (Current: ${formatFileSize(bannerFile.size)})`,
            );
            return;
        }

        // Validate video banner image size (150MB)
        if (videoBannerFile && videoBannerFile.size > MAX_IMAGE_SIZE) {
            alert(
                `Video banner image size exceeds 150MB limit (Current: ${formatFileSize(videoBannerFile.size)})`,
            );
            return;
        }

        // Validate all new images size (150MB each)
        const oversizedImages = newImageFiles.filter(
            (file) => file.size > MAX_IMAGE_SIZE,
        );
        if (oversizedImages.length > 0) {
            alert(
                `${oversizedImages.length} image(s) exceed 150MB limit. Please remove them.`,
            );
            return;
        }

        const formData = new FormData();

        // Append all text fields
        Object.keys(data).forEach((key) => {
            if (
                data[key] !== undefined &&
                data[key] !== null &&
                data[key] !== ""
            ) {
                formData.append(key, data[key]);
            }
        });

        // Append banner file if changed
        if (bannerFile) {
            formData.append("banner_image", bannerFile);
        }

        // Append video banner file if changed
        if (videoBannerFile) {
            formData.append("video_banner", videoBannerFile);
        }

        // Append video URL (always, even if empty)
        if (videoUrl !== undefined) {
            formData.append("video", videoUrl);
        }

        // Append new images
        newImageFiles.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        // Append removed image IDs
        removingImageIds.forEach((id) => {
            formData.append("removed_image_ids[]", id);
        });

        try {
            setSubmitting(true);

            const result = await handleUpdate(formData);

            if (result.success) {
                resetForm();
                alert(result.message || "Inscription updated successfully!");
                setShowForm(false);
            } else {
                alert(result.message || "Failed to update inscription");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.errors?.images?.[0] ||
                error.response?.data?.errors?.video?.[0] ||
                error.response?.data?.errors?.banner_image?.[0] ||
                error.response?.data?.errors?.video_banner?.[0] ||
                error.response?.data?.errors?.inscription_number?.[0] ||
                "Error updating inscription";
            alert(errorMessage);
            console.error("Submission error:", error.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    // Reset form function
    const resetForm = () => {
        reset();
        setBannerPreview(null);
        setBannerFile(null);
        setVideoBannerPreview(null);
        setVideoBannerFile(null);
        setExistingImages([]);
        setNewImagesPreviews([]);
        setNewImageFiles([]);
        setVideoUrl("");
        setRemovingImageIds([]);
        setDraggingImage(null);
        setDragOverIndex(null);
        setAutoSaving(false);
        setDeletingImageId(null);
    };

    // Handle close form
    const handleClose = () => {
        resetForm();
        setShowForm(false);
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Custom Quill CSS
    const quillStyle = (field) => ({
        backgroundColor: "white",
        color: "#333",
        borderRadius: "0.375rem",
        border: "1px solid #d1d5db",
        minHeight: "150px",
        maxHeight: "500px",
        overflow: "hidden",
    });

    // Function to check if URL is a video
    const isVideoUrl = (url) => {
        if (!url) return false;
        const videoExtensions = [
            ".mp4",
            ".avi",
            ".mov",
            ".wmv",
            ".flv",
            ".mkv",
            ".webm",
            ".mpg",
            ".mpeg",
        ];
        return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
    };

    // Function to get video URL for preview
    const getVideoPreviewUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("blob:")) {
            return url;
        }
        // If it's a storage path, prepend the image URL
        return `${imgurl}/${url}`;
    };

    return (
        <div
            className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}
        >
            <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
                {/* Content */}
                <div className="h-full flex flex-col px-4 sm:px-6 py-4 sm:py-6 text-gray-800">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold">
                                Edit Inscription
                            </h2>
                            {autoSaving && (
                                <p className="text-xs text-green-600 mt-1">
                                    Saving changes...
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="hover:text-red-500"
                            type="button"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="overflow-y-auto flex-1 pr-2 space-y-4 sm:space-y-6">
                        <form
                            onSubmit={handleFormSubmit(onSubmit)}
                            className="space-y-4 sm:space-y-6"
                        >
                            {/* Title */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter inscription title"
                                    className={`${inputClass} ${errors.title ? "border-2 border-red-500" : ""}`}
                                    {...register("title", {
                                        required: "Title is required",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "Title must be at least 3 characters",
                                        },
                                    })}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Inscription Number */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Inscription Number *
                                </label>
                                <input
                                    type="text"
                                    placeholder="INSN 00001"
                                    className={`${inputClass} ${errors.inscription_number ? "border-2 border-red-500" : ""}`}
                                    {...register("inscription_number", {
                                        required:
                                            "Inscription number is required",
                                        minLength: {
                                            value: 1,
                                            message:
                                                "Inscription number must be at least 1 character",
                                        },
                                    })}
                                />
                                {errors.inscription_number && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.inscription_number.message}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Status *
                                </label>
                                <select
                                    className={`${inputClass} ${errors.status ? "border-2 border-red-500" : ""}`}
                                    {...register("status", {
                                        required: "Status is required",
                                    })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                                {errors.status && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.status.message}
                                    </p>
                                )}
                            </div>

                            {/* Banner Image */}
                            <div className="space-y-2">
                                <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
                                    <Camera
                                        className="mr-2 sm:mr-3 text-gray-600"
                                        size={20}
                                    />
                                    Banner Image (Single)
                                </label>
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                                    {bannerPreview ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="relative inline-block">
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner Preview"
                                                    className="mx-auto h-32 sm:h-40 w-full object-cover rounded-lg shadow-lg bg-white"
                                                />
                                                {bannerFile && (
                                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                                                        New
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Click to change image
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Max size: 150MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 sm:space-y-4">
                                            <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                                            <p className="text-sm sm:text-lg text-gray-700">
                                                Click to upload banner image
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Recommended: 1200x400px
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Max size: 150MB
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Video Banner Image */}
                            <div className="space-y-2">
                                <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
                                    <Film
                                        className="mr-2 sm:mr-3 text-gray-600"
                                        size={20}
                                    />
                                    Video Banner Image (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                                    {videoBannerPreview ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="relative inline-block">
                                                <img
                                                    src={videoBannerPreview}
                                                    alt="Video Banner Preview"
                                                    className="mx-auto h-32 sm:h-40 w-full object-cover rounded-lg shadow-lg bg-white"
                                                />
                                                {videoBannerFile && (
                                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                                                        New
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Click to change video banner
                                                image
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Max size: 150MB
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Used as thumbnail for videos
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 sm:space-y-4">
                                            <Film className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                                            <p className="text-sm sm:text-lg text-gray-700">
                                                Click to upload video banner
                                                image
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Recommended: 16:9 aspect ratio
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Max size: 150MB
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Optional - used as video
                                                thumbnail
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleVideoBannerChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Multiple Images */}
                            <div className="space-y-2">
                                <label className="flex flex-col sm:flex-row sm:items-center text-base sm:text-lg font-semibold text-gray-700">
                                    <div className="flex items-center">
                                        <Image
                                            className="mr-2 sm:mr-3 text-gray-600"
                                            size={20}
                                        />
                                        Gallery Images (Drag to reorder)
                                    </div>

                                    <span className="mt-1 sm:mt-0 sm:ml-3 text-sm font-medium text-green-600">
                                        Please update after deletion
                                    </span>
                                </label>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-2">
                                            Existing Images
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                                            {existingImages.map(
                                                (image, index) => (
                                                    <div
                                                        key={image.id}
                                                        className={`relative group border-2 rounded-lg transition-all duration-200 ${
                                                            dragOverIndex?.index ===
                                                                index &&
                                                            dragOverIndex?.type ===
                                                                "existing"
                                                                ? "border-blue-500 bg-blue-50"
                                                                : "border-transparent"
                                                        } ${
                                                            draggingImage?.index ===
                                                                index &&
                                                            draggingImage?.type ===
                                                                "existing"
                                                                ? "cursor-grabbing"
                                                                : "cursor-grab"
                                                        }`}
                                                        draggable
                                                        onDragStart={(e) =>
                                                            handleDragStart(
                                                                e,
                                                                index,
                                                                "existing",
                                                            )
                                                        }
                                                        onDragOver={(e) =>
                                                            handleDragOver(
                                                                e,
                                                                index,
                                                                "existing",
                                                            )
                                                        }
                                                        onDragEnd={
                                                            handleDragEnd
                                                        }
                                                        onDrop={(e) =>
                                                            handleDrop(
                                                                e,
                                                                index,
                                                                "existing",
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-t-lg border-b">
                                                            <div className="flex items-center gap-2">
                                                                <GripVertical
                                                                    className="text-gray-400 cursor-move"
                                                                    size={14}
                                                                />
                                                                <span className="text-xs text-gray-600 font-medium">
                                                                    Pos:{" "}
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveExistingImage(
                                                                        image.id,
                                                                    )
                                                                }
                                                                className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
                                                                title="Remove image (auto-saves)"
                                                                disabled={removingImageIds.includes(
                                                                    image.id,
                                                                )}
                                                            >
                                                                <Trash2
                                                                    size={12}
                                                                />
                                                            </button>
                                                        </div>
                                                        <img
                                                            src={`${imgurl}/${image.image_path}`}
                                                            alt={`Existing image`}
                                                            className="h-20 sm:h-24 w-full object-cover rounded-b-lg"
                                                        />
                                                        {removingImageIds.includes(
                                                            image.id,
                                                        ) && (
                                                            <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                                <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">
                                                                    Removing...
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* New Images */}
                                {newImagesPreviews.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-2">
                                            New Images (Will be added after
                                            existing)
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                                            {newImagesPreviews.map(
                                                (preview, index) => (
                                                    <div
                                                        key={preview.id}
                                                        className={`relative group border-2 rounded-lg transition-all duration-200 ${
                                                            dragOverIndex?.index ===
                                                                index &&
                                                            dragOverIndex?.type ===
                                                                "new"
                                                                ? "border-blue-500 bg-blue-50"
                                                                : "border-transparent"
                                                        } ${
                                                            draggingImage?.index ===
                                                                index &&
                                                            draggingImage?.type ===
                                                                "new"
                                                                ? "cursor-grabbing"
                                                                : "cursor-grab"
                                                        }`}
                                                        draggable
                                                        onDragStart={(e) =>
                                                            handleDragStart(
                                                                e,
                                                                index,
                                                                "new",
                                                            )
                                                        }
                                                        onDragOver={(e) =>
                                                            handleDragOver(
                                                                e,
                                                                index,
                                                                "new",
                                                            )
                                                        }
                                                        onDragEnd={
                                                            handleDragEnd
                                                        }
                                                        onDrop={(e) =>
                                                            handleDrop(
                                                                e,
                                                                index,
                                                                "new",
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-t-lg border-b border-blue-200">
                                                            <div className="flex items-center gap-2">
                                                                <GripVertical
                                                                    className="text-blue-400 cursor-move"
                                                                    size={14}
                                                                />
                                                                <span className="text-xs text-blue-600 font-medium">
                                                                    Pos:{" "}
                                                                    {existingImages.length +
                                                                        index +
                                                                        1}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveNewImage(
                                                                        index,
                                                                    )
                                                                }
                                                                className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
                                                                title="Remove image"
                                                            >
                                                                <Trash2
                                                                    size={12}
                                                                />
                                                            </button>
                                                        </div>
                                                        <img
                                                            src={
                                                                preview.preview
                                                            }
                                                            alt={`New image ${index + 1}`}
                                                            className="h-20 sm:h-24 w-full object-cover rounded-b-lg"
                                                        />
                                                        <div className="absolute bottom-1 right-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs">
                                                            New
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Note: New images will be saved when
                                            you click "Update Inscription"
                                        </p>
                                    </div>
                                )}

                                {/* Images Upload Area */}
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                                    <div className="space-y-3 sm:space-y-4">
                                        <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                                        <div>
                                            <p className="text-sm sm:text-lg text-gray-700">
                                                Click to upload multiple images
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Hold Ctrl/Cmd to select multiple
                                                files
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Max size: 150MB per file
                                            </p>
                                        </div>
                                        {existingImages.length +
                                            newImagesPreviews.length >
                                            0 && (
                                            <div className="mt-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Total Images:{" "}
                                                        {existingImages.length +
                                                            newImagesPreviews.length}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImagesChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Video URL Input */}
                            <div className="space-y-2">
                                <label className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
                                    <Link
                                        className="mr-2 sm:mr-3 text-gray-600"
                                        size={20}
                                    />
                                    Video URL
                                </label>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={videoUrl}
                                            onChange={handleVideoUrlChange}
                                            placeholder="Enter video URL (e.g., https://yourdomain.com/storage/app/public/inscriptions/videos/filename.mp4)"
                                            className={`${inputClass} pr-10`}
                                        />
                                        <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>

                                    {videoUrl && isVideoUrl(videoUrl) && (
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                Video Preview:
                                            </p>
                                            <div className="relative">
                                                <video
                                                    src={getVideoPreviewUrl(
                                                        videoUrl,
                                                    )}
                                                    className="w-full h-40 sm:h-48 object-cover rounded-lg"
                                                    controls
                                                    poster={videoBannerPreview}
                                                />
                                                {videoBannerPreview && (
                                                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                                        Banner Loaded
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Description *
                                </label>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{
                                        required: "Description is required",
                                    }}
                                    render={({ field }) => (
                                        <div
                                            className={`rounded overflow-hidden ${errors.description ? "border-2 border-red-500" : ""}`}
                                        >
                                            <ReactQuill
                                                ref={quillRefs.description}
                                                theme="snow"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={quillStyle(
                                                    "description",
                                                )}
                                                className="rounded h-auto quill-custom"
                                                placeholder={
                                                    quillPlaceholders.description
                                                }
                                            />
                                        </div>
                                    )}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Background */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Background
                                </label>
                                <Controller
                                    name="background"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="rounded overflow-hidden">
                                            <ReactQuill
                                                ref={quillRefs.background}
                                                theme="snow"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={quillStyle("background")}
                                                className="rounded h-auto quill-custom"
                                                placeholder={
                                                    quillPlaceholders.background
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Text */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Text
                                </label>
                                <Controller
                                    name="text"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="rounded overflow-hidden">
                                            <ReactQuill
                                                ref={quillRefs.text}
                                                theme="snow"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={quillStyle("text")}
                                                className="rounded h-auto quill-custom"
                                                placeholder={
                                                    quillPlaceholders.text
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Devnagari Text */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Devnagari Text
                                </label>
                                <Controller
                                    name="dev_text"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="rounded overflow-hidden">
                                            <ReactQuill
                                                ref={quillRefs.dev_text}
                                                theme="snow"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={quillStyle("dev_text")}
                                                className="rounded h-auto quill-custom"
                                                placeholder={
                                                    quillPlaceholders.dev_text
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Translation */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Translation
                                </label>
                                <Controller
                                    name="translation"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="rounded overflow-hidden">
                                            <ReactQuill
                                                ref={quillRefs.translation}
                                                theme="snow"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={quillStyle(
                                                    "translation",
                                                )}
                                                className="rounded h-auto quill-custom"
                                                placeholder={
                                                    quillPlaceholders.translation
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* References */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    References
                                </label>
                                <Controller
                                    name="references"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="rounded overflow-hidden">
                                            <ReactQuill
                                                ref={quillRefs.references}
                                                theme="snow"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={quillStyle("references")}
                                                className="rounded h-auto quill-custom"
                                                placeholder={
                                                    quillPlaceholders.references
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Glossary */}
                            <div>
                                <label className="block mb-2 font-medium text-base sm:text-lg">
                                    Glossary
                                </label>
                                <Controller
                                    name="glossary"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="rounded overflow-hidden">
                                            <ReactQuill
                                                ref={quillRefs.glossary}
                                                theme="snow"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                style={quillStyle("glossary")}
                                                className="rounded h-auto quill-custom"
                                                placeholder={
                                                    quillPlaceholders.glossary
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting || autoSaving}
                                    className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-base sm:text-lg ${submitting || autoSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                                >
                                    {submitting
                                        ? "Updating..."
                                        : autoSaving
                                          ? "Saving changes..."
                                          : "Update Inscription"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInscriptionForm;