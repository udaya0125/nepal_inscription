// import AddInscriptionForm from "@/AddFormComponents/AddInscriptionForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import {
//     Edit,
//     Trash2,
//     Eye,
//     FileText,
//     Video,
//     BookOpen,
//     FileVideo,
//     Book,
//     Globe,
//     X,
//     Info,
// } from "lucide-react";
// import parse from "html-react-parser";
// import EditInscriptionForm from "@/EditFormComponents/EditInscriptionForm";
// import { Link } from "@inertiajs/react";
// import MyTable from "@/MyTable/MyTable";

// const Inscriptions = () => {
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [allInscriptions, setAllInscriptions] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingInscription, setEditingInscription] = useState(null);
//     const [selectedInscription, setSelectedInscription] = useState(null);
//     const [showDetailsModal, setShowDetailsModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [activeTab, setActiveTab] = useState("overview");
//     const [pagination, setPagination] = useState({
//         total: 0,
//         per_page: 10,
//         current_page: 1,
//         last_page: 1,
//     });
//     const [deletingImageId, setDeletingImageId] = useState(null);

//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     // For the Fetching of all inscriptions with pagination
//     const fetchInscriptions = useCallback(async (page = 1, pageSize = 10) => {
//         try {
//             setLoading(true);
//             const response = await axios.get(route("ourinscription.index"), {
//                 params: {
//                     page: page,
//                     per_page: pageSize,
//                 },
//             });

//             const responseData = response.data;

//             // Check different possible response structures
//             if (responseData.data) {
//                 if (Array.isArray(responseData.data.data)) {
//                     // Laravel paginated response structure
//                     setAllInscriptions(responseData.data.data || []);
//                     setPagination({
//                         total: responseData.data.total || 0,
//                         per_page: responseData.data.per_page || pageSize,
//                         current_page: responseData.data.current_page || page,
//                         last_page: responseData.data.last_page || 1,
//                     });
//                 } else if (Array.isArray(responseData.data)) {
//                     // Direct array response
//                     setAllInscriptions(responseData.data || []);
//                     setPagination({
//                         total: responseData.data.length || 0,
//                         per_page: pageSize,
//                         current_page: page,
//                         last_page:
//                             Math.ceil(responseData.data.length / pageSize) || 1,
//                     });
//                 }
//             } else if (Array.isArray(responseData)) {
//                 // Direct array response (no wrapper)
//                 setAllInscriptions(responseData || []);
//                 setPagination({
//                     total: responseData.length || 0,
//                     per_page: pageSize,
//                     current_page: page,
//                     last_page: Math.ceil(responseData.length / pageSize) || 1,
//                 });
//             } else {
//                 // Fallback to empty array
//                 setAllInscriptions([]);
//             }
//         } catch (error) {
//             console.error("Error fetching inscriptions:", error);
//             setAllInscriptions([]);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchInscriptions(pagination.current_page, pagination.per_page);
//     }, [
//         reloadTrigger,
//         fetchInscriptions,
//         pagination.current_page,
//         pagination.per_page,
//     ]);

//     // For Delete the Inscription
//     const handleDelete = useCallback(async (id) => {
//         if (
//             !window.confirm("Are you sure you want to delete this inscription?")
//         ) {
//             return;
//         }

//         try {
//             await axios.delete(route("ourinscription.destroy", { id: id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Error deleting inscription:", error);
//             alert("Failed to delete inscription");
//         }
//     }, []);

//     // For the Edit the Inscription
//     const handleEdit = useCallback((inscription) => {
//         setEditingInscription(inscription);
//         setShowEditForm(true);
//     }, []);

//     // For View Details
//     const handleViewDetails = useCallback((inscription) => {
//         setSelectedInscription(inscription);
//         setActiveTab("overview");
//         setShowDetailsModal(true);
//     }, []);

//     // Close form handlers
//     const handleCloseAddForm = useCallback(() => {
//         setShowAddForm(false);
//     }, []);

//     const handleCloseEditForm = useCallback(() => {
//         setShowEditForm(false);
//         setEditingInscription(null);
//     }, []);

//     // Close details modal
//     const handleCloseDetails = useCallback(() => {
//         setShowDetailsModal(false);
//         setSelectedInscription(null);
//         setDeletingImageId(null);
//     }, []);

