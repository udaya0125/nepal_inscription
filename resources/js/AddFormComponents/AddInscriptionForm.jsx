// import { X, Camera, Upload, Video, Image } from "lucide-react";
// import React, { use, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// const AddInscriptionForm = ({ showForm, setShowForm, editingInscription }) => {
//     const inputClass =
//         "w-full p-2 rounded bg-[#afa593] text-[#2b2418] placeholder-[#4a3f2a] focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none";

//     const [bannerPreview, setBannerPreview] = useState(null);
//     const [imagesPreviews, setImagesPreviews] = useState([]);
//     const [videoPreview, setVideoPreview] = useState(null);

//     const [submitting, setSubmitting] = useState(false);
//     const [inscriptionForm, setInscriptionForm] = useState({
//         title: "",
//         banner_image: "",
//         images: "",
//         video: "",
//         description: "",
//         background: "",
//         text: "",
//         translation: "",
//         references: "",
//         glossary: "",
//     });

//     const {
//         register,
//         formState: { errors },
//         reset,
//         setValue,
//         watch,
//     } = useForm();

//     // use effects or handlers can go here

//     useEffect(() => {
//         if (editingInscription) {
//             setInscriptionForm({
//                 ...editingInscription,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setInscriptionForm({
//                 title: "",
//                 banner_image: "",
//                 images: "",
//                 video: "",
//                 description: "",
//                 background: "",
//                 text: "",
//                 translation: "",
//                 references: "",
//                 glossary: "",
//             });
//         }
//     }, [editingInscription]);

//     // handle create user
//     // Handle Create User
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourinscription.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating user", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in inscriptionForm) {
//             if (inscriptionForm[key] !== null && inscriptionForm[key] !== "") {
//                 formData.append(key, inscriptionForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingUser) {
//                 // Editing existing user
//                 await handleUpdate(formData, editingUser.id);
//             } else {
//                 // Creating new user
//                 await handleCreate(formData);
//             }
//             setInscriptionForm({
//                 title: "",
//                 banner_image: "",
//                 images: "",
//                 video: "",
//                 description: "",
//                 background: "",
//                 text: "",
//                 translation: "",
//                 references: "",
//                 glossary: "",
//             });

//             setShowForm(false);
//             setEditingInscription(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };


//      const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setInscriptionForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//     return (
//         <div
//             className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${
//                 showForm ? "block" : "hidden"
//             }`}
//         >
//             <div
//                 className="relative w-full max-w-xl h-[600px] rounded-xl shadow-2xl bg-cover bg-center"
//                 style={{
//                     backgroundImage: "url('/images/bg.jpeg')",
//                 }}
//             >
//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-black/20 rounded-xl"></div>

//                 {/* Content */}
//                 <div className="relative z-10 h-full flex flex-col px-6 py-6 text-[#5d4c2e]">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-2xl font-bold">Add Inscription</h2>
//                         <button
//                             onClick={handleClose}
//                             className="hover:text-red-500"
//                             type="button"
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>

//                     {/* Scrollable Form */}
//                     <div className="overflow-y-auto flex-1 pr-2">
//                         <form
//                             onSubmit={handleSubmit(onSubmit)}
//                             className="space-y-6"
//                         >
//                             {/* Title */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
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

