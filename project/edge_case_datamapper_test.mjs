// dataMapper.ts (実ファイル)を直接importして、エッジケースが実際のパイプラインで
// 正しく処理されるか検証する。ハンドコピーではなく本物の実装をテストする。
import { mapDynamoDBDataToPageData } from './src/services/dataMapper.ts';

let pass = 0, fail = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  ok ? pass++ : fail++;
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${label}`);
  if (!ok) console.log(`         actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`);
}

console.log('==================================================================');
console.log(' エッジケース1: タイトルが全角スペースのみ(News: items実データあり)');
console.log('==================================================================');
{
  const raw = { header: {},
    news: {
      sectionTitle: { ja: '　', en: '　', ko: '　', 'zh-tw': '　' },
      items: [
        { date: '2024-01-01', category: 'お知らせ', title: { ja: '新年営業開始', en: 'New Year' }, content: { ja: '本年もよろしくお願いします', en: 'Happy new year' } }
      ]
    }
  };
  const result = mapDynamoDBDataToPageData(raw);
  // isSectionEmptyはセクション「全体」が空かどうかの粗い判定であり、items に実データがある限り
  // ここではnullにならない(意図通り)。「タイトルだけ空白」の非表示判定はコンポーネント層
  // (useLocalize.getText の trim)の役割 → verify_edge_cases.mjs でブラウザ実描画を確認する。
  check('dataMapper passes data through (title-blank-but-items-exist is the component layer\'s job, not dataMapper\'s)', result.news !== null, true);
  check('sectionTitle remains whitespace-only in passthrough data (component layer will hide it)', result.news?.sectionTitle?.ja, '　');
}

console.log('\n==================================================================');
console.log(' エッジケース2: success:true 等のメタ残骸のみでテキストが全空(CTA)');
console.log('==================================================================');
{
  const raw = { header: {},
    cta: {
      success: true,
      storeId: 'teststore',
      section: 'cta',
      sectionTitle: { ja: '', en: '' },
      sectionSubtitle: { ja: '', en: '' },
      description: { ja: '', en: '' },
      buttons: []
    }
  };
  const result = mapDynamoDBDataToPageData(raw);
  check('cta section is hidden (null) when only metadata residue remains', result.cta, null);
}

console.log('\n==================================================================');
console.log(' エッジケース3: 数値(rating等)の残骸のみでテキストが全空(Access)');
console.log('==================================================================');
{
  const raw = { header: {},
    access: {
      sectionTitle: { ja: '', en: '' },
      sectionSubtitle: { ja: '', en: '' },
      address: { ja: '', en: '' },
      rating: 5,
      isPopular: true,
    }
  };
  const result = mapDynamoDBDataToPageData(raw);
  check('access section is hidden (null) when only numeric/boolean residue remains', result.access, null);
}

console.log('\n==================================================================');
console.log(' 回帰確認: 正常なコンテンツを持つセクションが誤って非表示にならないか');
console.log('==================================================================');
{
  const raw = { header: {},
    news: {
      sectionTitle: { ja: 'お知らせ', en: 'News' },
      sectionSubtitle: { ja: '最新情報', en: 'Latest' },
      items: [
        { date: '2024-01-01', category: 'お知らせ', title: { ja: '新年営業開始', en: 'New Year' }, content: { ja: '本年もよろしくお願いします', en: 'Happy new year' } }
      ]
    },
    cta: {
      sectionTitle: { ja: 'ご予約はこちら', en: 'Reserve Now' },
      sectionSubtitle: { ja: 'お気軽にどうぞ', en: 'Feel free' },
      description: { ja: 'お待ちしております', en: 'We look forward to it' },
      buttons: [{ type: 'primary', text: { ja: '予約する', en: 'Book' }, link: 'tel:0312345678' }]
    },
    access: {
      sectionTitle: { ja: 'アクセス', en: 'Access' },
      address: { ja: '東京都渋谷区1-2-3', en: '1-2-3 Shibuya, Tokyo' },
      mapEmbedUrl: 'https://maps.google.com/embed?x=1'
    },
    gallery: {
      sectionTitle: { ja: 'ギャラリー', en: 'Gallery' },
      images: [{ url: 'https://lp-store-images.s3.amazonaws.com/photo1.jpg', caption: { ja: '店内の様子', en: 'Interior' } }]
    }
  };
  const result = mapDynamoDBDataToPageData(raw);
  check('news with real content is NOT hidden', result.news !== null, true);
  check('cta with real content is NOT hidden', result.cta !== null, true);
  check('access with real content is NOT hidden', result.access !== null, true);
  check('gallery with real content is NOT hidden', result.gallery !== null, true);
  check('news sectionTitle survives correctly', result.news?.sectionTitle?.ja, 'お知らせ');
  check('cta buttons array survives correctly (length)', result.cta?.buttons?.length, 1);
}

console.log('\n==================================================================');
console.log(' エッジケース4: 画像URLだけ残して他は空欄(Gallery: キャプション/カテゴリ空)');
console.log('==================================================================');
{
  const raw = { header: {},
    gallery: {
      sectionTitle: { ja: 'ギャラリー', en: 'Gallery' },
      images: [
        { url: 'https://lp-store-images.s3.amazonaws.com/photo1.jpg', caption: { ja: '', en: '' }, category: { ja: '', en: '' } }
      ]
    }
  };
  const result = mapDynamoDBDataToPageData(raw);
  check('gallery section with image-only item is NOT hidden (image itself is valid content)', result.gallery !== null, true);
  check('gallery image url preserved', result.gallery?.images?.[0]?.url, 'https://lp-store-images.s3.amazonaws.com/photo1.jpg');
  check('gallery image caption is empty (not a fake placeholder)', result.gallery?.images?.[0]?.caption?.ja, '');
}

console.log(`\n合計: ${pass} PASS / ${fail} FAIL`);
if (fail > 0) process.exit(1);