//     // Delete gallery image
//     const handleDeleteImage = useCallback(async (imageId) => {
//         if (!window.confirm("Are you sure you want to delete this image?")) {
//             return;
//         }

//         try {
//             setDeletingImageId(imageId);
//             await axios.delete(
//                 route("ourinscription.destroyImage", { id: imageId }),
//             );

//             // Update the selected inscription state to remove the deleted image
//             setSelectedInscription((prev) => ({
//                 ...prev,
//                 images: prev.images.filter((img) => img.id !== imageId),
//             }));

//             // Refresh the inscriptions list
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Error deleting image:", error);
//             alert("Failed to delete image");
//         } finally {
//             setDeletingImageId(null);
//         }
//     }, []);

//     const handleStatusChange = useCallback(async (id, newStatus) => {
//         try {
//             setLoading(true);
//             await axios.patch(
//                 route("ourinscription.updateStatus", { id: id }),
//                 {
//                     status: newStatus,
//                 },
//             );

//             // Refresh the data
//             setReloadTrigger((prev) => !prev);

//             // Show success message
//             alert(`Status changed to ${newStatus} successfully!`);
//         } catch (error) {
//             console.error("Error updating status:", error);
//             alert("Failed to update status");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // React Table columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: (row, index) => index + 1,
//                 id: "rowIndex",
//                 Cell: ({ row }) => (
//                     <div className="text-sm font-medium text-gray-900">
//                         {row.index + 1}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Title",
//                 accessor: "title",
//                 Cell: ({ row }) => (
//                     <div className="flex items-center">
//                         <div>
//                             <div className="text-sm font-medium text-gray-900">
//                                 {row.original.title}
//                             </div>
//                         </div>
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Inscription Number",
//                 accessor: "inscription_number",
//                 Cell: ({ row }) => (
//                     <div className="flex items-center">
//                         <div>
//                             <div className="text-sm font-medium text-gray-900">
//                                 {row.original.inscription_number}
//                             </div>
//                         </div>
//                     </div>
//                 ),
//             },
//             {
//                 Header: "Status",
//                 accessor: "status",
//                 Cell: ({ row }) => {
//                     const status = row.original.status || "draft";
//                     const statusOptions = [
//                         {
//                             value: "draft",
//                             label: "Draft",
//                             color: "bg-yellow-100 text-yellow-800",
//                         },
//                         {
//                             value: "published",
//                             label: "Published",
//                             color: "bg-green-100 text-green-800",
//                         },
//                     ];

//                     const currentOption =
//                         statusOptions.find((opt) => opt.value === status) ||
//                         statusOptions[0];

//                     return (
//                         <div className="relative group">
//                             <select
//                                 value={status}
//                                 onChange={(e) =>
//                                     handleStatusChange(
//                                         row.original.id,
//                                         e.target.value,
//                                     )
//                                 }
//                                 className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer appearance-none pr-8 ${currentOption.color} border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                                 disabled={loading}
//                             >
//                                 {statusOptions.map((option) => (
//                                     <option
//                                         key={option.value}
//                                         value={option.value}
//                                     >
//                                         {option.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     );
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex space-x-2">
//                         <Link
//                             href={`/inscription-details/${row.original.slug}`}
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                         >
//                             <Info size={18} />
//                         </Link>
//                         <button
//                             onClick={() => handleViewDetails(row.original)}
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                             title="View Details"
//                         >
//                             <Eye size={18} />
//                         </button>
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                             title="Edit"
//                         >
//                             <Edit size={18} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                             title="Delete"
//                         >
//                             <Trash2 size={18} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [handleViewDetails, handleEdit, handleDelete, loading],
//     );

//     // Details modal tabs
//     const tabs = useMemo(
//         () => [
//             { id: "overview", label: "Overview", icon: <Eye size={16} /> },
//             {
//                 id: "text",
//                 label: "Text & Translation",
//                 icon: <FileText size={16} />,
//             },
//             {
//                 id: "background",
//                 label: "Background",
//                 icon: <BookOpen size={16} />,
//             },
//             { id: "references", label: "References", icon: <Book size={16} /> },
//             { id: "glossary", label: "Glossary", icon: <Globe size={16} /> },
//             { id: "media", label: "Media", icon: <FileVideo size={16} /> },
//         ],
//         [],
//     );

