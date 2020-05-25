import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { Vendor } from "src/app/models/vendor";
import { Product, ListProduct } from "../models/product";

@Injectable({ providedIn: "root" })
export class ProductStoreService {
  private _productsList = [];
  // TODO refactor to case of 1 to N lists !!!
  private readonly _selectedProducts = new BehaviorSubject<SelectedProducts[]>([
    initialFirstList,
    initialSecondList
  ]);
  readonly _selectedProducts$ = this._selectedProducts.asObservable();
  get selectedProducts(): SelectedProducts[] {
    return this._selectedProducts.getValue();
  }
  set selectedProducts(val) {
    this._selectedProducts.next(val);
  }

  addItem(product: ListProduct) {
    this.selectedProducts[product.listIndex].products.push(product);
  }

  // Avoid unnecessary API call to see full details
  set productsList(productsList: Product[] | Vendor[]) {
    this._productsList = [...this.productsList, ...productsList];
  }
  get productsList(): Product[] | Vendor[] {
    return this._productsList;
  }

  getProductById(id: string): Product {
    return this._productsList.find(item => {
      return item.id == id;
    });
  }

  isProductsListCached(): boolean {
    return this._productsList.length > 1;
  }

  updateListName(value: string, listIndex: number) {
    this.selectedProducts[listIndex].listName = value;
  }
}

export interface SelectedProducts {
  products: Product[];
  listName: string;
}

const initialFirstList: SelectedProducts = {
  products: [],
  listName: "First-List"
};

const initialSecondList: SelectedProducts = {
  products: [],
  listName: "Second-List"
};
