import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: {
        orderBy: { position: 'asc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product as any} />;
}
