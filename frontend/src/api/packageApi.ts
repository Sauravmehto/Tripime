import { apiClient } from "./apiClient";
import type { TravelPackage } from "../types";

export async function listPackages(): Promise<TravelPackage[]> {
  const { data } = await apiClient.get<TravelPackage[]>("/api/packages");
  return data;
}

export async function getPackage(packageId: string): Promise<TravelPackage> {
  const { data } = await apiClient.get<TravelPackage>(`/api/packages/${packageId}`);
  return data;
}
