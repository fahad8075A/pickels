import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create or update Admin User
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@zeztypickles.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "AdminPassword123!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: "Zezty Administrator",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
  });
  console.log(`Admin account created: ${admin.email}`);

  // 2. Demo Customer
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Priya Sharma",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "+91 98111 22233",
      addresses: {
        create: {
          fullName: "Priya Sharma",
          phone: "+91 98111 22233",
          addressLine: "Flat 402, Green Meadows, Sector 45",
          city: "Gurugram",
          state: "Haryana",
          postalCode: "122003",
          isDefault: true,
        },
      },
    },
  });
  console.log(`Demo customer created: ${customer.email}`);

  // 3. Categories
  const mangoCat = await prisma.category.upsert({
    where: { slug: "mango-pickles" },
    update: {},
    create: {
      name: "Mango Pickles",
      slug: "mango-pickles",
      description: "Traditional sun-ripened and tart raw mango preparations crafted with age-old secret spice blends.",
    },
  });

  const garlicCat = await prisma.category.upsert({
    where: { slug: "garlic-specialties" },
    update: {},
    create: {
      name: "Garlic Specialties",
      slug: "garlic-specialties",
      description: "Pungent whole garlic cloves infused in cold-pressed mustard oil and fiery spices.",
    },
  });

  const vegCat = await prisma.category.upsert({
    where: { slug: "mixed-vegetables" },
    update: {},
    create: {
      name: "Mixed Vegetables",
      slug: "mixed-vegetables",
      description: "Wholesome seasonal crunchy vegetables harmoniously pickled with traditional pickling spices.",
    },
  });

  // 4. Products with Kerala Amma's Touch
  const mangoPickle = await prisma.product.upsert({
    where: { slug: "mango-pickle" },
    update: {
      name: "Kerala Mango Pickle • മാങ്ങാ അച്ചാർ",
      price: 199,
      originalPrice: 249,
      image: "/images/products/mango-pickle.jpg",
      stock: 150,
      isBestseller: true,
      isFeatured: true,
      shortDescription: "Amma's classic blend of raw mangoes and aromatic Kerala spices. Tangy, spicy, truly nostalgic.",
      fullDescription: "Handcrafted Kerala mango pickle made with freshly sliced green mangoes, cold-pressed gingelly and mustard oil, roasted fenugreek (methi), curry leaves, and authentic red chillies. Aged in traditional ceramic Bharani jars for the deep, comforting taste of Amma's kitchen.",
      ingredients: "Raw Mangoes (പച്ചമാങ്ങ), Gingelly & Mustard Oil, Red Chilli Powder, Fenugreek, Asafoetida (കായം), Curry Leaves, Turmeric, Salt",
    },
    create: {
      name: "Kerala Mango Pickle • മാങ്ങാ അച്ചാർ",
      slug: "mango-pickle",
      shortDescription: "Amma's classic blend of raw mangoes and aromatic Kerala spices. Tangy, spicy, truly nostalgic.",
      fullDescription: "Handcrafted Kerala mango pickle made with freshly sliced green mangoes, cold-pressed gingelly and mustard oil, roasted fenugreek (methi), curry leaves, and authentic red chillies. Aged in traditional ceramic Bharani jars for the deep, comforting taste of Amma's kitchen.",
      sku: "ZP-MNG-350",
      categoryId: mangoCat.id,
      price: 199,
      originalPrice: 249,
      image: "/images/products/mango-pickle.jpg",
      ingredients: "Raw Mangoes (പച്ചമാങ്ങ), Gingelly & Mustard Oil, Red Chilli Powder, Fenugreek, Asafoetida (കായം), Curry Leaves, Turmeric, Salt",
      weight: "350g",
      stock: 150,
      isFeatured: true,
      isBestseller: true,
      isPublished: true,
    },
  });

  const garlicPickle = await prisma.product.upsert({
    where: { slug: "garlic-pickle" },
    update: {
      name: "Nadan Garlic Pickle • വെളുത്തുള്ളി അച്ചാർ",
      price: 229,
      originalPrice: 279,
      image: "/images/products/garlic-pickle.jpg",
      stock: 120,
      isBestseller: true,
      isFeatured: true,
      shortDescription: "Amma's bold garlic recipe with roasted spices and rich oil. Perfect for spice lovers.",
      fullDescription: "Plump whole garlic cloves gently sautéed in cold-pressed oil, infused with mustard seeds, green chillies, curry leaves, and crushed Kashmiri chillies. Bold, pungent, and authentically Kerala.",
      ingredients: "Fresh Garlic (വെളുത്തുള്ളി), Cold-Pressed Oil, Kashmiri Chilli, Mustard Seeds, Curry Leaves, Fenugreek, Salt, Spices",
    },
    create: {
      name: "Nadan Garlic Pickle • വെളുത്തുള്ളി അച്ചാർ",
      slug: "garlic-pickle",
      shortDescription: "Amma's bold garlic recipe with roasted spices and rich oil. Perfect for spice lovers.",
      fullDescription: "Plump whole garlic cloves gently sautéed in cold-pressed oil, infused with mustard seeds, green chillies, curry leaves, and crushed Kashmiri chillies. Bold, pungent, and authentically Kerala.",
      sku: "ZP-GRL-350",
      categoryId: garlicCat.id,
      price: 229,
      originalPrice: 279,
      image: "/images/products/garlic-pickle.jpg",
      ingredients: "Fresh Garlic (വെളുത്തുള്ളി), Cold-Pressed Oil, Kashmiri Chilli, Mustard Seeds, Curry Leaves, Fenugreek, Salt, Spices",
      weight: "350g",
      stock: 120,
      isFeatured: true,
      isBestseller: true,
      isPublished: true,
    },
  });

  const mixedVegPickle = await prisma.product.upsert({
    where: { slug: "mixed-veg-pickle" },
    update: {
      name: "Nadan Veg Pickle • പച്ചക്കറി അച്ചാർ",
      price: 189,
      originalPrice: 239,
      image: "/images/products/mixed-veg-pickle.jpg",
      stock: 100,
      isBestseller: true,
      isFeatured: true,
      shortDescription: "A wholesome Kerala Sadya mix of seasonal vegetables and Amma's spices. Pure homestyle flavor.",
      fullDescription: "A colorful medley of crunchy carrots, lemon pieces, slit green chillies, and ginger preserved in fragrant roasted spices. The quintessential Kerala feast accompaniment.",
      ingredients: "Carrots, Lemon, Green Chillies, Ginger, Mustard Oil, Turmeric, Fenugreek, Asafoetida, Salt",
    },
    create: {
      name: "Nadan Veg Pickle • പച്ചക്കറി അച്ചാർ",
      slug: "mixed-veg-pickle",
      shortDescription: "A wholesome Kerala Sadya mix of seasonal vegetables and Amma's spices. Pure homestyle flavor.",
      fullDescription: "A colorful medley of crunchy carrots, lemon pieces, slit green chillies, and ginger preserved in fragrant roasted spices. The quintessential Kerala feast accompaniment.",
      sku: "ZP-VEG-400",
      categoryId: vegCat.id,
      price: 189,
      originalPrice: 239,
      image: "/images/products/mixed-veg-pickle.jpg",
      ingredients: "Carrots, Lemon, Green Chillies, Ginger, Mustard Oil, Turmeric, Fenugreek, Asafoetida, Salt",
      weight: "400g",
      stock: 100,
      isFeatured: true,
      isBestseller: true,
      isPublished: true,
    },
  });

  // 5. Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 300,
      maxDiscount: 100,
      maxUses: 500,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "TASTE50" },
    update: {},
    create: {
      code: "TASTE50",
      discountType: "FIXED",
      discountValue: 50,
      minOrderAmount: 400,
      maxUses: 200,
      isActive: true,
    },
  });

  // 7. Seed CMS: Hero Content
  await prisma.heroContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      eyebrow: "തനത് കേരള അച്ചാറുകൾ • AMMA'S TRADITIONAL KERALA PICKLES",
      heading: "A Little Tang, A Lot of Tradition.",
      malayalamText: "അമ്മയുടെ സ്നേഹവും കൈപ്പുണ്യവും നിറഞ്ഞ തനത് നാടൻ രുചി.",
      description: "Handcrafted Kerala pickles prepared with Amma's traditional recipes, garden-fresh ingredients, and the warmth of a Kerala home kitchen.",
      primaryBtnText: "Shop Amma's Pickles",
      primaryBtnLink: "/products",
      secondaryBtnText: "Amma's Story • അമ്മയുടെ കഥ",
      secondaryBtnLink: "/our-story",
      heroImage: "/images/banners/hero-pickles.jpg",
      badgeText: "അമ്മയുടെ കൈപ്പുണ്യം",
      isActive: true,
    },
  });

  // 8. Seed CMS: Benefits
  await prisma.benefit.deleteMany({});
  await prisma.benefit.createMany({
    data: [
      {
        title: "Traditional Recipes",
        malayalamTitle: "അമ്മയുടെ കൈപ്പുണ്യം",
        subtitle: "Amma's Heritage Recipes",
        icon: "BookOpen",
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Fresh Nadan Produce",
        malayalamTitle: "നാടൻ ചേരുവകൾ",
        subtitle: "Backyard Fresh",
        icon: "Leaf",
        displayOrder: 2,
        isActive: true,
      },
      {
        title: "Cured in Bharani",
        malayalamTitle: "ഭരണിയിൽ മൂപ്പിച്ചത്",
        subtitle: "Ceramic Aged",
        icon: "Flame",
        displayOrder: 3,
        isActive: true,
      },
      {
        title: "Packed with Amma's Love",
        malayalamTitle: "അമ്മയുടെ സ്നേഹത്തോടെ",
        subtitle: "Homestyle Care",
        icon: "HeartHandshake",
        displayOrder: 4,
        isActive: true,
      },
    ],
  });

  // 9. Seed CMS: Story Content
  await prisma.storyContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      eyebrow: "അമ്മയുടെ കഥ • OUR KERALA HERITAGE",
      heading: "From Amma's Kitchen in Kerala to Your Table",
      malayalamHeading: "അമ്മയുടെ കൈപ്പുണ്യം",
      description: "At Zezty Pickles, our story begins in a traditional courtyard kitchen in Kerala, watching Amma tenderly slice raw green mangoes, marinating them with fragrant curry leaves, roasted fenugreek, and cold-pressed gingelly oil in ceramic Bharani jars.",
      quoteText: "“അമ്മയുടെ സ്നേഹവും തനത് കൈപ്പുണ്യവുമാണ് ഞങ്ങളുടെ ഓരോ അച്ചാർ കുപ്പിയിലുമുള്ളത്.”",
      image: "/images/banners/pickle-bowl-story.jpg",
      ctaText: "Read Amma's Story",
      ctaUrl: "/our-story",
      decorativeText: "Authentic Kerala Bharani Recipe",
      isActive: true,
    },
  });

  // 10. Seed CMS: Ingredients
  await prisma.ingredient.deleteMany({});
  await prisma.ingredient.createMany({
    data: [
      {
        name: "Raw Mangoes",
        malayalamName: "പച്ചമാങ്ങ",
        description: "For that authentic Kerala tang.",
        image: "/images/ingredients/raw-mangoes.jpg",
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Garlic",
        malayalamName: "വെളുത്തുള്ളി",
        description: "Slow-roasted & rich in flavor.",
        image: "/images/ingredients/garlic.jpg",
        displayOrder: 2,
        isActive: true,
      },
      {
        name: "Red Chillies",
        malayalamName: "വറ്റൽമുളക്",
        description: "Crushed for perfect Kerala heat.",
        image: "/images/ingredients/red-chillies.jpg",
        displayOrder: 3,
        isActive: true,
      },
      {
        name: "Mustard Seeds",
        malayalamName: "കടുക്",
        description: "Cracked for traditional crunch.",
        image: "/images/ingredients/mustard-seeds.jpg",
        displayOrder: 4,
        isActive: true,
      },
      {
        name: "Curry Leaves",
        malayalamName: "കറിവേപ്പില",
        description: "Fresh aromatic backyard aroma.",
        image: "/images/ingredients/curry-leaves.jpg",
        displayOrder: 5,
        isActive: true,
      },
      {
        name: "Nadan Spices",
        malayalamName: "നാടൻ കൂട്ടുകൾ",
        description: "Amma's secret roasted spice blend.",
        image: "/images/ingredients/traditional-spices.jpg",
        displayOrder: 6,
        isActive: true,
      },
    ],
  });

  // 11. Seed CMS: Promo Banner
  await prisma.promoBanner.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      eyebrow: "അമ്മയുടെ കൈപ്പുണ്യം • TASTE OF KERALA",
      heading: "Bring Home Amma's Real Taste.",
      malayalamText: "കേരളത്തിന്റെ തനത് നാടൻ അച്ചാറുകൾ നിങ്ങളുടെ വീട്ടിലെത്തിക്കൂ.",
      description: "Authentic. Fresh. Bharani-Aged. Zezty Pickles.",
      ctaText: "Shop Amma's Pickles • വാങ്ങൂ",
      ctaUrl: "/products",
      image: "/images/banners/promo-banner.jpg",
      isActive: true,
    },
  });

  // 12. Seed CMS: Navigation Items
  await prisma.navigationItem.deleteMany({});
  await prisma.navigationItem.createMany({
    data: [
      { label: "Home", url: "/", displayOrder: 1, isActive: true },
      { label: "Our Pickles", url: "/products", displayOrder: 2, isActive: true },
      { label: "Our Story", url: "/our-story", displayOrder: 3, isActive: true },
      { label: "Ingredients", url: "/ingredients", displayOrder: 4, isActive: true },
      { label: "Contact", url: "/contact", displayOrder: 5, isActive: true },
    ],
  });

  // 13. Seed CMS: Footer Setting
  await prisma.footerSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      description: "Traditional Kerala pickles made with Amma's love, for your everyday moments. Handcrafted in small batches with cold-pressed oils and pure heritage spices.",
      malayalamTagline: "Good Food. Happy Moments. അമ്മയുടെ കൈപ്പുണ്യം.",
      instagramUrl: "https://instagram.com",
      facebookUrl: "https://facebook.com",
      youtubeUrl: "https://youtube.com",
      pinterestUrl: "https://pinterest.com",
      copyrightText: `© ${new Date().getFullYear()} Zezty Pickles. All rights reserved.`,
    },
  });

  // 14. Seed CMS: FAQs
  await prisma.fAQ.deleteMany({});
  await prisma.fAQ.createMany({
    data: [
      {
        question: "Are Zezty Pickles made with artificial preservatives or synthetic vinegar?",
        answer: "Never! All our pickles are 100% natural. They are naturally preserved using salt, turmeric, and pure cold-pressed oil in traditional porcelain Bharani jars. Zero synthetic chemicals.",
        category: "Ingredients & Purity",
        displayOrder: 1,
        isActive: true,
      },
      {
        question: "What is the shelf life of Amma's pickles?",
        answer: "Our pickles have a natural shelf life of 12 months when stored in a cool, dry place. Always use a dry, clean spoon to ensure freshness.",
        category: "Storage",
        displayOrder: 2,
        isActive: true,
      },
      {
        question: "How does nationwide delivery work?",
        answer: "We ship all across India within 24–48 hours of your order. Delivery is completely FREE on all orders of ₹499 or more.",
        category: "Shipping",
        displayOrder: 3,
        isActive: true,
      },
      {
        question: "Do you offer Cash on Delivery (COD)?",
        answer: "Yes! We offer Cash on Delivery across supported Indian postal PIN codes, as well as instant online payment via Razorpay, UPI, and cards.",
        category: "Payments",
        displayOrder: 4,
        isActive: true,
      },
    ],
  });

  // 15. Seed Admin User
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Zezty Super Admin",
      role: "SUPER_ADMIN",
      permissions: "*",
      passwordHash: adminPasswordHash,
    },
  });

  console.log("Database & CMS seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
