# Azure 静态网站部署指南

## 方案选择：Azure Static Web Apps（免费）

Azure Static Web Apps 是最适合此项目的方案：
- ✅ **完全免费**（学生订阅无额外费用）
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 支持自定义域名

---

## 部署步骤

### 方式一：通过 GitHub 自动部署（推荐）

#### 1. 将代码推送到 GitHub

```bash
cd e:\project\learn_spell
git init
git add .
git commit -m "初始版本"
git branch -M main
git remote add origin https://github.com/你的用户名/learn-pinyin.git
git push -u origin main
```

#### 2. 创建 Azure Static Web Apps

1. 登录 [Azure Portal](https://portal.azure.com)
2. 搜索并选择 **Static Web Apps**
3. 点击 **创建**
4. 填写配置：
   - **订阅**：Azure for Students
   - **资源组**：新建，如 `learn-pinyin-rg`
   - **名称**：如 `pinyin-learning`
   - **计划类型**：Free
   - **区域**：East Asia（亚洲用户更快）
5. 选择 **GitHub** 作为源
6. 授权并选择你的仓库和分支
7. 构建详细信息：
   - **应用位置**：`/`
   - **API 位置**：留空
   - **输出位置**：留空
8. 点击 **审阅 + 创建** → **创建**

#### 3. 等待部署完成

Azure 会自动设置 GitHub Actions。几分钟后，访问分配的 URL（如 `https://xxx.azurestaticapps.net`）即可使用！

---

### 方式二：手动 ZIP 上传

如果不想使用 GitHub：

#### 1. 安装 Azure CLI

```powershell
winget install Microsoft.AzureCLI
```

#### 2. 登录 Azure

```powershell
az login
```

#### 3. 创建并部署

```powershell
# 创建资源组
az group create --name learn-pinyin-rg --location eastasia

# 创建静态网站（会返回部署 token）
az staticwebapp create --name pinyin-learning --resource-group learn-pinyin-rg --location eastasia

# 打包并部署
cd e:\project\learn_spell
Compress-Archive -Path * -DestinationPath deploy.zip
az staticwebapp upload --name pinyin-learning --resource-group learn-pinyin-rg --source deploy.zip
```

---

## 获取访问链接

部署完成后，在 Azure Portal 的 Static Web Apps 资源页面找到 **URL**，格式类似：

```
https://pinyin-learning-xxxxx.azurestaticapps.net
```

分享此链接即可在手机/平板上访问！

---

## 可选：绑定自定义域名

如果你有自己的域名：
1. 在 Static Web Apps 设置中选择 **自定义域**
2. 添加域名并按提示配置 DNS CNAME 记录
3. Azure 会自动签发 SSL 证书
