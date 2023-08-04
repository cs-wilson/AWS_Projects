import config from "./lib/config"
import s3Utils from "./lib/s3Utils";


async function uploadFileToS3(fileName: string, fileContent: string) {
    const bucketName = config.get<string>("AWS_BUCKET");
    const buketsList = await s3Utils.listBuckets();
    const bucketExists = buketsList.Buckets?.some((bucket: any) => bucket.Name === bucketName);
    if (!bucketExists) {
        // 创建bucket
        await s3Utils.createBucket(bucketName);
    }
    // 上传文件
    const key = `${bucketName}/${fileName}`;
    const upload_text_success = await s3Utils.uploadObject(bucketName, key, fileContent);
    console.log("upload success", await upload_text_success);
}

export default uploadFileToS3;