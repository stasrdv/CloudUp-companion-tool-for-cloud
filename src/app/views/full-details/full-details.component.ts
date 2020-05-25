import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { ProductStoreService } from "src/app/state/products.state.service";
import { Product } from "src/app/models/product";
import { ApiService } from "src/app/services/api.service";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-full-details",
  templateUrl: "./full-details.component.html",
  styleUrls: ["./full-details.component.scss"]
})
export class FullDetailsComponent implements OnInit {
  product: Product;
  productID: string;
  pricing;
  attributes;
  vendorProducts: Observable<Product[]>;

  constructor(
    private readonly api: ApiService,
    private actRoute: ActivatedRoute,
    private storeService: ProductStoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initProductdetails();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  initProductdetails() {
    this.productID = this.actRoute.snapshot.params["id"];
    if (this.storeService.isProductsListCached()) {
      this.product = this.storeService.getProductById(this.productID);
      this.initProductFields();
    } else {
      this.getProduct();
    }
  }

  private getProduct() {
    this.api.getGetAllProducts().subscribe(data => {
      this.product = data.find(item => {
        return item.id == this.productID;
      });
      this.initProductFields();
    });
  }

  private initProductFields(): void {
    if (this.product) {
      const pricing = this.product.pricing;
      const attributes = this.product.attributes;
      if (pricing) {
        this.pricing = JSON.parse(pricing);
        this.attributes = JSON.parse(attributes);
        // this.vendorProducts = of([]);
      }
    } else {
      this.vendorProducts = this.api.getProductsByVendor(this.productID);
    }
  }

  navigateToOverView(id: string) {
    this.router.navigate(["/overview", id]);
  }
}
