from os import getenv

APP_URL=getenv("APP_URL", "http://localhost:8000")
FRONTEND_URL=getenv("FRONTEND_URL", "http://localhost:3000")

DB_CONNECTION=getenv("DB_CONNECTION", "sqlite3")
DB_NAME=getenv("DB_NAME", "db")
DB_USER=getenv("DB_USER", "")
DB_PASSWORD=getenv("DB_PASSWORD", "")
DB_HOST=getenv("DB_HOST", "")
DB_PORT=getenv("DB_PORT", "")

AUTH_FRONTEND_URL=getenv("AUTH_FRONTEND_URL", "{FRONTEND_URL}/auth?token={token}&data={data}").format(FRONTEND_URL=FRONTEND_URL, token="{token}", data="{data}")
AUTH_ERROR_FRONTEND_URL=getenv("AUTH_ERROR_FRONTEND_URL", "{FRONTEND_URL}/auth").format(FRONTEND_URL=FRONTEND_URL)

GOOGLE_OAUTH2_CLIENT_ID=getenv("GOOGLE_OAUTH2_CLIENT_ID", "")
GOOGLE_OAUTH2_CLIENT_SECRET=getenv("GOOGLE_OAUTH2_CLIENT_SECRET", "")
GOOGLE_OAUTH2_REDIRECT_URI=getenv("GOOGLE_OAUTH2_REDIRECT_URI", "{APP_URL}/oauth2callback").format(APP_URL=APP_URL)
GOOGLE_OAUTH2_SCOPE=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

EXTRA_ALLOWED_HOSTS=['127.0.0.1', '.vercel.app']