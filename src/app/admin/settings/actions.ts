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

export async function updateSettings(formData: FormData) {
  const imagesData = formData.getAll("hero_images_data") as string[];
  const uploadedFiles = await saveImages(formData, "images_files", "hero");

  let fileIdx = 0;
  const finalImageUrls = imagesData.map(data => {
    if (data.startsWith("FILE_PLACEHOLDER_")) {
      return uploadedFiles[fileIdx++];
    }
    return data;
  }).filter(Boolean) as string[];

  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string' && !key.startsWith("$ACTION") && key !== "hero_images_data" && key !== "images_files" && key !== "hero_image") {
      data[key] = value;
    }
  });

  // add hero_images as stringified JSON
  if (finalImageUrls.length > 0) {
    data["hero_images"] = JSON.stringify(finalImageUrls);
  }

  for (const [key, value] of Object.entries(data)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
