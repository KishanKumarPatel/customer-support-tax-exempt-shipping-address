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
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import CustomersNotFound from "../pages/CustomerNotFound";

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
      },
    },
  });



  const [updatedCustorData, setUpdatedCustomerData] = useState([]);
  /**
   * Code for Pagination
   */
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    hasPreviousPpage: false,
  });

  useEffect(() => {
    if (data) {
      setUpdatedCustomerData(data.customers.customers);
      setPageInfo(data.customers.cutomersPageInfo);
    }
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

  const filterData = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/filter-customer?ids=${taggedWith}`);
    const filter_customer = await response.json();
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
  };

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
  const [accountStatus, setAccountStatus] = useState([]);
  const [moneySpent, setMoneySpent] = useState();
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState("");
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
    if (taggedWith == "") {
      setFilterCustomer([]);
      setIsFilter(false);

      try {
        const { data } = await refetchProductCount();
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

  const handleQueryValueChange = useCallback(async (value) => {
    setQueryValue(value);
    if (queryValue === "") {
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
    }

    const delayDebounceFn = setTimeout(() => {
      if (value) {
        searchData(value);
      }
    }, 500); // Adjust the debounce delay (in milliseconds)

    return () => clearTimeout(delayDebounceFn);
  }, []);

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
      if (data) {
        setUpdatedCustomerData(data.customers.customers);
        setPageInfo(data.customers.cutomersPageInfo);
      }
    } catch (error) {
      console.error("Error while refetching data:", error);
    }
  }, []);

  const handleQueryValueRemove = useCallback(async () => {
    setIsSearching(false);
    setQueryValue("");
    setSearchCustomerData([]);
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
    setToastProps({ content: "We are processing your bulk update request!" });

    const response = await fetch(`/api/bulk-update-customers?ids=${days}`);
    const resData = await response.json();

    if (response.ok) {
      setUpdatedCustomer(resData.bulkUpdateCustomers);
      await refetchProductCount();
      setCustomers(data);
      cData = data.customers.customers;
      setToastProps({ content: "Bulk Update Successfully!" });
      if (searchCustomerData.length > 0) {
        setSearchCustomerData([]);
        setQueryValue("");
      }

      if (filterCustomer.length > 0) {
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
    if (response.ok) {
      setSearchCustomerData(search_customer.search_customer.customers);
      setPageInfo(search_customer.search_customer.cutomersPageInfo);
      setUpdatedCustomerData(search_customer.search_customer.customers);
      if (searchCustomerData.length > 0) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }
  };

  // Define the debounce delay (in milliseconds)
  const debounceDelay = 300;
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
    const cust_data = await response.json();
    if (response.ok) {
      setUpdatedPageInfo(cust_data.customers.cutomersPageInfo);
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

  const resourceIDResolver = (updatedCustorData) => {
    return updatedCustorData.node.id;
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(updatedCustorData, {
      resourceIDResolver,
    });
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

  const [customerFilterValue, setCustomerFilterValue] = useState("");
  const handleCustomerFilterChange = (value) => {
    setCustomerFilterValue(value);
  };

  const CustomSearchBar = ({ value, onChange }) => {
    return <TextField label="Search" value={value} onChange={onChange} />;
  };

  return (
    <LegacyCard>
      <Frame>
        <IndexFilters
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleQueryValueChange}
          onQueryClear={handleQueryValueRemove}
          onSort={setSortSelected}
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

        {/* Renders pagination buttons */}
        {pageInfo.hasNextPage ? (
          <div style={{ maxWidth: "fit-content", margin: "0 auto" }}>
            <Pagination
              hasPrevious={pageInfo.hasPreviousPage}
              onPrevious={() => {
                console.log("Previous");
                fetchPreviousCustomersRecords({
                  variables: {
                    last: 20,
                    before: pageInfo.startCursor,
                  },
                });
              }}
              hasNext={pageInfo.hasNextPage}
              onNext={() => {
                console.log("Next");
                fetchNextCustomersRecords({
                  variables: {
                    first: 20,
                    after: pageInfo.endCursor,
                  },
                });
              }}
            />
          </div>
        ) : pageInfo.hasPreviousPage ? (
          <div style={{ maxWidth: "fit-content", margin: "0 auto" }}>
            <Pagination
              hasPrevious={pageInfo.hasPreviousPage}
              onPrevious={() => {
                console.log("Previous");
                fetchPreviousCustomersRecords({
                  variables: {
                    last: 20,
                    before: pageInfo.startCursor,
                  },
                });
              }}
              hasNext={pageInfo.hasNextPage}
              onNext={() => {
                console.log("Next");
                fetchNextCustomersRecords({
                  variables: {
                    first: 20,
                    after: pageInfo.endCursor,
                  },
                });
              }}
            />
          </div>
        ) : null}
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
