// import AddPalaeographicalForm from "@/AddFormComponents/AddPalaeographicalForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const PalaeographicalDatabase = () => {
//     const [allPalaeographical, setAllPalaeographical] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingPalaeographical, setEditingPalaeographical] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the palaeographical data
//     useEffect(() => {
//         const fetchPalaeographical = async () => {
//             try {
//                 const response = await axios.get(
//                     route("palaeographical.index"),
//                 );
//                 setAllPalaeographical(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchPalaeographical();
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route("categorywithsubcategory.indexWithSubCategory"),
//                 );
//                 setAllCategory(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching category:", error);
//                 setAllCategory([]);
//             }
//         };
//         fetchCategory();
//     }, [reloadTrigger]);

//     // For delete the palaeographical
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("palaeographical.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (palaeographical) => {
//         setEditingPalaeographical(palaeographical);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("palaeographical.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating palaeographical", error);
//             throw error;
//         }
//     };

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="py-4 ">
//                     {/* Header with Add Button */}
//                     <div className="mb-8 flex justify-between items-center">
//                         <div>
//                             <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                                 Palaeographical Management
//                             </h1>
//                         </div>
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>
//                     <AddPalaeographicalForm
//                         showForm={showForm}
//                         setShowForm={setShowForm}
//                         // handleCreate={handleCreate}
//                         handleUpdate={handleUpdate}
//                         editingPalaeographical={editingPalaeographical}
//                         setReloadTrigger={setReloadTrigger}
//                         reloadTrigger={reloadTrigger}
//                     />
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default PalaeographicalDatabase;

import AddPalaeographicalForm from "@/AddFormComponents/AddPalaeographicalForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";


const PalaeographicalDatabase = () => {
    const [allPalaeographical, setAllPalaeographical] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPalaeographical, setEditingPalaeographical] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchPalaeographical = async () => {
            try {
                const response = await axios.get(
                    route("ourpalaeographical.index"),
                );
                setAllPalaeographical(response.data.data || []);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    route("categorywithsubcategory.indexWithSubCategory"),
                );
                console.log("RAW CATEGORY DATA:", response.data);
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };

        fetchPalaeographical();
        fetchCategory();
    }, [reloadTrigger]);

    console.log("All Palaeographical Records:", allPalaeographical);
    console.log("All Categories:", allCategory);

    const handleDelete = async (id) => {
        try {
            await axios.delete(route("ourpalaeographical.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (palaeographical) => {
        setEditingPalaeographical(palaeographical);
        setShowForm(true);
    };

    // Define columns for the table
    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "serialNumber",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
                width: 60,
            },
            {
                Header: "Image",
                accessor: "image",
                Cell: ({ row }) => (
                    <div className="flex items-center">
                        {row.original.image ? (
                            <img
                                src={`/storage/${row.original.image}`}
                                alt={row.original.image_name || "img"}
                                className="w-12 h-12 object-cover rounded"
                            />
                        ) : (
                            <span className="text-gray-400">No image</span>
                        )}
                    </div>
                ),
            },
            {
                Header: "Image Name",
                accessor: "image_name",
                Cell: ({ row }) => <span>{row.original.image_name || "N/A"}</span>,
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ row }) => (
                    <span>{row.original.category?.name || "N/A"}</span>
                ),
            },
            {
                Header: "Sub Category",
                accessor: "sub_category",
                Cell: ({ row }) => (
                    <span>{row.original.sub_category?.name || "N/A"}</span>
                ),
            },
            {
                Header: "Period",
                accessor: "period",
                Cell: ({ row }) => <span>{row.original.period || "N/A"}</span>,
            },
            {
                Header: "Script",
                accessor: "script",
                Cell: ({ row }) => <span>{row.original.script || "N/A"}</span>,
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                        >
                            <Pencil  size={16}/>
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <AdminWrapper>
            <div className="">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Palaeographical Management
                    </h1>
                    <button
                        onClick={() => {
                            setEditingPalaeographical(null);
                            setShowForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {/* MyTable Component */}
                <MyTable
                    columns={columns} 
                    data={allPalaeographical} 
                />

                {showForm && (
                    <AddPalaeographicalForm
                        showForm={showForm}
                        setShowForm={setShowForm}
                        editingPalaeographical={editingPalaeographical}
                        setEditingPalaeographical={setEditingPalaeographical}
                        setReloadTrigger={setReloadTrigger}
                        allCategory={allCategory}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default PalaeographicalDatabase;
