// import AddChildCategory from '@/AddFormComponents/AddChildCategoryForm';
// import AdminWrapper from '@/AdminWrapper/AdminWrapper';
// import axios from 'axios';
// import { Plus } from 'lucide-react';
// import React, { useEffect, useState } from 'react'

// const ChildCategory = () => {
//     const [allChildCategories, setAllChildCategories] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingChildCategory, setEditingChildCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the child category data
//     useEffect(() => {
//         const fetchChildCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourchildcategories.index"));
//                 setAllChildCategories(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchChildCategory();

//          const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route("categorywithsubcategory.indexWithSubCategory"),
//                 );
//                 console.log("RAW CATEGORY DATA:", response.data);
//                 setAllCategory(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching category:", error);
//                 setAllCategory([]);
//             }
//         };
//         fetchCategory();
//     }, [reloadTrigger]);

//     console.log("All Child Categories:", allChildCategories);
//     console.log("All Categories with Subcategories:", allCategory);

//     // For delete the child category
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourchildcategories.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (childCategory) => {
//         setEditingChildCategory(childCategory);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourchildcategories.update", { id }),
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
//             console.log("Error updating child category", error);
//             throw error;
//         }
//     };
//   return (
//     <>
//       <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             Child Category Management
//                         </h1>
//                     </div>
//                     <button
//                         onClick={() => setShowForm(true)}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 <AddChildCategory
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingChildCategory={editingChildCategory}
//                     setEditingChildCategory={setEditingChildCategory}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//     </>
//   )
// }

// export default ChildCategory


import AddChildCategoryForm from '@/AddFormComponents/AddChildCategoryForm';
import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import axios from 'axios';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ChildCategory = () => {
    const [allChildCategories, setAllChildCategories] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingChildCategory, setEditingChildCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);

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

    return (
        <AdminWrapper>
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
                        setEditingChildCategory(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Subcategory
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allChildCategories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-10 text-center text-sm text-gray-400"
                                >
                                    No child categories found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            allChildCategories.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.category?.name ?? '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.sub_category?.name ?? '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            <AddChildCategoryForm
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={setReloadTrigger}
                editingChildCategory={editingChildCategory}
                setEditingChildCategory={setEditingChildCategory}
                handleUpdate={handleUpdate}
                allCategory={allCategory}
            />
        </AdminWrapper>
    );
};

export default ChildCategory;