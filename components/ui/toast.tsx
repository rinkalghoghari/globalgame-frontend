"use client";

export function showToast(message: string, type: "success" | "error" = "success") {
  const toast = document.createElement("div");

  // ICONS
  const icon =
    type === "success"
      ? "✓"
      : "⚠";

  toast.innerHTML = `
    <div style="
      display: flex;
      gap: 10px;
      align-items: center;
    ">
      <span style="
        font-size: 18px;
      ">${icon}</span>
      <span style="
        flex: 1;
        font-size: 14px;
      ">${message}</span>
    </div>
  `;

  // STYLES
  toast.style.position = "fixed";
  toast.style.bottom = "-80px";
  toast.style.right = "20px";
  toast.style.padding = "14px 18px";
  toast.style.minWidth = "240px";
  toast.style.maxWidth = "300px";
  toast.style.borderRadius = "10px";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "500";
  toast.style.color = "#fff";
  toast.style.zIndex = "1111";
  toast.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.25)";
  toast.style.transition = "all 0.4s ease";

  // Toast color variants
  toast.style.background =
    type === "success"
      ? "#10B981" // green
      : "#EF4444"; // red

  document.body.appendChild(toast);

  // Slide-in animation
  setTimeout(() => {
    toast.style.bottom = "20px";
    toast.style.opacity = "1";
  }, 10);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.bottom = "-80px"; // slide out
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
