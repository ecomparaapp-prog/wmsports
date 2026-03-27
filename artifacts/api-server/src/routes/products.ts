import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { insertProductSchema } from "@workspace/db";

const router: IRouter = Router();

router.get("/products", async (_req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.active, true))
      .orderBy(desc(productsTable.createdAt));
    res.json(products.map(p => ({
      ...p,
      basePrice: parseFloat(p.basePrice),
      price3: p.price3 ? parseFloat(p.price3) : null,
      price5: p.price5 ? parseFloat(p.price5) : null,
    })));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({
      ...product,
      basePrice: parseFloat(product.basePrice),
      price3: product.price3 ? parseFloat(product.price3) : null,
      price5: product.price5 ? parseFloat(product.price5) : null,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const data = insertProductSchema.parse(req.body);
    const [product] = await db.insert(productsTable).values(data).returning();
    res.status(201).json({
      ...product,
      basePrice: parseFloat(product.basePrice),
      price3: product.price3 ? parseFloat(product.price3) : null,
      price5: product.price5 ? parseFloat(product.price5) : null,
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertProductSchema.parse(req.body);
    const [product] = await db.update(productsTable).set(data).where(eq(productsTable.id, id)).returning();
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({
      ...product,
      basePrice: parseFloat(product.basePrice),
      price3: product.price3 ? parseFloat(product.price3) : null,
      price5: product.price5 ? parseFloat(product.price5) : null,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to update product" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
