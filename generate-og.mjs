import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const photoPath = path.join(__dirname, 'attached_assets/hong-photo.jpg');
const photoBase64 = `data:image/jpeg;base64,${readFileSync(photoPath).toString('base64')}`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; }
  .wrap {
    width: 1200px; height: 630px;
    background: linear-gradient(135deg, #0b1d4a 0%, #0f2d6b 50%, #091629 100%);
    display: flex; align-items: stretch; position: relative; overflow: hidden;
  }

  /* 배경 장식 */
  .deco-circle1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 65%);
    top: -220px; right: 80px; pointer-events: none;
  }
  .deco-circle2 {
    position: absolute; width: 350px; height: 350px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.07);
    bottom: -160px; left: 20px;
  }
  .deco-line {
    position: absolute; top: 0; left: 460px; width: 1.5px; height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(96,165,250,0.3), transparent);
  }

  /* 사진 영역 */
  .photo-col {
    width: 460px; flex-shrink: 0; position: relative;
    background: linear-gradient(180deg, #0f2d6b 0%, #0b1d4a 100%);
    display: flex; align-items: flex-end; justify-content: center;
    overflow: hidden;
  }
  .photo-col img {
    width: 100%; height: 100%; object-fit: cover; object-position: center top;
    display: block;
    filter: brightness(1.05) contrast(1.05);
  }
  .photo-fade-right {
    position: absolute; top: 0; right: 0; width: 120px; height: 100%;
    background: linear-gradient(to right, transparent, rgba(9,22,41,0.95));
  }
  .photo-fade-bottom {
    position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
    background: linear-gradient(to top, rgba(9,22,41,0.6), transparent);
  }

  /* 콘텐츠 영역 */
  .content {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 55px 65px 55px 55px; position: relative; z-index: 10;
  }

  .site-url {
    position: absolute; top: 28px; right: 65px;
    font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 1.5px;
  }

  .badge {
    display: inline-flex; align-items: center; gap: 9px;
    background: rgba(96,165,250,0.15); border: 1px solid rgba(96,165,250,0.35);
    color: #93c5fd; font-size: 14px; font-weight: 700; letter-spacing: 3px;
    padding: 7px 18px; border-radius: 100px; margin-bottom: 26px; width: fit-content;
  }
  .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #60a5fa; animation: pulse 2s infinite; }

  .title-ko {
    font-size: 70px; font-weight: 900; color: #fff;
    line-height: 1.05; letter-spacing: -2px; margin-bottom: 6px;
  }
  .title-accent { color: #60a5fa; }

  .accent-bar {
    width: 52px; height: 5px; background: linear-gradient(90deg, #3b82f6, #93c5fd);
    border-radius: 3px; margin: 22px 0 24px 0;
  }

  .desc {
    font-size: 22px; color: rgba(255,255,255,0.6);
    line-height: 1.65; margin-bottom: 42px; font-weight: 400;
  }

  .bottom-row {
    display: flex; align-items: center; gap: 20px;
  }
  .name-block {}
  .name-label {
    font-size: 11px; color: rgba(255,255,255,0.35);
    letter-spacing: 3px; font-weight: 400; margin-bottom: 5px; text-transform: uppercase;
  }
  .name {
    font-size: 32px; font-weight: 900; color: #fff; letter-spacing: 7px;
  }
  .name-sub {
    font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 5px; letter-spacing: 1px;
  }
  .divider-v { width: 1.5px; height: 52px; background: rgba(255,255,255,0.15); margin: 0 4px; }
  .more-badge {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white; font-size: 17px; font-weight: 900; letter-spacing: 3px;
    padding: 12px 24px; border-radius: 12px;
    box-shadow: 0 4px 20px rgba(37,99,235,0.4);
  }

  .hashtags {
    position: absolute; bottom: 28px; right: 65px;
    font-size: 12px; color: rgba(255,255,255,0.22); letter-spacing: 1.5px;
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="deco-circle1"></div>
  <div class="deco-circle2"></div>
  <div class="deco-line"></div>

  <div class="photo-col">
    <img src="${photoBase64}" />
    <div class="photo-fade-right"></div>
    <div class="photo-fade-bottom"></div>
  </div>

  <div class="content">
    <div class="site-url">shh7197.com</div>

    <div class="badge">
      <div class="badge-dot"></div>
      신대지구 주민 여러분께
    </div>

    <div class="title-ko">신대지구에게<br><span class="title-accent">묻습니다.</span></div>
    <div class="accent-bar"></div>
    <div class="desc">여러분의 목소리가<br>신대지구의 미래를 만듭니다</div>

    <div class="bottom-row">
      <div class="name-block">
        <div class="name-label">Candidate</div>
        <div class="name">홍 성 훈</div>
        <div class="name-sub">신대지구 MORE 캠페인</div>
      </div>
      <div class="divider-v"></div>
      <div class="more-badge">MORE</div>
    </div>

    <div class="hashtags">#신대지구 &nbsp; #홍성훈 &nbsp; #순천 &nbsp; #발전정책 &nbsp; #시민소통</div>
  </div>
</div>
</body>
</html>`;

console.log('Launching browser...');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(__dirname, 'attached_assets/og-image.png') });
await browser.close();
console.log('✅ OG image generated!');
