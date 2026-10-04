import { chromium } from "playwright";
const b = await chromium.launch();
for (const w of [1280, 1440, 1600]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto("http://localhost:3000/brands", { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const s = document.querySelector("section");
    const panel = s.lastElementChild.getBoundingClientRect();
    return { sectionBottom: s.getBoundingClientRect().bottom, panelTop: panel.top, panelBottom: panel.bottom, nav: document.querySelector("nav, header")?.getBoundingClientRect().height };
  });
  console.log(w, JSON.stringify(r));
}
await b.close();
