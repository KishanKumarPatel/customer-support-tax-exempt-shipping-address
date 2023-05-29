import { LegacyCard, EmptyState, Page } from "@shopify/polaris";
import { notFoundImage } from "../assets";

export default function CustomersNotFound() {
  return (
    <Page fullWidth>
      <LegacyCard>
        <LegacyCard.Section>
          <EmptyState
            heading="Customer Not Found!"
            image={notFoundImage}
          >
            <p>
              Please try again, or use the search bar to find what
              you need.
            </p>
          </EmptyState>
        </LegacyCard.Section>
      </LegacyCard>
    </Page>
  );
}
