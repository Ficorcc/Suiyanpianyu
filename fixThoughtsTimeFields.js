const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const thoughtsDirectory = path.join(__dirname, 'md', 'thoughts');

// 遍历thoughts目录下的所有文件
function fixThoughtsTimeFields() {
    if (!fs.existsSync(thoughtsDirectory)) {
        console.error('Thoughts directory not found!');
        return;
    }

    const files = fs.readdirSync(thoughtsDirectory);
    
    files.forEach(fileName => {
        // 只处理.md文件
        if (fileName.endsWith('.md')) {
            const filePath = path.join(thoughtsDirectory, fileName);
            console.log(`Processing file: ${filePath}`);
            
            try {
                // 读取文件内容
                const content = fs.readFileSync(filePath, 'utf8');
                
                // 解析frontmatter
                const { data, content: body } = matter(content);
                
                // 检查是否有time字段
                if (data.time) {
                    // 检查time字段的格式
                    const timeString = String(data.time);
                    console.log(`Current time: ${timeString}`);
                    
                    // 尝试解析日期
                    const date = new Date(timeString);
                    if (!isNaN(date.getTime())) {
                        // 格式化为ISO 8601格式
                        const isoTime = date.toISOString();
                        console.log(`Formatted time: ${isoTime}`);
                        
                        // 更新time字段
                        data.time = isoTime;
                        console.log(`Updated time field in: ${fileName}`);
                    } else {
                        console.error(`Invalid time format in: ${fileName}`);
                    }
                } else {
                    // 尝试从文件名中提取时间
                    const timeFromFileName = fileName.replace('.md', '');
                    console.log(`Extracting time from filename: ${timeFromFileName}`);
                    
                    // 解析文件名中的时间（格式：YYYY-MM-DD-HH-mm-ss）
                    const timeParts = timeFromFileName.split('-');
                    if (timeParts.length === 6) {
                        const [year, month, day, hour, minute, second] = timeParts;
                        const isoTime = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
                        console.log(`Formatted time from filename: ${isoTime}`);
                        
                        // 添加time字段
                        data.time = isoTime;
                        console.log(`Added time field to: ${fileName}`);
                    } else {
                        console.error(`Invalid filename format in: ${fileName}`);
                    }
                }
                
                // 确保author字段为Ficor
                if (data.author !== 'Ficor') {
                    data.author = 'Ficor';
                    console.log(`Updated author field to: ${fileName}`);
                }
                
                // 重新生成文件内容
                const updatedContent = matter.stringify(body, data);
                
                // 写回文件
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Updated file: ${fileName}`);
                
            } catch (error) {
                console.error(`Error processing file ${fileName}:`, error);
            }
        }
    });
    
    console.log('\nThoughts time field fix completed!');
}

// 执行修复
fixThoughtsTimeFields();
