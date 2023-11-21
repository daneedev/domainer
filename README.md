# Domainer
## About
- Domainer is web tool, to manage subdomains using Cloudflare API
### Functions
- User managment
- Role managment (each role has a subdomain limit)
- Subdomain managment (Admin can approve or decline specific subdomain)
## Instalation (Docker)
- **Latest version**
  - ```docker run -d --restart=always -v domainer:/home/node/ -p 3000:3000 daneeskripter/domainer```
- **Development version [(please read this)](#DEVwarning)**
  - ```docker run -d --restart=always -v domainer:/home/node/ -p 3000:3000 daneeskripter/domainer:dev```
## DEV warning
- Dev version includes all commits on dev
- It can have bugs or security vulnerabilities
- Use at your own risk!