//     return (
//         <AdminWrapper>
//             <div>
//                 <div className="relative z-10">
//                     {/* Home Content with glassmorphism effect */}
//                     <div className="">
//                         <div className="w-full  flex justify-between items-center">
//                             <h1 className="text-3xl font-bold ">
//                                 Inscriptions
//                             </h1>
//                             <button
//                                 onClick={() => setShowAddForm(true)}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
//                             >
//                                 Add Inscription
//                             </button>
//                         </div>

//                         {/* Table Container */}
//                         <div className="">
//                             {loading ? (
//                                 <div className="text-center py-8">
//                                     Loading...
//                                 </div>
//                             ) : (
//                                 <MyTable
//                                     columns={columns}
//                                     data={allInscriptions}
//                                 />
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Add Form Modal */}
//             {showAddForm && (
//                 <AddInscriptionForm
//                     showForm={showAddForm}
//                     setShowForm={handleCloseAddForm}
//                     setReloadTrigger={setReloadTrigger}
//                 />
//             )}

//             {/* Edit Form Modal */}
//             {showEditForm && editingInscription && (
//                 <EditInscriptionForm
//                     showForm={showEditForm}
//                     setShowForm={handleCloseEditForm}
//                     editingInscription={editingInscription}
//                     setReloadTrigger={setReloadTrigger}
//                 />
//             )}

//             {/* Details Modal */}
//             {showDetailsModal && selectedInscription && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//                     {/* Dark overlay */}
//                     <div className="absolute inset-0 bg-black/50"></div>

