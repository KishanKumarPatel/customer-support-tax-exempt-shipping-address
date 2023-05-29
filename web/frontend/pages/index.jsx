import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { CustomersCard } from "../components/CustomerCard";

export default function HomePage() {
  return (
    <Page fullWidth>
      <TitleBar title="App name" primaryAction={null} />
      <Layout>
        <Layout.Section>
          {/* <ProductsCard /> */}
          <CustomersCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
