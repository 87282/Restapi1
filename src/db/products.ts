import mongoose from "mongoose";
import express from "express";

const ProductSchema = new mongoose.Schema({
    naam: { type: String, required: true },
    prijs: { type: Number, required: true },
    categorie: { type: String, required: true },
    beschrijving: { type: String, required: false },
});

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    naam: { type: String, required: true },
    prijs: { type: Number, required: true },
    aantal: { type: Number, required: true, min: 1 }
});


const CartSchema = new mongoose.Schema({
    items: [CartItemSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export const CartModel = mongoose.model('Cart', CartSchema);
export const ProductModel = mongoose.model('Product', ProductSchema);
export const getProducten = () => ProductModel.find();
export const getProductById = (id: string) => ProductModel.findById(id);
export const createProduct = (values: Record<string, any>) => new ProductModel(values).save().then((product) => product.toObject());
export const updateProductById = (id: string, values: Record<string, any>) => ProductModel.findByIdAndUpdate(id, values);
export const deleteProductById = (id: string) => ProductModel.findOneAndDelete({ _id: id });

export const addToCart = async (userId: any, productId: string, aantal: number) => {
    const product = await ProductModel.findById(productId);
    if (!product) {
        throw new Error('Product niet gevonden');
    }

    const cart = await CartModel.findOne({ user: userId });
    if (cart) {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].aantal += aantal;
        } else {
            cart.items.push({
                product: productId,
                naam: product.naam,
                prijs: product.prijs,
                aantal
            });
        }
        return cart.save();
    } else {
        const newCart = await CartModel.create({
            user: userId,
            items: [{
                product: productId,
                naam: product.naam,
                prijs: product.prijs,
                aantal
            }]
        });
        return newCart;
    }
};

export const updateItemQuantity = async (userId: any, productId: string, aantal: number) => {
    const cart = await CartModel.findOne({ user: userId });
    if (cart && aantal > 0) {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].aantal = aantal;
            return cart.save();
        }
    }
    return null;
};

export const getCart = async (userId: any) => {
    return CartModel.findOne({ user: userId }).populate('items.product');
};
