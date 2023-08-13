async function makeApiRequest(url, method, headers, body) {
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(body),
            redirect: 'follow'
        });

        const data = await response.text();

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// 使用例子
const apiUrl = 'https://2igd38utjf.execute-api.us-east-1.amazonaws.com/default/dynamoDB_operation_api';
const httpMethod = 'POST';
const requestHeaders = new Headers();
requestHeaders.append('Content-Type', 'application/json');
const requestBody = {
    "input_text": "Test Input Text",
    "input_file_path": "path/to/file"
};

async function main() {
    try {
        const response = await makeApiRequest(apiUrl, httpMethod, requestHeaders, requestBody);
        console.log('Response:', response);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();