// import { X, Camera, Upload, Video, Image, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditInscriptionForm = ({ 
//     showForm, 
//     setShowForm, 
//     editingInscription,
//     setReloadTrigger
// }) => {
//     const inputClass = "w-full p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";
    
//     // Quill modules configuration
//     const quillModules = {
//         toolbar: [
//             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//             ['bold', 'italic', 'underline', 'strike'],
//             [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//             [{ 'script': 'sub'}, { 'script': 'super' }],
//             [{ 'indent': '-1'}, { 'indent': '+1' }],
//             [{ 'direction': 'rtl' }],
//             [{ 'size': ['small', false, 'large', 'huge'] }],
//             [{ 'color': [] }, { 'background': [] }],
//             [{ 'font': [] }],
//             [{ 'align': [] }],
//             ['link', 'image', 'video'],
//             ['clean']
//         ],
//     };

//     const quillFormats = [
//         'header',
//         'bold', 'italic', 'underline', 'strike',
//         'list', 'bullet', 'indent',
//         'link', 'image', 'video',
//         'script', 'color', 'background', 'font', 'align', 'size'
//     ];

//     // Quill height configuration
//     const quillHeight = {
//         description: "250px",
//         background: "200px",
//         text: "200px",
//         translation: "200px",
//         references: "200px",
//         glossary: "200px"
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
//     const [videoPreview, setVideoPreview] = useState(null);
//     const [videoFile, setVideoFile] = useState(null);
//     const [submitting, setSubmitting] = useState(false);
//     const [removingImageIds, setRemovingImageIds] = useState([]);

//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const {
//         register,
//         handleSubmit: handleFormSubmit,
//         formState: { errors },
//         reset,
//         setValue,
//     } = useForm();

//     // Initialize form with editing data
//     useEffect(() => {
//         if (editingInscription) {
//             // Set form values
//             setValue("title", editingInscription.title);
            
//             // Set Quill content values
//             setDescription(editingInscription.description || "");
//             setBackground(editingInscription.background || "");
//             setText(editingInscription.text || "");
//             setTranslation(editingInscription.translation || "");
//             setReferences(editingInscription.references || editingInscription.refrences || "");
//             setGlossary(editingInscription.glossary || "");
            
//             // Also set form values for validation
//             setValue("description", editingInscription.description || "");
//             setValue("background", editingInscription.background || "");
//             setValue("text", editingInscription.text || "");
//             setValue("translation", editingInscription.translation || "");
//             setValue("references", editingInscription.references || editingInscription.refrences || "");
//             setValue("glossary", editingInscription.glossary || "");
            
//             // Set previews for existing files
//             if (editingInscription.banner_image) {
//                 setBannerPreview(`${imgurl}/${editingInscription.banner_image}`);
//             }
            
//             if (editingInscription.video) {
//                 setVideoPreview(`${imgurl}/${editingInscription.video}`);
//             }
            
//             // Set existing images
//             if (editingInscription.images && editingInscription.images.length > 0) {
//                 setExistingImages(editingInscription.images);
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
//             if (!file.type.startsWith('image/')) {
//                 alert('Please select a valid image file');
//                 return;
//             }
            
//             // Validate file size (300MB max)
//             if (file.size > 300 * 1024 * 1024) {
//                 alert('Banner image size should be less than 300MB');
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
//             let imageFiles = files.filter(file => file.type.startsWith('image/'));
            
//             if (imageFiles.length !== files.length) {
//                 alert('Some files are not images and were ignored');
//             }
            
//             if (imageFiles.length > 0) {
//                 // Validate each file size (300MB max)
//                 const oversizedFiles = imageFiles.filter(file => file.size > 300 * 1024 * 1024);
//                 if (oversizedFiles.length > 0) {
//                     alert(`Some images exceed 300MB limit and were ignored`);
//                     imageFiles = imageFiles.filter(file => file.size <= 300 * 1024 * 1024);
//                 }
                
//                 const newFiles = [...imageFiles];
//                 setNewImageFiles(prev => [...prev, ...newFiles]);
                
//                 // Create previews for new files
//                 newFiles.forEach(file => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         setNewImagesPreviews(prev => [...prev, reader.result]);
//                     };
//                     reader.readAsDataURL(file);
//                 });
//             }
//         }
//     };

