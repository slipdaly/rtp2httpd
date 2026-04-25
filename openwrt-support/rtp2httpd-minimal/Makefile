include $(TOPDIR)/rules.mk

PKG_NAME:=rtp2httpd-minimal

# Extract version from git tags only if current commit is tagged and clean
RELEASE_VERSION:=$(if $(DUMP),unknown,$(shell \
	cd $(CURDIR)/../.. 2>/dev/null && \
	if git describe --tags --exact-match --match 'v*' 2>/dev/null >/dev/null && \
	   git diff --quiet 2>/dev/null && \
	   git diff --cached --quiet 2>/dev/null; then \
		git describe --tags --exact-match --match 'v*' 2>/dev/null | sed 's/^v//'; \
	else \
		echo "$$(date +%Y%m%d)"; \
	fi))

PKG_VERSION:=$(shell echo "$(RELEASE_VERSION)" | sed 's/-\([a-z]*\)\.\([0-9]*\)/_\1\2/g')
PKG_RELEASE:=1
PKG_MAINTAINER:=Stackie Jia <jsq2627@gmail.com>
PKG_LICENSE:=GPL-2.0-or-later
PKG_LICENSE_FILES:=LICENSE

PKG_FIXUP:=cmake

export RELEASE_VERSION

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) $(CURDIR)/../../CMakeLists.txt $(PKG_BUILD_DIR)/
	$(CP) $(CURDIR)/../../src $(PKG_BUILD_DIR)/
	$(CP) $(CURDIR)/../../scripts $(PKG_BUILD_DIR)/
	$(CP) $(CURDIR)/../../rtp2httpd.conf $(PKG_BUILD_DIR)/
	$(CP) $(CURDIR)/../../LICENSE $(PKG_BUILD_DIR)/ 2>/dev/null || true
	$(CP) $(CURDIR)/../../README.md $(PKG_BUILD_DIR)/ 2>/dev/null || true
endef

define Package/rtp2httpd-minimal
	SECTION:=net
	CATEGORY:=Network
	TITLE:=Multicast RTP/UDP to Unicast HTTP stream converter (minimal)
	URL:=https://github.com/stackia/rtp2httpd
endef

define Package/rtp2httpd-minimal/description
	Minimal build of rtp2httpd focused on direct RTP/UDP to HTTP streaming.
	Web UI, status page, M3U/EPG, RTSP, HTTP proxy, snapshot, FCC and FEC are disabled.
endef

CMAKE_OPTIONS += \
	-DCMAKE_BUILD_TYPE=MinSizeRel \
	-DENABLE_AGGRESSIVE_OPT=OFF \
	-DRTP2HTTPD_MINIMAL_BUILD=ON \
	-DRTP2HTTPD_ENABLE_SIZE_OPTIMIZATIONS=ON

define Package/rtp2httpd-minimal/conffiles
/etc/config/rtp2httpd
/etc/rtp2httpd.conf
endef

define Package/rtp2httpd-minimal/install
	$(INSTALL_DIR) $(1)/etc/init.d $(1)/etc/config $(1)/usr/bin
	$(INSTALL_CONF) ./files/rtp2httpd.conf $(1)/etc/config/rtp2httpd
	$(INSTALL_CONF) $(PKG_BUILD_DIR)/rtp2httpd.conf $(1)/etc
	$(INSTALL_BIN) ./files/rtp2httpd.init $(1)/etc/init.d/rtp2httpd
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/rtp2httpd $(1)/usr/bin
endef

$(eval $(call BuildPackage,rtp2httpd-minimal))
