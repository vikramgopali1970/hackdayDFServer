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
        let _cookie = `_property_session=${property_session}; ` + 
                  `PersistentCsrfToken=${persistentCsrfToken}`;

        var options = { method: 'POST',
            url: `http://localhost:3000/occupancies/${occupancy_id}`,
            qs: { block_name: 'occupancy_status' },
            headers: 
            { 'cache-control': 'no-cache',
                Connection: 'keep-alive',
                'content-length': '969',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
                'accept-encoding': 'gzip, deflate',
                cookie: _cookie,
                Host: 'localhost:3000',
                'Postman-Token': '57100e9e-5526-44a9-bb49-01da6e4c2459,1b6ae7a2-0cf3-4072-9754-66d8314dca8d',
                'Cache-Control': 'no-cache',
                Accept: '*/*',
                'User-Agent': 'PostmanRuntime/7.15.0' },
            formData: 
            { _method: 'put',
                authenticity_token: 'r4aSW9zQxUDjtaY4VUyfjGlfu1QcvS58yC3WL5s6JF6d/CO4s8Bq6n6gtDkchg2euERl04pLrgpp5snCwsOcwg==',
                selected_tenant: `${tenant_id}`,
                'occupancy[evicting]': '1',
                'occupancy[in_collections]': '0',
                'occupancy[certified_funds_only]': '0',
                commit: 'Save' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
            console.log(body);
            resolve(body);
        });
    })
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
        let name = params.tenantFullName.split(' ');
        const first_name = name[0];
        const last_name = name[1];
        const occupancy_query = `SELECT occupancy_id, id FROM tenants T, contact_infos CI where T.contact_info_id = CI.id and CI.first_name = '${first_name}' and CI.last_name = '${last_name}';`
        sql.execute([occupancy_query]).then(result=>{
            let occupancy_id = result[0][0].occupancy_id;
            let tenant_id = result[0][0].id;
            evictTenant({
                property_session: 'WEpxWWtpZkR4a1QxakxoM2ZGcDNjWHBMOVV0RTFpV3lTZlplNzdCVnBlL0hFdXlmRWFXM1BETUFIWWl6T2VCd0cyRU1Ia01tRTNacGl4WTJiZ3ZBbTdwRjFLazF5alp5cmtKYjBtSUt1RldqckRpbk9DNExHSkVIVDZOSmlBL2xKMm1HdS9uNDd0OHJRU0g4QWdVVDdTZ2J1WDJOWHFnUitzV2hzZVA1ZE5oNnUrbSsyNjRaSjZkckVnNmZiRzBOODczMFdDaWpJdkRMR21XeHVVMVBkQVM5cjRUd2F6c1ZMOXFSV0lpTzVyL0JuMzRZc1pXWkxMRys1ckk0amh1T0lNRVoxUHBwR2RVYUQ0RXBRamVmRVdxMkg4N2hycjBxUTlZSUxjcGNxNlhzWlFFWWQyMnU0bGFqanpMVlZ3Um0tLWcyVWNraVhCTXVlNHpTcW9sVUFEQlE9PQ%3D%3D--2c4ba7cb0b0dd9be1fc0c3cb23394444e20fd567',
                persistentCsrfToken: '4c8ZIHf3AR%2BoSP4Vw9tOVtUakKfhaxPrB5mYDYMvPww%3D',
                occupancy_id,
                tenant_id
            })
        })
        //call his function
    });

    return router;
};