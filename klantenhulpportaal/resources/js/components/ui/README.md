# UI Wrapper Components

This directory contains reusable UI wrapper components that encapsulate common styling patterns across the application. These components help maintain consistency and reduce code duplication.

## Available Components

### 1. PageContainer

A wrapper for main page content areas with consistent max-width, padding, and spacing.

```vue
<template>
    <PageContainer>
        <h1>Page Title</h1>
        <p>Content goes here...</p>
    </PageContainer>
</template>
```

### 2. CenteredContainer

A full-screen centered container for auth pages and similar layouts.

```vue
<template>
    <CenteredContainer>
        <h2>Login Form</h2>
        <!-- Form content -->
    </CenteredContainer>
</template>
```

### 3. FormInput

A comprehensive form input component that handles text, email, password, textarea, and select inputs with consistent styling and error handling.

```vue
<template>
    <FormInput
        v-model="form.email"
        type="email"
        name="email"
        label="Email Address"
        placeholder="Enter your email"
        data-test="email-input"
    />

    <FormInput
        v-model="form.category"
        type="select"
        name="category"
        label="Category"
        placeholder="Select a category"
    >
        <option value="1">Technical</option>
        <option value="2">Billing</option>
    </FormInput>

    <FormInput
        v-model="form.description"
        type="textarea"
        name="description"
        label="Description"
        :rows="4"
        placeholder="Describe your issue"
    />
</template>
```

**Props:**

- `type`: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number'
- `modelValue`: string | number
- `name`: string
- `label`: string
- `placeholder`: string
- `autocomplete`: string
- `dataTest`: string
- `ariaLabel`: string
- `rows`: number (for textarea)
- `error`: boolean

### 4. BaseButton

A flexible button component with multiple variants and sizes.

```vue
<template>
    <BaseButton variant="primary" size="md" type="submit" full-width data-test="submit-btn" @click="handleClick">
        Submit Form
    </BaseButton>

    <BaseButton variant="secondary" size="sm">Cancel</BaseButton>

    <BaseButton variant="danger">Delete</BaseButton>

    <BaseButton variant="link">Learn More</BaseButton>
</template>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
- `size`: 'sm' | 'md' | 'lg'
- `type`: 'button' | 'submit' | 'reset'
- `disabled`: boolean
- `fullWidth`: boolean
- `dataTest`: string
- `ariaLabel`: string

### 5. BaseCard

A card container with optional header, content, and footer sections.

```vue
<template>
    <BaseCard variant="elevated" title="Card Title" subtitle="Optional subtitle">
        <template #header>
            <h3>Custom Header</h3>
        </template>

        <p>Card content goes here</p>

        <template #footer>
            <BaseButton>Action</BaseButton>
        </template>
    </BaseCard>

    <BaseCard no-padding>
        <!-- Content with no default padding -->
        <div class="custom-padding">Content</div>
    </BaseCard>
</template>
```

**Props:**

- `variant`: 'default' | 'bordered' | 'elevated'
- `title`: string
- `subtitle`: string
- `noPadding`: boolean

### 6. BaseModal

A modal dialog with backdrop, close functionality, and flexible sizing.

```vue
<template>
    <BaseModal :show="showModal" title="Modal Title" subtitle="Optional subtitle" size="md" @close="handleClose">
        <p>Modal content</p>

        <template #footer>
            <BaseButton variant="secondary" @click="handleClose">Cancel</BaseButton>
            <BaseButton @click="handleSubmit">Save</BaseButton>
        </template>
    </BaseModal>
</template>
```

**Props:**

- `show`: boolean (required)
- `title`: string
- `subtitle`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showClose`: boolean (default: true)
- `closeOnBackdrop`: boolean (default: true)
- `maxHeight`: boolean (default: true)

### 7. StatusBadge

A badge component for displaying status, categories, and other labeled information.

```vue
<template>
    <StatusBadge variant="success">Active</StatusBadge>

    <StatusBadge variant="warning" size="lg">Pending</StatusBadge>

    <StatusBadge variant="danger" :rounded="false">Error</StatusBadge>
</template>
```

**Props:**

- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `rounded`: boolean (default: true)
- `dataTest`: string

## Import Usage

You can import components individually or use the barrel export:

```typescript
// Individual imports
import PageContainer from '@/components/ui/PageContainer.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// Barrel import (recommended)
import {PageContainer, BaseButton, FormInput} from '@/components/ui';
```

## Migration Examples

### Before (Repeated Styling)

```vue
<template>
    <div class="min-h-screen w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <form>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        v-model="email"
                        type="email"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <FormError name="email" />
                </div>
                <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>
        </div>
    </div>
</template>
```

### After (Using Wrappers)

```vue
<template>
    <CenteredContainer>
        <form>
            <FormInput v-model="email" type="email" name="email" label="Email" />

            <BaseButton type="submit" full-width>Submit</BaseButton>
        </form>
    </CenteredContainer>
</template>

<script setup>
import {CenteredContainer, FormInput, BaseButton} from '@/components/ui';
</script>
```

## Benefits

1. **Consistency**: All components follow the same design system
2. **Maintainability**: Changes to styling can be made in one place
3. **Developer Experience**: Less code to write and maintain
4. **Accessibility**: Built-in ARIA attributes and proper semantic structure
5. **Type Safety**: Full TypeScript support with proper prop types
6. **Testing**: Standardized data-test attributes and component structure
