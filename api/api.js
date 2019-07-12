const request = require('request')

module.exports = {
    chargeTenant : function ({property_session, persistentCsrfToken, occupancy_id, amount, temporary_object_id, gl_account_id, add_for_occupancy_id, description}) {
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
    },

    evictTenant : function({occupancy_id,tenant_id,property_session,persistentCsrfToken}){
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
            body: `utf8=%E2%9C%93&_method=put&authenticity_token=f4Ehy8qWddSGWvCCMnb%2FfiLMcTmZbiN9X3MROJ0qnd%2BeTjjrvWF0yy4SDpfxrbEo99bhnngFMJZY6ok1HgWi0w%3D%3D&selected_tenant=9&occupancy%5Bevicting%5D=1&occupancy%5Bevicting%5D=1&occupancy%5Bin_collections%5D=0&occupancy%5Bcertified_funds_only%5D=0&commit=Save`
            };

            console.log(options)
            console.log("body", options.body)
    
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            resolve(body);
            console.log(body);
            }); 
        });
    }
}