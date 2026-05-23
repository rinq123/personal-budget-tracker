import { useAuth } from '../context/useAuth';
import { useEffect, useState } from "react";
import { type SubmitEvent } from 'react';

type Category = {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    createdAt: string;
    updatedAt: string;
}

type EditCategoryResponse = {
    category: Category;
};

type CreateCategoryResponse = {
    category: Category;
}

type CategoriesResponse = {
    categories: Category[];
};




function CategoriesPage() {

    const { token } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('http://localhost:4000/categories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = (await response.json()) as CategoriesResponse;

                if (!response.ok) {
                    setError("Failed to load categories");
                    return;
                }
                setCategories(data.categories);
            } catch {
                setError("Could not connect to the API");
            } finally {
                setLoading(false);
            }


        }
        fetchCategories();
    }, [token]);

    async function handleCreateCategory(event: SubmitEvent<HTMLFormElement>) {

        try {
            event.preventDefault();

            const response = await fetch('http://localhost:4000/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    type: type,
                }),
            });
            const data = (await response.json()) as CreateCategoryResponse;

            if (!response.ok) {
                setError("Failed to create category");
                return;
            }
            setCategories((currentCategories) => [data.category, ...currentCategories]);
            setName("");
            setType("EXPENSE");
            setIsCreateModalOpen(false);
        }
        catch {
            setError("Could not connect to the API");
        }
    }

    async function handleDeleteCategory() {
        if (!selectedCategory) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/categories/${selectedCategory.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setError("Failed to delete category");
                return;
            }

            setCategories((currentCategories) =>
                currentCategories.filter((category) => category.id !== selectedCategory.id),
            );

            setSelectedCategory(null);
            setIsEditingCategory(false);
        } catch {
            setError("Could not connect to the API");
        }
    }

    function handleStartEdit() {
        if (!selectedCategory) {
            return;
        }

        setEditName(selectedCategory.name);
        setEditType(selectedCategory.type);
        setIsEditingCategory(true);
    }

    async function handleUpdateCategory(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedCategory) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:4000/categories/${selectedCategory.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: editName,
                        type: editType,
                    }),
                },
            );

            const data = (await response.json()) as EditCategoryResponse;

            if (!response.ok) {
                setError("Failed to update category");
                return;
            }

            setCategories((currentCategories) =>
                currentCategories.map((category) =>
                    category.id === data.category.id ? data.category : category,
                ),
            );

            setSelectedCategory(null);
            setIsEditingCategory(false);
        } catch {
            setError("Could not connect to the API");
        }
    }


    return (
        <main>
            <h1>Categories</h1>

            {loading && <p>Loading categories...</p>}
            {error && <p>{error}</p>}

            <button type="button" onClick={() => setIsCreateModalOpen(true)}>
                Add Category
            </button>

            {selectedCategory && (
                <div className="modal-backdrop" role="dialog" aria-modal="true">
                    <div className="modal-panel">
                        {!isEditingCategory ? (
                            <>
                                <h2>{selectedCategory.name}</h2>

                                <button type="button" onClick={handleStartEdit}>
                                    Edit
                                </button>

                                <button type="button" onClick={handleDeleteCategory}>
                                    Delete
                                </button>

                                <button type="button" onClick={() => setSelectedCategory(null)}>
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <h2>Edit Category</h2>

                                <form onSubmit={handleUpdateCategory}>
                                    <div>
                                        <label htmlFor="edit-category-name">Name</label>
                                        <input
                                            id="edit-category-name"
                                            type="text"
                                            value={editName}
                                            onChange={(event) => setEditName(event.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="edit-category-type">Type</label>
                                        <select
                                            id="edit-category-type"
                                            value={editType}
                                            onChange={(event) =>
                                                setEditType(event.target.value as "INCOME" | "EXPENSE")
                                            }
                                        >
                                            <option value="EXPENSE">Expense</option>
                                            <option value="INCOME">Income</option>
                                        </select>
                                    </div>

                                    <button type="submit">Save</button>

                                    <button type="button" onClick={() => setIsEditingCategory(false)}>
                                        Cancel
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <div className="modal-backdrop" role="dialog" aria-modal="true">
                    <div className="modal-panel">
                        <h2>Create Category</h2>
                        <form onSubmit={handleCreateCategory}>
                            <div>
                                <label htmlFor='category-name'>Name</label>
                                <input
                                    id="category-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor='category-type'>Type</label>
                                <select
                                    id="category-type"
                                    value={type}
                                    onChange={(event) => setType(event.target.value as "INCOME" | "EXPENSE")}>

                                    <option value="EXPENSE">Expense</option>
                                    <option value="INCOME">Income</option>
                                </select>
                            </div>
                            <button type="submit">Create</button>
                            <button type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        <span>
                            {category.name} - {category.type}
                        </span>
                        <button type="button" onClick={() => setSelectedCategory(category)}>
                            ...
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default CategoriesPage