//                     {/* Modal content */}
//                     <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//                         {/* Header */}
//                         <div className="p-6 border-b border-gray-200">
//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <h2 className="text-4xl font-bold text-gray-800">
//                                         {selectedInscription.title}
//                                     </h2>
//                                 </div>
//                                 <button
//                                     onClick={handleCloseDetails}
//                                     className="text-gray-500 hover:text-gray-700 text-2xl bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-sm hover:shadow border border-gray-200"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Tabs */}
//                         <div className="border-b border-gray-200">
//                             <div className="flex overflow-x-auto">
//                                 {tabs.map((tab) => (
//                                     <button
//                                         key={tab.id}
//                                         onClick={() => setActiveTab(tab.id)}
//                                         className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-all ${
//                                             activeTab === tab.id
//                                                 ? "border-blue-600 text-blue-700 bg-gray-50"
//                                                 : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
//                                         }`}
//                                     >
//                                         <span className="mr-2">{tab.icon}</span>
//                                         {tab.label}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Tab Content */}
//                         <div className="flex-1 overflow-y-auto p-6">
//                             {/* Overview Tab */}
//                             {activeTab === "overview" && (
//                                 <div className="space-y-6">
//                                     <div>
//                                         {/* Banner Image */}
//                                         <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
//                                             {selectedInscription.banner_image ? (
//                                                 <img
//                                                     src={`${imgurl}/${selectedInscription.banner_image}`}
//                                                     alt={
//                                                         selectedInscription.title
//                                                     }
//                                                     className="w-full h-64 object-cover"
//                                                 />
//                                             ) : (
//                                                 <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
//                                                     <span className="text-gray-400">
//                                                         No Banner Image
//                                                     </span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Description */}
//                                     <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                                         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                                             <FileText
//                                                 className="mr-2"
//                                                 size={20}
//                                             />
//                                             Description
//                                         </h3>
//                                         <div className="prose max-w-none rich-text-content">
//                                             {selectedInscription.description ? (
//                                                 parse(
//                                                     selectedInscription.description,
//                                                 )
//                                             ) : (
//                                                 <p className="text-gray-500 italic">
//                                                     No description provided
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Text & Translation Tab */}
//                             {activeTab === "text" && (
//                                 <div className="space-y-6">
//                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                         {/* Original Text */}
//                                         <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                                             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                                                 Original Text
//                                             </h3>
//                                             <div className="bg-gray-50 rounded p-4 border border-gray-200 rich-text-content">
//                                                 {selectedInscription.text ? (
//                                                     parse(
//                                                         selectedInscription.text,
//                                                     )
//                                                 ) : (
//                                                     <p className="text-gray-500 italic">
//                                                         No original text
//                                                         provided
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         {/* Translation */}
//                                         <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                                             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                                                 Translation
//                                             </h3>
//                                             <div className="bg-blue-50 rounded p-4 border border-blue-200 rich-text-content">
//                                                 {selectedInscription.translation ? (
//                                                     parse(
//                                                         selectedInscription.translation,
//                                                     )
//                                                 ) : (
//                                                     <p className="text-gray-500 italic">
//                                                         No translation provided
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Background Tab */}
//                             {activeTab === "background" && (
//                                 <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                                     <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                                         <BookOpen className="mr-2" size={20} />
//                                         Historical Background
//                                     </h3>
//                                     <div className="prose max-w-none rich-text-content">
//                                         {selectedInscription.background ? (
//                                             parse(
//                                                 selectedInscription.background,
//                                             )
//                                         ) : (
//                                             <p className="text-gray-500 italic">
//                                                 No background information
//                                                 provided
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* References Tab */}
//                             {activeTab === "references" && (
//                                 <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                                     <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                                         <Book className="mr-2" size={20} />
//                                         References
//                                     </h3>
//                                     <div className="prose max-w-none rich-text-content">
//                                         {selectedInscription.references ? (
//                                             parse(
//                                                 selectedInscription.references,
//                                             )
//                                         ) : (
//                                             <p className="text-gray-500 italic">
//                                                 No references provided
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Glossary Tab */}
//                             {activeTab === "glossary" && (
//                                 <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                                     <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                                         <Globe className="mr-2" size={20} />
//                                         Glossary
//                                     </h3>
//                                     <div className="prose max-w-none rich-text-content">
//                                         {selectedInscription.glossary ? (
//                                             parse(selectedInscription.glossary)
//                                         ) : (
//                                             <p className="text-gray-500 italic">
//                                                 No glossary terms provided
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Media Tab */}
//                             {activeTab === "media" && (
//                                 <div className="space-y-6">
//                                     {/* Video Section */}
//                                     {selectedInscription.video && (
//                                         <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                                             <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                                                 <Video
//                                                     className="mr-2"
//                                                     size={20}
//                                                 />
//                                                 Video Content
//                                             </h3>
//                                             {/* Video Banner */}
//                                             {selectedInscription.video_banner && (
//                                                 <div className="mb-4">
//                                                     <h4 className="text-sm font-medium text-gray-600 mb-2">
//                                                         Video Thumbnail:
//                                                     </h4>
//                                                     <div className="relative">
//                                                         <img
//                                                             src={`${imgurl}/${selectedInscription.video_banner}`}
//                                                             alt="Video Thumbnail"
//                                                             className="w-full h-48 object-cover rounded-lg border border-gray-300"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
//                                                 <video
//                                                     className="w-full h-auto max-h-[400px]"
//                                                     controls
//                                                     src={`${imgurl}/${selectedInscription.video}`}
//                                                 >
//                                                     Your browser does not
//                                                     support the video tag.
//                                                 </video>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Gallery Images */}
//                                     {selectedInscription.images &&
//                                         Array.isArray(
//                                             selectedInscription.images,
//                                         ) &&
//                                         selectedInscription.images.length >
//                                             0 && (
//                                             <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                                                 <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                                                     Gallery Images
//                                                 </h3>
//                                                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                                                     {selectedInscription.images.map(
//                                                         (image, index) => (
//                                                             <div
//                                                                 key={image.id}
//                                                                 className="relative group"
//                                                             >
//                                                                 <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
//                                                                     <img
//                                                                         src={`${imgurl}/${image.image_path}`}
//                                                                         alt={`Gallery ${index + 1}`}
//                                                                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                                                                     />
//                                                                 </div>
//                                                                 {/* <button
//                                                                     onClick={() =>
//                                                                         handleDeleteImage(
//                                                                             image.id,
//                                                                         )
//                                                                     }
//                                                                     disabled={
//                                                                         deletingImageId ===
//                                                                         image.id
//                                                                     }
//                                                                     className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full  transition-opacity hover:bg-red-700 disabled:opacity-50"
//                                                                     title="Delete image"
//                                                                 >
//                                                                     {deletingImageId ===
//                                                                     image.id ? (
//                                                                         <span className="animate-spin block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
//                                                                     ) : (
//                                                                         <Trash2
//                                                                             size={
//                                                                                 16
//                                                                             }
//                                                                         />
//                                                                     )}
//                                                                 </button> */}
//                                                             </div>
//                                                         ),
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </AdminWrapper>
//     );
// };

