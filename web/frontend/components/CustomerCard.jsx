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
  const [customers, setCustomers] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [orderCount, setOrderCount] = useState(null);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

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

  useEffect(() => {
    if (data) {
      setIsLoadingCount(false);
      console.log({data});
      // const array = data.customers.order;
      // let total = 0;
      // for (let i = 0; i < array.length; i++) {
      //   total = total + array[i].order;
      // }
      setCustomerCount(data.customers.count);
      // setOrderCount(total);
    }
  }, [data]);

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

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
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      {toastMarkup}
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
                      // orderCount
                      12
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
      <CustomersListScript customerData={customers} pageData={pageInfo} />
    </>
  );
}
