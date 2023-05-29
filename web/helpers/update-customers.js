import axios from "axios";
import asyncLoop from "node-async-loop";
import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export default async function updateCustomers({ session, newCustID }) {
  const shop = session.shop;
  const accessToken = session.accessToken;
  var bulkData = [];

  try {
    const tax_exempt = new Promise((resolve, reject) => {
      asyncLoop(
        newCustID,
        async function (item, next) {
          let getCustomerConfig = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://${shop}/admin/api/2022-10/customers/${item}.json`,
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
              Cookie: "request_method=POST",
            },
          };
          const customer_response = await axios.request(getCustomerConfig);
          if (customer_response.data.customer.tax_exempt === true) {
            let credential = JSON.stringify({
              customer: {
                id: item,
                tax_exempt: false,
              },
            });

            let credConfig = {
              method: "put",
              maxBodyLength: Infinity,
              url: `https://${shop}/admin/api/2022-10/customers/${item}.json`,
              headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
                "Retry-After": 2.0,
                Cookie: "request_method=POST",
              },
              data: credential,
            };
            const response = await axios.request(credConfig);
            const temp_res_data = response.data.customer;
            bulkData.push(temp_res_data);
          } else {
            let credential = JSON.stringify({
              customer: {
                id: item,
                tax_exempt: true,
              },
            });

            let credConfig = {
              method: "put",
              maxBodyLength: Infinity,
              url: `https://${shop}/admin/api/2022-10/customers/${item}.json`,
              headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
                "X-Shopify-Shop-Api-Call-Limit": 40 / 40,
                "Retry-After": 2.0,
                Cookie: "request_method=POST",
              },
              data: credential,
            };
            const response = await axios.request(credConfig);
            const temp_res_data = response.data.customer;
            bulkData.push(temp_res_data);
          }
          next();
        },
        function (err, response) {
          if (err) {
            console.error("Error: " + err.message);
            reject(err);
          }
          resolve(bulkData);
        }
      );
    });
    return tax_exempt;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
