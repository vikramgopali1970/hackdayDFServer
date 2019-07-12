const api_helper = require('../api/api');

function enterCharge(req,sql){
    return new Promise((resolve, reject)=>{
        console.log(req.body);
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
            api_helper.chargeTenant({
                property_session: 'WEpxWWtpZkR4a1QxakxoM2ZGcDNjWHBMOVV0RTFpV3lTZlplNzdCVnBlL0hFdXlmRWFXM1BETUFIWWl6T2VCd0cyRU1Ia01tRTNacGl4WTJiZ3ZBbTdwRjFLazF5alp5cmtKYjBtSUt1RldqckRpbk9DNExHSkVIVDZOSmlBL2xKMm1HdS9uNDd0OHJRU0g4QWdVVDdTZ2J1WDJOWHFnUitzV2hzZVA1ZE5oNnUrbSsyNjRaSjZkckVnNmZiRzBOODczMFdDaWpJdkRMR21XeHVVMVBkQVM5cjRUd2F6c1ZMOXFSV0lpTzVyL0JuMzRZc1pXWkxMRys1ckk0amh1T0lNRVoxUHBwR2RVYUQ0RXBRamVmRVdxMkg4N2hycjBxUTlZSUxjcGNxNlhzWlFFWWQyMnU0bGFqanpMVlZ3Um0tLWcyVWNraVhCTXVlNHpTcW9sVUFEQlE9PQ%3D%3D--2c4ba7cb0b0dd9be1fc0c3cb23394444e20fd567',
                persistentCsrfToken: '4c8ZIHf3AR%2BoSP4Vw9tOVtUakKfhaxPrB5mYDYMvPww%3D',
                occupancy_id,
                amount: params.number,
                temporary_object_id: 4581,
                gl_account_id,
                add_for_occupancy_id: occupancy_id,
                description: 'CIARRA IS OK'
            })
        })
    })
}

function evictTenant(req,sql){
    return new Promise((resolve,reject)=>{
        const params = req.body.queryResult.parameters;
        console.log("params", params);
        let name = params.tenantFullName.trim().split(' ');
        const first_name = name[0];
        const last_name = name[1];
        const occupancy_query = `SELECT T.occupancy_id, T.id FROM tenants T, contact_infos CI where T.contact_info_id = CI.id and CI.first_name = '${first_name}' and CI.last_name = '${last_name}';`
        sql.execute([occupancy_query]).then(result=>{
            let occupancy_id = result[0][0].occupancy_id;
            let tenant_id = result[0][0].id;
            console.log({occupancy_id, tenant_id})
            api_helper.evictTenant({
                property_session: 'ZU01Y2QwRWV2NnFCQ0o4UzFZOWpNVElwMG5NNEZCdUl0eGN1S0k1Z1hpdjJ4U1ZpamJtZS9JSUJlSDYvcmFVSE9QVUM3TGpoN0IyMlpzdVN6ZmE3Sm01MFEyZEMzOWZGRFlrbEEyQ0RsMGZZdFFDWnk5MXVDZzlFQ01ZRDlwdU50ZkhBalN0VmF2OEJKbWdJd0cwUjNVeHR3WEk3RW1NMG9NVW5uYTdjNGdyeC9FYWNPcHlKRnV3ZG1JYXFleFJ2TnM4UUlSaFBaazlmSTdMMkhKS1dJb25ISEYyL1NPQmYvRk5peUg4SVZWL1ZLbHRRQ090Y1BtZEZRUTF4UWFKTHN1WFBLcnZDQ01QWUtidVc0Qm1nV0JYU0N4eE9zSGtHWFBzYXR3TlBvQzJ6SGp3dGcyaTMrZFlwenp4eVp1RGctLUI5LzlRUm5vc1ZoRGxacTRqVTNlVmc9PQ%3D%3D--1ef4fd5ddff7e7dfe2104c058d8ab5a34dc8681d',
                persistentCsrfToken: '4c8ZIHf3AR%2BoSP4Vw9tOVtUakKfhaxPrB5mYDYMvPww%3D',
                occupancy_id,
                tenant_id
            })
        })
    });
}

module.exports = (router,sql,md5,moment,jwt)=>{

    router.post('/', (req, res, next)=>{
        console.log(req.body);
        const intent = req.body.queryResult.intent;
        switch(intent.displayName){
            case 'charge_intent':
                enterCharge(req,sql);
                break;
            case 'evict_intent':
                evictTenant(req,sql)
                break;
        }
    });

    

    // router.post('/evict',(req,res,next)=> {
    //     const params = req.body.queryResult.parameters;
    //     console.log("params", params);
    //     let name = params.tenantFullName.trim().split(' ');
    //     const first_name = name[0];
    //     const last_name = name[1];
    //     const occupancy_query = `SELECT T.occupancy_id, T.id FROM tenants T, contact_infos CI where T.contact_info_id = CI.id and CI.first_name = '${first_name}' and CI.last_name = '${last_name}';`
    //     sql.execute([occupancy_query]).then(result=>{
    //         let occupancy_id = result[0][0].occupancy_id;
    //         let tenant_id = result[0][0].id;
    //         console.log({occupancy_id, tenant_id})
    //         api_helper.evictTenant({
    //             property_session: 'M0EyZW9PTG5NWU9EWVo1MkxRdUtIT3ZlY0k2eDU5dFNQWFJsNWZMWjRyYTdPbk9reGJSRDcrSjZXQ2NJLy90K29jVVN2SXUvckJCczdxd0JKZWozSk5pTThHQm1jOGs0cmZGeEVBTUFXaExZenFmejkwZHVtbWJqcjFMQjNVTkJEVDdzTVFDMjY2Z05sVzVuSUlLeUFFSGtkVFRzZkFCaFEvdk9TTU16bGlQZVNqdlRsNTNtcVJPVWpXM29wMU9xK2Q3MjVwSkVKUWNiMWdmZko2UG1OWGIrbEdoemVVTzYvamx5d0xaQ2FNUHIyWFA1VHMyTC9mVVB1aCtKWCswNEg5VXJObnEwSUhsSWY2RjJNLzExLy9YV09nNDNJM2M2dXVKMCtBdHNqOVRyMkhCbFFISUhWUGhVVTNmeGpWWTMtLUVuMjJrSVI0TFdQb3RjQmIvM1ZTREE9PQ%3D%3D--e3de3b71c4ba2c210901f95df79fcb02d42ae338',
    //             persistentCsrfToken: 'Mnqx428Qr6qdFRIBScqSEtEb3oeW9oB2ocsf7Vn5uJw%3D',
    //             occupancy_id,
    //             tenant_id
    //         })
    //     })
    //     //call his function
    // });

    return router;
};