import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  type QuerySnapshot,
  type DocumentData,
  Timestamp,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

export interface Transaction {
  id?: string;
  date: Date | string;
  description: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
}

export const useTransactionStore = defineStore("transactions", () => {
  const transactions = ref<Transaction[]>([]);
  const db = useFirestore();

  // Fetch transactions for the selected year and month
  const fetchTransactions = async (
    year: number,
    month: number
  ): Promise<void> => {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 1);

      const q = query(
        collection(db, "transactions"),
        where("date", ">=", startOfMonth.toISOString()),
        where("date", "<", endOfMonth.toISOString())
      );

      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      transactions.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: new Date(data.date), // Parse ISO string into a JavaScript Date
        } as Transaction;
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Add a new transaction
  const addTransaction = async (transaction: Transaction): Promise<void> => {
    try {
      const newTransaction = {
        ...transaction,
        date:
          transaction.date instanceof Date
            ? transaction.date.toISOString()
            : new Date(transaction.date).toISOString(), // Convert Date to ISO string
      };

      const docRef = await addDoc(
        collection(db, "transactions"),
        newTransaction
      );

      // Update local transactions array
      transactions.value.push({
        id: docRef.id,
        ...transaction,
        date: new Date(newTransaction.date),
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  // Computed properties for totals and breakdowns
  const totalIncome = computed(() =>
    transactions.value
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const totalExpense = computed(() =>
    transactions.value
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const balance = computed(() => totalIncome.value - totalExpense.value);

  const categoryBreakdown = computed(() =>
    transactions.value
      .filter((t) => t.type === "Expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  );

  return {
    transactions,
    fetchTransactions,
    addTransaction,
    totalIncome,
    totalExpense,
    balance,
    categoryBreakdown,
  };
});
