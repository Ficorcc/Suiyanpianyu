const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const mdDirectory = path.join(__dirname, 'md');

// 遍历md目录下的所有文件
function addAuthorFields() {
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
                
                // 检查是否有author字段
                if (!data.author) {
                    // 添加author字段，值为Ficor
                    data.author = 'Ficor';
                    console.log(`Added author field to: ${fileName}`);
                    
                    // 重新生成文件内容
                    const updatedContent = matter.stringify(body, data);
                    
                    // 写回文件
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    console.log(`Updated file: ${fileName}`);
                } else {
                    console.log(`Author field already exists in: ${fileName}`);
                }
            } catch (error) {
                console.error(`Error processing file ${fileName}:`, error);
            }
        }
    });
    
    console.log('\nAuthor field addition completed!');
}

// 执行添加
addAuthorFields();
