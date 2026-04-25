"use strict";
"require form";
"require view";
"require tools.widgets as widgets";
"require fs";
"require uci";

return view.extend({
  render: function () {
    var m, s, o;

    m = new form.Map(
      "rtp2httpd",
      _("rtp2httpd"),
      _(
        "Minimal rtp2httpd build for direct RTP/UDP to HTTP streaming. Unsupported features such as status UI, player, M3U/EPG, RTSP, HTTP proxy, snapshot, FCC and FEC are intentionally hidden."
      )
    );

    s = m.section(form.TypedSection, "rtp2httpd");
    s.anonymous = true;
    s.addremove = true;

    s.tab("basic", _("Basic Settings"));
    s.tab("network", _("Network & Performance"));
    s.tab("advanced", _("Access & Advanced"));

    o = s.taboption("basic", form.Flag, "disabled", _("Enabled"));
    o.enabled = "0";
    o.disabled = "1";
    o.default = o.enabled;
    o.rmempty = false;

    o = s.taboption(
      "basic",
      form.Flag,
      "respawn",
      _("Respawn"),
      _("Auto restart after crash")
    );
    o.default = "1";

    o = s.taboption(
      "basic",
      form.Flag,
      "use_config_file",
      _("Use Config File"),
      _("Use config file instead of individual options")
    );
    o.default = "0";

    o = s.taboption(
      "basic",
      form.TextValue,
      "config_file_content",
      _("Config File Content"),
      _("Edit the content of /etc/rtp2httpd.conf")
    );
    o.rows = 28;
    o.cols = 80;
    o.monospace = true;
    o.depends("use_config_file", "1");
    o.load = function () {
      return fs
        .read("/etc/rtp2httpd.conf")
        .then(function (content) {
          return content || "";
        })
        .catch(function () {
          return "";
        });
    };
    o.write = function (section_id, value) {
      return fs.write("/etc/rtp2httpd.conf", value || "").then(function () {
        return uci.set(
          "rtp2httpd",
          section_id,
          "config_update_time",
          Date.now().toString()
        );
      });
    };

    o = s.taboption("basic", form.Value, "port", _("Port"));
    o.datatype = "port";
    o.placeholder = "5140";
    o.depends("use_config_file", "0");

    o = s.taboption("basic", form.ListValue, "verbose", _("Logging level"));
    o.value("0", "Fatal");
    o.value("1", "Error");
    o.value("2", "Warn");
    o.value("3", "Info");
    o.value("4", "Debug");
    o.default = "1";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "network",
      widgets.DeviceSelect,
      "upstream_interface",
      _("Upstream Interface"),
      _("Default interface for upstream traffic. Leave empty to use routing table.")
    );
    o.noaliases = true;
    o.datatype = "interface";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "network",
      widgets.DeviceSelect,
      "upstream_interface_multicast",
      _("Upstream Multicast Interface"),
      _("Interface to use for multicast RTP/UDP upstream traffic (default: use routing table)")
    );
    o.noaliases = true;
    o.datatype = "interface";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "network",
      form.Value,
      "maxclients",
      _("Max clients allowed")
    );
    o.datatype = "range(1, 5000)";
    o.placeholder = "5";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "network",
      form.Value,
      "workers",
      _("Workers"),
      _("Number of worker processes. Set to 1 for resource-constrained devices.")
    );
    o.datatype = "range(1, 64)";
    o.placeholder = "1";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "network",
      form.Value,
      "buffer_pool_max_size",
      _("Buffer Pool Max Size"),
      _("Maximum number of buffers in zero-copy pool. Each buffer is 1536 bytes.")
    );
    o.datatype = "range(1024, 1048576)";
    o.placeholder = "16384";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "network",
      form.Value,
      "udp_rcvbuf_size",
      _("UDP Receive Buffer Size"),
      _("UDP socket receive buffer size in bytes for multicast traffic.")
    );
    o.datatype = "range(65536, 16777216)";
    o.placeholder = "524288";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "network",
      form.Value,
      "mcast_rejoin_interval",
      _("Multicast Rejoin Interval"),
      _("Periodic multicast rejoin interval in seconds (0=disabled, default 0).")
    );
    o.datatype = "range(0, 86400)";
    o.placeholder = "0";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "network",
      form.Flag,
      "zerocopy_on_send",
      _("Zero-Copy on Send"),
      _("Enable zero-copy send with MSG_ZEROCOPY for better performance.")
    );
    o.default = "0";
    o.depends("use_config_file", "0");

    o = s.taboption(
      "advanced",
      form.Value,
      "hostname",
      _("Hostname"),
      _("When configured, HTTP Host header must match this value to allow access.")
    );
    o.depends("use_config_file", "0");

    o = s.taboption(
      "advanced",
      form.Value,
      "r2h_token",
      _("R2H Token"),
      _("If set, all HTTP requests must include matching r2h-token query parameter.")
    );
    o.depends("use_config_file", "0");

    o = s.taboption(
      "advanced",
      form.Value,
      "cors_allow_origin",
      _("CORS Allow Origin"),
      _("Set Access-Control-Allow-Origin header to enable CORS. Leave empty to disable.")
    );
    o.depends("use_config_file", "0");

    o = s.taboption(
      "advanced",
      form.Flag,
      "xff",
      _("X-Forwarded-For"),
      _("Use X-Forwarded-For and related proxy headers when running behind a reverse proxy.")
    );
    o.default = "0";
    o.depends("use_config_file", "0");

    return m.render();
  },
});
