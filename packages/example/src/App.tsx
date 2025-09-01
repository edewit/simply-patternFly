import {
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

const App = () => {
  const [select, setSelect] = useState(false);

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
            <Button variant="link" onClick={() => setSelect(true)}>
              Simple Form
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="link" onClick={() => setSelect(false)}>
              Hook Form
            </Button>
          </ListItem>
        </List>
      </PageSection>
      <PageSection>{select ? <SimpleForm /> : <HookForm />}</PageSection>
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
