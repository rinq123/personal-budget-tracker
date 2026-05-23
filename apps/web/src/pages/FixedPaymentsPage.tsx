import { useEffect, useState, type SubmitEvent } from "react";
import { useAuth } from "../context/useAuth";

type PaymentType = "INCOME" | "EXPENSE";

type Category = {
  id: string;
  name: string;
  type: PaymentType;
  createdAt: string;
  updatedAt: string;
};

type FixedPayment = {
  id: string;
  name: string;
  amountMinor: number;
  type: PaymentType;
  dueDay: number | null;
  userId: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
};

type CategoriesResponse = {
  categories: Category[];
};

type FixedPaymentsResponse = {
  fixedPayments: FixedPayment[];
};

type FixedPaymentResponse = {
  fixedPayment: FixedPayment;
};

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

function amountMinorToDisplay(amountMinor: number) {
  return currencyFormatter.format(amountMinor / 100);
}

function amountMinorToInput(amountMinor: number) {
  return (amountMinor / 100).toFixed(2);
}

function amountInputToMinor(amount: string) {
  return Math.round(Number(amount) * 100);
}

function dueDayToRequestValue(dueDay: string) {
  return dueDay ? Number(dueDay) : undefined;
}

function FixedPaymentsPage() {
  const { token } = useAuth();

  const [fixedPayments, setFixedPayments] = useState<FixedPayment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFixedPayment, setSelectedFixedPayment] =
    useState<FixedPayment | null>(null);
  const [isEditingFixedPayment, setIsEditingFixedPayment] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [dueDay, setDueDay] = useState("");

  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<PaymentType>("EXPENSE");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDueDay, setEditDueDay] = useState("");

  const monthlyIncomeMinor = fixedPayments
    .filter((payment) => payment.type === "INCOME")
    .reduce((total, payment) => total + payment.amountMinor, 0);

  const monthlyOutgoingMinor = fixedPayments
    .filter((payment) => payment.type === "EXPENSE")
    .reduce((total, payment) => total + payment.amountMinor, 0);

  const remainingMinor = monthlyIncomeMinor - monthlyOutgoingMinor;

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
    async function fetchFixedPayments() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:4000/fixed-payments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = (await response.json()) as FixedPaymentsResponse;

        if (!response.ok) {
          setError("Failed to load fixed payments");
          return;
        }

        setFixedPayments(data.fixedPayments);
      } catch {
        setError("Could not connect to the API");
      } finally {
        setLoading(false);
      }
    }

    fetchFixedPayments();
  }, [token]);

  function resetCreateForm() {
    setName("");
    setAmount("");
    setPaymentType("EXPENSE");
    setCategoryId("");
    setDueDay("");
  }

  function getCategoryName(id: string | null) {
    if (!id) {
      return "Uncategorised";
    }

    return categories.find((category) => category.id === id)?.name ?? "Unknown";
  }

  async function handleCreateFixedPayment(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const amountMinor = amountInputToMinor(amount);

    if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/fixed-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          amountMinor,
          type: paymentType,
          categoryId: categoryId || undefined,
          dueDay: dueDayToRequestValue(dueDay),
        }),
      });

      const data = (await response.json()) as FixedPaymentResponse;

      if (!response.ok) {
        setError("Failed to create fixed payment");
        return;
      }

      setFixedPayments((currentPayments) => [
        data.fixedPayment,
        ...currentPayments,
      ]);
      resetCreateForm();
      setIsCreateModalOpen(false);
    } catch {
      setError("Could not connect to the API");
    }
  }

  function handleStartEdit() {
    if (!selectedFixedPayment) {
      return;
    }

    setEditName(selectedFixedPayment.name);
    setEditAmount(amountMinorToInput(selectedFixedPayment.amountMinor));
    setEditType(selectedFixedPayment.type);
    setEditCategoryId(selectedFixedPayment.categoryId ?? "");
    setEditDueDay(
      selectedFixedPayment.dueDay ? String(selectedFixedPayment.dueDay) : "",
    );
    setIsEditingFixedPayment(true);
  }

  async function handleUpdateFixedPayment(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedFixedPayment) {
      return;
    }

    const amountMinor = amountInputToMinor(editAmount);

    if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/fixed-payments/${selectedFixedPayment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName,
            amountMinor,
            type: editType,
            categoryId: editCategoryId || undefined,
            dueDay: dueDayToRequestValue(editDueDay),
          }),
        },
      );

      const data = (await response.json()) as FixedPaymentResponse;

      if (!response.ok) {
        setError("Failed to update fixed payment");
        return;
      }

      setFixedPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment.id === data.fixedPayment.id ? data.fixedPayment : payment,
        ),
      );
      setSelectedFixedPayment(null);
      setIsEditingFixedPayment(false);
    } catch {
      setError("Could not connect to the API");
    }
  }

  async function handleDeleteFixedPayment() {
    if (!selectedFixedPayment) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/fixed-payments/${selectedFixedPayment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        setError("Failed to delete fixed payment");
        return;
      }

      setFixedPayments((currentPayments) =>
        currentPayments.filter(
          (payment) => payment.id !== selectedFixedPayment.id,
        ),
      );
      setSelectedFixedPayment(null);
      setIsEditingFixedPayment(false);
    } catch {
      setError("Could not connect to the API");
    }
  }

  return (
    <main>
      <h1>Fixed Payments</h1>
      <p>
        Track regular monthly income and committed outgoings such as salary,
        rent, subscriptions, and bills.
      </p>

      {loading && <p>Loading fixed payments...</p>}
      {error && <p>{error}</p>}

      <section className="summary-grid">
        <div className="summary-card">
          <span>Monthly income</span>
          <strong>{amountMinorToDisplay(monthlyIncomeMinor)}</strong>
        </div>
        <div className="summary-card">
          <span>Fixed outgoings</span>
          <strong>{amountMinorToDisplay(monthlyOutgoingMinor)}</strong>
        </div>
        <div className="summary-card">
          <span>Remaining after fixed costs</span>
          <strong>{amountMinorToDisplay(remainingMinor)}</strong>
        </div>
      </section>

      <section>
        <button type="button" onClick={() => setIsCreateModalOpen(true)}>
          Add fixed payment
        </button>
      </section>

      {isCreateModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <h2>Create Fixed Payment</h2>

            <form onSubmit={handleCreateFixedPayment}>
              <div>
                <label htmlFor="fixed-payment-name">Name</label>
                <input
                  id="fixed-payment-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="fixed-payment-amount">Monthly amount</label>
                <input
                  id="fixed-payment-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="fixed-payment-type">Type</label>
                <select
                  id="fixed-payment-type"
                  value={paymentType}
                  onChange={(event) => {
                    setPaymentType(event.target.value as PaymentType);
                    setCategoryId("");
                  }}
                >
                  <option value="EXPENSE">Outgoing</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>

              <div>
                <label htmlFor="fixed-payment-category">Category</label>
                <select
                  id="fixed-payment-category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  <option value="">Uncategorised</option>
                  {categories
                    .filter((category) => category.type === paymentType)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label htmlFor="fixed-payment-due-day">
                  Due day of month
                </label>
                <input
                  id="fixed-payment-due-day"
                  type="number"
                  min="1"
                  max="31"
                  value={dueDay}
                  onChange={(event) => setDueDay(event.target.value)}
                />
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

      {selectedFixedPayment && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            {!isEditingFixedPayment ? (
              <>
                <h2>{selectedFixedPayment.name}</h2>
                <p>{amountMinorToDisplay(selectedFixedPayment.amountMinor)}</p>

                <button type="button" onClick={handleStartEdit}>
                  Edit
                </button>
                <button type="button" onClick={handleDeleteFixedPayment}>
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFixedPayment(null)}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h2>Edit Fixed Payment</h2>

                <form onSubmit={handleUpdateFixedPayment}>
                  <div>
                    <label htmlFor="edit-fixed-payment-name">Name</label>
                    <input
                      id="edit-fixed-payment-name"
                      type="text"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-fixed-payment-amount">
                      Monthly amount
                    </label>
                    <input
                      id="edit-fixed-payment-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editAmount}
                      onChange={(event) => setEditAmount(event.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-fixed-payment-type">Type</label>
                    <select
                      id="edit-fixed-payment-type"
                      value={editType}
                      onChange={(event) => {
                        setEditType(event.target.value as PaymentType);
                        setEditCategoryId("");
                      }}
                    >
                      <option value="EXPENSE">Outgoing</option>
                      <option value="INCOME">Income</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-fixed-payment-category">Category</label>
                    <select
                      id="edit-fixed-payment-category"
                      value={editCategoryId}
                      onChange={(event) => setEditCategoryId(event.target.value)}
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

                  <div>
                    <label htmlFor="edit-fixed-payment-due-day">
                      Due day of month
                    </label>
                    <input
                      id="edit-fixed-payment-due-day"
                      type="number"
                      min="1"
                      max="31"
                      value={editDueDay}
                      onChange={(event) => setEditDueDay(event.target.value)}
                    />
                  </div>

                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => setIsEditingFixedPayment(false)}
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
        <ul>
          {fixedPayments.map((payment) => (
            <li key={payment.id}>
              <span>
                {payment.name} - {payment.type === "INCOME" ? "Income" : "Outgoing"} -{" "}
                {getCategoryName(payment.categoryId)} -{" "}
                {amountMinorToDisplay(payment.amountMinor)}
                {payment.dueDay ? ` - Due day ${payment.dueDay}` : ""}
              </span>
              <button
                type="button"
                onClick={() => setSelectedFixedPayment(payment)}
              >
                ...
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default FixedPaymentsPage;
