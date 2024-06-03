import mongoose from "mongoose";
import Url from "./urlModel.js";

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = mongoose.connection.readyState;
    console.log("DB connection successful!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

export const handler = async (event) => {
  await connectToDatabase();
  // console.log("Received event:", JSON.stringify(event, null, 2));

  const shorturl = event.queryStringParameters?.shorturl;

  const fullUrl = `https://r5pm4i5o76.execute-api.ap-southeast-2.amazonaws.com/v1/url?shorturl=${shorturl}`;
  console.log(fullUrl);

  const result = await Url.find({ shorturl: fullUrl });

  let originUrl = result[0].longurl;
  console.log(originUrl);
  console.log(typeof originUrl);

  const response = {
    statusCode: 301,
    headers: {
      Location: originUrl,
    },
  };
  // const response = {
  //   statusCode: 200,
  //   body: originUrl
  // }
  return response;
};
