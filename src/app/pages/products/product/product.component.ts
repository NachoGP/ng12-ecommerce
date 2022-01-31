import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../interfaces/interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent{

  @Input() product!: Product;//en el hijo. Puede recibir su valor de su componente padre.
  @Output() addToCartClick = new EventEmitter<Product>(); //en el hijo, permite que los datos fluyan del hijo al padre.

  onClick(){
    this.addToCartClick.emit(this.product);
  }

}
