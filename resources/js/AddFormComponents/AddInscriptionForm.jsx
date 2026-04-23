import { X, Camera, Upload, Video, Image, Link, Film } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddInscriptionForm = ({ showForm, setShowForm, setReloadTrigger }) => {
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

        dev_text:
            "Enter the Devnagari text in numbered format (1. First line, 2. Second line, 3. Third line)...",

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
    const [imagesPreviews, setImagesPreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit: handleFormSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
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

    // Handle banner image change
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image file
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file");
                return;
            }

            // Validate file size
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

            // Validate file size
            if (file.size > MAX_IMAGE_SIZE) {
                alert(
                    `Video banner size should be less than 150MB (Current: ${formatFileSize(file.size)})`,
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
                // Validate each file size
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
                setImageFiles((prev) => [...prev, ...newFiles]);

                // Create previews for new files
                newFiles.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImagesPreviews((prev) => [...prev, reader.result]);
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

    // Handle Create Inscription
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(
                route("ourinscription.store"),
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
            console.error("Error creating inscription", error);
            throw error;
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        // Validate banner image size
        if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) {
            alert(
                `Banner image size exceeds 150MB limit (Current: ${formatFileSize(bannerFile.size)})`,
            );
            return;
        }

        // Validate video banner size
        if (videoBannerFile && videoBannerFile.size > MAX_IMAGE_SIZE) {
            alert(
                `Video banner size exceeds 150MB limit (Current: ${formatFileSize(videoBannerFile.size)})`,
            );
            return;
        }

        // Validate all images size
        const oversizedImages = imageFiles.filter(
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

        // Automatically append status as "draft"
        formData.append("status", "draft");

        // Append banner file
        if (bannerFile) {
            formData.append("banner_image", bannerFile);
        }

        // Append video banner file
        if (videoBannerFile) {
            formData.append("video_banner", videoBannerFile);
        }

        // Append video URL (no file upload)
        if (videoUrl) {
            formData.append("video", videoUrl);
        }

        // Append multiple images correctly
        imageFiles.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        try {
            setSubmitting(true);

            const result = await handleCreate(formData);

            if (result.success) {
                // Reset and close form
                resetForm();
                alert(result.message || "Inscription added successfully!");
                setShowForm(false);
            } else {
                alert(result.message || "Failed to add inscription");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.errors?.images?.[0] ||
                error.response?.data?.errors?.video?.[0] ||
                error.response?.data?.errors?.banner_image?.[0] ||
                error.response?.data?.errors?.video_banner?.[0] ||
                error.response?.data?.errors?.inscription_number?.[0] ||
                "Error saving inscription";
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
        setImagesPreviews([]);
        setImageFiles([]);
        setVideoUrl("");
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

    return (
        <div
            className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}
        >
            <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
                {/* Content */}
                <div className="h-full flex flex-col px-6 py-6 text-gray-800">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Add Inscription</h2>
                        <button
                            onClick={handleClose}
                            className="hover:text-red-500"
                            type="button"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="overflow-y-auto flex-1 pr-2 space-y-6">
                        <form
                            onSubmit={handleFormSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Title */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">
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
                                <label className="block mb-2 font-medium text-lg">
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

                            {/* Banner Image */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700">
                                    <Camera
                                        className="mr-3 text-gray-600"
                                        size={22}
                                    />
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
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Click to change image
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-lg text-gray-700">
                                                Click to upload banner image
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Recommended: 1200x400px | Max:
                                                150MB
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
                                <label className="flex items-center text-lg font-semibold text-gray-700">
                                    <Film
                                        className="mr-3 text-gray-600"
                                        size={22}
                                    />
                                    Video Banner/Thumbnail (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                                    {videoBannerPreview ? (
                                        <div className="space-y-4">
                                            <div className="relative inline-block">
                                                <img
                                                    src={videoBannerPreview}
                                                    alt="Video Banner Preview"
                                                    className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg bg-white"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Click to change video banner
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-lg text-gray-700">
                                                Click to upload video
                                                banner/thumbnail
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Used as video thumbnail | Max:
                                                150MB
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
                                <label className="flex items-center text-lg font-semibold text-gray-700">
                                    <Image
                                        className="mr-3 text-gray-600"
                                        size={22}
                                    />
                                    Images (Multiple)
                                </label>
                                <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                                    {imagesPreviews.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                {imagesPreviews.map(
                                                    (preview, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative"
                                                        >
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="h-24 w-full object-cover rounded-lg shadow bg-white"
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">
                                                    {imagesPreviews.length}{" "}
                                                    image(s) selected
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Click to add more images
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-lg text-gray-700">
                                                Click to upload multiple images
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Hold Ctrl/Cmd to select multiple
                                                files | Max: 150MB per file
                                            </p>
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

                            {/* Video URL Input */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700">
                                    <Link
                                        className="mr-3 text-gray-600"
                                        size={22}
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
                                        <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    </div>

                                    {videoUrl && isVideoUrl(videoUrl) && (
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                Video Preview:
                                            </p>
                                            <div className="relative">
                                                <video
                                                    src={
                                                        videoUrl.startsWith(
                                                            "http",
                                                        )
                                                            ? videoUrl
                                                            : `/storage/${videoUrl}`
                                                    }
                                                    className="w-full h-48 object-cover rounded-lg"
                                                    controls
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 font-medium text-lg">
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
                                <label className="block mb-2 font-medium text-lg">
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
                                <label className="block mb-2 font-medium text-lg">
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
                                <label className="block mb-2 font-medium text-lg">
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
                                <label className="block mb-2 font-medium text-lg">
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
                                <label className="block mb-2 font-medium text-lg">
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
                                <label className="block mb-2 font-medium text-lg">
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
                                    disabled={submitting}
                                    className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-lg ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                                >
                                    {submitting
                                        ? "Saving..."
                                        : "Add Inscription"}
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

// import { X, Camera, Upload, Video, Image } from "lucide-react";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const AddInscriptionForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger
// }) => {
//     const inputClass = "w-full p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";

//     // File size limits in bytes
//     const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
//     const MAX_IMAGE_SIZE = 150 * 1024 * 1024; // 150MB

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
//         background: "250px",
//         text: "250px",
//         translation: "250px",
//         references: "250px",
//         glossary: "250px"
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
//     const [imagesPreviews, setImagesPreviews] = useState([]);
//     const [imageFiles, setImageFiles] = useState([]);
//     const [videoPreview, setVideoPreview] = useState(null);
//     const [videoFile, setVideoFile] = useState(null);
//     const [submitting, setSubmitting] = useState(false);

//     const {
//         register,
//         handleSubmit: handleFormSubmit,
//         formState: { errors },
//         reset,
//         setValue,
//     } = useForm();

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

//             // Validate file size (150MB max for images)
//             if (file.size > MAX_IMAGE_SIZE) {
//                 alert(`Banner image size should be less than 150MB (Current: ${formatFileSize(file.size)})`);
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
//                 // Validate each file size (150MB max)
//                 const oversizedFiles = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
//                 if (oversizedFiles.length > 0) {
//                     alert(`${oversizedFiles.length} image(s) exceed 150MB limit and were ignored`);
//                     imageFiles = imageFiles.filter(file => file.size <= MAX_IMAGE_SIZE);
//                 }

//                 const newFiles = [...imageFiles];
//                 setImageFiles(prev => [...prev, ...newFiles]);

//                 // Create previews for new files
//                 newFiles.forEach(file => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         setImagesPreviews(prev => [...prev, reader.result]);
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

//             // Validate file size (500MB max for videos)
//             if (file.size > MAX_VIDEO_SIZE) {
//                 alert(`Video file size should be less than 500MB (Current: ${formatFileSize(file.size)})`);
//                 return;
//             }

//             setVideoFile(file);
//             const videoUrl = URL.createObjectURL(file);
//             setVideoPreview(videoUrl);
//         }
//     };

//     // Handle Create Inscription
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourinscription.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//                 timeout: 1200000, // 20 minutes timeout for large file uploads
//                 onUploadProgress: (progressEvent) => {
//                     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     console.log(`Upload progress: ${percentCompleted}%`);
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error creating inscription", error);
//             throw error;
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Validate video file size before submission (500MB)
//         if (videoFile && videoFile.size > MAX_VIDEO_SIZE) {
//             alert(`Video file size exceeds 500MB limit (Current: ${formatFileSize(videoFile.size)})`);
//             return;
//         }

//         // Validate banner image size (150MB)
//         if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) {
//             alert(`Banner image size exceeds 150MB limit (Current: ${formatFileSize(bannerFile.size)})`);
//             return;
//         }

//         // Validate all images size (150MB each)
//         const oversizedImages = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
//         if (oversizedImages.length > 0) {
//             alert(`${oversizedImages.length} image(s) exceed 150MB limit. Please remove them.`);
//             return;
//         }

//         const formData = new FormData();

//         // Append all text fields
//         Object.keys(data).forEach(key => {
//             if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
//                 formData.append(key, data[key]);
//             }
//         });

//         // Automatically append status as "draft"
//         formData.append('status', 'draft');

//         // Append banner file
//         if (bannerFile) {
//             formData.append('banner_image', bannerFile);
//         }

//         // Append video file
//         if (videoFile) {
//             formData.append('video', videoFile);
//         }

//         // Append multiple images correctly
//         imageFiles.forEach((file, index) => {
//             formData.append(`images[${index}]`, file);
//         });

//         try {
//             setSubmitting(true);

//             const result = await handleCreate(formData);

//             if (result.success) {
//                 // Reset and close form
//                 resetForm();
//                 alert(result.message || "Inscription added successfully!");
//                 setShowForm(false);
//             } else {
//                 alert(result.message || "Failed to add inscription");
//             }

//         } catch (error) {
//             const errorMessage = error.response?.data?.message ||
//                                error.response?.data?.errors?.images?.[0] ||
//                                error.response?.data?.errors?.video?.[0] ||
//                                error.response?.data?.errors?.banner_image?.[0] ||
//                                error.response?.data?.errors?.inscription_number?.[0] ||
//                                "Error saving inscription";
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
//         setImagesPreviews([]);
//         setImageFiles([]);
//         if (videoPreview && videoPreview.startsWith('blob:')) {
//             URL.revokeObjectURL(videoPreview);
//         }
//         setVideoPreview(null);
//         setVideoFile(null);
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
//         <div className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}>
//             <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
//                 {/* Content */}
//                 <div className="h-full flex flex-col px-6 py-6 text-gray-800">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-2xl font-bold">
//                             Add Inscription
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

//                             {/* Inscription Number */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">Inscription Number *</label>
//                                 <input
//                                     type="text"
//                                     className={`${inputClass} ${errors.inscription_number ? "border-2 border-red-500" : ""}`}
//                                     {...register("inscription_number", {
//                                         required: "Inscription number is required",
//                                         minLength: {
//                                             value: 1,
//                                             message: "Inscription number must be at least 1 character",
//                                         },
//                                     })}
//                                 />
//                                 {errors.inscription_number && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.inscription_number.message}</p>
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
//                                             </div>
//                                             <p className="text-sm text-gray-600">Click to change image</p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">Click to upload banner image</p>
//                                             <p className="text-sm text-gray-500">Recommended: 1200x400px | Max: 150MB</p>
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
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {imagesPreviews.length > 0 ? (
//                                         <div className="space-y-4">
//                                             <div className="grid grid-cols-3 gap-4">
//                                                 {imagesPreviews.map((preview, index) => (
//                                                     <div key={index} className="relative">
//                                                         <img
//                                                             src={preview}
//                                                             alt={`Preview ${index + 1}`}
//                                                             className="h-24 w-full object-cover rounded-lg shadow bg-white"
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <p className="text-sm text-gray-600">
//                                                     {imagesPreviews.length} image(s) selected
//                                                 </p>
//                                                 <p className="text-sm text-gray-500">Click to add more images</p>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">Click to upload multiple images</p>
//                                             <p className="text-sm text-gray-500">Hold Ctrl/Cmd to select multiple files | Max: 150MB per file</p>
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
//                                             </div>
//                                             {videoFile && (
//                                                 <div className="text-center">
//                                                     <p className="text-sm text-gray-600">
//                                                         File: {videoFile.name} ({formatFileSize(videoFile.size)})
//                                                     </p>
//                                                 </div>
//                                             )}
//                                             <p className="text-sm text-gray-600">Click to change video</p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Video className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">Click to upload video</p>
//                                             <p className="text-sm text-gray-500">
//                                                 Supported formats: MP4, AVI, MOV, WMV, FLV, MKV, WEBM
//                                             </p>
//                                             <p className="text-sm text-gray-500">Max size: 500MB</p>
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                     {submitting ? 'Saving...' : 'Add Inscription'}
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

// import { X, Camera, Upload, Video, Image, Link } from "lucide-react";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const AddInscriptionForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger
// }) => {
//     const inputClass = "w-full p-2 rounded bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#5d4c2e] focus:outline-none border border-gray-300";

//     // File size limits in bytes (only for images now)
//     const MAX_IMAGE_SIZE = 150 * 1024 * 1024; // 150MB

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
//         background: "250px",
//         text: "250px",
//         translation: "250px",
//         references: "250px",
//         glossary: "250px"
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
//     const [imagesPreviews, setImagesPreviews] = useState([]);
//     const [imageFiles, setImageFiles] = useState([]);
//     const [videoUrl, setVideoUrl] = useState("");
//     const [submitting, setSubmitting] = useState(false);

//     const {
//         register,
//         handleSubmit: handleFormSubmit,
//         formState: { errors },
//         reset,
//         setValue,
//     } = useForm();

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

//             // Validate file size (150MB max for images)
//             if (file.size > MAX_IMAGE_SIZE) {
//                 alert(`Banner image size should be less than 150MB (Current: ${formatFileSize(file.size)})`);
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
//                 // Validate each file size (150MB max)
//                 const oversizedFiles = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
//                 if (oversizedFiles.length > 0) {
//                     alert(`${oversizedFiles.length} image(s) exceed 150MB limit and were ignored`);
//                     imageFiles = imageFiles.filter(file => file.size <= MAX_IMAGE_SIZE);
//                 }

//                 const newFiles = [...imageFiles];
//                 setImageFiles(prev => [...prev, ...newFiles]);

//                 // Create previews for new files
//                 newFiles.forEach(file => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         setImagesPreviews(prev => [...prev, reader.result]);
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

//     // Handle Create Inscription
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourinscription.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//                 timeout: 1200000, // 20 minutes timeout for large file uploads
//                 onUploadProgress: (progressEvent) => {
//                     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     console.log(`Upload progress: ${percentCompleted}%`);
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error creating inscription", error);
//             throw error;
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Validate banner image size (150MB)
//         if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) {
//             alert(`Banner image size exceeds 150MB limit (Current: ${formatFileSize(bannerFile.size)})`);
//             return;
//         }

//         // Validate all images size (150MB each)
//         const oversizedImages = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
//         if (oversizedImages.length > 0) {
//             alert(`${oversizedImages.length} image(s) exceed 150MB limit. Please remove them.`);
//             return;
//         }

//         const formData = new FormData();

//         // Append all text fields
//         Object.keys(data).forEach(key => {
//             if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
//                 formData.append(key, data[key]);
//             }
//         });

//         // Automatically append status as "draft"
//         formData.append('status', 'draft');

//         // Append banner file
//         if (bannerFile) {
//             formData.append('banner_image', bannerFile);
//         }

//         // Append video URL (no file upload)
//         if (videoUrl) {
//             formData.append('video', videoUrl);
//         }

//         // Append multiple images correctly
//         imageFiles.forEach((file, index) => {
//             formData.append(`images[${index}]`, file);
//         });

//         try {
//             setSubmitting(true);

//             const result = await handleCreate(formData);

//             if (result.success) {
//                 // Reset and close form
//                 resetForm();
//                 alert(result.message || "Inscription added successfully!");
//                 setShowForm(false);
//             } else {
//                 alert(result.message || "Failed to add inscription");
//             }

//         } catch (error) {
//             const errorMessage = error.response?.data?.message ||
//                                error.response?.data?.errors?.images?.[0] ||
//                                error.response?.data?.errors?.video?.[0] ||
//                                error.response?.data?.errors?.banner_image?.[0] ||
//                                error.response?.data?.errors?.inscription_number?.[0] ||
//                                "Error saving inscription";
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
//         setImagesPreviews([]);
//         setImageFiles([]);
//         setVideoUrl("");
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

//     // Function to check if URL is a video
//     const isVideoUrl = (url) => {
//         if (!url) return false;
//         const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm', '.mpg', '.mpeg'];
//         return videoExtensions.some(ext => url.toLowerCase().includes(ext));
//     };

//     return (
//         <div className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}>
//             <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
//                 {/* Content */}
//                 <div className="h-full flex flex-col px-6 py-6 text-gray-800">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-2xl font-bold">
//                             Add Inscription
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

//                             {/* Inscription Number */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">Inscription Number *</label>
//                                 <input
//                                     type="text"
//                                     className={`${inputClass} ${errors.inscription_number ? "border-2 border-red-500" : ""}`}
//                                     {...register("inscription_number", {
//                                         required: "Inscription number is required",
//                                         minLength: {
//                                             value: 1,
//                                             message: "Inscription number must be at least 1 character",
//                                         },
//                                     })}
//                                 />
//                                 {errors.inscription_number && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.inscription_number.message}</p>
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
//                                             </div>
//                                             <p className="text-sm text-gray-600">Click to change image</p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">Click to upload banner image</p>
//                                             <p className="text-sm text-gray-500">Recommended: 1200x400px | Max: 150MB</p>
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
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {imagesPreviews.length > 0 ? (
//                                         <div className="space-y-4">
//                                             <div className="grid grid-cols-3 gap-4">
//                                                 {imagesPreviews.map((preview, index) => (
//                                                     <div key={index} className="relative">
//                                                         <img
//                                                             src={preview}
//                                                             alt={`Preview ${index + 1}`}
//                                                             className="h-24 w-full object-cover rounded-lg shadow bg-white"
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <p className="text-sm text-gray-600">
//                                                     {imagesPreviews.length} image(s) selected
//                                                 </p>
//                                                 <p className="text-sm text-gray-500">Click to add more images</p>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">Click to upload multiple images</p>
//                                             <p className="text-sm text-gray-500">Hold Ctrl/Cmd to select multiple files | Max: 150MB per file</p>
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

//                             {/* Video URL Input */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Link className="mr-3 text-gray-600" size={22} />
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
//                                         <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                     </div>

//                                     {videoUrl && isVideoUrl(videoUrl) && (
//                                         <div className="border rounded-lg p-4 bg-gray-50">
//                                             <p className="text-sm font-medium text-gray-700 mb-2">Video Preview:</p>
//                                             <div className="relative">
//                                                 <video
//                                                     src={videoUrl.startsWith('http') ? videoUrl : `/storage/${videoUrl}`}
//                                                     className="w-full h-48 object-cover rounded-lg"
//                                                     controls
//                                                 />
//                                             </div>
//                                             {/* <p className="text-xs text-gray-500 mt-2">
//                                                 URL: {videoUrl}
//                                             </p> */}
//                                         </div>
//                                     )}
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                         className="rounded h-full quill-custom"
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
//                                     {submitting ? 'Saving...' : 'Add Inscription'}
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

// import { X, Camera, Upload, Video, Image, Link } from "lucide-react";
// import React, { useState, useRef, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const AddInscriptionForm = ({ showForm, setShowForm, setReloadTrigger }) => {
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
//     const [imagesPreviews, setImagesPreviews] = useState([]);
//     const [imageFiles, setImageFiles] = useState([]);
//     const [videoUrl, setVideoUrl] = useState("");
//     const [submitting, setSubmitting] = useState(false);

//     const {
//         register,
//         handleSubmit: handleFormSubmit,
//         control,
//         formState: { errors },
//         reset,
//         setValue,
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
//                 setImageFiles((prev) => [...prev, ...newFiles]);

//                 // Create previews for new files
//                 newFiles.forEach((file) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         setImagesPreviews((prev) => [...prev, reader.result]);
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

//     // Handle Create Inscription
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(
//                 route("ourinscription.store"),
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
//             console.error("Error creating inscription", error);
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

//         // Validate all images size (150MB each)
//         const oversizedImages = imageFiles.filter(
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

//         // Automatically append status as "draft"
//         formData.append("status", "draft");

//         // Append banner file
//         if (bannerFile) {
//             formData.append("banner_image", bannerFile);
//         }

//         // Append video URL (no file upload)
//         if (videoUrl) {
//             formData.append("video", videoUrl);
//         }

//         // Append multiple images correctly
//         imageFiles.forEach((file, index) => {
//             formData.append(`images[${index}]`, file);
//         });

//         try {
//             setSubmitting(true);

//             const result = await handleCreate(formData);

//             if (result.success) {
//                 // Reset and close form
//                 resetForm();
//                 alert(result.message || "Inscription added successfully!");
//                 setShowForm(false);
//             } else {
//                 alert(result.message || "Failed to add inscription");
//             }
//         } catch (error) {
//             const errorMessage =
//                 error.response?.data?.message ||
//                 error.response?.data?.errors?.images?.[0] ||
//                 error.response?.data?.errors?.video?.[0] ||
//                 error.response?.data?.errors?.banner_image?.[0] ||
//                 error.response?.data?.errors?.inscription_number?.[0] ||
//                 "Error saving inscription";
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
//         setImagesPreviews([]);
//         setImageFiles([]);
//         setVideoUrl("");
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

//     return (
//         <div
//             className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}
//         >
//             <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
//                 {/* Content */}
//                 <div className="h-full flex flex-col px-6 py-6 text-gray-800">
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
//                     <div className="overflow-y-auto flex-1 pr-2 space-y-6">
//                         <form
//                             onSubmit={handleFormSubmit(onSubmit)}
//                             className="space-y-6"
//                         >
//                             {/* Title */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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

//                             {/* Banner Image */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Camera
//                                         className="mr-3 text-gray-600"
//                                         size={22}
//                                     />
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
//                                             </div>
//                                             <p className="text-sm text-gray-600">
//                                                 Click to change image
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">
//                                                 Click to upload banner image
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 Recommended: 1200x400px | Max:
//                                                 150MB
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
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Image
//                                         className="mr-3 text-gray-600"
//                                         size={22}
//                                     />
//                                     Images (Multiple)
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
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
//                                                                 className="h-24 w-full object-cover rounded-lg shadow bg-white"
//                                                             />
//                                                         </div>
//                                                     ),
//                                                 )}
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <p className="text-sm text-gray-600">
//                                                     {imagesPreviews.length}{" "}
//                                                     image(s) selected
//                                                 </p>
//                                                 <p className="text-sm text-gray-500">
//                                                     Click to add more images
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">
//                                                 Click to upload multiple images
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 Hold Ctrl/Cmd to select multiple
//                                                 files | Max: 150MB per file
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

//                             {/* Video URL Input */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Link
//                                         className="mr-3 text-gray-600"
//                                         size={22}
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
//                                         <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                     </div>

//                                     {videoUrl && isVideoUrl(videoUrl) && (
//                                         <div className="border rounded-lg p-4 bg-gray-50">
//                                             <p className="text-sm font-medium text-gray-700 mb-2">
//                                                 Video Preview:
//                                             </p>
//                                             <div className="relative">
//                                                 <video
//                                                     src={
//                                                         videoUrl.startsWith(
//                                                             "http",
//                                                         )
//                                                             ? videoUrl
//                                                             : `/storage/${videoUrl}`
//                                                     }
//                                                     className="w-full h-48 object-cover rounded-lg"
//                                                     controls
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                     disabled={submitting}
//                                     className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-lg ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
//                                 >
//                                     {submitting
//                                         ? "Saving..."
//                                         : "Add Inscription"}
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

//// Important ///////

// import { X, Camera, Upload, Video, Image, Link, Film } from "lucide-react";
// import React, { useState, useRef, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const AddInscriptionForm = ({ showForm, setShowForm, setReloadTrigger }) => {
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
//     const [imagesPreviews, setImagesPreviews] = useState([]);
//     const [imageFiles, setImageFiles] = useState([]);
//     const [videoUrl, setVideoUrl] = useState("");
//     const [submitting, setSubmitting] = useState(false);

//     const {
//         register,
//         handleSubmit: handleFormSubmit,
//         control,
//         formState: { errors },
//         reset,
//         setValue,
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

//     // Handle banner image change
//     const handleBannerChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Validate image file
//             if (!file.type.startsWith("image/")) {
//                 alert("Please select a valid image file");
//                 return;
//             }

//             // Validate file size
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

//             // Validate file size
//             if (file.size > MAX_IMAGE_SIZE) {
//                 alert(
//                     `Video banner size should be less than 150MB (Current: ${formatFileSize(file.size)})`,
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
//                 // Validate each file size
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
//                 setImageFiles((prev) => [...prev, ...newFiles]);

//                 // Create previews for new files
//                 newFiles.forEach((file) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         setImagesPreviews((prev) => [...prev, reader.result]);
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

//     // Handle Create Inscription
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(
//                 route("ourinscription.store"),
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
//             console.error("Error creating inscription", error);
//             throw error;
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Validate banner image size
//         if (bannerFile && bannerFile.size > MAX_IMAGE_SIZE) {
//             alert(
//                 `Banner image size exceeds 150MB limit (Current: ${formatFileSize(bannerFile.size)})`,
//             );
//             return;
//         }

//         // Validate video banner size
//         if (videoBannerFile && videoBannerFile.size > MAX_IMAGE_SIZE) {
//             alert(
//                 `Video banner size exceeds 150MB limit (Current: ${formatFileSize(videoBannerFile.size)})`,
//             );
//             return;
//         }

//         // Validate all images size
//         const oversizedImages = imageFiles.filter(
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

//         // Automatically append status as "draft"
//         formData.append("status", "draft");

//         // Append banner file
//         if (bannerFile) {
//             formData.append("banner_image", bannerFile);
//         }

//         // Append video banner file
//         if (videoBannerFile) {
//             formData.append("video_banner", videoBannerFile);
//         }

//         // Append video URL (no file upload)
//         if (videoUrl) {
//             formData.append("video", videoUrl);
//         }

//         // Append multiple images correctly
//         imageFiles.forEach((file, index) => {
//             formData.append(`images[${index}]`, file);
//         });

//         try {
//             setSubmitting(true);

//             const result = await handleCreate(formData);

//             if (result.success) {
//                 // Reset and close form
//                 resetForm();
//                 alert(result.message || "Inscription added successfully!");
//                 setShowForm(false);
//             } else {
//                 alert(result.message || "Failed to add inscription");
//             }
//         } catch (error) {
//             const errorMessage =
//                 error.response?.data?.message ||
//                 error.response?.data?.errors?.images?.[0] ||
//                 error.response?.data?.errors?.video?.[0] ||
//                 error.response?.data?.errors?.banner_image?.[0] ||
//                 error.response?.data?.errors?.video_banner?.[0] ||
//                 error.response?.data?.errors?.inscription_number?.[0] ||
//                 "Error saving inscription";
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
//         setImagesPreviews([]);
//         setImageFiles([]);
//         setVideoUrl("");
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

//     return (
//         <div
//             className={`fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40 ${showForm ? "block" : "hidden"}`}
//         >
//             <div className="relative w-full max-w-4xl h-[95vh] rounded-xl shadow-2xl bg-white">
//                 {/* Content */}
//                 <div className="h-full flex flex-col px-6 py-6 text-gray-800">
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
//                     <div className="overflow-y-auto flex-1 pr-2 space-y-6">
//                         <form
//                             onSubmit={handleFormSubmit(onSubmit)}
//                             className="space-y-6"
//                         >
//                             {/* Title */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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

//                             {/* Banner Image */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Camera
//                                         className="mr-3 text-gray-600"
//                                         size={22}
//                                     />
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
//                                             </div>
//                                             <p className="text-sm text-gray-600">
//                                                 Click to change image
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">
//                                                 Click to upload banner image
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 Recommended: 1200x400px | Max:
//                                                 150MB
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
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Film
//                                         className="mr-3 text-gray-600"
//                                         size={22}
//                                     />
//                                     Video Banner/Thumbnail (Optional)
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
//                                     {videoBannerPreview ? (
//                                         <div className="space-y-4">
//                                             <div className="relative inline-block">
//                                                 <img
//                                                     src={videoBannerPreview}
//                                                     alt="Video Banner Preview"
//                                                     className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg bg-white"
//                                                 />
//                                             </div>
//                                             <p className="text-sm text-gray-600">
//                                                 Click to change video banner
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">
//                                                 Click to upload video banner/thumbnail
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 Used as video thumbnail | Max:
//                                                 150MB
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
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Image
//                                         className="mr-3 text-gray-600"
//                                         size={22}
//                                     />
//                                     Images (Multiple)
//                                 </label>
//                                 <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
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
//                                                                 className="h-24 w-full object-cover rounded-lg shadow bg-white"
//                                                             />
//                                                         </div>
//                                                     ),
//                                                 )}
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <p className="text-sm text-gray-600">
//                                                     {imagesPreviews.length}{" "}
//                                                     image(s) selected
//                                                 </p>
//                                                 <p className="text-sm text-gray-500">
//                                                     Click to add more images
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-lg text-gray-700">
//                                                 Click to upload multiple images
//                                             </p>
//                                             <p className="text-sm text-gray-500">
//                                                 Hold Ctrl/Cmd to select multiple
//                                                 files | Max: 150MB per file
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

//                             {/* Video URL Input */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center text-lg font-semibold text-gray-700">
//                                     <Link
//                                         className="mr-3 text-gray-600"
//                                         size={22}
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
//                                         <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                     </div>

//                                     {videoUrl && isVideoUrl(videoUrl) && (
//                                         <div className="border rounded-lg p-4 bg-gray-50">
//                                             <p className="text-sm font-medium text-gray-700 mb-2">
//                                                 Video Preview:
//                                             </p>
//                                             <div className="relative">
//                                                 <video
//                                                     src={
//                                                         videoUrl.startsWith(
//                                                             "http",
//                                                         )
//                                                             ? videoUrl
//                                                             : `/storage/${videoUrl}`
//                                                     }
//                                                     className="w-full h-48 object-cover rounded-lg"
//                                                     controls
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                 <label className="block mb-2 font-medium text-lg">
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
//                                     disabled={submitting}
//                                     className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition text-lg ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
//                                 >
//                                     {submitting
//                                         ? "Saving..."
//                                         : "Add Inscription"}
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
