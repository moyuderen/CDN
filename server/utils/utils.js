'use strict';

module.exports = {
  unique(arr) {
    if (!Array.isArray(arr)) {
      console.log('type error!');
      return;
    }
    const res = [],
      obj = {};
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i].value] || arr[i].isLast) {
        res.push(arr[i]);
        obj[arr[i].value] = 1;
      } else {
        obj[arr[i].value]++;
      }
    }
    return res;
  },

  listToTree(list) {
    const map = {};
    let node;
    const tree = [];
    let i;

    for (i = 0; i < list.length; i++) {
      map[list[i].value] = list[i];
      list[i].children = [];
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.pid !== 'root') {
        map[node.pid].children.push(node);
      } else {
        tree.push(node);
      }
    }
    return tree;
  },

  sleep(time = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  },
};

