# Simply PatternFly - Enhanced PatternFly Components <img src="packages/example/src/assets/logo.svg" alt="Simply PatternFly Logo" width="48" height="auto" align="left" style="margin-right: 20px">

A collection of enhanced PatternFly components designed to be more developer-friendly and easier to use than the standard PatternFly offerings. This multi-module workspace provides simplified, opinionated components that maintain PatternFly's design system while reducing boilerplate and complexity.

## Why Simply PatternFly?

While PatternFly provides a comprehensive design system, its components can sometimes be verbose and require significant setup. Simply PatternFly addresses this by:

- **Reducing boilerplate**: Pre-configured components with sensible defaults
- **Better developer experience**: Simplified APIs and cleaner prop interfaces  
- **Enhanced form handling**: Seamless React Hook Form integration out of the box
- **Maintained consistency**: Built on top of PatternFly's design tokens and principles

## Project Structure

```
simply-patternfly/
├── packages/
│   ├── core/                    # Core PatternFly components
│   ├── react-hook-form/         # React Hook Form integration components
│   └── example/                 # Example web application
├── pnpm-workspace.yaml          # PNPM workspace configuration
└── package.json                 # Root workspace package.json
```

## Modules

### `@simply-patternfly/core`
Enhanced PatternFly components with simplified APIs and better defaults.

**Features:**
- Streamlined UI components with reduced prop complexity
- Pre-configured components following PatternFly design principles
- Enhanced accessibility and usability out of the box
- Lightweight with minimal dependencies beyond React and PatternFly

### `@simply-patternfly/react-hook-form`
Form components that seamlessly integrate PatternFly with React Hook Form.

**Features:**
- Drop-in form field components with automatic validation display
- Built-in error handling and field state management
- Type-safe form components with full TypeScript support
- Eliminates the need for manual form state wiring
- Extends `@simply-patternfly/core` components

### `example`
Interactive showcase demonstrating the simplified PatternFly components in action.

**Features:**
- Live examples comparing Simply PatternFly vs standard PatternFly components
- Interactive demos showing reduced complexity and improved developer experience
- Development and testing environment for component development

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- PNPM (recommended package manager)

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

```bash
# Start the example app in development mode
pnpm dev

# Build all packages
pnpm build

# Run linting across all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

### Working with Individual Packages

```bash
# Run commands in specific packages
pnpm --filter core build
pnpm --filter react-hook-form dev
pnpm --filter example dev
```

## Package Scripts

### Root Level
- `pnpm dev` - Start the example app
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm clean` - Clean all packages

### Individual Packages
Each package has its own set of scripts:
- `build` - Build the package
- `dev` - Development mode (libraries: watch mode, example: dev server)
- `lint` - Lint the package
- `clean` - Clean build artifacts

## Architecture

This workspace uses:
- **PNPM Workspaces** for monorepo management
- **TypeScript** with project references for type checking
- **Vite** for building and development
- **ESLint** for code quality
- **React Hook Form** for form management


## Contributing

1. Make changes to the appropriate package
2. Test your changes with `pnpm build` and `pnpm dev`
3. Run linting with `pnpm lint`
4. Ensure all packages build successfully