<h1 align="center">🌐 Domainer</h1>

<h3 align="center">Web-based Subdomain Management Platform</h3>
<p align="center">
   🚀 Streamlined subdomain management using Cloudflare API with user roles and approval workflows
  <br>
  <br>
  <img alt="Version" src="https://img.shields.io/badge/version-3.0.0--beta.1-blue">
  <img alt="License" src="https://img.shields.io/badge/license-GPL--3.0-green">
  <img alt="Status" src="https://img.shields.io/badge/status-beta-yellow">
  <br>
  <br>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff">
  <img alt="Express.js" src="https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB">
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=fff">
  <img alt="Cloudflare" src="https://img.shields.io/badge/Cloudflare-F38020?logo=cloudflare&logoColor=fff">
</p>

## 🎯 About

Domainer is a powerful web-based platform designed to simplify subdomain management through the Cloudflare API. It provides a comprehensive solution for organizations and individuals who need to manage multiple subdomains with proper user access controls and approval workflows.

### ✨ Key Features

- 👥 **User Management** - Complete user registration, authentication, and profile management
- 🔐 **Role-Based Access Control** - Configurable roles with customizable subdomain limits
- 🌐 **Subdomain Management** - Easy subdomain creation with A, AAAA, and CNAME record support
- ✅ **Approval Workflow** - Admin approval system for subdomain requests
- 📊 **Dashboard** - Intuitive interface for managing your subdomains
- 🔗 **Cloudflare Integration** - Seamless DNS management through Cloudflare API
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices

### 🏗️ Built With

- **Backend**: TypeScript, Node.js, Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: Passport.js with session management
- **Frontend**: HTML, CSS, JavaScript
- **DNS Provider**: Cloudflare API
- **Styling**: Custom CSS with modern design principles

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm
- Cloudflare account with API access
- Domain configured in Cloudflare

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/domainerapp/domainer.git
   cd domainer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm run serve
   ```

For detailed installation instructions, visit our documentation (coming soon).

## 📋 Usage

1. **Register an account** or log in with existing credentials
2. **Request a subdomain** by entering your desired subdomain name and target
3. **Wait for admin approval** - admins will review and approve/decline requests
4. **Manage your subdomains** from the dashboard once approved
5. **Edit or delete** subdomains as needed through the interface

### Admin Features

- View and manage all user accounts
- Configure user roles and subdomain limits
- Approve or decline subdomain requests
- Monitor system statistics and usage

## 🛠️ Development

### Development Mode

```bash
# Start development server with auto-reload
npm run dev
```

### Project Structure

```
domainer/
├── src/
│   ├── database.ts         # Database configuration
│   ├── server.ts          # Main server file
│   ├── handlers/          # Authentication & middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── views/             # HTML templates
│   └── public/            # Static assets
├── data/                  # Database files
└── dist/                  # Compiled TypeScript
```

## 🤝 Contributing

We welcome contributions to Domainer! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please make sure to:
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Test your changes thoroughly

## 📝 License

This project is licensed under the **[GPL-3.0 License](https://www.gnu.org/licenses/gpl-3.0.html)** - see the [LICENSE](LICENSE) file for details.

The GPL-3.0 license allows you to:
- ✅ Use the software for any purpose
- ✅ Study and modify the source code
- ✅ Share the software with others
- ✅ Share your modifications

**Any modified version must be under the same license to keep the project open-source and free for everyone!**

## 🔗 Links

- 📚 [Documentation](https://docs.daneeskripter.dev/projects/domainer/install)
- 🐛 [Bug Reports](https://github.com/domainerapp/domainer/issues)
- 💬 [Discussions](https://github.com/domainerapp/domainer/discussions)
- 🌟 [Changelog](https://github.com/domainerapp/domainer/releases)

## 👨‍💻 Author

**Copyright 2025 [@daneedev](https://github.com/daneedev)**

---

<p align="center">
  Made with ❤️ for the open-source community
  <br>
  <sub>Star ⭐ this repository if you find it helpful!</sub>
</p>
