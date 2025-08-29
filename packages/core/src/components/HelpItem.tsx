import { Button, Popover } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";
import { ReactNode } from "react";

type HelpItemProps = {
  id: string;
  helpText: string | ReactNode;
};

export const HelpItem = ({
  helpText,
  id,
}: HelpItemProps) => {
  return (
    <Popover bodyContent={helpText}>
      <>
        <Button
          data-testid={`help-label-${id}`}
          aria-label={id}
          variant="plain"
          icon={<HelpIcon />}
        />
      </>
    </Popover>
  );
};
