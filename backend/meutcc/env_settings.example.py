APP_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"

DB_CONNECTION="sqlite3"
DB_NAME="db"
DB_USER=""
DB_PASSWORD=""
DB_HOST=""
DB_PORT=""

AUTH_FRONTEND_URL="{FRONTEND_URL}/auth?token={token}&data={data}".format(FRONTEND_URL=FRONTEND_URL)
AUTH_ERROR_FRONTEND_URL="{FRONTEND_URL}/auth".format(FRONTEND_URL=FRONTEND_URL)

GOOGLE_OAUTH2_CLIENT_ID=""
GOOGLE_OAUTH2_CLIENT_SECRET=""
GOOGLE_OAUTH2_REDIRECT_URI="${APP_URL}/oauth2callback".format(APP_URL=APP_URL)
GOOGLE_OAUTH2_SCOPE=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']