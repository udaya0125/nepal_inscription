// import AddMallalekhaForm from "@/AddFormComponents/AddMallalekhaForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import EditMallalekhaForm from "@/EditFormComponents/EditMallalekhaForm";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Edit, Edit2, Info, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";
// import { Link } from "@inertiajs/react";

// const Mallalekha = () => {
//     const [allMallalekha, setAllMallalekha] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingMallalekha, setEditingMallalekha] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [deletingId, setDeletingId] = useState(null);
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     useEffect(() => {
//         const fetchMallalekha = async () => {
//             try {
//                 const response = await axios.get(route("ourmallalekha.index"));
//                 setAllMallalekha(response.data.data ?? []);
//             } catch (error) {
//                 console.error("Fetching error:", error);
//             }
//         };
//         fetchMallalekha();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this record?"))
//             return;
//         try {
//             setDeletingId(id);
//             await axios.delete(route("ourmallalekha.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     const handleEdit = (mallalekha) => {
//         setEditingMallalekha(mallalekha);
//         setShowEditForm(true);
//     };

//     // Define columns for the table
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//             },
//             {
//                 Header: "Banner",
//                 accessor: "banner_image",
//                 Cell: ({ value, row }) => (
//                     value ? (
//                         <img
//                             src={`${imgurl}/${value}`}
//                             alt={row.original.title}
//                             className="w-14 h-10 object-cover rounded border"
//                         />
//                     ) : (
//                         <span className="text-gray-300 italic text-xs">
//                             No image
//                         </span>
//                     )
//                 ),
//             },
//             {
//                 Header: "Title",
//                 accessor: "title",
//                 Cell: ({ value }) => (
//                     <div className="max-w-[160px] truncate font-medium text-gray-800">
//                         {value}
//                     </div>
//                 ),
//             },
//             {
//                 Header: "WCHN ID",
//                 accessor: "wchn_id",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">
//                         {value || <span className="text-gray-300">—</span>}
//                     </span>
//                 ),
//             },
//             // {
//             //     Header: "Short Description",
//             //     accessor: "short_description",
//             //     Cell: ({ value }) => (
//             //         <div className="max-w-[200px] truncate text-gray-600">
//             //             {value || <span className="text-gray-300">—</span>}
//             //         </div>
//             //     ),
//             // },
//             {
//                 Header: "Status",
//                 accessor: "status",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             value === "published"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-yellow-100 text-yellow-700"
//                         }`}
//                     >
//                         {value === "published" ? "Published" : "Draft"}
//                     </span>
//                 ),
//             },
//             // {
//             //     Header: "Images",
//             //     accessor: "images",
//             //     Cell: ({ value }) => (
//             //         <span className="text-gray-600">
//             //             {value?.length > 0 ? (
//             //                 <span className="inline-flex items-center gap-1">
//             //                     <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full text-xs flex items-center justify-center font-semibold">
//             //                         {value.length}
//             //                     </span>
//             //                     photo{value.length !== 1 ? "s" : ""}
//             //                 </span>
//             //             ) : (
//             //                 <span className="text-gray-300 text-xs">None</span>
//             //             )}
//             //         </span>
//             //     ),
//             // },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex items-center justify-center gap-2">
//                          {/* <Link
//                             href={`/mallalekha/${row.original.slug}`}
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                         >
//                             <Info size={18} />
//                         </Link> */}
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                             title="Edit"
//                         >
//                             <Edit size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             disabled={deletingId === row.original.id}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                             title="Delete"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [deletingId]
//     );

//     return (
//         <AdminWrapper>
//             {/* Page Header */}
//             <div className="mb-8 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         Mallalekha Management
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         {allMallalekha.length} record
//                         {allMallalekha.length !== 1 ? "s" : ""} found
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => {
//                         setEditingMallalekha(null);
//                         setShowAddForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Table */}
//             <MyTable columns={columns} data={allMallalekha} />

//             {/* Add Form */}
//             <AddMallalekhaForm
//                 showForm={showAddForm}
//                 setShowForm={setShowAddForm}
//                 setReloadTrigger={setReloadTrigger}
//             />

//             {/* Edit Form */}
//             <EditMallalekhaForm
//                 showForm={showEditForm}
//                 setShowForm={setShowEditForm}
//                 editingMallalekha={editingMallalekha}
//                 setEditingMallalekha={setEditingMallalekha}
//                 setReloadTrigger={setReloadTrigger}
//             />
//         </AdminWrapper>
//     );
// };

// export default Mallalekha;


import AddMallalekhaForm from "@/AddFormComponents/AddMallalekhaForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditMallalekhaForm from "@/EditFormComponents/EditMallalekhaForm";
import MallalekhaTable from "@/MyTable/MallalekhaTable";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const Mallalekha = () => {
    const [allMallalekha, setAllMallalekha] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingMallalekha, setEditingMallalekha] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMallalekha = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    route("ourmallalekha.index") + `?page=${currentPage}`
                );
                setAllMallalekha(response.data.data ?? []);
                setPagination(response.data.pagination ?? null);
            } catch (error) {
                console.error("Fetching error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMallalekha();
    }, [reloadTrigger, currentPage]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?"))
            return;
        try {
            setDeletingId(id);
            await axios.delete(route("ourmallalekha.destroy", { id }));
            if (allMallalekha.length === 1 && currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
            } else {
                setReloadTrigger((prev) => !prev);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (mallalekha) => {
        setEditingMallalekha(mallalekha);
        setShowEditForm(true);
    };

    return (
        <AdminWrapper>
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Mallalekha Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {pagination
                            ? `Showing ${pagination.from ?? 0}–${pagination.to ?? 0} of ${pagination.total} records`
                            : `${allMallalekha.length} record${allMallalekha.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingMallalekha(null);
                        setShowAddForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Table */}
            <MallalekhaTable
                data={allMallalekha}
                pagination={pagination}
                currentPage={currentPage}
                loading={loading}
                deletingId={deletingId}
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Add Form */}
            <AddMallalekhaForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
            />

            {/* Edit Form */}
            <EditMallalekhaForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                editingMallalekha={editingMallalekha}
                setEditingMallalekha={setEditingMallalekha}
                setReloadTrigger={setReloadTrigger}
            />
        </AdminWrapper>
    );
};

export default Mallalekha;