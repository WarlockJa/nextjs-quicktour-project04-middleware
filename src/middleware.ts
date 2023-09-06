import { NextResponse } from "next/server";

// creating list of origins allowed to access endpoints
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://www.yoursite.com", "https://yoursite.com"]
    : ["http://localhost:3000", "https://www.google.com"];

export function middleware(req: Request) {
  // alternative to matchers ways to apply selection to middleware
  //   const regex = new RegExp("/api/*");
  //   if (regex.test(req.url)) {
  //   }
  //   if (req.url.includes("/api/")) {
  //   }

  // processing origins
  const origin = req.headers.get("origin");
  console.log(origin);

  // || !origin to block Insomnia and as such that will not have origin at all. WARNING some browser requests may be blocked because of this
  if (origin && !allowedOrigins.includes(origin))
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad request",
      headers: {
        "Content-Type": "text/plain",
      },
    });

  console.log("Middleware here");
  console.log(req.method);
  console.log(req.url);

  return NextResponse.next();
}

// defining matcher for the route /api/:path* to which the middleware will be fired
export const config = {
  matcher: "/api/:path*",
};
