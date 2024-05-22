const path = require('path');
const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const app = express();
const dayjs = require('dayjs');
const fs = require('fs-extra');
const axios = require("axios");


// 定义要删除的目录路径
const dirPath = path.join('C:', 'Users', 'Administrator', 'AppData', 'Local', 'Temp', '2');

// 定义删除间隔（单位：毫秒），例如每小时删除一次
const interval = 60 * 60 * 1000;

const deleteGarbage = ()=> {
  try{
    fs.remove(dirPath, error => {
      if (error) {
        console.error(`Failed to delete directory ${dirPath}:`, error);
      } else {
        console.log(`Successfully deleted directory ${dirPath}`);
      }
    });
  } catch(err){
    console.log(err)
  }
  
}


deleteGarbage()
setInterval(() => {
  deleteGarbage()
}, interval);

// Set Storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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

const LicenseMap = {
  h37yljwdqip:{
    name: '铁蛋',
  },
  '2smw1w0pncf':{
    name: '瑜',
  },
  'vecxuskt4u':{
    name: '小沐',
  },
  '8jyppjieqqh':{
    name: 'xiaoxiao',
  },
  'p53axgvr5g':{
    name: 'cong',
  },
  '08qgf7t8go4f':{
    name: '阿洋',
  },
  'bw05171rvyK':{
    name: '杰瑞0520',
  },
  'pmt3d9lut89':{
    name: '同',
  },
  '7ntrrmhgtq5':{
    name: '王星'
  },
  'a6hkvciv3ub':{
    name: '中二'
  },
  'qedk9z3q84':{
    name: '杰瑞3'
  },
  '3x5sp2ycgua':{
    name: 'q1'
  },
  'yv890xzq1o9':{
    name: 'q2'
  },
  'wuatszlagym':{
    name: 'xingxing'
  },
  'ixvq934ctso':{
    name: 'anguifei'
  },
  'e85zal70mvr':{
    name: 'xiaomu2'
  },
  'e74dto6p6k': {
    name: '甜到心里'
  },
  'irtr9o8n14': {
    name: 'agf2'
  },
  '4zmg3g7jab9': {
    name: 'wuqu'
  },
  'ew02p4q7uhh':{
    name: 'tingfeng'
  }
  
}


// 实现一个Map，要求每个key，每天最多只能上传300次，超过300次则返回错误信息。每天0点清空Map
const GlobalData = {
  uploadMap: {},
}

setInterval(() => {
  // 每天0点30分清空Map
  const currentHour = dayjs().format('HH');
  const currentMinute = dayjs().format('mm');
  if (currentHour === '00' && currentMinute <30){
    GlobalData.uploadMap = {}
  }
}, 10 * 60 * 1000);

app.get('/clear', (req, res) => {
  const { key } = req.query;
  if (!key) {
    GlobalData.uploadMap = {}
  } else {
    GlobalData.uploadMap[key] = 0;
  }
  res.send('清空成功');
})

// 对象输出uploadMap
app.get('/uploadMap', (req, res) => {
  res.send(GlobalData);
});

app.get('/dy/proxy', async (req, res) => {
  const code = req.query.code;
  const data = await axios.get('http://w.mcoud.cn/api/eem.php/proxy?code='+code, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; M2007J20CG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36',
      "Origin": "http://w.mcoud.cn",
      "Referer": "http://w.mcoud.cn/",
    }
  })
  res.send({
    schema: data.data.data.schema
  });
})

app.get('/dy_schema', async (req, res) => {
  const code = req.query.code;
  const data = await axios.get('http://w.mcoud.cn/api/eem.php/proxy?code='+code, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; M2007J20CG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36',
      "Origin": "http://w.mcoud.cn",
      "Referer": "http://w.mcoud.cn/",
    }
  })
  res.send(data.data.data.schema);
})

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
  
  console.log(GlobalData, '===========打印的 ------ ');
  
  if (GlobalData.uploadMap[key] === undefined) {
    GlobalData.uploadMap[key] = 0;
  } else {
    GlobalData.uploadMap[key] += 1;
  }
  
  if (GlobalData.uploadMap[key] > 150) {
    res.status(500).send({
      message: '此号超过每天上传次数',
    });
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
    } else if(data.toString().includes('codec')){
      res.status(500).send({
        code: 600
        // message: '由于该用户昵称包含emoji表情，二维码图片解码错误，还在尝试解决',
        // message: '由于该用户昵称包含emoji表情，二维码图片解码错误，还在尝试解决',
      });
      program.kill();
    }
  });
  
  program.stderr.on('data', (data) => {
    console.error(`错误: ${data}`);
    // res.status(500).send(data); // 发生错误时，将错误信息发送给客户端
  });
  
  program.stdin.write(imagePath + '\n');
});

app.listen(5005, () => {
  console.log('Server started on port 5005');
});
