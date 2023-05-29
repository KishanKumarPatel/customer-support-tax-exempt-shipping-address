import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { OrderList } from "../../components/OrderList";

export default function Orders() {
  return (
    <Page>
      <TitleBar title="App name" primaryAction={null} />
      <Layout>
        <Layout.Section>
        <OrderList />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
