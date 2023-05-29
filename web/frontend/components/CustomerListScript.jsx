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

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Bulk updated!" onDismiss={toggleActive} />
  ) : null;

  return (
    <CustomersList toggleActive={toggleActive}/>
  );
}
