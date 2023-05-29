import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify";
// const FETCH_CUSTOMERS_QUERY = `
// {
//     customers(first:50) {
//          edges {
//            node {
//              id
//              firstName
//              lastName
//              email
//              phone
//              createdAt
//              updatedAt
//              taxExempt
//              tags
//              taxExemptions
//              numberOfOrders
//              addresses {
//                  address1
//                  address2
//                  city
//              }
//            }
//            cursor
//         }
//            pageInfo {
//              endCursor
//              hasNextPage
//              hasPreviousPage
//              startCursor
//            }
//        }
//       }`;
    
// const formalGqlResponse = (res) => {
//   // console.log("Customers...", res?.body?.data.customers);
// // console.log("Pagination =>", res?.body?.data.customers.pageInfo);
//   const edges = res?.body?.data?.customers?.edges || [];

//   // return res?.body?.data.customers || []
//   // if(!edges.length) return [];
//   const orderCount = edges.map(({ node }) => ({
//     order: parseInt(node.numberOfOrders),
//   }));
//   return {
//     customers: res?.body?.data.customers.edges,
//     cutomersPageInfo: res?.body?.data.customers.pageInfo,
//     order: orderCount,
//   };
//   // return edges.map(({ node }) => ({

//   //     id: node.id,
//   //     legacyId: node.legacyResourceId,
//   //     title: node.title,
//   //     description: node.description,
//   //     image: node.images.edges[0]?.node?.url ||
//   //     "https://res.cloudinary.com/dci7ukl75/image/upload/v1668552461/BYOA/709618-0320_e20ckp.jpg",
//   //     variants: node.variants.edges.map(({node}) => ({
//   //         id: node.id,
//   //         title: node.title,
//   //         price: node.price,
//   //     })),
//   // }));
// };

// export default async function fetchCutomers(session) {
//   const client = new Shopify.Clients.Graphql(
//     session?.shop,
//     session?.accessToken
//   );

//   try {
//     const res = await client.query({
//       data: {
//         query: FETCH_CUSTOMERS_QUERY,
//       },
//     });
//     return formalGqlResponse(res);
//   } catch (error) {
//     if (error instanceof Shopify.Errors.GraphqlQueryError) {
//       throw new Error(
//         `${error.message}\n${JSON.stringify(error.response, null, 2)}`
//       );
//     } else {
//       throw error;
//     }
//   }
// }

/**
 * Get Customer Count
 * Date: 15/05/2023
 * Aman Solanki
 */
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

