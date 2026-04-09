import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/actions/auth";
import { getFeedback } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json([], { status: 401 });
  }
  return NextResponse.json(getFeedback());
}
