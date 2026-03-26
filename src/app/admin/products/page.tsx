import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package, Edit } from "lucide-react";
import DeleteButton from "./DeleteButton";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black mb-2">Inventory</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Manage your merchandise</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Buy Price</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sell Price</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stock</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">No products found. Add your first merch to get started.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                        {product.imageUrl ? (
                           <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                           <Package className="w-full h-full p-3 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate max-w-[200px]">{product.description || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      product.stockType === 'READY' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {product.stockType}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-400 text-xs">
                      {formatPrice(product.buyPrice)}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">
                      {formatPrice(product.sellPrice)}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{product.stockCount}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
