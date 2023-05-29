import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";

const FETCH_PRODUCTS_QUERY = `{
    products(first: 50, reverse: true) {
        edges {
            node {
                id
                description
                title
                productType
                status
                tags
                totalInventory
                vendor
                legacyResourceId
                images(first: 1) {
                    edges {
                        node {
                            url
                        }
                    }
                }
                variants(first: 10) {
                    edges {
                        node {
                            id
                            price
                            title
                        }
                    }
                }
            }
        }
    }
}`;

const formalGqlResponse = (res) => {
  const edges = res?.body?.data?.products?.edges || [];
  if (!edges.length) return [];
  return edges.map(({ node }) => ({
    id: node.id,
    legacyId: node.legacyResourceId,
    title: node.title,
    productType: node.productType,
    status: node.status,
    tags: node.tags,
    totalInventory: node.totalInventory,
    vendor: node.vendor,
    description: node.description,
    image:
      node.images.edges[0]?.node?.url ||
      "https://res.cloudinary.com/dci7ukl75/image/upload/v1668552461/BYOA/709618-0320_e20ckp.jpg",
    variants: node.variants.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      price: node.price,
    })),
  }));
};

export default async function fetchProducts(session) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    const res = await client.query({
      data: {
        query: FETCH_PRODUCTS_QUERY,
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

// For Filtering Product Data
const filterProductResponse = (res) => {
  const edges = res?.body?.data?.products?.edges || [];
  return {
    products: edges
  };
};

export async function filterProduct({ session, filter }) {
  const FILTER_PRODUCT_QUERY = `{
    products(first: 50, query: "tag:'${filter}'", reverse: true) {
        edges {
            node {
                id
                description
                title
                productType
                status
                tags
                totalInventory
                vendor
                legacyResourceId
                images(first: 1) {
                    edges {
                        node {
                            url
                        }
                    }
                }
                variants(first: 10) {
                    edges {
                        node {
                            id
                            price
                            title
                        }
                    }
                }
            }
        }
    }
}`;

  const client = new shopify.api.clients.Graphql({ session });
  try {
    const res = await client.query({
      data: {
        query: FILTER_PRODUCT_QUERY,
      },
    });

    return filterProductResponse(res);
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

const fetchProductSearchResponse = (res) => {
  const edges = res?.body?.data?.products?.edges || [];
  return {
    products: edges
  };
};


export async function searchProduct({session, search}) {
  const SEARCH_PRODUCT_QUERY = `{
    products(first: 50, query: title:'${search}', reverse: true) {
      edges {
          node {
              id
              description
              title
              productType
              status
              tags
              totalInventory
              vendor
              legacyResourceId
              images(first: 1) {
                  edges {
                      node {
                          url
                      }
                  }
              }
              variants(first: 10) {
                  edges {
                      node {
                          id
                          price
                          title
                      }
                  }
              }
          }
      }
  }
  }`

  const client = new shopify.api.clients.Graphql({ session });

  try {
    const res = await client.query({
      data: {
        query: SEARCH_PRODUCT_QUERY,
      },
    });
    
    return fetchProductSearchResponse(res);
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


const FETCH_CUSTOMERS_COUNT_QUERY = `
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

const fetchCustomersCountResponse = (res) =>{
  const edges = res?.body?.data?.customers?.edges || [];
  const orderCount = edges.map(({ node }) => ({
    order: parseInt(node.numberOfOrders),
  }));
  return {
    customers: res?.body?.data.customers.edges,
    cutomersPageInfo: res?.body?.data.customers.pageInfo,
    order: orderCount,
  };
}

export async function fetchCustomersCount(session){
  const client = new shopify.api.clients.Graphql({ session });

  try {
    const res = await client.query({
      data: {
        query: FETCH_CUSTOMERS_COUNT_QUERY,
      },
    });

    console.log("Extensions:" , res.body.data);
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
