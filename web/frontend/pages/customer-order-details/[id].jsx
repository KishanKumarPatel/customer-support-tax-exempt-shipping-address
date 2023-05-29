import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Heading,
  Spinner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import CustomerOrderdetails from "../../components/CustomerOrderdetails";
import Skeleton from "../../components/Skeleton";
// import CustomerOrder from "../components/CustomerOrderList";

export default function CustomerOrderDetails() {
  //  console.log({customerId});
  const { id } = useParams();
  const [orderData, setOrderData] = useState([]);
  console.log({ id });

  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch();

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: `/api/order/${id}`,
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  var custId = "";
  var orderName = "";
  if (data != null) {
    const customerId = data.orders.order.customer.id;
    orderName = data.orders.order.name;
    console.log("Orders details =>", data.orders.order);
    custId = customerId.substring(customerId.lastIndexOf("/") + 1);
  }
  console.log({custId});
  return (
    <Page
      breadcrumbs={[{ content: "Orders", url: `/customer-order/${custId}` }]}
      title={`Order: ${orderName}`}
      divider
    >
      <TitleBar title="Customer Order Detail" primaryAction={null} />
      <Layout>
        <Layout.Section>
          {data != undefined ? (
            <CustomerOrderdetails orderId={id} orderData={data} />
          ) : (
            // <div style={{ alignItems: "center", width: "5%" }}>
            //   <Spinner
            //     accessibilityLabel="Spinner example"
            //     size="large"
            //     align="center"
            //   />
            // </div>
            <Skeleton />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
