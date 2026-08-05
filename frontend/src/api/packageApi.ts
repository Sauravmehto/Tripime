import { apiClient } from "./apiClient";
import type { PackageCategory, TravelPackage } from "../types";

export async function listPackages(
  category?: PackageCategory,
): Promise<TravelPackage[]> {
  const { data } = await apiClient.get<TravelPackage[]>("/api/packages", {
    params: category ? { category } : undefined,
  });
  return data;
}

export async function getPackage(packageId: string): Promise<TravelPackage> {
  const { data } = await apiClient.get<TravelPackage>(`/api/packages/${packageId}`);
  return data;
}