// export default Inscriptions;

import AddInscriptionForm from "@/AddFormComponents/AddInscriptionForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    Edit,
    Trash2,
    Eye,
    FileText,
    Video,
    BookOpen,
    FileVideo,
    Book,
    Globe,
    X,
    Info,
} from "lucide-react";
import parse from "html-react-parser";
import EditInscriptionForm from "@/EditFormComponents/EditInscriptionForm";
import { Link } from "@inertiajs/react";
import MyTable from "@/MyTable/MyTable";

const Inscriptions = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allInscriptions, setAllInscriptions] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingInscription, setEditingInscription] = useState(null);
    const [selectedInscription, setSelectedInscription] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });
    const [deletingImageId, setDeletingImageId] = useState(null);

    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // For the Fetching of all inscriptions with pagination
    const fetchInscriptions = useCallback(async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await axios.get(route("ourinscription.index"), {
                params: {
                    page: page,
                    per_page: pageSize,
                },
            });

            const responseData = response.data;

            if (responseData.data) {
                if (Array.isArray(responseData.data)) {
                    // Your current backend shape: { success, data: [...], meta: {...} }
                    setAllInscriptions(responseData.data || []);
                    setPagination({
                        total:
                            responseData.meta?.total ??
                            responseData.data.length ??
                            0,
                        per_page: responseData.meta?.per_page ?? pageSize,
                        current_page: responseData.meta?.current_page ?? page,
                        last_page: responseData.meta?.last_page ?? 1,
                    });
                } else if (Array.isArray(responseData.data.data)) {
                    // Fallback: raw Laravel paginator shape
                    setAllInscriptions(responseData.data.data || []);
                    setPagination({
                        total: responseData.data.total || 0,
                        per_page: responseData.data.per_page || pageSize,
                        current_page: responseData.data.current_page || page,
                        last_page: responseData.data.last_page || 1,
                    });
                }
            } else if (Array.isArray(responseData)) {
                setAllInscriptions(responseData || []);
                setPagination({
                    total: responseData.length || 0,
                    per_page: pageSize,
                    current_page: page,
                    last_page: Math.ceil(responseData.length / pageSize) || 1,
                });
            } else {
                setAllInscriptions([]);
            }
        } catch (error) {
            console.error("Error fetching inscriptions:", error);
            setAllInscriptions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInscriptions(pagination.current_page, pagination.per_page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        reloadTrigger,
        fetchInscriptions,
        pagination.current_page,
        pagination.per_page,
    ]);

    // Page navigation handlers — these drive the SERVER request, not a local re-slice
    const handlePageChange = useCallback((newPage) => {
        setPagination((prev) => ({ ...prev, current_page: newPage }));
    }, []);

    const handlePageSizeChange = useCallback((newSize) => {
        setPagination((prev) => ({
            ...prev,
            per_page: newSize,
            current_page: 1,
        }));
    }, []);

    // For Delete the Inscription
    const handleDelete = useCallback(async (id) => {
        if (
            !window.confirm("Are you sure you want to delete this inscription?")
        ) {
            return;
        }

        try {
            await axios.delete(route("ourinscription.destroy", { id: id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Error deleting inscription:", error);
            alert("Failed to delete inscription");
        }
    }, []);

    const handleEdit = useCallback((inscription) => {
        setEditingInscription(inscription);
        setShowEditForm(true);
    }, []);

    const handleViewDetails = useCallback((inscription) => {
        setSelectedInscription(inscription);
        setActiveTab("overview");
        setShowDetailsModal(true);
    }, []);

    const handleCloseAddForm = useCallback(() => {
        setShowAddForm(false);
    }, []);

    const handleCloseEditForm = useCallback(() => {
        setShowEditForm(false);
        setEditingInscription(null);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setShowDetailsModal(false);
        setSelectedInscription(null);
        setDeletingImageId(null);
    }, []);

    const handleDeleteImage = useCallback(async (imageId) => {
        if (!window.confirm("Are you sure you want to delete this image?")) {
            return;
        }

        try {
            setDeletingImageId(imageId);
            await axios.delete(
                route("ourinscription.destroyImage", { id: imageId }),
            );

            setSelectedInscription((prev) => ({
                ...prev,
                images: prev.images.filter((img) => img.id !== imageId),
            }));

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image");
        } finally {
            setDeletingImageId(null);
        }
    }, []);

    const handleStatusChange = useCallback(async (id, newStatus) => {
        try {
            setLoading(true);
            await axios.patch(
                route("ourinscription.updateStatus", { id: id }),
                {
                    status: newStatus,
                },
            );

            setReloadTrigger((prev) => !prev);
            alert(`Status changed to ${newStatus} successfully!`);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    }, []);

    // React Table columns
    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: (row, index) => index + 1,
                id: "rowIndex",
                Cell: ({ row }) => (
                    <div className="text-sm font-medium text-gray-900">
                        {/* Absolute row number across pages, not just within this page */}
                        {(pagination.current_page - 1) * pagination.per_page +
                            row.index +
                            1}
                    </div>
                ),
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ row }) => (
                    <div className="flex items-center">
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {row.original.title}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                Header: "Inscription Number",
                accessor: "inscription_number",
                Cell: ({ row }) => (
                    <div className="flex items-center">
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {row.original.inscription_number}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ row }) => {
                    const status = row.original.status || "draft";
                    const statusOptions = [
                        {
                            value: "draft",
                            label: "Draft",
                            color: "bg-yellow-100 text-yellow-800",
                        },
                        {
                            value: "published",
                            label: "Published",
                            color: "bg-green-100 text-green-800",
                        },
                    ];

                    const currentOption =
                        statusOptions.find((opt) => opt.value === status) ||
                        statusOptions[0];

                    return (
                        <div className="relative group">
                            <select
                                value={status}
                                onChange={(e) =>
                                    handleStatusChange(
                                        row.original.id,
                                        e.target.value,
                                    )
                                }
                                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer appearance-none pr-8 ${currentOption.color} border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                disabled={loading}
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Link
                            href={`/inscription-details/${row.original.slug}`}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        >
                            <Info size={18} />
                        </Link>
                        <button
                            onClick={() => handleViewDetails(row.original)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        [
            handleViewDetails,
            handleEdit,
            handleDelete,
            handleStatusChange,
            loading,
            pagination.current_page,
            pagination.per_page,
        ],
    );

    const tabs = useMemo(
        () => [
            { id: "overview", label: "Overview", icon: <Eye size={16} /> },
            {
                id: "text",
                label: "Text & Translation",
                icon: <FileText size={16} />,
            },
            {
                id: "background",
                label: "Background",
                icon: <BookOpen size={16} />,
            },
            { id: "references", label: "References", icon: <Book size={16} /> },
            { id: "glossary", label: "Glossary", icon: <Globe size={16} /> },
            { id: "media", label: "Media", icon: <FileVideo size={16} /> },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <div>
                <div className="relative z-10">
                    <div className="">
                        <div className="w-full flex justify-between items-center">
                            <h1 className="text-3xl font-bold">Inscriptions</h1>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                Add Inscription
                            </button>
                        </div>

                        <div className="">
                            {loading ? (
                                <div className="text-center py-8">
                                    Loading...
                                </div>
                            ) : (
                                <MyTable
                                    columns={columns}
                                    data={allInscriptions}
                                    currentPage={pagination.current_page}
                                    pageCount={pagination.last_page}
                                    pageSize={pagination.per_page}
                                    totalCount={pagination.total}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={handlePageSizeChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAddForm && (
                <AddInscriptionForm
                    showForm={showAddForm}
                    setShowForm={handleCloseAddForm}
                    setReloadTrigger={setReloadTrigger}
                />
            )}

            {showEditForm && editingInscription && (
                <EditInscriptionForm
                    showForm={showEditForm}
                    setShowForm={handleCloseEditForm}
                    editingInscription={editingInscription}
                    setReloadTrigger={setReloadTrigger}
                />
            )}

            {showDetailsModal && selectedInscription && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50"></div>

                    <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-800">
                                        {selectedInscription.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={handleCloseDetails}
                                    className="text-gray-500 hover:text-gray-700 text-2xl bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-sm hover:shadow border border-gray-200"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="border-b border-gray-200">
                            <div className="flex overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-all ${
                                            activeTab === tab.id
                                                ? "border-blue-600 text-blue-700 bg-gray-50"
                                                : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            {selectedInscription.banner_image ? (
                                                <img
                                                    src={`${imgurl}/${selectedInscription.banner_image}`}
                                                    alt={
                                                        selectedInscription.title
                                                    }
                                                    className="w-full h-64 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                                                    <span className="text-gray-400">
                                                        No Banner Image
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                            <FileText
                                                className="mr-2"
                                                size={20}
                                            />
                                            Description
                                        </h3>
                                        <div className="prose max-w-none rich-text-content">
                                            {selectedInscription.description ? (
                                                parse(
                                                    selectedInscription.description,
                                                )
                                            ) : (
                                                <p className="text-gray-500 italic">
                                                    No description provided
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "text" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                                Original Text
                                            </h3>
                                            <div className="bg-gray-50 rounded p-4 border border-gray-200 rich-text-content">
                                                {selectedInscription.text ? (
                                                    parse(
                                                        selectedInscription.text,
                                                    )
                                                ) : (
                                                    <p className="text-gray-500 italic">
                                                        No original text
                                                        provided
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                                Translation
                                            </h3>
                                            <div className="bg-blue-50 rounded p-4 border border-blue-200 rich-text-content">
                                                {selectedInscription.translation ? (
                                                    parse(
                                                        selectedInscription.translation,
                                                    )
                                                ) : (
                                                    <p className="text-gray-500 italic">
                                                        No translation provided
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "background" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                        <BookOpen className="mr-2" size={20} />
                                        Historical Background
                                    </h3>
                                    <div className="prose max-w-none rich-text-content">
                                        {selectedInscription.background ? (
                                            parse(
                                                selectedInscription.background,
                                            )
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                No background information
                                                provided
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "references" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                        <Book className="mr-2" size={20} />
                                        References
                                    </h3>
                                    <div className="prose max-w-none rich-text-content">
                                        {selectedInscription.references ? (
                                            parse(
                                                selectedInscription.references,
                                            )
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                No references provided
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "glossary" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                        <Globe className="mr-2" size={20} />
                                        Glossary
                                    </h3>
                                    <div className="prose max-w-none rich-text-content">
                                        {selectedInscription.glossary ? (
                                            parse(selectedInscription.glossary)
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                No glossary terms provided
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "media" && (
                                <div className="space-y-6">
                                    {selectedInscription.video && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                                <Video
                                                    className="mr-2"
                                                    size={20}
                                                />
                                                Video Content
                                            </h3>
                                            {selectedInscription.video_banner && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                                        Video Thumbnail:
                                                    </h4>
                                                    <div className="relative">
                                                        <img
                                                            src={`${imgurl}/${selectedInscription.video_banner}`}
                                                            alt="Video Thumbnail"
                                                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                                                <video
                                                    className="w-full h-auto max-h-[400px]"
                                                    controls
                                                    src={`${imgurl}/${selectedInscription.video}`}
                                                >
                                                    Your browser does not
                                                    support the video tag.
                                                </video>
                                            </div>
                                        </div>
                                    )}

                                    {selectedInscription.images &&
                                        Array.isArray(
                                            selectedInscription.images,
                                        ) &&
                                        selectedInscription.images.length >
                                            0 && (
                                            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                                    Gallery Images
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {selectedInscription.images.map(
                                                        (image, index) => (
                                                            <div
                                                                key={image.id}
                                                                className="relative group"
                                                            >
                                                                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                                                                    <img
                                                                        src={`${imgurl}/${image.image_path}`}
                                                                        alt={`Gallery ${index + 1}`}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminWrapper>
    );
};

export default Inscriptions;
