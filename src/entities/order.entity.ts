import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import * as Validator from 'class-validator';

@Index("uq_order_cart_id", ["cartId"], { unique: true })
@Entity("order", { schema: "aplikacija" })
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "order_id", unsigned: true })
  orderId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("int", {
    name: "cart_id",
    unique: true,
    unsigned: true,
  })
  cartId: number;

  @Column({
    type: "varchar",
    length: 128
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,128)
  name: string;

  @Column({
    type: "varchar",
    length: 128
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,128)
  surname: string;

  @Column({
    type: "varchar",
    length: 128
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,128)
  email: string;

  @Column({
    type: "varchar",
    length: 128
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,128)
  address: string;



  @OneToOne(() => Cart, (cart) => cart.order, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;
}
