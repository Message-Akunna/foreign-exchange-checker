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
import { ScrollArea } from "@/components/ui/scroll-area";
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
}: SelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const hasGrouping = React.useMemo(
    () => options.some((opt) => opt.group),
    [options]
  );

  const groupedOptions = React.useMemo(() => {
    if (!hasGrouping) return null;
    const groups: { name: string; items: SelectOption[] }[] = [];
    for (const option of options) {
      const groupName = option.group || "";
      let group = groups.find((g) => g.name === groupName);
      if (!group) {
        group = { name: groupName, items: [] };
        groups.push(group);
      }
      group.items.push(option);
    }
    return groups;
  }, [options, hasGrouping]);

  const renderItem = (option: SelectOption) => (
    <CommandItem
      key={option.value}
      value={option.searchLabel}
      onSelect={() => {
        onChange(option.value);
        setOpen(false);
      }}
      data-checked={value === option.value}
    >
      <div className="flex items-center gap-2 flex-1">
        {option.icon && <option.icon className="size-5 shrink-0" />}
        {option.label}
      </div>
    </CommandItem>
  );

  const listContent = (
    <Command shouldFilter={!onSearch}>
      {searchable && (
        <CommandInput
          placeholder={searchPlaceholder}
          onValueChange={onSearch}
          className="p-0"
        />
      )}
      <CommandList>
        <ScrollArea className={cn("max-h-72", !searchable && "h-auto")}>
          <CommandEmpty>No results found.</CommandEmpty>
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
              {options.map((option) => renderItem(option))}
            </CommandGroup>
          )}
        </ScrollArea>
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
        {listContent}
      </PopoverContent>
    </Popover>
  );
}
