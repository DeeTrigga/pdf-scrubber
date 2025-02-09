# UI Components Documentation

## Table of Contents

- [Alert Component](#alert-component)
  - [Basic Usage](#alert-basic-usage)
  - [Props & Types](#alert-props)
  - [Variants](#alert-variants)
  - [Subcomponents](#alert-subcomponents)
- [Progress Component](#progress-component)
  - [Basic Usage](#progress-basic-usage)
  - [Props & Types](#progress-props)
  - [Customization](#progress-customization)

## Alert Component

The Alert component is a flexible notification element that can be used to display messages, warnings, or status updates.

### Basic Usage

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Simple Alert
<Alert>
  <AlertDescription>
    Your files have been processed successfully.
  </AlertDescription>
</Alert>

// Alert with Title
<Alert>
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Changes have been saved.
  </AlertDescription>
</Alert>

// Destructive Variant
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Something went wrong while processing your request.
  </AlertDescription>
</Alert>
```

### Props

#### Alert Component Props

```typescript
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  className?: string;
}
```

#### AlertTitle Props

```typescript
interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}
```

#### AlertDescription Props

```typescript
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
```

### Variants

The Alert component supports two variants:

1. `default`: Standard alert styling
   - Neutral background
   - Default text color
   - Standard border

2. `destructive`: Error/warning styling
   - Destructive border color
   - Destructive text color
   - Specialized icon color

### CSS Classes

The Alert component uses a combination of Tailwind CSS classes:

```css
.alert {
  relative w-full rounded-lg border p-4
  [&>svg~*]:pl-7
  [&>svg+div]:translate-y-[-3px]
  [&>svg]:absolute
  [&>svg]:left-4
  [&>svg]:top-4
  [&>svg]:text-foreground
}

.alert-title {
  mb-1 font-medium leading-none tracking-tight
}

.alert-description {
  text-sm [&_p]:leading-relaxed
}
```

### Accessibility

- Uses `role="alert"` for screen readers
- Proper heading hierarchy with `AlertTitle`
- Keyboard navigable structure

## Progress Component

The Progress component is a visual indicator of progress or loading status.

### Basic Usage

```tsx
import { Progress } from "@/components/ui/progress"

// Basic Progress Bar
<Progress value={60} />

// Custom Styled Progress
<Progress 
  value={80} 
  className="h-3 bg-blue-100" 
/>

// Animated Progress
<Progress 
  value={progress} 
  className="transition-all duration-500" 
/>
```

### Props

```typescript
interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number;  // Required: Progress value (0-100)
  className?: string;  // Optional: Additional CSS classes
}
```

### Key Features

1. **Smooth Animations**
   - Built-in transition effects
   - Smooth value updates
   - Hardware-accelerated transforms

2. **Accessibility**
   - Uses Radix UI primitives
   - ARIA attributes
   - Screen reader support

3. **Customization**
   - Flexible styling system
   - Theme integration
   - Size and color variants

### CSS Structure

```css
.progress {
  relative h-2 w-full
  overflow-hidden rounded-full
  bg-primary/20
}

.progress-indicator {
  h-full w-full flex-1
  bg-primary transition-all
}
```

### Best Practices

1. **Value Handling**
   - Always provide a number between 0-100
   - Handle undefined/null values gracefully
   - Avoid rapid value updates

2. **Accessibility**
   - Include descriptive aria-label
   - Use with loading states
   - Provide context when needed

3. **Performance**
   - Use CSS transforms for smooth animations
   - Debounce rapid updates
   - Handle large numbers of instances carefully

### Example Integration

```tsx
function LoadingState() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 10
      })
    }, 500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto">
      <Progress value={progress} />
      <p className="text-sm text-gray-500 mt-2">
        Loading: {progress}%
      </p>
    </div>
  )
}
```

## Common Features

Both components share these features:

1. **Theme Integration**
   - Uses CSS variables for theming
   - Respects dark mode
   - Consistent styling system

2. **Responsive Design**
   - Mobile-friendly sizing
   - Flexible layouts
   - Proper touch targets

3. **Type Safety**
   - Full TypeScript support
   - Prop validation
   - Intelligent defaults

## Contributing

When modifying these components:

1. Maintain TypeScript types
2. Update documentation
3. Test accessibility
4. Verify theme compatibility
5. Add examples for new features
