import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../pages/interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  products: Product[] = [];

  constructor() { }

  private cartSubject = new BehaviorSubject<Product[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  private quantitySubject = new BehaviorSubject<number>(0); //Cantidad de producto: Inventario

  //devuelvo estos observables a nuestra aplicación (para quien los quiera consumir). El $ es por convención cuando se utilizan Observables.
  //Utilizaremos 3 getter.

  get totalAction$(): Observable<number> {
    return this.totalSubject.asObservable();
  }
  get quantityAction$(): Observable<number> {
    return this.quantitySubject.asObservable();
  }
  get cartAction$(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }

  //como el metodo es privado, creo este updateCart para hacerlo disponible.
  updateCart(product: Product): void {
    this.addToCart(product);
    this.quantityProducts();
    this.calcTotal()
  }

  resetCart(): void {
    this.cartSubject.next([]);
    this.totalSubject.next(0);
    this.quantitySubject.next(0);
    this.products = [];
  }


  private addToCart(product: Product): void {
    const isProductInCart = this.products.find(({ id }) => id === product.id)
    if (isProductInCart) {
      isProductInCart.qty += 1;
    } else {
      this.products.push({ ...product, qty: 1 })
    }
    this.cartSubject.next(this.products)
  }

  private quantityProducts(): void {
    const quantity = this.products.reduce((acc, prod) => acc += prod.qty, 0)
    this.quantitySubject.next(quantity)
  }


  private calcTotal(): void {
    const total = this.products.reduce((acc, prod) => acc += (prod.price * prod.qty), 0);
    this.totalSubject.next(total)
  }

}
