import { allCatalogProblems } from './problems/index.js';

export function validateDataset(): { valid: boolean; errors: string[]; stats: any } {
  const errors: string[] = [];
  const numbersSeen = new Set<number>();
  const slugsSeen = new Set<string>();

  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  const topicCounts: Record<string, number> = {};
  const patternCounts: Record<string, number> = {};

  for (let idx = 0; idx < allCatalogProblems.length; idx++) {
    const p = allCatalogProblems[idx];
    const prefix = `[Problem #${p.number || idx + 1} "${p.title || 'Untitled'}"]`;

    // Identity Checks
    if (typeof p.number !== 'number' || p.number <= 0) {
      errors.push(`${prefix} Invalid or missing number: ${p.number}`);
    } else if (numbersSeen.has(p.number)) {
      errors.push(`${prefix} Duplicate problem number detected: ${p.number}`);
    } else {
      numbersSeen.add(p.number);
    }

    if (!p.title || typeof p.title !== 'string' || p.title.trim() === '') {
      errors.push(`${prefix} Missing or empty title`);
    }

    if (!p.slug || typeof p.slug !== 'string' || !/^[a-z0-9-]+$/.test(p.slug)) {
      errors.push(`${prefix} Invalid or malformed slug: "${p.slug}"`);
    } else if (slugsSeen.has(p.slug)) {
      errors.push(`${prefix} Duplicate slug detected: "${p.slug}"`);
    } else {
      slugsSeen.add(p.slug);
    }

    // Classification
    if (!['Easy', 'Medium', 'Hard'].includes(p.difficulty)) {
      errors.push(`${prefix} Invalid difficulty: "${p.difficulty}". Must be Easy, Medium, or Hard.`);
    } else {
      if (p.difficulty === 'Easy') easyCount++;
      if (p.difficulty === 'Medium') mediumCount++;
      if (p.difficulty === 'Hard') hardCount++;
    }

    if (!p.leetcodeUrl || !p.leetcodeUrl.startsWith('https://leetcode.com/problems/')) {
      errors.push(`${prefix} Invalid LeetCode URL: "${p.leetcodeUrl}"`);
    }

    if (!Array.isArray(p.topics) || p.topics.length === 0) {
      errors.push(`${prefix} Missing or empty topics array`);
    } else {
      p.topics.forEach((t: string) => topicCounts[t] = (topicCounts[t] || 0) + 1);
    }

    if (!Array.isArray(p.patterns) || p.patterns.length === 0) {
      errors.push(`${prefix} Missing or empty patterns array`);
    } else {
      p.patterns.forEach((pt: string) => patternCounts[pt] = (patternCounts[pt] || 0) + 1);
    }

    // Content
    if (!p.description || p.description.trim() === '') {
      errors.push(`${prefix} Missing description`);
    }

    if (!Array.isArray(p.examples) || p.examples.length === 0) {
      errors.push(`${prefix} Missing or empty examples array`);
    }

    if (!Array.isArray(p.approaches) || p.approaches.length === 0) {
      errors.push(`${prefix} Missing approaches array`);
    }
  }

  const valid = errors.length === 0;
  const stats = {
    total: allCatalogProblems.length,
    uniqueNumbers: numbersSeen.size,
    uniqueSlugs: slugsSeen.size,
    easyCount,
    mediumCount,
    hardCount,
    topicCounts,
    patternCounts,
  };

  return { valid, errors, stats };
}

if (process.argv[1] && process.argv[1].endsWith('validateProblems.ts')) {
  console.log('=== RUNNING PROBLEM DATASET VALIDATION ===\n');
  const result = validateDataset();

  if (result.valid) {
    console.log(`✅ [Validation Passed] All ${result.stats.total} problem records are valid!`);
    console.log(`- Unique Numbers: ${result.stats.uniqueNumbers}`);
    console.log(`- Unique Slugs: ${result.stats.uniqueSlugs}`);
    console.log(`- Easy: ${result.stats.easyCount} | Medium: ${result.stats.mediumCount} | Hard: ${result.stats.hardCount}`);
    console.log(`- Core Topics Covered: ${Object.keys(result.stats.topicCounts).length}`);
    console.log(`- Algorithmic Patterns Covered: ${Object.keys(result.stats.patternCounts).length}`);
  } else {
    console.error(`❌ [Validation Failed] Found ${result.errors.length} validation errors:`);
    result.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
}
