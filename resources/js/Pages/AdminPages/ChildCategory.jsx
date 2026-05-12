import AddChildCategory from '@/AddFormComponents/AddChildCategoryForm';
import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import axios from 'axios';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const ChildCategory = () => {
    const [allChildCategories, setAllChildCategories] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingChildCategory, setEditingChildCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the child category data
    useEffect(() => {
        const fetchChildCategory = async () => {
            try {
                const response = await axios.get(route("ourchildcategories.index"));
                setAllChildCategories(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchChildCategory();

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
        fetchCategory();
    }, [reloadTrigger]);

    console.log("All Child Categories:", allChildCategories);
    console.log("All Categories with Subcategories:", allCategory);

    // For delete the child category
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("ourchildcategories.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (childCategory) => {
        setEditingChildCategory(childCategory);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourchildcategories.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating child category", error);
            throw error;
        }
    };
  return (
    <>
      <AdminWrapper>
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Child Category Management
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                <AddChildCategory
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setReloadTrigger={setReloadTrigger}
                    editingChildCategory={editingChildCategory}
                    setEditingChildCategory={setEditingChildCategory}
                    handleUpdate={handleUpdate}
                />
            </AdminWrapper>
    </>
  )
}

export default ChildCategory
