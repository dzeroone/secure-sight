import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    const response = NextResponse;
    return response.next();
    // const hasToken = req.cookies.get("_token");
    // if (req.nextUrl.pathname === "/" && hasToken) {
    //     console.log("1")
    //     const checkAuth = await axios.post("/auth/verify", {
    //         headers: {
    //             Authorization: `Bearer ${hasToken.value}`
    //         }
    //     });
    //     console.log("checkAuth ::: ", checkAuth)
    //     if (checkAuth.data.success) {
    //         return response.redirect("/dashboard");
    //     }
    //     return response.next();
    // } else if (req.nextUrl.pathname !== "/" && !hasToken) {
    //     return response.redirect(new URL("/", req.url));
    // } else {
    //     return response.next();
    // }
}

export const config = {
    matcher: ["/dashboard/:path*"]
}