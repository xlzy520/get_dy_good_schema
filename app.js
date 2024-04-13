const path = require('path');
const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const app = express();
const dayjs = require('dayjs');


const upload = multer({ dest: 'uploads/' });

const currentTime = new Date().toLocaleString();

app.use(express.static('public'));

app.get('/', function(req, res) {
  // 发送HTML文件
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 从字符串中提取schema
const getSchema = (string) => {
  const schemaIndex = string.indexOf('sslocal://');
  const schema = string.slice(schemaIndex, string.indexOf("'", schemaIndex));
  return schema;
};


app.get('/upload', (req, res) => {
  const program = spawn('test.exe');
  // const imagePath = req.file.path; // 获取上传文件的路径
  
  // const imagePath = path.join(__dirname, '222.jpg');
  const imagePath = req.file.path; // 获取上传文件的路径
  
  program.stdout.on('data', (data) => {
    console.log(`${currentTime} 输出: ${data}`);
    if (data.toString().includes('sta')) {
      const result = data.toString()
      const schema = getSchema(result);
      res.send({
        schema,
        now: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }); // 将程序返回的信息发送给客户端
      program.kill();
    }
  });
  
  program.stderr.on('data', (data) => {
    console.error(`错误: ${data}`);
    res.status(500).send(data); // 发生错误时，将错误信息发送给客户端
  });
  
  program.stdin.write(imagePath + '\n');
});


// const getLicense = (key) => {
//   return axios.get('https://wj.xlzy520.cn/license/bind', {
//
//   }
//
// }

const LicenseMap = {
  'bqqysv28vkh': {
    name: '鱼跃传媒',
  },
  h37yljwdqip:{
    name: '铁蛋',
  },
  '2smw1w0pncf':{
    name: '用户1',
  },
  'vecxuskt4n':{
    name: '用户2',
  },
  '8jyppjieqqh':{
    name: '用户3',
  },
  'p53axgvr5g':{
    name: '用户4',
  },
}


// 实现一个Map，要求每个key，每天最多只能上传300次，超过300次则返回错误信息。每天0点清空Map
const uploadMap = new Map();

setInterval(() => {
  // 每天0点30分清空Map
  const currentHour = dayjs().format('HH');
  const currentMinute = dayjs().format('mm');
  if (currentHour === '00' && currentMinute <30){
    uploadMap.clear();
  }
}, 10 * 60 * 1000);

app.get('/clear', (req, res) => {
  const { key } = req.query;
  if (!key) {
    uploadMap.clear();
  } else {
    uploadMap.delete(key);
  }
  res.send('清空成功');
})

// 对象输出uploadMap
app.get('/uploadMap', (req, res) => {
  res.send(Object.fromEntries(uploadMap));
});

app.post('/upload', upload.single('image'), (req, res) => {
  const { key } = req.body;
  if (!key) {
    res.status(500).send({
      message: 'key错误',
    });
    return;
  }
  
  if (!LicenseMap[key]) {
    res.status(500).send({
      message: 'key错误',
    });
    return;
  }
  
  if (!uploadMap.has(key)) {
    uploadMap.set(key, 1);
  } else {
    uploadMap.set(key, uploadMap.get(key) + 1);
  }
  
 
  
  if (uploadMap.get(key) > 4) {
    res.status(500).send('上传次数超过限制，请联系gpt');
    return;
  }
  // res.send({
  //   schema: 'sslocal://polaris/proxy?enter_from=qrcode&invite_from=qrcode&invite_token=sta1-NNQgxwSMPVOSHhcaiz0JWJTauuKceasal3JB3OdH8c_6SnawW-nZQ930_jDJaaOQvDlNZBbUlTyBGKoitlTPpR8cZe453N22IJwQ1CmrqmJtr6L7B5rEuHFaQAdI_8n-Uu4BEm44kMKLb2jefseVVQ&polaris_share_timestamp=onecent_bargain_invite_2329_1712934403125753826&scene_key=main&ug_activity_id=onecent_bargain&allow_pending_ms=5000',
  //   now: dayjs().format('YYYY-MM-DD HH:mm:ss')
  // });
  //
  // return;
  
  const program = spawn('test.exe');
  const imagePath = req.file.path; // 获取上传文件的路径
  
  program.stdout.on('data', (data) => {
    console.log(`${currentTime} 输出: ${data}`);
    if (data.toString().includes('sta')) {
      const result = data.toString()
      const schema = getSchema(result);
      res.send({
        schema,
        now: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }); // 将程序返回的信息发送给客户端
      program.kill();
    }
  });
  
  program.stderr.on('data', (data) => {
    console.error(`错误: ${data}`);
    res.status(500).send(data); // 发生错误时，将错误信息发送给客户端
  });
  
  program.stdin.write(imagePath + '\n');
});

app.listen(5005, () => {
  console.log('Server started on port 5005');
});
