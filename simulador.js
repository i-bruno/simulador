function simularCredito(saldo, tasaAnual, cuota) {

    const tasaMensual = tasaAnual / 12 / 100;

    let interesTotal = 0;
    let cuotas = 0;

    while (saldo > 0) {

        let interes = saldo * tasaMensual;
        let capital = cuota - interes;

        saldo -= capital;

        interesTotal += interes;
        cuotas++;

        // evitar errores de redondeo
        if (cuotas > 1000) break;
    }

    return {
        interesTotal: interesTotal,
        cuotas: cuotas
    };
}


function calcularPrepago(saldo, tasa, cuota, prepago) {

    const escenarioNormal = simularCredito(saldo, tasa, cuota);

    const saldoNuevo = saldo - prepago;

    const escenarioPrepago = simularCredito(saldoNuevo, tasa, cuota);

    const ahorroIntereses = escenarioNormal.interesTotal - escenarioPrepago.interesTotal;

    const cuotasAhorradas = escenarioNormal.cuotas - escenarioPrepago.cuotas;

    return {
        capitalReducido: prepago,
        interesNormal: escenarioNormal.interesTotal,
        interesConPrepago: escenarioPrepago.interesTotal,
        interesAhorrado: ahorroIntereses,
        cuotasAhorradas: cuotasAhorradas
    };
}


function simular() {

    const saldo = parseFloat(document.getElementById("saldo").value);
    const tasa = parseFloat(document.getElementById("tasa").value);
    const cuota = parseFloat(document.getElementById("cuota").value);
    const prepago = parseFloat(document.getElementById("prepago").value);

    const resultado = calcularPrepago(saldo, tasa, cuota, prepago);

    document.getElementById("resultado").innerHTML = `
        Capital precancelado: ${resultado.capitalReducido.toFixed(2)} UVA <br><br>

        Interés restante sin prepago: ${resultado.interesNormal.toFixed(2)} UVA <br>
        Interés restante con prepago: ${resultado.interesConPrepago.toFixed(2)} UVA <br><br>

        Ahorro de intereses: <b>${resultado.interesAhorrado.toFixed(2)} UVA</b> <br><br>

        Cuotas eliminadas: ${resultado.cuotasAhorradas}
    `;
}
// function calcularCuota(capital, tasaAnual, cuotas) {

//     const tasaMensual = tasaAnual / 12 / 100;

//     const cuota = capital *
//         (tasaMensual * Math.pow(1 + tasaMensual, cuotas)) /
//         (Math.pow(1 + tasaMensual, cuotas) - 1);

//     return cuota;
// }

// function generarTabla(capital, tasaAnual, cuotas){

//     const tasaMensual = tasaAnual / 12 / 100;
//     const cuota = calcularCuota(capital, tasaAnual, cuotas);

//     let saldo = capital;
//     let tabla = [];

//     for(let i = 1; i <= cuotas; i++){

//         let interes = saldo * tasaMensual;
//         let capitalPagado = cuota - interes;

//         saldo -= capitalPagado;

//         tabla.push({
//             cuota: i,
//             interes: interes,
//             capital: capitalPagado,
//             saldo: saldo
//         });
//     }

//     return tabla;
// }

// function simular(){

//     const saldo = parseFloat(document.getElementById("saldo").value);
//     const tasa = parseFloat(document.getElementById("tasa").value);
//     const cuotas = parseInt(document.getElementById("cuotas").value);
//     const prepago = parseFloat(document.getElementById("prepago").value);

//     const saldoNuevo = saldo - prepago;

//     const cuotaActual = calcularCuota(saldo, tasa, cuotas);
//     const cuotaNueva = calcularCuota(saldoNuevo, tasa, cuotas);

//     document.getElementById("resultado").innerHTML =
//     `
//     Cuota actual: ${cuotaActual.toFixed(2)} UVA <br>
//     Nueva cuota: ${cuotaNueva.toFixed(2)} UVA <br>
//     Nuevo saldo: ${saldoNuevo.toFixed(2)} UVA
//     `;
// }