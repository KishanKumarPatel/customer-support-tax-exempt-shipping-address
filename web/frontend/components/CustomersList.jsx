import {
  Toast,
  Grid,
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  ResourceItem,
  Badge,
  Link,
  IndexFiltersMode,
  Pagination,
  Thumbnail,
  Spinner,
  Button,
  Frame,
} from "@shopify/polaris";
import { SearchMajor } from "@shopify/polaris-icons";
import { Redirect } from "@shopify/app-bridge/actions";

import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash"; // or any other debounce library
import { useNavigate, Context } from "@shopify/app-bridge-react";
//   import {IndexFiltersProps, AlphaTabProps} from '@shopify/polaris';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import CustomersNotFound from "../pages/CustomerNotFound";

// import { ResourcePicker } from "@shopify/app-bridge/actions";
// import createApp from "@shopify/app-bridge";
// import { Redirect } from "@shopify/app-bridge/actions";
// const config = {
//   apiKey: process.env.SHOPIFY_API_KEY,
//   host: new URLSearchParams(location.search).get("host"),
//   forceRedirect: true,
// };

// const app = createApp(config);
// const redirect = Redirect.create(app);

export function CustomersList({ toggleActive }) {
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
  const [isClick, setIsClick] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  console.log({searchCustomerData});

  console.log({ isSearching });

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/customers",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
        // console.log({ data });
      },
    },
  });

  // console.log({data});

  const [updatedCustorData, setUpdatedCustomerData] = useState([]);
  // console.log({ updatedCustorData });
  /**
   * Code for Pagination
   */
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    hasPreviousPpage: false,
  });

  console.log({ pageInfo });
  useEffect(() => {
    if (data) {
      setUpdatedCustomerData(data.customers.customers);
      setPageInfo(data.customers.cutomersPageInfo);
    }
    // if (queryValue == "") {
    //   if(data) {
    //     setPageInfo(data.customers.cutomersPageInfo);
    //   }
    // }
  }, [data]);

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );
  // console.log({filterProduct});
  const handleSubmit = () => {
    // after form is submitted redirect to admin product show page
    const redirect = Redirect.create(this.context.polaris.appBridge);

    return redirect.dispatch(Redirect.Action.ADMIN_PATH, `/products`);
  };

  // console.log({ products });

  // const fetchProducts = async () => {
  //   setIsLoading(true);
  //   const response = await fetch("/api/products/prooduct-list");
  //   setIsLoading(false);
  //   // console.log(await response.json());

  //   if (response.ok) {
  //     const productData = await response.json();
  //     // console.log({ productData });
  //     setProducts(productData.products);
  //     setIsProduct(true);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  //   const handleFilterChange = (e) => {

  //     setFilterValue(e.target.value);
  //     if(filterValue == "" || filterValue == undefined || filterValue == null) {
  //       setFilterCustomer([]);
  //       setIsFilter(false);
  //     }
  // };

  // const filterData = async () => {
  //   setIsLoading(true);
  //   const response = await fetch(`/api/filter-product?ids=${taggedWith}`);

  //   console.log({ response });

  //   const filter_customer = await response.json();
  //   // console.log("Filter", filter_customer);
  //   setIsFilter(true);

  //   if (response.ok) {
  //     setIsLoading(false);

  //     setFilterProduct(filter_customer.products.products);
  //   }
  // };

  const filterData = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/filter-customer?ids=${taggedWith}`);
    const filter_customer = await response.json();
    // console.log({ filter_customer });
    if (response.ok) {
      setIsFilter(true);
      setFilterCustomer(filter_customer.customers.customers);
      setPageInfo(filter_customer.customers.cutomersPageInfo);
      setUpdatedCustomerData(filter_customer.customers.customers);

      if (filterCustomer.length > 0) {
        setIsFilter(true);
      }
    } else {
      setIsLoading(false);
    }
    setIsLoading(false);
    // setIsFilter(false);
  };

  // search product

  const searchProduct = async () => {
    const response = await fetch(`/api/search-product?ids=${queryValue}`);
    const search_customer = await response.json();
    setIsLoading(false);
    console.log({ search_customer });
    if (response.ok) {
      // setSearchCustomerData(search_customer.search_customer.customers);
      // if(searchCustomerData.length > 0) {
      //   setIsSearching(true);
      // }
      // else {
      //   setIsSearching(false);
      // }
    }
  };

  // console.log({products});
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Unpaid",
    "Open",
    "Closed",
    "Local delivery",
    "Local pickup",
  ]);
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = ([] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value) => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  })));
  const [selected, setSelected] = useState(0);
  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  // const sortOptions = [
  //   {label: 'Order', value: 'order asc', directionLabel: 'Ascending'},
  //   {label: 'Order', value: 'order desc', directionLabel: 'Descending'},
  //   {label: 'Customer', value: 'customer asc', directionLabel: 'A-Z'},
  //   {label: 'Customer', value: 'customer desc', directionLabel: 'Z-A'},
  //   {label: 'Date', value: 'date asc', directionLabel: 'A-Z'},
  //   {label: 'Date', value: 'date desc', directionLabel: 'Z-A'},
  //   {label: 'Total', value: 'total asc', directionLabel: 'Ascending'},
  //   {label: 'Total', value: 'total desc', directionLabel: 'Descending'},
  // ];
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
  // const primaryAction = console.log('Hiii');
  const [accountStatus, setAccountStatus] = useState([]);
  const [moneySpent, setMoneySpent] = useState();
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState("");

  console.log({ queryValue });
  const handleAccountStatusChange = useCallback(
    (value) => setAccountStatus(value),
    []
  );
  const handleMoneySpentChange = useCallback(
    (value) => setMoneySpent(value),
    []
  );

  const handleTaggedWithChange = useCallback(async (value) => {
    setTaggedWith(value);

    console.log({value});
    if (taggedWith == "") {
      setFilterCustomer([]);
      setIsFilter(false);

      try {
        const { data } = await refetchProductCount();
        console.log("Refetch Data", data);
        if (data) {
          setUpdatedCustomerData(data.customers.customers);
          setPageInfo(data.customers.cutomersPageInfo);
        }
      } catch (error) {
        // Handle any errors that occurred during the refetch
        console.error("Error while refetching data:", error);
      }
    }
  }, []);

  // const handleTaggedWithChange = async (value) => {
  //   setTaggedWith(value);
  //   console.log({taggedWith});
  //   if (taggedWith == "" || taggedWith == undefined || taggedWith == null) {
  //     setFilterCustomer([]);
  //     setIsFilter(false);
  //     try {
  //       const { data } = await refetchProductCount();
  //       console.log("Refetch Data", data);
  //       if (data) {
  //         setUpdatedCustomerData(data.customers.customers);
  //         setPageInfo(data.customers.cutomersPageInfo);
  //       }
  //     } catch (error) {
  //       // Handle any errors that occurred during the refetch
  //       console.error("Error while refetching data:", error);
  //     }
  //   }
  // };

  const handleQueryValueChange = useCallback(async (value) => {
    setQueryValue(value);
    if (queryValue === "") {
      // setTimeout(async () => {
      
      // console.log('hiii');
      setSearchCustomerData([]);
      setIsSearching(false);
        try {
          const { data } = await refetchProductCount();
          console.log("Refetch Data", data);
          if (data) {
            setUpdatedCustomerData(data.customers.customers);
            setPageInfo(data.customers.cutomersPageInfo);
          }
        } catch (error) {
          // Handle any errors that occurred during the refetch
          console.error("Error while refetching data:", error);
        }
      // }, 2000);
    } 
    // if(value != "") {
    //   searchData(value);
    // }
    const delayDebounceFn = setTimeout(() => {
      if (value) {
        searchData(value);
      }
    }, 500); // Adjust the debounce delay (in milliseconds)



    return () => clearTimeout(delayDebounceFn);
    
  }, []);

  // const handleQueryValueChange = (value) => {
  //   console.log("Handle Change Value =>",value );
  //   setQueryValue(value);
  //   if (queryValue === "") {
  //     setSearchCustomerData([]);
  //     setIsSearching(false);
  //   }
    
  //   const delayDebounceFn = setTimeout(() => {
  //     if (value) {
  //       searchData(value);
  //     }
  //   }, 500); // Adjust the debounce delay (in milliseconds)

  //   return () => clearTimeout(delayDebounceFn);
  // };


  const handleAccountStatusRemove = useCallback(() => setAccountStatus([]), []);
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    []
  );
  const handleTaggedWithRemove = useCallback(async () => {
    setIsFilter(false);
    setTaggedWith("");
    setFilterCustomer([]);
    try {
      const { data } = await refetchProductCount();
      console.log("Refetch Data", data);
      if(data) {
        setUpdatedCustomerData(data.customers.customers);
        setPageInfo(data.customers.cutomersPageInfo);
      }
    } catch (error){
      console.error("Error while refetching data:", error);
    }
  }, []);

  // const handleQueryValueRemove = useCallback( async () => {
  //   setIsSearching(false);
  //   setQueryValue("");
  //   setSearchCustomerData([]);
  //   // setUpdatedCustomerData([]);
  //   await refetchProductCount();
  //   console.log("Refetch Data",data);
  //   if(data) {
  //     setUpdatedCustomerData(data.customers.customers);
  //     setPageInfo(data.customers.cutomersPageInfo);
  //   }
  // }, []);

  const handleQueryValueRemove = useCallback(async () => {
    setIsSearching(false);
    setQueryValue("");
    setSearchCustomerData([]);
    // setUpdatedCustomerData([]);
    try {
      const { data } = await refetchProductCount();
      console.log("Refetch Data", data);
      if (data) {
        setUpdatedCustomerData(data.customers.customers);
        setPageInfo(data.customers.cutomersPageInfo);
      }
    } catch (error) {
      // Handle any errors that occurred during the refetch
      console.error("Error while refetching data:", error);
    }
  }, []);

  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleQueryValueRemove,
    handleTaggedWithRemove,
    handleMoneySpentRemove,
    handleAccountStatusRemove,
  ]);

  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <>
          <TextField
            label="Tagged with"
            value={taggedWith}
            onChange={handleTaggedWithChange}
            autoComplete="off"
            labelHidden
          />
          <Button onClick={filterData} primary>
            {isLoading ? (
              <Spinner accessibilityLabel="Spinner example" size="small" />
            ) : (
              "Filter"
            )}
          </Button>
        </>
      ),
      shortcut: true,
    },
  ];

  const appliedFilters =
    taggedWith && !isEmpty(taggedWith)
      ? [
          {
            key: "taggedWith",
            label: disambiguateLabel("taggedWith", taggedWith),
            onRemove: handleTaggedWithRemove,
          },
        ]
      : [];

  const updateCustomers = async () => {
    setIsLoading(true);
    onDelete(days);
    setIsUpdated(true);
    var days = [];
    const tempData = selectedResources.map((newStr) => {
      var id = newStr.substring(newStr.lastIndexOf("/") + 1);
      days.push(id);
    });
    // console.log({ days });
    setToastProps({ content: "We are processing your bulk update request!" });

    const response = await fetch(`/api/bulk-update-customers?ids=${days}`);
    const resData = await response.json();
    // console.log({ resData });

    if (response.ok) {
      setUpdatedCustomer(resData.bulkUpdateCustomers);
      // toggleActive(days.length);
      await refetchProductCount();
      setCustomers(data);
      cData = data.customers.customers;
      setToastProps({ content: "Bulk Update Successfully!" });
      if(searchCustomerData.length > 0) {
        setSearchCustomerData([]);
        setQueryValue("");
        
        // handleQueryValueRemove();
        // setUpdatedCustomerData(data.customers.customers);

      }

      if(filterCustomer.length > 0) {
        setFilterCustomer([]);
        setTaggedWith("");
      }
      
      setIsUpdated(true);
    }
  };

  // Search for customer data
  const searchData = async (value) => {
    const response = await fetch(`/api/search-customers?ids=${value}`);

    const search_customer = await response.json();

    console.log({ search_customer });

    if (response.ok) {
      // console.log({ response });
      setSearchCustomerData(search_customer.search_customer.customers);
      setPageInfo(search_customer.search_customer.cutomersPageInfo)
      setUpdatedCustomerData(search_customer.search_customer.customers);
      console.log("Search Length ==", searchCustomerData.length);
      if (searchCustomerData.length > 0) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }
  };

  // Define the debounce delay (in milliseconds)
  const debounceDelay = 300;

  // Debounced function to make the API call
  // const debouncedSearch = debounce(searchData, 300);

  const debouncedSearch = () => {
    debounce(searchData, 100);
  };

  const [nextCustomer, setNextCustomer] = useState([]);
  const [updatedPageInfo, setUpdatedPageInfo] = useState([]);
  const [previousCustomer, setPreviousCustomer] = useState([]);

  // This function  fetch Customers Data for the next page
  const fetchNextCustomersRecords = async (variables) => {
    setIsLoading(true);
    const response = await fetch(
      `/api/next-customers/?first=${variables.variables.first}&after=${variables.variables.after}`
    );
    // setIsLoading(false);
    const cust_data = await response.json();
    if (response.ok) {
      setUpdatedPageInfo(cust_data.customers.cutomersPageInfo);
      // setNextCustomer(cust_data.customers.customers);
      setUpdatedCustomerData(cust_data.customers.customers);
      setPageInfo(cust_data.customers.cutomersPageInfo);
    }
  };

  // Fetch customer data for previous page
  const fetchPreviousCustomersRecords = async (variables) => {
    setIsLoading(true);
    const response = await fetch(
      `/api/privious-customers/?last=${variables.variables.last}&before=${variables.variables.before}`
    );

    const cust_data = await response.json();
    if (response.ok) {
      setUpdatedPageInfo(cust_data.customers.cutomersPageInfo);
      setPreviousCustomer(cust_data.customers.customers);
      setUpdatedCustomerData(cust_data.customers.customers);
      setPageInfo(cust_data.customers.cutomersPageInfo);
    }
  };

  const resourceName = {
    singular: "customer",
    plural: "customer",
  };

  // const { selectedResources, allResourcesSelected, handleSelectionChange } =
  //   useIndexResourceState(orders);

  const resourceIDResolver = (updatedCustorData) => {
    return updatedCustorData.node.id;
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(updatedCustorData, {
      resourceIDResolver,
    });

  // const { selectedResources, allResourcesSelected, handleSelectionChange } =
  // useIndexResourceState(custData);
  /* Function for update Customers data */

  function onDelete(items) {
    // ... Your logic to delete the items ...
    handleSelectionChange("all", false); // <~~ This will trigger the recalculation
  }

  const promotedBulkActions = [
    {
      content: "Bulk TaxExempt",
      onAction: updateCustomers,
      loading: isLoading,
    },
  ];

  const bulkActions = [
    {
      content: "Add tags",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
  ];

  var cData = updatedCustorData;
  // console.log({cData});
  const rowMarkup = updatedCustorData.map(({ node }, index) => (
    <IndexTable.Row
      id={node.id}
      key={node.id}
      selected={selectedResources.includes(node.id)}
      position={index}
    >
      <IndexTable.Cell fontWeight="bold">
        {node.firstName + " " + node.lastName}
      </IndexTable.Cell>
      <IndexTable.Cell>{node.email}</IndexTable.Cell>
      <IndexTable.Cell>{node.phone}</IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={`/customer-order/${node.id.substring(
            node.id.lastIndexOf("/") + 1
          )}`}
          external={false}
        >
          {node.numberOfOrders}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>{node.taxExempt.toString()}</IndexTable.Cell>
      <IndexTable.Cell>{node.tags.toString()}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  var updatedRowMarkup;
  var cData = updatedCustorData;
  console.log({ cData });
  updatedRowMarkup = cData.map(({ node }, index) => (
    <IndexTable.Row
      id={node.id}
      key={node.id}
      selected={selectedResources.includes(node.id)}
      position={index}
    >
      <IndexTable.Cell fontWeight="bold">
        {node.firstName + " " + node.lastName}
      </IndexTable.Cell>
      <IndexTable.Cell>{node.email}</IndexTable.Cell>
      <IndexTable.Cell>{node.phone}</IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={`/customer-order/${node.id.substring(
            node.id.lastIndexOf("/") + 1
          )}`}
          external={false}
        >
          {node.numberOfOrders}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>{node.taxExempt.toString()}</IndexTable.Cell>
      <IndexTable.Cell>{node.tags.toString()}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  const searchRowMarkup =
    isSearching && searchCustomerData.length > 0
      ? searchCustomerData.map(({ node }, index) => (
          <IndexTable.Row
            id={node.id}
            key={node.id}
            selected={selectedResources.includes(node.id)}
            position={index}
          >
            <IndexTable.Cell fontWeight="bold">
              {node.firstName + " " + node.lastName}
            </IndexTable.Cell>
            <IndexTable.Cell>{node.email}</IndexTable.Cell>
            <IndexTable.Cell>{node.phone}</IndexTable.Cell>
            <IndexTable.Cell>
              <Link
                url={`/customer-order/${node.id.substring(
                  node.id.lastIndexOf("/") + 1
                )}`}
                external={false}
              >
                {node.numberOfOrders}
              </Link>
            </IndexTable.Cell>
            <IndexTable.Cell>{node.taxExempt.toString()}</IndexTable.Cell>
            <IndexTable.Cell>{node.tags.toString()}</IndexTable.Cell>
          </IndexTable.Row>
        ))
      : "";

  // Prepare Table Data for filterCustomers
  const filterRowMarkup = filterCustomer.map(({ node }, index) => (
    <IndexTable.Row
      id={node.id}
      key={node.id}
      selected={selectedResources.includes(node.id)}
      position={index}
    >
      <IndexTable.Cell fontWeight="bold">
        {node.firstName + " " + node.lastName}
      </IndexTable.Cell>
      <IndexTable.Cell>{node.email}</IndexTable.Cell>
      <IndexTable.Cell>{node.phone}</IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={`/customer-order/${node.id.substring(
            node.id.lastIndexOf("/") + 1
          )}`}
          external={false}
        >
          {node.numberOfOrders}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>{node.taxExempt.toString()}</IndexTable.Cell>
      <IndexTable.Cell>{node.tags.toString()}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  const mainIndex = (
    <IndexTable
      resourceName={resourceName}
      itemCount={cData.length}
      items={cData}
      selectedItemsCount={
        allResourcesSelected ? "All" : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      headings={[
        { title: "CustomerName" },
        { title: "Email" },
        { title: "Phone" },
        { title: "Order" },
        { title: "TaxExempt" },
        { title: "Tags" },
      ]}
      // bulkActions={bulkActions}
      promotedBulkActions={promotedBulkActions}
    >
      {taggedWith != "" && filterCustomer.length > 0
        ? filterRowMarkup
        : queryValue != "" && isSearching
        ? searchRowMarkup
        : data != undefined
        ? updatedRowMarkup
        : rowMarkup}
    </IndexTable>
  );

  // const filterRowMarkup = filterProduct.map(({ node }, index) => (
  //   <IndexTable.Row
  //     id={node.id}
  //     key={node.id}
  //     selected={selectedResources.includes(node.id)}
  //     position={index}
  //   >
  //     <IndexTable.Cell>
  //       <Thumbnail source={node.images.edges[0].node.url} alt={node.title} />
  //     </IndexTable.Cell>
  //     <IndexTable.Cell>
  //       <Link
  //         monochrome
  //         url="https://shop-react-public-app.myshopify.com/admin/apps/dc6bf25d13f63a7bd140c6dfa15dae22"
  //       >
  //         {node.title}
  //       </Link>
  //     </IndexTable.Cell>
  //     <IndexTable.Cell>
  //       {node.status == "ACTIVE" ? (
  //         <Badge status="success">{node.status}</Badge>
  //       ) : (
  //         <Badge status="success">{node.status}</Badge>
  //       )}{" "}
  //     </IndexTable.Cell>
  //     <IndexTable.Cell>{node.totalInventory}</IndexTable.Cell>

  //     <IndexTable.Cell>{node.productType}</IndexTable.Cell>

  //     <IndexTable.Cell>{node.vendor}</IndexTable.Cell>
  //   </IndexTable.Row>
  // ));

  // return (
  //   <LegacyCard>
  //     <Frame>
  //       <IndexFilters
  //         sortSelected={sortSelected}
  //         queryValue={queryValue}
  //         queryPlaceholder="Searching in all"
  //         onQueryChange={handleQueryValueChange}
  //         onQueryClear={() => {}}
  //         onSort={setSortSelected}
  //         primaryAction={primaryAction}
  //         cancelAction={{
  //           onAction: onHandleCancel,
  //           disabled: false,
  //           loading: false,
  //         }}
  //         tabs={tabs}
  //         selected={selected}
  //         onSelect={setSelected}
  //         canCreateNewView
  //         onCreateNewView={onCreateNewView}
  //         filters={filters}
  //         appliedFilters={appliedFilters}
  //         onClearAll={handleFiltersClearAll}
  //         mode={mode}
  //         setMode={setMode}
  //       />

  //       {toastMarkup}
  //       {taggedWith != "" ? (
  //         isFilter && filterCustomer.length == 0 ? (
  //           <CustomersNotFound />
  //         ) : (
  //           mainIndex
  //         )
  //       ) : (
  //         mainIndex
  //       )}

  //       {queryValue != "" && isSearching && searchRowMarkup.length == 0 ? (
  //         <div style={{ width: "100%" }}>
  //           <CustomersNotFound />
  //         </div>
  //       ) : (
  //         ""
  //       )}
  //       <div style={{ maxWidth: "fit-content", margin: "0 auto" }}>
  //         <Pagination
  //           hasPrevious={pageInfo.hasPreviousPage}
  //           onPrevious={() => {
  //             console.log("Previous");
  //             fetchPreviousCustomersRecords({
  //               variables: {
  //                 last: 50,
  //                 before: pageInfo.startCursor,
  //               },
  //             });
  //           }}
  //           hasNext={pageInfo.hasNextPage}
  //           onNext={() => {
  //             console.log("Next");
  //             fetchNextCustomersRecords({
  //               variables: {
  //                 first: 50,
  //                 after: pageInfo.endCursor,
  //               },
  //             });
  //           }}
  //         />
  //       </div>
  //     </Frame>
  //   </LegacyCard>
  // );
  const [customerFilterValue, setCustomerFilterValue] = useState("");
  const handleCustomerFilterChange = (value) => {
    // Update the customer filter value
    // customerFilterValue
    setCustomerFilterValue(value);
  };

  const CustomSearchBar = ({ value, onChange }) => {
    console.log("Custom Searchbar value", value);
    console.log("Custom Searchbar onChange", onChange);
    return (
      <TextField
        label="Search"
        value={value}
        onChange={onChange}
        // Add any additional props or styling as needed
      />
    );
  };

  return (
    <LegacyCard>
      <Frame>
        {/* Renders filters and search functionality */}
        <IndexFilters
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleQueryValueChange}
          onQueryClear={handleQueryValueRemove}
          onSort={setSortSelected}
          // primaryAction={primaryAction}
          // cancelAction={{
          //   onAction: onHandleCancel,
          //   disabled: false,
          //   loading: false,
          // }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView={true}
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        {/* Renders toast notifications */}
        {toastMarkup}

        {/* Conditionally renders CustomersNotFound or mainIndex component */}
        
        {(taggedWith !== "" && isFilter && filterCustomer.length === 0) ||
        (queryValue !== "" && isSearching && searchRowMarkup.length === 0) ? (
          <div style={{ width: "100%" }}>
            <CustomersNotFound />
          </div>
        ) : (
          mainIndex
        )}

        {/* {mainContent} */}
        {/* Renders pagination buttons if filterCustomer length is greater than or equal to 10 */}

        {/* {queryValue === "" && (
          <div style={{ maxWidth: "fit-content", margin: "0 auto" }}>
            <Pagination
              hasPrevious={pageInfo.hasPreviousPage}
              onPrevious={() => {
                console.log("Previous");
                fetchPreviousCustomersRecords({
                  variables: {
                    last: 50,
                    before: pageInfo.startCursor,
                  },
                });
              }}
              hasNext={pageInfo.hasNextPage}
              onNext={() => {
                console.log("Next");
                fetchNextCustomersRecords({
                  variables: {
                    first: 50,
                    after: pageInfo.endCursor,
                  },
                });
              }}
            />
          </div>
        )}

        {(queryValue !== "" && isSearching && searchRowMarkup.length >= 10) &&  (
          <div style={{ maxWidth: "fit-content", margin: "0 auto" }}>
            <Pagination
              hasPrevious={pageInfo.hasPreviousPage}
              onPrevious={() => {
                console.log("Previous");
                fetchPreviousCustomersRecords({
                  variables: {
                    last: 50,
                    before: pageInfo.startCursor,
                  },
                });
              }}
              hasNext={pageInfo.hasNextPage}
              onNext={() => {
                console.log("Next");
                fetchNextCustomersRecords({
                  variables: {
                    first: 50,
                    after: pageInfo.endCursor,
                  },
                });
              }}
            />
          </div>
        )} */}

{/* Renders pagination buttons */}
{/* 
{(queryValue === "") || 
  (taggedWith !== "" && filterCustomer.length >= 10) ||
    (queryValue !== "" && isSearching && searchRowMarkup.length >= 10 && pageInfo.hasPreviousPage) ?
     */}
    
  { pageInfo.hasNextPage ?
    
    (
      <div style={{ maxWidth: "fit-content", margin: "0 auto" }}>
        <Pagination
          hasPrevious={pageInfo.hasPreviousPage}
          onPrevious={() => {
            console.log("Previous");
            fetchPreviousCustomersRecords({
              variables: {
                last: 50,
                before: pageInfo.startCursor,
              },
            });
          }}
          hasNext={pageInfo.hasNextPage}
          onNext={() => {
            console.log("Next");
            fetchNextCustomersRecords({
              variables: {
                first: 50,
                after: pageInfo.endCursor,
              },
            });
          }}
        />
      </div>
    ) : pageInfo.hasPreviousPage ?  (
      <div style={{ maxWidth: "fit-content", margin: "0 auto" }}>
        <Pagination
          hasPrevious={pageInfo.hasPreviousPage}
          onPrevious={() => {
            console.log("Previous");
            fetchPreviousCustomersRecords({
              variables: {
                last: 50,
                before: pageInfo.startCursor,
              },
            });
          }}
          hasNext={pageInfo.hasNextPage}
          onNext={() => {
            console.log("Next");
            fetchNextCustomersRecords({
              variables: {
                first: 50,
                after: pageInfo.endCursor,
              },
            });
          }}
        />
      </div>
    ) : null}


{/* 
        {taggedWith !== "" &&  isFilter && filterCustomer.length > 1 && 
        (
          <div style={{ maxWidth: "fit-content", margin: "0 auto" }}>
            <Pagination
              hasPrevious={pageInfo.hasPreviousPage}
              onPrevious={() => {
                console.log("Previous");
                fetchPreviousCustomersRecords({
                  variables: {
                    last: 50,
                    before: pageInfo.startCursor,
                  },
                });
              }}
              hasNext={pageInfo.hasNextPage}
              onNext={() => {
                console.log("Next");
                fetchNextCustomersRecords({
                  variables: {
                    first: 50,
                    after: pageInfo.endCursor,
                  },
                });
              }}
            />
          </div>
        )} */}
      </Frame>
    </LegacyCard>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
        return value.map((val) => `Customer ${val}`).join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
