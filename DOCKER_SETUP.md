# Docker 镜像加速配置指南

如果遇到 Docker Hub 连接问题（如 `failed to fetch oauth token`），可以使用以下方法解决：

## 方法一：配置 Docker 镜像加速器（推荐）

### macOS / Linux

1. 编辑或创建 Docker daemon 配置文件：

**macOS (Docker Desktop):**
- 打开 Docker Desktop
- 进入 Settings > Docker Engine
- 添加以下配置：
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```
- 点击 "Apply & Restart"

**Linux:**
```bash
sudo mkdir -p /etc/docker
sudo cp docker-daemon.json /etc/docker/daemon.json
sudo systemctl restart docker
```

### 验证配置

```bash
docker info | grep -A 10 "Registry Mirrors"
```

## 方法二：使用国内镜像源构建

项目已提供 `Dockerfile.mirror`，使用阿里云镜像源：

```bash
# 使用镜像源版本构建
docker build -f Dockerfile.mirror --platform linux/amd64 -t <image-name> .

# 或使用 Makefile
make build-only  # 会自动使用配置的镜像加速器
```

## 方法三：临时使用代理

如果以上方法都不行，可以配置代理：

```bash
# 设置代理环境变量
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port

# 然后构建
docker build --platform linux/amd64 -t <image-name> .
```

## 常用国内镜像源

- 中科大镜像: `https://docker.mirrors.ustc.edu.cn`
- 网易镜像: `https://hub-mirror.c.163.com`
- 百度云镜像: `https://mirror.baidubce.com`
- 阿里云镜像: `https://registry.cn-hangzhou.aliyuncs.com`

## 验证网络连接

```bash
# 测试 Docker Hub 连接
curl -I https://registry-1.docker.io/v2/

# 测试镜像源连接
curl -I https://docker.mirrors.ustc.edu.cn/v2/
```

