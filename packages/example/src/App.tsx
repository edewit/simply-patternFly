import {
  AlertProvider,
  Brand,
  Button,
  List,
  ListItem,
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  Page,
  PageSection,
  Title,
} from "@simply-patternfly/core";
import { useState } from "react";
import { HookForm } from "./HookForm";
import { SimpleForm } from "./SimpleForm";

import logo from "./assets/logo.svg";
import { Table } from "./Table";

const Section = {
  SimpleForm: "SimpleForm",
  HookForm: "HookForm",
  Table: "Table",
} as const;

const App = () => {
  const [select, setSelect] = useState<typeof Section[keyof typeof Section]>();

  return (
    <Page
      masthead={
        <Masthead>
          <MastheadMain>
            <MastheadBrand>
              <MastheadLogo
                href="https://github.com/edewit/simply-patternFly/"
                target="_blank"
              >
                <Brand
                  src={logo}
                  alt="Simply PatternFly"
                  style={{ marginRight: "10px" }}
                />
                Simply PatternFly
              </MastheadLogo>
            </MastheadBrand>
          </MastheadMain>
        </Masthead>
      }
    >
      <PageSection>
        <Title headingLevel="h1">Simply PatternFly</Title>
      </PageSection>
      <PageSection>
        <List>
          <ListItem>
            <Button variant="link" onClick={() => setSelect(Section.SimpleForm)}>
              Simple Form
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="link" onClick={() => setSelect(Section.HookForm)}>
              Hook Form
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="link" onClick={() => setSelect(Section.Table)}>
              Table
            </Button>
          </ListItem>
        </List>
      </PageSection>
      <PageSection>
        <AlertProvider>
          {(() => {
            switch (select) {
              case Section.SimpleForm:
                return <SimpleForm />;
              case Section.HookForm:
                return <HookForm />;
              case Section.Table:
                return <Table />;
              default:
                return null;
            }
          })()}
        </AlertProvider>
      </PageSection>
      <PageSection variant="secondary">
        <div>
          This example demonstrates the multi-module structure with core and
          react-hook-form packages
        </div>
      </PageSection>
    </Page>
  );
};

export default App;
