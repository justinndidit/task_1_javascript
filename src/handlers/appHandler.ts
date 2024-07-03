import { Response, Request } from "express";
import axios from "axios";

//test

export async function getUserDetailsAndGreet(request: Request, response: Response) {
    const visitorName = request.query.visitor_name as string;
    const userIp  = request.socket.remoteAddress?.toString();
    // const ipInfoBaseUrl = process.env.ipAddressBaseUrl?.toString();
    // const ipInfoToken = process.env.ipAddressApiToken?.toString();
    // const weatherApiBaseUrl = process.env.weatherApiBaseUrl?.toString();
    // const weatherApiToken = process.env.weatherApiToken?.toString();

    //This is bad
    const weatherApiBaseUrl="https://api.tomorrow.io/v4/weather/forecast";
    const weatherApiToken="cz10yWbD2RPNm0h8V8qZeCR6bMbbTnvj";
    const ipAddressBaseUrl="ipinfo.io/";
    const ipAddressApiToken="2b6d7978deef20";


    const ipInfoUrl: string = `https://${ipAddressBaseUrl}/${userIp}?token=${ipAddressApiToken}`;

    try {
    
        const ipInfoResponse = await axios.get(ipInfoUrl);
        const ipInfoData = ipInfoResponse.data;

        let locationData = ipInfoData?.loc?.split(" ") || ["6.5244" ,"3.3792"];
        const long = locationData[0] || "6.5244";
        const lat = locationData[1] || "3.3792";
        const city = ipInfoData.city || "Lagos";

        //'https://api.tomorrow.io/v4/weather/forecast?location=new%20york&apikey=cz10yWbD2RPNm0h8V8qZeCR6bMbbTnvj'
        const weatherApiUrl: string = `${weatherApiBaseUrl}?location=${city}&apikey=${weatherApiToken}`;
        const weatherApiResponse = await axios.get(weatherApiUrl);
        // console.log(weatherApiResponse);
        const weatherData = weatherApiResponse.data.timelines.minutely[0].values.temperature;

        const greeting: string = `Hello, ${visitorName}!, the temperature is ${weatherData} degrees Celcius in ${city}`;
        const responseData = {
            client_ip: userIp,
            location: city,
            greeting 
        };

        response.status(200).json(responseData);
    } catch (error : any) {
        console.error(error.message);
        response.status(500).send(error);
    }
}
