import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "src/entities/cart.entity";
import { Order } from "src/entities/order.entity";
import { Repository } from "typeorm";
import { Article } from "src/entities/article.entity";
import { ApiResponse } from "src/misc/api.response.class";

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Cart) private cart: Repository<Cart>,
        @InjectRepository(Order) private order: Repository<Order>,
    ) { }

    async add(cartId: number): Promise<Order | ApiResponse> {
        const order = await this.order.findOne({
            cartId: cartId
        });

        if (order) {
            return new ApiResponse("error", -7001, "An order for this cart has already been made.");
        }

        const cart = await this.cart.findOne(cartId, {
            relations: [
                "cartArticles"
            ]
        });

        if (!cart) {
            return new ApiResponse("error", -7002, "No such cart found.");
        }

        if (cart.cartArticles.length === 0) {
            return new ApiResponse("error", -7003, "This cart is empty.");
        }

        const newOrder: Order = new Order();
        newOrder.cartId = cartId;
        const savedOrder = await this.order.save(newOrder);

        cart.createdAt = new Date();
        await this.cart.save(cart);

        return await this.getById(savedOrder.orderId);

    }

    async getById(orderId: number) {
        return await this.order.findOne(orderId, {
            relations: [
                "cart",
                "cart.cartArticles",
                "cart.cartArticles.article",
                "cart.cartArticles.article.category",
            ]
        });
    }

}