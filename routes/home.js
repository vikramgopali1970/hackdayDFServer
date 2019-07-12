const request = require('request')
function chargeTenant({property_session, persistentCsrfToken, occupancy_id, amount, temporary_object_id, gl_account_id, add_for_occupancy_id, description}) {
    return new Promise((resolve,reject)=>{
        let _cookie = `_property_session=${property_session}; ` + 
                  `PersistentCsrfToken=${persistentCsrfToken}`;
    let today =  new Date().toLocaleString('en-US').slice(0,9);
    // temporary_object_id = `${temporary_object_id}`
    
    var options = { method: 'POST',
    url: 'http://localhost:3000/accounting/tenant_charges.js',
    headers: 
    { 'cache-control': 'no-cache',
        Connection: 'keep-alive',
        referer: 'http://localhost:3000/accounting/tenant_charges.js',
        'accept-encoding': 'gzip, deflate',
        cookie: _cookie,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    formData: 
    {  temporary_object_id,
        'tenant_invoice_form[ignore_warnings]': 'false',
        'tenant_invoice_form[is_homeowner]': 'false',
        'tenant_invoice_form[is_corporate]': 'false',
        'tenant_invoice_form[occupancy_id]': occupancy_id,
        'tenant_invoice_form[amount]': amount,
        'tenant_invoice_form[occurred_on]': `${today}`,
        'tenant_invoice_form[gl_account_id]': gl_account_id,
        'tenant_invoice_form[description]': description,
        'tenant_invoice_form[add_for_occupancy_id]': add_for_occupancy_id,
        commit: 'Save' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
            console.log(body);
            resolve(body);
        });
    })
}


function evictTenant({occupancy_id,tenant_id,property_session,persistentCsrfToken}){
    
    return new Promise((resolve, reject)=>{


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
    });
}

module.exports = (router,sql,md5,moment,jwt)=>{

    router.post('/enterCharge',(req,res,next)=> {
        const params = req.body.queryResult.parameters;
        console.log("params", params);
        let name = params.tenantFullName.split(' ');
        const first_name = name[0];
        const last_name = name[1];
        const occupancy_query = `SELECT occupancy_id FROM tenants T, contact_infos CI where T.contact_info_id = CI.id and CI.first_name = '${first_name}' and CI.last_name = '${last_name}';`
        const gl_account_query = `SELECT id from gl_accounts GL where GL.name = '${params['GL-account']}';`;
        sql.execute([occupancy_query, gl_account_query]).then(result=>{
            occupancy_id = result[0][0].occupancy_id;
            gl_account_id = result[1][0].id;
            chargeTenant({
                property_session: 'WEpxWWtpZkR4a1QxakxoM2ZGcDNjWHBMOVV0RTFpV3lTZlplNzdCVnBlL0hFdXlmRWFXM1BETUFIWWl6T2VCd0cyRU1Ia01tRTNacGl4WTJiZ3ZBbTdwRjFLazF5alp5cmtKYjBtSUt1RldqckRpbk9DNExHSkVIVDZOSmlBL2xKMm1HdS9uNDd0OHJRU0g4QWdVVDdTZ2J1WDJOWHFnUitzV2hzZVA1ZE5oNnUrbSsyNjRaSjZkckVnNmZiRzBOODczMFdDaWpJdkRMR21XeHVVMVBkQVM5cjRUd2F6c1ZMOXFSV0lpTzVyL0JuMzRZc1pXWkxMRys1ckk0amh1T0lNRVoxUHBwR2RVYUQ0RXBRamVmRVdxMkg4N2hycjBxUTlZSUxjcGNxNlhzWlFFWWQyMnU0bGFqanpMVlZ3Um0tLWcyVWNraVhCTXVlNHpTcW9sVUFEQlE9PQ%3D%3D--2c4ba7cb0b0dd9be1fc0c3cb23394444e20fd567',
                persistentCsrfToken: '4c8ZIHf3AR%2BoSP4Vw9tOVtUakKfhaxPrB5mYDYMvPww%3D',
                occupancy_id,
                amount: params.Amount,
                temporary_object_id: 4581,
                gl_account_id,
                add_for_occupancy_id: occupancy_id,
                description: 'CIARRA IS OK'
            })
        })
        //call his function
    });

    router.post('/evict',(req,res,next)=> {
        const params = req.body.queryResult.parameters;
        console.log("params", params);
        let name = params.tenantFullname.trim().split(' ');
        const first_name = name[0];
        const last_name = name[1];
        const occupancy_query = `SELECT T.occupancy_id, T.id FROM tenants T, contact_infos CI where T.contact_info_id = CI.id and CI.first_name = '${first_name}' and CI.last_name = '${last_name}';`
        sql.execute([occupancy_query]).then(result=>{
            let occupancy_id = result[0][0].occupancy_id;
            let tenant_id = result[0][0].id;
            console.log({occupancy_id, tenant_id})
            evictTenant({
                property_session: 'M0EyZW9PTG5NWU9EWVo1MkxRdUtIT3ZlY0k2eDU5dFNQWFJsNWZMWjRyYTdPbk9reGJSRDcrSjZXQ2NJLy90K29jVVN2SXUvckJCczdxd0JKZWozSk5pTThHQm1jOGs0cmZGeEVBTUFXaExZenFmejkwZHVtbWJqcjFMQjNVTkJEVDdzTVFDMjY2Z05sVzVuSUlLeUFFSGtkVFRzZkFCaFEvdk9TTU16bGlQZVNqdlRsNTNtcVJPVWpXM29wMU9xK2Q3MjVwSkVKUWNiMWdmZko2UG1OWGIrbEdoemVVTzYvamx5d0xaQ2FNUHIyWFA1VHMyTC9mVVB1aCtKWCswNEg5VXJObnEwSUhsSWY2RjJNLzExLy9YV09nNDNJM2M2dXVKMCtBdHNqOVRyMkhCbFFISUhWUGhVVTNmeGpWWTMtLUVuMjJrSVI0TFdQb3RjQmIvM1ZTREE9PQ%3D%3D--e3de3b71c4ba2c210901f95df79fcb02d42ae338',
                persistentCsrfToken: 'Mnqx428Qr6qdFRIBScqSEtEb3oeW9oB2ocsf7Vn5uJw%3D',
                occupancy_id,
                tenant_id
            })
        })
        //call his function
    });

    return router;
};