import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { PokemonProfileProps } from "../_pokemonApi/pokemonDataApi";
import { fetchUserData } from "../_firebase/clientFirestireApi";
import { usePathname, useRouter } from "next/navigation";

export const usePokemonRedirect = () => {
  const { user } = useAuth();
  const [fetchedData, setFetchedData] = useState<
    PokemonProfileProps | null | undefined
  >(undefined);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname === "/") {
      setLoading(false);
    }
    if (user) {
      (async () => {
        const res = await fetchUserData(user.uid);
        setFetchedData(res ? res : null);
        setLoading(false);
      })();
    }
  }, [pathname, user]);

  useEffect(() => {
    if (
      fetchedData &&
      Boolean(fetchedData.battle.isInBattle) &&
      pathname !== "/battle/fight"
    ) {
      router.push("/battle/fight");
    }
    if (
      fetchedData &&
      Boolean(!fetchedData.battle.isInBattle) &&
      pathname === "/battle/fight"
    ) {
      router.push("/profile");
    }

    if (
      fetchedData &&
      Boolean(!fetchedData.battle.isInBattle) &&
      Boolean(
        fetchedData.battle.isBattleCreated ||
          fetchedData.battle.isInBattleRequest
      ) &&
      pathname !== "/battle"
    ) {
      router.push("/battle");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["fight"].isFight) &&
      pathname !== "/training/ground/fight"
    ) {
      router.push("/training/ground/fight");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["fight"].isFight) === false &&
      pathname === "/training/ground/fight"
    ) {
      router.push("/profile");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["pokemonActive"]) === false &&
      pathname === "/profile"
    ) {
      router.push("/profile/create");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["pokemonActive"]) === true &&
      pathname === "/profile/create"
    ) {
      router.push("/profile");
    }

    if (
      fetchedData &&
      fetchedData["training"].isTraining &&
      pathname === "/training"
    ) {
      router.push("/training/ground");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["pokemonActive"]) === false &&
      pathname === "/training"
    ) {
      router.push("/profile/create");
    }

    if (
      fetchedData &&
      Boolean(fetchedData["pokemonActive"]) === false &&
      pathname === "/training/ground"
    ) {
      router.push("/profile/create");
    }

    if (
      fetchedData &&
      fetchedData["training"].isTraining &&
      pathname === "/training"
    ) {
      router.push("/training/ground");
    }

    if (
      fetchedData &&
      !fetchedData["training"].isTraining &&
      pathname === "/training/ground"
    ) {
      router.push("/training");
    }

    if (fetchedData && fetchedData["fight"].isFight) {
      router.push("/training/ground/fight");
    }
  }, [fetchedData, pathname, router]);

  return { loading, user, fetchedData, setFetchedData };
};
