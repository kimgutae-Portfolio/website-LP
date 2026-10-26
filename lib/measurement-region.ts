import { BlockList, isIP } from "node:net";

// Cloudflare's published proxy networks, checked 2026-10-26:
// https://www.cloudflare.com/ips-v4  https://www.cloudflare.com/ips-v6
// A proxy's own country is NOT the visitor's country. Only accept CF-IPCountry
// when Vercel's connection-IP header proves the request came through Cloudflare.
const cloudflare = new BlockList();
for (const subnet of [
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
  "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
  "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
  "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
  "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
  "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32",
]) {
  const [address, prefix] = subnet.split("/");
  cloudflare.addSubnet(address, Number(prefix), isIP(address) === 6 ? "ipv6" : "ipv4");
}

export function japanMeasurementEligibility(headers: Headers): { eligible: boolean; reason: string } {
  const remote = headers.get("x-vercel-forwarded-for")?.trim() ?? "";
  const family = isIP(remote);
  const trustedCloudflare = family !== 0 && cloudflare.check(remote, family === 6 ? "ipv6" : "ipv4");
  const proxyHeaders = ["cf-ray", "cf-ipcountry", "cf-connecting-ip"].some(name => headers.has(name));
  if (proxyHeaders && !trustedCloudflare) return { eligible: false, reason: "unverified-location" };
  const country = trustedCloudflare ? headers.get("cf-ipcountry") : headers.get("x-vercel-ip-country");
  if (!country || !/^[A-Z]{2}$/.test(country) || country === "XX") return { eligible: false, reason: "unverified-location" };
  return { eligible: country === "JP", reason: country === "JP" ? "japan" : "outside-japan" };
}
