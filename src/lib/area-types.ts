export type AreaRow = {
  id: number;
  name_en: string;
  name_bn: string;
  division_id?: number;
  district_id?: number;
  upazila_id?: number;
};
export type Area = Record<"divisions" | "districts" | "upazilas" | "unions", AreaRow[]>;
