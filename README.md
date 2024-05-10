# Online Media Shelf

## Overview
Online Media Shelf is a collaborative platform designed to help users document and manage their media collections online. It aims to become the ultimate resource for cataloging and sharing collections of books, DVDs, Blu-rays, and CDs. Whether you're a casual collector or a dedicated archivist, Online Media Shelf provides tools to track your items and collaborate with others to create the most comprehensive media library on the internet.

## Features
- **Cataloging**: Users can add their media items to the platform, including details like title, author/director, release date, and format.
- **Collaboration**: Share your collection with others, receive contributions and insights, or help other users complete their collections.
- **Organization**: Sort and filter your collection based on various criteria, making it easy to find and manage your items.

## Build
This being my first real ASP.Net core project I created all on my own (for now), compiling and deploying is not a hashed out solution, and it's a bit involved. Compiling requires an **active Database**. If you want to compile the solution, you'll need to adjust the connection string in [appsettings.json](OnlineMediaShelf.Web/appsettings.json) to a database on your system.

Adding a migration is currently done with a Rider plugin, though if you understand EF Migrations, you can probably do it manually. **You'll need to change the connection string in [ApplicationContextFactory.cs](OnlineMediaShelf.Domain.ApplicationContextFactory.cs) to create a migration or update the database**

Deployment is currently not a concern and thusly I'll ignore it ^^

## Code of Conduct
We are committed to providing a friendly, safe, and welcoming environment for all. Please:
- **Be considerate**: Your work will be used by other people, and you in turn will depend on the work of others.
- **Be respectful**: Disagreements are okay, but personal attacks are not. Treat everyone with respect.
- **Be collaborative**: Cooperation from everyone helps produce a truly great community.
- **Be careful in the words that you choose**: Conduct yourself professionally. Be kind to others.

Violations of this code may result in your access being revoked.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you want to contribute to Online Media Shelf, please follow these steps:
1. **Fork the Repository**: Fork the project to your own GitHub account. This means you will have a copy of the repository under your GitHub account.
2. **Create a Branch**: Create a branch for your update. This keeps your changes organized and separate from the main project.
3. **Make Necessary Changes**: Add new functionalities or fix issues. Be sure that your code meets the project standards and is consistently formatted.
5. **Open a Pull Request**: After you have made your changes, open a pull request from your forked repository to our main project. Provide a concise and detailed description of your changes and the purpose of your pull request.
6. **Code Review**: Wait for the code review process. Maintainers will review your submission, and suggestions for improvement may be made.

Please note that all participants are expected to follow the community guidelines laid out in the Code of Conduct.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.
