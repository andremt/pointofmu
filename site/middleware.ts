import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_DESK_PATHS = ['/desk/login', '/desk/calendar.ics']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_DESK_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const session = req.cookies.get('desk_session')?.value
  const secret = process.env.DESK_SESSION_SECRET

  if (!secret || session !== secret) {
    const loginUrl = new URL('/desk/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/desk/:path*'],
}
