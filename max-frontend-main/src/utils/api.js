@@
-export const getApiBaseUrl = () => {
-  const configuredBaseUrl = normalizeApiBaseUrl(
-    process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL
-  );
-  if (configuredBaseUrl) return configuredBaseUrl;
-
-  if (typeof window !== 'undefined') {
-    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
-    if (isLocalhost) return 'http://localhost:5000/api';
-  }
-
-  return '/api';
-};
+export const getApiBaseUrl = () => {
+  const configuredBaseUrl = normalizeApiBaseUrl(
+    process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL
+  );
+  if (configuredBaseUrl) return configuredBaseUrl;
+
+  if (typeof window !== 'undefined') {
+    // Use same origin + /api to avoid accidentally calling a frontend static route
+    return `${window.location.origin.replace(/\/$/, '')}/api`;
+  }
+
+  return '/api';
+};
