import {
  Card,
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
  LegacyCard
} from "@shopify/polaris";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Context } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ResourcePicker } from "@shopify/app-bridge/actions";

import CustomersNotFound from "../pages/CustomerNotFound";
import Skeleton from "./Skeleton";

export default function CustomerOrder({ customerId }) {
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch();

  const [customer, setCustomer] = useState([]);

  const [orders, setOrders] = useState([]);

  const [updatedCustomer, setUpdatedCustomer] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [searchCustomerData, setSearchCustomerData] = useState([]);
  const [value, setValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [customers, setCustomers] = useState([]);

  const [showFilter, setShowFilter] = useState(false);

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const resourceName = {
    singular: "order",
    plural: "order",
  };
  const getOrders = async () => {
    const response = await fetch(`/api/orders/${customerId}`);
    const customers_order = await response.json();
    if (response.ok) {
      setCustomer(customers_order.orders.customer);
      setOrders(customers_order.orders.customer.orders.edges);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const resourceIDResolver = (orders) => {
    return orders.node.id;
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders, {
      resourceIDResolver,
    });
  /* Function for update Customers data */
  function onDelete(items) {
    handleSelectionChange("all", false);
  }

  const rowMarkup = orders.map(({ node }, index) => (
    <IndexTable.Row
      id={node.id}
      key={node.id}
      selected={selectedResources.includes(node.id)}
      position={index}
    >
      <IndexTable.Cell>
      <Link url={`/customer-order-details/${node.id.substring(node.id.lastIndexOf('/') + 1)}`}  external={false} >
        {node.name}</Link></IndexTable.Cell>
      <IndexTable.Cell>{node.createdAt}</IndexTable.Cell>
      <IndexTable.Cell fontWeight="bold">
        {node.customer.firstName + " " + node.customer.lastName}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {node.currencyCode == "INR"
          ? `Rs.${node.totalPriceSet.shopMoney.amount}`
          : ` ${node.totalPriceSet.shopMoney.amount}`}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {node.fulfillments[0].status == "SUCCESS" ? (
          <Badge progress="complete">paid</Badge>
        ) : (
          <Badge progress="complete">unpaid</Badge>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {node.displayFulfillmentStatus == "FULFILLED" ? (
          <Badge progress="complete">Fulfilled</Badge>
        ) : (
          <Badge progress="complete">Not Fulfilled</Badge>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {node.customer.numberOfOrders == "1"
          ? node.customer.numberOfOrders + " Item"
          : node.customer.numberOfOrders + " Items"}
      </IndexTable.Cell>
      <IndexTable.Cell>{node.tags}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  const promotedBulkActions = [
    {
      content: "Bulk TaxExempt",
      onAction: () => console.log("Hello"),
      loading: isLoading,
    },
  ];

  const mainIndex = (
    <IndexTable
      resourceName={resourceName}
      itemCount={orders.length}
      items={orders}
      selectedItemsCount={
        allResourcesSelected ? "All" : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      headings={[
        { title: "Order" },
        { title: "Date" },
        { title: "Customer" },
        { title: "Total" },
        { title: "Payment Status" },
        { title: "Fulfillment status" },
        { title: "Items" }
      ]}
      promotedBulkActions={promotedBulkActions}
    >
      {rowMarkup}
    </IndexTable>
  );

  return (
    <>
    <LegacyCard>
      <Frame>
        {toastMarkup}
        {orders.length > 0 ?
          mainIndex : ( <Skeleton /> )
        }
      </Frame>
    </LegacyCard>
    </>
  );
}
