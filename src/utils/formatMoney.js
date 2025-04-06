export const formatMoney = (amount) => {
    const money =  new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
    return money.replace("₫", "VND").replace(",", ".").trim();
}