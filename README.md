# DealDocs - Streamlined Quote Generator Desktop App

## Project Description

DealDocs is a desktop application, built with **Tauri** and **React**, designed to simplify and streamline the process of creating project quotes. It allows users to quickly generate professional-looking PDF quotes by defining project steps and their associated pricing. The application focuses on simplicity and ease of use, providing a user-friendly interface to create quotes efficiently.

![screenshot](https://raw.githubusercontent.com/RavenSam/DealDocs/refs/heads/main/public/screenshot.png)

## Features

This application includes the following core features:

- [x] Step-Based Quote Creation
- [x] Pricing Input
- [x] Dynamic Quote Preview
- [x] PDF Quote Download
- [x] Internationalization (En/FR)
- [x] Save quotes to a database
- [x] Drag & Drop steps

## Download the App

You can download the pre-built DealDocs desktop application from the [GitHub Releases page](https://github.com/RavenSam/DealDocs/releases/latest). Download the appropriate package for your system.

## Tech Stack

- **Frontend:** [React](https://reactjs.org/)
- **Desktop Framework:** [Tauri v2](https://tauri.app)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Build Tooling:** [Vite](https://vitejs.dev/)

## Setup and Installation (For Developers)

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/RavenSam/DealDocs.git
    cd DealDocs
    ```

2.  **Install dependencies using pnpm:**

    ```bash
    pnpm install
    ```

3.  **Install [Tauri v2](https://tauri.app)**
    Follow the link to get started for your respective operating system
4.  **Run the application in development mode:**

    ```bash
    pnpm tauri dev
    ```

    This command will likely start the development server and open the desktop application.

5.  **Building the application for distribution:**

    ```bash
    pnpm tauri build
    ```

    This command will build distributable packages for your target operating systems in the `src-tauri/target/release/bundle` directory.
