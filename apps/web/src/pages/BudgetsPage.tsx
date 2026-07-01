import { useState, useEffect, useCallback} from "react";
import { useAuth } from "../context/useAuth";
import { API_URL } from "../lib/api";

type CategoriesResponse = {
    categories: Category[];
};

type BudgetsResponse = {
    budgets: Budget[];
};

type BudgetSummariesResponse = {
    summaries: BudgetSummary[];
};

type Category = {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    createdAt: string;
    updatedAt: string;
};


type BudgetCategory = {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    createdAt: string;
    updatedAt: string;
};

type Budget = {
    id: string;
    amountMinor: number;
    userId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    category: BudgetCategory;
};

type BudgetSummary = {
    budgetId: string;
    categoryId: string;
    categoryName: string;
    budgetAmountMinor: number;
    spentMinor: number;
    remainingMinor: number;
    percentageUsed: number;
    isOverBudget: boolean;
};


const currencyFormatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
});

function amountMinorToDisplay(amountMinor: number) {
    return currencyFormatter.format(amountMinor / 100);
}

function amountInputToMinor(amount: string){
    return Math.round(Number(amount) * 100);
}



function BudgetsPage() {
    const { token } = useAuth();

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());

    const [categories, setCategories] = useState<Category[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [summaries, setSummaries] = useState<BudgetSummary[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");

    const expenseCategories = categories.filter(
        (category) => category.type === "EXPENSE",
    );

    const activeBudgetCount = budgets.length;

    function resetCreateForm(){
        setCategoryId("");
        setAmount("");
    }

    async function handleCreateBudget(event: React.SyntheticEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");

        const amountMinor = amountInputToMinor(amount);

        if(!categoryId){
            setError("Please select a category");
            return;
        }

        if(!Number.isFinite(amountMinor) || amountMinor <= 0){
            setError("Amount must be greater than zero");
            return;
        }

        try{
            const response = await fetch(`${API_URL}/budgets`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    categoryId,
                    amountMinor,
                }),
            });

            await response.json();

            if(!response.ok){
                setError("Failed to create budget");
                return;
            }

            resetCreateForm();
            setIsCreateModalOpen(false);
            await fetchBudgetPageData();
        } catch {
            setError("Could not connect to the API");
        }
    }

    const fetchBudgetPageData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [categoriesResponse, budgetsResponse, summariesResponse] =
                await Promise.all([
                    fetch(`${API_URL}/categories`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    fetch(`${API_URL}/budgets`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),

                    fetch(`${API_URL}/budgets/summary?month=${month}&year=${year}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                ]);

            const categoriesData = (await categoriesResponse.json()) as CategoriesResponse;
            const budgetsData = (await budgetsResponse.json()) as BudgetsResponse;
            const summariesData = (await summariesResponse.json()) as BudgetSummariesResponse;

            if (!categoriesResponse.ok) {
                setError("Failed to load categories");
                return;
            }

            if (!budgetsResponse.ok) {
                setError("Failed to load budgets");
                return;
            }

            if (!summariesResponse.ok) {
                setError("Failed to load budget summaries");
                return;
            }

            setCategories(categoriesData.categories);
            setBudgets(budgetsData.budgets);
            setSummaries(summariesData.summaries);
        } catch {
            setError("Could not connect to the API");
        } finally {
            setLoading(false);
        }
    }, [token, month, year]);

    useEffect(() => {
        fetchBudgetPageData();
    }, [fetchBudgetPageData]);


    return (
        <main>
            <h1>Budgets</h1>
            <p>Plan monthly category limits and compare them with real spending.</p>

            <section>
                <label htmlFor="budget-month">Month</label>
                <input
                    id="budget-month"
                    type="number"
                    min="1"
                    max="12"
                    value={month}
                    onChange={(event) => setMonth(Number(event.target.value))}
                />

                <label htmlFor="budget-year">Year</label>
                <input
                    id="budget-year"
                    type="number"
                    min="2000"
                    max="2100"
                    value={year}
                    onChange={(event) => setYear(Number(event.target.value))}
                />
            </section>

            <section>
                <button type="button" onClick={() => setIsCreateModalOpen(true)}>
                    Add Budget
                </button>
            </section>

            {isCreateModalOpen && (
                <div className="modal-backdrop" role="dialog" aria-modal="true">
                    <div className="modal-panel">
                        <h2>Create Budget</h2>
                        <form onSubmit={handleCreateBudget}>
                            <div>
                                <label htmlFor="budget-category">Category</label>
                                <select
                                    id="budget-category"
                                    value={categoryId}
                                    onChange={(event) => setCategoryId(event.target.value)}
                                >
                                    <option value="">Select a category</option>
                                    {categories
                                        .filter((category) => category.type === "EXPENSE")
                                        .map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="budget-amount">Monthly amout</label>
                                <input
                                    id="budget-amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={amount}
                                    onChange={(event) => setAmount(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Create</button>
                                <button 
                                type="button" 
                                onClick={() => {resetCreateForm(); setIsCreateModalOpen(false)}}>
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            <section>
                <div>Budget templates: {activeBudgetCount}</div>
                <div>Expense categories available: {expenseCategories.length}</div>
            </section>

            {loading && <p>Loading budgets...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && summaries.length > 0 && (
                <section>
                    <ul>
                        {summaries.map((summary) => (
                            <li key={summary.budgetId}>
                                <strong>{summary.categoryName}</strong>
                                <div>Budget: {amountMinorToDisplay(summary.budgetAmountMinor)}</div>
                                <div>Spent: {amountMinorToDisplay(summary.spentMinor)}</div>
                                <div>Remaining: {amountMinorToDisplay(summary.remainingMinor)}</div>
                                <div>Used: {summary.percentageUsed}%</div>
                                <div>{summary.isOverBudget ? "Over budget" : "Within Budget"}</div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}

export default BudgetsPage;