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

module.exports = (router,sql,md5,moment,jwt)=>{

    router.post('/enterCharge',(req,res,next)=> {
        const params = req.body;
        const occupancy_query = `SELECT occupancy_id FROM tenants T, contact_infos CI where T.contact_info_id = CI.id and CI.first_name = '${params.first_name}' and CI.last_name = '${params.last_name}';`
        const gl_account_query = `SELECT id from gl_accounts GL where GL.name = '${params.gl_account_name}';`;
        sql.execute([occupancy_query, gl_account_query]).then(result=>{
            occupancy_id = result[0][0].occupancy_id;
            gl_account_id = result[1][0].id;
            chargeTenant({
                property_session: 'WEpxWWtpZkR4a1QxakxoM2ZGcDNjWHBMOVV0RTFpV3lTZlplNzdCVnBlL0hFdXlmRWFXM1BETUFIWWl6T2VCd0cyRU1Ia01tRTNacGl4WTJiZ3ZBbTdwRjFLazF5alp5cmtKYjBtSUt1RldqckRpbk9DNExHSkVIVDZOSmlBL2xKMm1HdS9uNDd0OHJRU0g4QWdVVDdTZ2J1WDJOWHFnUitzV2hzZVA1ZE5oNnUrbSsyNjRaSjZkckVnNmZiRzBOODczMFdDaWpJdkRMR21XeHVVMVBkQVM5cjRUd2F6c1ZMOXFSV0lpTzVyL0JuMzRZc1pXWkxMRys1ckk0amh1T0lNRVoxUHBwR2RVYUQ0RXBRamVmRVdxMkg4N2hycjBxUTlZSUxjcGNxNlhzWlFFWWQyMnU0bGFqanpMVlZ3Um0tLWcyVWNraVhCTXVlNHpTcW9sVUFEQlE9PQ%3D%3D--2c4ba7cb0b0dd9be1fc0c3cb23394444e20fd567',
                persistentCsrfToken: '4c8ZIHf3AR%2BoSP4Vw9tOVtUakKfhaxPrB5mYDYMvPww%3D',
                occupancy_id,
                amount: 7000,
                temporary_object_id: 4581,
                gl_account_id,
                add_for_occupancy_id: occupancy_id,
                description: 'CIARRA IS OK'
            })
        })
        //call his function
    });

    return router;
};