# Branch-Based Deployment System

## 📋 Overview

This project demonstrates a **branch-based CI/CD deployment** system where:
- **`staging` branch** → **Staging EC2 instance**
- **`main` branch** → **Production EC2 instance**

Code automatically deploys to the correct environment when pushed using GitHub Actions.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│       GitHub Repository                  │
│    (main & staging branches)             │
└──────────────────┬──────────────────────┘
                   │ Push
                   ▼
        ┌─────────────────────┐
        │  GitHub Actions     │
        │  (CI/CD Pipeline)   │
        └──┬──────────────┬───┘
           │              │
      staging branch   main branch
           │              │
    ┌──────▼──────┐   ┌───▼────────┐
    │ Staging EC2 │   │ Production  │
    │  :3000      │   │ EC2 :3000   │
    └─────────────┘   └─────────────┘
```

---

## 📱 Application Endpoints

| Endpoint | Response |
|----------|----------|
| `/` | Homepage with branch info |
| `/health` | `{"status": "healthy", "timestamp": "..."}` |
| `/version` | `{"version": "1.0.0", "branch": "staging/main", "environment": "..."}` |

---

## 🔄 CI/CD Workflow

### How It Works

1. **Push code to GitHub**
   ```bash
   git push origin staging    # Deploys to staging EC2
   git push origin main       # Deploys to production EC2
   ```

2. **GitHub Actions automatically:**
   - ✅ Detects branch
   - ✅ Routes to correct EC2 instance
   - ✅ SSHs into EC2
   - ✅ Pulls latest code
   - ✅ Installs dependencies
   - ✅ Restarts application with PM2
   - ✅ Verifies health endpoint

3. **No manual deployment needed** - Fully automatic!

---

## 📊 Branch-to-Environment Mapping

| Branch | Environment | EC2 Instance | Badge |
|--------|-------------|--------------|-------|
| `staging` | Staging | staging-ec2 | 🔨 Orange |
| `main` | Production | prod-ec2 | 📦 Green |

---

## 🚀 Deployment Process

### Step 1: Update Code Locally

```bash
git checkout staging
# Edit files
git add .
git commit -m "Update staging"
```

### Step 2: Push to GitHub

```bash
git push origin staging
```

### Step 3: GitHub Actions Deploys Automatically

- Watch progress: GitHub repo → **Actions** tab
- Monitor logs: Click the workflow run

### Step 4: Verify Deployment

```bash
# From your local machine
curl http://STAGING_EC2_IP:3000/version
# Should show: "branch": "staging"

# Or for production
curl http://PROD_EC2_IP:3000/version
# Should show: "branch": "main"
```

---

## 🔐 GitHub Secrets Configuration

The pipeline uses these GitHub secrets to connect to EC2:

### Required Secrets

**Staging Environment:**
- `STAGING_EC2_HOST` - Staging EC2 public IP
- `STAGING_EC2_USER` - SSH user (ubuntu)
- `STAGING_EC2_KEY` - SSH private key

**Production Environment:**
- `PROD_EC2_HOST` - Production EC2 public IP
- `PROD_EC2_USER` - SSH user (ubuntu)
- `PROD_EC2_KEY` - SSH private key

### How to Add Secrets

1. Go to GitHub repo → **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with exact names above

---

## ✅ Verification Steps

### 1. Check GitHub Actions Status

```
GitHub repo → Actions tab
├── See workflow "Deploy to EC2"
├── Green ✅ = Success
├── Red ❌ = Failed
└── Check logs for details
```

### 2. Test Staging Endpoint

```bash
curl http://STAGING_IP:3000/health
# Returns: {"status": "healthy", ...}

curl http://STAGING_IP:3000/version
# Returns: {"branch": "staging", "environment": "staging"}
```

### 3. Test Production Endpoint

```bash
curl http://PROD_IP:3000/health
curl http://PROD_IP:3000/version
# Returns: {"branch": "main", "environment": "production"}
```

### 4. Verify Branch Separation

```bash
# Staging should have different code than production
curl http://STAGING_IP:3000/
curl http://PROD_IP:3000/
# Should be different deployments
```

---

## 🧪 Test the CI/CD Pipeline

### Test 1: Deploy to Staging

```bash
# Make a change on staging branch
git checkout staging
echo "# Test comment" >> server.js
git add .
git commit -m "Test staging deployment"
git push origin staging

