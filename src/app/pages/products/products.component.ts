import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { tap } from 'rxjs/operators'
import { Product } from '../interfaces/interface';
import { ShoppingCartService } from '../../shared/services/shopping-cart.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products!: Product[];
  constructor(
    private productsService: ProductsService,
    private shoppincardservice: ShoppingCartService) { }

  ngOnInit(): void {
    this.productsService.getProducts()
      .pipe(
        tap((products: Product[]) => this.products = products)
      ).subscribe();
  }
  addToCart(product: Product): void {
    console.log('product', product);
    this.shoppincardservice.updateCart(product)
    }

}
