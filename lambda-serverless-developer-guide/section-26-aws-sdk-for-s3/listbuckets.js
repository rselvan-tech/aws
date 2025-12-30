import { GetObjectLockConfigurationRequest$, ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";

export const list = async () => {
    try {
      const data= await s3Client.send(new ListBucketsCommand({}));
      console.log("Success", data.Buckets);
    } catch (error){
        console.log("Error:",error);
    }
};
list();
