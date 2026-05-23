import { useEffect, useState, type SubmitEvent } from "react";
import { useAuth } from "../context/useAuth";

type TransactionType = "INCOME" | "EXPENSE";
type SortBy = "date" | "amountMinor" | "createdAt";
type SortOrder = "asc" | "desc";
type TypeFilter = "ALL" | TransactionType;

type Category = {
  id: string;
  name: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
};

type Transaction = {
  id: string;
  description: string;
  amountMinor: number;
  type: TransactionType;
  date: string;
  userId: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
};

type CategoriesResponse = {
  categories: Category[];
};

type TransactionsResponse = {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type TransactionResponse = {
  transaction: Transaction;
};

const today = new Date().toISOString().slice(0, 10);

function amountMinorToDisplay(amountMinor: number) {
  return `£${(amountMinor / 100).toFixed(2)}`;
}

function amountMinorToInput(amountMinor: number) {
  return (amountMinor / 100).toFixed(2);
}

function amountInputToMinor(amount: string) {
  return Math.round(Number(amount) * 100);
}

function dateForInput(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

function TransactionsPage() {
  const { token } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] =
    useState<TransactionType>("EXPENSE");
  const [date, setDate] = useState(today);
  const [categoryId, setCategoryId] = useState("");

  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<TransactionType>("EXPENSE");
  const [editDate, setEditDate] = useState(today);
  const [editCategoryId, setEditCategoryId] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:4000/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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
      }
    }

    fetchCategories();
  }, [token]);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sortBy,
          sortOrder,
        });

        if (typeFilter !== "ALL") {
          query.set("type", typeFilter);
        }

        if (categoryFilter) {
          query.set("categoryId", categoryFilter);
        }

        const response = await fetch(
          `http://localhost:4000/transactions?${query.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = (await response.json()) as TransactionsResponse;

        if (!response.ok) {
          setError("Failed to load transactions");
          return;
        }

        setTransactions(data.transactions);
        setTotalPages(data.pagination.totalPages || 1);
        setTotal(data.pagination.total);
      } catch {
        setError("Could not connect to the API");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [token, page, limit, typeFilter, categoryFilter, sortBy, sortOrder]);

  function resetCreateForm() {
    setDescription("");
    setAmount("");
    setTransactionType("EXPENSE");
    setDate(today);
    setCategoryId("");
  }

  function getCategoryName(id: string | null) {
    if (!id) {
      return "Uncategorised";
    }

    return categories.find((category) => category.id === id)?.name ?? "Unknown";
  }

  async function handleCreateTransaction(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const amountMinor = amountInputToMinor(amount);

    if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          amountMinor,
          type: transactionType,
          date,
          categoryId: categoryId || undefined,
        }),
      });

      const data = (await response.json()) as TransactionResponse;

      if (!response.ok) {
        setError("Failed to create transaction");
        return;
      }

      setTransactions((currentTransactions) => [
        data.transaction,
        ...currentTransactions,
      ]);
      resetCreateForm();
      setIsCreateModalOpen(false);
    } catch {
      setError("Could not connect to the API");
    }
  }

  function handleStartEdit() {
    if (!selectedTransaction) {
      return;
    }

    setEditDescription(selectedTransaction.description);
    setEditAmount(amountMinorToInput(selectedTransaction.amountMinor));
    setEditType(selectedTransaction.type);
    setEditDate(dateForInput(selectedTransaction.date));
    setEditCategoryId(selectedTransaction.categoryId ?? "");
    setIsEditingTransaction(true);
  }

  async function handleUpdateTransaction(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTransaction) {
      return;
    }

    const amountMinor = amountInputToMinor(editAmount);

    if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/transactions/${selectedTransaction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description: editDescription,
            amountMinor,
            type: editType,
            date: editDate,
            categoryId: editCategoryId || undefined,
          }),
        },
      );

      const data = (await response.json()) as TransactionResponse;

      if (!response.ok) {
        setError("Failed to update transaction");
        return;
      }

      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.id === data.transaction.id ? data.transaction : transaction,
        ),
      );

      setSelectedTransaction(null);
      setIsEditingTransaction(false);
    } catch {
      setError("Could not connect to the API");
    }
  }

  async function handleDeleteTransaction() {
    if (!selectedTransaction) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/transactions/${selectedTransaction.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        setError("Failed to delete transaction");
        return;
      }

      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (transaction) => transaction.id !== selectedTransaction.id,
        ),
      );

      setSelectedTransaction(null);
      setIsEditingTransaction(false);
    } catch {
      setError("Could not connect to the API");
    }
  }

  return (
    <main>
      <h1>Transactions</h1>

      {loading && <p>Loading transactions...</p>}
      {error && <p>{error}</p>}

      <section>
        <button type="button" onClick={() => setIsCreateModalOpen(true)}>
          Add transaction
        </button>
      </section>

      <section>
        <h2>Filters</h2>

        <label htmlFor="transaction-type-filter">Type</label>
        <select
          id="transaction-type-filter"
          value={typeFilter}
          onChange={(event) => {
            setTypeFilter(event.target.value as TypeFilter);
            setPage(1);
          }}
        >
          <option value="ALL">All</option>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <label htmlFor="transaction-category-filter">Category</label>
        <select
          id="transaction-category-filter"
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.type})
            </option>
          ))}
        </select>

        <label htmlFor="transaction-sort-by">Sort by</label>
        <select
          id="transaction-sort-by"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortBy)}
        >
          <option value="date">Date</option>
          <option value="amountMinor">Amount</option>
          <option value="createdAt">Created</option>
        </select>

        <label htmlFor="transaction-sort-order">Order</label>
        <select
          id="transaction-sort-order"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <label htmlFor="transaction-limit">Per page</label>
        <select
          id="transaction-limit"
          value={limit}
          onChange={(event) => {
            setLimit(Number(event.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </section>

      {isCreateModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <h2>Create Transaction</h2>

            <form onSubmit={handleCreateTransaction}>
              <div>
                <label htmlFor="transaction-description">Description</label>
                <input
                  id="transaction-description"
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="transaction-amount">Amount</label>
                <input
                  id="transaction-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="transaction-type">Type</label>
                <select
                  id="transaction-type"
                  value={transactionType}
                  onChange={(event) => {
                    setTransactionType(event.target.value as TransactionType);
                    setCategoryId("");
                  }}
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>

              <div>
                <label htmlFor="transaction-date">Date</label>
                <input
                  id="transaction-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="transaction-category">Category</label>
                <select
                  id="transaction-category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  <option value="">Uncategorised</option>
                  {categories
                    .filter((category) => category.type === transactionType)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <button type="submit">Create</button>
              <button
                type="button"
                onClick={() => {
                  resetCreateForm();
                  setIsCreateModalOpen(false);
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedTransaction && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            {!isEditingTransaction ? (
              <>
                <h2>{selectedTransaction.description}</h2>
                <p>{amountMinorToDisplay(selectedTransaction.amountMinor)}</p>

                <button type="button" onClick={handleStartEdit}>
                  Edit
                </button>
                <button type="button" onClick={handleDeleteTransaction}>
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h2>Edit Transaction</h2>

                <form onSubmit={handleUpdateTransaction}>
                  <div>
                    <label htmlFor="edit-transaction-description">
                      Description
                    </label>
                    <input
                      id="edit-transaction-description"
                      type="text"
                      value={editDescription}
                      onChange={(event) =>
                        setEditDescription(event.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-transaction-amount">Amount</label>
                    <input
                      id="edit-transaction-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editAmount}
                      onChange={(event) => setEditAmount(event.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-transaction-type">Type</label>
                    <select
                      id="edit-transaction-type"
                      value={editType}
                      onChange={(event) => {
                        setEditType(event.target.value as TransactionType);
                        setEditCategoryId("");
                      }}
                    >
                      <option value="EXPENSE">Expense</option>
                      <option value="INCOME">Income</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-transaction-date">Date</label>
                    <input
                      id="edit-transaction-date"
                      type="date"
                      value={editDate}
                      onChange={(event) => setEditDate(event.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-transaction-category">Category</label>
                    <select
                      id="edit-transaction-category"
                      value={editCategoryId}
                      onChange={(event) =>
                        setEditCategoryId(event.target.value)
                      }
                    >
                      <option value="">Uncategorised</option>
                      {categories
                        .filter((category) => category.type === editType)
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => setIsEditingTransaction(false)}
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <section>
        <p>
          Showing page {page} of {totalPages} ({total} total)
        </p>

        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <span>
                {new Date(transaction.date).toLocaleDateString()} -{" "}
                {transaction.description} - {getCategoryName(transaction.categoryId)}{" "}
                - {transaction.type} -{" "}
                {amountMinorToDisplay(transaction.amountMinor)}
              </span>
              <button
                type="button"
                onClick={() => setSelectedTransaction(transaction)}
              >
                ...
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((currentPage) => currentPage - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          Next
        </button>
      </section>
    </main>
  );
}

export default TransactionsPage;
