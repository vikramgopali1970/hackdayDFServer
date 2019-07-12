var request = require("request");

let evicting = 0;

var options = { method: 'POST',
  url: 'http://localhost:3000/occupancies/6',
  qs: { block_name: 'occupancy_status' },
  headers: 
   { 'cache-control': 'no-cache',
     Connection: 'keep-alive',
     'content-length': '306',
     'accept-encoding': 'gzip, deflate',
     cookie: '_property_session=T2NCemxTcW85QzlWcTEraGJjOEZOU0RUWG5nekZBc0NTZ0wxSWNiS281QzNIV1dpVk1Rbkxxak9wK25NNEhMZG9tR0xuWE5LcVhsd3VZaG82YlQxTHZsblVFZm84RTlOUk5zTFBzZnppVkFjWWx6SFQ4WStBdUxiMTZoRWx1djg5VmpHM0dTMk1CZnhXOC9kZWR3ZG96b1MzRElRTE8zOGc5NW1jRzd5TC9aazlTcVFucU9VQmRvTEZyMExIT0oreUxJemNuSnlTUGlmNmhMUTQzMGFWQlQrNi9sbWp1K084UnNjVjdzM1NlM3VHRlZQUStHRkV1bElyOTlXSWEvSGhFM1pqck5hVGxrS3hEdDRud0U5VjE1cHFmTUc4ckg2YzU5aDRTYUkweWxsTWg5M3RSSXliL1BaTWY1V2dHWVgtLTZTVFNKL0FjTjhpY044eWhGdGZmT2c9PQ%3D%3D--4c2345f83b87e85caffc84543b9c0ad5abbe306e; PersistentCsrfToken=Mnqx428Qr6qdFRIBScqSEtEb3oeW9oB2ocsf7Vn5uJw%3D',
     Host: 'localhost:3000',
     'Postman-Token': '21a21d63-c8b6-44a6-964d-fbb2ba149c12,76a24001-0442-453f-8e3d-c3b4677ed842',
     'Cache-Control': 'no-cache',
     Accept: '*/*',
     'User-Agent': 'PostmanRuntime/7.15.0',
     'Content-Type': 'application/x-www-form-urlencoded' },
  form: false,
  body: `utf8=%E2%9C%93&_method=put&authenticity_token=DCHM6%2BDlZbe%2BK5OJZX41h9%2FzNePIQgyRA%2BIt4qMBLXY%2BW30Ij%2FXKHSM%2BgYgstKeVDujrZF60jOeiKTIP%2BviV6g%3D%3D&selected_tenant=9&occupancy%5Bevicting%5D=1&occupancy%5Bevicting%5D=1&occupancy%5Bin_collections%5D=0&occupancy%5Bcertified_funds_only%5D=0&commit=Save`
 };


request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
