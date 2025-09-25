# 🚀 Hotel RBS OTA - EC2 Deployment Guide

## Prerequisites
- ✅ EC2 instance running (Ubuntu 20.04+ recommended)
- ✅ SSH access to your EC2 instance
- ✅ Security groups configured (ports 22, 80, 443)
- ✅ Domain name (optional but recommended)

## Step-by-Step Deployment

### Step 1: Connect to Your EC2 Instance

```bash
# Replace with your actual details
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

### Step 2: Run the Deployment Script

```bash
# Download and run the deployment script
wget https://raw.githubusercontent.com/310511/FINALDEMO/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

### Step 3: Manual Configuration (if needed)

#### 3.1 Update Environment Variables
```bash
nano /var/www/hotel-rbs/.env
```

Make sure these are set correctly:
```env
API_BASE_URL=http://api.travzillapro.com/HotelServiceRest
API_USERNAME=MS|GenX
API_PASSWORD=GenX@123
PROXY_SERVER_PORT=3001
```

#### 3.2 Configure Domain (if you have one)
```bash
sudo nano /etc/nginx/sites-available/hotel-rbs
```

Replace `your-domain.com` with your actual domain:
```nginx
server_name your-domain.com www.your-domain.com;
```

#### 3.3 Restart Services
```bash
sudo systemctl restart nginx
pm2 restart all
```

### Step 4: SSL Certificate (Optional but Recommended)

#### 4.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 4.2 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 5: Verify Deployment

#### 5.1 Check Application Status
```bash
pm2 status
pm2 logs
```

#### 5.2 Check Nginx Status
```bash
sudo systemctl status nginx
```

#### 5.3 Test Application
- Visit: `http://your-ec2-public-ip` or `https://your-domain.com`
- Test hotel search functionality
- Test prebooking functionality

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3001
# Kill the process
sudo kill -9 <PID>
```

#### 2. Nginx Configuration Error
```bash
# Test nginx configuration
sudo nginx -t
# If error, check the config file
sudo nano /etc/nginx/sites-available/hotel-rbs
```

#### 3. PM2 Not Starting
```bash
# Check PM2 logs
pm2 logs
# Restart PM2
pm2 restart all
```

#### 4. API Connection Issues
```bash
# Check if proxy server is running
pm2 logs hotel-rbs-proxy
# Check environment variables
cat /var/www/hotel-rbs/.env
```

## 📊 Monitoring and Maintenance

### Check Application Status
```bash
pm2 status
pm2 monit
```

### View Logs
```bash
pm2 logs hotel-rbs-proxy
pm2 logs hotel-rbs-frontend
```

### Restart Application
```bash
pm2 restart all
```

### Update Application
```bash
cd /var/www/hotel-rbs
git pull origin main
npm run build
pm2 restart all
```

## 🔒 Security Considerations

### 1. Firewall Configuration
```bash
sudo ufw status
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
```

### 2. Environment Variables Security
- Never commit `.env` files to git
- Use strong passwords for API credentials
- Regularly rotate API keys

### 3. Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
cd /var/www/hotel-rbs
npm update
```

## 📈 Performance Optimization

### 1. Enable Gzip Compression
Add to nginx config:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. Set Up Log Rotation
```bash
sudo nano /etc/logrotate.d/hotel-rbs
```

### 3. Monitor Resource Usage
```bash
htop
pm2 monit
```

## 🆘 Support

If you encounter issues:
1. Check the logs: `pm2 logs`
2. Verify nginx status: `sudo systemctl status nginx`
3. Check firewall: `sudo ufw status`
4. Verify environment variables: `cat /var/www/hotel-rbs/.env`

## 📝 Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Hotel search works
- [ ] Hotel details page loads
- [ ] Prebooking functionality works
- [ ] API calls are successful
- [ ] SSL certificate is active (if using domain)
- [ ] Monitoring is set up
- [ ] Backup strategy is in place

---

**Your Hotel RBS OTA application should now be live and accessible!** 🎉
