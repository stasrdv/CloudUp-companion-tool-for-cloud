import { Vendor } from "./vendor";

export interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string;
  vendorId: string;
  vendor: Vendor;
  pricing: any | undefined;
  attributes: any;
  family: string;
  term?: string;
  reason?: string | null;
}

export interface TermRelatedProduct {
  queryId: string;
  productId: string;
  product: null;
  quality: number;
  reason: string;
  id: string;
}

export interface QueryRelation {
  term: string;
  family: string;
  relations: TermRelatedProduct[];
  id: string;
}

export interface SuggestedProduct extends Product {
  reason: string;
  quality: number;
}
export interface ListProduct extends Product {
  listIndex: number;
}
