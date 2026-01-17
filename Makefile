# ============================================
# Docker 镜像构建和推送 Makefile
# 用途: 构建 Next.js 应用并推送到阿里云容器镜像服务
# 使用方法: make [target]
# 示例: 
#   make build          # 构建并推送镜像（使用默认标签 latest）
#   make build TAG=v1.0.0  # 构建并推送镜像（使用指定标签）
#   make build-only     # 仅构建镜像，不推送
#   make push           # 仅推送镜像（需先构建）
# ============================================

# 配置信息
REGISTRY := registry.cn-guangzhou.aliyuncs.com
NAMESPACE := seven-qimu
IMAGE_NAME := qimu_data_front
TAG ?= latest

# 完整的镜像地址
FULL_IMAGE_NAME := $(REGISTRY)/$(NAMESPACE)/$(IMAGE_NAME):$(TAG)

# 颜色定义
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

.PHONY: help build build-only build-mirror push login all clean clean-confirm list test pull info check-login up down restart logs ps

# 默认目标：显示帮助信息
help:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(BLUE)🐳 Docker 镜像构建和推送$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo ""
	@echo "$(GREEN)可用命令:$(NC)"
	@echo "  $(YELLOW)make build [TAG=tag]$(NC)     - 构建并推送镜像（完整流程，默认标签: latest）"
	@echo "  $(YELLOW)make build-only [TAG=tag]$(NC) - 仅构建镜像，不推送"
	@echo "  $(YELLOW)make push [TAG=tag]$(NC)      - 仅推送镜像到阿里云（需先构建）"
	@echo "  $(YELLOW)make login$(NC)               - 登录阿里云容器镜像服务"
	@echo "  $(YELLOW)make list$(NC)                - 列出本地镜像"
	@echo "  $(YELLOW)make test [TAG=tag]$(NC)      - 测试运行镜像"
	@echo "  $(YELLOW)make clean [TAG=tag]$(NC)     - 删除本地镜像"
	@echo "  $(YELLOW)make pull [TAG=tag]$(NC)      - 从阿里云拉取镜像"
	@echo "  $(YELLOW)make build-mirror [TAG=tag]$(NC) - 使用国内镜像源构建（解决网络问题）"
	@echo ""
	@echo "$(GREEN)Docker Compose 命令:$(NC)"
	@echo "  $(YELLOW)make up$(NC)                  - 启动服务（使用远程镜像）"
	@echo "  $(YELLOW)make up-dev$(NC)              - 启动服务（本地构建）"
	@echo "  $(YELLOW)make down$(NC)                - 停止服务"
	@echo "  $(YELLOW)make restart$(NC)             - 重启服务"
	@echo "  $(YELLOW)make logs$(NC)                - 查看服务日志"
	@echo "  $(YELLOW)make ps$(NC)                  - 查看服务状态"
	@echo ""
	@echo "$(GREEN)使用示例:$(NC)"
	@echo "  make build TAG=v1.0.0          # 构建并推送"
	@echo "  make build-only TAG=v1.0.0     # 仅构建"
	@echo "  make push TAG=v1.0.0           # 仅推送"
	@echo ""
	@echo "$(BLUE)当前配置:$(NC)"
	@echo "  镜像地址: $(FULL_IMAGE_NAME)"
	@echo "  标签: $(TAG)"
	@echo ""

# 仅构建 Docker 镜像（不推送）
build-only:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)构建 Docker 镜像（仅构建，不推送）$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "镜像地址: $(FULL_IMAGE_NAME)"
	@echo "平台: linux/amd64"
	@echo "执行命令: docker build --platform linux/amd64 -t $(FULL_IMAGE_NAME) ."
	@echo ""
	docker build --platform linux/amd64 -t $(FULL_IMAGE_NAME) .
	@echo ""
	@echo "$(GREEN)✅ 镜像构建成功！$(NC)"
	@echo ""

# 使用国内镜像源构建（解决网络连接问题）
build-mirror:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)使用国内镜像源构建 Docker 镜像$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "镜像地址: $(FULL_IMAGE_NAME)"
	@echo "平台: linux/amd64"
	@echo "使用镜像源: 阿里云"
	@echo "执行命令: docker build -f Dockerfile.mirror --platform linux/amd64 -t $(FULL_IMAGE_NAME) ."
	@echo ""
	@if [ ! -f Dockerfile.mirror ]; then \
		echo "$(RED)❌ Dockerfile.mirror 文件不存在！$(NC)"; \
		exit 1; \
	fi
	docker build -f Dockerfile.mirror --platform linux/amd64 -t $(FULL_IMAGE_NAME) .
	@echo ""
	@echo "$(GREEN)✅ 镜像构建成功！$(NC)"
	@echo ""

# 构建并推送 Docker 镜像（完整流程）
build: build-only push
	@echo ""
	@echo "$(GREEN)==========================================$(NC)"
	@echo "$(GREEN)🎉 构建和推送完成！$(NC)"
	@echo "$(GREEN)==========================================$(NC)"
	@echo "镜像地址: $(FULL_IMAGE_NAME)"
	@echo ""

