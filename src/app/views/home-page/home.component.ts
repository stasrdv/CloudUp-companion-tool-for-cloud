import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, of, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  map,
  filter
} from "rxjs/operators";
import { Vendor } from "../../models/vendor";
import { ApiService } from "../../services/api.service";
import { ProductStoreService } from "../../state/products.state.service";
import {
  Product,
  ListProduct,
  TermRelatedProduct,
  SuggestedProduct,
  QueryRelation
} from "src/app/models/product";
import { Router } from "@angular/router";
import { query } from "@angular/animations";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {
  mainSearchControl = new FormControl();
  filteredProductsList: Observable<Product[]>;
  autoCompleteSuggestions: Observable<any[]>;
  productSuggestions: Product[];
  vendorsList: Vendor[];
  isSuggestedSectionHidden = false;
  numberOfComparableLists = new Array<number>(1);
  DEBOUNCE_TIME_OUT: number = 200;
  private cleanup = new Subject();
  queriesList: QueryRelation[];
  termRelatedProducList: SuggestedProduct[];
  noResults = false;

  constructor(
    private readonly api: ApiService,
    private storeService: ProductStoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initVendorsList();
    this.initProductsList();
    this.initQueriesList();
    this.subscribeToMainInputControl();
  }

  private initProductsList(): void {
    this.api
      .getGetAllProducts()
      .pipe(takeUntil(this.cleanup))
      .subscribe(data => {
        this.productSuggestions = data;
        this.storeService.productsList = data;
      });
  }

  private subscribeToMainInputControl() {
    return this.mainSearchControl.valueChanges
      .pipe(
        takeUntil(this.cleanup),
        debounceTime(this.DEBOUNCE_TIME_OUT),
        distinctUntilChanged(),
        filter(value => value && value.length > 1)
      )
      .subscribe(inputVal => this.mainFilterHandler(inputVal));
  }

  displayFn(product?: Product): string | undefined {
    return product ? product.name : undefined;
  }

  private initVendorsList(): void {
    this.api
      .getVendors()
      .pipe(
        takeUntil(this.cleanup),
        map(vendorList => {
          return vendorList.map(vendor => {
            return { ...vendor, pricing: null };
          });
        })
      )
      .subscribe(data => {
        this.vendorsList = data;
        this.storeService.productsList = data;
      });
  }

  private mainFilterHandler(inputValue: string) {
    const filteredByNameSuggestions = this.getSuggestionByFamilyOrName(
      inputValue
    );
    this.initAutoCompleteSuggestions(filteredByNameSuggestions);
    this.initProducList(filteredByNameSuggestions);
    this.toggleNoResults(filteredByNameSuggestions);

    // Check if term
    const isTerm = query => query.term.includes(inputValue);
    const termIndex = this.queriesList.findIndex(isTerm);
    if (termIndex > -1) {
      const relatedQueries = this.getRelatedQueries(
        this.queriesList[termIndex].term,
        "term"
      );
      const suggestedOptions = relatedQueries.map(query => ({
        ...query,
        name: `${this.queriesList[termIndex].term} ${query.family}`,
        isQueryRelated: true
      }));
      this.initAutoCompleteSuggestions(suggestedOptions);
    }
    // check if is family
    const isFamily = query => query.family.includes(inputValue);
    const familyIndex = this.queriesList.findIndex(isFamily);
    if (familyIndex > -1) {
      const relatedQueries = this.getRelatedQueries(
        this.queriesList[familyIndex].family,
        "family"
      );
      const suggestedOptions = relatedQueries.map(query => ({
        ...query,
        name: `${this.queriesList[familyIndex].family} ${query.term}`,
        isQueryRelated: true
      }));
      this.filteredProductsList.subscribe(products => {
        const list = [...suggestedOptions, ...products];
        this.initAutoCompleteSuggestions(list);
      });
    }
    return this.filteredProductsList;
  }

  private getSuggestionByFamilyOrName(inputValue: string): Product[] {
    const filterValue = inputValue.toLowerCase();
    return this.productSuggestions.filter(
      option =>
        option.family.toLowerCase().indexOf(filterValue) === 0 ||
        option.name.toLowerCase().indexOf(filterValue) === 0 ||
        option.name.toLowerCase().includes(filterValue)
    );
  }

  addProductTolist(product: ListProduct): void {
    this.storeService.addItem(product);
    this.numberOfComparableLists.length < 2
      ? this.numberOfComparableLists.push(1)
      : null;
  }

  navigateToOverView(id: string) {
    this.router.navigate(["/overview", id]);
  }

  onSelectionChanged(event) {
    this.isSuggestedSectionHidden = true;
    if (event.isQueryRelated) {
      const family = event.family;
      const term = event.term;
      this.api
        .getRelationsByTerm(term, family)
        .pipe(takeUntil(this.cleanup))
        .subscribe(res => {
          this.getTermRelatedProductlist(res);
        });
    } else {
      const productId = event.id;
      const product = this.getProductById(productId);
      this.initProducList([product]);
    }
  }

  private getTermRelatedProductlist(termRelatedProduct: TermRelatedProduct[]) {
    this.termRelatedProducList = [];
    termRelatedProduct.forEach(_product => {
      const originalProduct = this.getProductById(_product.productId);
      const product: SuggestedProduct = {
        ...originalProduct,
        reason: _product.reason,
        quality: _product.quality
      };
      this.termRelatedProducList.push(product);
    });

    this.termRelatedProducList = this.termRelatedProducList.sort((a, b) =>
      a.quality < b.quality ? 1 : -1
    );
    this.toggleNoResults(this.termRelatedProducList);
    this.initProducList(this.termRelatedProducList);
  }

  getProductById(id: string): Product {
    return this.productSuggestions.find(item => {
      return item.id === id;
    });
  }

  private toggleNoResults(arr): void {
    arr.length === 0
      ? ((this.noResults = true), this.initAutoCompleteSuggestions([]))
      : (this.noResults = false);
  }

  private initQueriesList() {
    this.api
      .getAllQueries()
      .pipe(takeUntil(this.cleanup))
      .subscribe(list => {
        this.queriesList = list;
      });
  }

  private initAutoCompleteSuggestions(list) {
    this.autoCompleteSuggestions = of(list);
  }

  private initProducList(list) {
    this.filteredProductsList = of(list);
  }

  private getRelatedQueries(inputValue: string, key: string) {
    return this.queriesList.filter(query => query[key] === inputValue);
  }

  ngOnDestroy() {
    this.cleanup.next();
    this.cleanup.unsubscribe();
  }
}
