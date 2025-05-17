# CI/CD Demo Application

This project is a simple demonstration of a Continuous Integration (CI) and Continuous Deployment (CD) pipeline using TypeScript, Node.js, and SQLite. It includes a basic UI for managing items with CRUD operations.

## Project Structure

```
ci-cd-demo
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── controllers             # Contains controllers for handling requests
│   │   └── itemController.ts    # Controller for item-related operations
│   ├── models                  # Contains data models
│   │   └── item.ts             # Model defining the structure of an item
│   ├── routes                  # Contains route definitions
│   │   └── itemRoutes.ts       # Routes for item-related operations
│   ├── services                # Contains services for business logic
│   │   └── dbService.ts        # Service for database operations
│   ├── public                  # Contains static files for the UI
│   │   ├── css
│   │   │   └── style.css       # CSS styles for the UI
│   │   ├── js
│   │   │   └── main.ts         # Client-side JavaScript
│   │   └── index.html          # Main HTML file for the UI
│   └── types                   # Contains TypeScript types and interfaces
│       └── index.ts            # Type definitions used throughout the app
├── tests                       # Contains unit tests
│   └── app.test.ts             # Tests for the application
├── .github
│   └── workflows               # Contains CI/CD workflows
│       ├── ci.yml              # Continuous Integration workflow
│       └── cd.yml              # Continuous Deployment workflow
├── database                    # Directory for database files
│   └── .gitkeep                # Keeps the database directory in version control
├── .gitignore                  # Specifies files to ignore in Git
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
├── jest.config.js              # Jest configuration file
└── README.md                   # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd ci-cd-demo
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

4. **Access the UI:**
   Open your browser and navigate to `http://localhost:3000`.

## CI/CD Workflows

- **Continuous Integration (CI):** The CI workflow is defined in `.github/workflows/ci.yml`. It runs tests and builds the application on every push to the repository.

- **Continuous Deployment (CD):** The CD workflow is defined in `.github/workflows/cd.yml`. It deploys the application to the specified environment after successful CI.

## Usage

You can create, read, update, and delete items using the UI. The application interacts with a local SQLite database to persist data.

## License

This project is licensed under the MIT License.# CI-test-fhv
