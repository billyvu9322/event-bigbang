# Biên dịch lại webpack chunk sang code dễ đọc

Đây là một **webpack chunk đã minify** của một ứng dụng Next.js (có vẻ là trang bán vé sự kiện — dựa trên các tên như `OccurrenceTimeButton`, `EventSeoHero`, i18n `en/vi`...). Dưới đây là từng module được đặt lại tên biến, tách file, thêm comment cho dễ đọc. Logic được giữ nguyên 100%, chỉ đổi tên và định dạng.

---

## 1. `navigation.ts` (module `2389`) — Cấu hình điều hướng đa ngôn ngữ

```ts
"use client";
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Xuất ra các helper điều hướng đã được "bind" với cấu hình routing
export const {
  Link,          // <Link> tương đương next/link nhưng biết xử lý locale
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);
```

---

## 2. `routing.ts` (module `3499`) — Cấu hình locale (i18n)

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  localePrefix: "as-needed", // chỉ thêm prefix /en, /vi khi cần
  locales: ["en", "vi"],
  defaultLocale: "vi",
  localeDetection: false,
  localeCookie: true,
});
```

---

## 3. `Button.tsx` (module `3069`) — Wrapper cho Button

```tsx
import { Button as BaseButton, Loading } from "@ui-lib";
import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  "data-id"?: string;
  [key: string]: any;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

const loadingSizeMap: Record<ButtonSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  className,
  children,
  disabled,
  id,
  "data-id": dataId,
  ...rest
}: ButtonProps) {
  return (
    <BaseButton
      className={cn(variantClassMap[variant], className)}
      size={size}
      disabled={disabled || loading}
      id={id}
      data-id={dataId || id}
      {...rest}
    >
      {loading ? (
        <>
          <Loading className={cn("text-current", loadingSizeMap[size])} />
          {children && <span className="ml-2">{children}</span>}
        </>
      ) : icon && iconPosition === "left" ? (
        <>
          {icon}
          {children && <span className={children ? "ml-2" : ""}>{children}</span>}
        </>
      ) : icon && iconPosition === "right" ? (
        <>
          {children && <span className={children ? "mr-2" : ""}>{children}</span>}
          {icon}
        </>
      ) : (
        children
      )}
    </BaseButton>
  );
}

Button.displayName = "Button";
export default Button;
```

---

## 4. `Divider.tsx` (module `6891`) — Đường kẻ ngang/dọc kiểu nét đứt (vẽ bằng SVG)

```tsx
import { useEffect, useRef, useState } from "react";

interface DividerProps {
  orientation?: "x" | "y";
  dashSize?: number;
  className?: string;
  strokeColor?: string;
}

function Divider({
  orientation = "x",
  dashSize = 6,
  className = "",
  strokeColor = "#EAECF0",
}: DividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dashCount, setDashCount] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const size =
        orientation === "x"
          ? containerRef.current.offsetWidth
          : containerRef.current.offsetHeight;
      setDashCount(Math.ceil(size / (2 * dashSize)));
    }
  }, [dashSize, orientation]);

  return (
    <div
      ref={containerRef}
      className={`flex ${orientation === "x" ? "w-full py-2" : "h-full flex-col"} ${className}`}
      id={`divider-${orientation}`}
      data-id={`divider-${orientation}`}
    >
      {Array.from({ length: dashCount }).map((_, index) => (
        <svg
          key={String(index)}
          xmlns="http://www.w3.org/2000/svg"
          width={2 * dashSize}
          aria-label="divider dash"
          role="img"
          height={orientation === "x" ? "2" : 2 * dashSize}
          viewBox={`0 0 ${orientation === "x" ? 2 * dashSize : 2} ${orientation === "x" ? 2 : 2 * dashSize}`}
          fill="none"
          className="shrink-0"
          id={`divider-svg-${index}`}
          data-id={`divider-svg-${index}`}
        >
          <path
            d={orientation === "x" ? `M0 1 H${2 * dashSize}` : `M1 0 V${2 * dashSize}`}
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeDasharray={`${dashSize} ${dashSize}`}
          />
        </svg>
      ))}
    </div>
  );
}

