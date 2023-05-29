import axios from "axios";
import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
const FETCH_ORDER_QUERY = `{
        orders(first: 50) {
          edges {
            node {
              id
              name
              fulfillable
              fullyPaid
              fulfillments {
                status
              }
              tags
              createdAt
              billingAddress {
                address1
                city
                country
              }
              transactions {
                status
              }
              closed
              confirmed
              currencyCode
              customer {
                id
                firstName
                lastName
                numberOfOrders
              }
              displayFulfillmentStatus
              totalPriceSet {
                shopMoney {
                    amount
                }
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
const fetchOrderResponse = (res) => {
  const edges = res?.body?.data?.orders?.edges || [];
  return {
    orders: edges,
    ordersPageInfo: res?.body?.data.orders.pageInfo,
  };
};

export default async function fetchOrders(session) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const res = await client.query({
      data: {
        query: FETCH_ORDER_QUERY,
      },
    });
    return fetchOrderResponse(res);
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

// Function for filter the data by Tags
const fetchCustomerOrder = (res) => {
  const edges = res?.body?.data?.customers?.edges || [];
  return {
    customer: res.body.data.customer,
    orders: res.body.data.customer.orders.edges,
  };
};

export async function getAllOrdersByCustomer({ session, customerId }) {
  let count = 0;
  var updatedResArr = [];
  const shop = session.shop;
  const accessToken = session.accessToken;
  const custId = `gid://shopify/Customer/${customerId}`;
  const client = new shopify.api.clients.Graphql({ session });
  const FETCH_CUSTOMERS_ORDER_QUERY = `
  {
      customer(id: \"${custId}\") {
          id
          firstName
          lastName
          acceptsMarketing
          email
          phone
          averageOrderAmountV2 {
            amount
            currencyCode
          }
          createdAt
          updatedAt
          note
          verifiedEmail
          validEmailAddress
          tags
          orders(first: 50) {
            edges {
              node {
                id
                name
                fulfillable
                fullyPaid
                fulfillments {
                  status
                }
                tags
                createdAt
                billingAddress {
                  address1
                  city
                  country
                }
                transactions {
                  status
                }
                closed
                confirmed
                currencyCode
                customer {
                  id
                  firstName
                  lastName
                  numberOfOrders
                }
                displayFulfillmentStatus
                totalPriceSet {
                  shopMoney {
                      amount
                  }
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
          lifetimeDuration
          defaultAddress {
            formattedArea
            address1
          }
          addresses {
            address1
          }
          image {
            src
          }
          canDelete
      }
  }`;

  try {
    const res = await client.query({
      data: {
        query: FETCH_CUSTOMERS_ORDER_QUERY,
      },
    });
    return fetchCustomerOrder(res);
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

const fetchOrderByIdResponse = (res) => {
  const edges = res?.body?.data;
  return {
    order: edges.order,
    lineItems: edges.order.lineItems,
  };
};
export async function getOrderById({ session, orderId }) {
  const client = new shopify.api.clients.Graphql({ session });
  const custId = `gid://shopify/Order/${orderId}`;
  const FETCH_ORDER_BY_ID_QUERY = `{
    order(id: \"${custId}\") {
                id
                name
                fulfillable
                fullyPaid
                fulfillments {
                  status
                }
                tags
                createdAt
                billingAddressMatchesShippingAddress
                billingAddress {
                  address1
                  address2
                  city
                  country
                  firstName
                  id
                  lastName
                  name
                  phone
                  zip
                  province
                  company
                }
                shippingAddress {
                  address1
                  address2
                  city
                  country
                  firstName
                  id
                  lastName
                  name
                  phone
                  zip
                  province
                  company
                }
                transactions {
                  status
                }
                closed
                confirmed
                currencyCode
                customer {
                  id
                  email
                  firstName
                  lastName
                  phone
                  numberOfOrders
                  image {
                    url
                  }
                }
                displayFulfillmentStatus
                totalPriceSet {
                  shopMoney {
                      amount
                  }
                }
                lineItems (first: 10) {
                  edges {
                    node {
                      id
                      name
                      vendor
                      unfulfilledQuantity
                      currentQuantity
                      customAttributes {
                        key
                        value
                      }
                      nonFulfillableQuantity
                      originalTotalSet {
                        shopMoney {
                          amount
                          currencyCode
                      }
                      }
                      quantity
                      title
                      variant {
                        id
                        image {
                          altText
                          height
                          id
                          url
                          width
                        }
                        price
                      }
                      variantTitle 
                      image {
                        altText
                        height
                        id
                        url
                        width
                      }
                    }
                  }
                }
    }
  }`;

  try {
    const res = await client.query({
      data: {
        query: FETCH_ORDER_BY_ID_QUERY,
      },
    });
    return fetchOrderByIdResponse(res);
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

// // For Update orders

async function makeApiRequest(credConfig) {
  try {
    const res = await axios.request(credConfig);
    // Check for rate limit error
    if (res.status === 429) {
      // Sleep for the amount of time specified in the Retry-After header
      const retryAfter = parseInt(res.headers["retry-after"], 2) || 2;
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      // Retry the request
      return makeApiRequest(credConfig);
    }

    const order = {
      id: res.data.order.id,
      admin_graphql_api_id: res.data.order.admin_graphql_api_id,
      app_id: res.data.order.app_id,
      billing_address: res.data.order.billing_address,
      shipping_address: res.data.order.shipping_address,
    };
    return { order };
  } catch (error) {
    // console.error("Error ===>", error);
    // return {error};
  }
}

export async function updateOrder({
  session,
  orderId,
  firstName,
  lastName,
  address,
  addressTwo,
  city,
  company,
  zip,
  phone,
  province,
}) {
  const shop = session.shop;
  const accessToken = session.accessToken;
  const cleanedNumber = phone.replace(/\D/g, '');
  let credential = JSON.stringify({
    order: {
      id: orderId,
      shipping_address: {
        first_name: firstName,
        address1: address,
        phone: "+" + cleanedNumber,
        city: city,
        zip: zip,
        province: province,
        last_name: lastName,
        address2: addressTwo,
        company: company,
      },
    },
  });

  let credConfig = {
    method: "put",
    maxBodyLength: Infinity,
    url: `https://${shop}/admin/api/2022-10/orders/${orderId}.json`,
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
      "Retry-After": 2.0,
    },
    data: credential,
  };
  return makeApiRequest(credConfig);
}

// /* Get Country list and its Province */

const fetchCountryList = (res) => {
  return { countries: res.data.countries };
};

export async function getCountryList(session) {
  const shop = session.shop;
  const accessToken = session.accessToken;
  let data = "";
  try {
    let credential = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://${shop}/admin/api/2022-10/countries.json`,
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
      data: data,
    };
    const res = await axios.request(credential);
    return fetchCountryList(res);
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
