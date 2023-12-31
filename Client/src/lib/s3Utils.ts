import * as aws from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

async function createBucket(s3: aws.S3, bucketName: string): Promise<boolean | void> {
    // const s3 = new aws.S3();
    const params = {
        Bucket: bucketName
    };
    const buckets = await s3.listBuckets().promise();
    if (buckets.Buckets) {
        buckets.Buckets?.forEach((bucket) => {
            if (bucket.Name === bucketName) {
                console.log("Bucket already exists");
                return;
            } else {
                s3.createBucket(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        return false;
                    } else {
                        console.log("create ", bucketName, "bucket success");
                        return true;
                    }
                });
            }
        });
    } else {
        s3.createBucket(params, function (err, data) {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log("create ", bucketName, "bucket success");
                return true;
            }
        });
    }
}

function putBucketCors(s3: aws.S3, bucketName: string) {
    // const s3 = new aws.S3();
    const params = {
        Bucket: bucketName,
        CORSConfiguration: {
            "CORSRules":
            [
                {
                    // "AllowedHeaders": [
                    //     "*"
                    // ],
                    // "AllowedMethods": [
                    //     "GET",
                    //     "PUT",
                    //     "POST",
                    //     "DELETE",
                    //     "HEAD"
                    // ],
                    // "AllowedOrigins": [
                    //     "*"
                    // ],
                    // "ExposeHeaders": [],
                    // "MaxAgeSeconds": 3000
                    AllowedMethods: ['GET','PUT', 'POST', 'DELETE'],
                    AllowedOrigins: ['*'],
                    MaxAgeSeconds: 3000,
                    ExposeHeaders: ['x-amz-server-side-encryption'],
                    Id: 'CORSRuleS3'
                }
            ]

        }

    };
    s3.putBucketCors(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    });
}

async function listBuckets(s3: aws.S3): Promise<PromiseResult<aws.S3.ListBucketsOutput, aws.AWSError>> {
    // const s3 = new aws.S3();
    console.log(s3.config.credentials)
    console.log("first")
    const data = await s3.listBuckets().promise();
    console.log("second", data)
    return data;
}

async function uploadObject(s3: aws.S3, bucketName: string, key: string, fileContent: string): Promise<boolean | void> {
    // const s3 = new aws.S3();
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent
    };
    const objects: PromiseResult<aws.S3.ListObjectsOutput, aws.AWSError> = await await s3.listObjects({ Bucket: bucketName }).promise();
    const objectExists = objects.Contents?.some((object: any) => object.Key === key);
    if (!objectExists) {
        s3.upload(params, (error: any, data: any) => {
            if (error) {
                console.error('Error:', error);
                return false;
            } else {
                console.log('Successfully uploaded to S3:', data.Location);
                return true;
            }
        });
    } else {
        console.log("Object already exists, please change the key");
        return false;
    }
}

const s3Utils = {
    createBucket: createBucket,
    listBuckets: listBuckets,
    uploadObject: uploadObject,
    putBucketCors: putBucketCors
};

export default s3Utils;