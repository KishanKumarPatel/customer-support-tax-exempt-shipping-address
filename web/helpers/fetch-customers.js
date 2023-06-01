import axios from "axios";
import dotenv from 'dotenv';
import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
dotenv.config();
/**
 * Get Customer Count and Order Count
 * Date: 19/05/2023
 * Aman Solanki
 * @param {*} res
 * @returns
 */
export async function fetchCustomersCount(session) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://${process.env.STORE_URL}/count.json`,
      headers: {
        "X-Shopify-Access-Token": process.env.ACCESS_TOKEN
      },
    };
    const res = await axios.request(config);
    return res.data;
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

/**
 * Fetch Customers List
 * Date: 19/05/2023
 * Aman Solanki
 */

const FETCH_CUSTOMERS_QUERY = `
{
    customers(first:20) {
         edges {
           node {
             id
             firstName
             lastName
             email
             phone
             createdAt
             updatedAt
             taxExempt
             tags
             taxExemptions
             numberOfOrders
             addresses {
                 address1
                 address2
                 city
             }
           }
           cursor
        }
           pageInfo {
             endCursor
             hasNextPage
             hasPreviousPage
             startCursor
           }
       }
}`;

const formalGqlResponse = (res) => {
  const edges = res?.body?.data?.customers?.edges || [];
  const orderCount = edges.map(({ node }) => ({
    order: parseInt(node.numberOfOrders),
  }));
  return {
    customers: res?.body?.data.customers.edges,
    cutomersPageInfo: res?.body?.data.customers.pageInfo,
    order: orderCount,
  };
};

export async function fetchCutomers(session) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const startTime = performance.now();
    const res = await client.query({
      data: {
        query: FETCH_CUSTOMERS_QUERY,
      },
    });

    const endTime = performance.now(); // Stop measuring execution time
    const executionTime = endTime - startTime; // Calculate execution time in milliseconds

    // console.log("Extension:", res.body.extensions);
    // console.log("Execution time:", executionTime, "ms");

    return formalGqlResponse(res);
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

/***
 * Get Customers List for next page
 * Date:  19/05/2023
 * Aman Solanki
 */
const fetchNextCustomerResponse = (res) => {
  const edges = res?.body?.data?.customers?.edges || [];
  return {
    customers: edges,
    cutomersPageInfo: res?.body?.data.customers.pageInfo,
  };
};
export async function fetchNextCutomers({ session, first, after }) {
  const client = new shopify.api.clients.Graphql({ session });
  const FETCH_NEXT_CUSTOMER_QUERY = `
{
      customers(first:${first}, after:\"${after}\") {
         edges {
           node {
             id
             firstName
             lastName
             email
             phone
             createdAt
             updatedAt
             taxExempt
             tags
             taxExemptions
             numberOfOrders
             addresses {
                 address1
                 address2
                 city
             }
           }
           cursor
        }
           pageInfo {
             endCursor
             hasNextPage
             hasPreviousPage
             startCursor
           }
          }
        }`;

  try {
    const res = await client.query({
      data: {
        query: FETCH_NEXT_CUSTOMER_QUERY,
      },
    });
    return fetchNextCustomerResponse(res);
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

/**
 * Get Customers list for Previous Page
 * @param {*} res
 * @returns
 */

const fetchPreviousCustomersResponse = (res) => {
  const edges = res?.body?.data?.customers?.edges || [];
  return {
    customers: edges,
    cutomersPageInfo: res?.body?.data.customers.pageInfo,
  };
};

export async function fetchPreviousCustomers({ session, last, before }) {
  const client = new shopify.api.clients.Graphql({ session });
  const FETCH_PREVIOUS_CUSTOMER_QUERY = `{
      customers(last:${last}, before: \"${before}"\) {
         edges {
           node {
             id
             firstName
             lastName
             email
             phone
             createdAt
             updatedAt
             taxExempt
             tags
             taxExemptions
             numberOfOrders
             addresses {
                 address1
                 address2
                 city
             }
           }
           cursor
        }
           pageInfo {
             endCursor
             hasNextPage
             hasPreviousPage
             startCursor
           }
          }
        }`;
  try {
    const res = await client.query({
      data: {
        query: FETCH_PREVIOUS_CUSTOMER_QUERY,
      },
    });
    return fetchPreviousCustomersResponse(res);
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

/**
 * Filter Search for customers
 * Date: 19/05/2023
 * Aman Solanki
 */

const fechSearchCustomersResponse = (res) => {
  const edges = res?.body?.data?.customers?.edges || [];
  const orderCount = edges.map(({ node }) => ({
    order: parseInt(node.numberOfOrders),
  }));
  return {
    customers: res?.body?.data.customers.edges,
    cutomersPageInfo: res?.body?.data.customers.pageInfo,
    order: orderCount,
  };
};

/**
 * Changed By 23/05/2023
 * Aman Solanki
 * @param {1} session
 * @param {2} search
 * @returns fechSearchCustomersResponse(res);
 */
export async function searchCustomers({ session, search }) {
  const SEARCH_CUSTOMERS_QUERY = `
{
  customers(first:20, query: "email:*${search}*") {
         edges {
           node {
             id
             firstName
             lastName
             email
             phone
             createdAt
             updatedAt
             taxExempt
             tags
             taxExemptions
             numberOfOrders
             addresses {
                 address1
                 address2
                 city
             }
           }
           cursor
        }
           pageInfo {
             endCursor
             hasNextPage
             hasPreviousPage
             startCursor
           }
       }
 }`;

  const client = new shopify.api.clients.Graphql({ session });
  try {
    const res = await client.query({
      data: {
        query: SEARCH_CUSTOMERS_QUERY,
      },
    });
    return fechSearchCustomersResponse(res);
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

/**
 * Fetch Filter Customer Data by Tags
 * Date: 22/05/2023
 * Aman Solanki
 */
const fetchFilterCustomersResponse = (res) => {
  const edges = res?.body?.data?.customers?.edges || [];
  const orderCount = edges.map(({ node }) => ({
    order: parseInt(node.numberOfOrders),
  }));
  return {
    customers: res?.body?.data.customers.edges,
    cutomersPageInfo: res?.body?.data.customers.pageInfo,
    order: orderCount,
  };
};

export async function filterCustomomer({ session, filter }) {
  const FILTER_CUSTOMER_QUERY = `
{
    customers(first:200, query: "tag:'${filter}'") {
         edges {
           node {
             id
             firstName
             lastName
             email
             phone
             createdAt
             updatedAt
             taxExempt
             tags
             taxExemptions
             numberOfOrders
             addresses {
                 address1
                 address2
                 city
             }
           }
           cursor
        }
           pageInfo {
             endCursor
             hasNextPage
             hasPreviousPage
             startCursor
           }
       }
 }`;
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const res = await client.query({
      data: {
        query: FILTER_CUSTOMER_QUERY,
      },
    });
    return fetchFilterCustomersResponse(res);
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
