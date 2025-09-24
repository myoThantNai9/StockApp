import dbConnect from "@/lib/db";
import Category from "@/models/Category";

// GET /api/category
export async function GET(request) {
  await dbConnect();

  try {
    const pno = request.nextUrl.searchParams.get("pno");
    if (pno) {
      const size = 3; // TODO: make configurable
      const startIndex = (pno - 1) * size;
      const categories = await Category.find()
        .sort({ order: -1 })
        .skip(startIndex)
        .limit(size);
      return Response.json(categories);
    }

    const s = request.nextUrl.searchParams.get("s");
    if (s) {
      const categories = await Category.find({
        name: { $regex: s, $options: "i" },
      }).sort({ order: -1 });
      return Response.json(categories);
    }

    const categories = await Category.find().sort({ order: -1 });
    return Response.json(categories);
  } catch (err) {
    console.error("GET /api/category error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch categories" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST /api/category
export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const category = new Category(body);
    await category.save();
    return Response.json(category, { status: 201 });
  } catch (err) {
    console.error("POST /api/category error:", err);
    return new Response(JSON.stringify({ error: "Failed to create category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT /api/category
export async function PUT(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(body._id, body, {
      new: true, // return updated doc
      runValidators: true,
    });
    if (!category) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return Response.json(category);
  } catch (err) {
    console.error("PUT /api/category error:", err);
    return new Response(JSON.stringify({ error: "Failed to update category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}