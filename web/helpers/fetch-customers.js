import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
const FETCH_CUSTOMERS_COUNT_QUERY = `
{
    customers(first:200) {
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

/**
 * Get Customer Count and Order Count
 * Date: 19/05/2023
 * Aman Solanki
 * @param {*} res
 * @returns
 */
const fetchCustomersCountResponse = (res) => {
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

export async function fetchCustomersCount(session) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const res = await client.query({
      data: {
        query: FETCH_CUSTOMERS_COUNT_QUERY,
      },
    });

    return fetchCustomersCountResponse(res);
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
    customers(first:50) {
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

  console.log("Page Info =>", res.body.data.customers.pageInfo);
  return {
    customers: res?.body?.data.customers.edges,
    cutomersPageInfo: res?.body?.data.customers.pageInfo,
    order: orderCount,
  };
};

export async function fetchCutomers(session) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const res = await client.query({
      data: {
        query: FETCH_CUSTOMERS_QUERY,
      },
    });
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

  // customers(first:${first}, after:\"${after}\") {
  // customers($first:int, $after:string) {
  //   customers(first:$first, after:$after) {
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

  // customers(first:200, query: "firstName:'${search}' email:'${search}' tag:'${search}' ") {
  // customers(first:200, query:"email:'${search}'") {
  // customers(first:200, filter: { "email: '${search}'" }) {
  // customers(filter: { search: "Jack" }) {

  const SEARCH_CUSTOMERS_QUERY = `
{
  customers(first:50, query: "email:*${search}*") {
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
    // await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await client.query({
      data: {
        query: SEARCH_CUSTOMERS_QUERY,
      }
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
 * Fetch Filter Customer Data
 * Date: 22/05/2023
 * Aman Solanki
 */

// Function for filter the data by Tags

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
