import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

// Добавить документ в коллекцию
export async function addUserData(
  userId: string,
  data: Record<string, string>
) {
  try {
    const docRef = await addDoc(collection(db, "users"), { userId, ...data });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

// Получить все документы из коллекции
export async function getUserData(userId: string) {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data.filter((doc) => doc.id === userId);
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
}

// Обновить документ
export async function updateUserData(
  docId: string,
  newData: Record<string, string>
) {
  try {
    const userDoc = doc(db, "users", docId);
    await updateDoc(userDoc, newData);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
}
