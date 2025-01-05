# GUML - UML Generator

GUML is a web application that generates UML diagrams from GitHub repository files using AI. It provides an intuitive interface for selecting repositories, files, and generating UML diagrams with ease.

## Features

- GitHub authentication
- Repository selection from user's GitHub account
- File selection within chosen repositories
- AI-powered UML diagram generation
- Interactive UML diagram editor using Mermaid.js
- Responsive design using Mantine UI components

## Tech Stack

- Next.js 15 with App Router
- React 18
- TypeScript
- Mantine UI for components and styling
- NextAuth.js for GitHub authentication
- Mermaid.js for UML diagram rendering
- Vercel AI SDK for Mermaid UML markdown generation

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/vitaliy-pak/guml.git
   cd guml
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:
   ```
   GITHUB_ID=your_github_oauth_app_id 
   GITHUB_SECRET=your_github_oauth_app_secret 
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Log in with your GitHub account.
2. Follow the step-by-step process:
   a. Select a repository from your GitHub account
   b. Choose files for UML generation
   c. Generate the UML diagram using AI
3. Edit the generated UML diagram in the markdown editor.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/): A React framework for building server-side rendered and statically generated web applications.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces with reusable components.
- [Mantine](https://mantine.dev/): A fully featured React component library for building modern web applications.
- [NextAuth.js](https://next-auth.js.org/): An authentication library for Next.js applications supporting various providers.
- [Mermaid.js](https://mermaid-js.github.io/mermaid/): A JavaScript-based diagramming and charting tool that renders diagrams from text definitions.
- [Vercel AI SDK](https://sdk.vercel.ai/): A library for integrating AI models into web applications.
- [Groq](https://groq.com/): A high-performance AI inference engine and cloud platform for executing large language models.