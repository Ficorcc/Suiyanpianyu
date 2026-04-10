const fs = require('fs');
const path = require('path');

const THOUGHTS_DIR = path.join('./md', 'thoughts');

// 获取UTC+8时间的函数
const getUTC8Time = () => {
  const now = new Date();
  // 转换为UTC+8时间
  const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return utc8Time;
};

const createFileDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createThought = (content = '我的片语...') => {
  const create_time = getUTC8Time().toISOString();
  const pagename = getUTC8Time().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

  const thoughtFilePath = path.join(THOUGHTS_DIR, `${pagename}.md`);

  createFileDir(path.dirname(thoughtFilePath));

  const thoughtContent = `---
type: thought
timestamp: '${create_time}'
---

${content}
`;

  fs.writeFile(thoughtFilePath, thoughtContent, 'utf8', (err) => {
    if (err) {
      console.error('创建片语文件失败:', err);
    } else {
      console.log('片语创建成功！');
      console.log('文件路径:', thoughtFilePath);

      const { spawn } = require('child_process');
      const child = spawn('code', [thoughtFilePath], {
        shell: true,
        stdio: 'inherit'
      });

      child.on('error', (error) => {
        console.error(`执行错误: ${error.message}`);
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`VS Code 已打开文件: ${thoughtFilePath}`);
        } else {
          console.error(`VS Code 退出，代码: ${code}`);
        }
      });
    }
  });
};

createThought(process.argv[2] || '我的片语...');