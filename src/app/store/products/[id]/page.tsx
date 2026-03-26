import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { position: 'asc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Serialize Decimal objects to numbers for RSC -> Client boundary
  const serializedProduct = {
    ...product,
    buyPrice: Number(product.buyPrice),
    sellPrice: Number(product.sellPrice),
  };

  return <ProductDetailClient product={serializedProduct as any} />;
}
