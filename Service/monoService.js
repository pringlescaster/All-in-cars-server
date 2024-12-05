import axios from "axios";
import dotenv from "dotenv";


dotenv.config();

const MONO_BASE_URL = "https://api.withmono.com";
const MONO_SECRET_KEY = process.env.MONO_SECRET_KEY;



export const initiateMonoAccount = async (user) => {
    const options = {
      method: "POST",
      url: "https://api.withmono.com/v2/accounts/initiate",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
       "mono-sec-key": process.env.MONO_SECRET_KEY,

      },
      data: {
        customer: {
          name: user.name,
          email: user.email,
        },
        meta: { ref: "99008877TEST" },
        scope: "auth",
        redirect_url: "https://mono.co",
      },
    };
  
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      throw new Error(`Mono API Error: ${error.response?.data?.message || error.message}`);
    }
  };


  //Get account details
  export const getUserAccountData = async () => {
    const options = {
      method: "GET",
      url: `${MONO_BASE_URL}/v2/accounts`,
      headers: {
        accept: "application/json",
        "mono-sec-key": process.env.MONO_SECRET_KEY,
      },
    };
  
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      throw new Error(
        `Mono API Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  //Get Income Insights
  export const getIncomeInsights = async (accountId) => {
    const options = {
      method: "GET",
      url: `${MONO_BASE_URL}/v2/accounts/${accountId}/income-records`, // Endpoint to fetch income insights
      headers: {
        accept: "application/json",
        "mono-sec-key": MONO_SECRET_KEY,
      },
    };
  
    try {
      const response = await axios.request(options);
      return response.data; // Return the data from the response
    } catch (error) {
      throw new Error(
        `Mono API Error: ${error.response?.data?.message || error.message}`
      );
    }
  };


  //Income
  export const getIncome = async (accountId) => {
    const options = {
        method: 'GET',
        url: `${MONO_BASE_URL}/v2/accounts/${accountId}/income`,
        headers: {accept: 'application/json', 'Content-Type': 'application/json', "mono-sec-key": MONO_SECRET_KEY,}
      };

      try {
        const response = await axios.request(options);
        return response.data
      } catch (error) {
        throw new Error(
            `Mono API Error: ${error.response?.data?.message || error.message}`
          );
        
      }
  }

//credit worthiness
  export const checkCreditWorthiness = async (bvn, principal, interest_rate, term, accountId) => {
    const options = {
      method: 'GET',
      url: `${MONO_BASE_URL}/v2/accounts/${accountId}creditworthiness`, // Replace 'id' with the correct account ID if needed
      headers: {
        accept: 'application/json',
        'mono-sec-key': MONO_SECRET_KEY,
      },
      data: {
        bvn: bvn,
        principal: principal,
        interest_rate: interest_rate,
        term: term,
        run_credit_check: true
      }
    };
  
    try {
      const response = await axios.request(options);
      return response.data; // Assuming it contains the creditworthiness result
    } catch (error) {
      throw new Error(`Mono API Error: ${error.response?.data?.message || error.message}`);
    }
  };