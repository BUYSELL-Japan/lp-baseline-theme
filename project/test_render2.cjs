const React = require('react');
const ReactDOMServer = require('react-dom/server');

const ThemeWarmStorePage = require('./out.cjs').default;

const mockPageData = {
  header: { logo: { text: "Test Logo" } },
  hero: { title: "Test Hero" },
  menu: { sectionTitle: "Menu", items: [{ name: 'A', price: 100 }] },
  storeInfo: { sectionTitle: "Store Info", items: [{ title: 'X', content: 'Y' }] },
  footer: { social: { title: "Social" }, businessHours: { title: "Hours", days: "Mon", hours: "9-5" } },
  contact: { sectionTitle: "Contact" },
  about: { title: 'About', description: 'Desc', features: [] },
  pricing: { sectionTitle: 'Pricing', plans: [{name: 'Plan', price: '10'}] },
  cta: { title: 'CTA', buttons: [{text: 'Btn', type: 'primary'}] },
  gallery: { sectionTitle: 'Gallery', images: [{url: 'img'}] },
  staff: { sectionTitle: 'Staff', members: [{name: 'John'}] },
  news: { sectionTitle: 'News', items: [{title: 'News'}] },
  company: { sectionTitle: 'Company', philosophy: 'Phil', history: { title: 'H', timeline: [{year: '20', event: 'E'}] }, companyInfo: { title: 'I', items: [{label: 'L', value: 'V'}] } },
  access: { sectionTitle: 'Access', address: 'Addr' },
  faq: { sectionTitle: 'FAQ', items: [{question: 'Q', answer: 'A'}] }
};

try {
  const html = ReactDOMServer.renderToString(
    React.createElement(ThemeWarmStorePage, { pageData: mockPageData, initialLanguage: 'ja', basePath: '/' })
  );
  console.log("RENDER SUCCESS. HTML length:", html.length);
} catch (err) {
  console.error("RENDER FAILED:", err);
}
