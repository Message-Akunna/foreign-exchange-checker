"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
} from "@/components/ui/drawer";
import { buttonVariants } from "@/components/ui/button";

export interface SelectOption {
  value: string;
  label: React.ReactNode; // visual
  searchLabel: string; // searchable text
  icon?: React.ComponentType<{ className?: string }>;
  triggerLabel?: React.ReactNode;
  group?: string;
}

interface SelectComboboxProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: React.ReactNode;
  searchPlaceholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  popoverClassName?: string;
  "aria-invalid"?: boolean | "true" | "false";
  onSearch?: (term: string) => void;
  align?: "start" | "center" | "end";
  modal?: boolean;
  onScrollEnd?: () => void;
}

export function SelectCombobox({
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  searchable = false,
  disabled = false,
  className,
  id,
  popoverClassName,
  "aria-invalid": ariaInvalid,
  onSearch,
  align = "start",
  modal = true,
  onScrollEnd,
}: SelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(20);
  const isMobile = useIsMobile();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Reset page size whenever the search term or options collection changes
  React.useEffect(() => {
    if (searchTerm || options) {
      setVisibleCount(20);
    }
  }, [searchTerm, options]);

  // Filter options client-side based on the current search term
  const filteredOptions = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      const popular = options.filter((opt) => opt.group === "Popular");
      const others = options.filter((opt) => opt.group !== "Popular");
      return [...popular, ...others];
    }
    return options.filter((opt) => {
      const matchCode = opt.value.toLowerCase().includes(term);
      const matchLabel =
        typeof opt.searchLabel === "string"
          ? opt.searchLabel.toLowerCase().includes(term)
          : false;
      return matchCode || matchLabel;
    });
  }, [options, searchTerm]);

  // Paginated/Sliced subset currently visible to the user
  const slicedOptions = React.useMemo(() => {
    return filteredOptions.slice(0, visibleCount);
  }, [filteredOptions, visibleCount]);

  const hasMore = filteredOptions.length > visibleCount;

  const hasGrouping = React.useMemo(
    () => slicedOptions.some((opt) => opt.group),
    [slicedOptions]
  );

  const groupedOptions = React.useMemo(() => {
    if (!hasGrouping) return null;
    const groups: { name: string; items: SelectOption[] }[] = [];
    for (const option of slicedOptions) {
      const groupName = option.group || "";
      let group = groups.find((g) => g.name === groupName);
      if (!group) {
        group = { name: groupName, items: [] };
        groups.push(group);
      }
      group.items.push(option);
    }
    return groups;
  }, [slicedOptions, hasGrouping]);

  const renderItem = (option: SelectOption) => (
    <CommandItem
      key={option.value}
      value={option.searchLabel}
      onSelect={() => {
        onChange(option.value);
        setOpen(false);
        setSearchTerm("");
      }}
      data-checked={value === option.value}
    >
      <div className="flex items-center gap-2 flex-1">
        {option.icon && <option.icon className="size-5 shrink-0" />}
        {option.label}
      </div>
    </CommandItem>
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 15;
    if (isAtBottom) {
      if (hasMore) {
        setVisibleCount((prev) => prev + 20);
      }
      onScrollEnd?.();
    }
  };

  const listContent = (
    <Command shouldFilter={false}>
      {searchable && (
        <CommandInput
          placeholder={searchPlaceholder}
          onValueChange={(val) => {
            setSearchTerm(val);
            onSearch?.(val);
          }}
          className="p-0"
        />
      )}
      <CommandList>
        <div
          className={cn("max-h-144 overflow-y-auto pr-1 space-y-1 p-1", !searchable && "h-auto")}
          onScroll={handleScroll}
        >
          {slicedOptions.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {hasGrouping && groupedOptions ? (
            groupedOptions.map((group) => (
              <CommandGroup
                className=""
                key={group.name}
                heading={
                  group.name ? (
                    <div className="flex items-center justify-between w-full text-xs tracking-wider text-muted-foreground uppercase border-b pb-2">
                      <span>{group.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {group.items.length}
                      </span>
                    </div>
                  ) : undefined
                }
              >
                {group.items.map((option) => renderItem(option))}
              </CommandGroup>
            ))
          ) : (
            <CommandGroup>
              {slicedOptions.map((option) => renderItem(option))}
            </CommandGroup>
          )}
        </div>
      </CommandList>
    </Command>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            id={id}
            aria-expanded={open}
            aria-invalid={ariaInvalid}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-between h-auto min-h-10 text-left font-normal bg-transparent px-3 py-2",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:ring-[3px]",
              !selectedOption && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate flex items-center gap-2">
              {selectedOption?.icon && (
                <selectedOption.icon className="size-5 shrink-0" />
              )}
              {selectedOption
                ? (selectedOption.triggerLabel ?? selectedOption.label)
                : placeholder}
            </span>
            <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Select Option</DrawerTitle>
            <DrawerDescription>
              Choose an option from the list
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-2">{listContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger
        ref={triggerRef as any}
        type="button"
        disabled={disabled}
        id={id}
        aria-expanded={open}
        aria-invalid={ariaInvalid}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between h-auto min-h-10 text-left font-normal bg-transparent px-3 py-2",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:ring-[3px]",
          !selectedOption && "text-muted-foreground",
          className
        )}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption?.icon && (
            <selectedOption.icon className="size-5 shrink-0" />
          )}
          {selectedOption
            ? (selectedOption.triggerLabel ?? selectedOption.label)
            : placeholder}
        </span>
        <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className={cn("min-w-(--anchor-width) p-0", popoverClassName)}
        align={align}
      >
        {open && listContent}
      </PopoverContent>
    </Popover>
  );
}
