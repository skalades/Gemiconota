import LandingPageClient from "@/components/LandingPageClient";
import prisma from "@/lib/prisma";

export default async function Home() {
  // Fetch data in parallel for performance
  const [userCount, products, profiles, settings, activities, gallery] = await Promise.all([
    prisma.user.count().catch(() => 3000), // Fallback to 3000
    prisma.product.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { position: 'asc' }
        }
      }
    }).catch(() => []), // Fallback to empty
    prisma.profile.findMany({
      where: { currentCompany: { not: null } },
      select: { currentCompany: true }
    }).catch(() => []),
    prisma.setting.findMany().catch(() => []),
    prisma.activity.findMany({ orderBy: { date: 'asc' }, take: 4 }).catch(() => []),
    prisma.gallery.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }).catch(() => [])
  ]);

  const settingsMap = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);

  // Extract unique companies
  const companyNames = profiles
    .map(p => p.currentCompany?.trim().toUpperCase())
    .filter(Boolean) as string[];
  const uniqueCompanies = Array.from(new Set(companyNames));
  
  // Pad if too few items to keep the marquee looking good
  const defaultCompanies = ['PERTAMINA', 'GOOGLE', 'SHOPEE', 'TOKOPEDIA', 'TELKOM', 'ASTRA', 'GOJEK', 'BUKALAPAK'];
  const companies = uniqueCompanies.length >= 5 ? uniqueCompanies : Array.from(new Set([...uniqueCompanies, ...defaultCompanies])).slice(0, 10);

  // Map products to serialized format (avoid decimal issues)
  const serializedProducts = (products as any[]).map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.sellPrice), // Map sellPrice to component's price
    badge: p.stockType,
    category: p.category,
    description: p.description,
    sizes: p.sizes ? p.sizes.split(',') : [],
    imageUrl: p.images?.[0]?.url || p.imageUrl,
    images: p.images?.map((img: any) => img.url) || []
  }));

  // Initial stats
  const stats = {
    alumni: userCount > 0 ? userCount : 3000,
    cities: 12, // Still static for now
  };

  return (
    <LandingPageClient 
      stats={stats} 
      products={serializedProducts} 
      companies={companies} 
      settings={settingsMap}
      activities={activities as any}
      gallery={gallery as any}
    />
  );
}
