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
  '8jyppjieqqw':{
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
  '7uxjqwrdm7q': {
    name: 'xiexiaohei'
  },
  'irtr9o8n14': {
    name: 'agf2'
  },
  'ew02p4q7uhh':{
    name: 'tingfeng'
  },
  'g2cpc4m7w5':{
    name: 'LLL'
  },
  '77u95qsl4hq':{
    name: 'DP'
  },
  '91zd2cx6ba':{
    name: 'S'
  },
  'mgieprdrujg':{
    name: 'H.wang'
  },
  'a653oy0a9rl':{
    name: 'xxh2'
  },
  'hbjxj3oqozi': {
    name: 'xiaotu'
  }
  
}

const IPMap = {}


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
  res.send({GlobalData, IPMap});
});

app.get('/schema', async (req, res) => {
  const code = req.query.code;
  const key = req.query.key;
  if (!code) {
    res.status(500).send({
      message: 'code错误',
    });
    return;
  }
  if (!LicenseMap[key]) {
    res.status(500).send({
      message: 'key错误，请联系GPT微信：appl532978',
    });
    return;
  }
  
  let headers = {
    Host: 'api3-normal-c.amemv.com',
    'x-tt-request-tag': 't=1;n=0',
    'x-tt-dt':
      'AAA7YJMBTI6S5Q2DBZTSH3KECZDDCQOSWYSJQC2CJTUROFXL3CVLZEZDUGJBKY2WP5VCGFEAM24NYGC5IUXNBVFWQIIAKEARENKCXV3WEKMXMOW4SCVSBA5KHYJPQ',
    activity_now_client: '1717338345276',
    'x-ss-req-ticket': '1717338434926',
    'x-tt-multi-sids': '4075226948975140%3A6b6985a8fb5dd8097b666380bea193c8',
    'sdk-version': '2',
    'x-tt-token':
      '006b6985a8fb5dd8097b666380bea193c804a2496d6f83686564d052ae9f4cb2d7fb126cb2e35348d188b795d2e820a53af4781bf58b4abf20b280f42bd283da43733ad381232e16c83b9da482548b6789010f6e4ba7e8e06a032d1a4e38dd32de488-1.0.1',
    multi_login: '1',
    'passport-sdk-version': '203214',
    'x-vc-bdturing-sdk-version': '3.7.2.cn',
    'x-tt-store-region': 'cn-hn',
    'x-tt-store-region-src': 'uid',
    'user-agent':
      'com.ss.android.ugc.aweme.lite/300101 (Linux; U; Android 10; zh_CN_#Hans; Pixel 4; Build/QQ2A.200405.005;tt-ok/3.12.13.1)',
  };
  
  let url = 'https://api3-normal-c.amemv.com/aweme/share/carrier/parse/';
  
  let params = {
    carrier_type: '3',
    code_info: code,
    source_from: 'scan',
    klink_egdi: 'AALOYdhUIujTCtPeli80wTsC0FwlUA0OnbubsPs7tH6/qNe2HwwnVBw+',
    iid: '3331957378799338',
    device_id: '2593081627785290',
    ac: 'wifi',
    channel: 'city_YZ_1',
    aid: '2329',
    app_name: 'douyin_lite',
    version_code: '300100',
    version_name: '30.1.0',
    device_platform: 'android',
    os: 'android',
    ssmix: 'a',
    device_type: 'Pixel 4',
    device_brand: 'google',
    language: 'zh',
    os_api: '29',
    os_version: '10',
    openudid: '91766e55bdb0e1f1',
    manifest_version_code: '300101',
    resolution: '1080*2236',
    dpi: '440',
    update_version_code: '30109900',
    _rticket: '1717338434923',
    package: 'com.ss.android.ugc.aweme.lite',
    gold_container: '0',
    first_launch_timestamp: '1717338123',
    last_deeplink_update_version_code: '0',
    cpu_support64: 'true',
    host_abi: 'armeabi-v7a',
    is_guest_mode: '0',
    app_type: 'normal',
    minor_status: '0',
    appTheme: 'light',
    is_preinstall: '0',
    need_personal_recommend: '1',
    is_android_pad: '0',
    is_android_fold: '0',
    ts: '1717338341',
    cdid: '0ad1579b-f09e-4a19-ab0b-d188a2d7864d',
    md: '0',
  };
  
  const data = await axios.get(url, { headers: headers, params: params })
  res.send(data.data);
})

app.get('/ipMap', (req, res) => {
  res.send(IPMap);
})

app.post('/upload', upload.single('image'), (req, res) => {
  const { key } = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.ip;
  if (IPMap[key]) {
    IPMap[key].push(clientIP);
  } else {
    IPMap[key] = [clientIP];
  }
  IPMap[key] = Array.from(new Set(IPMap[key]));
  if (!key) {
    res.status(500).send({
      message: 'key错误，请联系GPT微信：appl532978',
    });
    return;
  }
  
  if (!LicenseMap[key]) {
    res.status(500).send({
      message: 'key错误，请联系GPT微信：appl532978',
    });
    return;
  }
  
  console.log(GlobalData, '===========打印的 ------ ');
  
  if (GlobalData.uploadMap[key] === undefined) {
    GlobalData.uploadMap[key] = 0;
  } else {
    GlobalData.uploadMap[key] += 1;
  }
  
  if (GlobalData.uploadMap[key] > 300) {
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
