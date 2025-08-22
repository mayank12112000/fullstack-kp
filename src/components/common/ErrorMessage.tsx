import { AlertCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: "error" | "warning" | "info";
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  showIcon?: boolean;
}

const iconMap = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles = {
  error: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  warning: "border-warning/50 text-warning [&>svg]:text-warning",
  info: "border-info/50 text-info [&>svg]:text-info",
};

export default function ErrorMessage({
  title,
  message,
  variant = "error",
  onRetry,
  retryText = "Try again",
  className,
  showIcon = true,
}: ErrorMessageProps) {
  const Icon = iconMap[variant];

  return (
    <Alert 
      className={cn(variantStyles[variant], className)}
      data-testid="error-message"
    >
      {showIcon && <Icon className="h-4 w-4" />}
      {title && <AlertTitle data-testid="error-title">{title}</AlertTitle>}
      <AlertDescription data-testid="error-description">
        {message}
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
            data-testid="error-retry-button"
          >
            {retryText}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Specific error components for common use cases
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}

export function NotFoundError({ resource = "resource" }: { resource?: string }) {
  return (
    <ErrorMessage
      title="Not Found"
      message={`The requested ${resource} could not be found.`}
      variant="warning"
      showIcon={false}
    />
  );
}

export function UnauthorizedError() {
  return (
    <ErrorMessage
      title="Access Denied"
      message="You don't have permission to access this resource."
      variant="warning"
    />
  );
}

export function ValidationError({ errors }: { errors: string[] }) {
  return (
    <ErrorMessage
      title="Validation Error"
      message={
        <ul className="list-disc pl-4 mt-2">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      }
      variant="warning"
    />
  );
}
