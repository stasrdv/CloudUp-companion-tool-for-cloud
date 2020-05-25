import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { Product } from "src/app/models/product";
import { ProductStoreService } from "src/app/state/products.state.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/internal/operators/map";

@Component({
  selector: "app-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.scss"]
})
export class BillingComponent implements OnInit {
  productList: Product[];
  price: number = 0;

  loads: Load[] = [
    {
      loadType: "HIGH",
      frequency: "3 Hz",
      duration: "10 sec",
      deviceAmount: 100,
      price: 1000
    },
    {
      loadType: "MEDIUM",
      frequency: "10 Hz",
      duration: "30 sec",
      deviceAmount: 500,
      price: 1500
    },
    {
      loadType: "LOW",
      frequency: "100 Hz",
      duration: "120",
      deviceAmount: 1000,
      price: 2000
    }
  ];
  constructor(
    private storeService: ProductStoreService,
    private actRoute: ActivatedRoute
  ) {}

  private initProducts() {
    const listId = this.actRoute.snapshot.params["id"];
    const listIndex = parseInt(listId);
    this.storeService._selectedProducts$
      .pipe(
        map(product => {
          return product[listIndex].products.map(product => {
            return {
              ...product,
              loadType: "",
              frequency: "",
              duration: "",
              deviceAmount: 0
            };
          });
        })
      )
      .subscribe(res => {
        this.productList = res;
      });
  }
  // MOCK
  private onLoadChanged(event) {
    this.price = event.source.value.price;
  }

  ngOnInit() {
    this.initProducts();
  }
}
export interface Load {
  loadType: string;
  frequency: string;
  duration: string;
  deviceAmount: number;
  price: number;
}
