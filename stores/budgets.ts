import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

export interface Budget {
  id?: string;
  category: string;
  type: "Variable" | "Fixed";
  amount: number;
}

export interface Category {
  id?: string;
  name: string;
  type: "Income" | "Expense";
}

export const useBudgetStore = defineStore("budgets", () => {
  const budgets = ref<Budget[]>([]); // Fix: Use consistent naming for budgets
  const allCategories = ref<Category[]>([]); // Holds all categories
  const db = useFirestore();

  // Fetch all budgets
  const fetchBudgets = async (): Promise<void> => {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        collection(db, "budgets")
      );

      budgets.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Budget[];
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  // Fetch all categories from Firestore
  const fetchAllCategories = async (): Promise<void> => {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        collection(db, "categories")
      );

      allCategories.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add a new budget
  const addBudget = async (budget: Budget): Promise<void> => {
    try {
      // Ensure no duplicate category
      if (budgets.value.some((b) => b.category === budget.category)) {
        throw new Error(
          `Budget for category "${budget.category}" already exists.`
        );
      }

      const docRef = await addDoc(collection(db, "budgets"), budget);

      // Add the new budget to the local store
      budgets.value.push({ id: docRef.id, ...budget });
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error;
    }
  };

  // Remove a budget
  const removeBudget = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "budgets", id));

      // Remove the budget locally
      budgets.value = budgets.value.filter((b) => b.id !== id);
    } catch (error) {
      console.error("Error removing budget:", error);
      throw error;
    }
  };

  // Adjust an existing budget
  const adjustBudget = async (id: string, amount: number): Promise<void> => {
    try {
      const budgetDoc = doc(db, "budgets", id);

      await updateDoc(budgetDoc, { amount });

      // Update the budget locally
      const budget = budgets.value.find((b) => b.id === id);
      if (budget) {
        budget.amount = amount;
      }
    } catch (error) {
      console.error("Error adjusting budget:", error);
      throw error;
    }
  };

  // Available categories for adding new budgets
  const availableCategories = computed(() => {
    const usedCategories = budgets.value.map((b) => b.category);
    return allCategories.value.filter(
      (cat) => cat.type === "Expense" && !usedCategories.includes(cat.name)
    );
  });

  return {
    budgets,
    allCategories,
    fetchBudgets,
    fetchAllCategories,
    addBudget,
    removeBudget,
    adjustBudget,
    availableCategories,
  };
});
