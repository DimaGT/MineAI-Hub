'use client';

import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'children'> {
  options?: SelectOption[];
  children?: React.ReactNode;
  onChange?: ((value: string) => void) | React.ChangeEventHandler<HTMLSelectElement>;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      children,
      options,
      value,
      onChange,
      placeholder = 'Select an option...',
      disabled,
      required,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Merge refs
    React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

    // Parse options from children if options prop is not provided
    const selectOptions: SelectOption[] = React.useMemo(() => {
      if (options) return options;

      if (children) {
        const childrenArray = React.Children.toArray(children);
        return childrenArray
          .filter((child): child is React.ReactElement => {
            return React.isValidElement(child) && child.type === 'option';
          })
          .map(child => {
            const props = child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
            return {
              value: String(props.value || ''),
              label: String(props.children || props.value || ''),
              disabled: props.disabled || false
            };
          });
      }

      return [];
    }, [options, children]);

    const selectedOption = selectOptions.find(opt => opt.value === value) || null;
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    // Calculate dropdown position
    const updatePosition = React.useCallback(() => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 4, // 4px gap below the button
          left: rect.left,
          width: rect.width
        });
      }
    }, []);

    // Handle open/close
    const handleToggle = React.useCallback(() => {
      if (disabled) return;
      if (!isOpen) {
        updatePosition();
      }
      setIsOpen(prev => !prev);
    }, [disabled, isOpen, updatePosition]);

    // Handle option selection
    const handleSelect = React.useCallback(
      (optionValue: string) => {
        if (onChange) {
          // Create synthetic event to support React.ChangeEventHandler format
          const syntheticEvent = {
            target: { value: optionValue },
            currentTarget: { value: optionValue }
          } as React.ChangeEvent<HTMLSelectElement>;

          // Try to call as React.ChangeEventHandler first (most common)
          if (onChange.length === 1) {
            (onChange as React.ChangeEventHandler<HTMLSelectElement>)(syntheticEvent);
          } else {
            // Fallback to (value: string) => void
            (onChange as (value: string) => void)(optionValue);
          }
        }
        setIsOpen(false);
      },
      [onChange]
    );

    // Close on outside click and update position on scroll
    React.useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      // Update position on scroll/resize to keep dropdown aligned with button
      const handleScroll = () => {
        requestAnimationFrame(() => {
          updatePosition();
        });
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
      };
    }, [isOpen, updatePosition]);

    // Update position when dropdown opens
    React.useEffect(() => {
      if (isOpen) {
        updatePosition();
      }
    }, [isOpen, updatePosition]);

    const dropdownContent = isOpen && mounted && (
      <div
        ref={dropdownRef}
        className='fixed z-50 min-w-[var(--select-width)] max-h-[300px] overflow-auto rounded-md border border-input bg-popover shadow-lg transition-all duration-200 ease-out'
        style={
          {
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            '--select-width': `${position.width}px`,
            animation: 'fadeIn 0.2s ease-out'
          } as React.CSSProperties
        }
      >
        <div className='p-1'>
          {selectOptions.length === 0 ? (
            <div className='px-2 py-1.5 text-sm text-muted-foreground'>No options available</div>
          ) : (
            selectOptions.map(option => {
              const isSelected = option.value === value;
              const isDisabled = option.disabled;

              return (
                <button
                  key={option.value}
                  type='button'
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleSelect(option.value)}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground',
                    isSelected && 'bg-accent text-accent-foreground',
                    isDisabled && 'pointer-events-none opacity-50'
                  )}
                >
                  <span className='flex-1 text-left'>{option.label}</span>
                  {isSelected && <Check className='ml-2 h-4 w-4' />}
                </button>
              );
            })
          )}
        </div>
      </div>
    );

    return (
      <>
        <button
          ref={buttonRef}
          type='button'
          id={id}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-200 ease-in-out',
            'hover:border-ring/50',
            'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isOpen && 'border-ring ring-1 ring-ring',
            !selectedOption && 'text-muted-foreground',
            className
          )}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-required={required}
        >
          <span className='flex-1 text-left truncate'>{displayValue}</span>
          <ChevronDown
            className={cn(
              'ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Hidden native select for form submission */}
        <select
          className='sr-only'
          value={value}
          onChange={e => {
            if (onChange) {
              if (typeof onChange === 'function' && onChange.length === 1) {
                try {
                  (onChange as (value: string) => void)(e.target.value);
                } catch {
                  (onChange as React.ChangeEventHandler<HTMLSelectElement>)(e);
                }
              } else {
                (onChange as React.ChangeEventHandler<HTMLSelectElement>)(e);
              }
            }
          }}
          disabled={disabled}
          required={required}
          id={id ? `${id}-native` : undefined}
          name={name}
          {...props}
        >
          {selectOptions.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Portal for dropdown to avoid z-index issues */}
        {mounted && createPortal(dropdownContent, document.body)}
      </>
    );
  }
);
Select.displayName = 'Select';

export { Select };
