import { cache } from "react";
import dbConnect from "../dbConnect";
import ProductModel, { Product } from "../models/ProductModel";

export const revalidate = 3600;

// Función auxiliar para convertir documentos de Mongoose a tipo Product
const convertToProduct = (doc: any): Product => {
  const {
    _id,
    name,
    slug,
    category,
    image,
    price,
    brand,
    rating,
    numReviews,
    countInStock,
    description,
    isFeatured,
    banner,
    colors,
    sizes,
  } = doc;

  return {
    _id: _id.toString(),
    name,
    slug,
    category,
    image,
    price,
    brand,
    rating,
    numReviews,
    countInStock,
    description,
    isFeatured,
    banner,
    colors,
    sizes,
  };
};

const getLatestProducts = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find()
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return products.map(convertToProduct);
});

const getFeatured = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({ isFeatured: true })
    .limit(3)
    .lean();

  return products.map(convertToProduct);
});

const getBySlug = cache(async (slug: string) => {
  await dbConnect();
  const product = await ProductModel.findOne({ slug }).lean();

  if (!product) return null;
  return convertToProduct(product);
});

const productService = {
  getLatestProducts,
  getFeatured,
  getBySlug,
};

export default productService;
