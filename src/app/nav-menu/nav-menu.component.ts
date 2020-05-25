import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { ProductStoreService } from "../state/products.state.service";
import { Subject, of, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Vendor } from "../models/vendor";
import { Product } from "../models/product";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NavMenuComponent implements OnInit, OnDestroy {
  isExpanded = false;
  private destroy = new Subject();
  productsInSecondtList: Observable<any[]>;
  productsInFirstList: Observable<any[]>;
  firstListName: string;
  secondListname: string;
  constructor(private storeService: ProductStoreService) {}

  ngOnInit() {
    this.initSelectedItemsLists();
  }

  // TODO refactor to 1 to N lists !!!
  private initSelectedItemsLists(): void {
    this.storeService._selectedProducts$
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        if (res) {
          this.productsInFirstList = of(res[0].products);
          this.productsInSecondtList = of(res[1].products);
          this.firstListName = res[0].listName;
          this.secondListname = res[1].listName;
        }
      });
  }

  onListNameChanged(value: string, lisIndex: number) {
    this.storeService.updateListName(value, lisIndex);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
