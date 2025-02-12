export const getDisplayDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDateOnly = (d) => d.toISOString().split("T")[0];

    if (formatDateOnly(date) === formatDateOnly(today)) return "Today";
    if (formatDateOnly(date) === formatDateOnly(tomorrow)) return "Tomorrow";

    return formatDate(dateString);
};


export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/(\d{2}) (\w{3}) (\d{4})/, "$1 $2, $3");
};