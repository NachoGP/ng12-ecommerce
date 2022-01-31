export interface Details {
	productId: number;
	productName: string;
	quantity: number;
}

export interface Order {
	name: string;
	date: string;
	shippingAddress: string;
	city: string;
	isDelivery: boolean;
	id: number;
}
//Acoplamos el modelo en uno solo
export interface detailsOrder{
	details: Details[];
	orderId: number;
	// id?: number;
}