export default async function fetchCustomersCount(session){
  const client = new shopify.api.clients.Graphql({ session });

  try {
    const res = await client.query({
      data: {
        query: FETCH_CUSTOMERS_COUNT_QUERY,
      },
    });

    console.log("Extensions:" , res.body.data);
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
    // const client = new shopify.api.clients.Graphql({ session });
    // console.log({client});
    // try {
    //   const res = await client.query({
    //     data: {
    //       query: FETCH_CUSTOMERS_COUNT_QUERY,
    //     },
    //   });
  
    //   console.log({res});
    //   // console.log("Extensions:" , res.body.extensions);
    //   return fetchCustomersCountResponse(res);

    // } catch (error) {
    //   if (error instanceof GraphqlQueryError) {
    //     throw new Error(
    //       `${error.message}\n${JSON.stringify(error.response, null, 2)}`
    //     );
    //   } else {
    //     throw error;
    //   }
    // }


}


// /**
//  * Date: 10/05/2023
//  * Aman Solanki
//  * Next Customer list for Pagination */

// const fetchNextCustomerResponse = (res) => {
//   const edges = res?.body?.data?.customers?.edges || [];
//   return {
//     customers: edges,
//     cutomersPageInfo: res?.body?.data.customers.pageInfo,
//   };
// }


// export async function fetchNextCutomers({session, first, after}) {
//   const client = new Shopify.Clients.Graphql(
//     session?.shop,
//     session?.accessToken
//   );

// // customers(first:${first}, after:\"${after}\") {  
// // customers($first:int, $after:string) {
// //   customers(first:$first, after:$after) {
// const FETCH_NEXT_CUSTOMER_QUERY = `
// {
//       customers(first:${first}, after:\"${after}\") {
//          edges {
//            node {
//              id
//              firstName
//              lastName
//              email
//              phone
//              createdAt
//              updatedAt
//              taxExempt
//              tags
//              taxExemptions
//              numberOfOrders
//              addresses {
//                  address1
//                  address2
//                  city
//              }
//            }
//            cursor
//         }
//            pageInfo {
//              endCursor
//              hasNextPage
//              hasPreviousPage
//              startCursor
//            }
//           }
//         }`;


//   try {
//     const res = await client.query({
//       data: {
//         query: FETCH_NEXT_CUSTOMER_QUERY,
//       },
//     });

//     // console.log(res.headers.raw());

//     return fetchNextCustomerResponse(res);  
//   } catch (error) {
//     if (error instanceof Shopify.Errors.GraphqlQueryError) {
//       throw new Error(
//         `${error.message}\n${JSON.stringify(error.response, null, 2)}`
//       );
//     } else {
//       throw error;
//     }
//   }
// }

// /**
//  * Get Customers list for Previous Page
//  * @param {*} res 
//  * @returns 
//  */

// const fetchPreviousCustomersResponse = (res) => {
//   const edges = res?.body?.data?.customers?.edges || [];
//   return {
//     customers: edges,
//     cutomersPageInfo: res?.body?.data.customers.pageInfo,
//   };
// }


// export async function fetchPreviousCustomers({session, last, before}) {
//   const client = new Shopify.Clients.Graphql(
//     session?.shop,
//     session?.accessToken
//   );

//   console.log({before});
//   console.log({last});

// // customers(first:${first}, after:\"${after}\") {  
// // customers($first:int, $after:string) {
// //   customers(first:$first, after:$after) {
// const FETCH_PREVIOUS_CUSTOMER_QUERY = `{
//       customers(last:${last}, before: \"${before}"\) {
//          edges {
//            node {
//              id
//              firstName
//              lastName
//              email
//              phone
//              createdAt
//              updatedAt
//              taxExempt
//              tags
//              taxExemptions
//              numberOfOrders
//              addresses {
//                  address1
//                  address2
//                  city
//              }
//            }
//            cursor
//         }
//            pageInfo {
//              endCursor
//              hasNextPage
//              hasPreviousPage
//              startCursor
//            }
//           }
//         }`;


//   try {
//     const res = await client.query({
//       data: {
//         query: FETCH_PREVIOUS_CUSTOMER_QUERY,
//       },
//     });

//     // console.log(res.headers.raw());

//     return fetchPreviousCustomersResponse(res);
//   } catch (error) {
//     if (error instanceof Shopify.Errors.GraphqlQueryError) {
//       throw new Error(
//         `${error.message}\n${JSON.stringify(error.response, null, 2)}`
//       );
//     } else {
//       throw error;
//     }
//   }
// }

// const fechSearchCustomersResponse = (res) => {
//   const edges = res?.body?.data?.customers?.edges || [];
//   const orderCount = edges.map(({ node }) => ({
//     order: parseInt(node.numberOfOrders),
//   }));
//   return {
//     customers: res?.body?.data.customers.edges,
//     cutomersPageInfo: res?.body?.data.customers.pageInfo,
//     order: orderCount,
//   };
// };

// export async function searchCustomers({ session, search }) {
//   const SEARCH_CUSTOMERS_QUERY = `
// {
//     customers(first:5, query: "firstName:'${search}' lastName:'${search}' email:'${search}' ") {
//          edges {
//            node {
//              id
//              firstName
//              lastName
//              email
//              phone
//              createdAt
//              updatedAt
//              taxExempt
//              tags
//              taxExemptions
//              numberOfOrders
//              addresses {
//                  address1
//                  address2
//                  city
//              }
//            }
//            cursor
//         }
//            pageInfo {
//              endCursor
//              hasNextPage
//              hasPreviousPage
//              startCursor
//            }
//        }
//  }`;

//   const client = new Shopify.Clients.Graphql(
//     session?.shop,
//     session?.accessToken
//   );

//   try {
//     const res = await client.query({
//       data: {
//         query: SEARCH_CUSTOMERS_QUERY,
//       },
//     });

//     return fechSearchCustomersResponse(res);
//   } catch (error) {
//     if (error instanceof Shopify.Errors.GraphqlQueryError) {
//       throw new Error(
//         `${error.message}\n${JSON.stringify(error.response, null, 2)}`
//       );
//     } else {
//       throw error;
//     }
//   }
// }

// // Function for filter the data by Tags

// const fetchFilterCustomersResponse = (res) => {
//   const edges = res?.body?.data?.customers?.edges || [];
//   const orderCount = edges.map(({ node }) => ({
//     order: parseInt(node.numberOfOrders),
//   }));
//   return {
//     customers: res?.body?.data.customers.edges,
//     cutomersPageInfo: res?.body?.data.customers.pageInfo,
//     order: orderCount,
//   };
// };

// export async function filterCustomomer({ session, filter }) {
  
//   const FILTER_CUSTOMER_QUERY = `
// {
//     customers(first:5, query: "tag:'${filter}'") {
//          edges {
//            node {
//              id
//              firstName
//              lastName
//              email
//              phone
//              createdAt
//              updatedAt
//              taxExempt
//              tags
//              taxExemptions
//              numberOfOrders
//              addresses {
//                  address1
//                  address2
//                  city
//              }
//            }
//            cursor
//         }
//            pageInfo {
//              endCursor
//              hasNextPage
//              hasPreviousPage
//              startCursor
//            }
//        }
//  }`;

//   const client = new Shopify.Clients.Graphql(
//     session?.shop,
//     session?.accessToken
//   );

//   try {
//     const res = await client.query({
//       data: {
//         query: FILTER_CUSTOMER_QUERY,
//       },
//     });

//     return fetchFilterCustomersResponse(res);
//   } catch (error) {
//     if (error instanceof Shopify.Errors.GraphqlQueryError) {
//       throw new Error(
//         `${error.message}\n${JSON.stringify(error.response, null, 2)}`
//       );
//     } else {
//       throw error;
//     }
//   }
// }
