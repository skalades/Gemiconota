import { updateProduct } from "../../actions";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
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

  const p = product as any;
  const serializedProduct = {
    ...product,
    buyPrice: Number(p.buyPrice || 0),
    sellPrice: Number(p.sellPrice || 0),
    images: p.images || []
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1">Edit Product</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update item details</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <EditProductForm product={serializedProduct as any} />
      </div>
    </div>
  );
}
