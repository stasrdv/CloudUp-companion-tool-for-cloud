import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./views/home-page/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProductCardComponent } from "./views/home-page/components/product-card/product-card.component";
import { FullDetailsComponent } from "./views/full-details/full-details.component";
import { SummaryComponent } from "./views/summary/summary.component";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";

const materialModules = [
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
  MatButtonModule,
  MatRippleModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatSelectModule
];
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BillingComponent } from "./views/billing/billing.component";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ProductCardComponent,
    FullDetailsComponent,
    SummaryComponent,
    BillingComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "overview/:id", component: FullDetailsComponent },
      { path: "summary/:id", component: SummaryComponent },
      { path: "billing/:id", component: BillingComponent }
    ]),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    materialModules,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
