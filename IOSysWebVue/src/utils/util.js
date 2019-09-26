import CryptoJS from 'crypto-js';

export default {
  AES: {
    //IV
    _AES_IV: 'tangdabinjiushiw',
    //KEY
    _AES_KEY: 'wodemingzijiaozuotangdabintangdb',
    /**************************************************************
     * 字符串加密
     *   str：需要加密的字符串
     ****************************************************************/
    encrypt: function (str) {
      let key = CryptoJS.enc.Utf8.parse(this._AES_KEY);
      let iv = CryptoJS.enc.Utf8.parse(this._AES_IV);

      let srcs = CryptoJS.enc.Utf8.parse(str);
      let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return encrypted.ciphertext.toString();
    },

    /**************************************************************
     * 字符串解密
     *    str：需要解密的字符串
     ****************************************************************/
    decrypt: function (str) {
      let key = CryptoJS.enc.Utf8.parse(this._AES_KEY);
      let iv = CryptoJS.enc.Utf8.parse(this._AES_IV);
      let encryptedHexStr = CryptoJS.enc.Hex.parse(str);
      let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
      let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      return decryptedStr.toString();
    }
  },
  Fun: {
    SIGN_REGEXP: /([yMdhsm])(\1*)/g,
    DEFAULT_PATTERN: 'yyyy-MM-dd',
    //格式化日期
    //date：日期
    //pattern：格式（默认为 yyyy-MM-dd）
    formatDate: function (date, pattern) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      pattern = pattern || this.DEFAULT_PATTERN;
      let that = this;
      return pattern.replace(this.SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return that.padding(date.getFullYear(), $0.length);
          case 'M':
            return that.padding(date.getMonth() + 1, $0.length);
          case 'd':
            return that.padding(date.getDate(), $0.length);
          case 'w':
            return date.getDay() + 1;
          case 'h':
            return that.padding(date.getHours(), $0.length);
          case 'm':
            return that.padding(date.getMinutes(), $0.length);
          case 's':
            return that.padding(date.getSeconds(), $0.length);
        }
      });
    },
    //解析日期字符串
    //dateString：日期字符串
    //pattern：格式（默认为 yyyy-MM-dd）
    parseDate: function (dateString, pattern) {
      pattern = pattern || this.DEFAULT_PATTERN;
      var matchs1 = pattern.match(this.SIGN_REGEXP);
      var matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length === matchs2.length) {
        var _date = new Date(1970, 0, 1);
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i]);
          var sign = matchs1[i];
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int);
              break;
            case 'M':
              _date.setMonth(_int - 1);
              break;
            case 'd':
              _date.setDate(_int);
              break;
            case 'h':
              _date.setHours(_int);
              break;
            case 'm':
              _date.setMinutes(_int);
              break;
            case 's':
              _date.setSeconds(_int);
              break;
          }
        }
        return _date;
      }
      return null;
    },
    //获取本月初日期
    getCurMonthStart: function () {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 1);
    },
    //获取上月初日期
    getPreMonthStart: function () {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    },
    //获取本年初日期
    getCurYearStart: function () {
      const today = new Date();
      return new Date(today.getFullYear(), 0, 1);
    },
    //获取去年初日期
    getPreYearStart: function () {
      const today = new Date();
      return new Date(today.getFullYear() - 1, 0, 1);
    },
    //获取上月末日期
    getPreMonthEnd: function () {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 0);
    },
    //获取去年末日期
    getPreYearEnd: function () {
      const today = new Date();
      return new Date(today.getFullYear(), 0, 0);
    },
    //判断2数组是否一致
    equalsArray: function (array1, array2) {
      //复制
      let arr1 = this.copy(array1);
      let arr2 = this.copy(array2);

      return arr1.sort().toString() == arr2.sort().toString();
    },
    //复制
    copy: function (data) {
      return JSON.parse(JSON.stringify(data));
    },
    //格式化金额
    //amount：金额
    //decimalLen：小数位数（默认为2位小数）
    formatAmount: function (amount, decimalLen) {
      if (!amount) {
        return "0.00";
      }

      if (!decimalLen) {
        decimalLen = 2;
      }

      return amount.toFixed(decimalLen);
    },
    //对象数组排序
    //arrObj：对象数组
    //fieldName：排序字段名
    //asc：true->升序；false->降序
    sortArrayObj(arrObj, fieldName, asc) {
      if (!arrObj || !fieldName) {
        return;
      }

      arrObj.sort((item1, item2) => {
        let v1 = item1[fieldName];
        let v2 = item2[fieldName];

        //因子
        let factor = asc ? 1 : -1;

        if (v1 > v2) {
          return factor;
        } else if (v1 < v2) {
          return -factor;
        } else {
          return 0;
        }
      });

      return arrObj;
    },
    //数组去重
    //arr：数组
    distinctArray(arr) {
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) == -1) {
          hash.push(arr[i]);
        }
      }
      return hash;
    },

    //字符串填充0
    //s：字符串
    //len：填充到个数
    padding: function (s, len) {
      let l = len - (s + '').length
      for (var i = 0; i < l; i++) { s = '0' + s }
      return s
    },
  }
};
