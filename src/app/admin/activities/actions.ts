"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function createActivity(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  const uploadedUrls = await saveImages(formData, "image", "activities");

  await prisma.activity.create({
    data: {
      title,
      description,
      location: location || null,
      date: new Date(dateStr),
      imageUrl: uploadedUrls[0] || null,
    },
  });

  revalidatePath("/admin/activities");
  revalidatePath("/");
  redirect("/admin/activities");
}

export async function updateActivity(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;
  
  const existingImageUrl = formData.get("existingImageUrl") as string;
  const uploadedUrls = await saveImages(formData, "image", "activities");
  const finalImageUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : (existingImageUrl || null);

  await prisma.activity.update({
    where: { id },
    data: {
      title,
      description,
      location: location || null,
      date: new Date(dateStr),
      imageUrl: finalImageUrl,
    },
  });

  revalidatePath("/admin/activities");
  revalidatePath("/");
  redirect("/admin/activities");
}

export async function deleteActivity(id: string) {
  await prisma.activity.delete({
    where: { id },
  });
  revalidatePath("/admin/activities");
  revalidatePath("/");
}