# 登录阿里云容器镜像服务
login:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)登录阿里云容器镜像服务$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "执行命令: docker login $(REGISTRY)"
	@echo ""
	@echo "$(YELLOW)提示:$(NC)"
	@echo "  - 用户名: 你的阿里云账号用户名"
	@echo "  - 密码: 你的阿里云账号密码（或访问凭证密码）"
	@echo ""
	docker login $(REGISTRY)
	@echo ""
	@echo "$(GREEN)✅ 登录成功！$(NC)"
	@echo ""

# 推送镜像到阿里云
push: check-login
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)步骤 2: 推送镜像到阿里云容器镜像服务$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "镜像地址: $(FULL_IMAGE_NAME)"
	@echo "执行命令: docker push $(FULL_IMAGE_NAME)"
	@echo ""
	docker push $(FULL_IMAGE_NAME)
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(GREEN)✅ 镜像推送成功！$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "镜像地址: $(FULL_IMAGE_NAME)"
	@echo ""
	@echo "使用以下命令拉取镜像："
	@echo "$(GREEN)docker pull $(FULL_IMAGE_NAME)$(NC)"
	@echo ""

# 检查是否已登录（内部目标）
check-login:
	@if ! docker info > /dev/null 2>&1; then \
		echo "$(RED)❌ Docker 未运行或无法访问$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)检查登录状态...$(NC)"

# 完整流程：构建 + 推送（与 build 相同，保留用于兼容性）
all: build

# 列出本地镜像
list:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)本地 Docker 镜像列表$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@docker images | grep $(IMAGE_NAME) || echo "$(YELLOW)未找到相关镜像$(NC)"
	@echo ""

# 测试运行镜像
test:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)测试运行镜像$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "镜像: $(FULL_IMAGE_NAME)"
	@echo "端口: 3000"
	@echo "平台: linux/amd64"
	@echo ""
	@echo "$(YELLOW)提示: 按 Ctrl+C 停止容器$(NC)"
	@echo ""
	docker run --platform linux/amd64 -p 3000:3000 $(FULL_IMAGE_NAME)

# 删除本地镜像
clean:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)删除本地镜像$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "镜像: $(FULL_IMAGE_NAME)"
	@echo ""
	@echo "$(YELLOW)提示: 如需确认删除，请使用 make clean-confirm$(NC)"
	@docker rmi $(FULL_IMAGE_NAME) || echo "$(YELLOW)镜像不存在或已被删除$(NC)"
	@echo ""
	@echo "$(GREEN)✅ 删除完成！$(NC)"
	@echo ""

# 确认删除（带确认提示）
clean-confirm:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)删除本地镜像（需确认）$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "镜像: $(FULL_IMAGE_NAME)"
	@echo ""
	@bash -c 'read -p "确认删除？(y/n): " confirm && [ "$$confirm" = "y" ]' || exit 1
	@docker rmi $(FULL_IMAGE_NAME) || echo "$(YELLOW)镜像不存在或已被删除$(NC)"
	@echo ""
	@echo "$(GREEN)✅ 删除完成！$(NC)"
	@echo ""

# 从阿里云拉取镜像
pull:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)从阿里云拉取镜像$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "镜像地址: $(FULL_IMAGE_NAME)"
	@echo "执行命令: docker pull $(FULL_IMAGE_NAME)"
	@echo ""
	docker pull $(FULL_IMAGE_NAME)
	@echo ""
	@echo "$(GREEN)✅ 拉取成功！$(NC)"
	@echo ""

# 显示镜像信息
info:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)镜像信息$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "注册表: $(REGISTRY)"
	@echo "命名空间: $(NAMESPACE)"
	@echo "镜像名称: $(IMAGE_NAME)"
	@echo "标签: $(TAG)"
	@echo "完整地址: $(FULL_IMAGE_NAME)"
	@echo ""

# ============================================
# Docker Compose 命令
# ============================================

# 启动服务（使用远程镜像）
up:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)启动 Docker Compose 服务$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo "使用镜像: $(FULL_IMAGE_NAME)"
	@echo ""
	docker-compose up -d
	@echo ""
	@echo "$(GREEN)✅ 服务已启动！$(NC)"
	@echo "访问地址: http://localhost:3000"
	@echo ""

# 启动服务（本地构建）
up-dev:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)启动 Docker Compose 服务（本地构建）$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo ""
	@echo "$(YELLOW)注意: docker-compose.dev.yml 文件已删除，请使用 make up 或直接构建镜像$(NC)"
	@echo ""

# 停止服务
down:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)停止 Docker Compose 服务$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo ""
	docker-compose down
	@echo ""
	@echo "$(GREEN)✅ 服务已停止！$(NC)"
	@echo ""

# 重启服务
restart:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)重启 Docker Compose 服务$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo ""
	docker-compose restart
	@echo ""
	@echo "$(GREEN)✅ 服务已重启！$(NC)"
	@echo ""

# 查看服务日志
logs:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)Docker Compose 服务日志$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo ""
	docker-compose logs -f

# 查看服务状态
ps:
	@echo ""
	@echo "$(BLUE)==========================================$(NC)"
	@echo "$(YELLOW)Docker Compose 服务状态$(NC)"
	@echo "$(BLUE)==========================================$(NC)"
	@echo ""
	docker-compose ps
	@echo ""