//     // Handle video change
//     const handleVideoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Validate file type
//             const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/mkv', 'video/webm'];
//             if (!validTypes.includes(file.type)) {
//                 alert('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, MKV, WEBM)');
//                 return;
//             }
            
//             // Validate file size (300MB max)
//             if (file.size > 300 * 1024 * 1024) {
//                 alert('Video file size should be less than 300MB');
//                 return;
//             }
            
//             setVideoFile(file);
//             const videoUrl = URL.createObjectURL(file);
//             setVideoPreview(videoUrl);
//         }
//     };

//     // Handle Update Inscription
//     const handleUpdate = async (formData) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(route("ourinscription.update", editingInscription.id), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//                 timeout: 300000, // 5 minutes timeout for large file uploads
//                 onUploadProgress: (progressEvent) => {
//                     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     console.log(`Upload progress: ${percentCompleted}%`);
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating inscription", error);
//             throw error;
//         }
//     };

//     // Remove existing image
//     const handleRemoveExistingImage = (imageId) => {
//         setRemovingImageIds(prev => [...prev, imageId]);
//         setExistingImages(prev => prev.filter(img => img.id !== imageId));
//     };

//     // Remove new image
//     const handleRemoveNewImage = (index) => {
//         setNewImagesPreviews(prev => prev.filter((_, i) => i !== index));
//         setNewImageFiles(prev => prev.filter((_, i) => i !== index));
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Validate video file size before submission
//         if (videoFile && videoFile.size > 300 * 1024 * 1024) {
//             alert('Video file size exceeds 300MB limit');
//             return;
//         }

//         // Validate banner image size
//         if (bannerFile && bannerFile.size > 300 * 1024 * 1024) {
//             alert('Banner image size exceeds 300MB limit');
//             return;
//         }

//         // Validate all new images size
//         const oversizedImages = newImageFiles.filter(file => file.size > 300 * 1024 * 1024);
//         if (oversizedImages.length > 0) {
//             alert(`Some images exceed 300MB limit. Please remove them.`);
//             return;
//         }

//         const formData = new FormData();
        
//         // Append all text fields
//         Object.keys(data).forEach(key => {
//             if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
//                 formData.append(key, data[key]);
//             }
//         });

//         // Append banner file if changed
//         if (bannerFile) {
//             formData.append('banner_image', bannerFile);
//         }
        
//         // Append video file if changed
//         if (videoFile) {
//             formData.append('video', videoFile);
//         }
        
//         // Append new images
//         newImageFiles.forEach((file, index) => {
//             formData.append(`images[${index}]`, file);
//         });
        
//         // Append removed image IDs
//         removingImageIds.forEach(id => {
//             formData.append('removed_image_ids[]', id);
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
//             const errorMessage = error.response?.data?.message || 
//                                error.response?.data?.errors?.images?.[0] || 
//                                error.response?.data?.errors?.video?.[0] ||
//                                error.response?.data?.errors?.banner_image?.[0] ||
//                                "Error updating inscription";
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
//         if (videoPreview && videoPreview.startsWith('blob:')) {
//             URL.revokeObjectURL(videoPreview);
//         }
//         setVideoPreview(null);
//         setVideoFile(null);
//         setRemovingImageIds([]);
//     };

//     // Handle close form
//     const handleClose = () => {
//         resetForm();
//         setShowForm(false);
//     };

//     // Format file size
//     const formatFileSize = (bytes) => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     };

//     // Custom Quill CSS
//     const quillStyle = (field) => ({
//         backgroundColor: 'white',
//         color: '#333',
//         borderRadius: '0.375rem',
//         border: '1px solid #d1d5db',
//         height: quillHeight[field] || '200px'
//     });

//     return (
//         <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}>
//             <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
//                 {/* Content */}
//                 <div className="h-full flex flex-col px-6 py-6 text-gray-800">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-2xl font-bold">
//                             Edit Inscription
//                         </h2>
//                         <button onClick={handleClose} className="hover:text-red-500" type="button">
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>

//                     {/* Scrollable Form */}
//                     <div className="overflow-y-auto flex-1 pr-2 space-y-6">
//                         <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
//                             {/* Title */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">Title *</label>
//                                 <input
//                                     type="text"
//                                     className={`${inputClass} ${errors.title ? "border-2 border-red-500" : ""}`}
//                                     {...register("title", {
//                                         required: "Title is required",
//                                         minLength: {
//                                             value: 3,
//                                             message: "Title must be at least 3 characters",
//                                         },
//                                     })}
//                                 />
//                                 {errors.title && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//                                 )}
//                             </div>

