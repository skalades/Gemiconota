'use client'

import { Trash2 } from "lucide-react";
import { deleteProduct } from "./actions";
import { useTransition } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        await deleteProduct(id);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
    >
      <Trash2 size={18} />
    </button>
  );
}
