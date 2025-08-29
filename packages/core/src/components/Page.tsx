import { Page as PFPage, PageProps } from "@patternfly/react-core";

export const Page: React.FC<PageProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PageComponent = PFPage as any;
  return <PageComponent {...props} />;
};