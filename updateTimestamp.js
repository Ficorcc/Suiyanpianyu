const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const mdDirectory = path.join(__dirname, 'md');

// 遍历md目录下的所有文件
function updateTimestampToTime() {
    const files = fs.readdirSync(mdDirectory);
    
    files.forEach(fileName => {
        // 只处理.md文件
        if (fileName.endsWith('.md')) {
            const filePath = path.join(mdDirectory, fileName);
            console.log(`Processing file: ${filePath}`);
            
            try {
                // 读取文件内容
                const content = fs.readFileSync(filePath, 'utf8');
                
                // 解析frontmatter
                const { data, content: body } = matter(content);
                
                // 检查是否有timestamp字段
                if (data.timestamp && !data.time) {
                    // 将timestamp字段的值赋给time字段
                    data.time = data.timestamp;
                    // 删除timestamp字段
                    delete data.timestamp;
                    
                    // 重新生成文件内容
                    const updatedContent = matter.stringify(body, data);
                    
                    // 写回文件
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    console.log(`Updated file: ${fileName}`);
                } else if (data.timestamp && data.time) {
                    // 如果同时有timestamp和time字段，删除timestamp字段
                    delete data.timestamp;
                    const updatedContent = matter.stringify(body, data);
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    console.log(`Removed redundant timestamp from: ${fileName}`);
                } else {
                    console.log(`No timestamp field in: ${fileName}`);
                }
            } catch (error) {
                console.error(`Error processing file ${fileName}:`, error);
            }
        }
    });
    
    console.log('\nTimestamp to time field update completed!');
}

// 执行更新
updateTimestampToTime();