Divider.displayName = "Divider";
export default Divider;
```

---

## 5. `ErrorStar.tsx` (module `43851`) — Dấu `(*)` báo lỗi/bắt buộc

```tsx
interface ErrorStarProps {
  className?: string;
}

function ErrorStar({ className = "" }: ErrorStarProps) {
  return (
    <p
      className={`inline-flex ml-1 ${className}`}
      id="error-star-indicator"
      data-id="error-star-indicator"
    >
      (<p className="text-error--500">*</p>)
    </p>
  );
}

ErrorStar.displayName = "ErrorStar";
export default ErrorStar;
```

---

## 6. `Loading.tsx` (module `63119`) — Spinner loading

```tsx
import { Loading as LoadingIcon } from "@ui-lib";

interface LoadingSpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const sizeClassMap: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  xs: "w-4",
  sm: "w-8",
  md: "w-12",
  lg: "w-20",
};

function LoadingSpinner({ className = "", size = "lg" }: LoadingSpinnerProps) {
  return (
    <div
      className={`w-full text-center ${className}`}
      id="loading-spinner-container"
      data-id="loading-spinner-container"
    >
      <LoadingIcon
        className={`${sizeClassMap[size]} text-primary`}
        id="loading-spinner"
        data-id="loading-spinner"
      />
    </div>
  );
}

LoadingSpinner.displayName = "Loading";
export default LoadingSpinner;
```

---

## 7. `LeavePageContext.tsx` (module `79173`) — Context cảnh báo khi rời trang

```tsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";

interface LeavePageContextValue {
  message: string | null;
  setMessage: (message: string | null) => void;
}

const LeavePageContext = createContext<LeavePageContextValue>({
  message: null,
  setMessage: () => {},
});

// Hook để đọc/ghi message cảnh báo rời trang
export function useLeavePageMessage() {
  return useContext(LeavePageContext);
}

// Provider: khi có `message`, sẽ chặn sự kiện beforeunload của trình duyệt
// (hiện popup "Bạn có chắc muốn rời trang?")
export function LeavePageContextProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const value = useMemo(() => ({ message, setMessage }), [message]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    if (message) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [message]);

  return (
    <LeavePageContext.Provider value={value}>{children}</LeavePageContext.Provider>
  );
}
```

---

## 8. `SafeLink.tsx` (module `75538`) — `<Link>` có xác nhận trước khi rời trang

```tsx
import { useCallback } from "react";
import { cn } from "./cn";
import { useLeavePageMessage } from "./LeavePageContext";
import { Link } from "./navigation";

interface SafeLinkProps {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  popover?: string;
  [key: string]: any;
}

function SafeLink({ children, disabled = false, className, popover, ...rest }: SafeLinkProps) {
  const { message } = useLeavePageMessage();

  // Nếu có message cảnh báo (vd: form chưa lưu), hỏi confirm trước khi điều hướng
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || (message && !confirm(message))) {
        e.preventDefault();
      }
    },
    [message, disabled]
  );

  return (
    <Link
      {...rest}
      onClick={handleClick}
      className={cn(className)}
      popover={popover === "hint" ? undefined : popover}
    >
      {children}
    </Link>
  );
}

export default SafeLink;
```

---

## 9. `OccurrenceTimeButton.tsx` (module `39853`) — Nút chọn khung giờ suất diễn

```tsx
import { Button as BaseButton, Loading } from "@ui-lib";
import SafeLink from "./SafeLink";
import { cn } from "./cn";

interface OccurrenceTimeButtonProps {
  time: React.ReactNode;
  isDisabled?: boolean;
  isSoldOut?: boolean;
  isSelected?: boolean;
  className?: string;
  id?: string;
  "data-id"?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "button" | "link";
  [key: string]: any;
}

