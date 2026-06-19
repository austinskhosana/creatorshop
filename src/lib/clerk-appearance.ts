// Shared Clerk styling so SignIn/SignUp match the rest of the app's
// rounded-xl, lime-accent, layered-shadow design language.
export const clerkAppearance = {
  variables: {
    fontFamily: "'Satoshi', sans-serif",
    colorPrimary: "#181818",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "mx-auto",
    card: "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)] border border-black/[0.06] rounded-2xl",
    headerSubtitle: "text-gray-500",
    formButtonPrimary:
      "bg-[#A3FF38] text-black border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] hover:brightness-95 normal-case text-sm font-semibold transition-[filter] duration-[160ms]",
    socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50 transition-colors duration-[160ms]",
    formFieldInput:
      "border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-[border-color,box-shadow] duration-[160ms]",
    footerActionLink: "text-gray-900 hover:text-gray-700 font-medium",
  },
};
