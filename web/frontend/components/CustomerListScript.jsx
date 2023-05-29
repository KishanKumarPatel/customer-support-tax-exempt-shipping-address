import {
  Toast,
  Grid,
  IndexTable,
  useIndexResourceState,
  ResourceList,
  ResourceItem,
  Link,
  Button,
  TextField,
  Badge,
  Frame,
  Modal,
} from "@shopify/polaris";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Context } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ResourcePicker } from "@shopify/app-bridge/actions";
import { CustomersList } from "./CustomersList";
export function CustomersListScript({ customerData, pageData }) {

  console.log({customerData});
  console.log({pageData});


  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Bulk updated!" onDismiss={toggleActive} />
  ) : null;

  // const emptyToastProps = { content: null };
  // const fetch = useAuthenticatedFetch();
  // const [updatedCustomer, setUpdatedCustomer] = useState([]);
  // const [searchCustomerData, setSearchCustomerData] = useState([]);
  // const [value, setValue] = useState("");

  /* This below function is for remove Bulk Tax Exempt for customers */
  // const bulkActions = [
  //   {
  //     content: "Add tags",
  //     onAction: () => console.log("Todo: implement bulk add tags"),
  //   },
  // ];

  return (
    // <CustomersList
    //   customerData={customerData}
    //   bulkActions={bulkActions}
    //   toggleActive={toggleActive}
    //   toastMarkup={toastMarkup}
    //   pageData={pageData}
    // />
    <>
    {/* sdasd */}
    <CustomersList toggleActive={toggleActive}/>
    </>
  );
}
