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
} from "@shopify/polaris";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Context } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ResourcePicker } from "@shopify/app-bridge/actions";

import CustomersNotFound from "../pages/CustomerNotFound";
export function OrderList({id}) {

  console.log({id});

  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch();
  const [updatedCustomer, setUpdatedCustomer] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [searchCustomerData, setSearchCustomerData] = useState([]);
  const [value, setValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [customers, setCustomers] = useState([]);
  // console.log({customers});


  // For Orders

  const [orders, setOrders] = useState([]);

// console.log({orders});
  // For filtering
  const [showFilter, setShowFilter] = useState(false);

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const resourceName = {
    singular: "order",
    plural: "order",
  };



const fetchOrders = async () => {
    // setIsLoading(true);
    const response = await fetch("/api/orders");
    const order = await response.json();

    if(response.ok) {
        setOrders(order.orderData.orders);
    }

  };


const Aa = (id) => {
  console.log("AAA", id);
}


  useEffect(() => {
    fetchOrders()
  }, [])

  const resourceIDResolver = (orders) => {
    return orders.node.id;
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders,{
        resourceIDResolver,
      });
  /* Function for update Customers data */


  function onDelete(items) {
    handleSelectionChange("all", false); 
  }


//   const updateCustomers = async () => {
//     setIsLoading(true);
//     var days = [];
//     const tempData = selectedResources.map((newStr) => {
//       var id = newStr.substring(newStr.lastIndexOf("/") + 1);
//       days.push(id);
//     });

//     console.log({ days });
//     const response = await fetch(`/api/bulk-update-customers?ids=${days}`);
//     const resData = await response.json();
//     if (resData.bulkUpdateCustomers.length < 0) {
//       <Spinner accessibilityLabel="Spinner example" size="large" />;
//     } else {
//       if (response.ok) {
//         // alert('Hii');
//         setUpdatedCustomer(resData.bulkUpdateCustomers);
//         const updatedData = resData.bulkUpdateCustomers.map((node) => {
//           return node;
//         });
//         toggleActive(days.length);
//         onDelete(days);
//         setToastProps({ content: "Bulk!" });
//         await refetchProductCount();
//         setCustomers(data);
//         //  redirect.dispatch(Redirect.Action.APP, `/`);
//       }
//     }
//   };

 

  const rowMarkup = orders.map(({node}, index) => (
    <IndexTable.Row
      id={node.id}
      key={node.id}
      selected={selectedResources.includes(node.id)}
      position={index}
    >

<IndexTable.Cell>{node.name}</IndexTable.Cell>
      <IndexTable.Cell>{node.createdAt}</IndexTable.Cell>
      <IndexTable.Cell fontWeight="bold">
        {/* <Link
          dataPrimaryLink
          url="https://admin.shopify.com/store/shop-react-public-app/customers"
          onClick={() => console.log(`Clicked ${name}`)}
        > */}
          {node.customer.firstName + " " + node.customer.lastName}
        {/* </Link> */}
      </IndexTable.Cell>
    <IndexTable.Cell>{(node.currencyCode == "INR") ? `Rs.${node.totalPriceSet.shopMoney.amount}` : ` ${node.totalPriceSet.shopMoney.amount}`}</IndexTable.Cell>
      <IndexTable.Cell>{(node.fulfillments[0].status == "SUCCESS") ? <Badge progress="complete">paid</Badge> : <Badge progress="complete">unpaid</Badge>}</IndexTable.Cell>
      <IndexTable.Cell>{(node.displayFulfillmentStatus == "FULFILLED") ? <Badge progress="complete">Fulfilled</Badge> : <Badge progress="complete">Not Fulfilled</Badge>}</IndexTable.Cell>
      <IndexTable.Cell>{(node.customer.numberOfOrders == "1") ? node.customer.numberOfOrders + " Item" : node.customer.numberOfOrders + " Items" }</IndexTable.Cell>
      <IndexTable.Cell>{node.tags}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  const promotedBulkActions = [
    {
      content: "Bulk TaxExempt",
      onAction: () => console.log('Hello'),
      loading: isLoading,
    },
  ];

//   const handleFilter = () => {
//     // alert('Hiii');
//     return (
//       <TextField
//         label="Store name"
//         value={value}
//         onChange={handleChange}
//         autoComplete="off"
//       />
//     );
//   };

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
        { title: "Order"},
        { title: "Date" },
        { title: "Customer" },
        { title: "Total" },
        { title: "Payment Status" },
        { title: "Fulfillment status" },
        { title: "Items"},
        {title: "Delivery method"},
        { title: "Tags" }
      ]}
    //   bulkActions={bulkActions}
      promotedBulkActions={promotedBulkActions}
    >
    {rowMarkup}
    </IndexTable>
  );

  return (
    <Card>
      <Frame>
        {/* <input 
           value={value}
           onChange={handleChange} 
           autoComplete="off"
           style={{minHeight: "2.25rem", width: "60%", margin: '10px', borderRadius:'5px',  background: "none",
           outline: 'none', padding: '5px', align:"right"}} 
           name="value" id="value" 
          /> 
          <Button onClick={searchData} style={{ backgroundColor: 'red !important' }}>Search</Button>
          <Button style={{ backgroundColor: 'red' }} onClick={handleClick}>Tagged with<img width="20%" height="20px" src={downArrow}/></Button>
            {showFilter && (
                <Grid>
                  <Grid.Cell columnSpan={{xs: 6, sm: 3 , md: 4, lg: 6, xl: 6}}>
                    <Card sectioned>
                      <input style={{minHeight: "2.25rem", width: "100%", padding: '5px'}} value={filterValue}   name="filterValue" id="filterValue" onChange={handleFilterChange} /><br /> <br />
                      <Button onClick={filterData} >Filter</Button> 
                    </Card>
                  </Grid.Cell>
                </Grid>
            )} */}

        {toastMarkup}
        
        {mainIndex}

        {/* {isFilter && filterValue != "" && filterCustomer.length == 0 ? (
          <CustomersNotFound />
        ) : (
          mainIndex
        )} */}
      </Frame>
    </Card>
  );
}
