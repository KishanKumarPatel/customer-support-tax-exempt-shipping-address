import { useParams } from 'react-router-dom';
import { Page, Layout,SkeletonPage,
  LegacyCard,
  SkeletonBodyText,
  SkeletonDisplayText, } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import CustomerOrder from "../../components/CustomerOrderList";
import Skeleton from '../../components/Skeleton';
export default function CustOrder() {
    const { id } = useParams();
    console.log({id});
  return (
    <Page
    breadcrumbs={[{content: 'Orders', url: '/'}]}
    title={`CustomerId: ${id}`}
    divider>
      <TitleBar title="Customer Order List" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <CustomerOrder customerId={id} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
