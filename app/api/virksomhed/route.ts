import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const filePath = path.join(process.cwd(), "public", "data", "virksomheder.json");
  const liste = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const v = liste.find((v: { asbe_nr: string }) =>
    v.asbe_nr?.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug
  );
  if (!v) return NextResponse.json({ error: "ikke fundet" }, { status: 404 });
  return NextResponse.json(v);
}
