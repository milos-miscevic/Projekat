import { CartService } from "src/services/cart/cart.service";
import { Controller, Get, Post, Patch, Body } from "@nestjs/common";
import { Cart } from "src/entities/cart.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { AddArticleToCartDto } from "src/dtos/cart/add.article.to.cart.dto";
import { EditArticleInCartDto } from "src/dtos/cart/edit.article.in.cart.dto";

@Controller('cart')
export class ApiCartController {
    constructor(
        private cartService: CartService,
    ) { }

    private async getActiveCartByCartId(cartId: number): Promise<Cart> {
        let cart = await this.cartService.getLastActiveCartByCartId(cartId);

        if (!cart) {
            cart = await this.cartService.createNewCart();
        }

        return await this.cartService.getById(cart.cartId);
    }

    private async getCartByCartId(cartId: number): Promise<Cart> {

        return await this.getActiveCartByCartId(cartId);

    }

    @Get()
    async getCart(cartId: number): Promise<Cart> {
        return await this.getCartByCartId(cartId);

    }

    @Post('addToCart')
    async addToCart(@Body() data: AddArticleToCartDto, cartId: number): Promise<Cart | ApiResponse> {
        const cart = await this.getActiveCartByCartId(cartId);

        return await this.cartService.addArticleToCart(cart.cartId, data.articleId, data.quantity);
    }

    @Patch()
    async changeQuantity(@Body() data: EditArticleInCartDto, cartId: number) {
        const cart = await this.getCartByCartId(cartId);
        return await this.cartService.changeQuantity(cart.cartId, data.articleId, data.quantity);
    }
}