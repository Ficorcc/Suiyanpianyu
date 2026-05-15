const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const thoughtsDirectory = path.join(process.cwd(), 'md', 'thoughts');

console.log('=== Thoughts Directory ===');
console.log('Path:', thoughtsDirectory);
console.log('Exists:', fs.existsSync(thoughtsDirectory));

const fileNames = fs.readdirSync(thoughtsDirectory);
console.log('\n=== Files found:', fileNames.length, '===\n');

const allThoughtsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const filePath = path.join(thoughtsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContent);

    const content = matterResult.content.trim();
    
    const thoughtData = {
        id,
        ...matterResult.data,
        content,
        type: 'thought',
    };

    // 处理时间字段
    if (thoughtData.time && typeof thoughtData.time !== 'string') {
        thoughtData.time = String(thoughtData.time);
    } else if (thoughtData.time === undefined) {
        if (thoughtData.timestamp) {
            thoughtData.time = typeof thoughtData.timestamp === 'string' ? thoughtData.timestamp : String(thoughtData.timestamp);
            delete thoughtData.timestamp;
        } else {
            thoughtData.time = '';
        }
    } else if (thoughtData.timestamp) {
        delete thoughtData.timestamp;
    }

    return thoughtData;
});

// 排序前
console.log('=== Before Sort ===');
allThoughtsData.forEach((t, i) => {
    console.log(`${i}: ${t.id} - time: ${t.time} - content preview: "${t.content.substring(0, 30)}..."`);
});

// 排序
const sorted = allThoughtsData.sort((a, b) => {
    if (!a.time || !b.time) return 0;
    return new Date(b.time).getTime() - new Date(a.time).getTime();
});

console.log('\n=== After Sort (Latest 5) ===');
sorted.slice(0, 5).forEach((t, i) => {
    const date = new Date(t.time);
    const isValid = !isNaN(date.getTime());
    console.log(`${i}: ${t.id}`);
    console.log(`   time: ${t.time} (valid: ${isValid})`);
    console.log(`   content: "${t.content}"`);
    console.log('   ---');
});

console.log('\n=== Latest Thought Full Content ===');
console.log('ID:', sorted[0].id);
console.log('Time:', sorted[0].time);
console.log('Content:', JSON.stringify(sorted[0].content));
