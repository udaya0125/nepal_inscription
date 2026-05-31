import axios from "axios";
import { ImagePlus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
    ],
};

const quillFormats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "indent",
    "blockquote", "code-block",
    "link",
];

const quillModulesMinimal = {
    toolbar: [
        ["bold", "italic", "underline"],
        ["link"],
        ["clean"],
    ],
};

const quillFormatsMinimal = ["bold", "italic", "underline", "link"];

const EditMallalekhaForm = ({
    showForm,
    setShowForm,
    editingMallalekha,
    setEditingMallalekha,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const bannerInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const [mallalekhaForm, setMallalekhaForm] = useState({
        title: "",
        short_description: "",
        wchn_id: "",
        status: "draft",
        description: "",
        roman_text: "",
        devanagari_text: "",
        note: "",
        translation: "",
        reference: "",
        images: [],
        banner_image: null,
    });

    useEffect(() => {
        if (editingMallalekha && showForm) {
            setMallalekhaForm({
                title: editingMallalekha.title || "",
                short_description: editingMallalekha.short_description || "",
                wchn_id: editingMallalekha.wchn_id || "",
                status: editingMallalekha.status || "draft",
                description: editingMallalekha.description || "",
                roman_text: editingMallalekha.roman_text || "",
                devanagari_text: editingMallalekha.devanagari_text || "",
                note: editingMallalekha.note || "",
                translation: editingMallalekha.translation || "",
                reference: editingMallalekha.reference || "",
                images: [],
                banner_image: null,
            });

            setBannerPreview(
                editingMallalekha.banner_image
                    ? `/storage/${editingMallalekha.banner_image}`
                    : null
            );

            setGalleryPreviews(
                editingMallalekha.images?.length > 0
                    ? editingMallalekha.images.map((img) => ({
                          id: img.id,
                          src: `/storage/${img.image_path}`,
                          isExisting: true,
                          imageId: img.id,
                          file: null,
                      }))
                    : []
            );
        }
    }, [editingMallalekha, showForm]);

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourmallalekha.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating mallalekha", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (const key in mallalekhaForm) {
            const value = mallalekhaForm[key];
            if (key === "images") {
                if (value && value.length > 0) {
                    value.forEach((file) => {
                        formData.append("images[]", file);
                    });
                }
            } else if (value !== null && value !== "") {
                formData.append(key, value);
            }
        }

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingMallalekha.id);
            resetForm();
            setShowForm(false);
            setEditingMallalekha(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setMallalekhaForm({
            title: "",
            short_description: "",
            wchn_id: "",
            status: "draft",
            description: "",
            roman_text: "",
            devanagari_text: "",
            note: "",
            translation: "",
            reference: "",
            images: [],
            banner_image: null,
        });
        setBannerPreview(null);
        setGalleryPreviews([]);
        if (bannerInputRef.current) bannerInputRef.current.value = "";
        if (galleryInputRef.current) galleryInputRef.current.value = "";
    };

    const handleChange = (e) => {
        const { name, type, files, value } = e.target;

        if (type === "file") {
            if (name === "images") {
                const fileArray = Array.from(files);
                const previews = fileArray.map((file) => ({
                    id: URL.createObjectURL(file),
                    src: URL.createObjectURL(file),
                    isExisting: false,
                    imageId: null,
                    file,
                }));
                setGalleryPreviews((prev) => [...prev, ...previews]);
                setMallalekhaForm((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), ...fileArray],
                }));
                // Reset input so same file can be re-selected if needed
                if (galleryInputRef.current) galleryInputRef.current.value = "";
            } else {
                const file = files[0];
                setMallalekhaForm((prev) => ({ ...prev, banner_image: file }));
                if (file) setBannerPreview(URL.createObjectURL(file));
            }
        } else {
            setMallalekhaForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleQuillChange = (name) => (value) => {
        setMallalekhaForm((prev) => ({ ...prev, [name]: value }));
    };

    const removeBanner = () => {
        setBannerPreview(null);
        setMallalekhaForm((prev) => ({ ...prev, banner_image: null }));
        if (bannerInputRef.current) bannerInputRef.current.value = "";
    };

    const removeGalleryImage = async (id) => {
        const target = galleryPreviews.find((p) => p.id === id);

        if (target?.isExisting && target?.imageId) {
            try {
                await axios.delete(
                    route("ourmallalekha.image.destroy", { imageId: target.imageId })
                );
                setGalleryPreviews((prev) => prev.filter((p) => p.id !== id));
            } catch (error) {
                console.error("Failed to delete image", error);
                alert("Could not delete image. Please try again.");
            }
        } else {
            // New (unsaved) image — remove by file reference
            setGalleryPreviews((prev) => prev.filter((p) => p.id !== id));
            if (target?.file) {
                setMallalekhaForm((prev) => ({
                    ...prev,
                    images: prev.images.filter((f) => f !== target.file),
                }));
            }
        }
    };

    const handleCancel = () => {
        resetForm();
        setShowForm(false);
        setEditingMallalekha(null);
    };

    if (!showForm || !editingMallalekha) return null;

    const inputClass =
        "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Mallalekha</h2>
                    <button type="button" onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title + WCHN ID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                            <input type="text" name="title" value={mallalekhaForm.title} onChange={handleChange} required className={inputClass} placeholder="Enter title" />
                        </div>
                        <div>
                            <label className={labelClass}>WCHN ID</label>
                            <input type="text" name="wchn_id" value={mallalekhaForm.wchn_id} onChange={handleChange} className={inputClass} placeholder="Enter WCHN ID" />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className={labelClass}>Status <span className="text-red-500">*</span></label>
                        <select name="status" value={mallalekhaForm.status} onChange={handleChange} required className={inputClass}>
                            <option value="">Select Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className={labelClass}>Short Description</label>
                        <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill theme="snow" value={mallalekhaForm.short_description} onChange={handleQuillChange("short_description")} modules={quillModulesMinimal} formats={quillFormatsMinimal} placeholder="Enter short description" />
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div>
                        <label className={labelClass}>Banner Image</label>
                        {bannerPreview ? (
                            <div className="relative inline-block group w-full">
                                <img src={bannerPreview} alt="Banner preview" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                                        <button type="button" onClick={() => bannerInputRef.current?.click()} className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium shadow hover:bg-gray-50 transition">Change</button>
                                        <button type="button" onClick={removeBanner} className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md font-medium shadow hover:bg-red-600 transition">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button type="button" onClick={() => bannerInputRef.current?.click()} className="w-full h-36 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors bg-gray-50 hover:bg-indigo-50">
                                <ImagePlus size={28} />
                                <span className="text-sm font-medium">Click to upload banner image</span>
                                <span className="text-xs">JPG, PNG, WEBP</span>
                            </button>
                        )}
                        <input ref={bannerInputRef} type="file" name="banner_image" onChange={handleChange} accept="image/jpg,image/jpeg,image/png,image/webp" className="hidden" />
                    </div>

                    {/* Gallery Images */}
                    <div>
                        <label className={labelClass}>Gallery Images</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 hover:border-indigo-300 transition-colors">
                            {galleryPreviews.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    {galleryPreviews.map((img) => (
                                        <div key={img.id} className="relative group aspect-square">
                                            <img src={img.src} alt="gallery" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                                            <button type="button" onClick={() => removeGalleryImage(img.id)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors bg-white">
                                        <ImagePlus size={18} />
                                        <span className="text-xs mt-1">Add</span>
                                    </button>
                                </div>
                            ) : (
                                <button type="button" onClick={() => galleryInputRef.current?.click()} className="w-full py-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                                    <ImagePlus size={28} />
                                    <span className="text-sm font-medium">Click to upload gallery images</span>
                                    <span className="text-xs">Select multiple images • JPG, PNG, WEBP</span>
                                </button>
                            )}
                        </div>
                        <input ref={galleryInputRef} type="file" name="images" onChange={handleChange} accept="image/jpg,image/jpeg,image/png,image/webp" multiple className="hidden" />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>Description</label>
                        <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill theme="snow" value={mallalekhaForm.description} onChange={handleQuillChange("description")} modules={quillModules} formats={quillFormats} placeholder="Enter description" />
                        </div>
                    </div>

                    {/* Roman Text */}
                    <div>
                        <label className={labelClass}>Roman Text</label>
                        <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill theme="snow" value={mallalekhaForm.roman_text} onChange={handleQuillChange("roman_text")} modules={quillModules} formats={quillFormats} placeholder="Enter roman text" />
                        </div>
                    </div>

                    {/* Devanagari Text */}
                    <div>
                        <label className={labelClass}>Devanagari Text</label>
                        <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill theme="snow" value={mallalekhaForm.devanagari_text} onChange={handleQuillChange("devanagari_text")} modules={quillModules} formats={quillFormats} placeholder="देवनागरी पाठ लेख्नुहोस्" />
                        </div>
                    </div>

                    {/* Translation */}
                    <div>
                        <label className={labelClass}>Translation</label>
                        <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill theme="snow" value={mallalekhaForm.translation} onChange={handleQuillChange("translation")} modules={quillModules} formats={quillFormats} placeholder="Enter translation" />
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className={labelClass}>Note</label>
                        <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill theme="snow" value={mallalekhaForm.note} onChange={handleQuillChange("note")} modules={quillModulesMinimal} formats={quillFormatsMinimal} placeholder="Enter note" />
                        </div>
                    </div>

                    {/* Reference */}
                    <div>
                        <label className={labelClass}>Reference</label>
                        <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill theme="snow" value={mallalekhaForm.reference} onChange={handleQuillChange("reference")} modules={quillModulesMinimal} formats={quillFormatsMinimal} placeholder="Enter reference" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={handleCancel} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm disabled:opacity-60">
                            {submitting ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .ql-container.ql-snow, .ql-toolbar.ql-snow { border: none; outline: none; }
                .ql-toolbar { border-bottom: 1px solid #d1d5db !important; background-color: #f9fafb; }
                .ql-container { font-size: 0.875rem; height: 200px; overflow: hidden; }
                .ql-editor { height: 120px; overflow-y: auto; resize: none; }
                .quill-field:focus-within { outline: none; box-shadow: none; }
            `}</style>
        </div>
    );
};

export default EditMallalekhaForm;


// import axios from "axios";
// import { ImagePlus, X } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// // Quill toolbar configuration
// const quillModules = {
//     toolbar: [
//         [{ header: [1, 2, 3, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         ["blockquote", "code-block"],
//         ["link"],
//         ["clean"],
//     ],
// };

// const quillFormats = [
//     "header",
//     "bold", "italic", "underline", "strike",
//     "list", "bullet",
//     "indent",
//     "blockquote", "code-block",
//     "link",
// ];

// const quillModulesMinimal = {
//     toolbar: [
//         ["bold", "italic", "underline"],
//         ["link"],
//         ["clean"],
//     ],
// };

// const quillFormatsMinimal = ["bold", "italic", "underline", "link"];

// const EditMallalekhaForm = ({
//     showForm,
//     setShowForm,
//     editingMallalekha,
//     setEditingMallalekha,
//     setReloadTrigger,
// }) => {
//     const [submitting, setSubmitting] = useState(false);

//     // Preview states
//     const [bannerPreview, setBannerPreview] = useState(null);
//     const [galleryPreviews, setGalleryPreviews] = useState([]);

//     const bannerInputRef = useRef(null);
//     const galleryInputRef = useRef(null);

//     const [mallalekhaForm, setMallalekhaForm] = useState({
//         title: "",
//         short_description: "",
//         wchn_id: "",
//         status: "draft",
//         description: "",
//         roman_text: "",
//         devanagari_text: "",
//         note: "",
//         translation: "",
//         reference: "",
//         images: null,
//         banner_image: null,
//     });

//     useEffect(() => {
//         if (editingMallalekha && showForm) {
//             setMallalekhaForm({
//                 title: editingMallalekha.title || "",
//                 short_description: editingMallalekha.short_description || "",
//                 wchn_id: editingMallalekha.wchn_id || "",
//                 status: editingMallalekha.status || "draft",
//                 description: editingMallalekha.description || "",
//                 roman_text: editingMallalekha.roman_text || "",
//                 devanagari_text: editingMallalekha.devanagari_text || "",
//                 note: editingMallalekha.note || "",
//                 translation: editingMallalekha.translation || "",
//                 reference: editingMallalekha.reference || "",
//                 images: null,
//                 banner_image: null,
//             });
            
//             // Show existing banner preview
//             if (editingMallalekha.banner_image) {
//                 setBannerPreview(`/storage/${editingMallalekha.banner_image}`);
//             } else {
//                 setBannerPreview(null);
//             }
            
//             // Show existing gallery previews
//             if (editingMallalekha.images?.length > 0) {
//                 setGalleryPreviews(
//                     editingMallalekha.images.map((img) => ({
//                         id: img.id,
//                         src: `/storage/${img.image_path}`,
//                         isExisting: true,
//                         imageId: img.id,
//                     }))
//                 );
//             } else {
//                 setGalleryPreviews([]);
//             }
//         }
//     }, [editingMallalekha, showForm]);

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourmallalekha.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating mallalekha", error);
//             throw error;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         for (const key in mallalekhaForm) {
//             const value = mallalekhaForm[key];
//             if (key === "images") {
//                 if (value && value.length > 0) {
//                     Array.from(value).forEach((file) => {
//                         formData.append("images[]", file);
//                     });
//                 }
//             } else if (value !== null && value !== "") {
//                 formData.append(key, value);
//             }
//         }

//         try {
//             setSubmitting(true);
//             await handleUpdate(formData, editingMallalekha.id);
//             resetForm();
//             setShowForm(false);
//             setEditingMallalekha(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const resetForm = () => {
//         setMallalekhaForm({
//             title: "",
//             short_description: "",
//             wchn_id: "",
//             status: "draft",
//             description: "",
//             roman_text: "",
//             devanagari_text: "",
//             note: "",
//             translation: "",
//             reference: "",
//             images: null,
//             banner_image: null,
//         });
//         setBannerPreview(null);
//         setGalleryPreviews([]);
//         if (bannerInputRef.current) bannerInputRef.current.value = "";
//         if (galleryInputRef.current) galleryInputRef.current.value = "";
//     };

//     const handleChange = (e) => {
//         const { name, type, files, value } = e.target;

//         if (type === "file") {
//             if (name === "images") {
//                 const fileArray = Array.from(files);
//                 setMallalekhaForm((prev) => ({ ...prev, images: files }));
//                 // Build new preview objects
//                 const previews = fileArray.map((file) => ({
//                     id: URL.createObjectURL(file),
//                     src: URL.createObjectURL(file),
//                     isExisting: false,
//                 }));
//                 setGalleryPreviews((prev) => [
//                     ...prev.filter((p) => p.isExisting),
//                     ...previews,
//                 ]);
//             } else {
//                 // banner_image
//                 const file = files[0];
//                 setMallalekhaForm((prev) => ({ ...prev, banner_image: file }));
//                 if (file) {
//                     setBannerPreview(URL.createObjectURL(file));
//                 }
//             }
//         } else {
//             setMallalekhaForm((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleQuillChange = (name) => (value) => {
//         setMallalekhaForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const removeBanner = () => {
//         setBannerPreview(null);
//         setMallalekhaForm((prev) => ({ ...prev, banner_image: null }));
//         if (bannerInputRef.current) bannerInputRef.current.value = "";
//     };

//     // const removeGalleryImage = (id) => {
//     //     setGalleryPreviews((prev) => prev.filter((p) => p.id !== id));
//     //     // Clear the files input if needed
//     //     if (galleryInputRef.current) galleryInputRef.current.value = "";
//     //     // If it's a new image, remove from form data
//     //     const isNewImage = !galleryPreviews.find(p => p.id === id)?.isExisting;
//     //     if (isNewImage) {
//     //         setMallalekhaForm((prev) => ({ ...prev, images: null }));
//     //     }
//     // };

//     const removeGalleryImage = async (id) => {
//     const target = galleryPreviews.find((p) => p.id === id);

//     if (target?.isExisting && target?.imageId) {
//         // It's a saved image — delete it from the server
//         try {
//             await axios.delete(route("ourmallalekha.image.destroy", { imageId: target.imageId }));
//             setGalleryPreviews((prev) => prev.filter((p) => p.id !== id));
//         } catch (error) {
//             console.error("Failed to delete image", error);
//             alert("Could not delete image. Please try again.");
//         }
//     } else {
//         // It's a newly selected (unsaved) file — just remove from preview
//         setGalleryPreviews((prev) => prev.filter((p) => p.id !== id));
//         setMallalekhaForm((prev) => ({ ...prev, images: null }));
//         if (galleryInputRef.current) galleryInputRef.current.value = "";
//     }
// };

//     const handleCancel = () => {
//         resetForm();
//         setShowForm(false);
//         setEditingMallalekha(null);
//     };

    

//     if (!showForm || !editingMallalekha) return null;

//     const inputClass =
//         "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
//     const labelClass = "block text-sm font-medium text-gray-700 mb-1";

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Edit Mallalekha
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={handleCancel}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Title + WCHN ID on same row */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className={labelClass}>
//                                 Title <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 name="title"
//                                 value={mallalekhaForm.title}
//                                 onChange={handleChange}
//                                 required
//                                 className={inputClass}
//                                 placeholder="Enter title"
//                             />
//                         </div>
//                         <div>
//                             <label className={labelClass}>WCHN ID</label>
//                             <input
//                                 type="text"
//                                 name="wchn_id"
//                                 value={mallalekhaForm.wchn_id}
//                                 onChange={handleChange}
//                                 className={inputClass}
//                                 placeholder="Enter WCHN ID"
//                             />
//                         </div>
//                     </div>

//                     {/* Status - Only shown in edit mode */}
//                     <div>
//                         <label className={labelClass}>
//                             Status <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             name="status"
//                             value={mallalekhaForm.status}
//                             onChange={handleChange}
//                             required
//                             className={inputClass}
//                         >
//                             <option value="">Select Status</option>
//                             <option value="published">Published</option>
//                             <option value="draft">Draft</option>
//                         </select>
//                     </div>

//                     {/* Short Description */}
//                     <div>
//                         <label className={labelClass}>Short Description</label>
//                         <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
//                             <ReactQuill
//                                 theme="snow"
//                                 value={mallalekhaForm.short_description}
//                                 onChange={handleQuillChange("short_description")}
//                                 modules={quillModulesMinimal}
//                                 formats={quillFormatsMinimal}
//                                 placeholder="Enter short description"
//                             />
//                         </div>
//                     </div>

//                     {/* Banner Image */}
//                     <div>
//                         <label className={labelClass}>Banner Image</label>
//                         {bannerPreview ? (
//                             <div className="relative inline-block group">
//                                 <img
//                                     src={bannerPreview}
//                                     alt="Banner preview"
//                                     className="w-full h-40 object-cover rounded-lg border border-gray-200"
//                                 />
//                                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
//                                     <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
//                                         <button
//                                             type="button"
//                                             onClick={() => bannerInputRef.current?.click()}
//                                             className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium shadow hover:bg-gray-50 transition"
//                                         >
//                                             Change
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={removeBanner}
//                                             className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md font-medium shadow hover:bg-red-600 transition"
//                                         >
//                                             Remove
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             <button
//                                 type="button"
//                                 onClick={() => bannerInputRef.current?.click()}
//                                 className="w-full h-36 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors bg-gray-50 hover:bg-indigo-50"
//                             >
//                                 <ImagePlus size={28} />
//                                 <span className="text-sm font-medium">Click to upload banner image</span>
//                                 <span className="text-xs">JPG, PNG, WEBP</span>
//                             </button>
//                         )}
//                         <input
//                             ref={bannerInputRef}
//                             type="file"
//                             name="banner_image"
//                             onChange={handleChange}
//                             accept="image/jpg,image/jpeg,image/png,image/webp"
//                             className="hidden"
//                         />
//                     </div>

//                     {/* Gallery Images */}
//                     <div>
//                         <label className={labelClass}>Gallery Images</label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 hover:border-indigo-300 transition-colors">
//                             {galleryPreviews.length > 0 && (
//                                 <div className="grid grid-cols-4 gap-2 mb-3">
//                                     {galleryPreviews.map((img) => (
//                                         <div key={img.id} className="relative group aspect-square">
//                                             <img
//                                                 src={img.src}
//                                                 alt="gallery"
//                                                 className="w-full h-full object-cover rounded-lg border border-gray-200"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeGalleryImage(img.id)}
//                                                 className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
//                                             >
//                                                 <X size={10} />
//                                             </button>
//                                         </div>
//                                     ))}
//                                     {/* Add more button */}
//                                     <button
//                                         type="button"
//                                         onClick={() => galleryInputRef.current?.click()}
//                                         className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors bg-white"
//                                     >
//                                         <ImagePlus size={18} />
//                                         <span className="text-xs mt-1">Add</span>
//                                     </button>
//                                 </div>
//                             )}
//                             {galleryPreviews.length === 0 && (
//                                 <button
//                                     type="button"
//                                     onClick={() => galleryInputRef.current?.click()}
//                                     className="w-full py-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors"
//                                 >
//                                     <ImagePlus size={28} />
//                                     <span className="text-sm font-medium">Click to upload gallery images</span>
//                                     <span className="text-xs">Select multiple images • JPG, PNG, WEBP</span>
//                                 </button>
//                             )}
//                         </div>
//                         <input
//                             ref={galleryInputRef}
//                             type="file"
//                             name="images"
//                             onChange={handleChange}
//                             accept="image/jpg,image/jpeg,image/png,image/webp"
//                             multiple
//                             className="hidden"
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className={labelClass}>Description</label>
//                         <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
//                             <ReactQuill
//                                 theme="snow"
//                                 value={mallalekhaForm.description}
//                                 onChange={handleQuillChange("description")}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 placeholder="Enter description"
//                             />
//                         </div>
//                     </div>

//                     {/* Roman Text */}
//                     <div>
//                         <label className={labelClass}>Roman Text</label>
//                         <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
//                             <ReactQuill
//                                 theme="snow"
//                                 value={mallalekhaForm.roman_text}
//                                 onChange={handleQuillChange("roman_text")}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 placeholder="Enter roman text"
//                             />
//                         </div>
//                     </div>

//                     {/* Devanagari Text */}
//                     <div>
//                         <label className={labelClass}>Devanagari Text</label>
//                         <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
//                             <ReactQuill
//                                 theme="snow"
//                                 value={mallalekhaForm.devanagari_text}
//                                 onChange={handleQuillChange("devanagari_text")}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 placeholder="देवनागरी पाठ लेख्नुहोस्"
//                             />
//                         </div>
//                     </div>

//                     {/* Translation */}
//                     <div>
//                         <label className={labelClass}>Translation</label>
//                         <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
//                             <ReactQuill
//                                 theme="snow"
//                                 value={mallalekhaForm.translation}
//                                 onChange={handleQuillChange("translation")}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 placeholder="Enter translation"
//                             />
//                         </div>
//                     </div>

//                     {/* Note */}
//                     <div>
//                         <label className={labelClass}>Note</label>
//                         <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
//                             <ReactQuill
//                                 theme="snow"
//                                 value={mallalekhaForm.note}
//                                 onChange={handleQuillChange("note")}
//                                 modules={quillModulesMinimal}
//                                 formats={quillFormatsMinimal}
//                                 placeholder="Enter note"
//                             />
//                         </div>
//                     </div>

//                     {/* Reference */}
//                     <div>
//                         <label className={labelClass}>Reference</label>
//                         <div className="quill-field border border-gray-300 rounded-lg overflow-hidden">
//                             <ReactQuill
//                                 theme="snow"
//                                 value={mallalekhaForm.reference}
//                                 onChange={handleQuillChange("reference")}
//                                 modules={quillModulesMinimal}
//                                 formats={quillFormatsMinimal}
//                                 placeholder="Enter reference"
//                             />
//                         </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={handleCancel}
//                             className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm disabled:opacity-60"
//                         >
//                             {submitting ? "Updating..." : "Update"}
//                         </button>
//                     </div>
//                 </form>
//             </div>

//             <style>{`
//                 .ql-container.ql-snow,
//                 .ql-toolbar.ql-snow {
//                     border: none;
//                     outline: none;
//                 }
//                 .ql-container.ql-snow:focus-within,
//                 .ql-editor:focus {
//                     outline: none;
//                     box-shadow: none;
//                 }
//                 .ql-toolbar {
//                     border-bottom: 1px solid #d1d5db !important;
//                     background-color: #f9fafb;
//                 }
//                 .ql-container {
//                     font-size: 0.875rem;
//                     height: 200px;
//                     overflow: hidden;
//                 }
//                 .ql-editor {
//                     height: 120px;
//                     overflow-y: auto;
//                     resize: none;
//                 }
//                 .quill-field:focus-within {
//                     outline: none;
//                     box-shadow: none;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default EditMallalekhaForm;