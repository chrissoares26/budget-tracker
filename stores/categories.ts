import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

export interface Category {
  id?: string;
  name: string;
  type: "Income" | "Expense";
}

interface CategoryState {
  categories: Category[];
}

export const useCategoryStore = defineStore("categories", {
  state: (): CategoryState => ({
    categories: [],
  }),

  actions: {
    // Fetch all categories from Firestore
    async fetchCategories(): Promise<void> {
      const db = useFirestore();
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        collection(db, "categories")
      );

      this.categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
    },

    // Add a new category to Firestore
    async addCategory(category: Category): Promise<void> {
      const db = useFirestore();
      const docRef = await addDoc(collection(db, "categories"), category);
      this.categories.push({ id: docRef.id, ...category });
    },

    // Delete a category from Firestore
    async deleteCategory(categoryId: string): Promise<void> {
      const db = useFirestore();
      await deleteDoc(doc(db, "categories", categoryId));
      this.categories = this.categories.filter((c) => c.id !== categoryId);
    },
  },
});
