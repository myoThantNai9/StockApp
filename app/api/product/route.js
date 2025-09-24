import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// GET /api/product
export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find();
    return Response.json(products);
  } catch (err) {
    console.error("GET /api/product error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch products" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST /api/product
export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    console.log("POST /api/product body:", body);
    const product = new Product(body);
    await product.save();
    return Response.json(product, { status: 201 });
  } catch (err) {
    console.error("POST /api/product error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to create product" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PUT /api/product
export async function PUT(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    const product = await Product.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return Response.json(product);
  } catch (err) {
    console.error("PUT /api/product error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to update product" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PATCH /api/product
export async function PATCH(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    const product = await Product.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return Response.json(product);
  } catch (err) {
    console.error("PATCH /api/product error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to partially update product" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}