import { City, Country, Electricity, Waste, WaterSupply } from "@types";
import { request } from "src/utils/network";

export const getListWasteService = () =>
  request<{ data: { items: Waste[], total: number } }>({
    url: "/waste",
    method: "GET",
  });

export const createWasteService = (data: any) =>
  request<{ data: Waste[] }>({
    url: "/waste",
    method: "POST",
    data,
  });

export const uploadWasteService = (data: any) =>
  request<{ data: Waste[] }>({
    url: "/waste/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });

export const getListWaterSupplyService = () =>
  request<{ data: { items: WaterSupply[], total: number } }>({
    url: "/water-supply",
    method: "GET",
  });

export const createWaterSupplyService = (data: any) =>
  request<{ data: WaterSupply[] }>({
    url: "/water-supply",
    method: "POST",
    data,
  });

export const uploadWaterSupplyService = (data: any) =>
  request<{ data: Waste[] }>({
    url: "/water-supply/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });

export const getListElectricityService = () =>
  request<{ data: { items: Electricity[], total: number } }>({
    url: "/electricity",
    method: "GET",
  });

export const createElectricityService = (data: any) =>
  request<{ data: Electricity[] }>({
    url: "/electricity",
    method: "POST",
    data,
  });

export const uploadElectricityService = (data: any) =>
  request<{ data: Waste[] }>({
    url: "/electricity/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });

export const getListCountryService = () =>
  request<{ data: Country[] }>({
    url: "/country",
    method: "GET",
  });

export const getListCityService = () =>
  request<{ data: City[] }>({
    url: "/city",
    method: "GET",
  });
