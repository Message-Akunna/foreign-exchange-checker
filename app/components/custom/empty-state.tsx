import type { ReactNode } from 'react';
import { ArrowUpRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  icon,
  actions,
  linkText,
  linkHref,
  className,
}: EmptyStateProps) => {
  return (
    <Empty className={className}>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {actions && (
        <EmptyContent className="flex-row justify-center gap-2">{actions}</EmptyContent>
      )}
      {linkText && linkHref && (
        <Button
          variant="link"
          className="text-muted-foreground gap-1.5"
          size="sm"
          nativeButton={false}
          render={
            <a href={linkHref}>
              {linkText} <ArrowUpRightIcon className="size-3.5" />
            </a>
          }
        />
      )}
    </Empty>
  );
};
