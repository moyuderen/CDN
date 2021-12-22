'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utils = require('../../utils/utils');

const Controller = require('egg').Controller;

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    // 需要前往 config/config.default.js 设置 config.multipart 的 mode 属性为 file
    // console.log(ctx.request.files);

    // 声明存放资源的路径
    // console.log(ctx.request.files);
    const { bucket = 'bucket' } = ctx.request.body;
    const file = ctx.request.files[0];
    try {
      const dir = path.join(this.config.uploadDir, bucket);
      await mkdirp(dir); // 不存在就创建目录
      await utils.sleep();
      try {
        await checkFileExisting(dir, file.filename);
      } catch (e) {
        console.log(e);
        ctx.body = {
          code: -1,
          msg: `已存在${file.filename}文件`,
          data: file.filename,
        };
        return;
      }

      //   返回图片保存的路径;
      const uploadDir = path.join(dir, file.filename);
      //   写入文件夹;
      fs.writeFileSync(uploadDir, file.encoding);
    } finally {
      // 清除临时文件
      ctx.cleanupRequestFiles();
    }

    ctx.body = {
      code: 0,
      msg: `${file.filename}上传成功`,
      data: file.filename,
    };
  }

  async getBuckets() {
    const { ctx } = this;
    const dirs = [];
    const dirfiles = [];

    function readdirs(entry) {
      return new Promise((resolve, reject) => {
        const dirInfo = fs.readdirSync(entry);
        dirInfo.forEach(item => {
          const location = path.join(entry, item);
          const info = fs.statSync(location);
          if (info.isDirectory()) {
            // console.log(`dir: ${location}`);
            dirs.push(location);
            readdirs(location);
          } else {
            // console.log(`file: ${location}`);
            dirfiles.push(location);
          }
        });

        resolve([ dirs, dirfiles ]);
      });
    }

    const [ alldirs = dirs, allfiles = dirfiles ] = await readdirs(this.config.uploadDir);

    const prefix = this.config.uploadDir + '/';

    function getTree(list) {
      let bucketArr = list.map(item => {
        return item.slice(prefix.length);
      });


      let options = [];
      bucketArr = bucketArr.map(item => {
        return item.split('/');
      });

      bucketArr.forEach(bucketItems => {
        for (let i = 0; i < bucketItems.length; i++) {
          options.push({
            value: bucketItems[i],
            label: bucketItems[i],
            children: [],
            pid: bucketItems[i - 1] ? bucketItems[i - 1] : 'root',
            isLast: !bucketItems[i + 1],
          });
        }
      });

      options = utils.unique(options);
      const tree = utils.listToTree(options);
      return tree;
    }

    const dirTree = getTree(alldirs);
    const fileTree = getTree(allfiles);

    ctx.body = {
      code: 0,
      msg: '成功',
      data: {
        prefix,
        dirs: alldirs,
        files: allfiles,
        dirTree,
        fileTree,
      },
    };
  }
}


function checkFileExisting(dir, filename) {
  return new Promise((resolve, rejcet) => {
    fs.readdir(dir, function(err, paths) {
      if (err) {
        rejcet(err);
      }
      if (paths) {
        if (paths.includes(filename)) {
          rejcet(filename);
        }
        resolve();
      }
    });
  });
}

module.exports = UploadController;
