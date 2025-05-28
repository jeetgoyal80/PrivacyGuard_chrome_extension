chrome.webNavigation.onCompleted.addListener(async (details) => {
  try {
    const url = new URL(details.url);
    const origin = url.origin;
    const key = `logged_${origin}`;

    // Fetch needed data from storage at once
    const result = await chrome.storage.local.get([key, "authToken", "consents"]);
    const alreadyLogged = result[key];
    const token = result.authToken || "";
    const existingConsents = result.consents || [];

    const pagePermissions = await getPagePermissions();
    console.log("[PERMISSIONS]", pagePermissions);

    // Extract only granted permissions as array of strings
    const grantedPermissions = Object.entries(pagePermissions)
      .filter(([_, state]) => state === "granted")
      .map(([perm]) => perm);

    // 1) Log new granted permissions if not logged before and there are granted perms
    if (!alreadyLogged && grantedPermissions.length > 0) {
      const response = await fetch("http://localhost:8000/api/consent/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service: origin,
          dataShared: grantedPermissions.map((p) => ({ permission: p, granted: true })),
          consentGiven: true,
        }),
      });

      if (response.ok) {
        console.log(`[POST] Logged new origin: ${origin}`);
        await chrome.storage.local.set({ [key]: true });
      } else {
        console.error("Failed to log consent:", await response.text());
      }
    }

    // 2) Handle revocations: check existing consents and if previously granted permission is now denied
    for (const consent of existingConsents) {
      if (consent.service === origin) {
        for (const permissionEntry of consent.dataShared) {
          const perm = permissionEntry.permission;
          const currentState = pagePermissions[perm];
          // If permission was previously granted but now denied, update backend
          if (permissionEntry.granted && currentState === "denied") {
            const updateRes = await fetch(
              `http://localhost:8000/api/consent/update/${consent._id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                // Update permission state to revoked for this permission only
                body: JSON.stringify({
                  service: origin,
                  dataShared: [{ permission: perm, granted: false }],
                  consentGiven: false,
                }),
              }
            );
            if (updateRes.ok) {
              console.log(`[PUT] Revoked permission: ${perm} for ${origin}`);
            } else {
              console.error(`[PUT] Failed to revoke: ${await updateRes.text()}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Navigation error:", error);
  }
}, { url: [{ schemes: ["http", "https"] }] });

// Helper: get current page permissions states
async function getPagePermissions() {
  const supportedPermissions = ["camera", "microphone", "geolocation", "notifications"];
  const permissions = {};

  for (const perm of supportedPermissions) {
    try {
      const status = await navigator.permissions.query({ name: perm });
      permissions[perm] = status.state;
    } catch (e) {
      console.warn(`[PERM] ${perm} not supported`);
    }
  }

  return permissions;
}
