'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { product_stockType } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function saveImages(formData: FormData, fieldName: string, folder: "products" | "campaigns") {
  const files = formData.getAll(fieldName) as File[];
  console.log(`[saveImages] Field: ${fieldName}, Count: ${files.length}`);
  
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0 || typeof file === 'string') {
      console.log(`[saveImages] Skipping file: ${file?.name || 'unknown'}, Size: ${file?.size || 0}`);
      continue;
    }
    
    console.log(`[saveImages] Saving file: ${file.name}, Size: ${file.size}`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    urls.push(`/uploads/${folder}/${fileName}`);
  }
  return urls;
}

function cleanPrice(value: string | null) {
  if (!value) return "0";
  // Remove Rp., dots, and whitespace
  return value.replace(/Rp\.|\.| /g, "").replace(/,/g, ".");
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const stockCount = formData.get("stockCount") as string;
  const stockType = formData.get("stockType") as product_stockType;
  const estimatedArrival = formData.get("estimatedArrival") as string;
  const category = formData.get("category") as string;
  const sizes = formData.getAll("sizes").join(",");
  const buyPrice = formData.get("buyPrice") as string;
  const sellPrice = formData.get("sellPrice") as string;

  // We use images_files from our new ImageUpload component
  const uploadedUrls = await saveImages(formData, "images_files", "products");

  await prisma.product.create({
    data: {
      name,
      description,
      buyPrice: parseFloat(cleanPrice(buyPrice)),
      sellPrice: parseFloat(cleanPrice(sellPrice)),
      stockCount: parseInt(stockCount),
      stockType,
      imageUrl: uploadedUrls[0] || null,
      estimatedArrival,
      category,
      sizes,
      images: {
        create: uploadedUrls.map((url, index) => ({ 
          url,
          position: index 
        }))
      }
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const stockCount = formData.get("stockCount") as string;
  const stockType = formData.get("stockType") as product_stockType;
  const estimatedArrival = formData.get("estimatedArrival") as string;
  const category = formData.get("category") as string;
  const sizes = formData.getAll("sizes").join(",");
  const buyPrice = formData.get("buyPrice") as string;
  const sellPrice = formData.get("sellPrice") as string;

  // images_data contains the ordered list of URLs and placeholders
  const imagesData = formData.getAll("images_data") as string[];
  const uploadedFiles = await saveImages(formData, "images_files", "products");

  // Reconstruct the final list of URLs in correct order
  let fileIdx = 0;
  const finalImageUrls = imagesData.map(data => {
    if (data.startsWith("FILE_PLACEHOLDER_")) {
      return uploadedFiles[fileIdx++];
    }
    return data; // Existing URL
  }).filter(Boolean) as string[];

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      buyPrice: parseFloat(cleanPrice(buyPrice)),
      sellPrice: parseFloat(cleanPrice(sellPrice)),
      stockCount: parseInt(stockCount),
      stockType,
      imageUrl: finalImageUrls[0] || null,
      estimatedArrival,
      category,
      sizes,
      images: {
        deleteMany: {},
        create: finalImageUrls.map((url, index) => ({ 
          url,
          position: index 
        }))
      }
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/admin/products");
}

// --- CAMPAIGNS ---

export async function createCampaign(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const targetAmount = formData.get("targetAmount") as string;
  const endDate = formData.get("endDate") as string;

  const uploadedUrls = await saveImages(formData, "images_files", "campaigns");

  await prisma.campaign.create({
    data: {
      title,
      description,
      targetAmount: parseFloat(cleanPrice(targetAmount)),
      endDate: endDate ? new Date(endDate) : null,
      imageUrl: uploadedUrls[0] || null,
      images: {
        create: uploadedUrls.map((url, index) => ({ 
          url,
          position: index 
        }))
      }
    },
  });

  revalidatePath("/admin/campaigns");
  revalidatePath("/");
  redirect("/admin/campaigns");
}

export async function updateCampaign(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const targetAmount = formData.get("targetAmount") as string;
  const endDate = formData.get("endDate") as string;

  const imagesData = formData.getAll("images_data") as string[];
  const uploadedFiles = await saveImages(formData, "images_files", "campaigns");

  let fileIdx = 0;
  const finalImageUrls = imagesData.map(data => {
    if (data.startsWith("FILE_PLACEHOLDER_")) {
      return uploadedFiles[fileIdx++];
    }
    return data;
  }).filter(Boolean) as string[];

  await prisma.campaign.update({
    where: { id },
    data: {
      title,
      description,
      targetAmount: parseFloat(cleanPrice(targetAmount)),
      endDate: endDate ? new Date(endDate) : null,
      imageUrl: finalImageUrls[0] || null,
      images: {
        deleteMany: {},
        create: finalImageUrls.map((url, index) => ({ 
          url,
          position: index 
        }))
      }
    },
  });

  revalidatePath("/admin/campaigns");
  revalidatePath("/");
  redirect("/admin/campaigns");
}

export async function deleteCampaign(id: string) {
  await prisma.campaign.delete({
    where: { id },
  });
  revalidatePath("/admin/campaigns");
}
