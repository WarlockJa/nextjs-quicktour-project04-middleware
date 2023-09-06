import { NextResponse } from "next/server";
import { limiter } from "../../config/limiter";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos";

type Props = {
  params: {
    id: string;
  };
};

// getting id from the URI
export async function GET(req: Request, { params: { id } }: Props) {
  //   const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  const origin = req.headers.get("origin");
  // applying limiter to the request
  const remaining = await limiter.removeTokens(1);
  console.log("remaining: ", remaining);

  if (remaining < 0)
    return new NextResponse(null, {
      status: 429,
      statusText: "Too many requests. Try again later.",
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "text/plain",
      },
    });

  const response = await fetch(`${DATA_SOURCE_URL}/${id}`);

  if (!response.ok)
    return NextResponse.json({
      message: response.statusText,
      error: response.status,
    });

  const todo: Todo[] = await response.json();

  return NextResponse.json(todo);
}
