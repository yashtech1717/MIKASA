# 🎬 MIKASA - Cinematic Sanctuary & Reel Production Suite

An ultra-luxury, high-performance web experience featuring multi-role authentication, Instagram-style vertical reel streaming with click-to-reveal cinema mechanics, floating transparent glass typography (no box background), Glory login activity audits, and Supabase cloud synchronization.

Built for deployment on **Render** with Git integration via **`YASHTECH1717/MIKASA`**.

---

## ✨ Features & Architecture

### 1. 🎭 Dual-Role Authentication & Access Control
- **Yash Admin Studio**:
  - **Username:** `yash`
  - **Password:** `yashadmin123`
  - Access to the full Creator Studio: Multi-reel manager (add up to N reels, edit, batch upload, delete), direct replies inbox with context attribution, Glory login audit history, and Supabase cloud settings.
- **Glory VIP Experience**:
  - **Username:** `glory` (or `Glory`)
  - **Password:** `lory`
  - 5-second cinematic countdown sequence on sign-in, followed by an Instagram-style vertical reel feed with smooth 1-by-1 snapping transitions, floating cinema glass typography, sound toggles, and direct reply capability.

### 2. 🎬 Vertical Reel Feed (1-by-1 Instagram Experience)
- **Smooth 1-by-1 transitions**: Discrete wheel and touch-swipe physics snap directly to the next or previous reel without runaway scrolling.
- **Floating Cinema Glass Typography**: Pure luminous transparent glass text with deep drop-shadows floating over the video—**no box background, border, or card container**.
- **Click-to-Reveal Cinema Flow**: Reels first showcase the dramatic floating text; tapping reveals the centered theater stage and smoothly unpauses high-fidelity audio/video.
- **Optional Video Media**: Supports video reels (MP4, WebM) or pure text-only luxury cinema cards.

### 3. 🕒 Glory Login Audit History
- Automatically records the exact date, time, relative time (`Just now`, `5m ago`), and device type (iOS, Android, Windows, Mac, browser) every time Glory signs in.
- Full audit list and last sign-in highlight card displayed in the Admin Dashboard.

### 4. 💌 Glory Direct Replies with Context
- When Glory replies from her feed, the message records the exact reel number, title, and quote preview so Yash knows exactly what reel inspired her response.

### 5. ☁️ Supabase Cloud Database & Storage
- Dual-tier storage: Instant zero-latency IndexedDB local caching paired with asynchronous cloud persistence (`reels`, `glory_replies`, `glory_logins`, and `reels-videos` storage bucket).
- Run `supabase_schema.sql` in your Supabase SQL Editor for instantaneous table and storage bucket creation.

### 6. 🚀 Production Zero-Lag Streaming Server (`server.js`)
- Zero-dependency Node.js HTTP server supporting HTTP Range requests (`206 Partial Content`) for buffer-free video seeking on mobile Safari and Chrome.

---

## 🛠️ Deployment Instructions

### 1. Push to GitHub (`YASHTECH1717/MIKASA`)
```bash
git init
git remote add origin https://github.com/YASHTECH1717/MIKASA.git
git add .
git commit -m "feat: complete cinematic sanctuary with reels studio, glory login audits & supabase cloud"
git branch -M main
git push -u origin main
```

### 2. Deploy to Render
1. Go to [render.com](https://render.com) and log in.
2. Click **New +** → **Web Service**.
3. Select your GitHub repository: `YASHTECH1717/MIKASA`.
4. Render will automatically detect `render.yaml` or you can specify:
   - **Environment:** Node
   - **Build Command:** `npm install` (or leave empty)
   - **Start Command:** `node server.js`
5. Click **Create Web Service**. Your app is live with SSL!

### 3. Connect Supabase (Optional for Cloud Sync)
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and paste the contents of `supabase_schema.sql`, then click **Run**.
3. In the Yash Admin Studio under the **☁️ Supabase Cloud & Deploy** tab, enter your Project URL and Anon API Key, then click **Save & Connect Supabase**.
