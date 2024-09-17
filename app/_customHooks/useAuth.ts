import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../_firebase/firebaseConfig";

export function useAuth() {
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [user, setUser] = useState<null | User>(null); // Состояние пользователя

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Устанавливаем данные пользователя
      setLoading(false); // Останавливаем загрузку
    });

    return () => unsubscribe(); // Очищаем подписку при размонтировании компонента
  }, []);

  return { user, loading }; // Возвращаем состояние пользователя и загрузки
}
