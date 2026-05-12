// import AddChildCategoryForm from '@/AddFormComponents/AddChildCategoryForm';
// import AdminWrapper from '@/AdminWrapper/AdminWrapper';
// import axios from 'axios';
// import { Pencil, Plus, Trash2 } from 'lucide-react';
// import React, { useEffect, useState, useMemo } from 'react';
// import MyTable from '@/MyTable/MyTable';

// const ChildCategory = () => {
//     const [allChildCategories, setAllChildCategories] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingChildCategory, setEditingChildCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchChildCategory = async () => {
//             try {
//                 const response = await axios.get(route('ourchildcategories.index'));
//                 setAllChildCategories(response.data.data || []);
//             } catch (error) {
//                 console.error('Fetching child categories failed:', error);
//             }
//         };

//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route('categorywithsubcategory.indexWithSubCategory')
//                 );
//                 setAllCategory(response.data.data || []);
//             } catch (error) {
//                 console.error('Fetching categories failed:', error);
//                 setAllCategory([]);
//             }
//         };

//         fetchChildCategory();
//         fetchCategory();
//     }, [reloadTrigger]);

//     console.log('All Child Categories:', allChildCategories);
//     console.log('All Categories with Subcategories:', allCategory);

//     const handleDelete = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this child category?')) return;
//         try {
//             await axios.delete(route('ourchildcategories.destroy', { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error('Delete failed:', error);
//         }
//     };

//     const handleEdit = (childCategory) => {
//         setEditingChildCategory(childCategory);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append('_method', 'PUT');
//         const response = await axios.post(
//             route('ourchildcategories.update', { id }),
//             formData,
//             { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     // Define table columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: "serialNumber",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//                 width: 60,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => (
//                     <span className="font-medium text-gray-800">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Category",
//                 accessor: "category",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">{value?.name ?? '—'}</span>
//                 ),
//             },
//             {
//                 Header: "Subcategory",
//                 accessor: "sub_category",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-600">{value?.name ?? '—'}</span>
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
//         []
//     );

//     // Prepare data for the table
//     const tableData = useMemo(() => allChildCategories, [allChildCategories]);

//     return (
//         <AdminWrapper>
//             <div className="py-4">
//                 {/* Header */}
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             Child Category Management
//                         </h1>
//                         <p className="text-sm text-gray-500 mt-1">
//                             {allChildCategories.length} child{' '}
//                             {allChildCategories.length === 1 ? 'category' : 'categories'}
//                         </p>
//                     </div>
//                     <button
//                         onClick={() => {
//                             setEditingChildCategory(null);
//                             setShowForm(true);
//                         }}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 {/* Table */}
//                 <MyTable columns={columns} data={tableData} />

//                 {/* Modal Form */}
//                 <AddChildCategoryForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingChildCategory={editingChildCategory}
//                     setEditingChildCategory={setEditingChildCategory}
//                     handleUpdate={handleUpdate}
//                     allCategory={allCategory}
//                 />
//             </div>
//         </AdminWrapper>
//     );
// };

// export default ChildCategory;

import AddChildCategoryForm from '@/AddFormComponents/AddChildCategoryForm';
import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import axios from 'axios';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import MyTable from '@/MyTable/MyTable';
import EditChildCategoryForm from '@/EditFormComponents/EditChildCategoryForm';

const ChildCategory = () => {
    const [allChildCategories, setAllChildCategories] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingChildCategory, setEditingChildCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchChildCategory = async () => {
            try {
                const response = await axios.get(route('ourchildcategories.index'));
                setAllChildCategories(response.data.data || []);
            } catch (error) {
                console.error('Fetching child categories failed:', error);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    route('categorywithsubcategory.indexWithSubCategory')
                );
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error('Fetching categories failed:', error);
                setAllCategory([]);
            }
        };

        fetchChildCategory();
        fetchCategory();
    }, [reloadTrigger]);

    console.log('All Child Categories:', allChildCategories);
    console.log('All Categories with Subcategories:', allCategory);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this child category?')) return;
        try {
            await axios.delete(route('ourchildcategories.destroy', { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleEdit = (childCategory) => {
        setEditingChildCategory(childCategory);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append('_method', 'PUT');
        const response = await axios.post(
            route('ourchildcategories.update', { id }),
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
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
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value?.name ?? '—'}</span>
                ),
            },
            {
                Header: "Subcategory",
                accessor: "sub_category",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value?.name ?? '—'}</span>
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
        []
    );

    // Prepare data for the table
    const tableData = useMemo(() => allChildCategories, [allChildCategories]);

    return (
        <AdminWrapper>
            <div className="py-4">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Child Category Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {allChildCategories.length} child{' '}
                            {allChildCategories.length === 1 ? 'category' : 'categories'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {/* Table */}
                <MyTable columns={columns} data={tableData} />

                {/* Add Form Modal */}
                <AddChildCategoryForm
                    showForm={showAddForm}
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                    allCategory={allCategory}
                />

                {/* Edit Form Modal */}
                <EditChildCategoryForm
                    showForm={showEditForm}
                    setShowForm={setShowEditForm}
                    editingChildCategory={editingChildCategory}
                    setEditingChildCategory={setEditingChildCategory}
                    setReloadTrigger={setReloadTrigger}
                    handleUpdate={handleUpdate}
                    allCategory={allCategory}
                />
            </div>
        </AdminWrapper>
    );
};

export default ChildCategory;