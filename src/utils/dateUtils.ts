export const obtenerNombreMes = (mes: number): string => {
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
return meses[mes - 1] || "Mes inválido";
};