function OccurrenceTimeButton({
  time,
  isDisabled = false,
  isSoldOut = false,
  isSelected = false,
  className,
  id,
  "data-id": dataId,
  onClick,
  href,
  type = "button",
  variant = "button",
  ...rest
}: OccurrenceTimeButtonProps) {
  const isUnavailable = isDisabled || isSoldOut;

  const wrapperClass = cn(
    "min-w-[80px] max-sm:min-w-[100px] flex-shrink-0 !w-fit !justify-center btn-ghost-blue border",
    isUnavailable && "btn-strikethrough !bg-[#EAECF0] !text-[#98A2B3] !border-[#EAECF0]",
    isDisabled && "btn-disabled",
    isSoldOut && "cursor-not-allowed",
    className
  );

  const innerClass = cn(
    "shadow-none bg-blue-50 border-blue-50",
    isUnavailable && "!border-[#EAECF0]",
    isSelected
      ? "!bg-blue-700 hover:bg-blue-900 border-blue-700 hover:border-blue-900"
      : !isSoldOut && "hover:bg-[#B2DDFF] hover:text-[#1849A9] hover:border-[#B2DDFF]"
  );

  const textClass = cn(
    "font-semibold capitalize btn-ghost-blue",
    isUnavailable ? "text-[#98A2B3]" : "text-blue-700",
    isSelected && "text-white"
  );

  // Nếu là variant "link" và có href (và còn hàng) -> render dạng SafeLink
  if (variant === "link" && href && !isSoldOut) {
    return (
      <SafeLink
        className={cn("btn", wrapperClass)}
        disabled={isDisabled}
        href={href}
        id={id}
        data-id={dataId || id}
        prefetch={false}
        {...rest}
      >
        {time}
      </SafeLink>
    );
  }

  // Mặc định: render dạng Button
  return (
    <BaseButton
      type={type}
      id={id}
      data-id={dataId || id}
      aria-disabled={isSoldOut || undefined}
      className={cn(wrapperClass, innerClass)}
      onClick={onClick}
      disabled={isDisabled}
      {...rest}
    >
      <p className={textClass}>{time}</p>
    </BaseButton>
  );
}

OccurrenceTimeButton.displayName = "OccurrenceTimeButton";
export default OccurrenceTimeButton;
```

---

## 10. `EventSeoHero.tsx` (module `29303`) — Block SEO (h2/p ẩn) cho trang chi tiết sự kiện

```tsx
import { styled } from "./styled";

interface EventOccurrence {
  startTime?: string;
}

interface EventData {
  name: string;
  description?: string;
  venueName?: string;
  venueAddress?: string;
  occurrences?: EventOccurrence[];
}

// Section này chủ yếu phục vụ SEO / crawler, không phải nội dung hiển thị chính
const SeoRegion = styled("section")({
  name: "SeoRegion",
  className: "s19g312s", // class được generate bởi css-in-js (linaria/wyw-in-js)
});

