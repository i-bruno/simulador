function calcularCuota(capital, tasaAnual, cuotas) {

    const tasaMensual = tasaAnual / 12 / 100;

    const cuota = capital *
        (tasaMensual * Math.pow(1 + tasaMensual, cuotas)) /
        (Math.pow(1 + tasaMensual, cuotas) - 1);

    return cuota;
}

function generarTabla(capital, tasaAnual, cuotas){

    const tasaMensual = tasaAnual / 12 / 100;
    const cuota = calcularCuota(capital, tasaAnual, cuotas);

    let saldo = capital;
    let tabla = [];

    for(let i = 1; i <= cuotas; i++){

        let interes = saldo * tasaMensual;
        let capitalPagado = cuota - interes;

        saldo -= capitalPagado;

        tabla.push({
            cuota: i,
            interes: interes,
            capital: capitalPagado,
            saldo: saldo
        });
    }

    return tabla;
}

function simular(){

    const saldo = parseFloat(document.getElementById("saldo").value);
    const tasa = parseFloat(document.getElementById("tasa").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const prepago = parseFloat(document.getElementById("prepago").value);

    const saldoNuevo = saldo - prepago;

    const cuotaActual = calcularCuota(saldo, tasa, cuotas);
    const cuotaNueva = calcularCuota(saldoNuevo, tasa, cuotas);

    document.getElementById("resultado").innerHTML =
    `
    Cuota actual: ${cuotaActual.toFixed(2)} UVA <br>
    Nueva cuota: ${cuotaNueva.toFixed(2)} UVA <br>
    Nuevo saldo: ${saldoNuevo.toFixed(2)} UVA
    `;
}