import { useState, useEffect } from "react";
import {
  LegacyCard,
  Grid,
  Stack,
  Heading,
  TextStyle,
  DisplayText,
  LegacyStack,
  Spinner,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { CustomersListScript } from "./CustomerListScript";

export function CustomersCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const [customerCount, setCustomerCount] = useState(null);
  //   const [pageURL, setPageURL] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [orderCount, setOrderCount] = useState(null);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  console.log({customerCount});
  console.log({orderCount});

  const {
    data,
    refetch: refetchCustomer,
    isLoading: isLoadingCustomer,
    isRefetching: isRefetchingCustomer,
  } = useAppQuery({
    url: "/api/customers-count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  // console.log({ data });
  useEffect(() => {
    if (data) {
      setIsLoadingCount(false);
      const array = data.customers.order;
      let total = 0;
      for (let i = 0; i < array.length; i++) {
        total = total + array[i].order;
      }
      setCustomerCount(data.customers.customers.length);
      setOrderCount(total);
    }
  }, [data]);

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  //   const handlePopulate = async () => {
  //     setIsLoading(true);
  //     const response = await fetch("/api/products/create");

  //     if (response.ok) {
  //       await refetchProductCount();
  //       setToastProps({ content: "5 products created!" });
  //     } else {
  //       setIsLoading(false);
  //       setToastProps({
  //         content: "There was an error creating products",
  //         error: true,
  //       });
  //     }
  //   };

  const fetchCustomers = async () => {
    setIsLoading(true);
    const response = await fetch("/api/customers");
    setIsLoading(false);
    const custData = await response.json();
    setCustomers(custData.customers.customers);
    setPageInfo(custData.customers.cutomersPageInfo);
    const array = custData.customers.order;
    let total = 0;
    for (let i = 0; i < array.length; i++) {
      total = total + array[i].order;
    }
    // setCustomerCount(custData.customers.customers.length)
    // setOrderCount(total)
  };

  // const fetchCustomersCount = async () => {
  //   setIsLoadingCount(true);
  //   const response = await fetch("/api/customers-count");
  //   setIsLoadingCount(false);
  //   const custData = await response.json();
  //   // console.log("Customer Data =>", custData.customers);
  //   const array = custData.customers.order;
  //   let total = 0;
  //   for (let i = 0; i < array.length; i++) {
  //     total = total + array[i].order;
  //   }
  //   setCustomerCount(custData.customers.customers.length);
  //   setOrderCount(total);
  // };

  useEffect(() => {
    fetchCustomers();
    // fetchCustomersCount();
  }, []);

  return (
    <>
      {toastMarkup}

      {/* <LegacyCard title="Customers Info">
        <LegacyCard.Section>
          <p>John Smith</p>
          <p>View a summary of your online store’s performance.</p>
        </LegacyCard.Section>
      </LegacyCard> */}

      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <LegacyCard title="Customers Info" sectioned>
            <LegacyStack vertical>
              <p>Customers count below</p>
              <Heading element="h4">
                TOTAL CUSTOMERS
                <DisplayText size="medium">
                  <TextStyle variation="strong">
                    {isLoadingCount ? (
                      <Spinner
                        accessibilityLabel="Spinner example"
                        size="small"
                      />
                    ) : (
                      customerCount
                    )}
                  </TextStyle>
                </DisplayText>
              </Heading>
            </LegacyStack>
          </LegacyCard>
        </Grid.Cell>
        <Grid.Cell
          columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
          fullheight
        >
          <LegacyCard title="Orders Info" sectioned>
            <LegacyStack vertical>
              <p>Total orders of All Customers</p>

              <Heading element="h4">
                TOTAL ORDERS
                <DisplayText size="medium">
                  <TextStyle variation="strong">
                    {isLoadingCount ? (
                      <Spinner
                        accessibilityLabel="Spinner example"
                        size="small"
                      />
                    ) : (
                      orderCount
                    )}
                  </TextStyle>
                </DisplayText>
              </Heading>
            </LegacyStack>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
      <br />
      <br />
      {/* {customers.length > 0 ? (
        <CustomersListScript customerData={customers} pageData={pageInfo} />
      ) : (
        ""
      )} */}
      <CustomersListScript customerData={customers} pageData={pageInfo} />
    </>
  );
}
