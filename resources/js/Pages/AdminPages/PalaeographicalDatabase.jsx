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
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const PalaeographicalDatabase = () => {
    const [allPalaeographical, setAllPalaeographical] = useState([]);
    const [allCategory, setAllCategory] = useState([]); // ✅ was missing
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

        // const fetchCategory = async () => {
        //     try {
        //         const response = await axios.get(
        //             route("categorywithsubcategory.indexWithSubCategory")
        //         );
        //         setAllCategory(response.data.data || []);
        //     } catch (error) {
        //         console.error("Error fetching category:", error);
        //         setAllCategory([]);
        //     }
        // };
        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    route("categorywithsubcategory.indexWithSubCategory"),
                );
                console.log("RAW CATEGORY DATA:", response.data); // 👈 add this
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };

        fetchPalaeographical();
        fetchCategory();
    }, [reloadTrigger]);

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

    return (
        <AdminWrapper>
            <div className="py-4">
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

                {/* Records Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Image</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Sub Category</th>
                                <th className="px-4 py-3">Period</th>
                                <th className="px-4 py-3">Script</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allPalaeographical.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.image_name || "img"}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400">
                                                No image
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.category?.name || "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.sub_category?.name || "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.period || "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.script || "—"}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {allPalaeographical.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-8 text-gray-400"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <AddPalaeographicalForm
                        showForm={showForm}
                        setShowForm={setShowForm}
                        editingPalaeographical={editingPalaeographical}
                        setEditingPalaeographical={setEditingPalaeographical}
                        setReloadTrigger={setReloadTrigger}
                        allCategory={allCategory} // ✅ pass categories down
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default PalaeographicalDatabase;
