import { crawlNews } from './crawler';
import { processArticles } from './ai-processor';
import { publishArticles } from './publisher';
import { shouldPublish, getPublishQuota } from './scheduler';
import type { RawArticle } from './crawler';
import type { ProcessedArticle } from './ai-processor';

// 主流程
export async function runNewsAutomation(): Promise<void> {
  console.log('🚀 Starting news automation...');
  console.log(`⏰ ${new Date().toLocaleString()} (UTC)`);
  console.log(`🌏 Beijing Time: ${new Date(Date.now() + 8 * 60 * 60 * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);

  try {
    // 1. 检查是否应该发布（时间窗口 + 每日限额）
    const publishCheck = await shouldPublish();
    console.log(`\n📋 Publish check: ${publishCheck.reason}`);
    console.log(`   Remaining quota: ${publishCheck.remaining}`);

    if (!publishCheck.should) {
      console.log('⏹️ Skipping automation:', publishCheck.reason);
      return;
    }

    // 2. 抓取新闻
    const rawArticles = await crawlNews();
    if (rawArticles.length === 0) {
      console.log('📭 No new articles found');
      return;
    }

    // 3. 根据剩余配额限制处理数量
    const quota = await getPublishQuota();
    const articlesToProcess = rawArticles.slice(0, quota);
    console.log(`\n📝 Processing ${articlesToProcess.length} articles (quota: ${quota})`);

    // 4. AI 处理
    const processedArticles = await processArticles(articlesToProcess);
    if (processedArticles.length === 0) {
      console.log('❌ Article processing failed');
      return;
    }

    // 5. 构建 sourceMap
    const sourceMap = new Map<string, { url: string; name: string; imageUrl?: string }>();
    articlesToProcess.forEach((raw, index) => {
      if (processedArticles[index]) {
        sourceMap.set(processedArticles[index].title.zh, {
          url: raw.link,
          name: raw.source,
          imageUrl: raw.imageUrl,
        });
      }
    });

    // 6. 发布到 Sanity
    const published = await publishArticles(processedArticles, sourceMap);

    console.log('\n📊 Summary:');
    console.log(`  Crawled: ${rawArticles.length}`);
    console.log(`  Processed: ${processedArticles.length}`);
    console.log(`  Published: ${published}`);
    console.log(`  Remaining quota: ${quota - published}`);

  } catch (error) {
    console.error('💥 Automation failed:', error);
    throw error;
  }
}

// 如果是直接运行此文件
if (require.main === module) {
  runNewsAutomation()
    .then(() => {
      console.log('✅ Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}
