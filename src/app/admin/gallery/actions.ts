"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function saveImages(formData: FormData, fieldName: string, folder: string) {
  const files = formData.getAll(fieldName) as File[];
  
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0 || typeof file === 'string') continue;
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    urls.push(`/uploads/${folder}/${fileName}`);
  }
  return urls;
}

export async function createGalleryImage(formData: FormData) {
  const caption = formData.get("caption") as string;
  const uploadedUrls = await saveImages(formData, "image", "gallery");

  if (uploadedUrls.length > 0) {
    await prisma.gallery.create({
      data: {
        imageUrl: uploadedUrls[0],
        caption: caption || null,
      },
    });
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function deleteGalleryImage(id: string) {
  await prisma.gallery.delete({
    where: { id },
  });
  
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