//                             {/* Banner Image */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-[#5d4c2e]">
//                                     <Camera
//                                         className="mr-3 text-[#8b7355]"
//                                         size={22}
//                                     />
//                                     Banner Image (Single)
//                                 </label>
//                                 <div className="border-2 border-dashed border-[#8b7355] rounded-xl p-6 text-center hover:border-[#5d4c2e] transition-all duration-300 relative">
//                                     {bannerPreview ? (
//                                         <div className="space-y-4">
//                                             <div className="relative inline-block">
//                                                 <img
//                                                     src={bannerPreview}
//                                                     alt="Banner Preview"
//                                                     className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg"
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={clearBannerImage}
//                                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                                                 >
//                                                     <X size={16} />
//                                                 </button>
//                                             </div>
//                                             <p className="text-sm text-[#5d4c2e]">
//                                                 Click to change image
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-[#8b7355]" />
//                                             <p className="text-lg text-[#5d4c2e]">
//                                                 Click to upload banner image
//                                             </p>
//                                             <p className="text-sm text-[#8b7355]">
//                                                 Recommended: 1200x400px
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
//                                 <label className="flex items-center text-lg font-semibold text-[#5d4c2e]">
//                                     <Image
//                                         className="mr-3 text-[#8b7355]"
//                                         size={22}
//                                     />
//                                     Images (Multiple)
//                                 </label>
//                                 <div className="border-2 border-dashed border-[#8b7355] rounded-xl p-6 text-center hover:border-[#5d4c2e] transition-all duration-300 relative">
//                                     {imagesPreviews.length > 0 ? (
//                                         <div className="space-y-4">
//                                             <div className="grid grid-cols-3 gap-4">
//                                                 {imagesPreviews.map(
//                                                     (preview, index) => (
//                                                         <div
//                                                             key={index}
//                                                             className="relative"
//                                                         >
//                                                             <img
//                                                                 src={preview}
//                                                                 alt={`Preview ${index + 1}`}
//                                                                 className="h-24 w-full object-cover rounded-lg shadow"
//                                                             />
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() =>
//                                                                     clearImage(
//                                                                         index,
//                                                                     )
//                                                                 }
//                                                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                                                             >
//                                                                 <X size={14} />
//                                                             </button>
//                                                         </div>
//                                                     ),
//                                                 )}
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <p className="text-sm text-[#5d4c2e]">
//                                                     {imagesPreviews.length}{" "}
//                                                     image(s) selected
//                                                 </p>
//                                                 <p className="text-sm text-[#8b7355]">
//                                                     Click to add more images
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-[#8b7355]" />
//                                             <p className="text-lg text-[#5d4c2e]">
//                                                 Click to upload multiple images
//                                             </p>
//                                             <p className="text-sm text-[#8b7355]">
//                                                 Hold Ctrl/Cmd to select multiple
//                                                 files
//                                             </p>
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

//                             {/* Video */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-[#5d4c2e]">
//                                     <Video
//                                         className="mr-3 text-[#8b7355]"
//                                         size={22}
//                                     />
//                                     Video
//                                 </label>
//                                 <div className="border-2 border-dashed border-[#8b7355] rounded-xl p-6 text-center hover:border-[#5d4c2e] transition-all duration-300 relative">
//                                     {videoPreview ? (
//                                         <div className="space-y-4">
//                                             <div className="relative">
//                                                 <video
//                                                     src={videoPreview}
//                                                     className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg"
//                                                     controls
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={clearVideo}
//                                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                                                 >
//                                                     <X size={16} />
//                                                 </button>
//                                             </div>
//                                             <p className="text-sm text-[#5d4c2e]">
//                                                 Click to change video
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Video className="mx-auto h-12 w-12 text-[#8b7355]" />
//                                             <p className="text-lg text-[#5d4c2e]">
//                                                 Click to upload video
//                                             </p>
//                                             <p className="text-sm text-[#8b7355]">
//                                                 Max size: 50MB
//                                             </p>
//                                         </div>
//                                     )}
//                                     <input
//                                         type="file"
//                                         accept="video/*"
//                                         onChange={handleVideoChange}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
//                                     Description *
//                                 </label>
//                                 <textarea
//                                     rows="3"
//                                     className={`${inputClass} ${errors.description ? "border-2 border-red-500" : ""}`}
//                                     {...register("description", {
//                                         required: "Description is required",
//                                         minLength: {
//                                             value: 10,
//                                             message:
//                                                 "Description must be at least 10 characters",
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
//                                 <label className="block mb-2 font-medium text-lg">
//                                     Background
//                                 </label>
//                                 <textarea
//                                     rows="2"
//                                     className={inputClass}
//                                     {...register("background")}
//                                 />
//                             </div>

//                             {/* Text */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
//                                     Text
//                                 </label>
//                                 <textarea
//                                     rows="2"
//                                     className={inputClass}
//                                     {...register("text")}
//                                 />
//                             </div>

//                             {/* Translation */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
//                                     Translation
//                                 </label>
//                                 <textarea
//                                     rows="2"
//                                     className={inputClass}
//                                     {...register("translation")}
//                                 />
//                             </div>

//                             {/* References */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
//                                     References
//                                 </label>
//                                 <textarea
//                                     rows="2"
//                                     placeholder="Comma separated or URLs"
//                                     className={inputClass}
//                                     {...register("references")}
//                                 />
//                             </div>

//                             {/* Glossary */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
//                                     Glossary
//                                 </label>
//                                 <textarea
//                                     rows="2"
//                                     className={inputClass}
//                                     {...register("glossary")}
//                                 />
//                             </div>

//                             {/* Submit Button */}
//                             <div className="pt-4">
//                                 <button
//                                     type="submit"
//                                     className="w-full bg-[#afa593] text-[#2b2418] py-3 rounded-lg font-semibold hover:bg-[#9a8f7a] transition text-lg"
//                                 >
//                                     Submit Inscription
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddInscriptionForm;


import { X, Camera, Upload, Video, Image } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddInscriptionForm = ({ 
    showForm, 
    setShowForm, 
    editingInscription,
    setReloadTrigger,
    setEditingInscription 
}) => {
    const inputClass = "w-full p-2 rounded bg-[#f5f5f5] text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";
    
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

    // Quill height configuration - increased heights
    const quillHeight = {
        description: "250px",  // Increased from default
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
    const [imagesPreviews, setImagesPreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

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
                setBannerPreview(`/storage/${editingInscription.banner_image}`);
            }
            
            if (editingInscription.video) {
                setVideoPreview(`/storage/${editingInscription.video}`);
            }
            
            // Set previews for existing images
            if (editingInscription.images && editingInscription.images.length > 0) {
                const previews = editingInscription.images.map(img => `/storage/${img.image_path}`);
                setImagesPreviews(previews);
            }
        } else {
            reset();
            setDescription("");
            setBackground("");
            setText("");
            setTranslation("");
            setReferences("");
            setGlossary("");
            setBannerPreview(null);
            setBannerFile(null);
            setImagesPreviews([]);
            setImageFiles([]);
            setVideoPreview(null);
            setVideoFile(null);
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
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length !== files.length) {
                alert('Some files are not images and were ignored');
            }
            
            if (imageFiles.length > 0) {
                const newFiles = [...imageFiles];
                setImageFiles(prev => [...prev, ...newFiles]);
                
                // Create previews for new files
                newFiles.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImagesPreviews(prev => [...prev, reader.result]);
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
            const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/mkv'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, MKV)');
                return;
            }
            
            // Validate file size (100MB max)
            if (file.size > 100 * 1024 * 1024) {
                alert('Video file size should be less than 100MB');
                return;
            }
            
            setVideoFile(file);
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        }
    };

    // Handle Create Inscription
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourinscription.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error creating inscription", error);
            throw error;
        }
    };

    // Handle Update Inscription
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(route("ourinscription.update", id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
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
        const formData = new FormData();
        
        // Append all text fields
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                formData.append(key, data[key]);
            }
        });

        // Append banner file
        if (bannerFile) {
            formData.append('banner_image', bannerFile);
        }
        
        // Append video file
        if (videoFile) {
            formData.append('video', videoFile);
        }
        
        // Append multiple images correctly
        imageFiles.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        try {
            setSubmitting(true);
            
            let result;
            if (editingInscription) {
                result = await handleUpdate(formData, editingInscription.id);
            } else {
                result = await handleCreate(formData);
            }
            
            if (result.success) {
                // Reset and close form
                reset();
                setDescription("");
                setBackground("");
                setText("");
                setTranslation("");
                setReferences("");
                setGlossary("");
                setImagesPreviews([]);
                setImageFiles([]);
                setShowForm(false);
                setEditingInscription(null);
                alert(result.message || "Operation successful!");
            } else {
                alert(result.message || "Operation failed");
            }
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.errors?.images?.[0] || 
                               "Error saving inscription";
            alert(errorMessage);
            console.error("Submission error:", error.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle close form
    const handleClose = () => {
        // Clean up video URL if it exists
        if (videoPreview && videoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(videoPreview);
        }
        reset();
        setDescription("");
        setBackground("");
        setText("");
        setTranslation("");
        setReferences("");
        setGlossary("");
        setShowForm(false);
        setEditingInscription(null);
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Custom Quill CSS to match your theme with increased height
    const quillStyle = (field) => ({
        backgroundColor: '#f5f5f5',
        color: '#333',
        borderRadius: '0.375rem',
        border: '1px solid #d1d5db',
        height: quillHeight[field] || '200px' // Dynamic height based on field
    });

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}>
            <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
                {/* Content */}
                <div className="h-full flex flex-col px-6 py-6 text-gray-800">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">
                            {editingInscription ? "Edit Inscription" : "Add Inscription"}
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

                            {/* Banner Image */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700">
                                    <Camera className="mr-3 text-gray-600" size={22} />
                                    Banner Image (Single)
                                </label>
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative">
                                    {bannerPreview ? (
                                        <div className="space-y-4">
                                            <div className="relative inline-block">
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner Preview"
                                                    className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600">Click to change image</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-lg text-gray-700">Click to upload banner image</p>
                                            <p className="text-sm text-gray-500">Recommended: 1200x400px</p>
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
                                    Images (Multiple)
                                </label>
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative">
                                    {imagesPreviews.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                {imagesPreviews.map((preview, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="h-24 w-full object-cover rounded-lg shadow"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">
                                                    {imagesPreviews.length} image(s) selected
                                                </p>
                                                <p className="text-sm text-gray-500">Click to add more images</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-lg text-gray-700">Click to upload multiple images</p>
                                            <p className="text-sm text-gray-500">Hold Ctrl/Cmd to select multiple files</p>
                                        </div>
                                    )}
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
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative">
                                    {videoPreview ? (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <video
                                                    src={videoPreview}
                                                    className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg"
                                                    controls
                                                />
                                               
                                            </div>
                                            {videoFile && (
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600">
                                                        File: {videoFile.name} ({formatFileSize(videoFile.size)})
                                                    </p>
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-600">Click to change video</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Video className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-lg text-gray-700">Click to upload video</p>
                                            <p className="text-sm text-gray-500">
                                                Supported formats: MP4, AVI, MOV, WMV, FLV, MKV
                                            </p>
                                            <p className="text-sm text-gray-500">Max size: 100MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="video/mp4,video/avi,video/mov,video/wmv,video/flv,video/mkv"
                                        onChange={handleVideoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Description - React Quill with increased height */}
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
                                        className="rounded h-full"
                                    />
                                </div>
                                <input
                                    type="hidden"
                                    {...register("description", {
                                        required: "Description is required",
                                        validate: (value) => {
                                            // Remove HTML tags and check if there's actual content
                                            const textOnly = value?.replace(/<[^>]*>/g, '').trim();
                                            return textOnly && textOnly.length >= 10 || "Description must be at least 10 characters";
                                        },
                                    })}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Background - React Quill with increased height */}
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
                                        className="rounded h-full"
                                    />
                                </div>
                                <input type="hidden" {...register("background")} />
                            </div>

                            {/* Text - React Quill with increased height */}
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
                                        className="rounded h-full"
                                    />
                                </div>
                                <input type="hidden" {...register("text")} />
                            </div>

                            {/* Translation - React Quill with increased height */}
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
                                        className="rounded h-full"
                                    />
                                </div>
                                <input type="hidden" {...register("translation")} />
                            </div>

                            {/* References - React Quill with increased height */}
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
                                        className="rounded h-full"
                                    />
                                </div>
                                <input type="hidden" {...register("references")} />
                            </div>

                            {/* Glossary - React Quill with increased height */}
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
                                        className="rounded h-full"
                                    />
                                </div>
                                <input type="hidden" {...register("glossary")} />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full bg-gray-800 text-white py-3 rounded-lg font-semibold transition text-lg ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'}`}
                                >
                                    {submitting ? 'Saving...' : editingInscription ? 'Update Inscription' : 'Submit Inscription'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInscriptionForm;
