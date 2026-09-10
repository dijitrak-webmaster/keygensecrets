import { cn } from '@project/components';

/**
 * Ad placement wrapper. Renders a reserved slot for ad networks (Google AdSense, Carbon Ads, etc.)
 * Replace the inner content with actual ad code when connecting an ad network.
 *
 * Variants:
 * - "banner": horizontal banner below tool output (728x90 / responsive)
 * - "sidebar": vertical sidebar ad (300x250 / 160x600)
 * - "inline": in-content ad between sections
 */
export function AdSlot({ variant = 'banner', className }: {
  variant?: 'banner' | 'sidebar' | 'inline';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-dashed border-border/40 bg-[hsl(var(--surface-0))/0.3]',
        'flex items-center justify-center text-[10px] text-muted-foreground/20 select-none',
        variant === 'banner' && 'w-full h-[90px] max-w-[728px] mx-auto',
        variant === 'sidebar' && 'w-[300px] h-[250px]',
        variant === 'inline' && 'w-full h-[100px]',
        className
      )}
      data-ad-slot={variant}
      aria-hidden="true"
    >
      {/* Replace this div with ad network code (e.g. Google AdSense ins tag) */}
      <span className="opacity-0">Ad</span>
    </div>
  );
}
