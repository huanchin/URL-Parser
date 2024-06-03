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
  // const parameter = event.pathParameters.anyParameter;
  const shorturl = Object.keys(event.queryStringParameters);
  const fullUrl = `https://weuyzr99v7.execute-api.ap-southeast-2.amazonaws.com/v1?${shorturl}`;
  console.log(fullUrl);

  const result = await Url.find({ shorturl: fullUrl });

  let originUrl = result[0].longurl;
  console.log(originUrl);
  console.log(typeof originUrl);

  result[0].numOfClicks++;
  await result[0].save();

  const response = {
    statusCode: 301,
    headers: {
      Location: originUrl,
    },
  };

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify(result),
  // };

  return response;
};
