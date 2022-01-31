import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Details, Order } from 'src/app/shared/interface/order.interface';
import { Store } from 'src/app/shared/interface/store.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../interfaces/interface';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  // private subscriptions!: Subscription;
  isDelivery: boolean = true;
  cart: Product[] = [];
  stores: Store[] = [];

  model = {
    name: '',
    store: '',
    shippingAddress: '',
    city: ''
  };

  constructor(
    private dataservice: DataService,
    private shoppingcartservice: ShoppingCartService,
    private router: Router,
    private productservice: ProductsService
  ) {
    this.checkIfCartIsEmpty()
  }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }
  // ngOnDestroy(): void {
  //   this.subscriptions.unsubscribe()
  // }

  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value;

  }
  //Haremos detructuring
  onSubmit({ value: formData }: NgForm): void {
    console.log("Guardar", formData);
    const data: Order = {
      ...formData,
      date: this.getCurrentDay(),
      isDelivery: this.isDelivery
    }
    this.dataservice.saveOrder(data)
      .pipe(
        tap(res => console.log('Order -> ', res)), //Este tap() y en enste caso, solo lo tendremos para fines de depuración, para ver por consola el 'res'
        switchMap((order) => {
          const orderId = order.id;
          const details = this.prepareDetails();
          return this.dataservice.saveDetailsOrder({ details, orderId })
        }),
        tap(() => this.router.navigate(['/checkout/thank-you-page'])),
        delay(2000),
        tap(() => this.shoppingcartservice.resetCart())
      )
      .subscribe();
  }

  private getStores(): void {
    // Todo: desuscribirse a un observable. Angular ya gestiona esto, pero se debería desuscribir.
    // this.subscriptions.add(
    this.dataservice.getStores()
      .pipe(
        tap(res => this.stores = res))
      .subscribe()
    // )
  }

  private getCurrentDay(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach((product: Product) => {
      const { id: productId, name: productName, qty: quantity, stock } = product;
      const updateStock = (stock - quantity);
      this.productservice.updateStock(productId, updateStock)
        .pipe(
          tap(res => details.push({ productId, productName, quantity }))
        )
        .subscribe()
    })
    return details;
  }

  private getDataCart(): void {
    this.shoppingcartservice.cartAction$
      .pipe(
        tap((products: Product[]) => this.cart = products)
      )
      .subscribe()
  }

  //Si el caarrito está vacío hago una redirección:
  private checkIfCartIsEmpty(): void {
    this.shoppingcartservice.cartAction$
      .pipe(
        tap((res: Product[]) => {
          if (Array.isArray(res) && !res.length) {
            this.router.navigate(['/products'])
          }
        })
      )
      .subscribe()
  }


}
