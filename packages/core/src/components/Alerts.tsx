import { Alert, AlertActionCloseButton, AlertGroup, AlertVariant } from "@patternfly/react-core";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type AddAlertFunction = (
  message: string,
  variant?: AlertVariant,
  description?: string
) => void;

export type AddErrorFunction = (messageKey: string, error: unknown) => void;

export type AlertProps = {
  addAlert: AddAlertFunction;
  addError: AddErrorFunction;
};

const AlertContext = createContext<AlertProps | undefined>(undefined);

export const useAlerts = () => useContext(AlertContext);

export type AlertEntry = {
  id: number;
  message: string;
  variant: AlertVariant;
  description?: string;
};

export const AlertProvider = ({ children }: PropsWithChildren) => {
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);

  const removeAlert = (id: number) =>
    setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));

  const addAlert = useCallback<AddAlertFunction>(
    (message, variant = AlertVariant.success, description) => {
      const alert: AlertEntry = {
        id: generateUniqueId(),
        message,
        variant,
        description,
      };

      setAlerts((alerts) => [alert, ...alerts]);
    },
    []
  );

  const addError = useCallback<AddErrorFunction>(
    (message, error) => {
      addAlert(message, AlertVariant.danger, error as string);
    },
    [addAlert]
  );

  const value = useMemo(() => ({ addAlert, addError }), [addAlert, addError]);

  return (
    <AlertContext.Provider value={value}>
      <AlertGroup isToast isLiveRegion hasAnimations>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            title={alert.message}
            timeout={8000}
            actionClose={
              <AlertActionCloseButton
                title={alert.message}
                variantLabel={`${alert.variant} alert`}
                onClose={() => removeAlert(alert.id)}
              />
            }
          >
            {alert.description}
          </Alert>
        ))}
      </AlertGroup>
      {children}
    </AlertContext.Provider>
  );
};
function generateUniqueId(): number {
  return Date.now() + Math.random();
}

