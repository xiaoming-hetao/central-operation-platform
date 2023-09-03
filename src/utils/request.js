import axios from 'axios'

function requestMethod({
  url,
  method,
  data = {},
  headers = {'Content-Type':'application/json;charset=UTF-8'},
  transformRequest = []
}) {
  return new Promise((resolve, reject) => {
    axios({
      //在config配置文件下配置的生产环境和开发环境的路径
      baseURL: process.env.API_ROOT,
      url,
      method,
      data: JSON.stringify(data),
      headers,
      transformRequest
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  })
}

export default requestMethod;