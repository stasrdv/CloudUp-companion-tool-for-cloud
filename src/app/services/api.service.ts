import { Injectable, Inject, Query } from "@angular/core";
import { Vendor } from "../models/vendor";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Product, TermRelatedProduct, QueryRelation } from "../models/product";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject("BASE_URL") private readonly baseUrl: string
  ) {}

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.baseUrl + "api/data/GetVendors");
  }

  getGetAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl + "api/data/GetAllProducts");
  }

  getProductsByVendor(vendorId: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.baseUrl + `api/data/GetProductsByVendor?vendorId=${vendorId}`
    );
  }

  getProductsByFamily(family: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.baseUrl + `api/data/GetProductsByFamily?family=${family}`
    );
  }
  getAllQueries(): Observable<QueryRelation[]> {
    return this.http.get<QueryRelation[]>(
      this.baseUrl + `api/data/GetAllQueries`
    );
  }
  getRelationsByTerm(
    term: string,
    family: string
  ): Observable<TermRelatedProduct[]> {
    return this.http.get<TermRelatedProduct[]>(
      this.baseUrl + `api/data/GetRelationsByTerm?term=${term}&family=${family}`
    );
  }
}
