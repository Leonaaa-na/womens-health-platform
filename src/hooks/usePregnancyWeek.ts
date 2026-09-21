import { useEffect, useState } from "react";
import apiClient from "../api/client";

/*
 * Asks the backend for the active pregnancy and returns the current week
 * (1–40), or null if no pregnancy is set up.
 */
export function usePregnancyWeek() {
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/pregnancy/current");
        const d = response.data?.data;
        if (d?.pregnancy) {
          setCurrentWeek(Math.min(Math.max(d.currentWeek, 1), 40));
        }
      } catch {
        setCurrentWeek(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { currentWeek, loading };
}