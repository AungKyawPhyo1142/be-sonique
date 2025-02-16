## CONTRIBUTION

### Code of Conduct

We expect all contributors to follow these guidelines to ensure a consistent and high-quality codebase:

- **Database Changes**:

  - Before making any changes to the database, update the `database-diagram.md` to reflect the new or modified schema.
  - After updating the diagram, modify the Prisma schema file (`prisma/schema.prisma`) accordingly.
  - Create or update a migration file by running `npx prisma migrate dev --name your-migration-name`.

- **API Development**:

  - For creating or updating APIs, ensure you:
    1. Create the appropriate `route`, `controller`, and `service` files in their respective directories.
       - Example: `routes/example.ts`, `controllers/example.ts`, `services/example.ts`
    2. Inject the new or updated router into the main gateway file, typically done in `routes/gateway.ts`, using `app.use('/example', exampleRouter);`.

- **File Naming and Variable Naming**:
  - **File Names**: Use "kebab case" for file names. For example, `hello-world.ts`.
  - **Variable Names**:
    - Use "camel case" for variable names. For example, `let helloWorld = 1`.
    - Use "upper case snake case" for constant variables. For example, `const HELLO_WORLD = "A"`.

### Branching Strategy

We follow the [Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for our branching strategy. This involves the following branches:

- **Main Branch (`main`)**: The stable version of the project. All releases are tagged here.
- **Development Branch (`dev`)**: The active development branch where integration of features and fixes happens before release.
- **Feature Branches**: Branch off from `dev` for new features or bug fixes. Use the convention `feature/short-description` or `bugfix/short-description`.
- **Release Branches**: Branch off from `dev` to prepare for a release. Use the convention `release/x.x.x`.
- **Hotfix Branches**: Branch off from `main` for urgent fixes. Use the convention `hotfix/short-description`.

### Commit Message Guidelines

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard for commit messages. This includes:

- **Structure**: `type(scope): subject`
- **Types**:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation changes
  - `style`: Changes that do not affect the meaning of the code (e.g., white-space, formatting)
  - `refactor`: Code changes that neither fixes a bug nor adds a feature
  - `test`: Adding or updating tests
  - `chore`: Changes to the build process or auxiliary tools and libraries

Example commit message:

```
feat(auth): add JWT authentication

Implement JWT authentication for securing API endpoints.
```

### Coding Standards

- Use **TypeScript** with strict type settings to ensure type safety across the project.
- Apply **ESLint** rules as defined in the project’s `.eslintrc` configuration to maintain code quality.
- Follow [Prettier](https://prettier.io/) for code formatting.
- Ensure your code passes linting by running `npm run lint`.
- Write clear and concise code comments where necessary.