//                             {/* Banner Image */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Camera className="mr-3 text-gray-600" size={22} />
//                                     Banner Image (Single)
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {bannerPreview ? (
//                                         <div className="space-y-4">
//                                             <div className="relative inline-block">
//                                                 <img
//                                                     src={bannerPreview}
//                                                     alt="Banner Preview"
//                                                     className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg bg-white"
//                                                 />
//                                                 {bannerFile && (
//                                                     <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
//                                                         New
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <p className="text-sm text-gray-600">Click to change image</p>
//                                             <p className="text-xs text-gray-500">Max size: 300MB</p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">Click to upload banner image</p>
//                                             <p className="text-sm text-gray-500">Recommended: 1200x400px</p>
//                                             <p className="text-sm text-gray-500">Max size: 300MB</p>
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
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Image className="mr-3 text-gray-600" size={22} />
//                                     Images (Multiple)
//                                 </label>
                                
//                                 {/* Existing Images */}
//                                 {existingImages.length > 0 && (
//                                     <div className="mb-4">
//                                         <h4 className="text-md font-medium text-gray-700 mb-2">Existing Images</h4>
//                                         <div className="grid grid-cols-3 gap-3 mb-4">
//                                             {existingImages.map((image) => (
//                                                 <div key={image.id} className="relative group">
//                                                     <img
//                                                         src={`${imgurl}/${image.image_path}`}
//                                                         alt={`Existing image`}
//                                                         className="h-24 w-full object-cover rounded-lg shadow bg-white"
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => handleRemoveExistingImage(image.id)}
//                                                         className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
//                                                         title="Remove image"
//                                                     >
//                                                         <Trash2 size={12} />
//                                                     </button>
//                                                     {removingImageIds.includes(image.id) && (
//                                                         <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
//                                                             <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">Removing</span>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
                                
//                                 {/* New Images Upload */}
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {newImagesPreviews.length > 0 || existingImages.length > 0 ? (
//                                         <div className="space-y-4">
//                                             {newImagesPreviews.length > 0 && (
//                                                 <div>
//                                                     <h4 className="text-md font-medium text-gray-700 mb-2">New Images</h4>
//                                                     <div className="grid grid-cols-3 gap-3 mb-4">
//                                                         {newImagesPreviews.map((preview, index) => (
//                                                             <div key={index} className="relative group">
//                                                                 <img
//                                                                     src={preview}
//                                                                     alt={`New image ${index + 1}`}
//                                                                     className="h-24 w-full object-cover rounded-lg shadow bg-white"
//                                                                 />
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() => handleRemoveNewImage(index)}
//                                                                     className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
//                                                                     title="Remove image"
//                                                                 >
//                                                                     <Trash2 size={12} />
//                                                                 </button>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             <div className="space-y-2">
//                                                 <p className="text-sm text-gray-600">
//                                                     Total: {existingImages.length + newImagesPreviews.length} image(s)
//                                                 </p>
//                                                 <p className="text-sm text-gray-500">Click to add more images</p>
//                                                 <p className="text-xs text-gray-500">Max size: 300MB per file</p>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">Click to upload multiple images</p>
//                                             <p className="text-sm text-gray-500">Hold Ctrl/Cmd to select multiple files</p>
//                                             <p className="text-sm text-gray-500">Max size: 300MB per file</p>
//                                         </div>
//                                     )}
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={handleImagesChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Video Upload */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Video className="mr-3 text-gray-600" size={22} />
//                                     Video Upload
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {videoPreview ? (
//                                         <div className="space-y-4">
//                                             <div className="relative">
//                                                 <video
//                                                     src={videoPreview}
//                                                     className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg bg-white"
//                                                     controls
//                                                 />
//                                                 {videoFile && (
//                                                     <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
//                                                         New
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             {videoFile ? (
//                                                 <div className="text-center">
//                                                     <p className="text-sm text-gray-600">
//                                                         File: {videoFile.name} ({formatFileSize(videoFile.size)})
//                                                     </p>
//                                                 </div>
//                                             ) : editingInscription.video && (
//                                                 <div className="text-center">
//                                                     <p className="text-sm text-gray-600">
//                                                         Current video will be kept
//                                                     </p>
//                                                 </div>
//                                             )}
//                                             <p className="text-sm text-gray-600">Click to change video</p>
//                                             <p className="text-xs text-gray-500">Max size: 300MB</p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Video className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">Click to upload video</p>
//                                             <p className="text-sm text-gray-500">
//                                                 Supported formats: MP4, AVI, MOV, WMV, FLV, MKV, WEBM
//                                             </p>
//                                             <p className="text-sm text-gray-500">Max size: 300MB</p>
//                                         </div>
//                                     )}
//                                     <input
//                                         type="file"
//                                         accept="video/mp4,video/avi,video/mov,video/wmv,video/flv,video/mkv,video/webm"
//                                         onChange={handleVideoChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">Description *</label>
//                                 <div className={`rounded overflow-hidden ${errors.description ? "border-2 border-red-500" : ""}`}>
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={description}
//                                         onChange={handleDescriptionChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={quillStyle('description')}
//                                         className="rounded h-full"
//                                     />
//                                 </div>
//                                 <input
//                                     type="hidden"
//                                     {...register("description", {
//                                         required: "Description is required",
//                                         validate: (value) => {
//                                             const textOnly = value?.replace(/<[^>]*>/g, '').trim();
//                                             return textOnly && textOnly.length >= 10 || "Description must be at least 10 characters";
//                                         },
//                                     })}
//                                 />
//                                 {errors.description && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
//                                 )}
//                             </div>

//                             {/* Background */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">Background</label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={background}
//                                         onChange={handleBackgroundChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={quillStyle('background')}
//                                         className="rounded h-full"
//                                     />
//                                 </div>
//                                 <input type="hidden" {...register("background")} />
//                             </div>

//                             {/* Text */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">Text</label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={text}
//                                         onChange={handleTextChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={quillStyle('text')}
//                                         className="rounded h-full"
//                                     />
//                                 </div>
//                                 <input type="hidden" {...register("text")} />
//                             </div>

//                             {/* Translation */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">Translation</label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={translation}
//                                         onChange={handleTranslationChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={quillStyle('translation')}
//                                         className="rounded h-full"
//                                     />
//                                 </div>
//                                 <input type="hidden" {...register("translation")} />
//                             </div>

//                             {/* References */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">References</label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={references}
//                                         onChange={handleReferencesChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={quillStyle('references')}
//                                         className="rounded h-full"
//                                     />
//                                 </div>
//                                 <input type="hidden" {...register("references")} />
//                             </div>

//                             {/* Glossary */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">Glossary</label>
//                                 <div className="rounded overflow-hidden">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={glossary}
//                                         onChange={handleGlossaryChange}
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         style={quillStyle('glossary')}
//                                         className="rounded h-full"
//                                     />
//                                 </div>
//                                 <input type="hidden" {...register("glossary")} />
//                             </div>

//                             {/* Submit Button */}
//                             <div className="pt-4">
//                                 <button
//                                     type="submit"
//                                     disabled={submitting}
//                                     className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-lg ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
//                                 >
//                                     {submitting ? 'Updating...' : 'Update Inscription'}
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



import { X, Camera, Upload, Video, Image, Trash2, GripVertical } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditInscriptionForm = ({ 
    showForm, 
    setShowForm, 
    editingInscription,
    setReloadTrigger
}) => {
    const inputClass = "w-full p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";
    
    // Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'script', 'color', 'background', 'font', 'align', 'size'
    ];

    // Quill height configuration
    const quillHeight = {
        description: "250px",
        background: "200px",
        text: "200px",
        translation: "200px",
        references: "200px",
        glossary: "200px"
    };

    // State for React Quill content
    const [description, setDescription] = useState("");
    const [background, setBackground] = useState("");
    const [text, setText] = useState("");
    const [translation, setTranslation] = useState("");
    const [references, setReferences] = useState("");
    const [glossary, setGlossary] = useState("");

    const [bannerPreview, setBannerPreview] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [newImagesPreviews, setNewImagesPreviews] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [removingImageIds, setRemovingImageIds] = useState([]);
    const [draggingImage, setDraggingImage] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();

    // Initialize form with editing data
    useEffect(() => {
        if (editingInscription) {
            // Set form values
            setValue("title", editingInscription.title);
            setValue("inscription_number", editingInscription.inscription_number);
            setValue("status", editingInscription.status || "draft");
            
            // Set Quill content values
            setDescription(editingInscription.description || "");
            setBackground(editingInscription.background || "");
            setText(editingInscription.text || "");
            setTranslation(editingInscription.translation || "");
            setReferences(editingInscription.references || editingInscription.refrences || "");
            setGlossary(editingInscription.glossary || "");
            
            // Also set form values for validation
            setValue("description", editingInscription.description || "");
            setValue("background", editingInscription.background || "");
            setValue("text", editingInscription.text || "");
            setValue("translation", editingInscription.translation || "");
            setValue("references", editingInscription.references || editingInscription.refrences || "");
            setValue("glossary", editingInscription.glossary || "");
            
            // Set previews for existing files
            if (editingInscription.banner_image) {
                setBannerPreview(`${imgurl}/${editingInscription.banner_image}`);
            }
            
            if (editingInscription.video) {
                setVideoPreview(`${imgurl}/${editingInscription.video}`);
            }
            
            // Set existing images with sort_order
            if (editingInscription.images && editingInscription.images.length > 0) {
                // Sort existing images by sort_order
                const sortedImages = [...editingInscription.images].sort((a, b) => 
                    (a.sort_order || 0) - (b.sort_order || 0)
                );
                setExistingImages(sortedImages);
            }
        } else {
            resetForm();
        }
    }, [editingInscription, reset, setValue]);

    // Handle Quill change functions
    const handleDescriptionChange = (content) => {
        setDescription(content);
        setValue("description", content, { shouldValidate: true });
    };

    const handleBackgroundChange = (content) => {
        setBackground(content);
        setValue("background", content);
    };

    const handleTextChange = (content) => {
        setText(content);
        setValue("text", content);
    };

    const handleTranslationChange = (content) => {
        setTranslation(content);
        setValue("translation", content);
    };

    const handleReferencesChange = (content) => {
        setReferences(content);
        setValue("references", content);
    };

    const handleGlossaryChange = (content) => {
        setGlossary(content);
        setValue("glossary", content);
    };

    // Handle banner image change
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image file
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }
            
            // Validate file size (300MB max)
            if (file.size > 300 * 1024 * 1024) {
                alert('Banner image size should be less than 300MB');
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

    // Handle multiple images change
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Filter only image files
            let imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length !== files.length) {
                alert('Some files are not images and were ignored');
            }
            
            if (imageFiles.length > 0) {
                // Validate each file size (300MB max)
                const oversizedFiles = imageFiles.filter(file => file.size > 300 * 1024 * 1024);
                if (oversizedFiles.length > 0) {
                    alert(`Some images exceed 300MB limit and were ignored`);
                    imageFiles = imageFiles.filter(file => file.size <= 300 * 1024 * 1024);
                }
                
                const newFiles = [...imageFiles];
                setNewImageFiles(prev => [...prev, ...newFiles]);
                
                // Create previews for new files with temporary sort_order
                newFiles.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const newPreview = {
                            id: `new-${Date.now()}-${index}`,
                            preview: reader.result,
                            file: file,
                            sort_order: newImagesPreviews.length + existingImages.length + index
                        };
                        setNewImagesPreviews(prev => [...prev, newPreview]);
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    };

    // Handle video change
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/mkv', 'video/webm'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, MKV, WEBM)');
                return;
            }
            
            // Validate file size (300MB max)
            if (file.size > 300 * 1024 * 1024) {
                alert('Video file size should be less than 300MB');
                return;
            }
            
            setVideoFile(file);
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        }
    };

    // Drag and drop handlers for existing images
    const handleDragStart = useCallback((e, index, type) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ index, type }));
        setDraggingImage({ index, type });
        e.currentTarget.classList.add('opacity-50');
    }, []);

    const handleDragOver = useCallback((e, index, type) => {
        e.preventDefault();
        setDragOverIndex({ index, type });
    }, []);

    const handleDragEnd = useCallback((e) => {
        e.preventDefault();
        setDraggingImage(null);
        setDragOverIndex(null);
        e.currentTarget.classList.remove('opacity-50');
    }, []);

    const handleDrop = useCallback((e, dropIndex, dropType) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { index: dragIndex, type: dragType } = data;

        if (dragType === dropType) {
            if (dragType === 'existing') {
                // Reorder existing images
                const updatedImages = [...existingImages];
                const [draggedItem] = updatedImages.splice(dragIndex, 1);
                updatedImages.splice(dropIndex, 0, draggedItem);
                
                // Update sort_order based on new position
                const reorderedImages = updatedImages.map((img, idx) => ({
                    ...img,
                    sort_order: idx + 1
                }));
                
                setExistingImages(reorderedImages);
            } else if (dragType === 'new') {
                // Reorder new images
                const updatedPreviews = [...newImagesPreviews];
                const [draggedItem] = updatedPreviews.splice(dragIndex, 1);
                updatedPreviews.splice(dropIndex, 0, draggedItem);
                
                // Update sort_order based on new position
                const reorderedPreviews = updatedPreviews.map((preview, idx) => ({
                    ...preview,
                    sort_order: existingImages.length + idx + 1
                }));
                
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
    }, [existingImages, newImagesPreviews, newImageFiles]);

    // Remove existing image
    const handleRemoveExistingImage = (imageId) => {
        setRemovingImageIds(prev => [...prev, imageId]);
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
    };

    // Remove new image
    const handleRemoveNewImage = (index) => {
        setNewImagesPreviews(prev => prev.filter((_, i) => i !== index));
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle Update Inscription
    const handleUpdate = async (formData) => {
        try {
            // Add sort_order data for existing images
            existingImages.forEach((img, index) => {
                formData.append(`existing_image_sort[${img.id}]`, index + 1);
            });
            
            // Add sort_order for new images
            newImagesPreviews.forEach((preview, index) => {
                formData.append(`new_image_sort[${index}]`, existingImages.length + index + 1);
            });

            formData.append("_method", "PUT");
            const response = await axios.post(route("ourinscription.update", editingInscription.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 300000,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`Upload progress: ${percentCompleted}%`);
                },
            });
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error updating inscription", error);
            throw error;
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        // Validate video file size before submission
        if (videoFile && videoFile.size > 300 * 1024 * 1024) {
            alert('Video file size exceeds 300MB limit');
            return;
        }

        // Validate banner image size
        if (bannerFile && bannerFile.size > 300 * 1024 * 1024) {
            alert('Banner image size exceeds 300MB limit');
            return;
        }

        // Validate all new images size
        const oversizedImages = newImageFiles.filter(file => file.size > 300 * 1024 * 1024);
        if (oversizedImages.length > 0) {
            alert(`Some images exceed 300MB limit. Please remove them.`);
            return;
        }

        const formData = new FormData();
        
        // Append all text fields
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                formData.append(key, data[key]);
            }
        });

        // Append banner file if changed
        if (bannerFile) {
            formData.append('banner_image', bannerFile);
        }
        
        // Append video file if changed
        if (videoFile) {
            formData.append('video', videoFile);
        }
        
        // Append new images
        newImageFiles.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });
        
        // Append removed image IDs
        removingImageIds.forEach(id => {
            formData.append('removed_image_ids[]', id);
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
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.errors?.images?.[0] || 
                               error.response?.data?.errors?.video?.[0] ||
                               error.response?.data?.errors?.banner_image?.[0] ||
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
        setDescription("");
        setBackground("");
        setText("");
        setTranslation("");
        setReferences("");
        setGlossary("");
        setBannerPreview(null);
        setBannerFile(null);
        setExistingImages([]);
        setNewImagesPreviews([]);
        setNewImageFiles([]);
        if (videoPreview && videoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(videoPreview);
        }
        setVideoPreview(null);
        setVideoFile(null);
        setRemovingImageIds([]);
        setDraggingImage(null);
        setDragOverIndex(null);
    };

    // Handle close form
    const handleClose = () => {
        resetForm();
        setShowForm(false);
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Custom Quill CSS
    const quillStyle = (field) => ({
        backgroundColor: 'white',
        color: '#333',
        borderRadius: '0.375rem',
        border: '1px solid #d1d5db',
        height: quillHeight[field] || '200px'
    });

    return (
        <div className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}>
            <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
                {/* Content */}
                <div className="h-full flex flex-col px-6 py-6 text-gray-800">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">
                            Edit Inscription
                        </h2>
                        <button onClick={handleClose} className="hover:text-red-500" type="button">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="overflow-y-auto flex-1 pr-2 space-y-6">
                        <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">Title *</label>
                                <input
                                    type="text"
                                    className={`${inputClass} ${errors.title ? "border-2 border-red-500" : ""}`}
                                    {...register("title", {
                                        required: "Title is required",
                                        minLength: {
                                            value: 3,
                                            message: "Title must be at least 3 characters",
                                        },
                                    })}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Inscription Number */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">Inscription Number *</label>
                                <input
                                    type="text"
                                    className={`${inputClass} ${errors.inscription_number ? "border-2 border-red-500" : ""}`}
                                    {...register("inscription_number", {
                                        required: "Inscription number is required",
                                        minLength: {
                                            value: 1,
                                            message: "Inscription number must be at least 1 character",
                                        },
                                    })}
                                />
                                {errors.inscription_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.inscription_number.message}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">Status *</label>
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
                                    <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                                )}
                            </div>

                            {/* Banner Image */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700">
                                    <Camera className="mr-3 text-gray-600" size={22} />
                                    Banner Image (Single)
                                </label>
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                                    {bannerPreview ? (
                                        <div className="space-y-4">
                                            <div className="relative inline-block">
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner Preview"
                                                    className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg bg-white"
                                                />
                                                {bannerFile && (
                                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                                                        New
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">Click to change image</p>
                                            <p className="text-xs text-gray-500">Max size: 300MB</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-lg text-gray-700">Click to upload banner image</p>
                                            <p className="text-sm text-gray-500">Recommended: 1200x400px</p>
                                            <p className="text-sm text-gray-500">Max size: 300MB</p>
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

                            {/* Multiple Images */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700">
                                    <Image className="mr-3 text-gray-600" size={22} />
                                    Gallery Images (Drag to reorder)
                                </label>
                                
                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-md font-medium text-gray-700 mb-2">Existing Images</h4>
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            {existingImages.map((image, index) => (
                                                <div 
                                                    key={image.id} 
                                                    className={`relative group border-2 rounded-lg transition-all duration-200 ${
                                                        dragOverIndex?.index === index && dragOverIndex?.type === 'existing' 
                                                            ? 'border-blue-500 bg-blue-50' 
                                                            : 'border-transparent'
                                                    } ${
                                                        draggingImage?.index === index && draggingImage?.type === 'existing'
                                                            ? 'cursor-grabbing'
                                                            : 'cursor-grab'
                                                    }`}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, index, 'existing')}
                                                    onDragOver={(e) => handleDragOver(e, index, 'existing')}
                                                    onDragEnd={handleDragEnd}
                                                    onDrop={(e) => handleDrop(e, index, 'existing')}
                                                >
                                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-t-lg border-b">
                                                        <GripVertical className="text-gray-400 cursor-move" size={16} />
                                                        <span className="text-xs text-gray-600 font-medium">
                                                            Position: {index + 1}
                                                        </span>
                                                    </div>
                                                    <img
                                                        src={`${imgurl}/${image.image_path}`}
                                                        alt={`Existing image`}
                                                        className="h-20 w-full object-cover rounded-b-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingImage(image.id)}
                                                        className="absolute top-10 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                                        title="Remove image"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                    {removingImageIds.includes(image.id) && (
                                                        <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                            <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">Removing</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* New Images */}
                                {newImagesPreviews.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-md font-medium text-gray-700 mb-2">New Images (Will be added after existing)</h4>
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            {newImagesPreviews.map((preview, index) => (
                                                <div 
                                                    key={preview.id} 
                                                    className={`relative group border-2 rounded-lg transition-all duration-200 ${
                                                        dragOverIndex?.index === index && dragOverIndex?.type === 'new' 
                                                            ? 'border-blue-500 bg-blue-50' 
                                                            : 'border-transparent'
                                                    } ${
                                                        draggingImage?.index === index && draggingImage?.type === 'new'
                                                            ? 'cursor-grabbing'
                                                            : 'cursor-grab'
                                                    }`}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, index, 'new')}
                                                    onDragOver={(e) => handleDragOver(e, index, 'new')}
                                                    onDragEnd={handleDragEnd}
                                                    onDrop={(e) => handleDrop(e, index, 'new')}
                                                >
                                                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-t-lg border-b border-blue-200">
                                                        <GripVertical className="text-blue-400 cursor-move" size={16} />
                                                        <span className="text-xs text-blue-600 font-medium">
                                                            Position: {existingImages.length + index + 1}
                                                        </span>
                                                    </div>
                                                    <img
                                                        src={preview.preview}
                                                        alt={`New image ${index + 1}`}
                                                        className="h-20 w-full object-cover rounded-b-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewImage(index)}
                                                        className="absolute top-10 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                                        title="Remove image"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Images Upload Area */}
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                                    <div className="space-y-4">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div>
                                            <p className="text-lg text-gray-700">Click to upload multiple images</p>
                                            <p className="text-sm text-gray-500">Hold Ctrl/Cmd to select multiple files</p>
                                        </div>
                                        {existingImages.length + newImagesPreviews.length > 0 && (
                                            <div className="mt-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Total Images: {existingImages.length + newImagesPreviews.length}
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

                            {/* Video Upload */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700">
                                    <Video className="mr-3 text-gray-600" size={22} />
                                    Video Upload
                                </label>
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                                    {videoPreview ? (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <video
                                                    src={videoPreview}
                                                    className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg bg-white"
                                                    controls
                                                />
                                                {videoFile && (
                                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                                                        New
                                                    </div>
                                                )}
                                            </div>
                                            {videoFile ? (
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600">
                                                        File: {videoFile.name} ({formatFileSize(videoFile.size)})
                                                    </p>
                                                </div>
                                            ) : editingInscription.video && (
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600">
                                                        Current video will be kept
                                                    </p>
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-600">Click to change video</p>
                                            <p className="text-xs text-gray-500">Max size: 300MB</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Video className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-lg text-gray-700">Click to upload video</p>
                                            <p className="text-sm text-gray-500">
                                                Supported formats: MP4, AVI, MOV, WMV, FLV, MKV, WEBM
                                            </p>
                                            <p className="text-sm text-gray-500">Max size: 300MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="video/mp4,video/avi,video/mov,video/wmv,video/flv,video/mkv,video/webm"
                                        onChange={handleVideoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">Description *</label>
                                <div className={`rounded overflow-hidden ${errors.description ? "border-2 border-red-500" : ""}`}>
                                    <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={quillStyle('description')}
                                        className="rounded h-full quill-custom"
                                    />
                                </div>
                                <input
                                    type="hidden"
                                    {...register("description", {
                                        required: "Description is required",
                                        validate: (value) => {
                                            const textOnly = value?.replace(/<[^>]*>/g, '').trim();
                                            return textOnly && textOnly.length >= 10 || "Description must be at least 10 characters";
                                        },
                                    })}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Background */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">Background</label>
                                <div className="rounded overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={background}
                                        onChange={handleBackgroundChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={quillStyle('background')}
                                        className="rounded h-full quill-custom"
                                    />
                                </div>
                                <input type="hidden" {...register("background")} />
                            </div>

                            {/* Text */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">Text</label>
                                <div className="rounded overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={text}
                                        onChange={handleTextChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={quillStyle('text')}
                                        className="rounded h-full quill-custom"
                                    />
                                </div>
                                <input type="hidden" {...register("text")} />
                            </div>

                            {/* Translation */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">Translation</label>
                                <div className="rounded overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={translation}
                                        onChange={handleTranslationChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={quillStyle('translation')}
                                        className="rounded h-full quill-custom"
                                    />
                                </div>
                                <input type="hidden" {...register("translation")} />
                            </div>

                            {/* References */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">References</label>
                                <div className="rounded overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={references}
                                        onChange={handleReferencesChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={quillStyle('references')}
                                        className="rounded h-full quill-custom"
                                    />
                                </div>
                                <input type="hidden" {...register("references")} />
                            </div>

                            {/* Glossary */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">Glossary</label>
                                <div className="rounded overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={glossary}
                                        onChange={handleGlossaryChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        style={quillStyle('glossary')}
                                        className="rounded h-full quill-custom"
                                    />
                                </div>
                                <input type="hidden" {...register("glossary")} />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-lg ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                >
                                    {submitting ? 'Updating...' : 'Update Inscription'}
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