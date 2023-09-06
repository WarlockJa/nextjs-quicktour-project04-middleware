import { NextResponse } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";
const API_KEY = process.env.DATA_API_KEY as string;

export async function GET(req: Request) {
  // getting origin from request headers
  const origin = req.headers.get("origin");

  const response = await fetch(DATA_SOURCE_URL);
  if (!response.ok)
    return NextResponse.json({
      message: response.statusText,
      error: response.status,
    });

  const todos: Todo[] = await response.json();

  // forming a response with headers necessary to bypass allowedOrigins middleware
  return new NextResponse(JSON.stringify(todos), {
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req: Request) {
  const { id }: Partial<Todo> = await req.json();

  if (!id) return NextResponse.json({ message: "Todo ID required" });

  await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "API-Key": API_KEY,
    },
  });

  return NextResponse.json({ message: `Todo ${id} deleted` });
}

export async function POST(req: Request) {
  const { userId, title }: Partial<Todo> = await req.json();

  if (!userId || !title)
    return NextResponse.json({ message: "Missing required data" });

  const response = await fetch(`${DATA_SOURCE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": API_KEY,
    },
    body: JSON.stringify({
      userId,
      title,
      completed: false,
    }),
  });

  if (!response.ok)
    return NextResponse.json({
      message: response.statusText,
      error: response.status,
    });

  const result = await response.json();

  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const { id, userId, title, completed }: Partial<Todo> = await req.json();

  if (!id) return NextResponse.json({ message: "Todo ID required" });
  if (!userId && !title && typeof completed !== "boolean")
    return NextResponse.json({ message: "Missing required data" });

  const response = await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "API-Key": API_KEY,
    },
    body: JSON.stringify({
      userId,
      title,
      completed,
    }),
  });

  if (!response.ok)
    return NextResponse.json({
      message: response.statusText,
      error: response.status,
    });

  const result = await response.json();

  return NextResponse.json(result);
}
