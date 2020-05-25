import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductStoreService } from "src/app/state/products.state.service";
import { Product } from "src/app/models/product";
import { Observable, of, Subject } from "rxjs";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.scss"]
})
export class SummaryComponent implements OnInit, OnDestroy {
  private cleanup = new Subject();
  listIndex: number;
  constructor(
    private storeService: ProductStoreService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}
  productList: Observable<Product[]>;
  listName: string;
  ngOnInit() {
    this.initProductList();
    this.subscribeRouteChange();
  }

  private subscribeRouteChange() {
    this.router.events.pipe(takeUntil(this.cleanup)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.initProductList();
      }
    });
  }

  initProductList() {
    // TODO refactor to handle N lists
    const listId = this.actRoute.snapshot.params["id"];
    this.storeService._selectedProducts$.subscribe(res => {
      this.listIndex = listId === "1" ? 0 : 1;
      this.productList = of(res[this.listIndex].products);
      this.listName = res[this.listIndex].listName;
    });

    if (this.productList) {
      this.productList.forEach(product => {
        return product.map(atribute => {
          if (atribute) {
            return (atribute.pricing = JSON.parse(atribute.pricing));
          }
        });
      });
    }
  }

  ngOnDestroy() {
    this.cleanup.next();
    this.cleanup.unsubscribe();
  }
}
