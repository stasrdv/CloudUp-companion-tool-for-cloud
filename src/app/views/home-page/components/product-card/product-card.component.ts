import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Vendor } from "src/app/models/vendor";
import { Observable } from "rxjs";
import { Product, ListProduct } from "src/app/models/product";

@Component({
  selector: "product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.scss"]
})
export class ProductCardComponent implements OnInit {
  @Input() cardItem: Product;
  @Input() numberOfComparableLists: number[];
  @Output() addProductToList?: EventEmitter<ListProduct> = new EventEmitter<
    ListProduct
  >();
  @Output() navigateTo?: EventEmitter<string> = new EventEmitter<string>();
  isSelected = false;

  constructor() {}

  addItemToList(listId: number, product: Product) {
    const listProduct: ListProduct = {
      ...product,
      listIndex: listId
    };
    this.isSelected = !this.isSelected;
    this.addProductToList.emit(listProduct);
  }

  navigateToOverView(id: string) {
    this.navigateTo.emit(id);
  }
  ngOnInit() {}
}
