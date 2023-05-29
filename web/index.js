// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
// import { WebhookRegistry, APP_UNINSTALLED } from '@shopify/koa-shopify-webhooks';
import { AppInstallations } from "./app_installations.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import fetchProducts from "./product-list.js";
import {
  fetchCustomersCount,
  fetchCutomers,
  fetchNextCutomers,
  fetchPreviousCustomers,
  filterCustomomer,
  searchCustomers,
} from "./helpers/fetch-customers.js";
import updateCustomers from "./helpers/update-customers.js";
import fetchOrders, { getAllOrdersByCustomer, getCountryList, getOrderById, updateOrder } from "./helpers/fetch-order.js";
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
//   path: "/api/webhooks",
//   webhookHandler: async (_topic, shop, _body) => {
//     await AppInstallations.delete(shop);
//   },
// });

// Create an instance of WebhookRegistry
// const webhookRegistry = new WebhookRegistry();

// // Register the "APP_UNINSTALLED" webhook handler
// webhookRegistry.register({
//   topic: APP_UNINSTALLED,
//   address: '/api/webhooks',
//   onReceived: async (ctx) => {
//     const { shop } = ctx.state.webhook.payload;
//     await AppInstallations.delete(shop);
//     ctx.status = 200;
//   },
// });

// shopify.api.webhooks.addHandlers("APP_UNINSTALLED",
// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

// Get Customers list
app.get("/api/customers-count", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const customers = await fetchCustomersCount(res.locals.shopify.session);
    res.status(status).send({ customers });
  } catch (e) {
    console.log(`Failed to get customers count: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send({ error });
  }
});

// Get Customers list
// Get All Customers Date: 19/05/2023 by Aman Solanki
app.get("/api/customers", async (req, res) => {
  let error = null;
  try {
    const customers = await fetchCutomers(res.locals.shopify.session);
    res.status(200).send({ customers });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

/**
 * Update Customer
 * Date: 19/05/2023
 * Aman Solanki
 */

// Get All Customers Date: 19/04/2023 &  21/04/2023 by Aman Solanki
app.get("/api/bulk-update-customers", async (req, res) => {
  let error = null;
  let session = res.locals.shopify.session;
  const customersIds = req.query;
  let newCustID = customersIds.ids.split(",");
  try {
    const bulkUpdateCustomers = await updateCustomers({ session, newCustID });
    res.status(200).send({ bulkUpdateCustomers });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

// Search Customers Date: 20/04/2023 by Aman Solanki
app.get("/api/search-customers", async (req, res) => {
  let error = null;
  let session = res.locals.shopify.session;
  let search = req.query.ids;
  try {
    const search_customer = await searchCustomers({ session, search });
    res.status(200).send({ search_customer });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

/**
 * Get Customers for next page
 * Date: 19/05/2023
 * Aman Solanki
 */
// Get Customers for Next Page
app.get("/api/next-customers", async (req, res) => {
  let error = null;

  // console.log("Request =>", req.query);
  let first = req.query.first;
  let after = req.query.after;
  let session = res.locals.shopify.session;
  // const customers = await fetchNextCutomers({ session, first, after });

  try {
    const customers = await fetchNextCutomers({ session, first, after });

    // const customers = await fetchCutomers(res.locals.shopify.session);
    res.status(200).send({ customers });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

// Get Customers for Next Page
app.get("/api/privious-customers", async (req, res) => {
  let error = null;

  let last = req.query.last;
  let before = req.query.before;
  let session = res.locals.shopify.session;
  try {
    const customers = await fetchPreviousCustomers({ session, last, before });
    res.status(200).send({ customers });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

// Filter Customer Data
/**
 * Filter Customer Data
 * Date: 22/05/2023
 * Aman Solankis
 * */
app.get("/api/filter-customer", async (req, res) => {
  let error = null;
  let session = res.locals.shopify.session;
  let filter = req.query.ids;
  try {
    const customers = await filterCustomomer({ session, filter });
    res.status(200).send({ customers });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

/**
 * Fetch Orders list
 * Date: 28/05/2023
 * Aman Solanki
 */
app.get("/api/orders", async (req, res) => {
  let error = null;
  let session = res.locals.shopify.session;
  try {
    const orderData = await fetchOrders(session);
    res.status(200).send({ orderData });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

/**
 * Fetch Customer Order By Id
 */
// Fetch Customer  Order By Id created By Aman Solanki on Date: 1/05/2023
app.get("/api/order/:id", async (req, res) => {
  let error = null;
  let session = res.locals.shopify.session;
  let orderId = req.params.id;
  try {
    const orders = await getOrderById({ session, orderId });
    res.status(200).send({ orders });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

/**
 * 
 */

 // Fetch Order Data Date: 28/04/2023
 app.get("/api/orders/:id", async (req, res) => {

  let error = null;
  let session = res.locals.shopify.session;
  let customerId = req.params.id;
  try {
    // const orders = await ({ session, customerId });

    const orders = await getAllOrdersByCustomer({ session, customerId });
  res.status(200).send({ orders });
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }

 });

 // Update customer address after Ordered
 app.get("/api/update-order", async (req, res) => {
  let error = null;
  let session = res.locals.shopify.session;

  let orderId = req.query.id;
  let firstName = req.query.firstName;
  let lastName = req.query.lastName;
  let address = req.query.address;
  let addressTwo = req.query.addressTwo;
  let city = req.query.city;
  let phone = req.query.phone;
  let province = req.query.province;
  let company = req.query.company;
  let country = req.query.country;
  let zip = req.query.zip;

 

  try {
    const orders = await updateOrder({
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
    });
    // console.log({orders});
    // res.status(200).send({ orders });
  
    if (orders == undefined) {
      res.status(429).send({ orders });
    } else {
      res.status(200).send({ orders });
    }
  } catch (e) {
    console.log(`Failed to get customers: ${e.message}`);
    error = e.message;
    res.status(500).send({ error });
  }
});

  // Get Country Code
  app.get("/api/get-country", async (req, res) => {
    let error = null;
    let session = res.locals.shopify.session;
  
   

    try {
      const country = await getCountryList(session);
      // console.log({orders});
      // res.status(200).send({ orders });
  
      res.status(200).send({ country });
    } catch (e) {
      console.log(`Failed to get customers: ${e.message}`);
      error = e.message;
      res.status(500).send({ error });
    }
  });



app.get("/api/products/prooduct-list", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    const products = await fetchProducts(res.locals.shopify.session);
    res.status(status).send({ products });
  } catch (e) {
    console.log(`Failed to get products: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send({ error });
  }
  // res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
