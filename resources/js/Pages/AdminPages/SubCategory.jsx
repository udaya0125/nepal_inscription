import AddSubCategoryForm from "@/AddFormComponents/AddSubCategoryForm";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import MyTable from "@/MyTable/MyTable";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditSubCategoryForm from "@/EditFormComponents/EditSubCategoryForm";

const SubCategory = () => {
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allCategory, setAllCategory] = useState([]);

    useEffect(() => {
        const fetchSubCategory = async () => {
            try {
                const response = await axios.get(
                    route("oursubcategories.index"),
                );
                setAllSubCategories(response.data.data || []);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchSubCategory();

        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this subcategory?"))
            return;
        try {
            const response = await axios.delete(
                route("oursubcategories.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (subCategory) => {
        setEditingSubCategory(subCategory);
        setShowEditForm(true);
    };

    // Define table columns
    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "serialNumber",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
                width: 60,
            },
            {
                Header: "Subcategory Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Parent Category",
                accessor: "category",
                Cell: ({ value }) => (
                    <span className="text-gray-600">
                        {value?.name || "N/A"}
                    </span>
                ),
            },
            {
                Header: "Created At",
                accessor: "created_at",
                Cell: ({ value }) => (
                    <span className="text-gray-500 text-sm">
                        {value ? new Date(value).toLocaleDateString() : "N/A"}
                    </span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex justify-start gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                        >
                            <Pencil size={16} />
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
                width: 100,
            },
        ],
        [],
    );

    // Prepare data for the table
    const tableData = useMemo(() => allSubCategories, [allSubCategories]);

    return (
        <>
            <AdminWrapper>
                <div className="py-4">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                SubCategory Management
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Total: {allSubCategories.length} subcategories
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Add Form */}
                    <AddSubCategoryForm
                        showForm={showAddForm}
                        setShowForm={setShowAddForm}
                        setReloadTrigger={setReloadTrigger}
                        allCategory={allCategory}
                    />

                    {/* Edit Form */}
                    <EditSubCategoryForm
                        showForm={showEditForm}
                        setShowForm={setShowEditForm}
                        editingSubCategory={editingSubCategory}
                        setEditingSubCategory={setEditingSubCategory}
                        setReloadTrigger={setReloadTrigger}
                        allCategory={allCategory}
                    />

                    {/* Table */}
                    <MyTable columns={columns} data={tableData} />
                </div>
            </AdminWrapper>
        </>
    );
};

export default SubCategory;

// import AddSubCategoryForm from "@/AddFormComponents/AddSubCategoryForm";
// import axios from "axios";
// import React, { useState, useEffect, useMemo } from "react";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import MyTable from "@/MyTable/MyTable";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";

// const SubCategory = () => {
//     const [allSubCategories, setAllSubCategories] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingSubCategory, setEditingSubCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [allCategory, setAllCategory] = useState([]);

//     useEffect(() => {
//         const fetchSubCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route("oursubcategories.index"), // ✅ Fixed route name
//                 );
//                 setAllSubCategories(response.data.data || []); // ✅ Access .data.data
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchSubCategory();

//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route("ourcategories.index"), // ✅ Fixed route name
//                 );
//                 setAllCategory(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching category:", error);
//                 setAllCategory([]);
//             }
//         };
//         fetchCategory();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this subcategory?"))
//             return;
//         try {
//             const response = await axios.delete(
//                 route("oursubcategories.destroy", { id: id }), // ✅ Fixed route name
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (subCategory) => {
//         setEditingSubCategory(subCategory);
//         setShowForm(true);
//     };

//     // ✅ Moved handleUpdate here so it can be passed as prop to form
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("oursubcategories.update", { id }), // ✅ Fixed route name
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
//             console.log("Error updating subcategory", error);
//             throw error;
//         }
//     };

//     // Define table columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "#",
//                 accessor: "serialNumber",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//                 width: 60,
//             },
//             {
//                 Header: "Subcategory Name",
//                 accessor: "name",
//                 Cell: ({ value }) => (
//                     <span className="font-medium text-gray-800">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Parent Category",
//                 accessor: "category",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">
//                         {value?.name || "N/A"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Created At",
//                 accessor: "created_at",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-500 text-sm">
//                         {value ? new Date(value).toLocaleDateString() : "N/A"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex justify-start gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                             title="Edit"
//                         >
//                             <Pencil size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                             title="Delete"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//                 width: 100,
//             },
//         ],
//         [], // Empty dependency array since handleEdit and handleDelete are stable
//     );

//     // Prepare data for the table
//     const tableData = useMemo(() => allSubCategories, [allSubCategories]);

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="py-4">
//                     <div className="mb-8 flex justify-between items-center">
//                         <div>
//                             <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                                 SubCategory Management
//                             </h1>
//                             <p className="text-gray-500 mt-1">
//                                 Total: {allSubCategories.length} subcategories
//                             </p>
//                         </div>
//                         <button
//                             onClick={() => {
//                                 setEditingSubCategory(null);
//                                 setShowForm(true);
//                             }}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     <AddSubCategoryForm
//                         showForm={showForm}
//                         setShowForm={setShowForm}
//                         handleUpdate={handleUpdate} // ✅ Pass handleUpdate
//                         editingSubCategory={editingSubCategory}
//                         setEditingSubCategory={setEditingSubCategory} // ✅ Pass setter
//                         setReloadTrigger={setReloadTrigger}
//                         reloadTrigger={reloadTrigger}
//                         allCategory={allCategory}
//                     />

//                     {/* Table */}
//                     <MyTable columns={columns} data={tableData} />
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default SubCategory;
