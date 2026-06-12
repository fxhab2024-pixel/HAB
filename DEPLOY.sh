#!/bin/bash
set -e

echo "═══════════════════════════════════════════════════"
echo "  🚀 BCGSP - استقرار خودکار در Vercel"
echo "═══════════════════════════════════════════════════"
echo ""

# ---- Step 1: Vercel Token ----
if [ -z "$VERCEL_TOKEN" ]; then
  echo "🔑 مرحله ۱: دریافت Token از Vercel"
  echo "   1. به https://vercel.com/account/tokens بروید"
  echo "   2. روی 'Create Token' کلیک کنید"
  echo "   3. نام: BCGSP-Deploy | Scope: Full Account"
  echo "   4. Token را کپی کنید"
  echo ""
  read -p "   Token را اینجا وارد کنید: " VERCEL_TOKEN
  export VERCEL_TOKEN
fi

if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ Token الزامی است"
  exit 1
fi

echo "✅ Token دریافت شد"

# ---- Step 2: Deploy to Vercel ----
echo ""
echo "🚀 مرحله ۲: استقرار پروژه در Vercel..."

cd "$(dirname "$0")"

# Deploy using token
DEPLOY_OUTPUT=$(vercel --token "$VERCEL_TOKEN" --yes --prod 2>&1)
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -oP 'https://[a-z0-9-]+\.vercel\.app' | head -1)
PROJECT_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP 'project[^:]*:\s*\K[a-zA-Z0-9]+' | head -1)

echo "$DEPLOY_OUTPUT"

if [ -z "$DEPLOY_URL" ]; then
  echo "❌ استقرار ناموفق بود"
  exit 1
fi

echo "✅ پروژه استقرار یافت: $DEPLOY_URL"

# ---- Step 3: Database ----
echo ""
echo "🗄️  مرحله ۳: تنظیم دیتابیس PostgreSQL"
echo "   گزینه‌ها:"
echo "   1. Neon (رایگان): https://neon.tech/app/signup"
echo "   2. Supabase (رایگان): https://supabase.com/dashboard/signin"
echo ""
read -p "   DATABASE_URL را وارد کنید: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  بدون دیتابیس، سایت کار نمی‌کند. بعداً اضافه کنید."
else
  # Set env vars in Vercel
  echo "⚙️  تنظیم متغیرهای محیطی..."
  
  AUTH_SECRET=$(openssl rand -base64 32)
  
  vercel env add DATABASE_URL production --token "$VERCEL_TOKEN" <<< "$DATABASE_URL" 2>/dev/null || \
  curl -X POST "https://api.vercel.com/v9/projects/${PROJECT_ID}/env" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"DATABASE_URL\",\"value\":\"$DATABASE_URL\",\"type\":\"encrypted\",\"target\":[\"production\"]}" 2>/dev/null
  
  curl -X POST "https://api.vercel.com/v9/projects/${PROJECT_ID}/env" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"AUTH_SECRET\",\"value\":\"$AUTH_SECRET\",\"type\":\"encrypted\",\"target\":[\"production\"]}" 2>/dev/null

  echo "✅ متغیرها تنظیم شدند"
  
  # Redeploy with env vars
  echo "🔄 استقرار مجدد با دیتابیس..."
  vercel --token "$VERCEL_TOKEN" --yes --prod 2>&1 | tail -3
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ استقرار کامل شد!"
echo "  🌐 آدرس سایت: $DEPLOY_URL"
echo "═══════════════════════════════════════════════════"