function formatDateOnly(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function EventSeoHero({ event }: { event?: EventData }) {
  if (!event) return null;

  const firstOccurrenceDate = formatDateOnly(event.occurrences?.[0]?.startTime);
  const venueLine = [event.venueName, event.venueAddress].filter(Boolean).join(" — ");

  return (
    <SeoRegion>
      <h2>{event.name}</h2>
      {event.description && <p>{event.description}</p>}
      {venueLine && <p>{venueLine}</p>}
      {firstOccurrenceDate && <p>{firstOccurrenceDate}</p>}
    </SeoRegion>
  );
}

EventSeoHero.displayName = "EventSeoHero";
export default EventSeoHero;
```

---

## 11. `DetailEventLoader.tsx` (module `14420`) — Lazy-load component chi tiết sự kiện

```tsx
import dynamic from "next/dynamic";
import { Loading as LoadingSpinner } from "./shared-exports";

// Component chi tiết sự kiện được tách code (code-split) và chỉ load ở client (ssr: false),
// hiển thị LoadingSpinner trong lúc chờ tải
const DetailEventComponent = dynamic(() => import("./detail-event-module"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

function DetailEventLoader(props: any) {
  return <DetailEventComponent {...props} />;
}

DetailEventLoader.displayName = "DetailEventLoader";
export default DetailEventLoader;
```

---

## 12. `cn.ts` (module `97457`) — Merge className (clsx + tailwind-merge)

```ts
import { A as clsx } from "./classnames-helper"; // module 18574
import { QP as twMerge } from "tailwind-merge";

// Kết hợp nhiều class, xử lý điều kiện (clsx) rồi merge trùng lặp Tailwind (twMerge)
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
```

---

## 13. `classnames-helper.ts` (module `18574`) — clsx tối giản

```ts
// Bản clsx tự viết: gộp string/array/object thành 1 chuỗi class
function classnames(...args: any[]): string {
  let result = "";
  for (const arg of args) {
    if (!arg) continue;
    result += (result ? " " : "") + toClassString(arg);
  }
  return result;
}

function toClassString(value: any): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((v) => (v ? toClassString(v) : ""))
      .filter(Boolean)
      .join(" ");
  }
  if (typeof value === "object") {
    return Object.keys(value)
      .filter((key) => value[key])
      .join(" ");
  }
  return "";
}

export const A = classnames;
export const $ = classnames;
```

---

## 14. `atomicCx.ts` (module `91305`) — Gộp class kiểu "atomic CSS" (`atm_*`)

```ts
// Với các class có tiền tố "atm_xxx_yyy", chỉ giữ lại giá trị mới nhất cho mỗi nhóm "xxx"
// (kiểu resolve atomic CSS classes, tránh trùng lặp/ghi đè thuộc tính)
export function cx(...classGroups: string[]): string {
  const inputs = Array.prototype.slice.call(classGroups).filter(Boolean);
  const atomicByGroup: Record<string, string> = {};
  const plainClasses: string[] = [];

  inputs.forEach((classString) => {
    (classString ? classString.split(" ") : []).forEach((cls) => {
      if (cls.startsWith("atm_")) {
        const [, groupKey] = cls.split("_");
        atomicByGroup[groupKey] = cls;
      } else {
        plainClasses.push(cls);
      }
    });
  });

  const resolvedAtomicClasses = Object.values(atomicByGroup);
  return [...resolvedAtomicClasses, ...plainClasses].join(" ");
}
```

---

## 15. `dynamic.ts` (module `54956` + `62316`) — Bản rút gọn của `next/dynamic`

```tsx
import { lazy, Suspense, Fragment } from "react";
import { BailoutToCSR } from "./BailoutToCSR";

interface DynamicOptions {
  loader: () => Promise<any>;
  loading?: React.ComponentType<any> | null;
  ssr?: boolean;
}

function normalizeModule(mod: any) {
  return { default: mod && "default" in mod ? mod.default : mod };
}

const defaultOptions: DynamicOptions = {
  loader: () => Promise.resolve(normalizeModule(() => null)),
  loading: null,
  ssr: true,
};

// Tạo 1 component được lazy-load, tuỳ chọn tắt SSR (client-only)
export function dynamic(options: DynamicOptions) {
  const config = { ...defaultOptions, ...options };
  const LazyComponent = lazy(() => config.loader().then(normalizeModule));
  const LoadingComponent = config.loading;

  function DynamicWrapper(props: any) {
    const fallback = LoadingComponent ? (
      <LoadingComponent isLoading pastDelay error={null} />
    ) : null;

    const needsSuspense = !config.ssr || !!config.loading;
    const Wrapper = needsSuspense ? Suspense : Fragment;

    const content = config.ssr ? (
      <LazyComponent {...props} />
    ) : (
      <BailoutToCSR reason="next/dynamic">
        <LazyComponent {...props} />
      </BailoutToCSR>
    );

    return <Wrapper {...(needsSuspense ? { fallback } : {})}>{content}</Wrapper>;
  }

  DynamicWrapper.displayName = "LoadableComponent";
  return DynamicWrapper;
}

// Helper: nhận vào function loader hoặc object options
export function dynamicFactory(loaderOrOptions: any, extraOptions?: DynamicOptions) {
  const baseOptions: any = {};
  if (typeof loaderOrOptions === "function") {
    baseOptions.loader = loaderOrOptions;
  }
  const merged = { ...baseOptions, ...loaderOrOptions, ...extraOptions };
  return dynamic({ ...merged, modules: merged.loadableGenerated?.modules });
}
```

---

## 16. `BailoutToCSR.tsx` (module `34347`) — Chặn render server, chỉ render client

```tsx
interface BailoutToCSRProps {
  reason: string;
  children: React.ReactNode;
}

// Đây là phiên bản build production: chỉ đơn giản trả về children
// (bản dev sẽ throw lỗi đặc biệt để Next.js biết "bail out" khỏi SSR)
export function BailoutToCSR({ reason, children }: BailoutToCSRProps) {
  return children;
}
```

---

## 17. `asyncStorage.ts` (module `29621`, `7693`, `38867`) — Wrapper cho `AsyncLocalStorage`

```ts
// Polyfill/wrapper cho Node's AsyncLocalStorage, dùng nội bộ bởi Next.js
// để lưu context trong lúc render (per-request state)

class UnavailableAsyncLocalStorage<T> {
  private error = new Error(
    "Invariant: AsyncLocalStorage accessed in runtime where it is not available"
  );

  disable(): never {
    throw this.error;
  }
  getStore(): T | undefined {
    return undefined;
  }
  run(): never {
    throw this.error;
  }
  exit(): never {
    throw this.error;
  }
  enterWith(): never {
    throw this.error;
  }
  static bind<F extends Function>(fn: F): F {
    return fn;
  }
}

const NativeAsyncLocalStorage: any =
  typeof globalThis !== "undefined" && (globalThis as any).AsyncLocalStorage;

export function createAsyncLocalStorage<T>() {
  return NativeAsyncLocalStorage
    ? new NativeAsyncLocalStorage()
    : new UnavailableAsyncLocalStorage<T>();
}

export function bindSnapshot<F extends Function>(fn: F): F {
  return NativeAsyncLocalStorage ? NativeAsyncLocalStorage.bind(fn) : UnavailableAsyncLocalStorage.bind(fn);
}

export function createSnapshot() {
  return NativeAsyncLocalStorage
    ? NativeAsyncLocalStorage.snapshot()
    : (fn: Function, ...args: any[]) => fn(...args);
}

// Instance dùng để lưu "workAsyncStorage" (context của mỗi lần render trang)
export const workAsyncStorageInstance = createAsyncLocalStorage();
export const workAsyncStorage = workAsyncStorageInstance;
```

---

## 18. `styled.ts` (module `97519`) — Factory tạo styled component (kiểu linaria/wyw-in-js)

```ts
// Đây là bản rút gọn logic của thư viện CSS-in-JS (dạng linaria/wyw-in-js):
// - Lọc ra các prop hợp lệ để forward xuống DOM element (whitelist HTML/SVG attributes)
// - Áp css variables (`--var`) vào style dựa trên props
// - Merge className atomic (dùng hàm `cx` ở trên)
import { forwardRef, createElement } from "react";
import { cx } from "./atomicCx";

// Regex whitelist rất dài liệt kê toàn bộ HTML/SVG attribute hợp lệ + data-*/aria-*
const isValidDomProp = createDomPropValidator();

function omitKeys(obj: Record<string, any>, keysToOmit: string[]) {
  const result: Record<string, any> = {};
  Object.keys(obj)
    .filter((key) => !keysToOmit.includes(key))
    .forEach((key) => (result[key] = obj[key]));
  return result;
}

function filterDomProps(shouldKeepAll: boolean, props: any, omit: string[]) {
  const filtered = omitKeys(props, omit);
  if (!shouldKeepAll) {
    Object.keys(filtered).forEach((key) => {
      if (!isValidDomProp(key)) delete filtered[key];
    });
  }
  return filtered;
}

interface StyledConfig {
  name: string;
  class?: string;
  propsAsIs?: boolean;
  atomic?: boolean;
  vars?: Record<string, [any, string?]>;
}

// styled("div")({ name: "Foo", class: "generated-css-class" })
export function styled(tag: string) {
  return (config: StyledConfig) => {
    const Component = forwardRef((props: any, ref) => {
      const { as: renderAs = tag, class: extraClass = "", ...rest } = props;

      const isCustomComponent =
        config.propsAsIs !== undefined
          ? config.propsAsIs
          : typeof renderAs !== "string" ||
            renderAs.includes("-") ||
            renderAs[0].toUpperCase() === renderAs[0];

      const domProps = filterDomProps(isCustomComponent, rest, ["as", "class"]);
      domProps.ref = ref;
      domProps.className = config.atomic
        ? cx(config.class, domProps.className || extraClass)
        : cx(domProps.className || extraClass, config.class);

      // Áp CSS variables động dựa trên props, vd: vars: { color: [props => props.color] }
      if (config.vars) {
        const styleVars: Record<string, string> = {};
        for (const varName in config.vars) {
          const [valueOrFn, unit = ""] = config.vars[varName];
          const value = typeof valueOrFn === "function" ? valueOrFn(props) : valueOrFn;
          styleVars[`--${varName}`] = `${value}${unit}`;
        }
        domProps.style = { ...styleVars, ...(domProps.style || {}) };
      }

      return createElement(renderAs, domProps);
    });

    Component.displayName = config.name;
    (Component as any).__wyw_meta = { className: config.class || "", extends: tag };
    return Component;
  };
}

function createDomPropValidator() {
  // ... danh sách whitelist attribute HTML/SVG (rút gọn ở đây, xem file gốc để đầy đủ)
  const htmlAndSvgAttributes = /^(children|className|style|id|href|src|...)$/;
  const cache = Object.create(null);
  return function isValid(propName: string) {
    if (cache[propName] === undefined) {
      cache[propName] =
        htmlAndSvgAttributes.test(propName) ||
        (propName.charCodeAt(0) === 111 && propName.charCodeAt(1) === 110 && propName.charCodeAt(2) < 91); // "on" + uppercase = event handler
    }
    return cache[propName];
  };
}
```

---

## 19. `PreloadChunks.tsx` (module `92246`) — No-op ở phía client

```tsx
// Trên client, component này không làm gì (chỉ hoạt động ở server để preload script chunks)
export function PreloadChunks({ moduleIds }: { moduleIds: string[] }) {
  return null;
}
```

---

## 20. `shared-exports.ts` (module `45987`) — File tổng hợp re-export

```ts
export { default as Divider } from "./Divider";           // "cG"
export { default as ErrorStar } from "./ErrorStar";       // "LF"
export { default as Loading } from "./Loading";           // "Rh"
export { default as OccurrenceTimeButton } from "./OccurrenceTimeButton"; // qua module 94023
```

---

## 21. `entry.ts` (module `87279`) — Điểm khởi chạy chunk (entry point)

```ts
// Đây là code mà webpack chạy khi chunk này được load:
// chỉ đơn giản "đánh thức" (resolve) 2 module chính của trang chi tiết sự kiện
import(/* webpackChunkName: "DetailEventLoader" */ "./DetailEventLoader");
import(/* webpackChunkName: "EventSeoHero" */ "./EventSeoHero");
```

---

## Tổng kết cấu trúc

Đây là chunk cho **trang chi tiết sự kiện** (event detail page) của một hệ thống bán vé (đa ngôn ngữ vi/en, dùng Next.js App Router):

- **UI cơ bản**: `Button`, `Loading`, `Divider`, `ErrorStar`
- **Điều hướng an toàn**: `SafeLink` + `LeavePageContextProvider` (cảnh báo rời trang khi có form dở)
- **Nghiệp vụ đặt vé**: `OccurrenceTimeButton` (chọn suất diễn/giờ chiếu)
- **SEO**: `EventSeoHero` (nội dung ẩn phục vụ crawler)
- **Hạ tầng dùng chung**: `cn`/`cx` (merge class), `styled` (css-in-js factory), bản rút gọn của `next/dynamic` và `AsyncLocalStorage` (nội bộ Next.js)

Nếu bạn muốn, mình có thể tách file này thành nhiều file `.ts/.tsx` riêng để tải về, hoặc phân tích sâu hơn một component cụ thể (ví dụ luồng đặt vé qua `OccurrenceTimeButton`).
