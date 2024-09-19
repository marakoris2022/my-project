/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

// Универсальная функция для добавления или обновления документа
export async function upsertUserData(
  userId: string,
  data: Record<string, any>
) {
  try {
    // Создаем запрос, чтобы найти документ с нужным userId
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("userId", "==", userId));

    // Получаем документы, которые соответствуют запросу
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Если документы не найдены, создаем новый документ
      const docRef = await addDoc(usersCollection, {
        userId,
        ...data,
      });
      return docRef.id;
    } else {
      // Если документ найден, обновляем его
      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(db, "users", userDoc.id);
      await updateDoc(userDocRef, data);
    }
  } catch (error) {
    console.error("Error upserting user data: ", error);
    throw error;
  }
}

// Добавить документ в коллекцию
export async function addUserData(userId: string, data: Record<string, any>) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      userId,
      ...data,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

type DynamicData = {
  [key: string]: string; // динамические ключи со строковыми значениями
};

type UserData = DynamicData & {
  id: string; // обязательное поле id
  userId: string; // обязательное поле userId
};

// Получить все документы из коллекции
export async function getUserData(userId: string) {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data: UserData[] = querySnapshot.docs.map((doc) => {
      const docData = doc.data(); // получаем данные документа
      return {
        id: doc.id, // id документа
        userId: docData.userId, // поле userId из данных
        ...docData, // остальные динамические поля
      } as UserData; // явное приведение к типу UserData
    });

    return data.find((doc) => doc.userId === userId);
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
}

// Обновить документ по userId
export async function updateUserData(
  userId: string,
  newData: Record<string, any>
) {
  try {
    // Создаем запрос, чтобы найти документ с нужным userId
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("userId", "==", userId));

    // Получаем документы, которые соответствуют запросу
    const querySnapshot = await getDocs(q);

    // Проверяем, если документы найдены
    if (querySnapshot.empty) {
      return;
    }

    // Предполагаем, что userId уникальный, поэтому берем первый найденный документ
    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id);

    // Обновляем документ с новым данными
    await updateDoc(userDocRef, newData);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
}

// Function to delete user data based on userId
export async function deleteUserData(userId: string) {
  try {
    // Reference the users collection
    const usersCollection = collection(db, "users");
    // Query to find the document with the given userId
    const q = query(usersCollection, where("userId", "==", userId));

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return; // If no documents found, exit the function
    }

    // Assume userId is unique, so we take the first document found
    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id);

    // Delete the document
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error("Error deleting user data: ", error);
    throw error;
  }
}
