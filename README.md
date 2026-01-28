# Branch-Based CI/CD Deployment System

##  Project Overview

This project demonstrates a **production-ready CI/CD pipeline** that automatically deploys applications to different environments based on Git branches:

- **Push to `staging` branch** → Automatic deployment to **Staging EC2**
- **Push to `main` branch** → Automatic deployment to **Production EC2**

**No manual deployment steps required** - Everything is automated using GitHub Actions.

---

##  Architecture Diagram

```
┌──────────────────────────────────────┐
│      GitHub Repository               │
│   (staging & main branches)          │
└──────────────────┬───────────────────┘
                   │ Push Code
                   ▼
        ┌─────────────────────┐
        │  GitHub Actions     │
        │  (Automated CI/CD)   │
        └──┬──────────────┬───┘
           │              │
        staging         main
           │              │
    ┌──────▼─────┐   ┌────▼────────┐
    │ Staging    │   │ Production   │
    │ EC2 Server │   │ EC2 Server   │
    │ :3000      │   │ :3000        │
    └────────────┘   └─────────────┘
```

---

##  How It Works

### 1. **Developer Workflow**
```bash
# Make changes locally
git checkout staging
git add .
git commit -m "Update staging"
git push origin staging  ← GitHub Actions triggers automatically
```

### 2. **GitHub Actions Deployment**
The CI/CD pipeline automatically:
- ✅ Connects to correct EC2 instance via SSH
- ✅ Pulls latest code from GitHub
- ✅ Installs dependencies (`npm install`)
- ✅ Restarts application with PM2 process manager
- ✅ Verifies health endpoint for successful deployment

### 3. **Application Running**
Your Node.js app (Express.js) is now running on the EC2 instance and ready to serve requests.

---

##  Deployment Status & Screenshots

### Staging Deployment - GitHub Actions
![Staging Deployment](Images/Staging%20Deployment.png)
- Status: ✅ Successful
- Automatically triggers on push to `staging` branch
- Deploys to Staging EC2 instance

### Production Deployment - GitHub Actions
![Production Deployment](Images/Production%20Deployment.png)
- Status: ✅ Successful
- Automatically triggers on push to `main` branch
- Deploys to Production EC2 instance

### EC2 Instances Running
![EC2 Instances](Images/EC2%20.png)
- Staging Instance: Running ✅
- Production Instance: Running ✅
- Security Groups: SSH (22), HTTP (80), Custom (3000)

### Staging Application - Live Response
![Staging EC2 Page](Images/Staging%20EC2%20Page.png)
- Branch: `staging`
- Environment: Staging
- Health: ✅ Healthy

### Production Application - Live Response
![Production EC2 Page](Images/Production%20EC2%20Page.png)
- Branch: `main`
- Environment: Production
- Health: ✅ Healthy

---

##  Technical Stack

| Component | Technology |
|-----------|-----------|
| **Application** | Node.js + Express.js |
| **Process Manager** | PM2 |
| **CI/CD** | GitHub Actions |
| **Infrastructure** | AWS EC2 (Ubuntu 22.04) |
| **Deployment Method** | SSH + Git |
| **Package Manager** | npm |

---

##  Pipeline Configuration

### GitHub Secrets (Required)
```
STAGING_EC2_HOST    → Staging server IP
STAGING_EC2_USER    → ubuntu
STAGING_EC2_KEY     → SSH private key

PROD_EC2_HOST       → Production server IP
PROD_EC2_USER       → ubuntu
PROD_EC2_KEY        → SSH private key
```

### Deployment Script
```bash
cd /home/ubuntu/branch-based-deployment
git pull origin [branch]
npm install
pm2 restart node-app || pm2 start server.js --name node-app
```

---

##  Application Endpoints

| Endpoint | Response | Purpose |
|----------|----------|---------|
| `/` | HTML Homepage | Display branch info |
| `/health` | `{"status": "healthy"}` | Health check |
| `/version` | `{"branch": "staging", "environment": "..."}` | Version info |

---

##  Testing the Deployment

### Verify Staging Deployment
```bash
curl http://STAGING_IP:3000/version
# Output: {"branch": "staging", "environment": "staging"}
```

### Verify Production Deployment
```bash
curl http://PROD_IP:3000/version
# Output: {"branch": "main", "environment": "production"}
```

---

##  Project Structure

```
branch-based-deployment/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions pipeline
├── package.json                # Node.js dependencies
├── server.js                   # Express application
└── README.md                   # Documentation
```

---

##  Key Features

✅ **Automated Deployment** - No manual steps needed  
✅ **Branch-based Routing** - Different branches → Different servers  
✅ **Health Checks** - Verifies successful deployment  
✅ **SSH Security** - Uses GitHub secrets for credentials  
✅ **Zero-downtime** - PM2 handles graceful restarts  
✅ **Production-ready** - Suitable for real-world use  

---

##  Security Considerations

- SSH keys stored securely in GitHub Secrets
- EC2 security groups restrict access to authorized IPs
- Private keys never exposed in workflow logs
- Separate credentials for staging and production

---

##  What I Learned & Implemented

✔️ **Git branching strategies** - Staging/Production separation  
✔️ **GitHub Actions CI/CD** - Automated workflow automation  
✔️ **SSH deployments** - Secure server communication  
✔️ **Infrastructure automation** - No manual server management  
✔️ **DevOps best practices** - Industry-standard deployment patterns  

---

##  Next Steps

1. **Configure GitHub Secrets** - Add EC2 credentials
2. **Push code to repository** - Trigger first deployment
3. **Monitor GitHub Actions** - Watch workflow execution
4. **Verify endpoints** - Test application endpoints
5. **Scale as needed** - Add more environments (QA, UAT, etc.)

---

**Status: ✅ Fully Operational and Production-Ready**
