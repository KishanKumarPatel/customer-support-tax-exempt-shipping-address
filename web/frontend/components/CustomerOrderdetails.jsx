import {
  LegacyCard,
  Toast,
  Stack,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  Grid,
  IndexTable,
  useIndexResourceState,
  ResourceItem,
  Link,
  Button,
  Badge,
  Frame,
  Modal,
  Pagination,
  Spinner,
  TextField,
  Icon,
  Page,
  Layout,
  Thumbnail,
  ActionList,
  Popover,
  Form,
  FormLayout,
  Select,
} from "@shopify/polaris";
import {
  FulfillmentFulfilledMajor,
  MobileHorizontalDotsMajor,
  CircleTickMinor,
} from "@shopify/polaris-icons";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Context } from "@shopify/app-bridge-react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ResourcePicker } from "@shopify/app-bridge/actions";
import { trophyImage } from "../assets";
import CustomersNotFound from "../pages/CustomerNotFound";

export default function CustomerOrderdetails({ orderId, orderData }) {
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [isLoading, setIsLoading] = useState(true);
  const [isSet, setIsSet] = useState(false);
  const fetch = useAuthenticatedFetch();
  const [customer, setCustomer] = useState({});
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isOrderData, setIsOrderData] = useState(false);
  const [countrylist, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);

  const reformattedArray = countrylist.map(({ id, name, code, provinces }) => ({
    label: name,
    value: name,
    id: id,
    code: code,
    provinces: provinces,
  }));

  if (stateList.length == 0 || stateList == undefined) {
    let provincelist = reformattedArray.filter(function (el) {
      return el.label == "India";
    });
    if (provincelist.length > 0) {
      setStateList(provincelist);
    }
  }

  if (stateList.length > 0) {
    var stateOptions = stateList[0].provinces.map(
      ({ id, country_id, code, name }) => ({
        label: name,
        value: name,
        id: id,
        code: code,
        country_id: country_id,
      })
    );
  }

  /* This is for modal  form */
  const [active, setActive] = useState(false);
  const [isError, setIsError] = useState(false);

  /* This message for Error */
  const toastMessage = isError ? (
    <Toast content="We are processing your request!" />
  ) : null;

  const handleChange = () => {
    setIsSet(true);
  };

  const handleClose = () => {
    setIsSet(false);
  };

  const [selected, setSelected] = useState(null);
  const [firstName, setFirstName] = useState(orderData.orders.order.shippingAddress.firstName);
  const [lastName, setLastName] = useState(orderData.orders.order.shippingAddress.lastName);
  const [company, setCompany] = useState(orderData.orders.order.shippingAddress.company);
  const [address, setAddress] = useState(orderData.orders.order.shippingAddress.address1);
  const [addressTwo, setAddressTwo] = useState(orderData.orders.order.shippingAddress.address2);
  const [city, setCity] = useState(orderData.orders.order.shippingAddress.city);
  const [province, setProvince] = useState(orderData.orders.order.shippingAddress.province);
  const [zip, setPINCode] = useState(orderData.orders.order.shippingAddress.zip);
  const [phone, setPhone] = useState(orderData.orders.order.shippingAddress.phone);
  const [orderformData, setFormData] = useState([]);
  const [isProvince, setIsProvince] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState([]);
  const [isUpdatedAddr, setIsUpdatedAddr] = useState(false);

  /* ----------------------- */
  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const resourceName = {
    singular: "order",
    plural: "order",
  };

  const getOrderById = async () => {
    setIsLoading(true);
    setIsOrderData(false);
    const response = await fetch(`/api/order/${orderId}`);
    setIsLoading(false);
    const order = await response.json();
    if (response.ok) {
      setOrderDetails(order.orders.order);
      setIsOrderData(true);
    } else {
      setIsOrderData(false);
    }
  };

  const getCountryList = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/get-country`);
    setIsLoading(false);
    const country = await response.json();
    if (response.ok) {
      setCountryList(country.country.countries);
    }
  };
  useEffect(() => {
    getOrderById();
    getCountryList();
  }, []);

  const date = new Date(orderDetails.createdAt).toLocaleString(undefined, {
    timeZone: "Asia/Kolkata",
  });

  const discardToastMessage = () => {
    setIsError(false);
    setIsSet(false);
  };

  const shippingAddr = async (formdata) => {
    const response = await fetch(
      `/api/update-order?id=${orderId}&firstName=${formdata.firstName}&lastName=${formdata.lastName}&address=${formdata.address}&addressTwo=${formdata.addressTwo}&city=${formdata.city}&phone=${formdata.phone}&province=${formdata.province}&company=${formdata.company}&country=${formdata.country}&zip=${formdata.zip}`
    );
    const updatedOrd = await response.json();
    if (response.status == 429) {
      setIsError(true);
      setIsSet(true);
      setTimeout(discardToastMessage, 3000); //execute greet after 2000 milliseconds (2 seconds)
    } else {
      if (response.ok) {
        setUpdatedOrder(updatedOrd.orders.order);
        setIsUpdatedAddr(true);
        setIsError(false);
      }
    }

  };

  const activatioShippingAddr = () => {
    setIsSet(true);
  };

  const handleSelectChange = useCallback((value, id) => {
    setSelected(value);

    let provincelist = reformattedArray.filter(function (el) {
      return el.label == value;
    });
    if (
      provincelist != null ||
      provincelist != "" ||
      provincelist != undefined
    ) {
      setStateList(provincelist);
    }
  }, []);

  const handleFirstName = useCallback((newValue) => {
    setFirstName(newValue);
  }, []);

  const handleLastName = useCallback((newValue) => {
    setLastName(newValue);
  }, []);

  const handleCompany = useCallback((newValue) => {
    setCompany(newValue);
  }, []);

  const handleAddress = useCallback((newValue) => {
    setAddress(newValue);
  }, []);

  const handleAddressTwo = useCallback((newValue) => {
    setAddressTwo(newValue);
  }, []);

  const handleCity = useCallback((newValue) => {
    setCity(newValue);
  }, []);

  const handleProvince = useCallback((newValue) => {
    setProvince(newValue);
  }, []);

  const handlePINCode = useCallback((newValue) => {
    setPINCode(newValue);
  }, []);

  const handlePhone = useCallback((newValue) => {
    setPhone(newValue);
  }, []);

  var formArr = [];
  const handleSubmit = (event) => {
    event.preventDefault();
    handleClose();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    formArr.push(formValues);
    if (formArr.length > 0) {
      setFormData(formArr[0]);
      shippingAddr(formArr[0]);
    }
  };

  var billingAddressArr = [];

  const mainRowData =
    (orderDetails.length > 0 || orderDetails != null) && isOrderData ? (
      <>
        <LegacyCard
          title={
            orderDetails.displayFulfillmentStatus == "FULFILLED"
              ? "Fulfilled" + ` (${orderDetails.lineItems.edges.length})`
              : orderDetails.displayFulfillmentStatus
          }
          sectioned
        >
          <LegacyCard.Section>
            <div style={{display: "flex", width: "100%", marginLeft: "0px"}}>
              <Icon source={FulfillmentFulfilledMajor} backdrop />
              
              <TextContainer>
                  <TextStyle variation="strong">{orderDetails.displayFulfillmentStatus}</TextStyle> {"  "}
                <TextStyle variation="strong">{date}</TextStyle>
              
              </TextContainer>
              <br />
              
            </div>
            <br />
            <div style={{ display: "flex", width: "100%"}}>
                <div style={{width: "100%"}}>
                {orderDetails.lineItems.edges.map((node, index) => (
                  <>
                    <div
                      className="cover"
                      style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center",marginBottom: "18px"}}
                    >

                      <div style={{display: "flex"}}>
                        {node.node.image ? 
                        <Thumbnail
                          source={node.node.image.url}
                          size="small"
                          alt="Black orange scarf"
                        /> : 
                        <Thumbnail
                          source={trophyImage}
                          size="small"
                          alt="Black orange scarf"
                        /> }
                        <br />
                      </div>
                      <div>
                        <Link>{node.node.name}</Link>
                        <br />
                      </div>
                      <div>
                        {node.node.originalTotalSet.shopMoney.currencyCode ==
                        "INR"
                          ? "₹" +
                            node.node.originalTotalSet.shopMoney.amount +
                            " x " +
                            node.node.currentQuantity
                          : "$" + node.node.originalTotalSet.shopMoney.amount}
                      </div>
                      <div>
                      {node.node.originalTotalSet.shopMoney.currencyCode ==
                        "INR"
                          ? "₹" +
                            node.node.originalTotalSet.shopMoney.amount 
                          : "$" + node.node.originalTotalSet.shopMoney.amount}
                      </div>
                    </div>
                  </>
                ))}
                </div>
            </div>
          
          </LegacyCard.Section>
        </LegacyCard>
        <LegacyCard>
          <LegacyCard.Section>
            <IndexTable.Cell>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Icon
                    source={CircleTickMinor}
                    color="success"
                    backdrop
                    accessibilityLabel=""
                  />
                </div>
                <div style={{ marginLeft: "10px" }}>
                  {orderDetails.fullyPaid === true ? (
                    <TextContainer>
                      <TextStyle variation="strong">Paid</TextStyle>
                    </TextContainer>
                  ) : (
                    "Pending"
                  )}
                </div>
              </div>
            </IndexTable.Cell>
            <br />
            <div style={{ display: "flex", width: "100%", marginLeft: "15px" }}>
              <div
                className="cover_paid"
                style={{ display: "flex", width: "100%" }}
              >
                <div style={{ flex: "0 0 80%", width: "100%" }}>
                  <TextContainer>
                    <TextStyle variation="strong">Subtotal</TextStyle>
                  </TextContainer>
                </div>
                <div
                  style={{ flex: "0 0 20%", width: "100%", marginLeft: "15px" }}
                >
                  {orderDetails.lineItems.edges.length}{" "}
                  {orderDetails.lineItems.edges.length > 1 ? "Items" : "Item"}
                </div>
              </div>
              </div>
            <br />
            <div style={{ display: "flex",  width: "100%",  marginLeft: "15px" }}>
              <div style={{ flex: "0 0 80%", width: "100%" }}>
                <TextContainer>
                  <TextStyle variation="strong">Total</TextStyle>
                </TextContainer>
              </div>
              <div
                style={{ flex: "0 0 20%", width: "100%", marginLeft: "15px" }}
              >
                <TextStyle variation="strong">
                  {orderDetails.currencyCode
                    ? "₹" + orderDetails.totalPriceSet.shopMoney.amount
                    : "$" + orderDetails.totalPriceSet.shopMoney.amount}
                </TextStyle>
              </div>
            </div>
          </LegacyCard.Section>
        </LegacyCard>
      </>
    ) : (
      <LegacyCard title="Please wait" sectioned>
        <LegacyCard.Section>
          <Spinner accessibilityLabel="Spinner example" size="large" />;
        </LegacyCard.Section>
      </LegacyCard>
    );

  const addressRowData =
    updatedOrder.length == 0 || updatedOrder.length < 0 ? (
      ""
    ) : (
      <>
        <LegacyCard.Section
          title="Shipping address"
          actions={[{ content: "Edit", onAction: activatioShippingAddr }]}
        >
          <TextStyle variation="subdued" color="subdued" as="span">
            {updatedOrder.shipping_address.first_name.trim() +
              " " +
              updatedOrder.shipping_address.last_name.trim()}
            <br />
            {updatedOrder.shipping_address.address1
              ? updatedOrder.shipping_address.address1
              : "" }
            <br />
            {updatedOrder.shipping_address.address2
              ? updatedOrder.shipping_address.address2
              : ""}{" "}
            <br />
            {updatedOrder.shipping_address.zip}{" "}
            {updatedOrder.shipping_address.city}{" "}
            {updatedOrder.shipping_address.province} <br />
            {updatedOrder.shipping_address.country} <br />
            {updatedOrder.shipping_address.phone}
           
          </TextStyle>
        </LegacyCard.Section>
      </>
    );

  const secondRowData =
    (orderDetails.length > 0 || orderDetails != null) && isOrderData ? (
      <LegacyCard title="Customer">
        <LegacyCard.Section>
          <TextContainer spacing="loose">
            <TextStyle variation="subdued" color="subdued" as="span">
              <Link>
                {orderDetails.customer.firstName.trim() +
                  " " +
                  orderDetails.customer.lastName.trim()}
              </Link>
            </TextStyle>
            <br />
            <TextStyle variation="subdued" color="subdued" as="span">
              <Link>
                {orderDetails.customer.numberOfOrders == "1"
                  ? orderDetails.customer.numberOfOrders + " order"
                  : orderDetails.customer.numberOfOrders + " orders"}
              </Link>
            </TextStyle>
          </TextContainer>
        </LegacyCard.Section>
        <LegacyCard.Section title="Contact information">
          <TextStyle variation="subdued" color="subdued" as="span">
            <Link>{orderDetails.customer.email}</Link> <br />
            {orderDetails.customer.phone}
          </TextStyle>
        </LegacyCard.Section>

        {isSet && !isError ? (
          <LegacyCard.Section
            title="Shipping address"
            actions={[{ content: "Edit", onAction: activatioShippingAddr }]}
          >
            <div style={{ height: "500px" }}>
              <Modal
                open={isSet}
                onClose={handleClose}
                title="Edit shipping address"
                fullWidth
              >
                <Modal.Section>
                  <TextContainer>
                    <Form onSubmit={handleSubmit}>
                      <FormLayout>
                        
                        <Select
                          label="Country/region"
                          name="country"
                          options={reformattedArray}
                          onChange={handleSelectChange}
                          value={
                            selected == null
                              ? orderDetails.shippingAddress.country
                              : selected
                          }
                          id={reformattedArray.filter(
                            (el) => el.label == selected
                          )}
                        />
                        <TextField
                          label="First Name"
                          name="firstName"
    
                          value={firstName}
                          onChange={handleFirstName}
                          autoComplete="off"
                        />
                        <TextField
                          label="Last Name"
                          name="lastName"
       
                          value={lastName}
                          onChange={handleLastName}
                          autoComplete="off"
                        />
                        <TextField
                          label="Company"
                          name="company"
           
                          value={company}
                          onChange={handleCompany}
                          autoComplete="off"
                        />
                        <TextField
                          label="Address"
                          name="address"
                          autoComplete="off"
   
                          value={address}
                          onChange={handleAddress}
                        />
                        <TextField
                          label="Apartment, suite, etc."
                          name="addressTwo"
        
                          value={addressTwo}
                          onChange={handleAddressTwo}
                        />
                        <TextField
                          label="City"
                          name="city"
           
                          value={city}
                          onChange={handleCity}
                        />
                        <Select
                          label="State"
                          name="province"
                          options={stateOptions}
                          onChange={handleProvince}
                    
                          value={province}
                        />
                        <TextField
                          label="PIN Code"
                          name="zip"
                       
                          value={zip}
                          onChange={handlePINCode}
                        />
                       
                        <TextField
                          label="Phone"
                          name="phone"
                         
                          value={phone}
                          onChange={handlePhone}
                        />
                        <Button submit primary>
                          Submit
                        </Button>
                      </FormLayout>
                    </Form>
                  </TextContainer>
                </Modal.Section>
              </Modal>
            </div>
          </LegacyCard.Section>
        ) : isUpdatedAddr ? (
          addressRowData
        ) : (
          <LegacyCard.Section
            title="Shipping address"
            actions={[{ content: "Edit", onAction: activatioShippingAddr }]}
          >
            <TextStyle variation="subdued" color="subdued" as="span">
              {orderDetails.shippingAddress.firstName.trim() +
                " " +
                orderDetails.shippingAddress.lastName.trim()}
              <br />
              {orderDetails.shippingAddress.address1
                ? orderDetails.shippingAddress.address1
                : ""}
                <br />
              {orderDetails.shippingAddress.address2
                ? orderDetails.shippingAddress.address2
                : ""}{" "}
              <br />
              {orderDetails.shippingAddress.zip}{" "}
              {orderDetails.shippingAddress.city}{" "}
              {orderDetails.shippingAddress.province} <br />
              {orderDetails.shippingAddress.country} <br />
              {orderDetails.shippingAddress.phone}
          
            </TextStyle>
          </LegacyCard.Section>
        )}
        {isError ? (
          <div style={{ alignItems: "center", height: "0px", width: "1%" }}>
            <Frame>{toastMessage}</Frame>
          </div>
        ) : (
          ""
        )}

        {updatedOrder.length == 0 ? (
          <LegacyCard.Section title="Billing address">
            {orderDetails.billingAddress.firstName.trim() ==
              orderDetails.shippingAddress.firstName.trim() &&
            orderDetails.billingAddress.lastName.trim() ==
              orderDetails.shippingAddress.lastName.trim() &&
            orderDetails.billingAddress.address1 ==
              orderDetails.shippingAddress.address1 &&
              // orderDetails.billingAddress.address2 ==
              // orderDetails.shippingAddress.address2 &&
            orderDetails.billingAddress.zip ==
              orderDetails.shippingAddress.zip &&
            orderDetails.billingAddress.country ==
              orderDetails.shippingAddress.country &&
            orderDetails.billingAddress.phone ==
              orderDetails.shippingAddress.phone ? (
              "Same as Shipping Address"
            ) : (
              <TextStyle variation="strong" color="subdued" as="span">
                {orderDetails.billingAddress.firstName.trim() +
                  " " +
                  orderDetails.billingAddress.lastName.trim()}
                <br />
                {orderDetails.billingAddress.address1
                  ? orderDetails.billingAddress.address1
                  : ""}
                  <br />
                {orderDetails.billingAddress.address2
                  ? orderDetails.billingAddress.address2
                  : ""}{" "}
                <br />
                {orderDetails.billingAddress.zip}{" "}
                {orderDetails.billingAddress.city}{" "}
                {orderDetails.billingAddress.province} <br />
                {orderDetails.billingAddress.country} <br />
                {orderDetails.billingAddress.phone}
              </TextStyle>
            )}
          </LegacyCard.Section>
        ) : (
          <LegacyCard.Section title="Billing address">
            {updatedOrder.billing_address.first_name.trim() ==
              updatedOrder.shipping_address.first_name.trim() &&
            updatedOrder.billing_address.last_name.trim() ==
              updatedOrder.shipping_address.last_name.trim() &&
            updatedOrder.billing_address.address1 ==
              updatedOrder.shipping_address.address1 &&
            // updatedOrder.billing_address.address2 ==
            // updatedOrder.shipping_address.address2 &&
            updatedOrder.billing_address.zip ==
              updatedOrder.shipping_address.zip &&
            updatedOrder.billing_address.country ==
              updatedOrder.shipping_address.country &&
            updatedOrder.billing_address.phone ==
              updatedOrder.shipping_address.phone ? (
              "Same as Shipping Address"
            ) : (
              <TextStyle variation="strong" color="subdued" as="span">
                {orderDetails.billingAddress.firstName.trim() +
                  " " +
                  orderDetails.billingAddress.lastName.trim()}
                <br />
                {orderDetails.billingAddress.address1
                  ? orderDetails.billingAddress.address1
                  : ""}
                <br />
                {orderDetails.billingAddress.address2
                  ? orderDetails.billingAddress.address2
                  : ""}{" "}
                <br />
                {orderDetails.billingAddress.zip}{" "}
                {orderDetails.billingAddress.city}{" "}
                {orderDetails.billingAddress.province} <br />
                {orderDetails.billingAddress.country} <br />
                {orderDetails.billingAddress.phone}
              </TextStyle>
            )}
          </LegacyCard.Section>
        )}
      </LegacyCard>
    ) : (
      <LegacyCard title="Please wait" sectioned>
        <LegacyCard.Section>
          <Spinner accessibilityLabel="Spinner example" size="large" />;
        </LegacyCard.Section>
      </LegacyCard>
    );

  return (
    <Page fullWidth>
      <TitleBar title={orderDetails.name} primaryAction={null} />
      <Layout>
        <Layout.Section oneHalf>{mainRowData}</Layout.Section>
        <Layout.Section oneThird>{secondRowData}</Layout.Section>
      </Layout>
    </Page>
  );
}
