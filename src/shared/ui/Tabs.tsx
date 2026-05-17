import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/shared/lib/cn';

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;

export function Tabs(props: TabsProps) {
  return <TabsPrimitive.Root {...props} />;
}

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex h-11 items-center justify-center gap-1 rounded-2xl border border-border bg-surface-elevated/40 p-1 backdrop-blur',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition data-[state=active]:bg-white/10 data-[state=active]:text-slate-50 data-[state=active]:shadow-inner',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-4 outline-none', className)} {...props} />;
}
