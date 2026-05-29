
## 1. React 19 Features — Khi nào dùng cái nào

### 1.1 `useOptimistic` — Cho UX nhanh hơn

**Dùng khi:** Mutation mà bạn gần chắc chắn sẽ thành công (tạo booking, update status)

```typescript
// Trong logic.ts
const [optimisticItems, addOptimistic] = useOptimistic(
  orderItems,
  (state, newItem) => [...state, { ...newItem, status: 'pending' }]
)

// Khi waiter thêm món: UI cập nhật ngay, không đợi server
const addItem = async (item: MenuItem) => {
  addOptimistic(item)  // hiện lên ngay
  await api.addOrderItem(orderId, item)  // server confirm
}
// Nếu server lỗi → React auto-revert về state cũ
```

**Phù hợp với RSM:** Kitchen marking món "done", waiter thêm món vào order

---

### 1.2 `useActionState` — Form submission state

**Dùng khi:** Form có async submission, cần track pending/error/success state

```typescript
// Thay thế pattern: const [loading, setLoading] = useState(false)
const [state, submitAction, isPending] = useActionState(
  async (prevState: any, formData: FormData) => {
    try {
      await createBooking({
        customerName: formData.get('name') as string,
        customerPhone: formData.get('phone') as string,
        // ...
      })
      return { success: true }
    } catch (e) {
      return { error: e.message }
    }
  },
  null  // initial state
)

// JSX: isPending tự động true khi đang submit
<form action={submitAction}>
  <button disabled={isPending}>
    {isPending ? 'Đang tạo...' : 'Tạo booking'}
  </button>
  {state?.error && <p className="error">{state.error}</p>}
</form>
```

**Phù hợp với RSM:** Tất cả forms — create booking, import inventory, add cashflow entry

---

### 1.3 `useFormStatus` — Cho child components biết form đang submit

**Dùng khi:** Submit button hoặc input fields nằm trong child component riêng

```typescript
// Trong component con (vd: SubmitButton.tsx)
import { useFormStatus } from 'react-dom'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()  // biết form cha đang submit không
  return (
    <button disabled={pending} type="submit">
      {pending ? <Spinner /> : label}
    </button>
  )
}
// Không cần truyền isPending qua props — useFormStatus tự biết
```

---

### 1.4 `use(promise)` + Suspense — Data fetching

**Dùng khi:** Load data khi component mount, muốn tận dụng Suspense boundary

```typescript
// Trong lifecycle.ts — fetch data
function fetchBookings(restaurantId: string, date: Date) {
  return api.get('/booking', { restaurantId, date })  // trả về Promise
}

// Trong index.tsx — dùng use() để đọc promise
import { use, Suspense } from 'react'

function BookingList({ promise }: { promise: Promise<Booking[]> }) {
  const bookings = use(promise)  // suspend nếu chưa resolve
  return <ul>{bookings.map(b => <BookingItem key={b.id} booking={b} />)}</ul>
}

// Wrap với Suspense boundary
<Suspense fallback={<SkeletonList />}>
  <BookingList promise={fetchBookings(restaurantId, selectedDate)} />
</Suspense>
```

**Phù hợp với RSM:** Analytics reports, inventory list — các trang load data một lần

---

### 1.5 `ref` as prop — Không cần forwardRef nữa

```typescript
// React 19: ref là prop bình thường
function TableInput({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}

// Không cần forwardRef wrapper
const inputRef = useRef<HTMLInputElement>(null)
<TableInput ref={inputRef} placeholder="Tìm bàn..." />
```

---

### 1.6 Context Simplified

```typescript
// React 19: không cần <Context.Provider>
const ThemeContext = createContext('light')

// Trước:
<ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>

// Sau (React 19):
<ThemeContext value="dark">{children}</ThemeContext>
```

---

### 1.7 `useTransition` + Concurrent Rendering

**Dùng khi:** Update state không urgent (filter, sort) mà không muốn block typing/input

```typescript
// Trong logic.ts — search/filter
const [isPending, startTransition] = useTransition()
const [filter, setFilter] = useState('')
const [filtered, setFiltered] = useState(bookings)

const handleSearch = (query: string) => {
  setFilter(query)  // update input ngay
  startTransition(() => {
    // Đây là low-priority update — không block user input
    setFiltered(bookings.filter(b =>
      b.customerName.includes(query) || b.customerPhone.includes(query)
    ))
  })
}

// Hiện thị pending state trong UI
{isPending && <div className="filtering-indicator">Đang lọc...</div>}
```

**Phù hợp với RSM:** Search trong booking list, filter inventory, filter revenue report

---

## 2. Bun + React Integration Notes

**Bun serve với React 19 — Không cần Vite:**

```typescript
// apps/dashboard/src/index.ts (Bun server)
import index from './index.html'

Bun.serve({
  routes: { '/': index },
  development: {
    hmr: true,     // Hot Module Replacement built-in
    console: true, // Forward console logs từ browser
  }
})
```

```html
<!-- index.html -->
<html>
  <head>
    <link rel="stylesheet" href="./index.css" />  <!-- Bun bundle CSS tự động -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./frontend.tsx"></script>  <!-- Bun transpile TSX -->
  </body>
</html>
```

**Bun SSR với React 19 (tương lai):**
- Bun hỗ trợ `ReadableStream` cho React SSR
- Khi cần SEO (public menu page, booking page) → có thể add SSR sau
- Không lock-in architecture → dễ add
