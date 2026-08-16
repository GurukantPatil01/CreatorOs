const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const screenshotsDir = path.join(__dirname, '..', 'SCREENSHOTS');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  // Set 3:2 aspect ratio viewport (1200 x 800)
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2, // High DPI / Retina clarity
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000 ...');

  // 1. Landing Page
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '01_landing_hero.png') });
    console.log('Captured 01_landing_hero.png');
  } catch (err) {
    console.error('Error capturing landing:', err);
  }

  // 2. Dashboard Overview
  try {
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotsDir, '02_dashboard_overview.png') });
    console.log('Captured 02_dashboard_overview.png');
  } catch (err) {
    console.error('Error capturing dashboard:', err);
  }

  // 3. Campaign Stepper Upload
  try {
    await page.goto('http://localhost:3000/campaigns/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '03_create_campaign_stepper.png') });
    console.log('Captured 03_create_campaign_stepper.png');
  } catch (err) {
    console.error('Error capturing stepper upload:', err);
  }

  // 4. Calendar Page
  try {
    await page.goto('http://localhost:3000/calendar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '05_scheduled_calendar.png') });
    console.log('Captured 05_scheduled_calendar.png');
  } catch (err) {
    console.error('Error capturing calendar:', err);
  }

  // 5. Analytics Page
  try {
    await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '06_analytics_dashboard.png') });
    console.log('Captured 06_analytics_dashboard.png');
  } catch (err) {
    console.error('Error capturing analytics:', err);
  }

  await browser.close();
  console.log('All screenshots captured successfully in SCREENSHOTS directory!');
}

captureScreenshots().catch(console.error);