# Watch GitHub Actions
# Go to repo → Actions → See workflow run
# Wait for completion (usually 2-3 minutes)

# Verify staging got the update
curl http://STAGING_IP:3000/version
# Should show: "branch": "staging"
```

### Test 2: Deploy to Production

```bash
# Make a change on main branch
git checkout main
echo "# Prod test" >> server.js
git add .
git commit -m "Test production deployment"
git push origin main

# Watch GitHub Actions
# Should see different workflow run

# Verify production got the update
curl http://PROD_IP:3000/version
# Should show: "branch": "main"
```

### Test 3: Verify Branch Isolation

```bash
# Staging should still have old code
curl http://STAGING_IP:3000/version
# Should be different from production

# If both show same code = PROBLEM
# Each should be independent
```

---

## 📋 Deployment Pipeline Steps

The GitHub Actions workflow performs these steps:

### 1. Checkout Code
- Clones the repository

### 2. Determine Environment
- Checks which branch was pushed
- Routes to correct EC2 instance

### 3. Setup SSH
- Configures SSH key for secure connection
- Adds EC2 to known_hosts

### 4. Deploy Application
On the EC2 instance:
```bash
cd /home/ubuntu/app
git fetch origin
git checkout [staging/main]
git pull origin [staging/main]
npm install
pm2 delete app || true
BRANCH_NAME=[staging/main] pm2 start server.js --name app
pm2 save
```

### 5. Verify Health
- Waits 5 seconds for app to start
- Checks `/health` endpoint
- Fails if health check fails

### 6. Log Results
- Records deployment completion

---

## 🎯 Key Features

✅ **Automatic Deployment** - Deploys on every push  
✅ **Branch Separation** - Each branch deploys to different EC2  
✅ **No Manual Steps** - GitHub Actions handles everything  
✅ **Health Checks** - Verifies deployment succeeded  
✅ **SSH Security** - Uses GitHub secrets for credentials  
✅ **Simple & Reliable** - No Docker, no Kubernetes needed  

---

## 📁 Repository Structure

```
branch-based-deployment/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions pipeline
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js dependencies
├── server.js                   # Express application
└── README.md                   # This file
```

---

## 🔧 Troubleshooting

### GitHub Actions Workflow Failed

**Check logs:**
1. Go to GitHub repo → **Actions** tab
2. Click failed workflow
3. Click failed job step
4. Read error message

**Common Issues:**

| Issue | Solution |
|-------|----------|
| SSH connection failed | Check EC2 security group allows port 22 from GitHub |
| Secret not found | Verify secret names exactly match workflow file |
| App not running after deploy | SSH to EC2, check `pm2 logs app` |
| Health check failed | Verify port 3000 is open in security group |

### Application Not Responding

```bash
# SSH to EC2
ssh -i key.pem ubuntu@EC2_IP

# Check PM2 status
pm2 list
pm2 logs app --lines 50

# Restart if needed
pm2 restart app
```

---

## 📝 Common Commands

### Git Commands

```bash
# Switch branches
git checkout staging
git checkout main

# Push changes
git push origin staging
git push origin main

# View branches
git branch -a
```

### GitHub Actions Monitoring

```
GitHub → Actions → Select workflow run
├── View each step's logs
├── Check for ✅ or ❌
└── Click failed step for details
```

### Verify Deployment

```bash
# Check health
curl http://EC2_IP:3000/health

# Check version/branch
curl http://EC2_IP:3000/version

# View homepage
curl http://EC2_IP:3000/
```

---

## 🎓 What You'll Learn

- ✅ Git branching strategies
- ✅ GitHub Actions CI/CD pipelines
- ✅ SSH-based deployments
- ✅ Infrastructure automation
- ✅ DevOps best practices

---

## ✨ Next Steps

1. **Push code to GitHub** (if not done)
   ```bash
   git push -u origin main
   git push -u origin staging
   ```

2. **Configure GitHub Secrets** (6 secrets)

3. **Test deployments** to staging and production

4. **Monitor GitHub Actions** for successful deploys

5. **Verify endpoints** on both EC2 instances

---

## 📞 Questions?

- Check GitHub Actions logs for errors
- SSH to EC2 and check PM2 logs
- Verify security groups allow required ports
- Ensure all GitHub secrets are configured

---

**You're all set! Your CI/CD pipeline is ready.** 🚀

